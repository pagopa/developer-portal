# Locust load tests

To run the load tests with [Locust](https://locust.io/):

- Write your `.env` file starting from the `.env.example`: replace the values of the variables.
- Run `docker compose up --scale worker=8` in this folder: it starts a master node and 8 worker nodes.
  The number of workers could be the same as the number of the cores of your machine.
- Go to [http://localhost:8089/](http://localhost:8089/) to access the GUI.
- If you need, change the _user_, _spawn rate_ and _host_ params as you want.
- Press _Star swarming_.

Note: Locust runs via Docker and can access to your localhost thanks the param `extra_hosts` applied to the services.
Then, you can _swarm_ you localhost using `http://localhost:8080` or whatever you want as **host** params of Locust.
