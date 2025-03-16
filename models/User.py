import peewee
from peewee import *
from connectors.mysql_connector import db

class User(peewee.Model):
    name = peewee.TextField()
    role = peewee.TextField()
    password = peewee.TextField()

    class Meta:
        database = db