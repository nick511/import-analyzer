const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parseIgnore = require('gitignore-globs');
const {parse} = require('@babel/parser');
const {visit} = require('ast-types');

const importAnalyzer = (scanPath, {ignoreImport = null}) => {
  const gitIgnore = parseIgnore('/Users/sh506o/shared/notif-ui/.gitignore');

  // TODO: support ignore patterns
  const filenames = glob.sync(
    '/Users/sh506o/shared/notif-ui/src/batch/**/*.{js,jsx,ts,tsx}',
    {
      // root: path.resolve(process.cwd(), scanPath),
      // root: '/Users/sh506o/shared/notif-ui',
      ignore: [...gitIgnore, '**/__tests__/**'],
    }
  );
  /* console.log(
    '🚀 ~ file: index.js ~ line 10 ~ importAnalyzer ~ filenames',
    path.resolve(process.cwd(), scanPath),
    filenames
  );
  return; */

  const result = {};
  filenames.forEach((file) => {
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

const parseImports = (code, ignoreImport) => {
  let ast = null;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch (e) {
    console.log('🚀 ~ file: index.js ~ line 40 ~ parseImports ~ e', code);
    throw new Error(e);
  }

  const ignoreImportRegex = new RegExp(ignoreImport);

  const importsData = {};
  visit(ast.program.body, {
    visitImportDeclaration(path) {
      const source = path.node.source.value;

      if (ignoreImport && ignoreImportRegex.test(source)) {
        return false;
      }

      importsData[source] = {default: false, imports: []};

      if (path.node.specifiers.length === 0) {
        importsData[source].default = true;
      }

      path.node.specifiers.forEach((specifier) => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          importsData[source].default = true;
        } else {
          importsData[source].imports.push(specifier.imported?.name);
        }
      });
      this.traverse(path);
    },
  });

  return importsData;
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
