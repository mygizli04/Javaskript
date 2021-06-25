import * as fs from 'fs';
import * as ts from 'ts-morph';

const project = new ts.Project();

let indent_number: number = 0;
let on_load: Array<string> = [];
let skript: string = "";
let vars: {[key: string] : any} = {}

skript += convertFile(fs.readFileSync('./src/index.ts').toString());
if (on_load.length >= 1) {
	skript += "on load:\n";
	on_load.forEach(line => {
		skript += "\t" + line + "\n";
	});
}
fs.writeFileSync('./out/index.sk', skript);

function convertFile (file: string) {

	const parsed = project.createSourceFile('temp.ts', file);
	//console.log(parsed)
	skript = "";
	parsed.forEachChild((node: ts.Node) => {
		let tempsk = parseNode(node);
		if (tempsk) {
			skript += tempsk + "\n";
		}
	});
	return skript;
}

function nodeReturn (text: string, format: boolean = true): string {
	if (!format) return text;
	if (indent_number === 0) {
		on_load.push(text);
		return "";
	}
	let tabs = "";
	if (indent_number >= 1) {
		for (var i = 0; i < indent_number; i++) {
			tabs += '\t';
		}
	}
	return tabs + text;
}
function funcCall (node: ts.Node): string {
	let args = "";
	// @ts-expect-error
	let node_args = node.getArguments();
	if (node_args) {
		node_args.forEach((arg: ts.Node, index: number) => {
			if (index < node_args.length - 1) {
				args += parseNode(arg) + ",";
			} else {
				args += parseNode(arg);
			}
		});
	}
	return `${node.getFirstChildByKind(ts.SyntaxKind.Identifier)?.getText()}(${args})`;
}

//@ts-ignore
function getAllChildrenName(node: ts.Node) { 
	
	node.forEachChild((child) => {
		console.log(child.getText())
		console.log(child.getKindName())
	})
}

function parseFunctionBody(node: ts.Node): string {
	let function_body = node.getFirstChildByKind(ts.SyntaxKind.Block);
	let func_body_str = "";
	indent_number += 1;
	function_body?.forEachChild(function_node => {

		func_body_str += "\n" + parseNode(function_node);
	});
	indent_number -= 1;
	return func_body_str
}

function parseFunction(node: ts.Node, afn?: string): string {
	// @ts-expect-error
	let function_return_type = node.getReturnType().getText();
	// @ts-expect-error
	let functions_args = node.getParameters();
	
	let args = "";
	if (functions_args) {
		functions_args.forEach((arg: ts.Node, index: number) => {
			if (index < functions_args.length - 1) {
				args += arg.getText() + ",";
			} else {
				args += arg.getText();
			}

		});
	}
	let func_body_str = parseFunctionBody(node);
	func_body_str = func_body_str.split("{").join("{_"); // Make all vars private vars.
	if (node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0]) {
		if (function_return_type != "void") return `function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}) :: ${function_return_type}:${func_body_str}`;
		return `function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}):${func_body_str}`;
	} else {
		if (function_return_type != "void") return `function arrow_function_${afn}(${args}) :: ${function_return_type}:${func_body_str}`;
		return `function arrow_function_${afn}(${args}):${func_body_str}`;		
	}
	return ""
}

function parseNode (node: ts.Node, format: boolean = true): string {
	switch (node.getKindName()) {
		case 'ExpressionStatement':
			// @ts-expect-error
			return parseNode(node.getExpression());
		case 'CallExpression':
			if (node.getFirstChildByKind(ts.SyntaxKind.PropertyAccessExpression)) {
				let expr = node.getFirstChildByKind(ts.SyntaxKind.PropertyAccessExpression)
				if (expr?.getFirstChild()?.getText() === vars.defaultLib) {
					if (expr?.getText() === vars.defaultLib + ".on") {
						let func = node.getFirstChildByKind(ts.SyntaxKind.ArrowFunction) as ts.Node
						let body = parseFunctionBody(func)
						let text = node.getChildAtIndex(2).getFirstChildByKind(ts.SyntaxKind.StringLiteral)?.getLiteralText()
						return `on ${text}:${body}`
						
					}
				}

			}
			return nodeReturn(funcCall(node), format);
		case 'StringLiteral':
			return node.getText();
		case 'NumericLiteral':
			return node.getText();
		case 'PlusToken':
			return "+";
		case 'VariableDeclaration':
			return nodeReturn("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + parseNode(node.getLastChild() as ts.Node, false));
		case 'VariableDeclarationList':
			return parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclaration) as ts.Node);
		case 'VariableStatement':
			return parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclarationList) as ts.Node);
		case 'Identifier':
			return `{${node.getText()}}`;
		case 'BinaryExpression':
			let str = "";
			node.forEachChild((child) => {
				if (child.getKindName() === "EqualsToken") {
					str = "set " + str + " to ";
					return;
				}
				str += parseNode(child);
			});
			return nodeReturn(str);
		case 'FunctionDeclaration':
			return parseFunction(node)
		case 'ReturnStatement':
			return nodeReturn(`return ${parseNode(node.getLastChild() as ts.Node)}`);
		case 'EndOfFileToken':
			return "";
		case 'ImportDeclaration':
			//The imported lib
			if( node.getChildren()[3].getText().substring(1,node.getChildren()[3].getText().length - 1) === "minecraft") {
				vars.defaultLib = node.getChildren()[1].getText()
			}
			return "";
		default:
			console.log("new: " + node.getKindName());
			//	console.log(node.getChildren())
			debugger;
			break;
	}
	return "";
}