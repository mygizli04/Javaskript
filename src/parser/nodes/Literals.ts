import * as ts from 'ts-morph';
import { Parser } from '../index'

let exprt: {
	name: string,
	list: Array<{
		name: string,
		return: (node: ts.Node, parser: Parser, format: boolean) => string
	}>
} = {
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
			name: "TrueKeyword",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return "true"
			}
		},
		{
			name: "FalseKeyword",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return "false"
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

module.exports = exprt