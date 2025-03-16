from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import jwt
import functools
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from controllers import mail_sender_controller, whatsapp_controller, user_controller
from connectors import mysql_connector
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuração de segurança
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['JWT_EXPIRATION_DELTA'] = int(os.environ.get('JWT_EXPIRATION_DELTA', 3600))  # 1 hora em segundos

CORS(app)

notificacoes = []

def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token de autenticação não fornecido'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"], options={"verify_signature": False})
            current_user = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado. Faça login novamente'}), 401
        except Exception as e:
            print(f"Erro na decodificação: {str(e)}")
            return jsonify({'message': 'Token inválido'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @functools.wraps(f)
    def decorated(current_user, *args, **kwargs):
        user = user_controller.getUser(current_user)
        if not user or user.role != 'admin':
            return jsonify({'message': 'Permissão negada: requer privilégios de administrador'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Não foi possível verificar', 'WWW-Authenticate': 'Basic auth="Login required"'}), 401
    
    username = auth.get('username')
    
    user = user_controller.getUser(username)
    if not user:
        return jsonify({'message': 'Usuário ou senha inválidos'}), 401
        
    if check_password_hash(user.password, auth.get('password')):
        token = jwt.encode({
            'username': username,
            'exp': datetime.utcnow() + timedelta(seconds=app.config['JWT_EXPIRATION_DELTA'])
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({'token': token})
        
    return jsonify({'message': 'Usuário ou senha inválidos'}), 401

@app.route('/register', methods=['POST'])
@token_required
@admin_required
def register_user(current_user):
    data = request.json
    
    if not data or not data.get('username') or not data.get('password') or not data.get('role'):
        return jsonify({'message': 'Dados incompletos'}), 400
        
    username = data.get('username')
    user = user_controller.getUser(username)
    if not user:
        return jsonify({'message': 'Usuário já existe'}), 409

    user_controller.createUser(username, data.get('role'), data.get('password'))    
    
    return jsonify({'message': 'Usuário criado com sucesso'})

def enviar_whatsapp(mensagem, telefone):
    return f"Mensagem enviada via WhatsApp para {telefone}: {mensagem}"

def enviar_sms(mensagem, telefone):
    return f"Mensagem enviada via SMS para {telefone}: {mensagem}"

def enviar_email(mensagem, telefone):
    return f"Mensagem enviada via SMS para {telefone}: {mensagem}"

@app.route('/notificar', methods=['POST'])
@token_required
def notificar(current_user):
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
        "data_envio": datetime.now().isoformat(),
        "status": "enviado",
        "usuario": current_user
    }
    notificacoes.append(registro)
    
    return jsonify({"mensagem": "Notificação enviada"})

@app.route('/auditoria', methods=['GET'])
@token_required
def auditoria(current_user):
    return jsonify(notificacoes)

@app.route('/createTables', methods=['GET'])
@token_required
@admin_required
def pewee(current_user):
    return mysql_connector.createTables()

@app.route('/insertTables', methods=['POST'])
@token_required
@admin_required
def insertEnv(current_user):
    data = request.json
    return mysql_connector.insertEnv(data['name'], data['cpfCnpj'], data['whatsappAccessToken'], data['whatsappPhoneNumber'], data['whatsappBusinessId'], data['email'], data['emailToken'])

@app.route('/sendFirstMessage', methods=['POST'])
@token_required
@admin_required
def sendFirstMessage(current_user):
    data = request.json
    return whatsapp_controller.send_first_message(data['phone_number'], data['key_wpp'], data['template_wpp'], data['phone_number_id'], data['components'])

@app.route('/webhook', methods=['GET'])
def configureWebhook():
    return whatsapp_controller.whatsapp_webhook(request)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)