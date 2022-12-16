# HighSeal - @theroyalwhee0/highseal

## What is this?
A library to seal and unseal a string value with a secret. The value is encrypted with aes-256-gcm, padded to a minimum of 32 bytes and padded to a multiple of 8 bytes beyond that.


## Installation
`npm install @theroyalwhee0/highseal`  

## CLI
The [Highseal CLI](https://www.npmjs.com/package/@theroyalwhee0/highseal-cli) install allows sealing and unsealing of values without writing code. 

`npm install --global @theroyalwhee0/highseal-cli`

## Usage
```ts
import { seal, unseal, isSealed } from '@theroyalwhee0/highseal';
const secret = 'marabou stork';
const initial = 'Leptoptilos crumenifer';
console.info('Initial Value:', initial);
const sealed = seal(initial, secret);
console.info('Sealed Value:', sealed);
console.info(`Value ${isSealed(sealed) ? 'appears' : 'does not appear'} to be sealed.`);
const [err, unsealed] = unseal(sealed, secret);
if(err) {
    console.error('Unable to unseal value.');
} else {
    console.info('Unsealed Value:', unsealed);
}
```


## Testing.
Running ```npm run test``` will run the test suite. Running ```npm run test-watch``` will run the test suite in watch mode.


## Security Notes
- This code has not been audited or verified by a third party.
- The sealed values timestamp leak metadata of when they were generated.
- The sealed values counters may leak metadata since incremented counters indicate batches.


## Links
- GitHub: [https://github.com/theroyalwhee0/highseal](https://github.com/theroyalwhee0/highseal)
- NPM: [https://www.npmjs.com/package/@theroyalwhee0/highseal](https://www.npmjs.com/package/@theroyalwhee0/highseal)
- Changelog: [https://github.com/theroyalwhee0/highseal/blob/main/changelog.md](https://github.com/theroyalwhee0/highseal/blob/main/changelog.md)
- Highseal CLI: [https://github.com/theroyalwhee0/highseal/tree/main/cli](https://github.com/theroyalwhee0/highseal/tree/main/cli)


## Legal & License
Copyright 2022 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/highseal/blob/main/LICENSE) for more details.
