import json
import uuid

import database as db


def start():
    with open('quiz.json') as config_file:
        quiz = json.loads(config_file.read())

    quiz['id'] = str(uuid.uuid4())
    quiz['currentQuestion'] = 0
    quiz['active'] = True

    db.quizzes().filter({'active': True}).update({'active': False}).run()
    db.quizzes().insert(quiz).run()
    return quiz
