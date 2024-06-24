
import * as dgram from 'dgram';
import * as net from 'net';

// Abstract class representing a transport method for sending packets.
abstract class TransportMethod {
    protected serverAddress: string;
    protected port: number;

    constructor(serverAddress: string, port: number) {
        this.serverAddress = serverAddress;
        this.port = port;
    }

    abstract sendPacket(packet: Buffer): Promise<Buffer>;
    abstract close(): void;
}

class UdpTransportMethod extends TransportMethod {
    private udpSocket: dgram.Socket;
    private responseBuffer: Buffer;

    constructor(serverAddress: string, port: number) {
        super(serverAddress, port);
        this.udpSocket = dgram.createSocket('udp4');
        this.responseBuffer = Buffer.alloc(0);
        this.setupListeners();
    }

    private setupListeners() {
        this.udpSocket.on('message', (message) => {
            this.responseBuffer = Buffer.concat([this.responseBuffer, message]);
        });

        this.udpSocket.on('error', (err) => {
            console.error(`UDP Socket error:\n${err.stack}`);
            this.udpSocket.close();
        });

        this.udpSocket.on('close', () => {
        });
    }

    async sendPacket(packet: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.udpSocket.send(packet, 0, packet.length, this.port, this.serverAddress, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                setTimeout(() => {
                    if (this.responseBuffer.length > 0) {
                        resolve(this.responseBuffer);
                        this.responseBuffer = Buffer.alloc(0); // Reset buffer for the next response
                    } else {
                        reject(new Error('Request timed out'));
                    }
                }, 5000); // Timeout set to 5 seconds
            });
        });
    }

    close(): void {
        this.udpSocket.close();
    }
}

class TcpTransportMethod extends TransportMethod {
    private tcpSocket: net.Socket;

    constructor(serverAddress: string, port: number) {
        super(serverAddress, port);
        this.tcpSocket = new net.Socket();
    }

    async sendPacket(packet: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.tcpSocket.connect(this.port, this.serverAddress, () => {
                const lengthBuffer = Buffer.alloc(2);
                lengthBuffer.writeUInt16BE(packet.length, 0);
                this.tcpSocket.write(lengthBuffer);
                this.tcpSocket.write(packet);
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

            this.tcpSocket.on('error', (err) => {
                console.error(`TCP Socket error:\n${err.stack}`);
                this.tcpSocket.destroy();
                reject(err);
            });

            this.tcpSocket.on('close', () => {
                console.error('TCP Socket closed unexpectedly');
            });

            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, 5000);
        });
    }

    close(): void {
        this.tcpSocket.destroy();
    }
}




class PacketSender {
    private udpMethod: UdpTransportMethod;
    private tcpMethod: TcpTransportMethod;

    constructor(serverAddress: string, port: number) {
        this.udpMethod = new UdpTransportMethod(serverAddress, port);
        this.tcpMethod = new TcpTransportMethod(serverAddress, port);
    }

    async sendPacket(packet: Buffer): Promise<Buffer> {
        const method = this.selectTransportMethod(packet);
        return this.retryPacket(method, packet, 3);
    }

    private async retryPacket(method: TransportMethod, packet: Buffer, retries: number): Promise<Buffer> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Attempt ${attempt} to send packet`);
                return await method.sendPacket(packet);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Attempt ${attempt} failed: ${error.message}`);
                } else {
                    console.error(`Attempt ${attempt} failed: ${String(error)}`);
                }
                if (attempt === retries) {
                    throw error;
                }
            }
        }
        throw new Error('All retry attempts failed');
    }

    private selectTransportMethod(packet: Buffer): TransportMethod {
        if (packet.length <= 512) {
            return this.udpMethod;
        } else {
            return this.tcpMethod;
        }
    }

    close(): void {
        this.udpMethod.close();
        this.tcpMethod.close();
    }
}

export { TransportMethod, TcpTransportMethod, UdpTransportMethod, PacketSender };



