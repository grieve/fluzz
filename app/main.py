import json
import uuid

from flask import Flask
from flask import session
from flask import redirect
from flask import render_template

from flask.ext import socketio

import database as db
import quiz


app = Flask(__name__)
app.debug = True
app.secret_key = 'sadfj3u3n3mwdef'


io = socketio.SocketIO(app)


@io.on('fluzz:join')
def join(data):
    exists = list(db.players().filter({'name': data['name']}).run())
    if len(exists) > 0 and exists[0]['id'] != session['uuid']:
        socketio.emit('fluzz:join', {'error': 'exists', 'name': data['name']})
    else:
        db.players().insert({
            'id': session['uuid'],
            'name': data['name']
        }).run()
        socketio.emit('fluzz:join', {'name': data['name']})

    socketio.join_room(session['uuid'])


@io.on('fluzz:answer')
def answer(data):
    active_quiz = list(db.quizzes().filter({'active': True}).run())[0]
    player = db.players().get(session['uuid']).run()

    already_answered = list(db.questions().filter({
        'player': player['id'],
        'quiz': active_quiz['id'],
        'question': active_quiz['currentQuestion']
    }).run())
    if len(already_answered) > 0:
        print 'already answered'
        print already_answered
        data['selected'] = already_answered[0]['answer']
        socketio.emit('fluzz:answer', data, room=session['uuid'])
    else:
        db.questions().insert({
            'quiz': active_quiz['id'],
            'question': active_quiz['currentQuestion'],
            'player': player['id'],
            'answer': data['selected']
        }).run()
        socketio.emit('fluzz:answer', data, room=session['uuid'])


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


@app.route('/_admin')
def admin_index():
    active_quiz = list(db.quizzes().filter({'active': True}).run())
    if len(active_quiz) > 0:
        active_quiz = active_quiz[0]
    return render_template('admin.html', quiz=active_quiz)


@app.route('/_admin/start')
def admin_start():
    quiz.start()
    return "OK"


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    context = {}
    if 'uuid' in session:
        context['uuid'] = session.get('uuid')
    else:
        context['uuid'] = str(uuid.uuid4())
        session['uuid'] = context['uuid']

    player = db.players().get(context['uuid']).run()
    if player is not None:
        context['name'] = player['name']

    return render_template('index.html', context=json.dumps(context))


if __name__ == '__main__':
    db.setup()
    io.run(app, host="0.0.0.0")
