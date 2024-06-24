
import { sendDnsQuery, promptUserInput, readFromFile } from './DnsUtils';

async function main() {
    const inputMethod = await promptUserInput('Do you want to read from a file or CLI? (file/cli): ');

    if (inputMethod.toLowerCase() === 'file') {
        const filePath = await promptUserInput('Enter the file path: ');
        try {
            const queries = await readFromFile(filePath);
            for (const { domain, queryType } of queries) 
            {
                if (domain && queryType) 
                {
                    await sendDnsQuery(domain, queryType);
                } 
                else 
                {
                    console.error('Error: Both domain and query type are required in the file.');
                }
            }
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



