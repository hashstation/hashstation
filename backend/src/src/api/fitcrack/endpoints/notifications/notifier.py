import apprise

from src.database.models import FcNotification, FcSettings, FcUser
from src.database import db

from src.api.fitcrack.lang import job_status_text_info_to_code_dict

class Notification:
    def __init__(self, title, body):
        self.title = title
        self.body = body

def notify(userId):
    settings = FcSettings.query.filter_by(user_id=userId).one()
    apobj = apprise.Apprise()

    if settings.discord_notifications:
        apobj.add(settings.discord_webhook_url)

        for user in FcUser.query.all():
            new_notifications = FcNotification.query.filter(FcNotification.user_id == userId).filter(FcNotification.discord_sent == False)
            
            for notif in new_notifications:
                title = notif.source.name if notif.source else '<Removed Job>'
                body = title + ": " + job_status_text_info_to_code_dict[notif.new_value]
                print(title, body)
            
                apobj.notify(body=body)
                notif.discord_sent = True

            db.session.commit()