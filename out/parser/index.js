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
exports.Parser = void 0;
const fs = __importStar(require("fs"));
const ts = __importStar(require("ts-morph"));
class Parser {
    constructor(generator) {
        this.project = new ts.Project();
        this.indent_number = 0;
        this.on_load = [];
        this.vars = {};
        this.generator = generator;
        this.nodes = {};
        this.imports = {};
    }
    async initNodes() {
        return new Promise((resolve, reject) => {
            fs.readdir("./out/parser/nodes/", (err, dir) => {
                if (err)
                    return;
                dir.forEach((filename) => {
                    if (filename.endsWith(".js")) {
                        let file = require("./nodes/" + filename);
                        if (file.name === "list") {
                            file.list.forEach((node) => {
                                this.nodes[node.name] = node;
                            });
                        }
                        else {
                            this.nodes[file.name] = file;
                        }
                    }
                });
                resolve("");
            });
        });
    }
    parseNode(Node, format = true) {
        if (this.nodes[Node.getKindName()]) {
            return this.nodes[Node.getKindName()].return(Node, this, format);
        }
        else {
            return "";
        }
    }
    nodeReturn(text, format = true) {
        if (!format)
            return text;
        if (this.indent_number === 0) {
            this.on_load.push(text);
            return "";
        }
        let tabs = "";
        if (this.indent_number >= 1) {
            for (var i = 0; i < this.indent_number; i++) {
                tabs += '\t';
            }
        }
        return tabs + text;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=index.js.map