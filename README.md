# dns-client-ts-starter

# DNS Query Tool

This project is a DNS Query Tool implemented in TypeScript. It allows users to send DNS queries to a specified DNS server (e.g., Google DNS) and parse the responses. The tool supports querying for different record types such as A, AAAA, and CNAME.

## Features

- Send DNS queries using UDP
- Fallback to TCP if UDP fails
- Parse and display DNS query responses
- Support for querying multiple domains from a file
- Command-line interface for user input

## Files

- `DecodeDnsResponse.ts`: Contains utility functions for hex dumping and logging DNS packet details.
- `DnsAnswer.ts`: Defines the `DnsAnswer` class for parsing DNS answers.
- `DnsHeader.ts`: Defines the `DnsHeader` class for parsing DNS headers.
- `DNSInterface.ts`: Interface definitions for DNS-related classes.
- `DNSPacket.ts`: Defines the `DNSPacket` class for constructing DNS query packets.
- `DnsQuestion.ts`: Defines the `DnsQuestion` class for parsing DNS questions.
- `DnsUtils.ts`: Contains utility functions for DNS operations.
- `ParseDnsResponse.ts`: Contains functions for parsing DNS responses.
- `Test.ts`: Main script for running the DNS query tool.
- `TransportMethod.ts`: Contains classes for handling UDP and TCP transport methods.

## Usage 

  You can run the DNS query tool using the command:
  npx ts-node Test.ts

## Example Output

  Do you want to read from a file or CLI? (file/cli): cli

Enter the domain to query: google.com

Enter the query type (A, AAAA, CNAME): A

Attempt 1 to send packet

Parsed Questions: [ DnsQuestion { domain: 'google.com', queryType: 'A' } ]

Parsed Answers: [ \
  DnsAnswer { \
    name: 'google.com', \
    type: 'A', \
    class: 1, \
    ttl: 121, \
    rdLength: 4, \
    rdata: '192.178.24.142' \
  } \
]






  

