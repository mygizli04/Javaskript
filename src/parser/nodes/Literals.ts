import * as ts from 'ts-morph';
import { Parser } from '../index'

module.exports = {
	name: "list",
	list: [
		{
			name: "StringLiteral",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return node.getText();
			}
		},
		{
			name: "NumericLiteral",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return node.getText();
			}
		},
		{
			name: "PlusToken",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return "+"
			}
		},
		{
			name: "EndOfFileToken",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return ""
			}
		},
	]
}

