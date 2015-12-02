#!/usr/bin/python
#
import os

def sendMail(server, user, pwd, subject, body):
    from email.mime.text import MIMEText
    from email.MIMEMultipart import MIMEMultipart

    user_account = '{0}@{1}'.format(user, server)
    recipients = [user_account]
    sender = user_account

    message = MIMEMultipart()
    message['Subject'] = subject
    message['From'] = '{0}<{1}>'.format(user, user_account)
    message['To'] = ';'.join(recipients)

    message.attach(MIMEText(body))

    import smtplib
    session = smtplib.SMTP(server)
    session.login(user, pwd)
    session.sendmail(sender, recipients, message.as_string())
    session.close()
    print 'Mail sent successfully'

if __name__ == '__main__':
    from argparse import (ArgumentParser, FileType)

    parser = ArgumentParser(description = "Send email.")
    parser.add_argument("--subject", metavar = "S", help = "subject of email")
    parser.add_argument("--body", metavar = "B", help = "body of email")

    args = parser.parse_args()  
    print args

    server = os.getenv('MY_MAIL_SERVER', '163.com')
    user = os.getenv('MY_MAIL_ACCOUNT')
    pwd = os.getenv('MY_MAIL_PWD')

    sendMail(server, user, pwd, args.subject, args.body)
