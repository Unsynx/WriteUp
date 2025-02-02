from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import datetime

app = Flask(__name__)

# Configuration for JWT
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Replace with a secure secret in production
CORS(app)
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
            "picture": user.get("picture", None),  # Return the profile picture URL if available
            "rank": user.get("rank", "Newbie"),
            "badges": user.get("badges", [])
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
        "initial_placement": "false"
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
            "email": user["email"],
            "initial_placement": user["initial_placement"]
        }), 200

    return jsonify({"msg": "Invalid credentials"}), 401


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return jsonify({
            "username": user["username"],
            "email": user["email"]
        }), 200
    return jsonify({"msg": "User not found"}), 404


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
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }

    result = challenges_collection.insert_one(challenge)
    return jsonify({"msg": "Challenge created successfully", "id": str(result.inserted_id)}), 201


@app.route('/api/challenges', methods=['GET'])
def search_challenges():
    title = request.args.get("title")
    tags = request.args.get("tags")  # Expect a comma-separated string
    difficulty = request.args.get("difficulty")

    query = {}

    if title:
        # Use regex for partial, case-insensitive matching
        query["title"] = {"$regex": title, "$options": "i"}
    if tags:
        # Split the string into a list, trimming extra spaces
        tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
        if tags_list:
            query["tags"] = {"$in": tags_list}
    if difficulty:
        query["difficulty"] = difficulty

    challenges = list(challenges_collection.find(query))
    # Convert ObjectId to string for JSON serialization
    for challenge in challenges:
        challenge["_id"] = str(challenge["_id"])
    return jsonify(challenges), 200


# ===========================
# Progress Dashboard Endpoints
# ===========================

@app.route('/api/progress', methods=['GET'])
@jwt_required()
def get_progress():
    """
    Returns a Chart.js-compatible object for the authenticated user's progress.
    {
        "labels": ["Week 1", "Week 2", ...],
        "datasets": [
            {
                "label": "My Metric",
                "data": [50, 65, ...],
                "borderColor": "#03a9f4",
                "backgroundColor": "rgba(3, 169, 244, 0.2)",
                "tension": 0.3
            }
        ]
    }
    """
    user_id = get_jwt_identity()
    doc = progress_collection.find_one({"user_id": user_id})
    if not doc:
        # Return empty chart if no progress document is found for this user
        return jsonify({
            "labels": [],
            "datasets": []
        }), 200

    # Example for a single metric (like "Vocabulary Growth")
    chart_data = {
        "labels": doc["labels"],    # e.g. ["Week 1", "Week 2", ...]
        "datasets": [
            {
                "label": "Vocabulary Growth",  # You can customize or store multiple metrics
                "data": doc["dataPoints"],     # e.g. [50, 65, 80, 95]
                "borderColor": "#03a9f4",
                "backgroundColor": "rgba(3, 169, 244, 0.2)",
                "tension": 0.3
            }
        ]
    }
    return jsonify(chart_data), 200


@app.route('/api/progress/add', methods=['POST'])
@jwt_required()
def add_progress_data():
    """
    Expects JSON: { "label": "Week 5", "value": 90 }
    Appends the label/value to the user's data.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    label = data.get("label")
    value = data.get("value")

    if not label or value is None:
        return jsonify({"msg": "Invalid data"}), 400

    # Find or create a doc for this user
    doc = progress_collection.find_one({"user_id": user_id})
    if not doc:
        # Create a new document for the user
        new_doc = {
            "user_id": user_id,
            "labels": [label],
            "dataPoints": [value]
        }
        progress_collection.insert_one(new_doc)
    else:
        # Append new data to existing arrays
        doc["labels"].append(label)
        doc["dataPoints"].append(value)
        progress_collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {
                "labels": doc["labels"],
                "dataPoints": doc["dataPoints"]
            }}
        )

    return jsonify({"msg": "Data point added successfully"}), 200


@app.route('/api/writeup', methods=['POST'])
def getHighlights():
    data = request.get_json()
    essay = data.get("text")
    if not essay:
        return jsonify({"msg": "No essay provided"}), 400
    query = f"""Here's an essay for review. Please provide feedback:

    For the output, I need the following in json format:
    1- "highlights": I want at least 5 target highlights to give feedback on. Only highlight two sentences at a time. Try to have some of them towards the end as well. You can give them to me as a range of characters. I also want for each highlight range a comment that explains what you want to give feedback on exactly in this highlight range.
    2- "elo": I want a score of the essay based on the parameters from 0 - 100.
    3- "future": I want a prose style recommendation for how to improve in the future. 
    I want this ready for me to store in a json variable right away with these names in python. Don't output anything other than the json tag.

    Essay:
    {essay}

    Please ensure the feedback is constructive and provides actionable insights for improvement.
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
