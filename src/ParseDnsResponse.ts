

import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';
import { DnsAnswer } from './DnsAnswer';

export function hexDump(buffer: Buffer): string {
    return buffer.toString('hex').match(/.{1,2}/g)?.join(' ') || '';
}

export function interpretFlags(flags: number) {
    const qr = (flags & 0x8000) >> 15;
    const opcode = (flags & 0x7800) >> 11;
    const aa = (flags & 0x0400) >> 10;
    const tc = (flags & 0x0200) >> 9;
    const rd = (flags & 0x0100) >> 8;
    const ra = (flags & 0x0080) >> 7;
    const z = (flags & 0x0070) >> 4;
    const rcode = flags & 0x000F;
    return { qr, opcode, aa, tc, rd, ra, z, rcode };
}
export function parseDnsResponse(response: Buffer): void {
    const header = DnsHeader.fromBuffer(response, 0);

    let offset = 12; // After the header
    const questions = [];
    for (let i = 0; i < header.getQdcount(); i++) {
        const question = DnsQuestion.fromBuffer(response, offset);
        questions.push(question);
        offset += question.getLength();
    }
    console.log('Parsed Questions:', questions);

    const answers = [];
    for (let i = 0; i < header.getAncount(); i++) {
        const answer = DnsAnswer.fromBuffer(response, offset);
        answers.push(answer);
        offset += answer.getLength();
    }
    console.log('Parsed Answers:', answers);

    const authorityRecords = [];
    for (let i = 0; i < header.getNscount(); i++) {
        const authority = DnsAnswer.fromBuffer(response, offset);
        authorityRecords.push(authority);
        offset += authority.getLength();
    }

    const additionalRecords = [];
    for (let i = 0; i < header.getArcount(); i++) {
        const additional = DnsAnswer.fromBuffer(response, offset);
        additionalRecords.push(additional);
        offset += additional.getLength();
    }
}
