const amqp = require("amqplib");

const messages = "new a product: title";

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost")
        const channel = await connection.createChannel();

        const notificationExchange = "notificationEX"; // notificationEX direct

        const notiQueueProcess = "notificationQueueProcess"; // assertQueue

        const notificationExchangeDLX = "notificationEXDLX"; // notificationEX direct
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // notificationEX direct
        //1 create exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        });
        //2 create queue
        const queueResult = await channel.assertQueue(notiQueueProcess, {
            exclusive: false, //  cho phep cac ket noi truy cap vao cung 1 luc hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        //3 bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);
        // send message

        const msg = "a new porduct";
        console.log("producer msg:::", msg);

        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000",
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

runProducer();
