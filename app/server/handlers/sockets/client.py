import pytz
import datetime

from flask import session
from flask.ext import socketio

from ... import io
from ... import models


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
        active = models.Quiz.query({'active': True}).get()
        if active is not None:
            active = active._record
        socketio.emit('fluzz:join', {'name': player.name, 'active': active})

    socketio.join_room(session['uuid'])


@io.on('fluzz:answer')
def answer(data):
    active_quiz = models.Quiz.query({'active': True}).get()
    player = models.Player.get(session['uuid'])
    already_answered = models.Question.query({
        'player': player.id,
        'quiz': active_quiz.id,
        'question': active_quiz.current_question
    }).get()

    if already_answered is not None:
        print 'already answered'
        print already_answered
        data['selected'] = already_answered.answer
        socketio.emit('fluzz:answer', data, room=session['uuid'])
    else:
        models.Question.create(
            quiz=active_quiz.id,
            question=active_quiz.current_question,
            player=player.id,
            answer=data['selected']
        )
        socketio.emit('fluzz:answer', data, room=session['uuid'])


@io.on('fluzz:heartbeat')
def heartbeat():
    player = models.Player.get(session['uuid'])
    now = pytz.utc.localize(datetime.datetime.now())
    print player.name, now
    player.beat = now
    player.save()
    models.Player.broadcastPlayers()
