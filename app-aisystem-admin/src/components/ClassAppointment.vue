<template><!-- 教室选择 zhiyong.li -->
    <div class="teacher-appointment">
        <el-dialog title="教室选择" :visible.sync="selectConfigIsShowCopy" width="1200px" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeRemodal">
            <div class="dialog-container clearfix">
                <el-form :inline="true" :model="searchData" class="demo-form-inline" label-width="100px">
                    <el-form-item label="所属地区">
                        <el-select v-model="searchData.area" placeholder="请选择所属地区">
                            <el-option v-for="(item,ind) in dictionariesAllData['area_all']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="教师类型">
                       <el-select v-model="searchData.roomType" placeholder="请选择教师类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['roomType_all']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchSubmit">查询</el-button>
                    </el-form-item>
                     <el-form-item>
                        <el-button @click="resetFun">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table border :data="records" tooltip-effect="dark" style="margin-top: 20px;width: 100%" ref="roomTable" @current-change="handleSelectionChange" highlight-current-row>
                    <el-table-column
                            prop="roomId" align="center"
                            label="教室编号">
                    </el-table-column>
                    <el-table-column
                            prop="roomName"
                            label="教室名称">
                    </el-table-column>
                    <el-table-column label="教室状态">
                        <template slot-scope="scope">
                            {{dictionariesNameData[scope.row.status]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="所属区域">
                        <template slot-scope="scope">
                            {{dictionariesNameData[scope.row.area]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="location"
                            label="教室位置">
                    </el-table-column>
                    <el-table-column
                            prop="capacity"
                            label="教室容量">
                    </el-table-column>
                    <el-table-column
                            prop="equipments"
                            label="教室设备">
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20,50]"
                            :page-size="10"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo"
                    >
                    </el-pagination>
                </div>
                <div class="data-container">
                    <el-form :inline="true" class="demo-form-inline data" label-width="100px">
                        <el-form-item label="创建日期">
                            <el-date-picker
                                    v-model="createTime"
                                    @change = "timeChange"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            *  默认时间为早八点到晚十点
                        </el-form-item>
                    </el-form>
                </div>
                <div class="timer-select" v-if="timeSlot.length > 0">
                    <div class="timer-item" v-for="(item,ind) in used" :key="ind">
                        <p class="clearfix">{{item.date}}<span class="fr"><em></em>已占用</span></p>
                        <div class="drag clearfix" ref="dragBox" @mousedown="move($event,ind)">
                            <div class="small-drag" v-for="(item2,ind2) in timeSlot[ind].slot" :key="ind2" :class="{'time-selected': item2.flag,'disabled-selected': item2.used}" @click="dragClick(ind,ind2)"></div>
                            <div class="empty-box" :style="{'width': emptyBox[ind].width+'px','left': emptyBox[ind].left+'px'}"></div>
                        </div>
                        <div class="time-axis">

                        </div>
                        <div class="time-point clearfix">
                            <span v-for="(item,ind) in timePoint" :key="ind" class="fl">{{item}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectConfigIsShowCopy=false">取消</el-button>
                <el-button type="primary" @click="timeSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    // 参数1：selectConfigIsShow 必传 类型Boolean ====》弹窗是否打开
    // 参数2：selectRoom 非必传 类型Object  ====》选择后的时间段 或者 修改已预约的默认时间段
        // 示例：
        /*
            selectRoom = {
                roomId : '12345',
                data: [
                    {
                        date: '2019-05-31',
                        selectTime: [
                            startTime: '08:00:00',
                            endTime: '09:00:00'
                        ]
                    }
                ]
            }
        */
    // 参数3：defaultTimeSlot 非必传 类型Array   ====》默认开始时间和结束时间
        // 示例：
        // defaultTimeSlot = ['2019-03-23','2019-04-02']
    // 参数4：planId 非必传 类型String ====》 计划id 用于修改培训计划课程
        // planId = ''
import {axiosPost,getDictionariesAllData,getDictionariesNameData} from '@/assets/js/api'
export default {
    name: 'TeacherAppointment',
    props: {
        selectConfigIsShow: {
            type: Boolean,
            required: true
        },
        selectRoom: Object,
        defaultTimeSlot: Array,
        planId: String
    },
    data(){
        return {
            selectConfigIsShowCopy: this.selectConfigIsShow, // 复制props 里面的数据
            searchData:{
                area:'',
                roomType: ''
            },
            dictionariesAllData: [], // 获取基本类型字典项数据
            dictionariesNameData: [], // 获取基本类型字典项数据的某个值
            records: [], // 数据
            recordsTotal: 0, // 数据条数
            multipleSelection: {}, // 选择后的数据
            pageNo: 1, // 第几页
            pageSize: 10, // 每页几条
            createTime: ['',''], // 日期
            startTime: '',
            endTime: '',
            used: [], // 选过的日期
            timeSlot:[], // 选过的时间段
            timePoint:['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'],
            timePointCopy:['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'],
            emptyBox:[], // 鼠标拖动的效果盒子
            isFirst: true, // 是否是第一次进入
        }
    },
    created(){
        this.getList(); // 获取教室列表
        getDictionariesAllData().then(res => {
            this.dictionariesAllData = res;
        });
        getDictionariesNameData().then(res => {
            this.dictionariesNameData = res;
        });
        if(this.defaultTimeSlot !== undefined && this.defaultTimeSlot.length > 0){ //  默认开始时间和结束时间
            this.createTime[0] = this.defaultTimeSlot[0];
            this.createTime[1] = this.defaultTimeSlot[1];
        }
        if(this.selectRoom !== undefined && this.selectRoom.roomId !== ''){ // 默认教室id
            this.multipleSelection = {
                roomId: this.selectRoom.roomId
            };
        }
        if(this.selectRoom !== undefined && this.selectRoom.data.length > 0){ // 默认数据
            let arr = [];
            this.selectRoom.data.forEach(item => {
                arr.push(item.date);
            });
            this.timeOccupied(arr);
        }
    },
    methods:{
        getList(){ // 获取列表
            axiosPost('/resourceMgr/room/list',{
                area: this.searchData.area,
                roomType: this.searchData.roomType,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            })
            .then(res => {
                this.records = res.data.records;
                this.recordsTotal = res.data.total;
            })
        },
        async timeOccupied(usedDates){ // 时间已占用
            await axiosPost('/resourceMgr/room/getRoomUsed',{
                roomId: this.multipleSelection.roomId,
                startDate: this.createTime[0],
                endDate:this.createTime[1],
                queryType: 'without',
                usedDates: usedDates,
                usedId: this.planId // 计划id
            })
                .then(res => {
                    this.used = res.data;
                });
            let timeSlot = [];
            this.used.forEach((item,ind) => {
                this.emptyBox[ind] = {width: 0,left: 0};
                timeSlot[ind] = {};
                timeSlot[ind].slot = [];
                for(let j=0;j<28;j++){ // 默认全部是未选中
                    timeSlot[ind].slot[j] = {};
                    timeSlot[ind].slot[j].flag = false;
                    timeSlot[ind].slot[j].used = false;
                }
                if(item.usedTime !== null){
                    item.usedTime.forEach((item2) => {
                        let startTimeInd = this.getTimeInd(item.date.replace(/-/g,'/'),item.date.replace(/-/g,'/') +  ' ' + item2.startTime);
                        let endTimeInd = this.getTimeInd(item.date.replace(/-/g,'/'),item.date.replace(/-/g,'/') +  ' ' + item2.endTime);
                        for(let i=startTimeInd;i<endTimeInd;i++){ // 回显已经选过的
                            timeSlot[ind].slot[i].used = true;
                        }
                    });
                }
                if(this.selectRoom !== undefined && this.selectRoom.data.length > 0 && this.isFirst){ // 默认数据
                    this.selectRoom.data.forEach((item3) => {
                        item3.selectTime.forEach((item4) => {
                            let startTimeInd = this.getTimeInd(item3.date.replace(/-/g,'/'),item3.date.replace(/-/g,'/') +  ' ' + item4.startTime);
                            let endTimeInd = this.getTimeInd(item3.date.replace(/-/g,'/'),item3.date.replace(/-/g,'/') +  ' ' + item4.endTime);
                            for(let k=startTimeInd;k<endTimeInd;k++){ // 回显已经选过的
                                if(item.date == item3.date){
                                    timeSlot[ind].slot[k].flag = true;
                                }
                            }
                        });
                    });
                }
            });
            this.timeSlot = timeSlot;
            this.isFirst = false;
        },
        getTimeInd(dateArg,timeArg){ // 获取下标
            let timeDifference = new Date(timeArg).getTime() - new Date(dateArg +  ' ' + '08:00:00').getTime();
            return Number.parseInt(timeDifference/1000/60/30);
        },
        closeRemodal(){ // 弹窗关闭
            this.$emit('listenEventClose',this.selectConfigIsShowCopy);
        },
        searchSubmit(){ // 查询
            this.getList();
        },
        resetFun(){ // 重置
            this.searchData = {};
        },
        handleSelectionChange(res){ // 表格选择更改
            this.multipleSelection = res;
            this.timeSlot = []; // 清空选过的数据
            this.timeOccupied();
        },
        timeChange(){ // 时间更改
            this.timeSlot = []; // 清空选过的数据
            this.createTime == null ? this.createTime = ['',''] : this.createTime;
            this.timeOccupied();
        },
        handleSizeChange(res){ // 更改条数
                this.pageNo = 1;
                this.pageSize = res;
                this.getList();
        },
        handleCurrentChange(res){ // 更改页数
            this.pageNo = res;
            this.getList();
        },
        move(event,ind){ // 移动
            let boxClientX = Number.parseInt(this.$refs.dragBox[ind].getBoundingClientRect().left), // 父元素距离左侧的距离
                clickX = event.clientX - boxClientX,  // 当前按下鼠标的离左侧的距离 - 父元素距离左侧的距离 = 距离父元素左侧的距离
                startInd = -999,
                endInd = -999;
            document.onmousemove = (e => {
                let currentX = e.clientX - boxClientX; // 当前移动鼠标的位置距离左侧的距离 - 父元素距离左侧的距离 = 当前移动的位置距离父元素左侧的距离
                if(currentX >= 1050){ // 拖到最右边后停止滑动
                    currentX = 1050;
                }else if(currentX <= 0){ // 拖到最左边后停止滑动
                    currentX = 0;
                }
                if(currentX - clickX >= 0){ // 向右滑动
                    this.$set(this.emptyBox,ind,{width: currentX - clickX,left: clickX});
                }else{ // 向左滑动
                    this.$set(this.emptyBox,ind,{width: clickX - currentX,left: currentX});
                }
                startInd = parseInt(this.emptyBox[ind].left/37.5);
                endInd = parseInt((this.emptyBox[ind].left + this.emptyBox[ind].width)/37.5);

            });
            document.onmouseup = (() => {
                this.timeSlot[ind].slot.forEach((item,ind2) => {
                   if(ind2 >= startInd && ind2 <= endInd && !item.used){
                       item.flag == true ? item.flag = false : item.flag = true;
                   }
                });
                this.emptyBox[ind].width = 0;
                this.emptyBox[ind].left = 0;
                document.onmousemove = null;
                document.onmouseup= null;
            });
        },
        dragClick(ind,ind2){ // 点击
            if(this.timeSlot[ind].slot[ind2].used !== true){
                this.$set(this.timeSlot[ind].slot,ind2,{slot: false,flag: !this.timeSlot[ind].slot[ind2].flag});
            }
        },
        formatArr(arr){ // 格式化
            let result = [];
            arr.forEach((item,ind) => {
                let temp = result[result.length-1];
                if(ind === 0){
                    result.push([item]);
                }else if(item - 1 == temp[temp.length-1]){
                    temp.push(item);
                }else{
                    result.push([item]);
                }
            });
            return result.map(item => {
                if(item.length == 1){
                    return item[0];
                }else{
                    return item[0] + '-' + item[item.length - 1];
                }
            });
        },
        timeSubmit(){ // 时间选择完成
            let selectTimeSlot = [];
            this.timeSlot.forEach((item,ind) => {
                selectTimeSlot[ind] = {};
                selectTimeSlot[ind].date = this.used[ind].date;
                selectTimeSlot[ind].selectTime = [];
                let selectInd = [];
                for(let i in item.slot){ // 获取选择后的下标
                    if(item.slot[i].flag == true){
                        selectInd.push(i);
                    }
                }
                let startInd_endInd = this.formatArr(selectInd); // 格式化结果为 [开始下标,结束下标]
                startInd_endInd.forEach((item2,ind2) => {
                    selectTimeSlot[ind].selectTime[ind2] = {};
                    let startInd_endInd_Arr = item2.split('-');
                    if(startInd_endInd_Arr.length === 1){
                        selectTimeSlot[ind].selectTime[ind2].startTime = this.timePointCopy[startInd_endInd_Arr[0]];
                        selectTimeSlot[ind].selectTime[ind2].endTime = this.timePointCopy[Number.parseInt(startInd_endInd_Arr[0]) + 1];
                    }else{
                        selectTimeSlot[ind].selectTime[ind2].startTime = this.timePointCopy[startInd_endInd_Arr[0]];
                        selectTimeSlot[ind].selectTime[ind2].endTime = this.timePointCopy[Number.parseInt(startInd_endInd_Arr[1]) + 1];
                    }
                })
            });
            selectTimeSlot = selectTimeSlot.filter((item) => {
                return item.selectTime.length > 0;
            });
            if(selectTimeSlot.length === 0){
                this.$message({message:'请选择数据后再确定！',type: 'warning'});
            }else{
                let selectRoom = {roomId: this.multipleSelection.roomId,data:selectTimeSlot};
                this.$emit('listenEventData',selectRoom)
            }
        }
    }
}
</script>
<style scoped>
    .data-container{
        margin-top: 30px;
    }
    .timer-select{
        width: 100%;
        height: 384px;
        overflow-y: auto;
        overflow-x: hidden;
        border: 1px solid  #409EFF;
    }
    .timer-item{
        width: 98%;
        height: 160px;
        margin: 20px auto;
        background: #f5fafd;
    }
    .timer-item p{
        font-size: 20px;
        line-height: 60px;
        padding-left: 20px;
    }
    .timer-item p span{
        font-size: 14px;
        font-weight: normal;
        margin-right: 45px;
    }
    .timer-item p span em{
        width: 20px;
        height: 20px;
        display: inline-block;
        background: #e77e23;
        margin-right: 10px;
        vertical-align: middle;
    }
    .drag{
        height: 60px;
        width: 1050px;
        margin: 0 auto;
        position: relative;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        background: #f5fafd;
    }
    .small-drag{
        height: 100%;
        width: 37.5px;
        float: left;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
    .time-axis{
        background: #bcddee;
        height: 5px;
        width: 1050px;
        margin: 0 auto;
    }
    .time-point{
        width: 100%;
        margin: 10px 0 0 26px;
    }
    .time-point span{
        width: 75px;
        font-size: 14px;
    }
    .empty-box{
        position: absolute;
        background: #3299dc;
        height: 100%;
    }
    .time-selected{
        background: #3299dc;
    }
    .disabled-selected{
        background: #e77e23;
    }
    .timer-select::-webkit-scrollbar,.search-list::-webkit-scrollbar{width: 5px;height: 1px;}
    .timer-select::-webkit-scrollbar-thumb,.search-list::-webkit-scrollbar-thumb{border-radius: 10px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #d4d2d2cc;}
    .timer-select::-webkit-scrollbar-track,.search-list::-webkit-scrollbar-track{width: 10px;height: 1px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #fff;}




</style>


