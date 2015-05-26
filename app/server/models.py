import pytz
import datetime

import rethinkdb as rdb

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
    def broadcastPlayers(cls):
        watershed = datetime.datetime.now() - datetime.timedelta(minutes=1)
        players = cls.query(
            rdb.row['beat'] > pytz.utc.localize(watershed)
        ).fetch()
        print players
