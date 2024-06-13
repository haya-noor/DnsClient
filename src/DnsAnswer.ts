export class DnsAnswer {
    private name: string;
    private type: number;
    private class: number;
    private ttl: number;
    private rdlength: number;
    private rdata: string;

    constructor() {
        this.name = '';
        this.type = 0;
        this.class = 0;
        this.ttl = 0;
        this.rdlength = 0;
        this.rdata = '';
    }

    writeToBuffer(buffer: Buffer, offset: number): void {
        // Typically, this method is not needed for DNS answers, but implemented for completeness
        const labels = this.name.split('.');
        labels.forEach(label => {
            buffer.writeUInt8(label.length, offset++);
            buffer.write(label, offset, 'ascii');
            offset += label.length;
        });
        buffer.writeUInt8(0, offset++); // Null terminator for the domain name

        buffer.writeUInt16BE(this.type, offset);
        offset += 2;
        buffer.writeUInt16BE(this.class, offset);
        offset += 2;
        buffer.writeUInt32BE(this.ttl, offset);
        offset += 4;
        buffer.writeUInt16BE(this.rdlength, offset);
        offset += 2;
        buffer.write(this.rdata, offset, 'ascii'); // Assuming rdata is a string, adjust as necessary
    }

    getSize(): number {
        return this.name.split('.').reduce((prev, label) => prev + label.length + 1, 1) + 10 + this.rdata.length;
    }

    parse(buffer: Buffer, offset: number): void {
        let end = offset;
        while (buffer[end] !== 0) end++;
        this.name = buffer.toString('ascii', offset, end);
        offset = end + 1;

        this.type = buffer.readUInt16BE(offset);
        offset += 2;
        this.class = buffer.readUInt16BE(offset);
        offset += 2;
        this.ttl = buffer.readUInt32BE(offset);
        offset += 4;
        this.rdlength = buffer.readUInt16BE(offset);
        offset += 2;
        this.rdata = buffer.toString('ascii', offset, offset + this.rdlength); // Adjust parsing logic as needed
    }

    getName(): string {
        return this.name;
    }

    getType(): number {
        return this.type;
    }

    getClass(): number {
        return this.class;
    }

    getTTL(): number {
        return this.ttl;
    }

    getRdlength(): number {
        return this.rdlength;
    }

    getRdata(): string {
        return this.rdata;
    }
}
