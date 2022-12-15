# HighSeal - @theroyalwhee0/highseal

## What is this?
A library to seal and unseal a string value with a secret. The value is encrypted with aes-256-gcm, padded to a minimum of 32 bytes and padded to a multiple of 8 bytes beyond that. For example the sealed value A.9DXhmSdywgfFt+Jta0uIaQ.ABWSkxaLf4oAwwFq.o2e5jDHA6t3M5+aBbt0ideAMyA0knhhsBviHndt27sM is an empty string encrypted with the key "marabou stork".


## Installation
`npm install @theroyalwhee0/highseal`  

## CLI
The [Highseal CLI](https://www.npmjs.com/package/@theroyalwhee0/highseal-cli) install allows sealing and unsealing of values without writing code. 

`npm install --global @theroyalwhee0/highseal-cli`


## Testing.
Running ```npm run test``` will run the test suite. Running ```npm run test-watch``` will run the test suite in watch mode.


## Links
- GitHub: [https://github.com/theroyalwhee0/highseal](https://github.com/theroyalwhee0/highseal)
- NPM: [https://www.npmjs.com/package/@theroyalwhee0/highseal](https://www.npmjs.com/package/@theroyalwhee0/highseal)
- Changelog: [https://github.com/theroyalwhee0/highseal/blob/main/changelog.md](https://github.com/theroyalwhee0/highseal/blob/main/changelog.md)
- Highseal CLI: [https://github.com/theroyalwhee0/highseal/tree/main/cli](https://github.com/theroyalwhee0/highseal/tree/main/cli)


## Legal & License
Copyright 2022 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/highseal/blob/main/LICENSE) for more details.
