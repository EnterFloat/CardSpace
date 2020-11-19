from datetime import datetime
from flask_sqlalchemy import SQLAlchemy  # Database
from app import db

# Setup database
def db_init():
    db.drop_all()
    db.create_all()

    db.session.add(User("auth0_1", "this is an option"))
    db.session.add(User("auth0_2", "this is an option"))
    db.session.add(User("auth0_3", "this is an option"))
    db.session.commit()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column('id', db.Integer, primary_key = True)
    authid = db.Column(db.String(200))
    options = db.Column(db.String(200))

    def __init__(self, authid, options):
        self.authid = authid
        self.options = options   


class Carddeck(db.Model):
    __tablename__ = "carddecks"
    id = db.Column('id', db.Integer, primary_key = True)
    userid = db.Column(db.Integer)
    deckname = db.Column(db.String(100))
    decktype = db.Column(db.String(40))
    created = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, userid, deckname, decktype):
        self.userid = userid
        self.deckname = deckname   
        self.decktype = decktype   


class Card(db.Model):
    __tablename__ = "cards"
    id = db.Column('id', db.Integer, primary_key = True)
    deckid = db.Column(db.Integer)
    cardtype = db.Column(db.String(100))
    cardfront = db.Column(db.String(1000))
    cardback = db.Column(db.String(1000))
    due = db.Column(db.DateTime, default=datetime.now)
    created = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, deckid, cardtype, cardfront, cardback, due):
        self.deckid = deckid
        self.cardtype = cardtype   
        self.cardfront = cardfront   
        self.cardback = cardback   
        self.due = due   