import {parse} from '@babel/parser';
import {visit} from 'ast-types';

const parseImports = (code, ignoreImport = null) => {
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

export default parseImports;
