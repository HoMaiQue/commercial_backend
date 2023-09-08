const amqp = require("amqplib");

const msg = process.argv.slice(2).join(" ") || "hello";

const receiveNoti = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost");
        const channel = await connection.createChannel();

        const exchangeName = "video";

        await channel.assertExchange(exchangeName, "fanout", {
            durable: false,
        });
        const {
            queue, // name queue
        } = await channel.assertQueue("", {
            exclusive: true //
        });

        console.log(`nameQueue::${queue}`)
        //5 binding
        await channel.bindQueue(queue, exchangeName, "")

        await channel.consume(queue, msg=> {
            console.log(`msg:::`, msg.content.toString())
        }, {
            noAck: true
        })
        //fanout ai muon nhan thi cu nhan thoai mai mien la dang ky
    } catch (error) {
        console.error(error);
    }
};
receiveNoti().catch(console.error);
