

export class DnsQuestion {
    private domain: string;
    private queryType: string;

    constructor(domain: string, queryType: string = 'A') {
        this.domain = domain;
        this.queryType = queryType.toUpperCase();
    }

    static fromBuffer(buffer: Buffer, offset: number): DnsQuestion {
        let domainParts = [];
        let length = buffer.readUInt8(offset++);
        while (length !== 0) {
            domainParts.push(buffer.toString('ascii', offset, offset + length));
            offset += length;
            length = buffer.readUInt8(offset++);
        }
        const domain = domainParts.join('.');
        const qtype = buffer.readUInt16BE(offset);
        offset += 2;
        const qclass = buffer.readUInt16BE(offset);
        offset += 2;

        let queryType;
        switch (qtype) {
            case 1:
                queryType = 'A';
                break;
            case 28:
                queryType = 'AAAA';
                break;
            case 5:
                queryType = 'CNAME';
                break;
            default:
                queryType = 'UNKNOWN';
                break;
        }
        return new DnsQuestion(domain, queryType);
    }

    getLength(): number {
        return this.domain.split('.').reduce((prev, label) => prev + label.length + 1, 1) + 4;
    }

    writeToBuffer(buffer: Buffer, offset: number): number {
        const labels = this.domain.split('.');
        for (const label of labels) {
            buffer.writeUInt8(label.length, offset++);
            buffer.write(label, offset, 'ascii');
            offset += label.length;
        }
        buffer.writeUInt8(0, offset++); // Null terminator for the domain name

        let qtype;
        switch (this.queryType) {
            case 'AAAA':
                qtype = 28;
                break;
            case 'CNAME':
                qtype = 5;
                break;
            case 'A':
            default:
                qtype = 1;
                break;
        }

        buffer.writeUInt16BE(qtype, offset); // QTYPE
        offset += 2;
        buffer.writeUInt16BE(1, offset); // QCLASS (IN)
        offset += 2;

        return offset;
    }

    getDomain(): string {
        return this.domain;
    }
}

