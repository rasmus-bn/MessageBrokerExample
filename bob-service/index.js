const serviceName = 'Bob';
const orderQ = `greetOrder${serviceName}`;
const helloQ = `hello${serviceName}`;
const responseQ = `response${serviceName}`;

const services = {
    Alice: true,
    John: true,
    Bob: true,
};
services[serviceName] = false;

let channel;

function doLog(msg) {
    console.log(`(${serviceName}) ${msg}`);
}

function setupCmdQ () {
    return channel.assertQueue(orderQ).then((ok) => {
        return channel.consume(orderQ, (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                doLog(`received greet order: ${content}`);
                if (services[content] === true) {
                    sendMsgTo(`hello${content}`);
                } else {
                    doLog(`politely greeting myself ${content}`);
                }
                channel.ack(msg);
            } else { 
                doLog(`recieved null message: ${msg}`); 
            }
        });
    });
}

function setupHelloQ () {
    return channel.assertQueue(helloQ).then((ok) => {
        return channel.consume(helloQ, (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                doLog(`received friendly greeting: ${content}`);
                if (services[content] === true) {
                    sendMsgTo(`response${content}`);
                } else {
                    doLog(`received own message: ${content}`);
                }
                channel.ack(msg);
            } else { 
                doLog(`recieved null message: ${msg}`); 
            }
        });
    });
}

function setupResponseQ () {
    return channel.assertQueue(responseQ).then((ok) => {
        return channel.consume(responseQ, (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                doLog(`received greet response: ${content}`);
                channel.ack(msg);
            } else { 
                doLog(`recieved null message: ${msg}`); 
            }
        });
    });
}

function sendMsgTo(queueName) {
    doLog(`sends message to ${queueName}: ${serviceName}`);
    return channel.assertQueue(queueName).then((ok) => {
        return channel.sendToQueue(queueName, Buffer.from(serviceName));
    });
}

doLog('running...');
setTimeout(() => {
    doLog('following the white rabbit...');
    let connPromise = require('amqplib').connect('amqp://rabbitmq');
    connPromise.then((con) => {
        return con.createChannel();
    }).then((ch) => {
        channel = ch;
        setupCmdQ();
        setupHelloQ();
        setupResponseQ();
    }).catch(console.warn);
}, 10000);
