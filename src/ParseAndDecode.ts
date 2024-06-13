import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';
import { DnsAnswer } from './DnsAnswer';

export class ParseAndDecode {
    private buffer: Buffer;
    private header: DnsHeader;
    private questions: DnsQuestion[];
    private answers: DnsAnswer[];

    constructor(buffer: Buffer) {
        this.buffer = buffer;
        this.header = new DnsHeader();
        this.questions = [];
        this.answers = [];
        this.parse();
    }

    private parse() {
        let offset = 0;

        this.header = this.parseHeader(offset);
        offset += this.header.getSize();

        for (let i = 0; i < this.header.getQdcount(); i++) {
            const question = this.parseQuestion(offset);
            this.questions.push(question);
            offset += question.getSize();
        }

        for (let i = 0; i < this.header.getAncount(); i++) {
            const answer = new DnsAnswer();
            answer.parse(this.buffer, offset);
            this.answers.push(answer);
            offset += answer.getSize();
        }
    }

    private parseHeader(offset: number): DnsHeader {
        const header = new DnsHeader();
        header.setId(this.buffer.readUInt16BE(offset));
        header.setFlags(this.buffer.readUInt16BE(offset + 2));
        header.setQdcount(this.buffer.readUInt16BE(offset + 4));
        header.setAncount(this.buffer.readUInt16BE(offset + 6));
        header.setNscount(this.buffer.readUInt16BE(offset + 8));
        header.setArcount(this.buffer.readUInt16BE(offset + 10));
        return header;
    }

    private parseQuestion(offset: number): DnsQuestion {
        let end = offset;
        while (this.buffer[end] !== 0) end++;
        const domain = this.buffer.toString('ascii', offset, end);
        return new DnsQuestion(domain);
    }

    public getHeader(): DnsHeader {
        return this.header;
    }

    public getQuestions(): DnsQuestion[] {
        return this.questions;
    }

    public getAnswers(): DnsAnswer[] {
        return this.answers;
    }
}
