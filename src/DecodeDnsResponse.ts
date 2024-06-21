
export function hexDump(buffer: Buffer) {
    return buffer.toString('hex').match(/.{1,2}/g)?.join(' ') || '';
}

export function logPacketDetails(buffer: Buffer) {
    console.log(`DNS Packet Details:`);
    console.log(`Header ID: ${buffer.slice(0, 2).toString('hex')}`);
    console.log(`Flags: ${buffer.slice(2, 4).toString('hex')}`);
    console.log(`QDCOUNT: ${buffer.slice(4, 6).toString('hex')}`);
    console.log(`ANCOUNT: ${buffer.slice(6, 8).toString('hex')}`);
    console.log(`NSCOUNT: ${buffer.slice(8, 10).toString('hex')}`);
    console.log(`ARCOUNT: ${buffer.slice(10, 12).toString('hex')}`);
    console.log(`Question: ${buffer.slice(12).toString('hex')}`);
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
    return {
        qr, opcode, aa, tc, rd, ra, z, rcode
    };
}

export function logFlags(flags: { qr: number, opcode: number, aa: number, tc: number, rd: number, ra: number, z: number, rcode: number }) {
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
