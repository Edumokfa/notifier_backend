import peewee
from peewee import *
from connectors.mysql_connector import db

class Environment(peewee.Model):
    name = peewee.TextField()
    cpfCnpj = peewee.TextField()
    whatsappAccessToken = peewee.TextField()
    whatsappPhoneNumber = peewee.TextField()
    whatsappBusinessId = peewee.TextField()
    email = peewee.TextField()
    emailToken = peewee.TextField()

    class Meta:
        database = db