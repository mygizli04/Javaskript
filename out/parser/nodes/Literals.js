"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "list",
    list: [
        {
            name: "StringLiteral",
            return: (node, parser, format) => {
                return node.getText();
            }
        },
        {
            name: "NumericLiteral",
            return: (node, parser, format) => {
                return node.getText();
            }
        },
        {
            name: "PlusToken",
            return: (node, parser, format) => {
                return "+";
            }
        },
        {
            name: "EndOfFileToken",
            return: (node, parser, format) => {
                return "";
            }
        },
    ]
};
//# sourceMappingURL=Literals.js.map