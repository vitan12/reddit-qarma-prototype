from fastapi import FastAPI
from collections import defaultdict
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from sqlitedict import SqliteDict
import base64
import random


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = SqliteDict('./my_db.sqlite', autocommit=True)

@app.get("/clear_db/")
def clear_db():
    db.clear()
    return 'Storage cleared'

@app.get("/initialize_db/")
def initialize_db():
    clear_db()
    db['passing'] = dict()
    db['qarma'] = dict()
    db['submitted_frq'] = dict()
    db['submitted_mcq'] = dict()
    db['subreddits'] = dict()
    db['frq_responses'] = dict()
    db['mcq_responses'] = dict()
    db['upvotes'] = dict()

    db['subreddit_options'] = dict()


@app.get('/dummy_init/')
def dummy_init():
    initialize_db()
    db['submitted_frq'] = {('eagerquiztaker', 'https://www.cnn.com/2021/11/29/politics/omicron-variant-covid-19-joe-biden/index.html'): {'frq_question': 'Should the US instantly implement travel bans on countries with new variants? Why or why not?'}}
    db['submitted_mcq'] = {('eagerquiztaker', 'https://www.cnn.com/travel/article/world-most-expensive-cities-2021/index.html'): {0: {'question': 'What percentage have price and goods gone up in local-currency terms according to the EIU?', 'options': ('3.5%', '2.5%', '1.9%'), 'answer': '3.5%'}, 1: {'question': 'What was the highest-rising city in the rankings?', 'options': ('Tehran', 'Buenos Aires', 'Caracas'), 'answer': 'Tehran'}, 2: {'question': 'What is the 10th city in the most-expensive city rankings?', 'options': ('Osaka', 'Sydney', 'Hong Kong'), 'answer': 'Osaka'}}, ('eagerquiztaker', 'https://www.cnn.com/2021/11/29/politics/omicron-variant-covid-19-joe-biden/index.html'): {0: {'question': 'How many millions of vaccines has the US shipped to other countries?', 'options': ('275', '375', '150'), 'answer': '275'}, 1: {'question': 'At least how many mutations does Omicron have?', 'options': ('50', '80', '110'), 'answer': '50'}, 2: {'question': 'Which variant does not meet the definition for variant of concern?', 'options': ('Lambda', 'Beta', 'Gamma'), 'answer': 'Lambda'}}}
    db['frq_responses'] = {('eagerquiztaker', 'https://www.cnn.com/2021/11/29/politics/omicron-variant-covid-19-joe-biden/index.html'): {'frq_responses': "I think so. It's better to be safe than sorry, and since we don't understand the risks that new variants may have it's much wiser to implement a travel restriction. It shouldn't be politicized since it's purely for safety."}}
    db['passing'] = {('eagerquiztaker', 'https://www.cnn.com/2021/11/29/politics/omicron-variant-covid-19-joe-biden/index.html') : {'passing': 100}, ('eagerquiztaker', 'https://www.cnn.com/travel/article/world-most-expensive-cities-2021/index.html'): {'passing': 100}}

@app.put("/add_subreddit/{subreddit}")
def add_subreddit(subreddit: str):
    subreddits = db.get('subreddits')
    subreddits[subreddit] = True
    db['subreddits'] = subreddits
    return 200

@app.get('/subreddit_exists/{subreddit}')
async def get_subreddit_exists(subreddit: str):
    print(db['subreddits'])
    return {'result': (subreddit in db['subreddits'])}


# questions = {
#     'r1uqk0': [{'question': 'question1', 'answers': ['answer1', 'answer2', 'answer3'], 'answer': '0'}, {'question': 'question2', 'answers': ['answer1', 'answer2', 'answer3'], 'answer': '1'}, {'question': 'question3', 'answers': ['answer1', 'answer2', 'answer3'], 'answer': '2'}]
# }

# frq = {
#     'r1uqk0': 'What is the meaning of life?'
# }

# subreddits = {
#     'quiz_test_community': True
# }

# submitted_mcq = {}
# submitted_frq = {}

mcq_database = defaultdict(lambda: defaultdict(int))
frq_database = defaultdict(lambda: defaultdict(int))
responses = defaultdict(lambda: defaultdict(str))

