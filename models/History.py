import peewee
from peewee import *
from connectors.mysql_connector import db

class History(peewee.Model):
    author = peewee.TextField()
    title = peewee.TextField()

    class Meta:
        database = db