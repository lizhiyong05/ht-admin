<template>
    <el-dialog title="预约教室" :visible.sync="dialogVisible" width="100%" center :modal-append-to-body='false'
               class="login-dialog">



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
                    <el-button type="primary" @click="getAllData" v-show="showDateLevel">查询</el-button>
                    <el-button type="primary" @click="appointClk">预约</el-button>
                    <el-button type="plaint" @click="goBack"  v-show="!showDateLevel">返回</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div v-show="showDateLevel">
            <div class="present-box">
                <div class="present-color color-blue"></div>
                <span class="present-title">部分可选</span>
            </div>
            <el-table :data="tableData.columnData" height="250" border style="width: 100%" @cell-click="handle">
                <el-table-column prop="room" width="160px" align="center">
                    <template slot="header" slot-scope="slot">
                        <el-date-picker
                                v-model="dateValue"
                                type="date"
                                placeholder="选择日期"
                                class="appoint-date">
                        </el-date-picker>
                    </template>
                    <template slot-scope="scope">
                        <span>{{ scope.row.room}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in tableData.header" :key="index" :prop="item.value"
                                 :label="item.label" width="60" align="center">
                    <template slot="header" slot-scope="slot">
                        <div @click="headerClick(item.value)">{{item.label}}</div>
                    </template>
                    <template slot-scope="scope">
                        <!--                    <div :class="{ 'bgRed': scope.row[item.value]=='8:00-24:00', 'bg-white':  !scope.row[item.value]}">-->
                        <div :class="classStatus(scope.row[item.value])" @click="selectClick(scope.row,scope.$index)"
                             @dblclick="selectDblclick(scope.row[item.value])">
                            {{ scope.row[item.value]}}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <div v-show="!showDateLevel">
            <div class="present-box">
                <el-row>
                    <el-col :span="16">
                        <div class="present-color color-red"></div>
                        <span class="present-title">不可选</span>
                        <div class="present-color color-green"></div>
                        <span class="present-title">已选</span>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="timeTableData.columnData" height="250" border style="width: 100%;"
                      @cell-click="timeHandle">
                <el-table-column prop="room" width="160px" align="center">
                    <template slot="header" slot-scope="slot">
                        <el-date-picker
                                v-model="timeDateValue"
                                type="date"
                                placeholder="选择日期"
                                class="appoint-date"
                        >
                        </el-date-picker>
                    </template>
                    <template slot-scope="scope">
                        <span>{{ scope.row.room}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in timeTableData.header" :key="index" :prop="item.value"
                                 :label="item.label" width="90" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button @click="aassd(scope)" style="background-color:#f56c6c;"
                                   v-if="isPlus(scope.row[item.value])=='init'"
                                   :disabled="isPlus(scope.row[item.value])=='init'"
                        >
                            {{ scope.row[item.value]}}
                        </el-button>
                        <el-button @click="aassd(scope)" style="background-color:#67c23a;"
                                   v-if="isPlus(scope.row[item.value])=='plus'">
                            {{ scope.row[item.value]}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    import moment from "moment"
    import {durationHeader} from "@/assets/js/duration"
    import {axiosPost, getDictionariesAllData} from '@/assets/js/api';
    import {API} from '@/assets/js/urls';

    export default {
        name: "ClassRoomAppointAdd",
        data() {
            return {
                dialogVisible: false,
                showDateLevel: true,

                usedId: 1,//租用教室id
                formData: {
                    area: '',
                    roomType: '',
                },
                cAreaOptions: [],
                cTypeOptions: [],
                //白色：可以全选
                //红色：全被选择
                //蓝色：部分可选
                classStatus(value) {
                    if (value) {
                        if (value[0] == '8:00-24:00') {
                            return {'bg-red': true}
                        } else if (value[0] == '') {
                            return {'bg-white': true}
                        } else {
                            return {"bg-blue": true}
                        }
                    }
                },
                tiemClassStatus(value) {
                    if (value) {
                        return {"bg-blue": true}
                    }
                },
                dateValue: new Date(),
                searchKeys: '',
                room: [],
                today: '',
                tableData: {
                    header: [],
                    columnData: []
                },
                forDateData: [//初始化数据

                ],

                //    下面是time级别数据
                timeTableData: {
                    columnData: [],
                    header: durationHeader
                },
                timeDateValue: '',
                daysInfo: {},//一天的数据  进入时间选择的整体数据
                extraData: [],//最终需要提交的数据
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
            // 字典预加载
            this.loadPreData();
            //表头数据获取
            this.getHeaderDays();
        },
        methods: {
            openDialog() {
                this.dialogVisible = true;
            },
            goBack() {
                this.showDateLevel = true;
            },
            loadPreData() {
                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {
                        this.cAreaOptions = res.area;
                        this.cTypeOptions = res.roomType;
                    });
            },
            getAllData() {
                axiosPost(API.APPOINT_INFO, {
                    roomType: this.formData.roomType,
                    area: this.formData.area,
                    startDate: this.dateValue,
                    duration: 30,
                    usedId: 1,
                }).then(res => {
                    if (res.code == "1000") {
                        this.room = res.data.roomList;
                        this.getRoom();
                        this.forDateData = res.data.usedDates;
                        this.formatData(res.data.usedDates);
                    }
                })
            },
            aassd(value) {
                console.log(value)
            },
            //获取n天内的数组
            getNDays(num) {
                return ([...new Array(30)].map((i, idx) => moment(this.dateValue).startOf("day").subtract(-idx, "days").format("MM-DD")));
            },
            //创建日期表头
            getHeaderDays() {
                this.tableData.header = [];
                for (var i = 0; i <= this.getNDays().length; i++) {
                    this.tableData.header.push({label: this.getNDays()[i], value: "date" + this.getNDays()[i]})
                }
            },
            //获取教室
            getRoom() {
                this.tableData.columnData = [];
                for (var i = 0; i < this.room.length; i++) {
                    this.tableData.columnData.push({room: this.room[i].roomName, roomId: this.room[i].roomId});
                }
            },
            headerClick(value) {
                this.timeDateValue = moment().format("YYYY") + '-' + value.slice(4);
                this.timeDateChange(this.timeDateValue);
                this.showDateLevel = false;

            },
            //数据格式化(初始化天级别表格)
            formatData(data) {
                let newarr = [];
                data.forEach(item => {
                    newarr.push(...item.usedDatas);
                })
                newarr.forEach((item1, index) => {
                    this.tableData.columnData.forEach((item2, index1) => {
                        if (item1.roomId == item2.roomId) {
                            item2['date' + moment(item1.usedDate).format('MM-DD')] = item1.usedStartTime + '-' + item1.usedEndTime
                        }
                    })
                })
            },

            //TODO 下用到
            // {date: "2019-06-28", key: "down8", room: "教室2"}
            appointClk() {
                let appointData = [], curData = [];
                curData = this.extraData;
                this.extraData.forEach(item => {
                    appointData.push({
                        date: item.date,
                        date: item.date,
                        date: item.date,
                    })
                })
            },
            selectClick(value, index) {

            },
            handle(row, column, event, cell) {
                // console.log(row)
                // console.log(column)
                // console.log(event)
                // console.log(cell)
                this.daysInfo.date = column.property
                this.daysInfo.time = row[column.property]
                this.daysInfo.room = row.room;
                this.timeDateValue = moment().format("YYYY-MM") + '-' + this.daysInfo.date.slice(4);

            },
            selectDblclick(value) {
            },
            //TODO 上面中间的没用到


            //获取时间教室
            getTimeRoom() {
                this.timeTableData.columnData.splice(0, this.timeTableData.columnData.length);

                this.room.forEach(item => {
                    this.timeTableData.columnData.push({room: item.roomName, roomId: item.roomId})
                })
            },
            //选择日期加载时间数据
            timeDateChange(value) {
                let data = '';
                this.forDateData.forEach(item => {
                    if (item.date == value) {
                        data = item.usedDatas;
                    }
                })
                this.timeTableData.columnData.splice(0, this.timeTableData.columnData.length);

                this.getTimeRoom();
                if (data) {
                    this.timeTableData.columnData.forEach(item1 => {
                        data.forEach(item2 => {
                            if (item1.roomId == item2.roomId) {
                                var keyArr = this.matchTime(item2.usedStartTime, item2.usedEndTime);
                                keyArr.forEach((item3, index3) => {
                                    this.$set(item1, item3, this.getTime(item3) + 'usedId' + item2.usedId);
                                })
                            }
                        })
                    })
                }
            },
            //匹配时间表格value
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
            //点击日期初始化表格
            // extraData
            // {
            //     date: '2019-06-27',//时间
            //         room: '教室1',//教室
            //     duration: ['8:00-8:30', '11:30-12:00'],//时间段
            // },
            timeHandle(row, column, event, cell) {
                this.addToTimeTable(row, column);//数据添加到表格
            },
            // timeTableData: {
            //     columnData: [
            //         {room: '教室1', up8: '11', up9: '22'},
            //         {room: '教室2', up8: '11', up9: '22'},
            //     ],
            //     header: durationHeader
            // },
            //点击后把数据加到表格
            addToTimeTable(row, column) {
                this.timeTableData.columnData.forEach((item, index) => {
                    if (item.room == row.room) {
                        if (row[column.property] && row[column.property].substr(-1) != this.usedId) {
                            this.$message({
                                message: '教室已被预约',
                                type: 'warning'
                            })
                        } else if (row[column.property] && row[column.property].substr(-1) == this.usedId) {
                            this.$set(item, column.property, '')
                            this.extraData.forEach((item1, index1) => {
                                if (item1.date == this.timeDateValue && item1.room == item.room && item1.key == column.property) {
                                    this.extraData.splice(index1, 1)
                                }

                            })
                        } else {
                            this.$set(item, column.property, this.getTime(column.property) + 'usedId' + this.usedId);
                            this.extraData.push({date: this.timeDateValue, room: item.room, key: column.property})
                        }
                    }
                })
            },
            //把选好的数据加到extraData中


            //    时间归属段方法
            aimDuration(arr) {
                var newArr = [];
                //找key
                var findKey = function (time) {
                    var cur1 = time.split('-')[0];
                    var num = cur1.substring(0, cur1.length - 3);
                    var pos = cur1.slice(-2);
                    var keys = '';
                    if (pos == '00') {
                        keys = 'up' + num;
                    } else {
                        keys = 'down' + num;
                    }
                    return keys;
                }
                arr.forEach((item, index) => {
                    newArr.push(findKey(item))
                })
                return newArr;
            },
            //    根据时间段找时间方法
            getTime(key) {
                var label;
                durationHeader.forEach(item => {
                    if (item.value == key) {
                        label = item.label;
                    }
                })
                return label;
            },
            //    判断是不是后加的
            isPlus(value) {
                if (value) {
                    if (value.substr(-1) == this.usedId) {
                        return 'plus'
                    } else {
                        return 'init'
                    }
                } else {
                    return false
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
        padding: 0;
    }

    .el-table >>> th div {
        line-height: normal;
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
    }

    .el-table >>> td {
        padding: 0 !important;
    }

    .el-table >>> td .cell {
        padding: 0 !important;
    }

    .el-table >>> td .cell {

    }

    .el-table >>> td .cell {
        height: 40px;
        line-height: 40px;
        cursor: pointer;
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