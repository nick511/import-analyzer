"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const ast_types_1 = require("ast-types");
const parseImports = (code, importIgnoreRegExp) => {
    let ast = null;
    try {
        ast = parser_1.parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
        });
    }
    catch (e) {
        console.log(e);
    }
    if (!ast) {
        return null;
    }
    const ignoreImportRegex = importIgnoreRegExp
        ? new RegExp(importIgnoreRegExp)
        : null;
    const importInfo = {};
    ast_types_1.visit(ast.program.body, {
        visitImportDeclaration(path) {
            const source = path.node.source.value;
            if (ignoreImportRegex === null || ignoreImportRegex === void 0 ? void 0 : ignoreImportRegex.test(source)) {
                return false;
            }
            importInfo[source] = { default: false, imports: [] };
            if (path.node.specifiers.length === 0) {
                importInfo[source].default = true;
            }
            path.node.specifiers.forEach((specifier) => {
                var _a;
                if (specifier.type === 'ImportDefaultSpecifier') {
                    importInfo[source].default = true;
                }
                else {
                    importInfo[source].imports.push((_a = specifier.imported) === null || _a === void 0 ? void 0 : _a.name);
                }
            });
            this.traverse(path);
        },
    });
    return importInfo;
};
exports.default = parseImports;
