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
function funcCall(node: ts.Node): string {
	let args = ""
	// @ts-expect-error
	let node_args = node.getArguments()
	if (node_args){
		node_args.forEach((arg: ts.Node, index:number) => {
			if (index < node_args.length - 1) {
				args += parseNode(arg) + ","
			} else {
				args += parseNode(arg)
			}			
		});
	}
	return `${node.getFirstChildByKind(ts.SyntaxKind.Identifier)?.getText()}(${args})`
}


function parseNode(node: ts.Node): string {
	switch (node.getKindName()) {
		case 'ExpressionStatement':
			if (indent_number == 0) {
				on_load.push(funcCall(node))
				return skip
			} else {
				return nodeReturn(funcCall(node))
			}
		case 'CallExpression':
			return nodeReturn(funcCall(node))
		case 'StringLiteral':
			return node.getText()
		case 'NumericLiteral':
			return node.getText()
		case 'PlusToken':
			return "+"
		case 'VariableDeclaration':
			if (indent_number == 0) {
				on_load.push("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + parseNode(node.getLastChild() as ts.Node))
				return skip
			} else {
				return nodeReturn("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + parseNode(node.getLastChild() as ts.Node))
			}
		case 'VariableDeclarationList':
			return parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclaration) as ts.Node)
		case 'VariableStatement':
			return parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclarationList) as ts.Node)
		case 'Identifier':
			return `{${node.getText()}}`
		case 'BinaryExpression':
			let str = ""
			node.forEachChild((child) => {
				str += parseNode(child)
			})
			return str
		case 'FunctionDeclaration':
			let function_body = node.getFirstChildByKind(ts.SyntaxKind.Block)
			// @ts-expect-error
			let function_return_type = node.getReturnType().getText()
			// @ts-expect-error
			let functions_args = node.getParameters();
			let func_body_str = ""
			let args = ""
			if (functions_args) {
				functions_args.forEach((arg: ts.Node, index: number) => {
					if (index < functions_args.length - 1) {
						args += arg.getText() + ","
					} else {
						args += arg.getText()
					}
					
				});
			}
			indent_number += 1
			function_body?.forEachChild(function_node => {
				
				func_body_str += parseNode(function_node) + "\n"
			})
			indent_number -= 1
			if (function_return_type) return nodeReturn(`function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}) :: ${function_return_type}:\n${func_body_str}`)
			return nodeReturn(`function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}):\n${func_body_str}`)
		case 'ReturnStatement':
			return nodeReturn(`return ${parseNode(node.getLastChild() as ts.Node)}`)
		default:
			console.log("new: " + node.getKindName())
		//	console.log(node.getChildren())
		break
	}
	return ""
}