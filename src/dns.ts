import { DNSPacket } from './DNSPacket';
import { TransportMethod } from './TransportMethod';
import { ParseAndDecode } from './ParseAndDecode';
import * as fs from 'fs';
import * as readline from 'readline';

// Function to handle CLI input
async function handleCLIInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the domain names (comma separated): ', (domains) => {
        const domainList = domains.split(',').map(domain => domain.trim());
        performDNSQuery(domainList);
        rl.close();
    });
}

// Function to handle file input
async function handleFileInput(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const domains = fileContent.split('\n').map(domain => domain.trim()).filter(domain => domain.length > 0);
    await performDNSQuery(domains);
}

// Function to perform DNS query
async function performDNSQuery(domains: string[]) {
    const transport = new TransportMethod('8.8.8.8', 53);
    const promises = domains.map(async (domain) => {
        const packet = new DNSPacket([domain]);
        const buffer = packet.getBuffer();

        try {
            const response = await transport.sendPacket(buffer);
            const parser = new ParseAndDecode(response);

            console.log(`Response for ${domain}:`);
            console.log(`Header:`, parser.getHeader());
            console.log(`Questions:`, parser.getQuestions().map(q => q.getDomain()));
            parser.getAnswers().forEach(answer => {
                console.log(`Name: ${answer.getName()}`);
                console.log(`Type: ${answer.getType()}`);
                console.log(`Class: ${answer.getClass()}`);
                console.log(`TTL: ${answer.getTTL()}`);
                console.log(`RDLength: ${answer.getRdlength()}`);
                console.log(`RData: ${answer.getRdata()}`);
            });
        } catch (error) {
            console.error(`Error during DNS query for ${domain}:`, error);
        }
    });

    await Promise.all(promises);
    transport.close();
}

function main() {
    const args = process.argv.slice(2);
    if (args.length > 0) {
        const input = args[0];
        if (fs.existsSync(input)) {
            handleFileInput(input);
        } else {
            const domains = input.split(',').map(domain => domain.trim());
            performDNSQuery(domains);
        }
    } else {
        handleCLIInput();
    }
}

main();
