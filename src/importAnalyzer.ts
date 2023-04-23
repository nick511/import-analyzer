import fs from 'fs';
import path from 'path';
import glob from 'glob';
import parseIgnore from 'gitignore-globs';
import {createObjectCsvWriter} from 'csv-writer';
import parseImports, {ImportInfoMap} from './parseImports';

interface ImportInfo {
  importFiles: number;
  defaultImports: number;
  nonDefault: number;
  nonDefaultDetails: Record<string, number>;
}

type AnalyzeResult = Record<string, ImportInfo>;

const importAnalyzer = (
  scanPath: string | null,
  {
    ignorePaths = ['**/node_modules/**'],
    gitIgnoreFile = null,
    importIgnoreRegExp = null,
    generateCsv = false,
    verbose = false,
  } = {}
): AnalyzeResult => {
  // parse path in .gitignore file
  const gitIgnorePaths = gitIgnoreFile ? parseIgnore(gitIgnoreFile) : [];

  const filepaths = glob.sync('/**/*.{js,jsx,ts,tsx}', {
    root: path.resolve(process.cwd(), scanPath || ''),
    ignore: gitIgnorePaths.concat(ignorePaths),
  });

  const analyzeResult: AnalyzeResult = {};
  filepaths.forEach((file) => {
    const code = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
    addImportInfo(analyzeResult, parseImports(code, importIgnoreRegExp));
  });

  if (generateCsv) {
    generateCsvFile(analyzeResult);
  }

  if (verbose) {
    console.log(analyzeResult);
  }

  return analyzeResult;
};

const addImportInfo = (result: AnalyzeResult, importInfoMap: ImportInfoMap) => {
  Object.keys(importInfoMap).forEach((lib) => {
    if (!result[lib]) {
      result[lib] = {
        importFiles: 0,
        defaultImports: 0,
        nonDefault: 0,
        nonDefaultDetails: {},
      };
    }
    result[lib].importFiles += 1;

    if (importInfoMap[lib].default) {
      result[lib].defaultImports += 1;
    }

    importInfoMap[lib].imports.forEach((importName) => {
      const detail = result[lib].nonDefaultDetails;
      if (!detail[importName]) {
        detail[importName] = 0;
      }
      detail[importName] += 1;
      result[lib].nonDefault += 1;
    });
  });
};

const generateCsvFile = (analyzeResult: AnalyzeResult) => {
  const csvWriter = createObjectCsvWriter({
    path: 'import-info.csv',
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
      Object.keys(analyzeResult).map((libraryName) => {
        const {importFiles, defaultImports, nonDefault, nonDefaultDetails} =
          analyzeResult[libraryName];
        return {
          library: libraryName,
          importFiles,
          defaultImports,
          nonDefault,
          nonDefaultDetails: JSON.stringify(nonDefaultDetails),
        };
      })
    )
    .then(() => console.log('The CSV file was written successfully'));
};

export default importAnalyzer;
