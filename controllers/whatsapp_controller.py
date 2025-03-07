from flask import jsonify
import os
import requests

def whatsapp_webhook(request):
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    
    if mode and token:
        if mode == "subscribe" and token == 'ABCD': #Colocar o token do environment
            return challenge, 200
        else:
            return "", 403

def enviar_mensagem(request):
    data = request.get_json()
    
    if data.get("object"):
        key_wpp = data.get("key_wpp")
        bot_name = data.get("bot_name")
        entry = data.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})
        phone_number_id = value.get("metadata", {}).get("phone_number_id")
        messages = value.get("messages", [{}])[0]
        from_number = messages.get("from")
        
        #send_whatsapp_message(from_number, response_message, phone_number_id, key_wpp)
        return jsonify({"status": "success"}), 200
    
    return jsonify({"error": "Not Found"}), 404

def send_whatsapp_message(phone_number, message, phone_number_id, key_wpp):
    url = f"{os.getenv('FACEBOOK_API_URL')}{phone_number_id}/messages?access_token={key_wpp}"
    json_api = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "text": {"body": message},
    }
    try:
        response = requests.post(url, json=json_api)
        response.raise_for_status()
    except requests.exceptions.RequestException as error:
        print(error)

def send_first_message(phone_number, key_wpp, template_wpp, bot_name, phone_number_id):
    url = f"{os.getenv('FACEBOOK_API_URL')}{phone_number_id}/messages?access_token={key_wpp}"
    message = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "template",
        "template": {
            "name": template_wpp,
            "language": {"code": "pt_BR"},
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": bot_name,
                        }
                    ],
                }
            ],
        },
    }
    try:
        response = requests.post(url, json=message)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        return {"error": 404, "message": str(error), "details": response.text if response else "Sem resposta do servidor"}