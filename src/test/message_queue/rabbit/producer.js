const amqp = require("amqplib");

const message = "hello rabbit";

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost");
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        // durable = false thì  khi server bị crash thì dữ liệu trong hàng đợi sẻ bị mất
        await channel.assertQueue(queueName, {
            durable: true,
        });
        //buffer là vẫn chuyển dữ liệu bằng byte nhanh hơn object bình thường dùng buffer nhanh và mã hóa thông điệp
        channel.sendToQueue(queueName, Buffer.from(message), {
            expiration: "10000" ,//ttl time to live 
            persistent: true// tin nhawn lien tuc duoc luu vao o dia hoac cache neu cache co van de thi lay tu o dia chay mac dinh lay tu cache
        });

        // close connection and channel
        console.log("message:::", message);
    } catch (error) {
        console.error(error);
    }
};
runProducer().catch(console.error);
