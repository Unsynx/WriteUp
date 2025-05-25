import os
from openai import OpenAI
import json
import dotenv

essay = """While exchanging Spotify playlists with a friend, I stumbled across my “saved” playlist, and I saw a song named “Hiccup,” a song that I listened to daily on repeat in 2019 and a token of that time of my life. Nostalgia and an overload of deep-seated forgotten memories hit me.

I hurriedly checked my 2019 photos, thinking how much I had changed, not only physically but everything about me. I don’t play basketball anymore or go to the same school; I am no longer that person. Next year, I will probably be nothing like my 2020 self, and maybe in two years, I will be nothing like who I am now. Perhaps I am just a living temporary memory; if so, of me? Me today or tomorrow? Who am I? The horrendous doubt that my “self” was a mere illusion shook me.

I fear being just a “phase” for a future me. I don’t want my time with my friends in the school dorms to be forgotten, nor do I wish for my love of watching anime to become an old hobby, and if every couple of years, I turn into a new person with entirely different interests in a different setting; then what am I? If the ship of Theseus was replaced part by part till its last part, is it the same ship? Am I the same person, and is there something that persists in me despite the time passing that makes me who I am?

My grandpa has Alzheimer’s. In only a year, he changed to a stranger, to himself and me, remembering only shreds of our time; yet, he is still as I knew him. His face still lightens whenever he plays with a child, and he makes dad jokes whenever possible. He acts on what he thinks he should do now, only now. He doesn’t remember nor care if he should act based on his past actions, and tomorrow, he will act as he sees fit for tomorrow without remembering yesterday. Though I assumed he was no longer his true self, he is closer to it than any of us. His change is the same as mine, in a much shorter period, yes, but not different.

I concluded that the “self” isn’t a unitary solidified object of core values that persists throughout my change process. The “self” is the continuous process of becoming someone else. I used to be a loner. I used to associate the passion of learning with nerdiness. As the years passed, however, reading and studying physics became my main hobbies. I now also value my time with others–in physics student clubs or goofing with friends. I changed.

That doesn’t mean, however, that my loner self vanished or became a faulty ship part that was replaced. If every time I look back and feel that I am so foreign to an older version of myself, this only means that I am closer to my true self. It seems hypocritical to others when I act differently as time passes, but why should I act based on what I was before? It is more hypocritical to embody something I no longer am. The only way to answer the question of who I am is by letting go of the shackles of the fear of change and venturing into a non-ending state of progress and change; then, and only then, will I be myself.

The analogy of the ship of Theseus isn’t accurate in comparison with my “self.” The parts are replaced one after the other in the ship. I, however, persist. It’s more accurate to describe myself as an expanding ship; its parts aren’t replaced nor upgraded but added upon. Every time I change traits, interests, and ambitions, my “self” forms, grows and solidifies. In this journey of self-discovery, there is nothing for me but becoming and being who I will become and be.
"""
tags = ["philosophical", "self-reflection", "identity", "change", "personal growth"]

# Parameters for evaluation
parameters = {
    "clarity": "high",
    "argument_strength": "medium",
    "evidence_use": "low",
    "coherence": "high",
    "style": "reflective"
}

# Constructing the query string
query = f"""Here's an essay for review. Please provide feedback according to the following:

1. Evaluate the essay based on these tags: {tags}.
2. Use these parameters for judgment:
   - Clarity: {parameters["clarity"]}
   - Argument Strength: {parameters["argument_strength"]}
   - Evidence Use: {parameters["evidence_use"]}
   - Coherence: {parameters["coherence"]}
   - Style: {parameters["style"]}

For the output, I need the following in json format:
1- "highlights": I want at least 5 target highlights to give feedback on. You can give them to me as a range of characters. I also want for each highlight range a comment that explains what you want to give feedback on exactly in this highlight range.
2- "elo": I want a score of the essay based on the parameters from 0 - 100.
3- "future": I want a prose style recommendation for how to improve in the future. 
I want this ready for me to store in a json variable right away with these names in python. Don't output anything other than the json tag.

Essay:
{essay}

Please ensure the feedback is constructive and provides actionable insights for improvement.
"""
#conent will contain: essay (string), tags(string list), parameters to judge based on
#we might want the output in json format:
#target highlight: range of characters
#target highlight comment: string of what u want to say about the text
#elo: score of the paper out of a 100
#overall suggestion for improvment after the elo
dotenv.load_dotenv()
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

print(completion.choices[0].message.content)
