import * as ts from 'ts-morph';
import { Parser } from '../index'

export function parseBlockNode_(node: ts.Block, parser: Parser): string {
	let block = node
	let block_str = "";
	parser.indent_number += 1;
	block?.forEachChild(block_node => {

		block_str += "\n" + parser.parseNode(block_node);
	});
	parser.indent_number -= 1;

	return block_str
}

module.exports = {
	name: "list",
	list: [
		{
			name: "Block",
			return: (node: ts.Node, parser: Parser, format: boolean) => {
				return parseBlockNode_(node.getFirstChildByKind(ts.SyntaxKind.Block) as ts.Block, parser)
			}
		},
	],
	parseBlockNode: parseBlockNode_

}