from common.web_user import WebUser
from datetime import timedelta, datetime
from locust import task, tag
from random import choice
import json

class UserTasks(WebUser):
  # def __init__(self):
  #   faqs = json.load(open('../faqs.json', 'r'))
  #   self.queries = [item['query'] for item in faqs]
  #   self.user = WebUser()

  # def on_start(self):
  #   self.login()

  #  def on_stop(self):
  #    self.logout()

  # /queries
  @tag('queries')
  @task(10)
  def queries(self):
    payload = {
      # TODO: Import qyeries from faqs.json
      "question": choice([
        "GPD gestisce gi\u00e0 i pagamenti rateali multipli?",
        "\u00c8 possibile pagare una posizione debitoria una volta scaduta?"
        "\u00c8 previsto un inserimento massivo delle posizioni debitorie?",
        "Nel caso di ente multi intermediato attivando la stazione broadcast tutti gli PT riceveranno tutte le notifiche anche di Posizioni debitorie anche quelle non di loro competenza? Se si come vengono rispettate le regole della privacy GDPR?"
      ]),
      "queriedAt": datetime.utcnow().isoformat() + "Z"
    }

    self.post('queries', payload)

  # /healthz
  @tag('healthz')
  @task
  def healthz(self):
    self.get('healthz')
