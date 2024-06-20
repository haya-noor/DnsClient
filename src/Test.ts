
import { DnsHeader } from './DnsHeader';
import { DnsQuestion } from './DnsQuestion';
import { DNSPacket } from './DNSPacket';
import { PacketSender } from './TransportMethod';
import { parseDnsResponse } from './ParseDnsResponse';
import { hexDump, logPacketDetails } from './DecodeDnsResponse';
import * as readline from 'readline';
import * as fs from 'fs';

async function sendDnsQuery(domain: string, queryType: string) {
    const dnsPacket = new DNSPacket([domain], queryType);
    const buffer = dnsPacket.getBuffer();
    console.log(`Constructed DNS packet: ${hexDump(buffer)}`);
    logPacketDetails(buffer);

    const packetSender = new PacketSender('8.8.8.8', 53); // Google DNS server
    try {
        const response = await packetSender.sendPacket(buffer);
        console.log('Received response:', hexDump(response));
        parseDnsResponse(response);
    } catch (error) {
        console.error('Error sending DNS query:', error);
    } finally {
        packetSender.close();
    }
}

async function promptUserInput(question: string): Promise<string> {
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

async function readFromFile(filePath: string): Promise<{ domain: string, queryType: string }> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const [domain, queryType] = data.split(',');
                resolve({ domain: domain.trim(), queryType: queryType.trim() });
            }
        });
    });
}

async function main() {
    const inputMethod = await promptUserInput('Do you want to read from a file or CLI? (file/cli): ');

    if (inputMethod.toLowerCase() === 'file') {
        const filePath = await promptUserInput('Enter the file path: ');
        try {
            const { domain, queryType } = await readFromFile(filePath);
            await sendDnsQuery(domain, queryType);
        } catch (error) {
            console.error('Error reading from file:', error);
        }
    } else if (inputMethod.toLowerCase() === 'cli') {
        const domain = await promptUserInput('Enter the domain to query: ');
        const queryType = await promptUserInput('Enter the query type (A, AAAA, CNAME): ');

        if (!domain || !queryType) {
            console.error('Error: Both domain and query type are required.');
            return;
        }

        await sendDnsQuery(domain, queryType);
    } else {
        console.error('Invalid input method. Please enter "file" or "cli".');
    }
}

main();



