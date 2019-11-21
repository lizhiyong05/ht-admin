<template>
    <div class="activityPlan-box">
        <ul class="tab-title">
            <li :class="activeName == 1 ? 'on' : ''" @click="changeTab(1)">对练设置</li>
            <li :class="activeName == 2 ? 'on' : ''" @click="changeTab(2)">发放对练</li>
            <li :class="activeName == 3 ? 'on' : ''" @click="changeTab(3)">对练统计</li>
        </ul>
        <div v-show="activeName == 1">
            <el-form size="small" inline :model="searchList" label-width="80px">
                <el-form-item label="场景名称">
                    <el-input v-model="searchList.name" placeholder="请输入场景名称"></el-input>
                </el-form-item>
                <el-form-item label="场景描述">
                    <el-input v-model="searchList.name" placeholder="请输入场景描述"></el-input>
                </el-form-item>
                <div class="btn-box">
                    <el-button size="mini" class="no-repeat-click1" type="primary" @click="search()">查询</el-button>
                    <el-button size="mini" @click="reset()">重置</el-button>
                </div>
            </el-form>
            <el-table
                :data="tableList.records"
                cell-class-name="cellName"
                @selection-change="handleSelectionChange"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    type="selection"
                    align="center">
                </el-table-column>
                <el-table-column
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="场景名称">
                </el-table-column>
                <el-table-column
                    prop="type"
                    align="center"
                    label="场景描述">
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="tableList.current"
                layout="total, prev, pager, next, jumper"
                :total="tableList.total">
            </el-pagination>
            <div class="btn-box">
                <el-button :disabled="isShare" class="saveAdd" size="mini" type="primary" @click="saveAdd">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 2">
            <el-table
                :data="tableSend"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    align="center"
                    width="50"
                    label="选择">
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.sendStatus == '待发送'" @change="check => checkboxChange(check, scope.row)" v-model="scope.row.checked"></el-checkbox>
                        </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="trainName"
                    align="center"
                    label="场景名称">
                </el-table-column>
                <el-table-column
                    prop="trainDesc"
                    align="center"
                    label="场景描述">
                </el-table-column>
                <el-table-column
                    prop="sendStatus"
                    align="center"
                    width="120"
                    label="状态">
                </el-table-column>
            </el-table>
            <el-form size="small" :rules="rules" ref="ruleForm" inline :model="form" label-width="120px">
                <el-form-item label="发放时间">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="form.sendTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="对练时间" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="form.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="关联课程">
                    <el-select multiple v-model="courseChecked" placeholder="请选择关联课程">
                        <el-option
                            v-for="item in course"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id + '|' + item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="发放形式">
                    <el-select v-model="form.courseId" placeholder="请选择发放形式">
                        <el-option
                            v-for="item in sendType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="参加人员" style="width: 100%;">
                    <div class="input-box">
                        <el-tag size="small" @close="tagClose(index)" v-for="(item, index) in form.students" style="margin-right: 10px;" :key="index" closable>{{item.studentName}}</el-tag>
                    </div>
                    <el-button type="text" @click="selectPersonnel">选择人员</el-button>
                </el-form-item> -->
                <!-- <el-form-item label="默认已添加人员" style="width: 100%;">
                    <el-checkbox v-model="form.defaultStudent"></el-checkbox>
                </el-form-item> -->
            </el-form>
            <div class="btn-box">
                <el-button :disabled="isShare" size="mini" type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 3">
            <el-form size="small" inline :model="searchStatisticsList" label-width="80px">
                <el-form-item label="场景名称">
                    <el-input v-model="searchStatisticsList.trainName" placeholder="请输入场景名称"></el-input>
                </el-form-item>
                <el-form-item label="场景描述">
                    <el-input v-model="searchStatisticsList.trainDesc" placeholder="请输入场景描述"></el-input>
                </el-form-item>
                <div class="btn-box">
                    <el-button size="mini" type="primary" @click="searchStatistics()">查询</el-button>
                    <el-button size="mini" @click="resetStatistics()">重置</el-button>
                </div>
            </el-form>
            <el-table
                :data="tableStatistics.records"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="trainName"
                    align="center"
                    label="场景名称">
                </el-table-column>
                <el-table-column
                    prop="trainDesc"
                    align="center"
                    label="场景描述">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="已练学员数量">
                        <template slot-scope="scope">
                            <span @click="trainEdNum(scope.row.id)">{{scope.row.studied}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="未练学员数量">
                        <template slot-scope="scope">
                            <span @click="trainNum(scope.row.id)">{{scope.row.studying}}</span>
                        </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="handleCurrentChange2"
                :current-page.sync="tableStatistics.current"
                layout="total, prev, pager, next, jumper"
                :total="tableStatistics.total">
            </el-pagination>
        </div>
        <el-dialog :show-close="false" :visible.sync="trainNotVisible" width="1000px">
            <p slot="title" class="module-title">未练学员详情</p>
            <p class="trainTitle">对练: XXXXXX</p>
            <el-table
                :data="tableTrainNot"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="人员名称">
                </el-table-column>
            </el-table>
            <div class="btn-box">
                <el-button size="mini" type="primary" @click="trainNotVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="trainEdVisible" width="1000px">
            <p slot="title" class="module-title">已练学员详情</p>
            <p class="trainTitle">对练: XXXXXX</p>
            <el-table
                :data="tableTrainEd"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="人员名称">
                </el-table-column>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="最后一次练习时间">
                </el-table-column>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="练习次数">
                </el-table-column>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="录音">
                </el-table-column>
                <el-table-column
                    prop="knowledgePath"
                    align="center"
                    label="点评">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button :disabled="isShare" size="mini" v-if="operationData.includes('243cd188')" type="text" @click="comment(scope.row.id)">点评</el-button>
                        </template>
                </el-table-column>
            </el-table>
            <div class="btn-box">
                <el-button size="mini" type="primary" @click="trainEdVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="trainCommentVisible" width="1000px">
            <p slot="title" class="module-title">点评</p>
            <div class="btn-box">
                <el-button size="mini" type="primary" @click="commentOk">确定</el-button>
                <el-button size="mini" @click="trainCommentVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <PersonnelSelection 
            v-if="selectConfigIsShow" 
            :selectConfigIsShow="selectConfigIsShow" 
            :types="types" 
            :cascadeOrg="cascadeOrg" 
            @listenEventData="getDataFun" 
            @listenEventClose="getCloseFun">
        </PersonnelSelection>   
    </div>
</template>

<script>
import {
    axiosPost,
    getOperationData,
} from '@/assets/js/api';
import PersonnelSelection from '@/components/PersonnelSelection'
export default {
    name: 'train',
    data() {
        return {
            selectConfigIsShow: false, // 选择人员弹窗
            types: [], // 接口地址
            cascadeOrg: null, // 按机构查询时是否级联子机构
            course: [],
            sendType: [
                {
                    id: 0,
                    name: '人机对练'
                },{
                    id: 1,
                    name: '对练考试'
                }
            ],
            activeName: 1,
            searchList: {
                pageNo: 1,
                pageSize: 10,
            },
            tableList: {},
            tableChecked: [],
            tableSend: [],
            tableSendChecked: [],
            form: {
                time: []
            },
            searchStatisticsList: {
                pageNo: 0,
                pageSize: 10
            },
            tableStatistics: [],
            total2: 0,
            trainNotVisible: false,
            trainEdVisible: false,
            trainCommentVisible: false,
            tableTrainNot: [],
            tableTrainEd: [],
            operationData: [],
            courseChecked: [],
            rules: {
                time: [
                    { type: 'array', required: true, message: '请选择对练时间', trigger: 'change' }
                ],
            },
            isShare: false,
        }
    },
    components: {
        PersonnelSelection
    },
    computed: {
        planId() {
            return this.$route.query.id;
        }
    },
    created() {
        getOperationData('培训计划管理').then(res => {
            this.operationData = res;
        });
        this.getCourse();
        this.getList();
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    methods: {
        changeTab(index) {
            this.activeName = index;
            if(index == 1) { }
            if(index == 2) { this.getTableSend() }
            if(index == 3) { this.searchStatistics() }
        },
        getList() {
            this.tableList = {
                records: []
            }
        },
        search() {
            this.searchList.pageNo = 1;
            this.getList();
        },
        reset() {
            this.searchList = {
                pageNo: 1,
                pageSize: 10,
            }
        },
        getStatisticstList() {
            this.searchStatisticsList.planId = this.planId;
            axiosPost('/educateMgr/plan/train/statistic/list', this.searchStatisticsList).then(res => {
                this.tableStatistics = res.data;
            })
        },
        searchStatistics() {
            this.searchStatisticsList.pageNo = 1;
            this.getStatisticstList();
        },
        resetStatistics() {
            this.searchStatisticsList = {
                pageNo: 1,
                pageSize: 10,
            }
        },
        handleSelectionChange(val) {
            this.tableChecked = val;
        },
        handleCurrentChange(val) {
            this.searchList.pageNo = val;
            this.getList();
        },
        handleCurrentChange2(val) {
            this.searchStatisticsList.pageNo = val;
            this.getStatisticstList();
        },
        saveAdd() {
            if(this.tableChecked.length == 0) {
                this.$message.error('请至少选择一个场景');
                return;
            }
            let params = {
                planId: this.planId,
                trains: [],
                noRepeat: '.saveAdd'
            }
            this.tableList.records.forEach(item => {
                params.trains.push({
                    trainId: item.id,
                    trainName: item.trainName,
                    trainDesc: item.trainDesc,
                })
            })
            axiosPost('/educateMgr/plan/train/save', params).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.tableChecked = [];
                this.search();
            })
        },
        checkboxChange(check, row){ // 单选
            this.tableSend.forEach(item => {
                if (item.id !== row.id) {
                    item.checked = false
                }
            })
            if(check) {
                this.tableSendChecked = row;
            }else {
                this.tableSendChecked = [];
            }
        },
        getTableSend() {
            axiosPost('/educateMgr/plan/train/list', {planId: this.planId}).then(res => {
                res.data.forEach(item => {
                    item.checked = false;
                })
                this.tableSend = res.data;
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveSend();
                } else {
                    return false;
                }
            });
        },
        saveSend() {
            this.form.id = this.tableSendChecked.id;
            if(!this.form.id) {
                this.$message({message: '请选择一个场景',type: 'error'});
                return;
            }
            this.form.courses = []
            this.courseChecked.forEach(item => {
                this.form.courses.push({
                    courseId: item.split('|')[0],
                    courseName: item.split('|')[1]
                })
            })
            this.form.startTime = this.form.time[0] || '';
            this.form.endTime = this.form.time[1] || '';
            axiosPost('/educateMgr/plan/train/send', {planId: this.planId}).then(res => {
                this.$message({message: '发放成功',type: 'success'});
                this.getTableSend();
                this.courseChecked = [];
                this.$refs['ruleForm'].resetFields();
                this.form = {
                    time: []
                }
            })
        },
        tagClose(item) {
            this.form.students.splice(this.form.students.indexOf(item), 1);
        },
        selectPersonnel(){ // 选择人员            
            this.selectConfigIsShow = true;
            this.types = ['STUDENT'];
        },
        getDataFun(res){ // 获取数据
            this.form.students = [];
            res.forEach(item => {
                this.form.students.push({
                    receiverId: item.id,
                    receiverName: item.userName,
                })
            })
        },
        getCloseFun(res){ // 弹窗是否关闭
            this.selectConfigIsShow = res;
        },
        getCourse() {
            axiosPost('/educateMgr/plan/course/dropDown', {planId: this.planId}).then(res => {
                this.course = res.data;
            })
        },
        trainEdNum(id) {
            this.trainEdVisible = true;
            this.tableTrainEd = [{}];
        },
        trainNum(id) {
            axiosPost('/educateMgr/plan/train/statistic/student', {planId: this.planId,id: id}).then(res => {
                this.trainNotVisible = true;
            })
        },
        comment(id) {
            this.trainCommentVisible = true;
        },
        commentOk() {}
    }
}
</script>

<style scoped>
    .trainTitle {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    }
</style>