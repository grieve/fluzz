import json
import uuid

from . import models


def start():
    with open('server/quiz.json') as config_file:
        quiz = json.loads(config_file.read())

    quiz['id'] = str(uuid.uuid4())
    quiz['current_question'] = 0
    quiz['active'] = True

    models.Quiz.query({'active': True}).update(active=False)
    return models.Quiz.create(**quiz)


def end():
    models.Quiz.query({'active': True}).update(active=False)
