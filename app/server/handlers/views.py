import json
import uuid

from flask import session
from flask import redirect
from flask import render_template


from .. import app
from .. import models


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


@app.route('/admin')
def admin_index():
    context = {}
    active_quiz = models.Quiz.query({'active': True}).get()
    if active_quiz is not None:
        context['active'] = active_quiz._record
    return render_template('admin.html', context=json.dumps(context))


@app.route('/live')
def live_view():
    return render_template('live.html', context=json.dumps({}))


@app.route('/live/<path:path>')
def live_catch_all(path):
    return redirect('/live')


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
