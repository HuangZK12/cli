import chalk from 'chalk';

/**
 * 工具包
 */

export const log = {
    /**
     * 红色输出
     *
     * @param {*} lines 内容行
     */
    red(...lines) {
        lines.forEach((line) => {
            this._log(chalk.red(line));
        });
    },

    /**
     * 蓝色输出
     *
     * @param {*} lines 内容行
     */
    blue(...lines) {
        lines.forEach((line) => {
            this._log(chalk.blue(line));
        });
    },

    /**
     * 绿色输出
     *
     * @param {*} lines 内容行
     */
    green(...lines) {
        lines.forEach((line) => {
            this._log(chalk.green(line));
        });
    },

    /**
     * 蓝绿色输出
     */
    cyan(...lines) {
        lines.forEach((line) => {
            this._log(chalk.cyan(line));
        });
    },

    /**
     * 成功文本
     */
    success(text, br = '\n') {
        return chalk.green.bold(text + br)
    },
    successBg(text, br = '\n') {
        return chalk.green.inverse.bold(text + br)
    },
    /**
     * 失败文本
     */
    error(text, br = '\n') {
        return chalk.red(text + br)
    },
    errorBg(text, br = '\n') {
        return chalk.red.inverse.bold(text + br)
    },
    /**
     * 标题
     *
     * @param {*} lines 内容行
     */
    title(...lines) {
        lines.forEach((line) => {
            this._log(chalk.inverse(' ' + line + ' ' + '\n'));
        });
    },
    /**
     * 打印调试内容
     *
     * @param {*} line
     * @private
     */
    _log(line) {
        if (line instanceof Object) {
            line = JSON.stringify(line);
        }

        console.log(line + '\n');
    }
}