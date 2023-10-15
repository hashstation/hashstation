from src.database import db
from src.database.models import HsJob

def getIdsFromBatch (id):
    ids = db.session.query(HsJob.id).filter_by(batch_id=id).all()
    return [x[0] for x in ids]