import * as ts from 'ts-morph';
import { Parser } from '../index'
let { parseBlockNode } = require("./Block") 

function parseFunctionDeclare(node: ts.Node,parser: Parser, afn?: string): string {
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
	let func_body_str = parseBlockNode(node.getFirstChildByKind(ts.SyntaxKind.Block), parser);
	func_body_str = func_body_str.split("{").join("{_"); // Make all vars private vars.
	if (node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0]) {
		if (function_return_type != "void") return `function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}) :: ${function_return_type}:${func_body_str}`;
		return `function ${node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText()}(${args}):${func_body_str}`;
	} else {
		if (function_return_type != "void") return `function arrow_function_${afn}(${args}) :: ${function_return_type}:${func_body_str}`;
		return `function arrow_function_${afn}(${args}):${func_body_str}`;
	}
	return "";
}


function parseFunctionCall (node: ts.Node,parser: Parser): string {
	let args = "";
	// @ts-expect-error
	let node_args = node.getArguments();
	if (node_args) {
		node_args.forEach((arg: ts.Node, index: number) => {
			if (index < node_args.length - 1) {
				args += parser.parseNode(arg) + ",";
			} else {
				args += parser.parseNode(arg);
			}
		});
	}
	return `${node.getFirstChildByKind(ts.SyntaxKind.Identifier)?.getText()}(${args})`;
}

module.exports = {
	name: "list",
	list: [
		{
			name: "CallExpression",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				if (node.getFirstChildByKind(ts.SyntaxKind.PropertyAccessExpression)) {
					let expr = node.getFirstChildByKind(ts.SyntaxKind.PropertyAccessExpression);
					let basename: string = expr?.getFirstChild()?.getText() as string
					if (parser.imports[basename]) {
						let imported = parser.imports[basename]
						return imported[expr?.getChildAtIndex(2).getText()](node, parser, format)
						
					}
					if (expr?.getFirstChild()?.getText() === parser.vars.defaultLib) {
						switch (expr?.getText().substring(parser.vars.defaultLib.length + 1)) {
							case 'on':
								let func = node.getFirstChildByKind(ts.SyntaxKind.ArrowFunction) as ts.Node;
								let body = parseBlockNode(func.getFirstChildByKind(ts.SyntaxKind.Block), parser);
								let text = node.getChildAtIndex(2).getFirstChildByKind(ts.SyntaxKind.StringLiteral)?.getLiteralText();
								return `on ${text}:${body}`;
							default:
								debugger
						}
					}
		
				}
				return parser.nodeReturn(parseFunctionCall(node, parser), format);
		
			}
		},
		{
			name: "FunctionDeclaration",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return parseFunctionDeclare(node,parser)
			}
		},
	],
	parseFunctionDeclare


}