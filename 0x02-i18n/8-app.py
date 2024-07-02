#!/usr/bin/env python3
""" Run app module for t 77 """
from flask import Flask, render_template, request, g
from flask_babel import Babel
from typing import Dict, Union
app = Flask(__name__)
babel = Babel(app)

users = {
        1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
        2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
        3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
        4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
        }


class Config(object):
    """ Class config fot babel """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """ Return locale """
    if 'locale' in request.args:
        return request.args['locale']
    elif g.user and g.user['locale'] in Config.LANGUAGES:
        return g.user['locale']
    elif request.headers.get('locale', None) in Config.LANGUAGES:
        return request.headers.get('locale', None)
    return request.accept_languages.best_match(app.config['LANGUAGES'])


def get_user() -> Union[Dict[str, str], None]:
    """ Get from user """
    if 'login_as' in request.args:
        return users.get(int(request.args['login_as']))
    else:
        return None


@app.before_request
def before_request():
    """ Before request method  """
    g.user = get_user()


@app.route('/')
def hello() -> str:
    """ Display home page """
    return render_template('6-index.html')


@babel.timezoneselector
def get_timezone():
    """ Gets timezone function """
    if 'timezone' in request.args:
        timezone = request.args['timezone']
    elif g.user and g.user['timezone']:
        timezone = g.user['timezone']
    try:
        pytz.timezone(timezone).zone()
    except pytz.exceptions.UnknownTimeZoneError:
        return app.config['BABEL_DEFAULT_TIMEZONE']


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)