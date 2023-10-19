import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import gitClone from './utils/gitClone.js';
import prompts from 'prompts';
import { readFile } from 'fs/promises';
import { log } from './utils/utils.js';
import { readdirSync } from 'fs';
import { micro_path } from './utils/path.js';
import ora from 'ora';

const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url))
);
//配置命令参数
const optionDefinitions = [
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'help', alias: 'h', type: Boolean }
];

//帮助命令
const helpSections = [
  {
    header: 'create-easyest',
    content: '一个快速生成组件库搭建环境的脚手架'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'version',
        alias: 'v',
        typeLabel: '{underline boolean}',
        description: '版本号'
      },
      {
        name: 'help',
        alias: 'h',
        typeLabel: '{underline boolean}',
        description: '帮助'
      }
    ]
  }
];
const remoteList = [
  { title: '默认demo', value: 'https://gitee.com/Hzk12/blog.git' },
  { title: '待开发', value: '', disabled: true },
];
const promptsOptions = [
  {
    type: 'text',
    name: 'name',
    message: '请输入项目名称'
  },
  {
    type: 'select', //单选
    name: 'template',
    message: '请选择一个模板',
    choices: remoteList
  }
];
const options = commandLineArgs(optionDefinitions);
const getTemplate = async () => {
  const { name, template } = await prompts(promptsOptions);
  if (!isDirectoryNameAvailable(name)) return getTemplate()
  gitClone(`direct:${template}`, name, { clone: true });
};
const runOptions = () => {
  if (options.version) {
    console.log(`v${pkg.version}`);
    return;
  }
  if (options.help) {
    console.log(commandLineUsage(helpSections));
    return;
  }
  getTemplate();
};


const isDirectoryNameAvailable = (name) => {
  if (!name?.trim()) {
    log.red('\n' + '❌ 项目名称不能为空')
    return false
  }
  const spinner = ora(`检测${name}是否可用`).start();
  const directoryPath = micro_path;
  const files = readdirSync(directoryPath);
  if (files.includes(name)) {
    spinner.fail(log.error(`项目名称 ${name} 已存在`))
    return false
  }
  spinner.stop()
  return true
}
runOptions();
