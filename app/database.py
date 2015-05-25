import rethinkdb as rdb
from rethinkdb.errors import RqlRuntimeError


def setup():
    rdb.connect(host='database').repl()
    try:
        rdb.db_create('fluzz_db').run()
    except RqlRuntimeError:
        print "Database already exists."

    for new_table in ['quizzes', 'players', 'questions']:
        try:
            rdb.db('fluzz_db').table_create(new_table).run()
        except RqlRuntimeError:
            print "Table '{0}' already created.".format(new_table)


def players():
    return rdb.db('fluzz_db').table('players')


def quizzes():
    return rdb.db('fluzz_db').table('quizzes')


def questions():
    return rdb.db('fluzz_db').table('questions')
