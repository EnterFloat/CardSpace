# import time
# from flask import Flask

# app = Flask(__name__, static_folder='../build', static_url_path='/')

# @app.route('/')
# def index():
#     return app.send_static_file('index.html')

# @app.route('/api/time')
# def get_current_time():
#     return {'time': time.time()}
from flask import Flask, render_template, send_from_directory, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import boto3
from config import S3_BUCKET, S3_KEY, S3_SECRET
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os
import random
from dotenv import load_dotenv
load_dotenv()

S3_BUCKET_NAME = os.environ['S3_BUCKET_NAME']
AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']


app = Flask(__name__, static_folder='../build', static_url_path='/')
cors = CORS(app)

print(S3_BUCKET_NAME)
print(AWS_ACCESS_KEY_ID)
print(AWS_SECRET_ACCESS_KEY)

# Connect to the S3 bucket and just drop it on there
# s3 = boto3.client('s3', aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
session = boto3.Session( aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

@app.route('/api')
@cross_origin()
def Welcome():
    return "Welcome to the API!!!"

@app.route('/api/justpie/')
@cross_origin()
def GeneratePie():
    print("GeneratePie")    
    print(S3_BUCKET_NAME)
    print(AWS_ACCESS_KEY_ID)
    print(AWS_SECRET_ACCESS_KEY)
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

    # s3_resource = boto3.resource("s3", aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
    s3 = session.resource('s3')
    img_name = random.randint(1000, 10000)    
    s3.Bucket(S3_BUCKET_NAME).upload_file(os.getcwd() + '/chart.png', "charts/chart_" + str(img_name) + ".png", ExtraArgs={'ACL':'public-read'})

    # s3_resource = boto3.resource("s3")
    # img_name = random.randint(1000, 10000)    
    # s3_resource.Bucket(S3_BUCKET).upload_file(os.getcwd() + '/chart.png', "charts/chart_" + str(img_name) + ".png", ExtraArgs={'ACL':'public-read'})

    status = {}
    status['status'] = 'DONE'
    status['message'] = 'https://'+ S3_BUCKET_NAME +'.s3.eu-north-1.amazonaws.com/charts/chart_' + str(img_name) + '.png'
    return make_response(jsonify(status), 200)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)