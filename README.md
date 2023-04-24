# import-analyzer

Aggregate all Javascript files' import information

## Usage
`import-analyzer -p <path> -r <removeImports>`

Example: `import-analyzer -p src/subdir -r '^@root/.*'`

Check `import-analyzer --help` for more options

## Output example

```
  react: {
    importFiles: 19,
    defaultImports: 0,
    nonDefault: 27,
    nonDefaultDetails: {
      useState: 8,
      useMemo: 9,
      useEffect: 4,
      createContext: 1,
      useContext: 1,
      ReactNode: 2,
      ChangeEvent: 1,
      ReactElement: 1
    }
  },
  lodash: {
    importFiles: 5,
    defaultImports: 0,
    nonDefault: 7,
    nonDefaultDetails: { get: 3, debounce: 2, set: 1, isEmpty: 1 }
  },
  'react-ace': {
    importFiles: 1,
    defaultImports: 1,
    nonDefault: 0,
    nonDefaultDetails: {}
  },
  'react-router-dom': {
    importFiles: 19,
    defaultImports: 0,
    nonDefault: 31,
    nonDefaultDetails: {
      Switch: 3,
      Route: 6,
      MemoryRouter: 1,
      useLocation: 8,
      matchPath: 1,
      useHistory: 5,
      Link: 1,
      useParams: 5,
      Redirect: 1
    }
  },
```
