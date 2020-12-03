import os
import json
from dotenv import load_dotenv
load_dotenv()
# basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    
    APP_SETTINGS = os.environ.get("APP_SETTINGS")
    S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    DATABASE_URL = os.environ.get('DATABASE_URL')

    API_AUDIENCE = os.environ.get('REACT_APP_API_BASE_URL')
    AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN')
    ALGORITHMS = [os.environ.get('ALGORITHMS')]


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
