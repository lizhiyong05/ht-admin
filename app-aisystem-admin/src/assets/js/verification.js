/*
*   create: zhiyong.li
*   data: 2019/06/04
*   name: form 验证
* */

// 手机号验证
export function mobileValidate (rule, value, callback){
    if (!value) {
        return callback(new Error('请输入手机号'));
    } else {
        const reg = /^1\d{10}$/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的手机号'));
        }
    }
}
// 身份证验证
export function idValidate (rule, value, callback){
    if (!value) {
        return callback(new Error('请输入身份证号'));
    } else {
        const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的身份证号'));
        }
    }
}
// 正整数验证
export function intValidate (rule, value, callback){
    if (value != 0 && !value) {
        return callback(new Error(''));
    } else {
        const reg = /^\d+$/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error(''));
        }
    }
}
// 大于0的数
export function NumberValidate (rule, value, callback){
    if (!value) {
        return callback(new Error(''));
    } else {
        if(Number.isInteger(Number(value)) && Number(value) > 0){
            callback();
        }else{
            callback(new Error(''));
        }
    }
}
// 大于0的数字，小数后面最多2位小数
export function zhengshuValidate (rule, value, callback){
    let reg = /^(\d+)(\.\d{0,2})?$/;
    if(value == '' || reg.test(value) || value == null){
        callback();
    }else{
        callback(new Error(''));
    }
}