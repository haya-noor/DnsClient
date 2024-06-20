

export class DnsHeader {
    private id: number;
    private flags: number;
    private qdcount: number;
    private ancount: number;
    private nscount: number;
    private arcount: number;

    constructor(id: number, qdcount: number, ancount: number) {
        this.id = id;
        this.flags = 0x0100; // Standard query with recursion desired
        this.qdcount = qdcount;
        this.ancount = ancount;
        this.nscount = 0;
        this.arcount = 0;
    }

    writeToBuffer(buffer: Buffer, offset: number): number {
        buffer.writeUInt16BE(this.id, offset);
        buffer.writeUInt16BE(this.flags, offset + 2);
        buffer.writeUInt16BE(this.qdcount, offset + 4);
        buffer.writeUInt16BE(this.ancount, offset + 6);
        buffer.writeUInt16BE(this.nscount, offset + 8);
        buffer.writeUInt16BE(this.arcount, offset + 10);
        return offset + 12;
    }

    static fromBuffer(buffer: Buffer, offset: number): DnsHeader {
        const id = buffer.readUInt16BE(offset);
        const flags = buffer.readUInt16BE(offset + 2);
        const qdcount = buffer.readUInt16BE(offset + 4);
        const ancount = buffer.readUInt16BE(offset + 6);
        const nscount = buffer.readUInt16BE(offset + 8);
        const arcount = buffer.readUInt16BE(offset + 10);
        const header = new DnsHeader(id, qdcount, ancount);
        header.flags = flags;
        header.nscount = nscount;
        header.arcount = arcount;
        return header;
    }

    getFlags(): number {
        return this.flags;
    }

    getQdcount(): number {
        return this.qdcount;
    }

    getAncount(): number {
        return this.ancount;
    }

    getNscount(): number {
        return this.nscount;
    }

    getArcount(): number {
        return this.arcount;
    }
}


