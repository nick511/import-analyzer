const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parseIgnore = require('gitignore-globs');

const importAnalyzer = (scanPath, {ignoreImport = null}) => {
  const gitIgnore = parseIgnore('/Users/sh506o/shared/notif-ui/.gitignore');

  // TODO: support ignore patterns
  const filepaths = glob.sync(
    '/Users/sh506o/shared/notif-ui/src/graymatter/**/*.{js,jsx,ts,tsx}',
    {
      // root: path.resolve(process.cwd(), scanPath),
      // root: '/Users/sh506o/shared/notif-ui',
      ignore: [...gitIgnore, '**/__tests__/**'],
    }
  );
  /* console.log(
    '🚀 ~ file: index.js ~ line 10 ~ importAnalyzer ~ filepaths',
    path.resolve(process.cwd(), scanPath),
    filepaths
  );
  return; */

  const result = {};
  filepaths.forEach((file) => {
    const data = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
    addImports(result, parseImports(data, ignoreImport));
  });

  console.log(
    '🚀 ~ file: index.js ~ line 20 ~ importAnalyzer ~ result',
    result
  );
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'library', title: 'Library'},
      {id: 'importFiles', title: 'importFiles'},
      {id: 'defaultImports', title: 'defaultImports'},
      {id: 'nonDefault', title: 'nonDefault'},
      {id: 'nonDefaultDetails', title: 'nonDefaultDetails'},
    ],
  });

  csvWriter
    .writeRecords(
      Object.keys(result).map((lib) => ({
        library: lib,
        importFiles: result[lib].importFiles,
        defaultImports: result[lib].defaultImports,
        nonDefault: result[lib].nonDefault,
        nonDefaultDetails: JSON.stringify(result[lib].nonDefaultDetails),
      }))
    )
    .then(() => console.log('The CSV file was written successfully'));

  return result;
};

const addImports = (result, imports) => {
  Object.keys(imports).forEach((lib) => {
    result[lib] = result[lib] || {
      importFiles: 0,
      defaultImports: 0,
      nonDefault: 0,
      nonDefaultDetails: {},
    };
    result[lib].importFiles += 1;

    if (imports[lib].default) {
      result[lib].defaultImports += 1;
    }

    imports[lib].imports.forEach((importName) => {
      const detail = result[lib].nonDefaultDetails;
      detail[importName] = detail[importName] || 0;
      detail[importName] += 1;
      result[lib].nonDefault += 1;
    });
  });
  return result;
};

module.exports = importAnalyzer;
