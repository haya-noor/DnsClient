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

Constructed DNS packet: ae 21 01 00 00 01 00 00 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01

DNS Packet Details:

Header ID: ae21
Flags: 0100
QDCOUNT: 0001
ANCOUNT: 0000
NSCOUNT: 0000
ARCOUNT: 0000

Question: 06676f6f676c6503636f6d0000010001

Attempt 1 to send packet

Sending UDP packet with size: 28

Received UDP response with size: 44

Received response: ae 21 81 80 00 01 00 01 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 00 79 00 04 c0 b2 18 8e

Parsed DnsHeader: DnsHeader {
  id: 44577,
  flags: 33152,
  qdcount: 1,
  ancount: 1,
  nscount: 0,
  arcount: 0
}

Flags:
  QR (Query/Response): 1
  Opcode: 0
  AA (Authoritative Answer): 0
  TC (Truncated): 0
  RD (Recursion Desired): 1
  RA (Recursion Available): 1
  Z (Reserved): 0
  RCODE (Response Code): 0
  Response Code: NoError (0)
  
Parsed Questions: [ DnsQuestion { domain: 'google.com', queryType: 'A' } ]

Parsed name: google.com, new offset: 30
Parsed type: A (code: 1), new offset: 32
Parsed class: 1, new offset: 34
Parsed TTL: 121, new offset: 38
Parsed RDLength: 4, new offset: 40
Parsed RData: 192.178.24.142, new offset: 44
Parsed DNS answer from buffer, 16 bytes processed.

Parsed Answers: [
  DnsAnswer {
    name: 'google.com',
    type: 'A',
    class: 1,
    ttl: 121,
    rdLength: 4,
    rdata: '192.178.24.142'
  }
]

UDP Socket closed


  

