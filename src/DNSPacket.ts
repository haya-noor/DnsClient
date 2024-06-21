
import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';

export class DNSPacket {
    private header: DnsHeader;
    private questions: DnsQuestion[];
    private offset: number;

    constructor(domains: string[], queryType: string) {
        this.questions = domains.map(domain => new DnsQuestion(domain, queryType));
        this.header = new DnsHeader(
            Math.floor(Math.random() * 65535), // Random ID
            this.questions.length, // QDCOUNT
            0 // ANCOUNT (no answers in the query)
        );
        this.offset = 0;
    }

    getBuffer(): Buffer {
        const buffer = Buffer.alloc(512); // Allocate enough space for the DNS packet
        this.offset = 0;

        this.offset = this.writeHeaderToBuffer(buffer, this.offset);
        this.offset = this.writeQuestionsToBuffer(buffer, this.offset);

        return buffer.slice(0, this.offset);
    }

    private writeHeaderToBuffer(buffer: Buffer, offset: number): number {
        return this.header.writeToBuffer(buffer, offset);
    }

    private writeQuestionsToBuffer(buffer: Buffer, offset: number): number {
        for (const question of this.questions) {
            offset = question.writeToBuffer(buffer, offset);
        }
        return offset;
    }

    getOffset(): number {
        return this.offset;
    }
}
