import {parse} from '@babel/parser';
import {visit} from 'ast-types';

interface ImportInfo {
  default: boolean;
  imports: string[];
}

export type ImportInfoMap = Record<string, ImportInfo>;

const parseImports = (
  code: string,
  importIgnoreRegExp?: string
): ImportInfoMap | null => {
  let ast = null;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch (e) {
    console.log(e);
  }

  if (!ast) {
    return null;
  }

  const ignoreImportRegex = importIgnoreRegExp
    ? new RegExp(importIgnoreRegExp)
    : null;

  const importInfo: ImportInfoMap = {};

  visit(ast.program.body, {
    visitImportDeclaration(path) {
      const source = path.node.source.value as string;

      if (ignoreImportRegex?.test(source)) {
        return false;
      }

      importInfo[source] = {default: false, imports: []};

      if (path.node.specifiers.length === 0) {
        importInfo[source].default = true;
      }

      path.node.specifiers.forEach((specifier) => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          importInfo[source].default = true;
        } else {
          importInfo[source].imports.push(specifier.imported?.name);
        }
      });
      this.traverse(path);
    },
  });

  return importInfo;
};

export default parseImports;
