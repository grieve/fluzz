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
