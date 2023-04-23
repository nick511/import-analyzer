#!/usr/bin/env node
const yargs = require('yargs');

const importAnalyzer = require('../src/index');

const options = yargs
  .usage(
    `Usage: import-analyzer -p <pattern> -i <ignoreImport>
    Example: import-analyzer -p 'tests/fixtures/**/*.{js,jsx,ts,tsx}' -i '^@root/.*'
    `
  )
  .option('p', {
    alias: 'pattern',
    describe: 'file pattern to analyze',
    type: 'string',
    demandOption: true,
  })
  .option('i', {
    alias: 'ignoreImport',
    describe: 'ignore import pattern',
    type: 'string',
    demandOption: false,
  }).argv;

importAnalyzer(options.pattern, {ignoreImport: options.ignoreImport || null});
