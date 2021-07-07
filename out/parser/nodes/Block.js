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
exports.parseBlockNode_ = void 0;
const ts = __importStar(require("ts-morph"));
function parseBlockNode_(node, parser) {
    let block = node;
    let block_str = "";
    parser.indent_number += 1;
    block?.forEachChild(block_node => {
        block_str += "\n" + parser.parseNode(block_node);
    });
    parser.indent_number -= 1;
    return block_str;
}
exports.parseBlockNode_ = parseBlockNode_;
module.exports = {
    name: "list",
    list: [
        {
            name: "Block",
            return: (node, parser, format) => {
                return parseBlockNode_(node.getFirstChildByKind(ts.SyntaxKind.Block), parser);
            }
        },
    ],
    parseBlockNode: parseBlockNode_
};
//# sourceMappingURL=Block.js.map