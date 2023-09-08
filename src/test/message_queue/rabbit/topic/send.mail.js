const amqp = require("amqplib");

const msg = process.argv.slice(2).join(" ") || "hello";

const sendEmail = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost");
        const channel = await connection.createChannel();

        const exchangeName = "send_email";

        await channel.assertExchange(exchangeName, "topic", {
            durable: false,
        });

        const args = process.argv.slice(2);
        const msg = args[1] || "fixed!";
        const topic = args[0];

        console.log(`msg::${msg}::::${topic}`);
        //"" co nghia la khong muon bat cu hang doi nao cu the
        await channel.publish(exchangeName, topic, Buffer.from(msg));

        console.log(`send message:::${msg}`);
    } catch (error) {
        console.error(error);
    }
};
sendEmail().catch(console.error);
