# Message broker example
I have created an example of a message broker. 
3 friendly services are sending greetings to each other. 
However none of them are talking directly to each other since all messages are directed through RabbitMQ. 
The services doesnt even need to expose any ports to each other. 
They only need to subscribe to queues and publish messages to RabbitMQ.



In order to run the code go to the root folder and run cmd:

  
  docker-compose up
  

This should spin up the 3 services and a docker container with RabbitMQ.
The service responses are written in the terminal.
To make the services talk to each other go to localhost:15672 and login with username 'guest' and password 'guest'.
Find a queue name 'greetOrder<name>' and publish a message containing only the name of another service.
Ex publish 'Bob' in 'greetOrderAlice'.
