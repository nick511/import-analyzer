const importAnalyzer = require('../index');

test('import data', () => {
  expect(
    importAnalyzer('~/shared/notif-ui/**/*.{js,jsx,ts,tsx}', {
      ignoreImport: '^@root/.*',
    })
  ).toStrictEqual({
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
  });
});
