import * as dgram from 'dgram';
import * as net from 'net';

export class TransportMethod {
    private udpSocket: dgram.Socket;
    private tcpSocket: net.Socket | null = null;
    private serverAddress: string;
    private port: number;
    private isTcp: boolean = false;

    constructor(serverAddress: string, port: number) {
        this.serverAddress = serverAddress;
        this.port = port;
        this.udpSocket = dgram.createSocket('udp4');

        this.udpSocket.on('error', (err) => {
            console.error(`UDP Socket error:\n${err.stack}`);
            this.udpSocket.close();
        });

        this.tcpSocket = new net.Socket();
        this.tcpSocket.on('error', (err) => {
            console.error(`TCP Socket error:\n${err.stack}`);
            this.tcpSocket?.destroy();
        });

        this.tcpSocket.on('close', () => {
            console.error('TCP Socket closed unexpectedly');
        });
    }

    sendPacket(packet: Buffer): Promise<Buffer> {
        this.isTcp = packet.length > 512;

        return new Promise((resolve, reject) => {
            if (this.isTcp) {
                this.sendTcpPacket(packet, resolve, reject);
            } else {
                this.sendUdpPacket(packet, resolve, reject);
            }
        });
    }

    private sendUdpPacket(packet: Buffer, resolve: (value: Buffer | PromiseLike<Buffer>) => void, reject: (reason?: any) => void): void {
        console.log(`Sending UDP packet with size: ${packet.length}`);
        this.udpSocket.send(packet, 0, packet.length, this.port, this.serverAddress, (err) => {
            if (err) {
                reject(err);
                return;
            }

            this.udpSocket.on('message', (message) => {
                console.log(`Received UDP response with size: ${message.length}`);
                resolve(message);
            });

            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, 5000);
        });
    }

    private sendTcpPacket(packet: Buffer, resolve: (value: Buffer | PromiseLike<Buffer>) => void, reject: (reason?: any) => void): void {
        if (!this.tcpSocket) {
            this.tcpSocket = new net.Socket();
        }

        this.tcpSocket.connect(this.port, this.serverAddress, () => {
            const lengthBuffer = Buffer.alloc(2);
            lengthBuffer.writeUInt16BE(packet.length, 0);
            this.tcpSocket?.write(lengthBuffer);
            this.tcpSocket?.write(packet);
            console.log(`Sending TCP packet with size: ${packet.length}`);
        });

        let responseBuffer: Buffer = Buffer.alloc(0);

        this.tcpSocket.on('data', (data) => {
            responseBuffer = Buffer.concat([responseBuffer, data]);
        });

        this.tcpSocket.on('end', () => {
            console.log(`Received TCP response with size: ${responseBuffer.length}`);
            resolve(responseBuffer);
        });

        setTimeout(() => {
            reject(new Error('Request timed out'));
        }, 5000);
    }

    close(): void {
        this.udpSocket.close();
        this.tcpSocket?.destroy();
    }
}
