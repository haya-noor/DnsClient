import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';

export class DNSPacket {
    private header: DnsHeader;
    private questions: DnsQuestion[];

    constructor(domains: string[]) {
        this.header = new DnsHeader();
        this.questions = domains.map(domain => new DnsQuestion(domain));
        this.header.updateQuestionCount(this.questions.length);
    }

    getBuffer(): Buffer {
        const buffer = Buffer.alloc(512); // Allocate enough space for the DNS packet
        let offset = 0;

        this.header.writeToBuffer(buffer, offset);
        offset += this.header.getSize();

        for (const question of this.questions) {
            question.writeToBuffer(buffer, offset);
            offset += question.getSize();
        }

        return buffer.slice(0, offset);
    }
}
