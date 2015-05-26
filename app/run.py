from server import io
from server import app
from server import config


io.run(app, host=config.HOST, port=config.PORT)
