import download from 'download-git-repo';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { exec } from 'child_process';

export default (remote, name, option) => {
  const downSpinner = ora('正在下载模板...').start();
  return new Promise((resolve, reject) => {
    const path = `../microApp/${name}`
    download(remote, path, option, async (err) => {
      if (err) {
        downSpinner.fail();
        console.log('err', chalk.red(err));
        reject(err);
        return;
      }
      downSpinner.succeed(chalk.green('模板下载成功！\n'));
      await getGitInfo(path)
      resolve();
    });
  });
};
const getGitInfo = async (path) => {
  const { isRemote } = await prompts([{
    type: 'select', //单选
    name: 'isRemote',
    message: '是否绑定远程参库',
    choices: [
      { title: '是', value: true },
      { title: '否', value: false },
    ]
  }]);
  if (isRemote) {
    await remoteUrl(path)
  }
  console.log(chalk.green(`cd ${path}\r\n`));
  console.log(chalk.blue('pnpm install\r\n'));
  console.log('pnpm run serve\r\n');
}

const remoteUrl = async (path) => {
  const { url } = await prompts([{
    type: 'text',
    name: 'url',
    message: '请输入gitlab参库地址'
  }]);
  if (!url.trim()) {
    console.log(chalk.red('\n❌ 请输入gitlab参库地址\n'));
    return remoteUrl(path)
  }
  return _remoteUrl(path, url)
}

const _remoteUrl = (path, remoteUrl) => {
  return new Promise((resolve, reject) => {
    const spinner = ora('正在初始化Git参库').start();

    process.chdir(path);

    // 初始化Git仓库
    exec('git init', (initErr, initStdout, initStderr) => {
      if (initErr) {
        spinner.fail(chalk.red.inverse.bold('初始化 Git 存储库失败:') + chalk.red(initErr));
        resolve()
      } else {
        spinner.succeed(chalk.green.inverse.bold('Git 存储库初始化成功.'));
        spinner.start(chalk.green('正在添加远程存储库...'));
        // 添加远程仓库
        exec(`git remote add origin ${remoteUrl}`, (remoteErr, remoteStdout, remoteStderr) => {
          if (remoteErr) {
            spinner.fail(chalk.red.inverse.bold('添加远程存储库失败:') + chalk.red(remoteErr));
          } else {
            spinner.succeed(chalk.green.inverse.bold('远程存储库添加成功:') + chalk.green(remoteUrl));
          }
          resolve()
        });
      }
    });
  })
}