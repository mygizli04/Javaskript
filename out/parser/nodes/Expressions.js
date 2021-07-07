"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "list",
    list: [
        {
            name: "ExpressionStatement",
            return: (node, parser, format) => {
                return parser.parseNode(node.getExpression());
            }
        },
        {
            name: "BinaryExpression",
            return: (node, parser, format) => {
                let str = "";
                node.forEachChild((child) => {
                    if (child.getKindName() === "EqualsToken") {
                        str = "set " + str + " to ";
                        return;
                    }
                    if (child.getKindName() === "EqualsEqualsToken") {
                        str += " is ";
                        return;
                    }
                    if (child.getKindName() === "EqualsEqualsEqualsToken") {
                        str += " is ";
                        return;
                    }
                    if (child.getKindName() === "ExclamationEqualsToken") {
                        str += " is not ";
                        return;
                    }
                    str += parser.parseNode(child);
                });
                return parser.nodeReturn(str, format);
            }
        },
    ]
};
//# sourceMappingURL=Expressions.js.map