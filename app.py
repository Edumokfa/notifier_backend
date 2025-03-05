from flask import Flask, request, jsonify
import datetime
from controllers import mail_sender_controller


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

if __name__ == '__main__':
    app.run(debug=True)
