import parseImports from '../parseImports';

const testCode = `
import {useState, createContext} from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'ui';
import {useHistory} from 'react-router-dom';
import Test1, {aaa, bbb} from '@root/Test1';
import PageLoading from '@root/shared/page_loading';
import Test2 from './Test2';
`;

describe('parseImports', () => {
  it('return correct importsData', () => {
    expect(parseImports(testCode)).toStrictEqual({
      react: {
        default: false,
        imports: ['useState', 'createContext'],
      },
      'prop-types': {
        default: true,
        imports: [],
      },
      ui: {
        default: false,
        imports: ['Toast'],
      },
      'react-router-dom': {
        default: false,
        imports: ['useHistory'],
      },
      '@root/Test1': {
        default: true,
        imports: ['aaa', 'bbb'],
      },
      '@root/shared/page_loading': {
        default: true,
        imports: [],
      },
      './Test2': {
        default: true,
        imports: [],
      },
    });
  });

  it('should ignoreImport', () => {
    const importsData = parseImports(testCode, '@root');
    expect(importsData['@root/Test1']).toBeUndefined();
    expect(importsData['@root/shared/page_loading']).toBeUndefined();
  });

  it('should return empty object when code is empty string', () => {
    expect(parseImports('')).toStrictEqual({});
  });

  it('should throw error when AST parsing failed', () => {
    expect(parseImports({})).toBeNull();
  });
});
