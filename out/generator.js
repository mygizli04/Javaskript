"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const index_1 = require("./parser/index");
class Generator {
    constructor(contents) {
        this.skript = "";
        this.contents = contents;
        this.parser = new index_1.Parser(this);
    }
    async parse(callback) {
        await this.parser.initNodes();
        const parsed = this.parser.project.createSourceFile('temp.ts', this.contents);
        parsed.forEachChild((node) => {
            let tempsk = this.parser.parseNode(node);
            if (tempsk) {
                this.skript += tempsk + "\n";
            }
        });
        if (this.parser.on_load.length >= 1) {
            this.skript += "on load:\n";
            this.parser.on_load.forEach(line => {
                this.skript += "\t" + line + "\n";
            });
        }
        callback(this.skript);
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map