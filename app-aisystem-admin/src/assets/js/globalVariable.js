/*
*   create: zhiyong.li
*   data: 2019/06/04
*   name: 定义全局变量或者常量
* */
const SERVE_FILE_ADDRESS = 'http://10.66.254.177:8888'; // 服务器文件地址
const TIPS_DISPLAY = true; // tips提示全局开关
const LOG_DISPLAY = true; // console.log全局开关（需使用debugLog方法）
export default {
    SERVE_FILE_ADDRESS: SERVE_FILE_ADDRESS,
    TIPS_DISPLAY: TIPS_DISPLAY,
    LOG_DISPLAY: LOG_DISPLAY,
}
