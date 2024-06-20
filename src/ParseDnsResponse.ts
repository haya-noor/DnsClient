import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';
import { DnsAnswer } from './DnsAnswer';

function interpretFlags(flags: number) {
    const qr = (flags & 0x8000) >> 15;
    const opcode = (flags & 0x7800) >> 11;
    const aa = (flags & 0x0400) >> 10;
    const tc = (flags & 0x0200) >> 9;
    const rd = (flags & 0x0100) >> 8;
    const ra = (flags & 0x0080) >> 7;
    const z = (flags & 0x0070) >> 4;
    const rcode = flags & 0x000F;
    return {
        qr, opcode, aa, tc, rd, ra, z, rcode
    };
}

function logFlags(flags: { qr: number, opcode: number, aa: number, tc: number, rd: number, ra: number, z: number, rcode: number }) {
    console.log(`Flags:`);
    console.log(`  QR (Query/Response): ${flags.qr}`);
    console.log(`  Opcode: ${flags.opcode}`);
    console.log(`  AA (Authoritative Answer): ${flags.aa}`);
    console.log(`  TC (Truncated): ${flags.tc}`);
    console.log(`  RD (Recursion Desired): ${flags.rd}`);
    console.log(`  RA (Recursion Available): ${flags.ra}`);
    console.log(`  Z (Reserved): ${flags.z}`);
    console.log(`  RCODE (Response Code): ${flags.rcode}`);
    const responseCodes = [
        'NoError (0)', 'FormErr (1)','NotImp (4)', 'Refused (5)'
    ];
    if (flags.rcode < responseCodes.length) {
        console.log(`  Response Code: ${responseCodes[flags.rcode]}`);
    } else {
        console.log(`  Response Code: ${flags.rcode}`);
    }
}

function parseDnsResponse(response: Buffer) {
    const header = DnsHeader.fromBuffer(response, 0);
    console.log('Parsed DnsHeader:', header);

    const flags = interpretFlags(header.getFlags());
    logFlags(flags);

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
        const record = DnsAnswer.fromBuffer(response, offset);
        authorityRecords.push(record);
        offset += record.getLength();
    }

    const additionalRecords = [];
    for (let i = 0; i < header.getArcount(); i++) {
        const record = DnsAnswer.fromBuffer(response, offset);
        additionalRecords.push(record);
        offset += record.getLength();
    }
}

export { parseDnsResponse };
