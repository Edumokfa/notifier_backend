import peewee
from peewee import *

db = MySQLDatabase('notifications', user='root', passwd='root', host='localhost', port=3306)

#from models.History import  History
#from models.Environment import Environment

def createTables():
 #   History.create_table()
  #  Environment.create_table()
    
    #book = Book(author="me", title='Peewee is cool')
    #book.save()
    #for book in Book.filter(author="me"):
    #    print(book.title)
    return "sucesso"

def insertEnv(name, cpfCnpj, whatsappAccessToken, whatsappPhoneNumber, whatsappBusinessId, email, emailToken):
   # Environment.create(name=name, cpfCnpj=cpfCnpj, whatsappAccessToken=whatsappAccessToken, whatsappPhoneNumber=whatsappPhoneNumber, whatsappBusinessId=whatsappBusinessId, email=email, emailToken=emailToken) 
    return "sucesso"

def insertHistory(author, title):
    #History.create(author=author, title=title)
    return "sucesso"