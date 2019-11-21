// 工具
// 周硕梁
import GLOBAL from '@/assets/js/globalVariable.js';



export function getRandomKey (){
    function setTimeDateFmt (res){
        if(res <= 10){
            return '0'+res;
        }else{
            return res;
        }
    }
    const now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    month = setTimeDateFmt(month);
    hour = setTimeDateFmt(hour);
    minutes = setTimeDateFmt(minutes);
    seconds = setTimeDateFmt(seconds);
    return  now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.floor(Math.random() * 1000)).toString();
}


export function string2XML(xmlString) {
    let parser = new DOMParser();
    let xmlObject = parser.parseFromString(xmlString, "text/xml");
    return xmlObject;

}

export function debugLog(val) {

    if (GLOBAL.LOG_DISPLAY) {
        console.log(val)
    }


}

