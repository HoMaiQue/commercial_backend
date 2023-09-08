const amqp = require("amqplib");

const receiveEmail = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost");
        const channel = await connection.createChannel();

        const exchangeName = "send_email";

        await channel.assertExchange(exchangeName, "topic", {
            durable: false,
        });

        //create queue
        const { queue } = await channel.assertQueue("", {
            exclusive: true,
        });
        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0);
        }

        /** ky tu dai dien
         *  * co nghia la phu hop voi bat ky tu nao
         *  # khop voi 1 hoac nhieu tu bat ky
         */
        console.log(`waiting queue ${queue}:::topic::${args}`);

        args.forEach(async (key) => {
            await channel.bindQueue(queue, exchangeName, key);
            await channel.consume(
                queue,
                (msg) => {
                    console.log(`Routing key::${msg.fields.routingKey}:::${msg.content.toString()}`);
                },
                {
                    noAck: true,
                }
            );
        });
    } catch (error) {
        console.error(error);
    }
};
receiveEmail().catch(console.error);
