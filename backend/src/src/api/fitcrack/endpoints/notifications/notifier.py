import apprise

from src.database.models import FcNotification, FcSettings, FcUser
from src.database import db

from src.api.fitcrack.lang import job_status_text_info_to_code_dict

class Notification:
    def __init__(self, title, body):
        self.title = title
        self.body = body

def notify(user):
    userId = user.id
    settings = FcSettings.query.filter_by(user_id=userId).one()
    apobj = apprise.Apprise()

    if settings.discord_notifications:
        apobj.add('discord://' + settings.discord_webhook_id + '/' + settings.discord_webhook_token)

        new_discord_notifications = FcNotification.query.filter(FcNotification.user_id == userId).filter(FcNotification.discord_sent == False)
        for notif in new_discord_notifications:
            title = notif.source.name if notif.source else '<Removed Job>'
            body = title + ": " + job_status_text_info_to_code_dict[notif.new_value]
        
            apobj.notify(body=body)
            notif.discord_sent = True

        db.session.commit()

    if settings.telegram_notifications:
        apobj.add('tgram://' + settings.telegram_bot_token + '/' + settings.telegram_chat_id)

        new_telegram_notifications = FcNotification.query.filter(FcNotification.user_id == userId).filter(FcNotification.telegram_sent == False)
        for notif in new_telegram_notifications:
            title = notif.source.name if notif.source else '<Removed Job>'
            body = title + ": " + job_status_text_info_to_code_dict[notif.new_value]
        
            apobj.notify(body=body)
            notif.telegram_sent = True

        db.session.commit()

    if settings.email_notifications:
        email_parts = settings.email_address.split('@')
        if len(email_parts) != 2:
            return

        username = email_parts[0]
        domain = email_parts[1]
        apobj.add('mailto://' + username + ':' + settings.email_password + '@' + domain +'?from=' + user.username)

        new_email_notifications = FcNotification.query.filter(FcNotification.user_id == userId).filter(FcNotification.email_sent == False)
        for notif in new_email_notifications:
            title = notif.source.name if notif.source else '<Removed Job>'
            body = job_status_text_info_to_code_dict[notif.new_value]
        
            apobj.notify(body=body, title=title)
            notif.email_sent = True

        db.session.commit()