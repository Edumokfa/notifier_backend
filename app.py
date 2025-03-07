from flask import Flask, request, jsonify
import datetime
from controllers import mail_sender_controller, whatsapp_controller
from connectors import mysql_connector


app = Flask(__name__)

notificacoes = []

def enviar_whatsapp(mensagem, telefone):
    return f"Mensagem enviada via WhatsApp para {telefone}: {mensagem}"

def enviar_sms(mensagem, telefone):
    return f"Mensagem enviada via SMS para {telefone}: {mensagem}"

def enviar_email(mensagem, telefone):
    return f"Mensagem enviada via SMS para {telefone}: {mensagem}"

@app.route('/notificar', methods=['POST'])
def notificar():
    dados = request.json
    contribuinte = dados.get("contribuinte")
    telefone = dados.get("telefone")
    email = dados.get("email")
    canal = dados.get("canal")
    mensagem = dados.get("mensagem")
    
    if not (contribuinte and telefone and canal and mensagem and email):
        return jsonify({"erro": "Dados incompletos"}), 400
    
    if canal == "whatsapp":
        enviar_whatsapp(mensagem, telefone)
    elif canal == "sms":
        enviar_sms(mensagem, telefone)
    elif canal == "email":
        mail_sender_controller.enviar_email(email, 'Notificação de teste', mensagem)
    else:
        return jsonify({"erro": "Canal inválido"}), 400
    
    registro = {
        "contribuinte": contribuinte,
        "telefone": telefone,
        "canal": canal,
        "mensagem": mensagem,
        "data_envio": datetime.datetime.now().isoformat(),
        "status": "enviado"
    }
    notificacoes.append(registro)
    
    return jsonify({"mensagem": "Notificação enviada"})

@app.route('/auditoria', methods=['GET'])
def auditoria():
    return jsonify(notificacoes)

@app.route('/createTables', methods=['GET'])
def pewee():
    return mysql_connector.createTables()

@app.route('/insertTables', methods=['POST'])
def insertEnv():
    data = request.json
    return mysql_connector.insertEnv(data['name'], data['cpfCnpj'], data['whatsappAccessToken'], data['whatsappPhoneNumber'], data['whatsappBusinessId'], data['email'], data['emailToken'])

@app.route('/sendFirstMessage', methods=['POST'])
def sendFirstMessage():
    data = request.json
    return whatsapp_controller.send_first_message(data['phone_number'], data['key_wpp'], data['template_wpp'], data['bot_name'])

@app.route('/webhook', methods=['GET'])
def configureWebhook():
    return whatsapp_controller.whatsapp_webhook(request)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
