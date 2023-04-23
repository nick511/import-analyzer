#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');

const {importAnalyzer} = require('../dist/index');

const options = yargs
  .usage(
    `Usage: import-analyzer -p <path> -r <removeImports>
    Example: import-analyzer -p src/subdir -r '^@root/.*'`
  )
  .option('p', {
    alias: 'path',
    describe: 'file path to analyze (default to current working directory)',
    default: path.resolve(process.cwd()),
    type: 'string',
  })
  .option('i', {
    alias: 'ignorePaths',
    describe: 'ignore paths',
    default: ['**/node_modules/**'],
    type: 'array',
  })
  .option('gitIgnoreFile', {
    describe: '.gitIgnore file path',
    type: 'string',
  })
  .option('r', {
    alias: 'removeImports',
    describe: 'filter out import result by regular expression',
    type: 'string',
  })
  .option('g', {
    alias: 'generateCsv',
    describe: 'generate CSV file',
    type: 'boolean',
  })
  .option('v', {
    alias: 'verbose',
    describe: 'print analyze result',
    type: 'boolean',
  }).argv;

importAnalyzer(options.path, {
  ignorePaths: options.ignorePaths,
  gitIgnoreFile: options.gitIgnoreFile,
  importIgnoreRegExp: options.removeImports || null,
  generateCsv: options.generateCsv,
  verbose: options.verbose,
});
