from flask import session
from flask.ext import socketio

from .. import io
from .. import models


@io.on('fluzz:join')
def join(data):
    exists = models.Player.query({'name': data['name']}).get()
    if exists is not None and exists.id != session['uuid']:
        socketio.emit('fluzz:join', {'error': 'exists', 'name': data['name']})
    else:
        player = models.Player.create(
            id=session['uuid'],
            name=data['name']
        )
        socketio.emit('fluzz:join', {'name': player.name})

    socketio.join_room(session['uuid'])


@io.on('fluzz:answer')
def answer(data):
    active_quiz = models.Quiz.query({'active': True}).get()
    player = models.Player.get(session['uuid'])
    already_answered = models.Question.query({
        'player': player.id,
        'quiz': active_quiz.id,
        'question': active_quiz.currentQuestion
    }).get()

    if already_answered is not None:
        print 'already answered'
        print already_answered
        data['selected'] = already_answered.answer
        socketio.emit('fluzz:answer', data, room=session['uuid'])
    else:
        models.Question.create(
            quiz=active_quiz.id,
            question=active_quiz.currentQuestion,
            player=player.id,
            answer=data['selected']
        )
        socketio.emit('fluzz:answer', data, room=session['uuid'])
