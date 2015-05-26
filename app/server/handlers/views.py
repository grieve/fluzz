import json
import uuid

from flask import session
from flask import redirect
from flask import render_template


from .. import app
from .. import quiz
from .. import models


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


@app.route('/_admin')
def admin_index():
    active_quiz = models.Quiz.query({'active': True}).get()
    if len(active_quiz) > 0:
        active_quiz = active_quiz[0]
    return render_template('admin.html', quiz=active_quiz)


@app.route('/_admin/start')
def admin_start():
    quiz.start()
    return "OK"


@app.route('/', defaults={'path': ''})
def index(path):
    context = {}
    if 'uuid' in session:
        context['uuid'] = session.get('uuid')
    else:
        context['uuid'] = str(uuid.uuid4())
        session['uuid'] = context['uuid']

    player = models.Player.get(context['uuid'])
    if player is not None:
        context['name'] = player.name

    return render_template('index.html', context=json.dumps(context))


@app.route('/<path:path>')
def catch_all(path):
    return redirect('/')
