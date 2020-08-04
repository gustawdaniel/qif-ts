# qif-mapper-ts

Typescript module to parse QIF files. Tries to provide a one-to-one mapping of the physical model into a typed object. Only primitives are converted, dates are read in the format given and provided as strings for the user to parse as they like.

Uses the specification [here](https://web.archive.org/web/20100222214101/http://web.intuit.com/support/quicken/docs/d_qif.html) as a source of truth.

If you require date parsing, or a CLI tool, please look into [qif2json](https://www.npmjs.com/package/qif2json), which provided a basis for much of this library.

## Installing and using

`$ npm install --save qif-mapper-ts`

TODO - add usage instructions

## Changelog

* `0.1.0` Support for Investment, Bank, Cash, Card, Other Asset and Other Liability QIF file types