

export class DnsAnswer {
    private name: string;
    private type: string;
    private class: number;
    private ttl: number;
    private rdLength: number;
    private rdata: string;

    constructor() {
        this.name = '';
        this.type = '';
        this.class = 0;
        this.ttl = 0;
        this.rdLength = 0;
        this.rdata = '';
    }

    static fromBuffer(buffer: Buffer, offset: number): DnsAnswer {
        const answer = new DnsAnswer();
        const bytesParsed = answer.parse(buffer, offset);
        console.log(`Parsed DNS answer from buffer, ${bytesParsed} bytes processed.`);
        return answer;
    }

    getLength(): number {
        const fixedFieldsLength = 10; // 2 (type) + 2 (class) + 4 (TTL) + 2 (RDLength)
        const nameLength = this.name.split('.').reduce((prev, label) => prev + label.length + 1, 1);
        const rdataLength = this.rdLength;
        return nameLength + fixedFieldsLength + rdataLength;
    }

    parse(buffer: Buffer, offset: number): number {
        const initialOffset = offset;
        console.log(`Initial offset: ${offset}`);
        
        const nameAndOffset = this.parseName(buffer, offset);
        this.name = nameAndOffset.name;
        offset = nameAndOffset.offset;
        console.log(`Parsed name: ${this.name}, new offset: ${offset}`);

        const typeCode = buffer.readUInt16BE(offset);
        this.type = this.getTypeString(typeCode);
        offset += 2;
        console.log(`Parsed type: ${this.type} (code: ${typeCode}), new offset: ${offset}`);

        this.class = buffer.readUInt16BE(offset);
        offset += 2;
        console.log(`Parsed class: ${this.class}, new offset: ${offset}`);

        this.ttl = buffer.readUInt32BE(offset);
        offset += 4;
        console.log(`Parsed TTL: ${this.ttl}, new offset: ${offset}`);

        this.rdLength = buffer.readUInt16BE(offset);
        offset += 2;
        console.log(`Parsed RDLength: ${this.rdLength}, new offset: ${offset}`);

        this.rdata = this.parseRData(buffer, offset, this.rdLength, this.type);
        offset += this.rdLength;
        console.log(`Parsed RData: ${this.rdata}, new offset: ${offset}`);

        return offset - initialOffset;
    }

    private parseName(buffer: Buffer, offset: number): { name: string, offset: number } {
        let labels: string[] = [];
        let jumped = false;
        let originalOffset = offset;
        console.log(`parseName initial offset: ${offset}`);

        while (true) {
            const length = buffer.readUInt8(offset++);
            if ((length & 0xc0) === 0xc0) {
                if (!jumped) {
                    originalOffset = offset + 1;
                }
                jumped = true;
                offset = ((length & 0x3f) << 8) | buffer.readUInt8(offset);
                console.log(`parseName jumped to offset: ${offset}`);
            } else if (length === 0) {
                break;
            } else {
                if (offset + length > buffer.length) {
                    throw new RangeError(`Offset out of range. Offset: ${offset}, Length: ${length}, Buffer Length: ${buffer.length}`);
                }
                labels.push(buffer.toString('ascii', offset, offset + length));
                offset += length;
                console.log(`parseName label: ${labels[labels.length - 1]}, offset: ${offset}`);
            }
        }

        if (jumped) {
            offset = originalOffset;
        }

        console.log(`parseName final offset: ${offset}`);
        return { name: labels.join('.'), offset };
    }

    private parseRData(buffer: Buffer, offset: number, length: number, type: string): string {
        if (type === 'A') {
            return Array.from(buffer.slice(offset, offset + length)).join('.');
        } else if (type === 'AAAA') {
            return Array.from(buffer.slice(offset, offset + length))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join(':');
        } else if (type === 'CNAME') {
            return this.parseName(buffer, offset).name;
        } else {
            return buffer.slice(offset, offset + length).toString('hex');
        }
    }

    private getTypeString(typeCode: number): string {
        const typeMap: { [key: number]: string } = {
            1: 'A',
            28: 'AAAA',
            5: 'CNAME',
        };

        return typeMap[typeCode] || `UNKNOWN (${typeCode})`;
    }

    getName(): string {
        return this.name;
    }

    getType(): string {
        return this.type;
    }

    getClass(): number {
        return this.class;
    }

    getTTL(): number {
        return this.ttl;
    }

    getRdlength(): number {
        return this.rdLength;
    }

    getRdata(): string {
        return this.rdata;
    }
}
