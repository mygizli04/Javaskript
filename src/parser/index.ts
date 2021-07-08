import * as fs from 'fs';
import * as ts from 'ts-morph';
import { Generator } from '../generator'


export class Parser {
	constructor(generator: Generator) {
		this.project = new ts.Project();
		this.indent_number = 0;
		this.on_load = [];
		this.vars = {};
		this.generator = generator
		this.nodes = {}
		this.imports = {}




	}
	async initNodes() {
		return new Promise((resolve, reject) => {
			fs.readdir("./out/parser/nodes/", (err, dir) => {
				if (err) return 
				dir.forEach((filename) => {
					if (filename.endsWith(".js")) {
						let file = require("./nodes/" + filename)
						if (file.name === "list") {
							file.list.forEach((node: any) => {
								this.nodes[node.name] = node
							});
						} else {
							this.nodes[file.name] = file
						}
					}
				})
				resolve("")
			})
		})

	}

	parseNode(Node: ts.Node, format: boolean = true): string {
		if (this.nodes[Node.getKindName()]) {
			return this.nodes[Node.getKindName()].return(Node, this, format)
		} else {
			debugger
			return ""
		}
	}



	nodeReturn(text: string, format: boolean = true): string {
		if (!format) return text;
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

	nodes: { [key: string]: any; } 
	imports: { [key: string]: any; } 
	project: ts.Project
	indent_number: number
	on_load: Array<string>
	vars: { [key: string]: any; }
	generator: Generator
}