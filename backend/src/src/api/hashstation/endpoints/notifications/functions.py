'''
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
'''

from sqlalchemy import desc

from src.api.hashstation.lang import job_status_text_info_to_code_dict, status_to_code
from src.database import db
from src.database.models import HsNotification


def getNotifications(userID, page, per_page, markAsSeen):
    notifications = []
    DBnotifications = HsNotification.query.filter(HsNotification.user_id == userID).order_by(
        desc(HsNotification.time)).paginate(page=page, per_page=per_page, error_out=True)
    for notif in DBnotifications.items:
        notifications.append(
            {
                'job_id': notif.source_id,
                'title': notif.source.name if notif.source else '<Removed Job>',
                'text': job_status_text_info_to_code_dict[notif.new_value],
                'type': getNotifType(notif.new_value),
                'seen': notif.seen,
                'time': notif.time
            }
        )
        if markAsSeen:
            notif.seen = True

    db.session.commit()
    DBnotifications.items = notifications
    return DBnotifications


def getNotifType(code):
    if code == status_to_code['ready'] or code == status_to_code['running'] or code == status_to_code['finishing']:
        return 'info'
    if code == status_to_code['finished']:
        return 'success'
    if code == status_to_code['timeout']:
        return 'warning'
    if code == status_to_code['exhausted'] or code == status_to_code['malformed']:
        return 'error'
