<template>
    <el-dialog title="预约教室" :visible.sync="dialogVisibleCope" width="90%" center :modal-append-to-body='false' @close="closeRemodal"
               class="login-dialog" :key="refDialog">
        <el-form :model="formData" ref="ruleForm" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="所属区域" prop="area">
                        <el-select v-model="formData.area" placeholder="请选择">
                            <el-option
                                    v-for="item in cAreaOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="教室类型" prop="roomType">
                        <el-select v-model="formData.roomType" placeholder="请选择">
                            <el-option
                                    v-for="item in cTypeOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="searchFunc" v-show="showLevel">查询</el-button>
                    <el-button type="primary" @click="appointClick">预约</el-button>
                    <el-button type="plaint" v-show="!showLevel" @click="showLevel=!showLevel">返回</el-button>
                </el-col>
            </el-row>
        </el-form>
        <!--日期表格-->
        <div v-show="showLevel" class="loading-table2">
            <div class="present-box">
                <div class="present-color color-blue"></div>
                <span class="present-title">部分已选</span>
                <div class="present-color color-green"></div>
                <span class="present-title">全天可选</span>
            </div>
            <el-table :key="dateTable" :data="tableData.columnData" height="250" border style="width: 100%"
                      @cell-click="dateHandle">
                <el-table-column prop="roomName" width="160px" align="center">
                    <template slot="header" slot-scope="slot">
                        <el-date-picker
                                v-model="dateValue"
                                type="date"
                                placeholder="选择日期"
                                class="appoint-date"
                        >
                        </el-date-picker>
                    </template>
                    <template slot-scope="scope">
                        <span>{{ scope.row.roomName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="roomId" width="160px" align="center" label="roomId" v-if=false>
                </el-table-column>
                <el-table-column v-for="(item,index) in tableData.header" :key="index" :prop="item.value"
                                 :label="item.label" width="60" align="center" show-overflow-tooltip>
                    <template slot="header" slot-scope="slot">
                        <div @click="dateHeaderClick(item.value)" class="date-header">{{item.label}}</div>
                    </template>
                    <template slot-scope="scope">
                        <el-button v-if="scope.row[item.value]==false">
                        </el-button>
                        <el-button type="primary" disabled v-if="scope.row[item.value]==true">
                        </el-button>
                        <el-button type="success" v-if="scope.row[item.value]=='plus'">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--时间表格-->
        <div v-show="!showLevel">
            <div class="present-box">
                <el-row>
                    <el-col :span="16">
                        <div class="present-color color-blue"></div>
                        <span class="present-title">不可选</span>
                        <div class="present-color color-green"></div>
                        <span class="present-title">已选</span>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="timeTableData.columnData" height="250" border style="width: 100%;"
                      @cell-click="timeHandle" :key="timeTableKey">
                <el-table-column prop="room" width="160px" align="center">
                    <template slot="header" slot-scope="slot">
                        <el-date-picker
                                v-model="timeDateValue"
                                type="date"
                                placeholder="选择日期"
                                class="appoint-date"
                                @change="timeChange"
                        >
                        </el-date-picker>
                    </template>
                    <template slot-scope="scope">
                        <span>{{ scope.row.roomName}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in timeTableData.header" :key="index" :prop="item.value"
                                 :label="item.label" width="90" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button v-if="scope.row[item.value]==false">

                        </el-button>
                        <el-button type="primary" disabled v-if="scope.row[item.value]==true">

                        </el-button>
                        <el-button type="success" v-if="scope.row[item.value]=='plus'">

                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    import moment from "moment"
    import {durationHeader} from "@/assets/js/duration"//时间级别表格表头
    import {axiosPost, getDictionariesAllData} from '@/assets/js/api';
    import {API} from '@/assets/js/urls';

    /**
     * 传播预约教室数据
     * this.$emit('getAppointData', param)
     * @param { roomType: '', area: '',  usedId: '', usedList:[] }
     */
    export default {
        name: "ClassRoomAppointAdd",
        props: ['usedIdCopy','dialogVisible'],
        data() {
            return {
                refDialog:1,//刷新dialog
                dateTable: 1,//绑定key，解决不刷新问题
                showLevel: true,
                formData: {//form条件
                    area: '',
                    roomType: '',
                },
                cAreaOptions: [],//所属区域
                cTypeOptions: [],//教室类型
                dateValue: new Date(),
                tableData: {//日期级别表格数据
                    header: [],
                    columnData: []
                },


                //    下面是time级别数据
                timeTableKey: 1,//触发表格视图更新
                timeTableData: {//时间级别表格数据
                    columnData: [],
                    header: durationHeader
                },
                timeDateValue: '',//时间表格选择日期

                //以下是假数据
                outerParam: [ // 出参
                    {
                        roomId: '1040d4bc',
                        roomName: '教室一',
                        usedDates: [
                            {
                                date: '2019-07-02',
                                used: true,  // 1、false 全天未选择 =>用户可以点击选择全天 2、true全天部分选择 => 用户不可选择全天
                                usedTime: [
                                    {
                                        usedStartTime: '00:00:00',
                                        usedEndTime: '01:00:00'
                                    },
                                    {
                                        usedStartTime: '02:00:00',
                                        usedEndTime: '03:00:00'
                                    }
                                ]
                            },
                            {
                                date: '2019-07-03',
                                used: true,  // 1、false 全天未选择 =>用户可以点击选择全天 2、true全天部分选择 => 用户不可选择全天
                                usedTime: [
                                    {
                                        usedStartTime: '00:00:00',
                                        usedEndTime: '01:00:00'
                                    },
                                    {
                                        usedStartTime: '02:00:00',
                                        usedEndTime: '03:00:00'
                                    }
                                ]
                            },

                            {
                                date: '2019-07-04',
                                used: true,
                                usedTime: [
                                    {
                                        usedStartTime: '02:00:00',
                                        usedEndTime: '24:00:00'
                                    }
                                ]
                            },
                            {
                                date: '2019-07-05',
                                used: true,
                                usedTime: [
                                    {
                                        usedStartTime: '00:00:00',
                                        usedEndTime: '01:00:00'
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        roomId: '2040d4bc',
                        roomName: '教室二',
                        usedDates: [
                            {
                                date: '2019-07-05',
                                used: true,  // 1、false 全天未选择 =>用户可以点击选择全天 2、true全天部分选择 => 用户不可选择全天
                                usedTime: [
                                    {
                                        usedStartTime: '00:00:00',
                                        usedEndTime: '01:00:00'
                                    },
                                    {
                                        usedStartTime: '02:00:00',
                                        usedEndTime: '03:00:00'
                                    }
                                ]
                            },
                            {
                                date: '2019-07-06',
                                used: true,
                                usedTime: [
                                    {
                                        usedStartTime: '02:00:00',
                                        usedEndTime: '08:00:00'
                                    },
                                    {
                                        usedStartTime: '10:00:00',
                                        usedEndTime: '12:00:00'
                                    }
                                ]
                            },
                            {
                                date: '2019-07-04',
                                used: false,
                                usedTime: []
                            }
                        ]
                    },
                    {
                        roomId: '3040d4bc',
                        roomName: '教室三',
                        usedDates: [
                            {
                                date: '2019-07-05',
                                used: true,  // 1、false 全天未选择 =>用户可以点击选择全天 2、true全天部分选择 => 用户不可选择全天
                                usedTime: [
                                    {
                                        usedStartTime: '00:00:00',
                                        usedEndTime: '01:00:00'
                                    },
                                    {
                                        usedStartTime: '02:00:00',
                                        usedEndTime: '03:00:00'
                                    }
                                ]
                            },
                            {
                                date: '2019-07-06',
                                used: false,
                                usedTime: []
                            },
                            {
                                date: '2019-07-04',
                                used: false,
                                usedTime: []
                            }
                        ]
                    }
                ],
                extrDateData: [],//日期表格新增的数据
                extrTimeData: [],//时间表格新增的数据
                dialogVisibleCope: this.dialogVisible,
                usedId: this.usedIdCopy
            }
        },
        watch: {
            dateValue() {
                this.getHeaderDays();
            },
            timeDateValue(value) {
            }
        },
        created() {
            this.loadPreData();// 字典预加载
            this.getHeaderDays();//获取表头
            this.usedId = this.usedId === -1 ? Math.floor(Math.random()*100000) : this.usedId;
            this.searchFunc();
        },
        methods: {
            // openDialog() {
            //     this.dialogVisibleCope = true;
            // },
            closeRemodal() {
                this.dialogVisibleCope = false;
                this.$emit('listenEventClose',this.dialogVisibleCope);
            },
            // 页面字典等数据预加载
            loadPreData() {
                getDictionariesAllData()
                    .then(res => {
                        this.cAreaOptions = res.area;
                        this.cTypeOptions = res.roomType;
                    });
            },
            //获取n天内的数组
            getNDays(num) {
                return ([...new Array(30)].map((i, idx) => moment(this.dateValue).startOf("day").subtract(-idx, "days").format("YYYY-MM-DD")));
            },
            //创建日期表头
            getHeaderDays() {
                this.tableData.header = [];
                this.getNDays().forEach(item => {
                    this.tableData.header.push({
                        label: item.substring(item.length - 5),
                        value: item
                    })
                })
            },
            //查询按钮
            searchFunc() {
                this.extrDateData = []
                this.extrTimeData = []
                this.getAllData();
            },
            //点击查询，获取所有数据
            getAllData() {
                axiosPost(API.APPOINT_INFO, {
                    roomType: this.formData.roomType,
                    area: this.formData.area,
                    startDate: moment(this.dateValue).format("YYYY-MM-DD"),
                    duration: 30,
                    usedId: this.usedId,
                    loading: '.loading-table2'
                }).then(res => {
                    if (res.code == "1000") {
                        this.getHeaderDays();
                        this.tableData.columnData = [];
                        this.outerParam = this.deepCopy(res.data)
                        res.data.forEach(item1 => {
                            var newobj = {};
                            item1.usedDates.forEach(item2 => {
                                newobj[item2.date] = item2.used;
                            })
                            newobj.roomId = item1.roomId;
                            newobj.roomName = item1.roomName;
                            this.tableData.columnData.push(newobj)
                        })
                    }
                })

                // this.getHeaderDays();
                // this.tableData.columnData = [];
                // this.outerParam.forEach(item1 => {
                //     var newobj = {};
                //     item1.usedDates.forEach(item2 => {
                //         newobj[item2.date] = item2.used;
                //     })
                //     newobj.roomId = item1.roomId;
                //     newobj.roomName = item1.roomName;
                //     this.tableData.columnData.push(newobj)
                // })
            },
            //单元格点击 （给新增的值即used赋值plus，方便知道是不是新增的数据），并把新增的数据放到extrDateData里面
            dateHandle(row, column) {
                if (row[column.property] == false || !row[column.property]) {
                    this.$set(row, column.property, 'plus')
                    this.extrDateData.push(
                        {
                            roomName: row.roomName,
                            roomId: row.roomId,
                            usedDate: column.property,
                        }
                    )
                    durationHeader.forEach(item => {
                        this.extrTimeData.push(
                            {
                                roomId: row.roomId,
                                roomName: row.roomName,
                                usedDate: column.property,
                                usedTime: item.value,
                            }
                        )
                    })
                } else if (row[column.property] == 'plus') {
                    this.$set(row, column.property, false);
                    this.extrDateData.forEach((item, index) => {
                        if (item.roomId == row.roomId && item.usedDate == column.property) {
                            this.extrDateData.splice(index, 1)
                        }
                    })
                }
            },
            //日期表格单机头部，取得这一天的数据
            dateHeaderClick(value) {
                this.timeDateValue = value;
                this.addAllDate(value);
            },
            //把全选的数据也加到格式化时间表格的数据里面
            addAllDate(value) {
                this.timeTableData.columnData = [];
                let arr = [];
                this.extrDateData.forEach(item => {
                    if (item.usedDate == value) {
                        arr.push(item);
                    }
                })
                arr.forEach(item1 => {
                    durationHeader.forEach(item2 => {
                        item1[item2.value] = "plus"
                    })
                })
                this.timeTableData.columnData = this.outerParamFormat(value, arr);
                this.showLevel = false;
            },
            //TODO 时间表格方法
            //点击时间变化
            timeChange(value) {

                this.addAllDate(moment(value).format("YYYY-MM-DD"));
            },
            //时间级别表格数据单元格点击
            timeHandle(row, column) {
                const selectTime = moment(this.timeDateValue).format("YYYY-MM-DD") + ' ' + column.label.substring(0, 5) + ':00'
                const nowTime = moment(new Date()).valueOf();
                if (new Date(selectTime).getTime() < nowTime) {
                    this.$message({
                        message: "选择时间应大于当前时间",
                        type: "warning"
                    })
                } else {
                    if (row[column.property] == false || !row[column.property]) {
                        this.$set(row, column.property, 'plus')
                        this.extrTimeData.push(
                            {
                                roomName: row.roomName,
                                roomId: row.roomId,
                                usedTime: column.property,
                                usedDate: this.timeDateValue,
                                usedId: this.usedId,
                            }
                        )
                    } else if (row[column.property] == 'plus') {
                        this.$set(row, column.property, false);
                        this.extrTimeData.forEach((item, index) => {
                            if (item.roomId == row.roomId && item.usedTime == column.property && item.usedDate == this.timeDateValue) {
                                this.extrTimeData.splice(index, 1)
                            }
                        })
                    }
                }
            },
            // 点击预约按钮
            appointClick() {
                var arr = this.deepCopy(this.extrTimeData);
                if (arr.length > 0) {
                    arr.forEach((item, index) => {
                        item.usedId = this.usedId;
                        if (!item.usedStartTime) {
                            item.usedStartTime = this.getStartTime(item.usedTime)
                            item.usedEndTime = this.getEndTime(item.usedTime)
                        }

                    })
                    this.contactFun(arr)
                    this.contactFun(arr.reverse())
                    const param = {
                        roomType: this.formData.roomType,
                        area: this.formData.area,
                        usedId: this.usedId,
                        usedList: arr
                    }

                    axiosPost(API.APPOINT_ADD, param).then(res => {
                        if (res.code == "1000") {
                            // this.getAllData();
                            this.$message({
                                message: '预约成功',
                                type: 'success'
                            })
                            // this.getAllData();
                            this.extrTimeData = [];
                            this.extrDateData = [];
                            this.$emit('getAppointData', param);//传播预约数据
                            this.dialogVisibleCope = false;
                        }
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择教室',
                    })
                }

            },
            //TODO 以下是封装的方法
            //格式化来的数据给表格（时间表格想要的数据,包括全选的数据）
            outerParamFormat(value, arr) {//1.日期 2.时间表格的数据
                //操作接口返回的数据
                var beforeArr = [];//临时数据
                this.outerParam.forEach((item1, index1) => {
                    beforeArr.push({roomId: item1.roomId, roomName: item1.roomName})
                    item1.usedDates.forEach((item2, index2) => {
                        if (item2.date == value) {
                            let keyArrs = [];//所有的key
                            item2.usedTime.forEach((item3, index3) => {
                                let keyArr = this.matchTime(item3.usedStartTime, item3.usedEndTime);
                                keyArrs.push(...keyArr)
                            })
                            beforeArr[index1].keys = keyArrs;
                        }
                    })
                })//加keys[]数组
                beforeArr.forEach((item1, index2) => {
                    if (item1.keys && item1.keys.length > 0) {
                        item1.keys.forEach((item2, index2) => {
                            item1[item2] = true;
                        })
                    }
                })

               // 操作日期表格选中的数据
                if (arr.length > 0) {
                    arr.forEach(item1 => {
                        beforeArr.forEach((item2, index2) => {
                            if (item1.roomId == item2.roomId) {
                                beforeArr.splice(index2, 1)
                            }
                        })
                    })
                }
                beforeArr.push(...arr)
                return beforeArr
            },
            //匹配时间表格value(return key的数组)
            matchTime(startTime, endTime) {
                const start = startTime.substring(0, 5);
                const end = endTime.substring(0, 5);

                let startIndex = '', endIndex = '';
                let arr = [];
                durationHeader.forEach((item, index) => {
                    if (item.label.substring(0, 5) == start) {
                        startIndex = index;
                    }
                    if (item.label.substring(item.label.length - 5) == end) {
                        endIndex = index;
                    }
                });

                durationHeader.forEach((item, index) => {
                    if (startIndex <= index && index <= endIndex) {
                        arr.push(item.value)
                    }
                });
                return arr;
            },
            //获取开始时间
            getStartTime(key) {
                var label;
                durationHeader.forEach(item => {
                    if (item.value == key) {
                        label = item.label.substring(0, 5);
                    }
                })
                return label;
            },
            //获取结束时间
            getEndTime(key) {
                var label;
                durationHeader.forEach(item => {
                    if (item.value == key) {
                        label = item.label.substring(item.label.length - 5);
                    }
                })
                return label;
            },
            //根据数据时间，进行数据连接
            contactFun(allTimes) {
                for (let i = 0; i < allTimes.length; i++) {
                    while (this.findNextTime(allTimes, i)) {
                    }
                }
            },
            findNextTime(allTimes, targetTimeIndex) {
                let targetTime = allTimes[targetTimeIndex]
                for (let i = targetTimeIndex; i < allTimes.length; i++) {
                    let time = allTimes[i]
                    if (time.roomId === targetTime.roomId && time.usedDate === targetTime.usedDate && targetTime.usedEndTime === time.usedStartTime) {
                        targetTime.usedEndTime = time.usedEndTime
                        allTimes.splice(i, 1)
                        return true
                    }
                }
                return false
            },
            //深拷贝数组对象
            deepCopy(o) {
                if (o instanceof Array) {
                    var n = [];
                    for (var i = 0; i < o.length; ++i) {
                        n[i] = this.deepCopy(o[i]);
                    }
                    return n;

                } else if (o instanceof Object) {
                    var n = {}
                    for (var i in o) {
                        n[i] = this.deepCopy(o[i]);
                    }
                    return n;
                } else {
                    return o;
                }
            }
        }
    }
</script>

<style scoped>
    .present-box {
        height: 26px;
        line-height: 26px;
        margin-bottom: 20px;
    }

    .present-color {
        display: inline-block;
        height: 26px;
        width: 40px;
        vertical-align: middle;
        margin-left: 50px;
    }

    .color-blue {
        background-color: #409eff;
    }

    .color-red {
        background-color: #f56c6c;
    }

    .color-green {
        background-color: #67c23a;
    }

    .present-title {
        margin-left: 20px
    }

    .el-table >>> th {
        cursor: pointer;
        padding: 0;
    }

    .el-table >>> th .cell > div {
        height: 40px;
        line-height: 40px;
    }

    .el-table >>> th .cell .appoint-date {
        margin-top: 2px;

    }

    .el-table >>> th .cell .appoint-date .el-input__inner {
        width: 134px;
    }

    .el-table >>> th .cell .appoint-date .el-input__icon {
        margin-left: 10px;
    }

    .el-table >>> th .cell {
        padding: 0;
        height: 44px;
        line-height: 44px;

    }

    .el-table >>> td {
        padding: 0 !important;
    }

    .el-table >>> td .cell {
        padding: 0 !important;
        height: 40px;
        line-height: 40px;
    }

    .el-table >>> td .cell .el-button {
        /*cursor: pointer;*/
        border: none;
    }

    .el-table >>> td .cell .bg-red {
        background-color: #f56c6c;
    }

    .el-table >>> td .cell .bg-blue {
        background-color: #409eff;
    }

    .el-table >>> td .cell .bg-white {
        background-color: white;
    }

    .el-table >>> td .cell .el-button {
        height: 100%;
        width: 100%;
        border-radius: 0;
    }

</style>