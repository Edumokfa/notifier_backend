import peewee
from peewee import *

db = MySQLDatabase('notifications', user='root', passwd='root', host='db', port=3306)

class History(peewee.Model):
    author = peewee.TextField()
    title = peewee.TextField()

    class Meta:
        database = db

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

def createTables():
    History.create_table()
    Environment.create_table()
    
    #book = Book(author="me", title='Peewee is cool')
    #book.save()
    #for book in Book.filter(author="me"):
    #    print(book.title)
    return "sucesso"

def insertEnv(name, cpfCnpj, whatsappAccessToken, whatsappPhoneNumber, whatsappBusinessId, email, emailToken):
    Environment.create(name=name, cpfCnpj=cpfCnpj, whatsappAccessToken=whatsappAccessToken, whatsappPhoneNumber=whatsappPhoneNumber, whatsappBusinessId=whatsappBusinessId, email=email, emailToken=emailToken) 
    return "sucesso"

def insertHistory(author, title):
    History.create(author=author, title=title)
    return "sucesso"