class Response(BaseModel): 
    username: str
    correct: int

class FRQ_Response(BaseModel): 
    username: str
    response: str

# @app.get('/questions/{post_id}')
# def get_questions(post_id: str):
#     return {'questions': questions[post_id]}

# Form logic

@app.get('/frq_exists/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    return {'frq': (username, base64.b64decode(encoded).decode("utf-8")) in db['submitted_frq']}

@app.get('/user_answered_frq/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    return {'frq': (username, base64.b64decode(encoded).decode("utf-8")) in db['frq_responses']}


@app.get('/frq/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    print({'frq': db['submitted_frq'][(username, base64.b64decode(encoded).decode("utf-8"))]})
    return {'frq': db['submitted_frq'][(username, base64.b64decode(encoded).decode("utf-8"))]}

@app.get('/frq_response/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    print(db['frq_responses'])
    print(db['frq_responses'][(username, base64.b64decode(encoded).decode("utf-8"))])
    return {'frq_response': db['frq_responses'][(username, base64.b64decode(encoded).decode("utf-8"))]}

@app.get('/upvotes/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    key = (username, base64.b64decode(encoded).decode("utf-8"))
    if key not in db['upvotes']:
        return {'upvotes': {'upvotes': 0}}
    print({'upvotes': db['upvotes'][(username, base64.b64decode(encoded).decode("utf-8"))]})
    return {'upvotes': db['upvotes'][(username, base64.b64decode(encoded).decode("utf-8"))]}

@app.get('/passing/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    # print(db['passing'][(username, base64.b64decode(encoded).decode("utf-8"))])
    key = (username, base64.b64decode(encoded).decode("utf-8"))
    return {'passing': db['passing'][key]}

@app.get('/mcq/{username}/{encoded}')
def get_frq(username: str, encoded: str):
    print('hi')
    # [{'question': 'question1', 'answers': ['answer1', 'answer2', 'answer3'], 'answer': '0'}, {'question': 'question2', 'answers': ['answer1', 'answer2', 'answer3'], 'answer': '1'}, {'question': 'question3', 'answers': ['answer1', 'answer2', 'answer3'], 'answer': '2'}]
    x = db['submitted_mcq'][(username, base64.b64decode(encoded).decode("utf-8"))]
    returned = []
    # print(x)
    m = list(x.keys())
    random.shuffle(m)
    for key in m:
        dictoip = {}
        dictoip['question'] = x[key]['question']
        rnandom = list(range(len(list(x[key]['options']))))
        random.shuffle(rnandom)
        dictoip['answers'] = [x[key]['options'][key_two] for key_two in rnandom]
        dictoip['answer'] = str(rnandom.index(0))
        returned.append(dictoip)
        print(dictoip, rnandom)
    print(returned)
    return {'mcq': returned}


@app.get('/qarma/{username}')
def get_frq(username: str):
    if username not in db['qarma']:
        qarma = db.get('qarma')
        qarma[username] = 0
        db['qarma'] = qarma
    return {'qarma': db['qarma'][username]}

# @app.put('/quiz_response/{post_id}')
# async def post_quiz_answers(post_id: str, response: Response):
#     mcq_database[post_id][response['username']] = response['correct']
#     return response

# @app.get('/frq_response/{post_id}')
# async def post_quiz_answers(post_id: str, response: Response):
#     frq_database[post_id][response['username']] = response['correct']
#     return response

# Form logic
class SubmittedMcqQuestions(BaseModel):
    username: str
    post_url: str
    submitted_questions: list

class SubmittedFrqQuestion(BaseModel):
    username: str
    post_url: str
    frq_question: str
    frq_answer: str

class SubmittedQuizSettings(BaseModel):
    subreddit: str
    lengthQuiz: int
    minCorrect: int
    qarmaThreshold: int

class SubmittedFrqResponse(BaseModel):
    username: str
    post_url: str
    frq_answer: str

print(db['submitted_mcq'])
print(db['submitted_frq'])
print(db['frq_responses'])

@app.put('/submit_mcq_questions/')
async def submit_mcq_questions(data: SubmittedMcqQuestions):
    key = (data.username, data.post_url)
    print(data)
    questions = dict()
    for i, question in enumerate(data.submitted_questions):
        questions[i] = {'question': question[0], 'options': tuple(question[1:])}
        questions[i]['answer'] = question[1]
    submitted_mcq = db.get('submitted_mcq')
    submitted_mcq[key] = questions
    db['submitted_mcq'] = submitted_mcq

    passing = db.get('passing')
    passing[key] = {'passing': 100}
    db['passing'] = passing

    print('Updated MCQ: ', submitted_mcq[key])
    return 200

@app.put('/submit_frq_response/')
async def submit_mcq_questions(data: SubmittedFrqResponse):
    key = (data.username, data.post_url)
    frq_responses = db.get('frq_responses')
    frq_responses[key] = {'frq_responses': data.frq_answer}
    db['frq_responses'] = frq_responses
    print('Updated FRQ Response: ', frq_responses)
    return 200

@app.put('/passing/{username}/{encoded}/')
async def submit_passing(username: str, encoded: str, correct: int = 0):
    key = (username, base64.b64decode(encoded).decode("utf-8"))
    print(username, encoded, correct)
    passing = db.get('passing')
    if key in passing and correct > int(passing[key]['passing']):
        passing[key] = {'passing': correct}
        db['passing'] = passing
    elif key not in passing:
        passing[key] = {'passing': correct}
    db['passing'] = passing
    print('Updated passing Response: ', key, db['passing'][key])
    return 200

@app.put('/upvotes/{username}/{encoded}/')
async def submit_mcq_questions(username: str, encoded: str, upvotes: int = 0):
    key = (username, base64.b64decode(encoded).decode("utf-8"))
    upvote = db.get('upvotes')
    upvote[key] = {'upvotes': upvotes}
    db['upvotes'] = upvote
    print('Updated Upvote Dict: ', upvote)
    return 200


@app.put('/submit_frq_question/')
async def submit_frq_questions(data: SubmittedFrqQuestion):
    key = (data.username, data.post_url)
    submitted_frq = db.get('submitted_frq')
    submitted_frq[key] = {'frq_question': data.frq_question}
    db['submitted_frq'] = submitted_frq
    print(submitted_frq)
    frq_responses = db.get('frq_responses')
    frq_responses[key] = {'frq_responses': data.frq_answer}
    db['frq_responses'] = frq_responses
    print('Updated FRQ: ', submitted_frq[key], '\nUpdated FRQ Response: ', frq_responses[key])
    return 200

@app.get('/get_subreddit_options/{subreddit}')
async def get_subreddit_options(subreddit: str):
    if subreddit not in db['subreddit_options']:
        new_entry = dict()
        new_entry['qarmaThreshold'] = 1
        new_entry['minCorrect'] = 2
        new_entry['lengthQuiz'] = 3
        
        subreddit_options = db.get('subreddit_options')
        subreddit_options[subreddit] = new_entry
        db['subreddit_options'] = subreddit_options
    
    return db['subreddit_options'][subreddit]

@app.put('/put_subreddit_options/')
async def put_subreddit_options(data: SubmittedQuizSettings):
    new_entry = dict()
    new_entry['qarmaThreshold'] = data.qarmaThreshold
    new_entry['minCorrect'] = data.minCorrect
    new_entry['lengthQuiz'] = data.lengthQuiz
    
    subreddit_options = db.get('subreddit_options')
    subreddit_options[data.subreddit] = new_entry
    db['subreddit_options'] = subreddit_options
    print(subreddit_options)
    return 200

@app.get('/what_exists/{username}/{encoded}')
def what_exists(username: str, encoded: str):
    key = (username, (base64.b64decode(encoded).decode("utf-8")))
    print('KEY233', key)
    result = dict()
    result['mcq'] = key in db['submitted_mcq']
    result['frq'] = key in db['submitted_frq']
    return result


@app.get('/entry_exists/{username}/{encoded}/{id}')
def entry_exists(username: str, encoded: str, id: str):
    key = (username, (base64.b64decode(encoded).decode("utf-8")))
    print('entry exists', key, key in db['submitted_mcq'])
    return {'result': key in db['submitted_mcq'], 'id': id}