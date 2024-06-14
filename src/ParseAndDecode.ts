
import { DnsAnswer } from './DnsAnswer';
import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';

export class ParseAndDecode {
    private offset: number = 0;

    constructor(private buffer: Buffer) {}

    public parse(): DnsHeader {
        const id = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;
        const flags = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;
        const qdcount = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;
        const ancount = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;
        const nscount = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;
        const arcount = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;

        const header = new DnsHeader();
        (header as any).id = id;
        (header as any).flags = flags;
        (header as any).qdcount = qdcount;
        (header as any).ancount = ancount;
        (header as any).nscount = nscount;
        (header as any).arcount = arcount;

        return header;
    }

    public parseQuestion(): DnsQuestion {
        const name = this.readName();
        const type = this.buffer.readUInt16BE(this.offset);
        this.offset += 2;

        return new DnsQuestion(name, type.toString());
    }

    public parseAnswer(): DnsAnswer {
        const answer = new DnsAnswer();
        const offsetIncrement = answer.parse(this.buffer, this.offset);
        this.offset += offsetIncrement;

        // Log the details to ensure correctness
        console.log(`Parsed Answer - Name: ${answer.getName()}, Type: ${answer.getType()}, Class: ${answer.getClass()}, TTL: ${answer.getTTL()}, RDLength: ${answer.getRdlength()}`);

        return answer;
    }

/*

labels: An array to store the individual labels (parts) of the domain name.
jumped: A flag to indicate if the code has followed a pointer (DNS names can use pointers to save space by reusing parts of other names).
originalOffset: Stores the original offset in the buffer before any potential pointer jumps.

*/

    private readName(): string {
        const labels: string[] = [];
        let jumped = false;
        let originalOffset = this.offset;

    /*
    This loop will continue reading bytes from the buffer until it reaches the end of the domain name (indicated by a length byte of 0).
    If the length byte's two most significant bits are 11 (i.e., 0xc0), this indicates a pointer to another part of the DNS message.
    The actual pointer value is constructed by combining the lower 6 bits of the current byte (length & 0x3f) with the next byte (this.buffer[this.offset]).
    jumped: Ensures the original offset is stored only once before following the pointer.
    this.offset: The offset is set to the pointer's location, effectively jumping to another part of the buffer.

    If the length byte is 0, it indicates the end of the domain name, and the loop breaks.
    Otherwise, it treats the byte as the length of the next label, reads the corresponding bytes from the buffer, converts them to a string, and adds them to the labels array.
    The offset is incremented by the length of the label.
    */

        while (true) {
            const length = this.buffer[this.offset++];
            if ((length & 0xc0) === 0xc0) {
                // Pointer to a previous part of the name
                if (!jumped) {
                    originalOffset = this.offset + 1;
                }
                jumped = true;
                this.offset = ((length & 0x3f) << 8) | this.buffer[this.offset];
            } else if (length === 0) {
                break;
            } else {
                labels.push(this.buffer.slice(this.offset, this.offset + length).toString('ascii'));
                this.offset += length;
            }
        }

        return labels.join('.');
    }
}



