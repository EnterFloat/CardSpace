from datetime import datetime, timedelta
import random
import json
import os

from flask import Flask, render_template, send_from_directory, request, jsonify, make_response, _request_ctx_stack
from flask_sqlalchemy import SQLAlchemy, functools
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='build', static_url_path='/')
app.config.from_object(os.environ['APP_SETTINGS'])
app.config["SQLALCHEMY_DATABASE_URI"] = app.config['DATABASE_URL']
CORS(app)
db = SQLAlchemy(app)

import boto3

from apimodule.auth import AuthError, requires_auth
from apimodule.datalayer import db_init, User, Carddeck, Card, get_user_with
# Uncomment to drop all tables and recreate
# db_init()

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Connect to the S3 bucket and just drop it on there
awsSession = boto3.Session( aws_access_key_id=app.config['AWS_ACCESS_KEY_ID'], aws_secret_access_key=app.config['AWS_SECRET_ACCESS_KEY'])

# List all users
@app.route('/api/users', methods=['GET'])
@cross_origin(origin='*')
def all_users():
    users = User.query.all()
    _users = []
    for usr in users:
        print(usr.options)
        _users.append(usr.as_dict())
    return jsonify(_users)

# List all carddecks
@app.route('/api/card-decks', methods=['GET'])
@cross_origin(origin='*')
def all_carddecks():
    carddecks = Carddeck.query.all()
    _carddecks = []
    for carddeck in carddecks:
        _carddeck = carddeck.as_dict()
        _carddeck['due'] = Card.query.filter_by(deckid=carddeck.id).filter(Card.due<=datetime.today()).filter(Card.is_new==False).count()
        _carddeck['new'] = Card.query.filter_by(deckid=carddeck.id).filter(Card.is_new==True).count()
        _carddecks.append(_carddeck)
    return jsonify(_carddecks)

# List all cards
@app.route('/api/cards', methods=['GET'])
@cross_origin(origin='*')
def cards():
    deck_id = request.args.get('deck_id')
    print(deck_id)
    if deck_id:
        cards = Card.query.filter_by(deckid=deck_id).filter(Card.due<=datetime.today())
    else:
        cards = Card.query.all()
    _cards = []
    for card in cards:
        _cards.append(card.as_dict())
    return jsonify(_cards)


@app.route('/api/justpie', methods=['GET', 'POST'])
@cross_origin(origin='*')
@requires_auth
def GeneratePie():   
    print("GeneratePie")
    print(_request_ctx_stack.top.current_user['sub'])
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
    s3.Bucket(app.config['S3_BUCKET_NAME']).upload_file(os.getcwd() + '/chart.png', "charts/chart_" + str(img_name) + ".png", ExtraArgs={'ACL':'public-read'})
    
    status = {}
    status['status'] = 'DONE'
    status['message'] = 'https://'+ app.config['S3_BUCKET_NAME'] +'.s3.eu-north-1.amazonaws.com/charts/chart_' + str(img_name) + '.png'
    return make_response(jsonify(status), 200)


# Create card deck
@app.route('/api/create-card-deck', methods=['GET', 'POST'])
@cross_origin(origin='*')
@requires_auth
def create_card_deck():
    response = {}
    print("Creating a card deck")
    data = request.data
    print(data)
    if data:
        data = json.loads(data)
    else:
        response = {"status": "no card deck content provided"}    
        return make_response(jsonify(response), 200)
    print(data)    

    user_sub = _request_ctx_stack.top.current_user['sub'] 
    print("get_user_with")
    user = get_user_with(user_sub) 
    print(user)
    user_dict = user['user'].as_dict()
    print(user_dict)

    carddeck = Carddeck(user_dict['id'], data['deckName'], data['deckType'])
    db.session.add(carddeck)
    db.session.commit()

    response = {"status": "good", "user": user_dict, "carddeck": carddeck.as_dict()}
    return make_response(jsonify(response), 200)


# Create card
@app.route('/api/create-card', methods=['GET', 'POST'])
@cross_origin(origin='*')
@requires_auth
def create_card():
    response = {}
    print("Creating a card")
    data = request.data
    print(data)
    if data:
        data = json.loads(data)
    else:
        response = {"status": "no card content provided"}    
        return make_response(jsonify(response), 200)
    print(data)

    user_sub = _request_ctx_stack.top.current_user['sub'] 
    print("get_user_with")

    # Ensure that the carddeck belongs to this user ...
    # ...

    card = Card(deckid=data['deckid'],cardtype="1",cardfront=data['contentFront'],cardback=data['contentBack'],due=datetime.now())
    # card = Card(data['deckid'], "1", data['contentFront'], data['contentBack'], datetime.now() + timedelta(days=1))
    db.session.add(card)
    db.session.commit()

    response = {"status": "good", "card": card.as_dict()}
    return make_response(jsonify(response), 200)


# Create card
@app.route('/api/update-card', methods=['UPDATE'])
@cross_origin(origin='*')
@requires_auth
def update_card():
    response = {}
    print("Updating a card")
    data = request.data
    print(data)
    if data:
        data = json.loads(data)
    else:
        response = {"status": "no card data provided"}    
        return make_response(jsonify(response), 200)
    print(data)

    user_sub = _request_ctx_stack.top.current_user['sub'] 
    print("get_user_with")

    # Ensure that the carddeck belongs to this user ...
    # ...

    card = Card.query.filter_by(id=data['cardid']).first()
    for key, value in data.items():
        card[key] = value

    db.session.commit()

    response = {"status": "good", "card": card.as_dict()}
    return make_response(jsonify(response), 200)


@app.route('/api/rate-card', methods=['POST'])
@cross_origin(origin='*')
@requires_auth
def rate_card():
    response = {}
    print("Rate a card")
    data = request.data
    print(data)
    if data:
        data = json.loads(data)
    else:
        response = {"status": "no card data provided"}    
        return make_response(jsonify(response), 200)
    print(data)

    user_sub = _request_ctx_stack.top.current_user['sub'] 
    print("get_user_with")

    # Ensure that the carddeck belongs to this user ...
    # ...

    card = Card.query.filter_by(id=data['cardid']).first()

    if data['rating'] == 'easy':
        card.due = datetime.now() + card.rating_easy
    elif data['rating'] == 'good':
        card.due = datetime.now() + card.rating_good
    elif data['rating'] == 'hard':
        card.due = datetime.now() + card.rating_hard
    elif data['rating'] == 'again':
        card.due = datetime.now() + card.rating_again

    card.is_new = False

    # Update new ratings here

    db.session.commit()

    response = {"status": "good", "card": card.as_dict()}
    return make_response(jsonify(response), 200)


@app.route('/api/upload', methods=['POST'])
@cross_origin(origin='*')
# @requires_auth
def upload_file():
    print("Uploading a file")
    status = {'msg': 'File was uploaded', 'error': 0, 'images': ['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/440px-Image_created_with_a_mobile_phone.png']}
    status = [{'fileDownloadUri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/440px-Image_created_with_a_mobile_phone.png', 'fileType': 'png', 'size': '100'}, {'fileDownloadUri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/440px-Image_created_with_a_mobile_phone.png', 'fileType': 'png', 'size': '100'}]
    return jsonify(status)


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':            
    app.run(host='0.0.0.0', debug=True)