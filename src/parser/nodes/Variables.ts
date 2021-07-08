import * as ts from 'ts-morph';
import { Parser } from '../index'

module.exports = {
	name: "list",
	list: [
		{
			name: "VariableDeclaration",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				let children = node.getChildrenOfKind(ts.SyntaxKind.Identifier)
				if (children.length === 1) {
					// Let's assume undefined = <none> ?
					// Aka don't define the variable
					return ""
				}
				else if (parser.parseNode(node.getChildrenOfKind(ts.SyntaxKind.Identifier)[1]) === "{undefined}") {
					// You can't have a variable called "undefined" in javascript so 100% of the time it is the value undefined.
					return ""
				}
				return parser.nodeReturn("set {" + node.getChildrenOfKind(ts.SyntaxKind.Identifier)[0].getText() + "} to " + parser.parseNode(node.getLastChild() as ts.Node, false));
			}
		},
		{
			name: "VariableDeclarationList",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return parser.parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclaration) as ts.Node);
			}
		},
		{
			name: "VariableStatement",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return parser.parseNode(node.getFirstChildByKind(ts.SyntaxKind.VariableDeclarationList) as ts.Node);
			}
		},
		{
			name: "Identifier",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return `{${node.getText()}}`;
			}
		},

	]

}