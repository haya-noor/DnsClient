
export interface DNSInterface {
    writeToBuffer(buffer: Buffer, offset: number): void;
    getSize(): number;
  }