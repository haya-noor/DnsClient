
import { DNSPacket } from './DNSPacket';
import { TransportMethod } from './TransportMethod';
import { ParseAndDecode } from './ParseAndDecode';
import * as fs from 'fs';
import * as readline from 'readline';

// Function to handle user input
async function handleUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Do you want to input domain names from CLI or file? (cli/file): ', (inputMethod) => {
        if (inputMethod.trim().toLowerCase() === 'cli') {
            handleCLIInput(rl);
        } else if (inputMethod.trim().toLowerCase() === 'file') {
            rl.question('Enter the file name: ', (fileName) => {
                handleFileInput(fileName);
                rl.close();
            });
        } else {
            console.log('Invalid input. Please enter "cli" or "file".');
            rl.close();
        }
    });
}

// Function to handle CLI input
async function handleCLIInput(rl: readline.Interface) {
    rl.question('Enter the domain names (comma separated): ', (domains) => {
        const domainList = domains.split(',').map(domain => domain.trim());
        rl.question('Enter the query type (A, AAAA, CNAME): ', (queryType) => {
            performDNSQuery(domainList, queryType);
            rl.close();
        });
    });
}

// Function to handle file input
async function handleFileInput(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const domainQueries = lines.map(line => {
        const [domain, queryType] = line.split(' ').map(item => item.trim());
        return { domain, queryType };
    });
    await performDNSQueriesFromFile(domainQueries);
}

// Function to perform DNS queries from file input
async function performDNSQueriesFromFile(domainQueries: { domain: string, queryType: string }[]) {
    const transport = new TransportMethod('1.1.1.1', 53);
    const promises = domainQueries.map(async ({ domain, queryType }) => {
        const packet = new DNSPacket([domain], queryType);
        const buffer = packet.getBuffer();

        try {
            console.log(`Sending DNS query for ${domain} with query type ${queryType}`);
            const response = await transport.sendPacket(buffer);
            console.log(`Raw response for ${domain} with query type ${queryType}:`, response);

            const parser = new ParseAndDecode(response);
            const header = parser.parse();
            console.log(`Header:`, header);

            const questions = [parser.parseQuestion()];
            console.log(`Questions:`, questions.map(q => q.getDomain()));

            const answers = [parser.parseAnswer()];
            answers.forEach(answer => {
                console.log(`Name: ${answer['name']}`);
                console.log(`Type: ${answer['type']}`);
                console.log(`Class: ${answer['class']}`);
                console.log(`TTL: ${answer['ttl']}`);
                console.log(`RDLength: ${answer['rdLength']}`);
                //console.log(`RData: ${answer['rdata']}`);
            });
        } catch (error) {
            console.error(`Error querying ${domain}:`, error);
        }
    });

    await Promise.all(promises);
}

// Function to perform DNS query
async function performDNSQuery(domains: string[], queryType: string) {
    const transport = new TransportMethod('1.1.1.1', 53);
    const promises = domains.map(async (domain) => {
        const packet = new DNSPacket([domain], queryType);
        const buffer = packet.getBuffer();

        try {
            console.log(`Sending DNS query for ${domain} with query type ${queryType}`);
            const response = await transport.sendPacket(buffer);
            console.log(`Raw response for ${domain} with query type ${queryType}:`, response);

            const parser = new ParseAndDecode(response);
            const header = parser.parse();
            console.log(`Header:`, header);

            const questions = [parser.parseQuestion()];
            console.log(`Questions:`, questions.map(q => q.getDomain()));

            const answers = [parser.parseAnswer()];
            answers.forEach(answer => {
                console.log(`Name: ${answer['name']}`);
                console.log(`Type: ${answer['type']}`);
                console.log(`Class: ${answer['class']}`);
                console.log(`TTL: ${answer['ttl']}`);
                console.log(`RDLength: ${answer['rdLength']}`);
                //console.log(`RData: ${answer['rdata']}`);
            });
        } catch (error) {
            console.error(`Error querying ${domain}:`, error);
        }
    });

    await Promise.all(promises);
}

// Start the user input handling process
handleUserInput();
