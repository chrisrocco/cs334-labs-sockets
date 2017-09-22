"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const dgram = require("dgram");
const rand = require("random-int");
let port = 3310;
let host = "localhost";
let blazerID = "chrisrocco7";
let client = new net.Socket();
client.connect(port, host, function () {
    /* send blazer ID */
    client.write(blazerID);
    /* wait for response */
    client.on("data", function (dataBuffer) {
        /* parsing port received from robot*/
        let port = parseInt(dataBuffer.toString("utf-8", 0, 5));
        /* start server on that port */
        let server = net.createServer();
        server.listen(port, host);
        server.on('connection', function (sock) {
            /* listen for response */
            sock.on("data", function (dataBuffer) {
                let str = dataBuffer.toString("utf-8", 0, 12);
                let strArr = str.split(",");
                let fffff = parseInt(strArr[0]);
                let eeeee = parseInt(strArr[1]);
                let num = rand(5, 10);
                /* send num on port fffff over UDP */
                let message = Buffer.from(num.toString());
                let client4 = dgram.createSocket('udp4');
                client4.send(message, fffff, host);
                /* wait for response */
                let server4 = dgram.createSocket('udp4');
                server4.on('message', (msgBuffer, rinfo) => {
                    let str = msgBuffer.toString("utf-8", 0, num * 10);
                    for (let i = 0; i < 5; i++) {
                        setTimeout(function () {
                            client4.send(Buffer.from(str), fffff, host);
                        }, 1000);
                    }
                });
                server4.bind(eeeee);
            });
        });
    });
});
//# sourceMappingURL=index.js.map