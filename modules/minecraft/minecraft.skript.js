let ts = require('ts-morph')

function parseBlockNode(node, parser) {
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
	on: (node, parser, format) => {
		let event = node.getChildAtIndex(2).getChildAtIndex(0).getLiteralValue()
		let block = node.getChildAtIndex(2).getChildAtIndex(2).getFirstChildByKind(ts.SyntaxKind.Block)
		return `on ${event}: ${parseBlockNode(block, parser)}`
	},
	broadcast: (node, parser, format) => {
		let string = node.getChildAtIndex(2).getChildAtIndex(0).getLiteralValue()
		return parser.nodeReturn(`broadcast "${string}"`)
	}
}