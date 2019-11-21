<!--@menu 考试监控详情 @author dongjie.zhu-->
<template>
    <div class="examinationControlInfo">
        <h2 class="title-h2">考生查询</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="searchData" label-width="100px" >
                <el-form-item label="考试状态：">
                    <el-select v-model="searchData.examFlag" placeholder="请选择考试状态">
                        <el-option
                                v-for="item in this.dictionariesAllData['examFlag_all']"
                                :key="item.id"
                                :value="item.dicCode" :disabled="item.disabled"
                                :label="item.dicName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考生名称：">
                    <el-input v-model="searchData.studentName" placeholder="请输入考生名称" ></el-input>
                </el-form-item>
                <el-form-item label="考生账号：">
                    <el-input v-model="searchData.studentNo" placeholder="请输入考生账号" ></el-input>
                </el-form-item>
                <el-checkbox class="el-checkbox" v-model="checked" @change="selectCheckbox">自动刷新</el-checkbox>
            </el-form>
            <div class="button-container">
                <el-button size="small" class="queryList el-btn-min-100" type="primary" @click="queryList" :disabled="butIsDisabled">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="reset" :disabled="butIsDisabled">重置</el-button>
                <el-button size="small" class="el-btn-min-100" @click="back">返回</el-button>
            </div>
        </div>
        <div class="map-list">
            <div class="map-button fl">
                <el-button v-if="perLoaded ? PERMISSIONS.MONITOR.QZJJ : false" size="small" @click="submitPaperFun(multipleSelection.map((i) => i.id))">强制交卷</el-button>
            </div>
            <div class="map-table loading-table">
                <el-table :data="records" size="mini" border style="width: 100%" @selection-change ="handleSelectionChange" >
                    <el-table-column type="selection" align="center" width="40px" :selectable="selectable"></el-table-column>
                    <el-table-column prop="studentName" align="center" label="考生名称"> </el-table-column>
                    <el-table-column prop="studentNo" align="center" label="考生账号" > </el-table-column>
                    <el-table-column prop="endTime" align="center" label="交卷时间" > </el-table-column>
                    <el-table-column prop="examFlag" align="center" label="考试状态" >
                        <template slot-scope="scope">
                            <div v-for="(item,ind) in dictionariesAllData['examFlag']" :key="ind">
                                <span class="table-dicFront" v-if ="scope.row.examFlag === item.dicCode">{{item.dicName}} </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" >
                        <template slot-scope="scope">
                            <span class="table-operation" v-if="scope.row.examFlag === '1' && (perLoaded ? PERMISSIONS.MONITOR.JKCK : false)" @click="examMonitorFun(scope.row)">监控查看</span>
                            <span class="table-operation" v-if="scope.row.examFlag === '2' && (perLoaded ? PERMISSIONS.MONITOR.SJCK : false)" @click="checkPaperFun(scope.row)">试卷查看</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20, 50]"
                            :page-size="5"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 强制交卷 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="submitPaperIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项考生确认要强制交卷吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="submitPaperIsShow = false">取消</el-button>
                <el-button size="small" class="submitPaper el-btn-min-100" type="primary" @click="submitPaper">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesNameData,getDictionariesAllData,getOrgNameData} from "@/assets/js/api";
    import { PERMISSION } from '@/assets/js/permissions';

    export default {
        name: "ExaminationControlInfo",
        components:{
        },

        data() { // 存储数据
            return {
                dictionariesAllData:[], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                orgData: [],  // 所属机构 整体数据
                orgNameData:[],//获取全部机构名称
                searchData: { // 搜索数据
                    examFlag: '',
                    studentName: '',
                    studentNo: '',
                },
                records: [],//表格数据列表
                recordsTotal: 0, // 表格数据的条数
                multipleSelection:[], // 表格选择后的数据
                operations: [],         // 操作选择的id数据存储
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                examId: '', //考试id
                submitPaperIsShow: false, //强制交卷弹框是否显示
                butIsDisabled: false, //按钮是否可用
                checked: false, //自动刷新
                timer: null,    //定时器

                PERMISSIONS: {},
                perLoaded: false,
            }
        },
        created() {
            getDictionariesAllData().then(res =>{   //获取全部数据字典
                this.dictionariesAllData = res;
            });
            getDictionariesNameData().then(res => { //获取全部数据字典名称
                this.dictionariesNameData = res;
            });
            getOrgNameData().then(res =>{   //获取全部机构名称
                this.orgNameData = res;
            });
            PERMISSION().then(res =>{   //获取控制权限
                this.PERMISSIONS = res;
                this.perLoaded = true;
            });
            // this.getOrgList();    //暂时无组织机构
            this.examId = this.$route.query.id;  //考试id
            this.getList(1,this.pageSize,this.searchData.examFlag,this.searchData.studentName,this.searchData.studentNo);
        },
        mounted() { // 挂载后的 生命周期

        },
        destroyed(){ //每次离开当前界面时，清除定时器
            clearInterval(this.timer);
            this.timer = null;
        },
        methods: {
            getOrgList(){ // 获取所属机构列表
                axiosPost('/systemMgr/org/tree',{}).then(res => {
                    this.orgData = res.data;
                });
            },
            getList(pageNo,pageSize,examFlag,studentName,studentNo){ //获取考生查询接口
                axiosPost('/examMgr/examMonitor/studentList',{
                    loading:'.loading-table',
                    noRepeat:'.queryList',
                    examId: this.examId,
                    examFlag: examFlag,
                    studentName: studentName,
                    studentNo: studentNo,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            queryList(){ // 通过查询条件获取列表内容
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.examFlag,this.searchData.studentName,this.searchData.studentNo);
            },
            reset(){ // 重置
                this.searchData.examFlag = '';
                this.searchData.studentName = '';
                this.searchData.studentNo = '';
            },
            back() {
                this.$router.back();
            },
            handleSizeChange(res) { //每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.examFlag,this.searchData.studentName,this.searchData.studentNo);
            },
            handleCurrentChange(res) { //第几页
                this.pageNo = res;
                this.getList(this.pageNo,this.pageSize,this.searchData.examFlag,this.searchData.studentName,this.searchData.studentNo);
            },
            handleSelectionChange(res){ // 表格选择更改
                this.multipleSelection = res;
            },
            messageAlert(message){
                this.$message({message: message,type: 'success'});
            },
            idArrNum(idArr){ //选择的条数判断
                if (idArr.length === 0) {
                    this.$message({message:'请选择至少一条数据！',type: 'warning'});
                    return false;
                }else{
                    return true;
                }
            },
            selectable(row, index){  //勾选框部分内容禁用
                if(row.examFlag === '1'){
                    return true;
                }else{
                    return false;
                }
            },
            submitPaperFun(idArr){ //强制交卷
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.submitPaperIsShow = true;
                }
            },
            submitPaper(){ //强制交卷提交
                axiosPost('/examMgr/examMonitor/submitPaper',{    // 强制交卷接口
                    noRepeat:'.submitPaper',
                    examUserInfoId: this.operations,  //考生考试关联id
                    submitType: 3, //强制交卷方式（默认值为3）
                }).then(() => {
                    this.submitPaperIsShow = false;
                    this.messageAlert("强制交卷成功！");
                    this.queryList();
                })
            },
            selectCheckbox(){
                this.butIsDisabled = !this.butIsDisabled;
                clearInterval(this.timer);
                this.timer = null;
                if(this.checked){
                    this.setTimer();
                }
            },
            setTimer() {   //定时器每隔10秒执行一次
                if(this.timer == null) {
                    this.timer = setInterval( () => {
                        this.queryList();
                    }, 1000*10)
                }
            },
            examMonitorFun(row){    //考试监控查看，打开新路由URL
                this.$router.push({path: '/examination-monitor-detail', query: {id: row.id, paperId: row.paperId}});
            },
            checkPaperFun(row){     //考试试卷查看，打开新路由URL
                this.$router.push({path: '/examination-paper-detail', query: {id: row.id, paperId: row.paperId}});
            },
        }
    }
</script>

<style scoped lang="scss">

    .table-operation {
        color: #409EFF;
        margin-left: 5px;
        cursor: pointer;
    }
    .el-pagination{
        display: inline-block;
    }
    .pagination{
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }
    .total{
        font-weight: bold;
    }
    .treeInline{
        width: 202px;
        float: left;
    }
    .table-dicFront{
        color: #606266;
        cursor: default;
    }
    .map-button {
        margin: 10px 0;
    }
    .el-checkbox{
        margin: 10px 15px;
    }
</style>