from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'saf3knm32pkn98sasdfakdjf93ijeijwei0dnbf'
app.debug = True
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('event')
def test_message(message):
    emit('response', {'data': message})


@socketio.on('broadcast')
def test_broadcast_message(message):
    emit('response', {'data': message}, broadcast=True)


@socketio.on('connect')
def test_connect():
    print('connected')
    emit('response', {'data': 'Connected'})


@socketio.on('disconnect')
def test_disconnect():
    print('disconnected')


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0")
