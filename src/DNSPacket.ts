

import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';

export class DNSPacket {
    private header: DnsHeader;
    private questions: DnsQuestion[];
    private offset: number;

    constructor(domains: string[], queryType: string) {
        this.header = new DnsHeader();
        this.questions = domains.map(domain => new DnsQuestion(domain, queryType));
        this.header.updateQuestionCount(this.questions.length);
        this.offset = 0;
    }

    getBuffer(): Buffer {
        const buffer = Buffer.alloc(512); // Allocate enough space for the DNS packet
        this.offset = 0;

        console.log(`Initial offset: ${this.offset}`);
        this.header.writeToBuffer(buffer, this.offset);
        this.offset += this.header.getSize();
        console.log(`Offset after header: ${this.offset}`);

        for (const question of this.questions) {
            question.writeToBuffer(buffer, this.offset);
            this.offset += question.getSize();
            console.log(`Offset after question: ${this.offset}`);
        }

        return buffer.slice(0, this.offset);
    }

    getOffset(): number {
        return this.offset;
    }
}
