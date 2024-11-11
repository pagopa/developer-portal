import os
from locust import HttpUser

class WebUser(HttpUser):
  bearer_token = os.environ['BEARER_TOKEN']

  # Perform GET request
  def get(self, endpoint, params = None):
    response = self.client.get(
      f'/{endpoint}',
      params = params,
      headers = { 'Authorization': f'Bearer {self.bearer_token}' } 
    )
    #print('The request "{request}" with params "{params}" has response: {response}'.format(request=endpoint, params=payload, response=response.json()))
    return response

  def post(self, endpoint, payload):
    response = self.client.post(
      f'/{endpoint}',
      json = payload,
      headers = { 'Authorization': f'Bearer {self.bearer_token}' }
    )
    #print('The request "{request}" with payload "{params}" has response: {response}'.format(request=endpoint, params=payload, response=response.json()))
    return response


