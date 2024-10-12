import fs from 'node:fs';
import path from 'node:path';
import { read } from './lib/parser.js';
import { build } from './lib/printer.js';

import { program } from 'commander';

program
  .name('rs2ts')
  .description('create TS interface from RUST struct  [  ->  ] ')
  .version('0.0.1');

program
  .option('-i, --in <SOURCE>', 'source .rs file', (fpath) => {
    if(fs.existsSync(fpath)) {
      return fpath;
    }
    console.error('--in rs file not exists');
    return null;
  })
program
  .option('-o, --out <TARGET>', 'target .ts file', (fpath) => {
    const pr = path.parse(fpath);
    if(fs.existsSync(pr.dir)) {
      if(pr.ext !== '.ts'){
        console.error('--out need .ts ext');
        return null;
      }
      return fpath;
    }
    console.error('--out no dir exists');
    return null;
  });

program.parse();

const options = program.opts();
if(options.in && options.out) {
  const content = fs.readFileSync(options.in).toString();
  const items = read(content);
  // console.log(items[0]);
  const result = build(items);
  fs.writeFileSync(options.out, result);
}