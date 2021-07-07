"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("ts-morph"));
let { parseBlockNode } = require("./Block");
function parseFunctionDeclare(node, parser, afn) {
    let function_return_type = node.getReturnType().getText();
    let functions_args = node.getParameters();
    let args = "";
    if (functions_args) {
        functions_args.forEach((arg, index) => {
            if (index < functions_args.length - 1) {
                args += arg.getText() + ",";
            }
            else {
                args += arg.getText();
            }
        });
    }
    let func_body_str = parseBlockNode(node.getFirstChildByKind(ts.SyntaxKind.Block), parser);
    func_body_str = func_body_str.split("{").join("{_");
    if (node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0]) {
        if (function_return_type != "void")
            return `function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}) :: ${function_return_type}:${func_body_str}`;
        return `function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}):${func_body_str}`;
    }
    else {
        if (function_return_type != "void")
            return `function arrow_function_${afn}(${args}) :: ${function_return_type}:${func_body_str}`;
        return `function arrow_function_${afn}(${args}):${func_body_str}`;
    }
    return "";
}
function parseFunctionCall(node, parser) {
    let args = "";
    let node_args = node.getArguments();
    if (node_args) {
        node_args.forEach((arg, index) => {
            if (index < node_args.length - 1) {
                args += parser.parseNode(arg) + ",";
            }
            else {
                args += parser.parseNode(arg);
            }
        });
    }
    return `${node.getFirstChildByKind(ts.SyntaxKind.Identifier)?.getText()}(${args})`;
}
module.exports = {
    name: "list",
    list: [
        {
            name: "CallExpression",
            return: (node, parser, format) => {
                if (node.getFirstChildByKind(ts.SyntaxKind.PropertyAccessExpression)) {
                    let expr = node.getFirstChildByKind(ts.SyntaxKind.PropertyAccessExpression);
                    let basename = expr?.getFirstChild()?.getText();
                    if (parser.imports[basename]) {
                        let imported = parser.imports[basename];
                        return imported[expr?.getChildAtIndex(2).getText()](node, parser, format);
                    }
                    if (expr?.getFirstChild()?.getText() === parser.vars.defaultLib) {
                        switch (expr?.getText().substring(parser.vars.defaultLib.length + 1)) {
                            case 'on':
                                let func = node.getFirstChildByKind(ts.SyntaxKind.ArrowFunction);
                                let body = parseBlockNode(func.getFirstChildByKind(ts.SyntaxKind.Block), parser);
                                let text = node.getChildAtIndex(2).getFirstChildByKind(ts.SyntaxKind.StringLiteral)?.getLiteralText();
                                return `on ${text}:${body}`;
                            default:
                                debugger;
                        }
                    }
                }
                return parser.nodeReturn(parseFunctionCall(node, parser), format);
            }
        },
        {
            name: "FunctionDeclaration",
            return: (node, parser, format) => {
                return parseFunctionDeclare(node, parser);
            }
        },
    ],
    parseFunctionDeclare
};
//# sourceMappingURL=Functions.js.map