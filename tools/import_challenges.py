import csv
import time
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["your_db_name"]
users_collection = db["users"]
challenges_collection = db["challenges"]

# This deletes all existing entries, which may not be intended
# challenges_collection.delete_many({})

with open("challenges.csv", 'r') as f:
    csv_reader = csv.reader(f)

    header = True
    for row in csv_reader:
        if header:
            header = False
            continue

        title = row[0]
        essay_prompt = row[1]
        tags = row[2].split("-")
        difficulty = row[3]

        challenge = {
            "title": title,
            "tags": tags,
            "difficulty": difficulty,
            "essay_prompt": essay_prompt,
            "created_at": time.time()
        }

        challenges_collection.insert_one(challenge)

print(list(challenges_collection.find({})))