from flask.ext import socketio


from ... import io
from ... import models


@io.on('fluzz:presenter')
def join():
    active = models.Quiz.query({'active': True}).get()
    socketio.emit('fluzz:presenter', active._record)
