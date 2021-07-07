import * as fs from 'fs';
import { Generator } from "./generator"





let gen = new Generator(fs.readFileSync("./skript/src/index.ts").toString())
gen.parse((skript: string) => {
	fs.writeFile("./skript/out/index.sk", skript, (err) => {
		if (err) console.log(err);
	  })
})



