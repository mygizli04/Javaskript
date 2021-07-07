import * as ts from 'ts-morph';
import { Parser } from '../index'

module.exports = {
	name: "list",
	list: [
		{
			name: "VariableDeclaration",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
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