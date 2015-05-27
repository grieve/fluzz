import os

DEBUG = True
HOST = '0.0.0.0'
PORT = 5000
SECRET = 'sdfgnwu34ju3n3i393nf##'

DATABASE_HOST = os.getenv('DATABASE_HOST', 'database')
DATABASE_NAME = 'fluzz'


import rethinkdb as rdb
from rethinkdb.errors import RqlRuntimeError

rdb.connect(host=DATABASE_HOST).repl()
try:
    rdb.db_create(DATABASE_NAME).run()
except RqlRuntimeError:
    pass

rdb.connect(host=DATABASE_HOST, db=DATABASE_NAME).repl()
