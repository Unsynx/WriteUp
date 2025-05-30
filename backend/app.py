from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import datetime
import json
import os
from openai import OpenAI
import dotenv


app = Flask(__name__)

dotenv.load_dotenv()

# Configuration for JWT
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Replace with a secure secret in production
CORS(app, support_credentials=True)
jwt = JWTManager(app)

# Setup MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["your_db_name"]
users_collection = db["users"]
challenges_collection = db["challenges"]
progress_collection = db["progress"]  # New collection for progress tracking

# Set a folder for uploaded profile pictures
app.config['UPLOAD_FOLDER'] = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    user_id = get_jwt_identity()
    if 'profilePicture' not in request.files:
        return jsonify({"msg": "No file part in the request"}), 400
    file = request.files['profilePicture']
    if file.filename == '':
        return jsonify({"msg": "No file selected"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Ensure the upload folder exists
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        # Here, we assume the file is served statically via a URL like /uploads/<filename>
        picture_url = f"/uploads/{filename}"
        # Update the user's document to include the new profile picture URL
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"picture": picture_url}}
        )
        return jsonify({"pictureUrl": picture_url}), 200
    else:
        return jsonify({"msg": "File type not allowed"}), 400

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return jsonify({
            "username": user["username"],
            "email": user["email"],
            "elo_history": user["elo_history"],
            "badges": user["badges"]
        }), 200
    return jsonify({"msg": "User not found"}), 404

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    # Hash the password
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert new user into the database
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_pw,
        "elo_history": [],
        "badges": [],
        "complete": []
    })
    return jsonify({"msg": "User created successfully"}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        # Generate a JWT token
        access_token = create_access_token(identity=str(user['_id']), expires_delta=datetime.timedelta(days=1))
        return jsonify({
            "access_token": access_token,
            "username": user["username"],
            "email": user["email"]
        }), 200

    return jsonify({"msg": "Invalid credentials"}), 401


@app.route('/api/challenges', methods=['POST'])
def create_challenge():
    data = request.get_json()
    title = data.get('title')
    tags = data.get('tags')  # Expect a list of tags
    difficulty = data.get('difficulty')  # Could be a string like "Easy", "Medium", "Hard"
    essay_prompt = data.get('essay_prompt')

    # Validate required fields
    if not title or not tags or difficulty is None or not essay_prompt:
        return jsonify({"msg": "Missing required fields"}), 400

    challenge = {
        "title": title,
        "tags": tags,
        "difficulty": difficulty,
        "essay_prompt": essay_prompt,
        "created_at": datetime.datetime.now(datetime.timezone.utc),
        "scores": []
    }

    result = challenges_collection.insert_one(challenge)
    return jsonify({"msg": "Challenge created successfully", "id": str(result.inserted_id)}), 201


@app.route('/api/challenges', methods=['GET'])
def search_challenges():
    # Get search parameters and trim extra spaces.
    title = request.args.get("title", "").strip()
    tags_param = request.args.get("tags", "").strip()  # Expect a comma-separated string.
    difficulty = request.args.get("difficulty", "").strip()

    # Build an array of conditions to be combined with $and.
    and_clauses = []

    # Title filter: Case-insensitive partial match.
    if title:
        and_clauses.append({"title": {"$regex": title, "$options": "i"}})

    # Difficulty filter: Exact match.
    if difficulty:
        and_clauses.append({"difficulty": difficulty})

    # Tags filter: Only challenges that have ALL provided tags.
    if tags_param:
        # Convert the comma-separated string into a list.
        tags_list = [tag.strip() for tag in tags_param.split(",") if tag.strip()]
        if tags_list:
            # Using $all ensures that every tag in tags_list is present in the challenge's tags field.
            and_clauses.append({"tags": {"$all": tags_list}})

    # If no filters were specified, the query remains empty (matches all challenges).
    final_query = {"$and": and_clauses} if and_clauses else {}

    # Query the challenges collection.
    challenges = list(challenges_collection.find(final_query))

    # Convert ObjectIds to strings for JSON serialization.
    for challenge in challenges:
        challenge["_id"] = str(challenge["_id"])

    return jsonify(challenges), 200

@app.route('/api/completed', methods=['GET'])
@jwt_required()
def get_completed_challenges():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    result = list(map(str, user["complete"]))

    if user:
        return jsonify({"complete": result}), 200
    return jsonify({"msg": "User not found"}), 404


@app.route('/api/complete_challenge', methods=['POST'])
@jwt_required()
def add_elo_point():
    data = request.get_json()
    elo_point = data.get("elo")
    challenge_id = data.get("challenge_id")

    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    elo = list(user.get("elo_history"))
    elo.append(elo_point)
    if len(elo) > 10:
        elo.pop(0)

    complete = list(user.get("complete"))
    complete.append(ObjectId(challenge_id))

    challenge = challenges_collection.find_one({"_id": ObjectId(challenge_id)})
    scores = challenge.get("scores")
    if scores is None:
        scores = []
    else:
        scores = list(scores)

    scores.append(elo_point)

    challenges_collection.update_one({"_id": ObjectId(challenge_id)},{"$set": {"scores": scores}})

    if user:
        users_collection.update_one({"_id": ObjectId(user_id)},
            {"$set": {"elo_history": elo, "complete": complete}})
        return jsonify({"msg": "Challenge Completion Updated", "scores": scores}), 200
    return jsonify({"msg": "User not found"}), 404

@app.route('/api/writeup', methods=['POST'])
@jwt_required()
def getHighlights():
    data = request.get_json()
    essay = data.get("text")
    prompt = data.get("prompt")

    if not essay:
        return jsonify({"msg": "No essay provided"}), 400
    query = f"""Here's an essay for review. Please provide feedback:

    For the output, I need the following in json format:
    1- "highlights": 
        I want at most 3 target highlights per paragraph to give feedback on.
        Focus on selecting complete sentences or clauses over small chunks of text.
        The selected sections of text should not be directly after another section, and should be spaced out across the entire text. 
        They CANNOT overlap each other. Do NOT return empty quotes.
        You can give them to me as a range of characters.
        I also want for each highlight range a comment that explains what you want to give feedback on exactly in this highlight range.
    2- "elo": I want a score of the essay based on the parameters from 0 - 100.
    3- "future": I want a prose style recommendation for how to improve in the future. 
    I want this ready for me to store in a json variable right away with these names in python. Don't output anything other than the json tag.

    Essay:
    {essay}

    Please ensure the feedback is constructive and provides actionable insights for improvement.
    Here are the criteria the essay must met:
    {prompt}
    """
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content":query
            }
        ]
    )

    output = completion.choices[0].message.content
    output = output[7:-3]
    try:
        parsed_output = json.loads(output)
        return parsed_output
    except json.JSONDecodeError as e:
        return jsonify({"msg": "Failed to parse output from OpenAI", "error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
