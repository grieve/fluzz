from flask import Flask

from flask.ext import socketio

from . import config

app = Flask(__name__)
app.debug = config.DEBUG
app.secret_key = config.SECRET

io = socketio.SocketIO(app)

from .handlers import sockets
from .handlers import views

__all__ = ['app', 'io', 'sockets', 'views']
