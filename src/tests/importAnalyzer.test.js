import importAnalyzer from '../importAnalyzer';

const testFilesPath = './src/tests/fixtures';

describe('importAnalyzer', () => {
  it('return correct import info', () => {
    expect(importAnalyzer(testFilesPath)).toStrictEqual({
      react: {
        importFiles: 3,
        defaultImports: 2,
        nonDefault: 2,
        nonDefaultDetails: {useState: 1, createContext: 1},
      },
      'prop-types': {
        importFiles: 1,
        defaultImports: 1,
        nonDefault: 0,
        nonDefaultDetails: {},
      },
      ui: {
        importFiles: 3,
        defaultImports: 1,
        nonDefault: 5,
        nonDefaultDetails: {Toast: 1, Box: 2, Icon: 1, Button: 1},
      },
      'react-router-dom': {
        importFiles: 1,
        defaultImports: 0,
        nonDefault: 1,
        nonDefaultDetails: {useHistory: 1},
      },
      lodash: {
        importFiles: 1,
        defaultImports: 0,
        nonDefault: 2,
        nonDefaultDetails: {a: 1, b: 1},
      },
      '@root/Test1': {
        defaultImports: 1,
        importFiles: 1,
        nonDefault: 0,
        nonDefaultDetails: {},
      },
      '@root/shared/page_loading': {
        defaultImports: 1,
        importFiles: 1,
        nonDefault: 0,
        nonDefaultDetails: {},
      },
      '@root/test/Test2': {
        defaultImports: 1,
        importFiles: 1,
        nonDefault: 0,
        nonDefaultDetails: {},
      },
    });
  });

  it('return correct import info', () => {
    expect(
      importAnalyzer(testFilesPath, {
        gitIgnoreFile: '.gitignore',
        ignorePaths: ['**/subfolder/**'],
        importIgnoreRegExp: '^@root/.*',
      })
    ).toStrictEqual({
      react: {
        importFiles: 2,
        defaultImports: 2,
        nonDefault: 0,
        nonDefaultDetails: {},
      },
      lodash: {
        importFiles: 1,
        defaultImports: 0,
        nonDefault: 2,
        nonDefaultDetails: {a: 1, b: 1},
      },
      ui: {
        importFiles: 2,
        defaultImports: 1,
        nonDefault: 4,
        nonDefaultDetails: {Box: 2, Icon: 1, Button: 1},
      },
    });
  });
});
