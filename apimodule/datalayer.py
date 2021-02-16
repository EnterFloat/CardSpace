import json
from datetime import datetime, timedelta
from flask import make_response, jsonify
from flask_sqlalchemy import SQLAlchemy  # Database
from app import db

# Setup database
def db_init():
    db.drop_all()
    db.create_all()
    db.session.commit()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    authid = db.Column(db.String(200))
    options = db.Column(db.String(200))

    def __init__(self, authid, options):
        self.authid = authid
        self.options = options   
    
    def as_dict(self):
        return {'id': self.id, 'authid': self.authid, 'options': self.options}


class Carddeck(db.Model):
    __tablename__ = "carddecks"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    userid = db.Column(db.Integer)
    deckname = db.Column(db.String(100))
    decktype = db.Column(db.String(40))    
    created = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, userid, deckname, decktype):
        self.userid = userid
        self.deckname = deckname   
        self.decktype = decktype           

    def as_dict(self):
        return {'id': self.id, 'userid': self.userid, 'deckname': self.deckname, 'decktype': self.decktype, 'created': self.created}


class Card(db.Model):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    deckid = db.Column(db.Integer)
    cardtype = db.Column(db.String(100))
    cardfront = db.Column(db.String(200000))
    cardback = db.Column(db.String(200000))
    due = db.Column(db.DateTime, default=datetime.now)
    e_factor = db.Column(db.Float, default=2.5)
    repetitions = db.Column(db.Integer, default=0)
    n = db.Column(db.Integer, default=0)
    interval = db.Column(db.Integer, default=1)
    created = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, deckid, cardtype, cardfront, cardback):
        self.deckid = deckid
        self.cardtype = cardtype    
        self.cardfront = cardfront   
        self.cardback = cardback           
    
    def as_dict(self):
        return {'id': self.id, 'deckid': self.deckid, 'cardtype': self.cardtype, 'cardfront': self.cardfront, 'cardback': self.cardback, 'created': self.created, 'due': self.due, 'repetitions': self.repetitions, 'e_factor': self.e_factor, 'interval': self.interval}


def get_user_with(authid):
    user = User.query.filter_by(authid=authid).first()
    status = {}
    if not user:
        user = User(authid=authid, options="")
        db.session.add(user)
        print("New user added")
        db.session.commit()

    # print(user)
    # print(user.authid)
    status['status'] = 'DONE'
    status['user'] = user
    
    return status
