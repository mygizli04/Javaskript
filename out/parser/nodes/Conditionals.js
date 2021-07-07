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
module.exports = {
    name: "list",
    list: [
        {
            name: "IfStatement",
            return: (node, parser, format) => {
                let statement = node;
                let conditional = parser.parseNode(node.getFirstChildByKind(ts.SyntaxKind.BinaryExpression), false);
                let block = parseBlockNode(node.getFirstChildByKind(ts.SyntaxKind.Block), parser);
                let elsenode = statement.getElseStatement();
                let if_str = `if ${conditional}: ${block}`;
                while (elsenode != null) {
                    if (elsenode.getKind() == ts.SyntaxKind.IfStatement) {
                        let else_statement = elsenode;
                        let else_conditional = parser.parseNode(elsenode.getFirstChildByKind(ts.SyntaxKind.BinaryExpression), false);
                        let else_block = parseBlockNode(elsenode.getFirstChildByKind(ts.SyntaxKind.Block), parser);
                        let else_str = `else if ${else_conditional}:${else_block}`;
                        if_str += "\n" + parser.nodeReturn(else_str);
                        elsenode = else_statement.getElseStatement();
                    }
                    if (elsenode.getKind() == ts.SyntaxKind.Block) {
                        let elseblock = parseBlockNode(elsenode, parser);
                        if_str += "\n" + parser.nodeReturn("else: " + elseblock);
                        elsenode = null;
                    }
                }
                return parser.nodeReturn(if_str);
            }
        },
    ]
};
//# sourceMappingURL=Conditionals.js.map