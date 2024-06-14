
export class DnsHeader {
    private id: number;
    private flags: number;
    private qdcount: number;
    private ancount: number;
    private nscount: number;
    private arcount: number;

    constructor() {
        this.id = Math.floor(Math.random() * 65535);
        this.flags = 0x0100;
        this.qdcount = 1; // Initialize qdcount to 1
        this.ancount = 0;
        this.nscount = 0;
        this.arcount = 0;


        
    }

    writeToBuffer(buffer: Buffer, offset: number): void {
        buffer.writeUInt16BE(this.id, offset);
        buffer.writeUInt16BE(this.flags, offset + 2);
        buffer.writeUInt16BE(this.qdcount, offset + 4);
        buffer.writeUInt16BE(this.ancount, offset + 6);
        buffer.writeUInt16BE(this.nscount, offset + 8);
        buffer.writeUInt16BE(this.arcount, offset + 10);
        console.log(`Header written to buffer at offset: ${offset}`);
    }

    // Update qdcount based on the number of questions
    public updateQuestionCount(count: number): void {
        this.qdcount = count;
    }

    getSize(): number {
        return 12; // Size of the header in bytes
    }

    // Public setters for private properties
    public setId(id: number): void {
        this.id = id;
    }

    public setFlags(flags: number): void {
        this.flags = flags;
    }

    public setQdcount(qdcount: number): void {
        this.qdcount = qdcount;
    }

    public setAncount(ancount: number): void {
        this.ancount = ancount;
    }

    public setNscount(nscount: number): void {
        this.nscount = nscount;
    }

    public setArcount(arcount: number): void {
        this.arcount = arcount;
    }

    // Public getters for private properties
    public getQdcount(): number {
        return this.qdcount;
    }

    public getAncount(): number {
        return this.ancount;
    }

    public getNscount(): number {
        return this.nscount;
    }

    public getArcount(): number {
        return this.arcount;
    }
}
