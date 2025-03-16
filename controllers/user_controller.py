from models.User import User
from werkzeug.security import generate_password_hash

def createUser(name, role, password):
    password = generate_password_hash(password)
    user = User(name=name, role=role, password=password)
    user.save()
    return "sucesso"

def getUser(name):
    try:
        user = User.get(User.name == name)
        return user
    except User.DoesNotExist:
        return None