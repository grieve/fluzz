from flask.ext import socketio

from ... import io
from ... import quiz
from ... import models


@io.on('admin:start', namespace='/admin')
def start():
    active = quiz.start()
    socketio.emit(
        'fluzz:start',
        active._record,
        broadcast=True,
        namespace=""
    )
    for p in models.Player.active_players():
        p.score = 0
        p.save()
    print "start", active._record
    socketio.emit('admin:start', active._record)


@io.on('admin:answer', namespace='/admin')
def answer():
    active = models.Quiz.query({'active': True}).get()
    socketio.emit(
        'fluzz:result',
        active.questions[active.current_question],
        broadcast=True,
        namespace=""
    )
    for p in models.Player.active_players():
        guess = models.Question.query({
            'quiz': active.id,
            'player': p.id,
            'question': active.current_question
        }).get()
        if (
                guess is not None and
                guess.answer == active.questions[
                    active.current_question
                ]['answer']
        ):
            p.score += 1
            p.save()


@io.on('admin:next', namespace='/admin')
def next_question():
    active = models.Quiz.query({'active': True}).get()
    active.current_question += 1
    if active.current_question >= len(active.questions):
        socketio.emit('admin:next', {'errors': 'No more questions'})
        return

    active.save()
    socketio.emit(
        'fluzz:question',
        active.questions[active.current_question],
        broadcast=True,
        namespace=""
    )
    socketio.emit('admin:next', active._record)


@io.on('admin:end', namespace='/admin')
def end():
    quiz.end()
    socketio.emit(
        'fluzz:end',
        broadcast=True,
        namespace=""
    )
    socketio.emit('admin:end')
