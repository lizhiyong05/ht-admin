<template>
    <div class="new-class-room-reserve">
        <el-dialog :visible.sync="copyReserveIsShow" title="预约" class="need-header" custom-class="dialog-reserve" @close="closeRemodal">
            <div class="dialog-container">
                <el-form :inline="true" label-width="100px">
                    <el-form-item label="所属区域" size="small">
                        <el-select v-model="searchData.area" placeholder="请选择所属区域">
                            <el-option v-for="(item,ind) in dictionariesAllData['area_all']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="教室类型" size="small">
                        <el-select v-model="searchData.roomType" placeholder="请选择教室类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['roomType_all']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item size="small">
                        <el-button type="primary" @click="searchList" class="no-repeat-click">查询</el-button>
                    </el-form-item>
                    <el-form-item size="small">
                        <el-button type="plaint" v-show="isFlag == 2" @click="isFlag = 1">返回</el-button>
                    </el-form-item>
                </el-form>
                <div class="tips-select">
                    <ul class="clearfix">
                        <li class="fl" v-for="item in tipsData">
                            <span class="fl" :class="item.tipsClass"></span>
                            <span class="fl">{{ item.tipsText }}</span>
                        </li>
                    </ul>
                </div>
                <!-- 以天选择 -->
                <div class="day-rserver table-loading" v-if="isFlag == 1" v-show="reserveDate.length > 0">
                    <div class="rserver-header">
                        <div class="header-date">
                            <el-date-picker
                                    v-model="searchData.startDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    class="appoint-date"
                                    @change="dateChange"
                                    :clearable="false"
                            >
                            </el-date-picker>
                        </div>
                        <div class="header-list" v-for="item in dateList" @click="intoTimeSelect(item)">{{ item }}</div>
                    </div>
                    <div class="rserver-body">
                        <div v-for="(item,ind) in reserveDate" class="line-date">
                            <div class="body-room">{{ item.roomName }}</div>
                            <div class="body-list" v-for="(item2,ind2) in item.usedDates" :class="{'all-reserve-color': item2.isReserve,'not-all-reserve-color': !item2.isReserve,'already-reserve-color': item2.reserve}" @click="reserveDay(ind,ind2)"></div>
                        </div>
                    </div>
                </div>
                <!-- 以时间段选择 -->
                <div class="day-rserver" v-if="isFlag == 2" v-show="reserveDate.length > 0">
                    <div class="rserver-header">
                        <div class="header-date">
                            <el-date-picker
                                    v-model="searchData.copyStartDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    class="appoint-date"
                                    :clearable="false"
                                    :readonly="true"
                            >
                            </el-date-picker>
                        </div>
                        <div class="header-list" v-for="item in timeList">{{ item }}</div>
                    </div>
                    <div class="rserver-body">
                        <div v-for="(item,ind) in reserveDate" class="line-date">
                            <div class="body-room">{{ item.roomName }}</div>
                            <div class="body-list" v-for="(item3,ind3) in item.usedDates.find((item2,ind2) => item2.date == searchData.copyStartDate).usedTime"  :class="{'all-reserve-color': item3.isReserve,'not-all-reserve-color': !item3.isReserve,'already-reserve-color': item3.reserve}" @click="timeDay(ind,ind3)"></div>
                        </div>
                    </div>
                </div>
                <div v-if="reserveDate.length === 0">
                    <p style="color: #f00;text-align: center">无教室可预约</p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="copyReserveIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="reserveSubmit" class="el-btn-min-100 no-repeat-click2" :disabled="(reserveDate.length === 0) ? true : false" size="small">预约</el-button>
                <el-button type="primary" @click="cancelSubmit" class="el-btn-min-100 no-repeat-click3" size="small">取消预约</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { axiosPost,getDictionariesAllData} from '@/assets/js/api'
    export default {
        name: "demo",
        props: {
            reserveIsShow: {
                type: Boolean,
                required: true
            },
            copyUsedId:{
                default: -1
            }
        },
        data() { // 存储数据
            return {
                copyReserveIsShow: this.reserveIsShow, // 复制 预约弹窗是否显示
                dictionariesAllData: {}, // 基本类型字典项数据
                tipsData: [ // 提示如何选择
                    {
                        tipsText: '可预约某天或某个时间段',
                        tipsClass: 'all-reserve'
                    },
                    {
                        tipsText: '不可预约某天或某个时间段',
                        tipsClass: 'not-all-reserve'
                    },
                    {
                        tipsText: '已经预约',
                        tipsClass: 'already-reserve'
                    }
                ],
                searchData:{
                    copyStartDate: this.dateFormat(new Date()), // 当前日期
                    area: '', // 区域
                    roomType: '', // 教室类型
                    startDate: this.dateFormat(new Date()), // 当前日期
                },
                duration: 30, // 可预约多少天以后的数据
                dateList: [], // 可预约那些天的数据
                timeList: this.getTimeList(), // 可预约那些时间段的数据
                reserveDate: [], // 数据
                usedId: this.copyUsedId, // usedId 是否有使用Id
                timeInit: [],
                isFlag: 1, // 1 以天选择  2 以时间段选择
            }
        },
        created() {
            // isReserve 可否预定
            // reserve 是否已预定
            this.usedId = this.usedId == -1 ? Math.floor(Math.random()*100000) : this.usedId;
            getDictionariesAllData().then(res => { // 基本类型字典项数据
                this.dictionariesAllData = res;
            });
            this.getDateList(this.duration); // 可预约那些天的数据
            this.getReserveData();
        },
        methods: {
            searchList(){
                this.isFlag = 1;
                this.getReserveData();
            },
            dateFormat(date){ // 日期格式化
                return date.toLocaleDateString().replace(/\//g,'-');
            },
            getDateList(howDay){ // 可预约那些天的数据
                let dateList = [];
                let startDate = new Date(this.searchData.startDate);
                let endDate = new Date(this.searchData.startDate);
                endDate.setDate(startDate.getDate() + howDay-1);
                while((endDate.getTime() - startDate.getTime()) >= 0) {
                    let month = (startDate.getMonth() + 1).toString().length === 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
                    let day = startDate.getDate().toString().length === 1 ? "0" + startDate.getDate() : startDate.getDate();
                    dateList.push(month + "-" + day);
                    startDate.setDate(startDate.getDate() + 1);
                }
                this.dateList = dateList;
            },
            getTimeList(){
                return [
                    '00:00-00:30','00:30-01:00','01:00-01:30','01:30-02:00','02:00-02:30','02:30-03:00','03:00-03:30','03:30-04:00',
                    '04:00-04:30','04:30-05:00','05:00-05:30','05:30-06:00','06:00-06:30','06:30-07:00','07:00-07:30','07:30-08:00',
                    '08:00-08:30','08:30-09:00','09:00-09:30','09:30-10:00','10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00',
                    '12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00',
                    '16:00-16:30','16:30-17:00','17:00-17:30','17:30-18:00','18:00-18:30','18:30-19:00','19:00-19:30','19:30-20:00',
                    '20:00-20:30','20:30-21:00','21:00-21:30','21:30-22:00','22:00-22:30','22:30-23:00','23:00-23:30','23:30-24:00'
                ]
            },
            getReserveData(){ // 获取预约数据
                axiosPost('/resourceMgr/room/getRoomUsed', {
                    roomType: this.searchData.roomType,
                    area: this.searchData.area,
                    startDate: this.searchData.startDate,
                    duration: this.duration,
                    usedId: this.usedId,
                    noRepeat: '.no-repeat-click',
                    loading: '.table-loading'
                }).then(res => {
                    let reserveDate = res.data.roomList;
                    reserveDate.forEach((item,ind) => {
                        item.usedDates.forEach((item2,ind2) => {
                            /* 格式化后端传来的数据 时间段start */
                            let initData = this.getTimeInit(); // 获取时间段的默认空数据
                            let usedDataInd = []; // 存储下标
                            item2.usedTime.forEach((item) => { // 遍历数据，获取下标
                                usedDataInd.push(this.setUsedId(item));
                            });
                            usedDataInd.forEach((item) => { // 给下标对应的时间段数据覆盖数据
                                for(let i=item.startInd;i<=item.endInd;i++){
                                    initData[i].usedId = item.usedId;
                                }
                            });
                            initData.forEach((item,ind) => { // 时间段设置各个状态
                                if(item.usedId === ''){ // 可预订
                                    initData[ind].isReserve = true;
                                }else if(item.usedId !=='' && item.usedId != this.usedId){ // 不可预定
                                    initData[ind].isReserve = false;
                                }else if(item.usedId !=='' && item.usedId == this.usedId){ // 已经预定
                                    initData[ind].reserve = true;
                                }
                            });
                            let timeUsedIdArr = initData.map(item => { // 获取所有udedId
                                return item.usedId;
                            });
                            let arrRepeatRemove = this.arrFunique(timeUsedIdArr);
                            reserveDate[ind].usedDates[ind2].usedTime = initData;
                            /* 格式化后端传来的数据 end */
                            /* 格式化后端传来的数据 日期段 start */
                            if((this.isAllEqual(timeUsedIdArr) && timeUsedIdArr[0] == '') || (arrRepeatRemove.length === 2 && arrRepeatRemove.includes(this.usedId) && arrRepeatRemove.includes(''))){ // 全天可预订
                                reserveDate[ind].usedDates[ind2].isReserve = true;
                                reserveDate[ind].usedDates[ind2].reserve = false;
                            }else if(!this.isAllEqual(timeUsedIdArr)){ // 全天不可预定
                                reserveDate[ind].usedDates[ind2].isReserve = false;
                                reserveDate[ind].usedDates[ind2].reserve = false;
                            }else if(this.isAllEqual(timeUsedIdArr) && timeUsedIdArr[0] == this.usedId){ // 一天都是自己预定
                                reserveDate[ind].usedDates[ind2].isReserve = true;
                                reserveDate[ind].usedDates[ind2].reserve = true;
                            }
                            /* 格式化后端传来的数据 日期段 end */
                        })
                    });
                    this.reserveDate = reserveDate;
                });
            },
            getTimeInit(){ // 时间初始化   isReserve 可否预定 reserve 是否已预定
                let initDate = [],
                    nowData = new Date('2019-08-14 00:00:00'),
                    nowDataTime = nowData.getTime();
                for(let i=0;i<48;i++){
                    let nowData1 = new Date(nowDataTime + 60*1000*30*i);
                    let nowData2 = new Date(nowDataTime + 60*1000*30*(i+1));
                    initDate.push({
                        usedEndTime: this.timeFormat(nowData1.getHours())+':'+this.timeFormat(nowData1.getMinutes())+':'+this.timeFormat(nowData1.getSeconds()),
                        usedId: '',
                        usedStartTime: this.timeFormat(nowData2.getHours())+':'+this.timeFormat(nowData2.getMinutes())+':'+this.timeFormat(nowData2.getSeconds()),
                        isReserve: true,
                        reserve: false
                    })
                }
                return initDate;
            },
            timeFormat(now){ // 时间格式化
                if(now <10){
                    return '0'+now;
                }else{
                    return now;
                }
            },
            setUsedId(pointData){
                let startInd = (new Date('2019-08-14 '+ pointData.usedStartTime).getTime() - new Date('2019-08-14 00:00:00').getTime())/(60*1000*30);
                let endInd = (new Date('2019-08-14 '+ pointData.usedEndTime).getTime() - new Date('2019-08-14 00:00:00').getTime())/(60*1000*30) - 1;
                return {
                    startInd: startInd,
                    endInd: endInd,
                    usedId: pointData.usedId,
                };
            },
            isAllEqual(arr){ // 判断数组中元素是否都一致
                return !arr.some(function(item){
                    return item != arr[0];
                });
            },
            intoTimeSelect(date){ // 进入时间选择
                this.searchData.copyStartDate = this.searchData.startDate.split('-')[0]+'-' + date;
                this.isFlag = 2;
            },
            reserveDay(ind,ind2){ // 按天预约
                if(this.reserveDate[ind].usedDates[ind2].isReserve){ // 可以全天预约
                    this.reserveDate[ind].usedDates[ind2].reserve = !this.reserveDate[ind].usedDates[ind2].reserve;
                    if(this.reserveDate[ind].usedDates[ind2].reserve){
                        this.reserveDate[ind].usedDates[ind2].usedTime.forEach((item,ind3) => {
                            this.reserveDate[ind].usedDates[ind2].usedTime[ind3].reserve = true;
                        })
                    }else{
                        this.reserveDate[ind].usedDates[ind2].usedTime.forEach((item,ind3) => {
                            this.reserveDate[ind].usedDates[ind2].usedTime[ind3].reserve = false;
                        })
                    }
                    this.reserveDate = this.reserveDate.splice(0);
                }
            },
            timeDay(ind,ind3){ // 按时间预约
                this.reserveDate[ind].usedDates.forEach((item2,ind2) => {
                    if(item2.date == this.searchData.copyStartDate){
                        this.reserveDate[ind].usedDates[ind2].usedTime[ind3].reserve = !this.reserveDate[ind].usedDates[ind2].usedTime[ind3].reserve;
                        let isAllStatus = !this.reserveDate[ind].usedDates[ind2].usedTime.some(item4 => {
                            return item4.reserve != this.reserveDate[ind].usedDates[ind2].usedTime[0].reserve;
                        });
                        if(isAllStatus && this.reserveDate[ind].usedDates[ind2].usedTime[ind3].reserve){ // 状态都一样 并且都选中
                            this.reserveDate[ind].usedDates[ind2].reserve = true;
                        }else{
                            this.reserveDate[ind].usedDates[ind2].reserve = false;
                        }
                    }
                });
                this.reserveDate = this.reserveDate.splice(0);
            },
            reserveSubmit(){ // 预定
                let reserveDate = this.reserveDate;
                let sendDate = { // 发送的数据
                    usedId: this.usedId,
                    usedList: []
                };
                reserveDate.forEach((item,ind) => {
                    item.usedDates.forEach((item2,ind2) => {
                        let arrInd = [];
                        item2.usedTime.forEach((item3,ind3) => {
                            if(item3.reserve){ // 获取已选择的数据
                                arrInd.push(ind3);
                            }
                        });
                        if(arrInd.length > 0){
                            let TwoArr = this.formatIndDate(arrInd);
                            TwoArr.forEach((item4) => {
                                sendDate.usedList.push({
                                    roomId: item.roomId,
                                    usedDate: item2.date,
                                    usedStartTime: this.timeList[item4[0]].split('-')[0],
                                    usedEndTime: this.timeList[item4[item4.length-1]].split('-')[1],
                                })
                            })
                        }
                    })
                });
                if(sendDate.usedList.length === 0){
                    this.$message({ message: '请选择时间段!', type: 'warning'});
                    return false;
                }
                axiosPost('/resourceMgr/room/createRoomUsed',
                    Object.assign({noRepeat: '.no-repeat-click2'},sendDate)

                )
                    .then(() => {
                        let usedId = sendDate.usedId;
                        this.$message({ message: '预约成功', type: 'success'});
                        console.log(sendDate);
                        this.$emit('getAppointData', usedId);//传播预约数据
                        this.closeRemodal();
                    });
            },
            formatIndDate(arrInd){
                let result = [],
                    i = 0;
                result[i] = [arrInd[0]];
                arrInd.reduce(function(prev, cur){
                    cur-prev === 1 ? result[i].push(cur) : result[++i] = [cur];
                    return cur;
                });
                return result;
            },
            closeRemodal(){ // 弹窗关闭
                this.$emit('listenEventClose',this.reserveIsShow);
            },
            dateChange(){ // 更改日期
                this.isFlag = 1;
                this.getReserveData();
                this.getDateList(this.duration);
            },
            arrFunique(arr){ // 去重
                return  [...new Set(arr)];
            },
            cancelSubmit(){ // 取消预约
                if(this.copyUsedId === -1){
                    this.$emit('getAppointData',-1);//传播预约数据
                    this.closeRemodal();
                }else{
                    axiosPost('/resourceMgr/room/deleteRoomUsed',{
                        usedId: this.usedId,
                        noRepeat: '.no-repeat-click3'
                    }).then(() => {
                        this.$emit('getAppointData', -1);//传播预约数据
                        this.closeRemodal();
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .tips-select li{
        font-size: 14px;
        margin-left: 35px;
    }
    .tips-select li span:first-child{
        width: 40px;
        height: 26px;
    }
    .tips-select li span:last-child{
        line-height: 26px;
        margin-left: 20px;
    }
    .tips-select{
        margin-bottom: 20px;
    }
    .all-reserve{
        border: 1px solid #ccc;
        background: #fff;
    }
    .not-all-reserve{
        background: #409eff;
    }
    .already-reserve{
        background: #67c23a;
    }
    .demo >>> .dialog-reserve{
        min-width: 1200px;
    }
    .day-rserver{
        width: 100%;
        max-height: 500px;
        overflow: auto;
        border-right: 1px solid #b1b1b152;
    }
    .rserver-header{
        white-space: nowrap;
    }
    .header-date >>> .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 150px;
    }
    .header-date{
        width: 160px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #b1b1b152;
        text-align: center;
        display: inline-block;
    }
    .header-list{
        width: 90px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        border: 1px solid #b1b1b152;
        border-left: none;
        display: inline-block;
        cursor: pointer;
    }
    .header-list:last-child{
        border-right: none;
    }
    .line-date{
        white-space: nowrap;
    }
    .body-room{
        width: 160px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #b1b1b152;
        border-top: none;
        text-align: center;
        display: inline-block;
        vertical-align: top;
    }
    .body-list{
        width: 90px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        border: 1px solid #b1b1b152;
        border-top: none;
        border-left: none;
        display: inline-block;
        vertical-align: top;
    }
    .body-list:last-child{
        border-right: none;
    }
    .all-reserve-color{ /* 白背景 */
        background: #fff;
    }
    .not-all-reserve-color{ /* 蓝背景 */
        background: #409eff;
        cursor: no-drop;
    }
    .already-reserve-color{ /* 绿背景 */
        background: #67c23a!important;
    }
</style>