# HighSeal CLI - @theroyalwhee0/highseal-cli

CLI to Seal and Unseal a Value with a Secret. Uses the [HighSeal](https://github.com/theroyalwhee0/highseal) library.


## Installation
`npm install --global @theroyalwhee0/highseal-cli`


## Usage General
- `highseal --help` - Show CLI help


## Usage 'Seal'
There are many different secret, input, and output flags that can be combined.
See the CLI help for a full list.

- Show Seal CLI help
    - `highseal seal --help` 
- Seal the value 'ExampleValue' with the secret 'ExampleSecret' and output results to the terminal
    - `highseal seal --secret-value=ExampleSecret --input-value=ExampleValue --output-terminal`
- Ask the user for the secret and the input from the terminal and output the results to the terminal
    - `highseal seal --secret-terminal --input-terminal --output-terminal`
- Seal the value of the environment variable HISE_INPUT with the secret from the environment variable HISE_SECRET and  and output the results to the terminal
    - `HISE_SECRET=ExampleSecret HISE_INPUT=ExampleValue highseal seal --output-terminal`


## Usage 'Unseal'
There are many different secret, input, and output flags that can be combined.
 See the CLI help for a full list.

- `highseal unseal --help` - Show Seal CLI help.


## Testing.
Running ```npm run test``` will run the test suite. Running ```npm run test-watch``` will run the test suite in watch mode.


## Links
- GitHub: [https://github.com/theroyalwhee0/highseal/tree/main/cli](https://github.com/theroyalwhee0/highseal/tree/main/cli)
- NPM: [https://www.npmjs.com/package/@theroyalwhee0/highseal-cli](https://www.npmjs.com/package/@theroyalwhee0/highseal-cli)
- Changelog: [https://github.com/theroyalwhee0/highseal/blob/main/cli/changelog.md](https://github.com/theroyalwhee0/highseal/blob/main/cli/changelog.md)
- Highseal: [https://github.com/theroyalwhee0/highseal](https://github.com/theroyalwhee0/highseal)


## Legal & License
Copyright 2022 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/highseal/blob/main/cli/LICENSE) for more details.
