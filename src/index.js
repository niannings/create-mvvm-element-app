#!/usr/bin/env node
const readline = require('readline');
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { promiseify, openBrowser } = require('./utils')

const erroring = console.error

const writeFile = promiseify(fs.writeFile)
const exec = promiseify(child_process.exec)
const isWin = process.platform === 'win32'

async function handleInput(queue) {
  const dependencies = ['mvvm-element', 'parcel-bundler'];
  const [name] = queue;
  let pkg;
  let data;
  let curDep = dependencies[0];
  let root = process.cwd();
  let dir = path.resolve(root, `${name}`);

  try {
    const pkgPath = path.join(dir, 'package.json');
    let copyCommand = `${isWin ? 'xcopy' : 'cp -r'} ${path.join(root, 'src/template')} ${dir}`;

    await exec(`mkdir ${name}`);
    await exec(isWin ? `${copyCommand} /e` : copyCommand);

    pkg = require(pkgPath);
    pkg.name = name;
    data = new Uint8Array(Buffer.from(JSON.stringify(pkg, null, 2)));

    await writeFile(pkgPath, data);

    process.stdout.write(`${curDep} 安装中...\n`);

    while (curDep = dependencies.shift()) {
      await exec(`cd ${dir} && npm i ${curDep}`);

      process.stdout.write(`\x1b[00;44m OK \x1b[0m ${curDep} 安装成功\n${dependencies[0] ? `${dependencies[0]} 安装中...` : ''}\n`);
    }
  } catch (error) {
    erroring(error);
    erroring(`[${dependencies.join(', ')}]安装失败！\n`);

    process.exit(0);
  }

  process.stdout.write('安装完成: \x1b[00;44m http://localhost:1234');

  await exec(`cd ${dir} && npm start`);
  openBrowser('http://localhost:1234');
}

(async () => {
  const result = []
  const question = ['请输入项目名称']
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `？${question[0]} `
  });
  rl.prompt();

  rl.on('line', async line => {
    result.push(line.trim())
    const max = result.length

    if (max === question.length) {
      return rl.close()
    }

    rl.setPrompt(`？${question[max]} `)
    rl.prompt();
  }).on('close', () => {
    handleInput(result);
  });
})()
