import axios from 'axios';
import thisVue from '@/assets/js/bus'
axios.defaults.withCredentials=true;//让axios请求携带cookie
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 为表格提供loading动画 start
let loadingArr = [];
// 防止按钮重复点击 button按钮 才有效
function noMoreClick(DOM, type) {
    var el = document.querySelector(DOM);
    if(type == 1) {
        el.disabled = false;
        el.classList.remove('is-disabled');
    }else{
        el.disabled = true;
        el.classList.add('is-disabled');
    }
}
function startLoading(loadingEl){
    loadingArr.push({
        id: loadingEl,
        example: thisVue.$loading({
            lock: true,
            text: "Loading...",
            target: document.querySelector(loadingEl)//设置加载动画区域
        })
    });
}
function endLoading(loadingEl){
    loadingArr.find(item => item.id == loadingEl).example.close();
    loadingArr.splice(loadingArr.findIndex(item => item.id == loadingEl),1);
}
axios.interceptors.request.use((config) => {
    if (config.data.constructor !== FormData && config.data.hasOwnProperty('loading')) {
        startLoading(config.data.loading);
    }
    if (config.data.constructor !== FormData && config.data.hasOwnProperty('noRepeat')) {
        noMoreClick(config.data.noRepeat, 2);
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
axios.interceptors.response.use((response) => {
    if (response.config.data.constructor !== FormData && JSON.parse(response.config.data).hasOwnProperty('loading')) {
        endLoading(JSON.parse(response.config.data).loading);
    }
    if (response.config.data.constructor !== FormData && JSON.parse(response.config.data).hasOwnProperty('noRepeat')) {
        noMoreClick(JSON.parse(response.config.data).noRepeat, 1);
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});
// 为表格提供loading动画 end
export function axiosPost(url, data={}, retried=false){
    let defData = {
        tenantId: "01", // 租户号
        terminalno: pipelineNumber(), // 流水号
    };
    let newData = Object.assign(defData,data);
    let config = {
        headers:{
            ssoToken: getToken(),
            ssoUserId: getUserId()
        },
    };
    //If token is missed, call checkToken at once and retried
    if (!config.headers.ssoToken) {
//        console.log('no token');
        if (!retried) {
            return checkToken().then(() =>{
//                console.log('token gotten');
                return axiosPost(url, data, true);
            }, err=>{
//                console.log('error in get token');
                return Promise.reject(err);
            })
        }else {
            thisVue.$message({message:'认证失败，请确认您是否有权限访问本系统',type: 'warning'});
//            console.log('second wrong');
            return Promise.reject('Fail to authenticate');
        }
    }
    return new Promise((resolve,reject) => {
        let newUrl = '';
        if(process.env.VUE_APP_BRANCH_ENV !== 'dev'){ // 非开发环境 所有接口加前缀
            newUrl = '/tntSrv' + url;
        }else{
            newUrl = url;
        }
        axios.post(newUrl,newData,config)
            .then(res => {
                if(res.data.code == 1000 || res.data.code == 1001 || res.data.code == 1002){
                    var token_need_refresh = res.headers['token-need-refresh'];
//                    console.log("token_need_refresh"+token_need_refresh);
                    if(token_need_refresh == "true"){// 子系统token超10分钟未超60分钟，重新获取token，不重发本次请求
                        checkToken();
                    }
                    if(res.data.code == 1001){ // 如果有错误信息
                        thisVue.$message({message: res.data.data,type: 'warning'});
                    }
                    resolve(res.data);
                }else if(res.data.code == 500 && !retried){ // 子系统token已经过期，重新获取token，并重新发起当次请求
//                    console.log("token is invalid");
                    checkToken().then(() => {
//                        console.log("get token again to resent the request");
                        resolve(axiosPost(url, data, true));
                    }, err=>{
                        reject(err);
                    })
                }else{
                    thisVue.$message({message: res.data.msg,type: 'warning'});
                    reject(res.data.msg);
                }
            },() => {// 接口错误处理
                thisVue.$message({message:'服务器错误：Internal Server Error',type: 'warning'});
                reject('服务器错误：Internal Server Error');
            })
    })
}

export function checkToken(){
//    console.log('checkToken in');
    return new Promise((resolve,reject) => {
        let url = ht.config.sso_host+'/checkToken';
        axios.post(url,{})
            .then(res => {
                if(res.data.code == 500){
//                    console.log('will redirect');
//                    console.log('return data is ' + res.data);
                    window.location.href = ht.config.sso_host+res.data.msg+'?url='+encodeURIComponent(window.location);
                    reject('required to login');
                }else{
//                    console.log('check token well');
                    let data = JSON.parse(res.data.data);
                    localStorage.setItem('ht_token', data.token);//存储到localStorage
                    localStorage.setItem('ht_userId', data.userId);//存储到localStorage
                    resolve("token generated");
               }
            },() => {// 接口错误处理
                thisVue.$message({message:'checkToken 接口错误',type: 'warning'});
                reject('checkToken 接口错误');
            })
    })
}
/* 上传功能 */
export function fileUpload(item){
    let formData = new FormData();
    formData.append('file', item.file);
    formData.append('tenantId', '01');
    formData.append('frontId', item.data == undefined ? '' : item.data.frontId);
    formData.append('terminalno',pipelineNumber());
    let url = '';
    if(process.env.VUE_APP_BRANCH_ENV === 'dev'){ // 本地环境
        url = '/case/fileUpload';
    }else if(process.env.VUE_APP_BRANCH_ENV === 'release'){ // 联调环境
        url = 'http://172.16.93.1:8111/case/fileUpload';
    }else if(process.env.VUE_APP_BRANCH_ENV === 'test'){ // 测试环境
        url = 'http://10.66.254.174:8111/case/fileUpload';
    }else if(process.env.VUE_APP_BRANCH_ENV === 'gray'){ // gray环境
        url = 'http://172.16.93.11:8111/case/fileUpload';
    }else if(process.env.VUE_APP_BRANCH_ENV === 'pro'){ // pro环境
        url = 'http://172.18.3.57:8111/case/fileUpload'; // TODO 生产环境地址
    }
    return new Promise((resolve, reject) => {
        axios.post(url, formData,
            {headers:{'Content-Type':'multipart/form-data'},
                onUploadProgress: progressEvent => {
                    let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
                    item.onProgress({percent: complete})
                }})
            .then((res) => {
                if(res.data.code == 1000){
                    item.onSuccess('上传成功');
                    resolve(res.data);
                }else{
                    thisVue.$message({message: res.data.msg,type: 'warning'});
                }
            },()=>{
                thisVue.$message({message:'服务器错误：Internal Server Error',type: 'warning'});
                item.onProgress({percent: '0'});
                reject();
            });
    })
}
// 导入 isTrain 是否是对练的；
export function trainFileUplaod(url, item, isTrain = false) {
    let config = {
        headers:{
            ssoToken: getToken(),
            ssoUserId: getUserId(),
            'Content-Type':'multipart/form-data',
        },
    };
    let formData = new FormData();
    var param = {
        tenantId: '01',
        terminalno: pipelineNumber(),
    }
    if(!isTrain) {
        for(let key in item) {
            if(key == 'file') {
                continue;
            }
            param[key] = item[key];
        }
        formData.append('file', item.file);
        formData.append('param', JSON.stringify(param));
    }else {
        for(let key in item) {
            formData.append(key, item[key]);
        }
        formData.append('tenantId', param.tenantId)
        formData.append('terminalno', param.terminalno)
    }
    return new Promise((resolve, reject) => {
        axios.post(url, formData, config)
            .then((res) => {
                if(res.data.code == 1000){
                    resolve(res.data);
                }else{
                    reject();
                    thisVue.$message({message: res.data.msg,type: 'warning'});
                }
            },()=>{
                reject();
                thisVue.$message({message:'服务器错误：Internal Server Error',type: 'warning'});
            });
    })
}
export function getToken(){
    return localStorage.getItem('ht_token');
}

function getUserId(){
    return localStorage.getItem('ht_userId');
}

/* 基本类型字典项数据 */
export async function getDictionariesAllData(){
        let getDictionariesAllData = sessionStorage.getItem('getDictionariesAllData');
        if(getDictionariesAllData){
            return JSON.parse(getDictionariesAllData);
        }else{
            await axiosPost('/systemMgr/param/dictionary',{})
                .then((res)=>{
                    sessionStorage.setItem('getDictionariesAllData',JSON.stringify(res.data));
                });
            return JSON.parse(sessionStorage.getItem('getDictionariesAllData'));
        }
}
/* 获取基本类型字典项数据的某个值 */
export async function getDictionariesNameData(){
    let getDictionariesNameData = sessionStorage.getItem('getDictionariesNameData');
    if(getDictionariesNameData){
        return JSON.parse(getDictionariesNameData);
    }else{
        await axiosPost('/systemMgr/param/dictionary/map',{})
            .then((res)=>{
                sessionStorage.setItem('getDictionariesNameData',JSON.stringify(res.data));
            });
        return JSON.parse(sessionStorage.getItem('getDictionariesNameData'));
    }
}
/* 知识体系字典项数据(仅获取产线项目) */
export async function getKnowLineAllData(){
    let getKnowAllData = sessionStorage.getItem('getKnowLineAllData');
    if(getKnowAllData){
        return JSON.parse(getKnowAllData);
    }else{
        await axiosPost('/systemMgr/know2/tree',{
            isLine: '1'
        })
            .then((res)=>{
                sessionStorage.setItem('getKnowLineAllData',JSON.stringify(res.data));
            });
        return JSON.parse(sessionStorage.getItem('getKnowLineAllData'));
    }
}

/* 知识体系字典项数据 */
export async function getKnowAllData(){
    let getKnowAllData = sessionStorage.getItem('getKnowAllData');
    if(getKnowAllData){
        return JSON.parse(getKnowAllData);
    }else{
        await axiosPost('/systemMgr/know2/tree',{})
            .then((res)=>{
                sessionStorage.setItem('getKnowAllData',JSON.stringify(res.data));
            });
        return JSON.parse(sessionStorage.getItem('getKnowAllData'));
    }
}
/* 知识体系字典项数据 - 对练管理 */
export async function getKnowTraimData(funcCode){
    var arr = []
    await axiosPost('/trainMgr/paramMgr/queryKnow',{funcCode: funcCode})
        .then((res)=>{
            arr = res.data.children
        });
    return arr;
}
/* 获取知识体系字典项数据的某个值 */
export async function getMapNameData(){
    let getMapNameData = sessionStorage.getItem('getMapNameData');
    if(getMapNameData){
        return JSON.parse(getMapNameData);
    }else{
        await axiosPost('/systemMgr/know/map',{})
            .then((res)=>{
                sessionStorage.setItem('getMapNameData',JSON.stringify(res.data));
            });
        return JSON.parse(sessionStorage.getItem('getMapNameData'));
    }
}
/* 机构字典项数据 */
export async function getOrgAllData(){
    let getOrgAllData = sessionStorage.getItem('getOrgAllData');
    if(getOrgAllData){
        return JSON.parse(getOrgAllData);
    }else{
        await axiosPost('/systemMgr/org2/tree',{})
            .then((res)=>{
                sessionStorage.setItem('getOrgAllData',JSON.stringify(res.data));
            });
        return JSON.parse(sessionStorage.getItem('getOrgAllData'));
    }
}
/* 获取机构字典项数据的某个值 */
export async function getOrgNameData(){
    let getOrgNameData = sessionStorage.getItem('getOrgNameData');
    if(getOrgNameData){
        return JSON.parse(getOrgNameData);
    }else{
        await axiosPost('/systemMgr/org/map',{})
            .then((res)=>{
                sessionStorage.setItem('getOrgNameData',JSON.stringify(res.data));
            });
        return JSON.parse(sessionStorage.getItem('getOrgNameData'));
    }
}
/* 获取菜单列表 */
export async function getMenuList(){
    let menuList = sessionStorage.getItem('menuList');
    if(menuList){
        return JSON.parse(menuList);
    }else{
        await axiosPost('/systemMgr/user/menuTree',{})
            .then(res => {
                sessionStorage.setItem('menuList',JSON.stringify(res.data));
                /* 获取所有列表项 */
                let newMenuList = [];
                function formatMenuList(menuList){
                    menuList.forEach((item) => {
                        newMenuList.push(item);
                        if(item.hasOwnProperty('children')){
                            formatMenuList(item.children);
                        }
                    });
                }
                formatMenuList(res.data);
                sessionStorage.setItem('allMenuList',JSON.stringify(newMenuList));
                /* 获取所有列表项的操作权限 */
                let permissions = [];
                function getOperationRight(re) {
                    re.map(i => {
                        if (i.hasOwnProperty('operationRight') && i.operationRight && i.operationRight.constructor === Array) {
                            permissions = [...permissions,...i.operationRight]
                        }
                        if (i.hasOwnProperty('children')) {
                            getOperationRight(i.children)
                        }
                    })
                }
                getOperationRight(res.data);
                sessionStorage.setItem('permissions',JSON.stringify(permissions));

            });
        return JSON.parse(sessionStorage.getItem('menuList'));
    }
}
/* 获取菜单列表所对应的操作权限 */
export async function getOperationData(menuName=false){
    return getMenuList().then(res => {
        if(res){
            let allMenuList = JSON.parse(sessionStorage.getItem('allMenuList'));
            let permissions = JSON.parse(sessionStorage.getItem('permissions'));
            if (!menuName){
                return permissions;
            }
            return allMenuList.find(item => {
                return item.cnName == menuName;
            }).operationRight;
        }
    });

}
/*  流水号 */
function pipelineNumber() {
    const now = new Date();
    let year = '' + now.getFullYear();
    let month = dateFormat(now.getMonth() + 1);
    let day = dateFormat(now.getDate());
    let hour = dateFormat(now.getHours());
    let minutes = dateFormat(now.getMinutes());
    let seconds = dateFormat(now.getSeconds());
    return year + month + day + hour + minutes + seconds + Math.floor((Math.random()*99999)).toString().substring(0,3);
}
/* 格式化日期 */
function dateFormat(res){
    if(res < 10){
        return '0'+res;
    }else{
        return ''+res;
    }
}
