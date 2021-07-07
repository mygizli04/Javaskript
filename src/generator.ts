import { Parser } from './parser/index'
import * as ts from 'ts-morph';


export class Generator {
	constructor(contents: string) {
		this.skript = ""
		this.contents = contents
		this.parser = new Parser(this)
	}

	async parse(callback: Function) {
		await this.parser.initNodes()

		const parsed = this.parser.project.createSourceFile('temp.ts', this.contents);
		//console.log(parsed)
		parsed.forEachChild((node: ts.Node) => {
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
		callback(this.skript)
	}

	skript: string
	contents: string
	parser: Parser
} 