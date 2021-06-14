import * as fs from 'fs'
import * as ts from 'ts-morph'

const project = new ts.Project();

const skip = "//@skip"
let indent_number: number = 0
let on_load: Array<string> = []
let skript: string = ""

fs.readdirSync('./src').forEach(file => {
	skript += convertFile(fs.readFileSync('./src/' + file).toString())
});


if (on_load.length >= 1) {
	skript += "on load:\n"
	on_load.forEach(line => {
		skript += "\t" + line + "\n"
	})
}
fs.writeFileSync('./out/index.sk', skript)

function convertFile(file: string) {
	
	const parsed = project.createSourceFile('temp.ts', file);
	//console.log(parsed)
	skript = ""
	parsed.forEachChild((node: ts.Node) => {
		let tempsk = parseNode(node)
		if (tempsk != skip) {
			skript += tempsk + "\n"
		}
	})
	return skript
}

function nodeReturn(text: string) {
	let tabs = ""
	if (indent_number >= 1) {
		for (var i = 0; i < indent_number; i++) {
			tabs += '\t'
		}
	}
	return tabs + text
}

function parseNode(node: ts.Node): string {
	switch (node.getKindName()) {
		case 'VariableDeclaration':
			if (indent_number == 0) {
				on_load.push("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + node.getLastChild()?.getFullText())
				return skip
			} else {
				return nodeReturn("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + node.getLastChild()?.getFullText())
			}
		case 'VariableDeclarationList':
			return parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclaration) as ts.Node)
		case 'VariableStatement':
			return parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclarationList) as ts.Node)
		case 'FunctionDeclaration':
			let function_body = node.getFirstChildByKind(ts.SyntaxKind.Block)
			let func_body_str = ""
			indent_number += 1
			function_body?.forEachChild(function_node => {
				
				func_body_str += parseNode(function_node)
			})
			indent_number -= 1
			return nodeReturn(`function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}():\n${func_body_str}`)
		default:
			//console.log("new: " + node.type)
			//console.log(node)
		break
	}
	return ""
}