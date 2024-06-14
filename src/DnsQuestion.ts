
export class DnsQuestion {
    private domain: string;
    private queryType: string;

    constructor(domain: string, queryType: string = 'A') {
        this.domain = domain;
        this.queryType = queryType.toUpperCase();
    }

    writeToBuffer(buffer: Buffer, offset: number): void {
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
        console.log(`Question for ${this.domain} with query type ${this.queryType} written to buffer at offset: ${offset}`);
    }

    getSize(): number {
        return this.domain.split('.').reduce((prev, label) => prev + label.length + 1, 5);
    }

    getDomain(): string {
        return this.domain;
    }
}
