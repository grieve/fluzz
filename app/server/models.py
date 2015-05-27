import pytz
import datetime

import rethinkdb as rdb
from flask.ext import socketio

from . import orm


class Quiz(orm.QueryModel):
    class Meta(orm.QueryModel.Meta):
        table_name = 'quizzes'


class Question(orm.QueryModel):
    class Meta(orm.QueryModel.Meta):
        table_name = 'questions'


class Player(orm.QueryModel):
    class Meta(orm.QueryModel.Meta):
        table_name = 'players'

    @classmethod
    def active_players(cls):
        watershed = datetime.datetime.now() - datetime.timedelta(minutes=1)
        players = cls.query(
            rdb.row['beat'] > pytz.utc.localize(watershed)
        ).fetch()
        return players

    @classmethod
    def players_by_score(cls):
        watershed = datetime.datetime.now() - datetime.timedelta(minutes=1)
        players = cls.query(
            rdb.row['beat'] > pytz.utc.localize(watershed)
        ).order_by(
            rdb.desc('score')
        ).fetch()
        return players

    @classmethod
    def broadcastPlayers(cls):
        quiz = Quiz.query({'active': True}).get()
        players = []
        for p in cls.active_players():
            player = {
                'name': p.name,
                'score': p.score
            }
            if quiz is not None:
                current_answer = Question.query({
                    'quiz': quiz.id,
                    'player': p.id,
                    'question': quiz.current_question
                }).get()
                if current_answer is None:
                    player['answer'] = None
                else:
                    player['answer'] = current_answer.answer

            players.append(player)

        socketio.emit(
            'fluzz:players',
            {'players': players},
            broadcast=True
        )
