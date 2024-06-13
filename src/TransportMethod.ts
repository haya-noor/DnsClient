import * as dgram from 'dgram';

export class TransportMethod {
    private socket: dgram.Socket;
    private serverAddress: string;
    private port: number;

    constructor(serverAddress: string, port: number) {
        this.serverAddress = serverAddress;
        this.port = port;
        this.socket = dgram.createSocket('udp4');

        this.socket.on('error', (err) => {
            console.error(`Socket error:\n${err.stack}`);
            this.socket.close();
        });
    }

    sendPacket(packet: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.socket.send(packet, 0, packet.length, this.port, this.serverAddress, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                const onMessage = (message: Buffer) => {
                    this.socket.removeListener('message', onMessage); // Remove the listener after the response is received
                    resolve(message);
                };

                this.socket.once('message', onMessage); // Use `once` to ensure the listener is only called once

                // Set a timeout in case no response is received
                setTimeout(() => {
                    this.socket.removeListener('message', onMessage); // Remove the listener if timeout occurs
                    reject(new Error('Request timed out'));
                }, 5000);
            });
        });
    }

    close() {
        this.socket.close();
    }
}
