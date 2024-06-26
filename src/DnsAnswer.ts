
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
        return answer;
    }

    getLength(): number {
        // Length of the fixed fields (name pointer, type, class, TTL, RDLength)
        const fixedFieldsLength = 10; // 2 (type) + 2 (class) + 4 (TTL) + 2 (RDLength)

        // Length of the name field
        let nameLength = 0;
        if (this.name.includes(".")) {
            nameLength = this.name.split('.').reduce((prev, label) => prev + label.length + 1, 1);
        } else {
            // Assume compressed name if it's a pointer (2 bytes for pointer)
            nameLength = 2;
        }

        // Length of the RData field
        const rdataLength = this.rdLength;

        return nameLength + fixedFieldsLength + rdataLength;
    }

    parse(buffer: Buffer, offset: number): number {
        const initialOffset = offset;

        // Parse the name
        const nameAndOffset = this.parseName(buffer, offset);
        this.name = nameAndOffset.name;
        offset = nameAndOffset.offset;

        // Parse the type and convert it to string representation
        const typeCode = buffer.readUInt16BE(offset);
        this.type = this.getTypeString(typeCode);
        offset += 2;

        // Parse the class
        this.class = buffer.readUInt16BE(offset);
        offset += 2;

        //console.log(`Parsed class: ${this.class}, new offset: ${offset}`);

        // Parse the TTL
        this.ttl = buffer.readUInt32BE(offset);
        offset += 4;

        // Parse the RDLength
        this.rdLength = buffer.readUInt16BE(offset);
        offset += 2;

        //console.log(`Parsed RDLength: ${this.rdLength}, new offset: ${offset}`);


        // Parse the RData
        this.rdata = this.parseRData(buffer, offset, this.rdLength, this.type);
        offset += this.rdLength;
        return offset - initialOffset;
    }

    private parseName(buffer: Buffer, offset: number): { name: string, offset: number } {
        let labels: string[] = [];
        let jumped = false;
        let originalOffset = offset;

        while (true) {
            const length = buffer[offset++];
            if ((length & 0xc0) === 0xc0) {
                // Pointer to a previous part of the name
                if (!jumped) {
                    originalOffset = offset + 1;
                }
                jumped = true;
                offset = ((length & 0x3f) << 8) | buffer[offset];
            } else if (length === 0) {
                break;
            } else {
                labels.push(buffer.slice(offset, offset + length).toString('ascii'));
                offset += length;
            }
        }

        if (jumped) {
            offset = originalOffset;
        }

        return { name: labels.join('.'), offset };
    }

    private parseRData(buffer: Buffer, offset: number, length: number, type: string): string {
        if (type === 'A') {
            // IPv4 address
            return Array.from(buffer.slice(offset, offset + length)).join('.');
        } else if (type === 'AAAA') {
            // IPv6 address
            return Array.from(buffer.slice(offset, offset + length))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join(':');
        } else if (type === 'CNAME') {
            // CNAME
            return this.parseName(buffer, offset).name;
        } else {
            // Other types (e.g., raw data)
            return buffer.slice(offset, offset + length).toString('hex');
        }
    }

    private getTypeString(typeCode: number): string {
        const typeMap: { [key: number]: string } = {
            1: 'A',
            28: 'AAAA',
            5: 'CNAME',
            6: 'SOA',
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


