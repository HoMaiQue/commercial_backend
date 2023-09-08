const amqp = require("amqplib");

const msg= process.argv.slice(2).join(" ") || "hello";

const post = async ({msg}) => {
    try {
        const connection = await amqp.connect("amqp://guest:123456@localhost");
        const channel = await connection.createChannel();

        const exchangeName = "video";

        await channel.assertExchange(exchangeName, "fanout", {
            durable: false
        })
       //"" co nghia la khong muon bat cu hang doi nao cu the
        await channel.publish(exchangeName, "", Buffer.from(msg))

        console.log(`send message:::${msg}`)

        setTimeout(function () {
            connection.close()
            process.exit(0)
          }, 2000)
    } catch (error) {
        console.error(error);
    }
};
post({msg}).catch(console.error);
