import {Server, Socket} from "net";
const net = require("net");
const dgram = require("dgram");
const rand = require("random-int");


let port: number = 3310;
let localhost: string = "0.0.0.0";
let robothost: string = "localhost";
let blazerID = "chrisrocco7";

let client1 = new net.Socket();
client1.connect(port, robothost, function(){

    /* send blazer ID */
    client1.write(blazerID);

    /* wait for response */
    client1.on("data", function(dataBuffer: Buffer){
        client1.destroy();

        /* parsing port received from robot*/
        let port: number = parseInt(dataBuffer.toString("utf-8", 0, 5));

        /* start server on that port */
        let server: Server = net.createServer();
        server.listen(port, localhost);
        server.on('connection', function(sock: Socket) {

            /* listen for response */
            sock.on("data", function(dataBuffer: Buffer){
                sock.destroy();

                let str = dataBuffer.toString("utf-8", 0, 12);
                let strArr = str.split(",");
                let fffff = parseInt(strArr[0]);
                let eeeee = parseInt(strArr[1]);
                let num = rand(5, 10);

                /* send num on port fffff over UDP */
                let message = Buffer.from(num.toString());
                let client4 = dgram.createSocket('udp4');
                client4.send(message, fffff, robothost);

                /* wait for response */
                let server4 = dgram.createSocket('udp4');
                server4.on('message', (msgBuffer: Buffer, rinfo: any) => {
                    let str = msgBuffer.toString("utf-8", 0, num * 10);

                    for(let i = 0; i < 5; i++){
                        setTimeout(function(){
                            client4.send(Buffer.from(str), fffff, robothost);
                        }, 1000);
                    }
                });

                server4.bind(eeeee);
            })
        });
    })
});