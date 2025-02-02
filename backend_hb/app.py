from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import datetime
import os

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
        "initial_placement": "false",
        "elo_history": [],
        "badges": []
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
            "email": user["email"],
            "elo_history": user["elo_history"],
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

@app.route('/api/elo', methods=['POST'])
@jwt_required()
def add_elo_point():
    data = request.get_json()
    elo_point = data.get("elo")

    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    elo = list(user.get("elo_history"))
    elo.append(elo_point)
    if len(elo) > 10:
        elo.pop(0)

    if user:
        users_collection.update_one({"_id": user_id}, '{$set: { "elo_history": elo}}')
        return jsonify({"msg": "ELO updated"}), 200

    return jsonify({"msg": "User not found"}), 404



if __name__ == '__main__':
    app.run(debug=True)
