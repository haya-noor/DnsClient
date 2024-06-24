
export function hexDump(buffer: Buffer) {
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
    return {
        qr, opcode, aa, tc, rd, ra, z, rcode
    };
}

