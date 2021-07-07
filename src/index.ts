import * as fs from 'fs';
if (!fs.existsSync("./skript/src/index.ts")) {
	console.error('The file "./skript/src/index.ts" could not be found!');
	process.exit(1);
}
import { Generator } from "./generator";

let gen = new Generator(fs.readFileSync("./skript/src/index.ts").toString());
gen.parse((skript: string) => {
	fs.writeFile("./skript/out/index.sk", skript, (err) => {
		if (err) console.log(err);
	});
});