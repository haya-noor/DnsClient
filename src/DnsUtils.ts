

import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';
import { DNSPacket } from './DNSPacket';
import { PacketSender } from './TransportMethod';
import { parseDnsResponse} from './ParseDnsResponse';
//import { hexDump, logPacketDetails } from './DecodeDnsResponse';
import { hexDump} from './DecodeDnsResponse';
import * as readline from 'readline';
import * as fs from 'fs';
import net from 'net';


export async function sendDnsQuery(domain: string, queryType: string): Promise<void> {
    const dnsPacket = new DNSPacket([domain], queryType);
    const buffer = dnsPacket.getBuffer();

    //console.log(`Constructed DNS packet: ${hexDump(buffer)}`);
    //logPacketDetails(buffer);

    const packetSender = new PacketSender('8.8.8.8', 53); // Google DNS server
    try {
        const response = await packetSender.sendPacket(buffer);
        //console.log('Received response:', hexDump(response));

        parseDnsResponse(response);
    } catch (error) {
        console.error('Error sending DNS query:', error);
    } finally {
        packetSender.close();
    }
}


export async function promptUserInput(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

export async function readFromFile(filePath: string): Promise<{ domain: string, queryType: string }[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const queries = data.split('\n')
                    .filter(line => line.trim() !== '') // Filter out empty lines
                    .map(line => {
                        const [domain, queryType] = line.split(',');
                        return { domain: domain.trim(), queryType: queryType.trim() };
                    });
                resolve(queries);
            }
        });
    });
}

export function getTypeString(typeCode: number): string {
    const typeMap: { [key: number]: string } = {
        1: 'A',
        2: 'NS',
        5: 'CNAME',
        6: 'SOA'
    };
    return typeMap[typeCode] || 'UNKNOWN';
}


