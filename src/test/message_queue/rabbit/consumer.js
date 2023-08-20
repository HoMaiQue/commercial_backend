const amqp = require("amqplib");

const runConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost");
        const channel = await connection.createChannel();

        const queueName = "test-topic";

        await channel.assertQueue(queueName, {
            durable: true,
        });

        channel.consume(queueName, (messages)=> {
            console.log(`Receive ${messages.content.toString()} messages`);
        }, {
            noAck: true // neu du lieu da xu ly roi thi khong gui lai nua  
        });
        // console.log("message:::", message);
    } catch (error) {
        console.error(error);
    }
};
runConsumer().catch(console.error);
