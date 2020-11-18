import json
import os
from dotenv import load_dotenv
load_dotenv()


S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")

DATABASE_URL = os.environ.get('DATABASE_URL')

API_AUDIENCE = os.environ.get('API_AUDIENCE')
AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN')
ALGORITHMS = [os.environ.get('ALGORITHMS')]

LIST_TEST = os.environ.get('LIST_TEST')