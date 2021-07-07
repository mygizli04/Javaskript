import * as ts from 'ts-morph';
import { Parser } from '../index'

module.exports = {
	name: "list",
	list: [
		{
			name: "ExpressionStatement",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				// @ts-expect-error
				return parser.parseNode(node.getExpression());
		
			}
		},
		{
			name: "BinaryExpression",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				let str = "";
				node.forEachChild((child) => {
					if (child.getKindName() === "EqualsToken") {
						str = "set " + str + " to ";
						return;
					}
					if (child.getKindName() === "EqualsEqualsToken") {
						str += " is "
						return;
					}
					if (child.getKindName() === "EqualsEqualsEqualsToken") {
						str += " is "
						return;
					}
					if (child.getKindName() === "ExclamationEqualsToken") {
						str += " is not "
						return;
					}
					str += parser.parseNode(child);
				});
				return parser.nodeReturn(str, format);
		
			}
		},

	]

}