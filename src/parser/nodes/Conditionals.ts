import * as ts from 'ts-morph';
import { Parser } from '../index'
let { parseBlockNode } = require("./Block") 

module.exports = {
	name: "list",
	list: [
		{
			name: "IfStatement",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				let statement = node as ts.IfStatement
				let conditional = parser.parseNode(node.getFirstChildByKind(ts.SyntaxKind.BinaryExpression) as ts.Node, false)
				let block = parseBlockNode(node.getFirstChildByKind(ts.SyntaxKind.Block), parser)
				let elsenode = statement.getElseStatement() as ts.Node
				let if_str = `if ${conditional}: ${block}`
				while (elsenode != null) {
					if (elsenode.getKind() == ts.SyntaxKind.IfStatement) {
						let else_statement = elsenode as ts.IfStatement
						let else_conditional = parser.parseNode(elsenode.getFirstChildByKind(ts.SyntaxKind.BinaryExpression) as ts.Node, false)
						let else_block = parseBlockNode(elsenode.getFirstChildByKind(ts.SyntaxKind.Block), parser)	
						let else_str = `else if ${else_conditional}:${else_block}`
						if_str += "\n" + parser.nodeReturn(else_str)
						elsenode = else_statement.getElseStatement() as ts.Node
					}
					if (elsenode.getKind() == ts.SyntaxKind.Block) {
						let elseblock = parseBlockNode(elsenode as ts.Block, parser)
						if_str += "\n" + parser.nodeReturn("else: " + elseblock)
						elsenode = null
					}
					
				}
	
				return parser.nodeReturn(if_str)
		
			}
		},
	]

}