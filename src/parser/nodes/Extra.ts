import * as ts from 'ts-morph';
import * as fs from 'fs';
import { Parser } from '../index'

module.exports = {
	name: "list",
	list: [
		{
			name: "ReturnStatement",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return parser.nodeReturn(`return ${parser.parseNode(node.getLastChild() as ts.Node)}`);
		
			}
		},
		{
			name: "ImportDeclaration",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				let file = node.getChildren()[3].getText().substring(1, node.getChildren()[3].getText().length - 1) + ".skript.js"
				let file2 = file.split("modules")

				let imported = require("../../../modules" + file2[1])

				if (imported) {
					parser.imports[node.getChildren()[1].getText()] = imported
					console.log("yes")
				}
		
			}
		},
	]

}