"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const gitignore_globs_1 = __importDefault(require("gitignore-globs"));
const csv_writer_1 = require("csv-writer");
const parseImports_1 = __importDefault(require("./parseImports"));
const importAnalyzer = (scanPath, { ignorePaths = ['**/node_modules/**'], gitIgnoreFile = null, importIgnoreRegExp = null, generateCsv = false, verbose = false, } = {}) => {
    // parse path in .gitignore file
    const gitIgnorePaths = gitIgnoreFile ? gitignore_globs_1.default(gitIgnoreFile) : [];
    const filepaths = glob_1.default.sync('/**/*.{js,jsx,ts,tsx}', {
        root: path_1.default.resolve(process.cwd(), scanPath || ''),
        ignore: gitIgnorePaths.concat(ignorePaths),
    });
    const analyzeResult = {};
    filepaths.forEach((file) => {
        const code = fs_1.default.readFileSync(path_1.default.resolve(process.cwd(), file), 'utf8');
        addImportInfo(analyzeResult, parseImports_1.default(code, importIgnoreRegExp));
    });
    if (generateCsv) {
        generateCsvFile(analyzeResult);
    }
    if (verbose) {
        console.log(analyzeResult);
    }
    return analyzeResult;
};
const addImportInfo = (result, importInfoMap) => {
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
const generateCsvFile = (analyzeResult) => {
    const csvWriter = csv_writer_1.createObjectCsvWriter({
        path: 'import-info.csv',
        header: [
            { id: 'library', title: 'Library' },
            { id: 'importFiles', title: 'importFiles' },
            { id: 'defaultImports', title: 'defaultImports' },
            { id: 'nonDefault', title: 'nonDefault' },
            { id: 'nonDefaultDetails', title: 'nonDefaultDetails' },
        ],
    });
    csvWriter
        .writeRecords(Object.keys(analyzeResult).map((libraryName) => {
        const { importFiles, defaultImports, nonDefault, nonDefaultDetails } = analyzeResult[libraryName];
        return {
            library: libraryName,
            importFiles,
            defaultImports,
            nonDefault,
            nonDefaultDetails: JSON.stringify(nonDefaultDetails),
        };
    }))
        .then(() => console.log('The CSV file was written successfully'));
};
exports.default = importAnalyzer;
