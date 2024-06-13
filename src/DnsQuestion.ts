export class DnsQuestion {
    private domain: string;

    constructor(domain: string) {
        this.domain = domain;
    }

    writeToBuffer(buffer: Buffer, offset: number): void {
        const labels = this.domain.split('.');
        for (const label of labels) {
            buffer.writeUInt8(label.length, offset++);
            buffer.write(label, offset, 'ascii');
            offset += label.length;
        }
        buffer.writeUInt8(0, offset++); // Null terminator for the domain name
        buffer.writeUInt16BE(1, offset); // QTYPE (A record)
        offset += 2;
        buffer.writeUInt16BE(1, offset); // QCLASS (IN)
    }

    getSize(): number {
        return this.domain.split('.').reduce((prev, label) => prev + label.length + 1, 5);
    }

    getDomain(): string {
        return this.domain;
    }
}
