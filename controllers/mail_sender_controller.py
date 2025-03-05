import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_email(destinatario, assunto, mensagem, remetente="100559@aluno.uricer.edu.br", senha="03196155021"):
    try:
        servidor = smtplib.SMTP("smtp.gmail.com", 587)
        servidor.starttls()
        servidor.login(remetente, senha)

        msg = MIMEMultipart()
        msg["From"] = remetente
        msg["To"] = destinatario
        msg["Subject"] = assunto
        msg.attach(MIMEText(mensagem, "plain"))

        servidor.sendmail(remetente, destinatario, msg.as_string())
        servidor.quit()

        print("E-mail enviado com sucesso!")

    except Exception as e:
        print(f"Erro ao enviar o e-mail: {e}")