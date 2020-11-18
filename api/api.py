import random
import json
import os

from flask import Flask, render_template, send_from_directory, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy  # Database
from flask_cors import CORS, cross_origin

import boto3
from config import S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DATABASE_URL

from auth import AuthError, requires_auth

from datalayer import *

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# from dotenv import load_dotenv
# load_dotenv()
# Move to data layer
# Data bucket variables
# S3_BUCKET_NAME = os.environ['S3_BUCKET_NAME']
# AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
# AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']


app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL if DATABASE_URL else "sqlite:///data.db"
db.init_app(app)

with app.app_context():
    db_init()
    db.create_all()

# Connect to the S3 bucket and just drop it on there
awsSession = boto3.Session( aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

@app.route('/api')
@cross_origin(origin='*')
def Welcome():
    users = User.query.all()
    _users = []
    for usr in users:
        print(usr.options)
        _users.append([usr.authid, usr.options])
    return jsonify(_users)


@app.route('/api/justpie', methods=['POST'])
@cross_origin(origin='*')
@requires_auth
def GeneratePie():        
    # Get the input data (Wedge is the distance between slices) from the request    
    data = request.args.get('data')
    colors = request.args.get('colors')
    wedge = request.args.get('wedge')

    # Turn it into a list
    data = [float(i) for i in data.split(',')]
    colors = ['#'+i for i in colors.split(',')] # <-- Adding # to string

    # Make a matplotlib (high res) pie chart!
    fig1, ax1 = plt.subplots(figsize=(20,20)) 
    patches, texts = ax1.pie(data,explode=[float(wedge) for w in range(0,len(data))], colors = colors, startangle=90)

    # Equal aspect ratio ensures that pie is drawn as a circle
    ax1.axis('equal')
    plt.tight_layout()

    # Save the image temporary on the local machine
    plt.savefig(os.getcwd() + '/chart.png')

    # Save image on local machine to AWS S3 Bucket
    s3 = awsSession.resource('s3')
    img_name = random.randint(1000, 10000)    
    s3.Bucket(S3_BUCKET_NAME).upload_file(os.getcwd() + '/chart.png', "charts/chart_" + str(img_name) + ".png", ExtraArgs={'ACL':'public-read'})
    
    status = {}
    status['status'] = 'DONE'
    status['message'] = 'https://'+ S3_BUCKET_NAME +'.s3.eu-north-1.amazonaws.com/charts/chart_' + str(img_name) + '.png'
    return make_response(jsonify(status), 200)


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')
if __name__ == '__main__':            
    app.run(host='0.0.0.0', debug=True)