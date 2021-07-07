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
module.exports = {
    name: "list",
    list: [
        {
            name: "VariableDeclaration",
            return: (node, parser, format) => {
                return parser.nodeReturn("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + parser.parseNode(node.getLastChild(), false));
            }
        },
        {
            name: "VariableDeclarationList",
            return: (node, parser, format) => {
                return parser.parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclaration));
            }
        },
        {
            name: "VariableStatement",
            return: (node, parser, format) => {
                return parser.parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclarationList));
            }
        },
        {
            name: "Identifier",
            return: (node, parser, format) => {
                return `{${node.getText()}}`;
            }
        },
    ]
};
//# sourceMappingURL=Variables.js.map