#!/usr/bin/env node
const readline = require('readline');
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { promiseify, mkdir } = require('./utils')

const erroring = console.error

const writeFile = promiseify(fs.writeFile)
const exec = promiseify(child_process.exec)

async function handleInput(queue) {
  const dependencies = ['mvvm-element'];
  const [name] = queue
  let pkg
  let data
  let root = process.cwd()
  let dir = path.resolve(root, `${name}`)

  try {
    await exec(`mkdir ${name};cd ${name};npm init -y;cp -r ${root}/src/template/* ${dir}`);

    pkg = require(`${dir}/package.json`);
    pkg.name = name
    data = new Uint8Array(Buffer.from(JSON.stringify(pkg, null, 2)));

    await writeFile(`${dir}/package.json`, data);

    console.log('安装中...');
    
    for (let i = 0, len = dependencies.length; i < len; i++) {
      await exec(`cd ${dir};npm i ${dependencies[i]}`)
    }
  } catch (error) {
    erroring(error);
    process.exit(0);
  }


  console.log('安装完成！');
  process.exit(0);
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
