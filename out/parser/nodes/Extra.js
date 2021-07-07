"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "list",
    list: [
        {
            name: "ReturnStatement",
            return: (node, parser, format) => {
                return parser.nodeReturn(`return ${parser.parseNode(node.getLastChild())}`);
            }
        },
        {
            name: "ImportDeclaration",
            return: (node, parser, format) => {
                let file = node.getChildren()[3].getText().substring(1, node.getChildren()[3].getText().length - 1) + ".skript.js";
                let file2 = file.split("modules");
                let imported = require("../../../modules" + file2[1]);
                if (imported) {
                    parser.imports[node.getChildren()[1].getText()] = imported;
                    console.log("yes");
                }
            }
        },
    ]
};
//# sourceMappingURL=Extra.js.map