from models.History import  History

def createHistory(author, title):
    history = History(author=author, title=title)
    history.save()
    return "sucesso"