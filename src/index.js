#!/usr/bin/env node
const readline = require('readline');
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { promiseify } = require('./utils')

const result = []
const question = ['请输入项目名称']
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `？${question[0]} `
});
rl.prompt();

const writeFile = promiseify(fs.writeFile)
const exec = promiseify(child_process.exec)
const dependencies = ['mvvm-element'];

(async () => {
  try {
    await exec('npm init -y');
  
    const pkg = require(path.resolve(process.cwd(), 'package.json'));

    rl.on('line', async line => {
      pkg.name = line.trim()
      result.push(line.trim())
  
      const max = result.length

      try {
        const data = new Uint8Array(Buffer.from(JSON.stringify(pkg, null, 2)));

        await writeFile('package.json', data);
      } catch (error) {
        console.log(error);
      }

      if (max === question.length) {
        console.log('安装中...')

        for (let i = 0, len = dependencies.length; i < len; i++) {
          const message = await exec(`npm i ${dependencies[i]}`)

        }

        console.log('安装完成！')
        rl.close()
      }

      rl.setPrompt(`？${question[max]} `)
      rl.prompt();
    }).on('close', () => {
      process.exit(0);
    });
  } catch (error) {
    console.log(error)
  }
})()
