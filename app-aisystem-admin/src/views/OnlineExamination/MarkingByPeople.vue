<template><!--逐人阅卷  shuling.xiang-->
    <div class="MarkingByPeople">
        <h2 class="title-h2">逐人阅卷</h2>
        <div class="search-container">
            <el-form size="small" :inline="true" :model="searchData" class="demo-form-inline search-form">
                <el-form-item label="审阅状态：">
                    <el-select v-model="searchData.marked" placeholder="请选择">
                        <el-option
                                v-for="item in markedOptions2_all"
                                :key="item.dicCode"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考生姓名：">
                    <el-input v-model="searchData.studentName" class="wid200" placeholder="请输入考生姓名"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="button-container">
            <el-button size="small" class="searchList el-btn-min-100 " type="primary" @click="searchList">查询</el-button>
            <el-button size="small" class="el-btn-min-100" @click="resetSearchCondition">重置</el-button>
        </div>
        <div class="map-list">
            <h3 class="title-h3">试卷题型统计</h3>
            <div class="map-table loading-table">
                <el-table border size="mini" :data="records" tooltip-effect="dark" ref="multipleTable"
                          style="margin-top: 20px;width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            prop="student_no"
                            label="考试账号">
                    </el-table-column>
                    <el-table-column
                            label="考生姓名" prop="student_name">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="考生所属机构" prop="student_org_name">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="未审阅题数" prop="noMarkedNum">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="考生得分" prop="score">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="审阅状态" prop="marked">
                        <template slot-scope="scope">
                            {{scope.row.marked == '0' ?'未阅':(scope.row.marked == '1'?'已阅':'')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
<!--                            <span class="table-operation" v-if="scope.row.noMarkedNum ===0" style="color:#999999">阅卷</span>-->
                            <span class="table-operation" v-if=" perLoaded ? PERMISSIONS.MARKING.MARKING : false"  @click="postMarking(scope.row.examId,scope.row.student_id,scope.row.paperId,scope.row.student_name,scope.row.paperName)">阅卷</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="button-container">
            <el-button class="el-btn-min-100" size="small" @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
    } from "@/assets/js/api"
    import { PERMISSION } from "@/assets/js/permissions";

    export default {
        name: "MarkingByPeople",
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                selectPersonList: [],
                searchData: { // 搜索数据
                    studentName: '', //考生姓名
                    marked: '', //审阅状态
                },
                markedOptions2_all: [], //审阅状态字典
                student_name:'',
                paperName:'',
                approvalType:'', //审阅状态
                examId:'', //考试ID
                id:'',
                paperId:'', //试卷ID
                markingType:'', //审阅方式
                questionId:'', //试题ID
                allNum:'', //应阅试题量
                notMarked:'', //未阅试题量
                studentId:'', //学员ID
                student_id:'',
                score:'', //题目分数
                questionName:'', //题目名称
                questionAnswer:'', //题目答案
                userAnswer:'', //学员答案
                userScore:'', //学员得分
                nextStudentId:'', //下一个学员ID
                nextStudentName:'', //下一个学员姓名
                markList:'', //答题列表
                multipleSelection: [], // 表格选择后的数据
                // 字典项
                dictData: {},
                dictMap: {},

                knowMap: {}, // 知识体系
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,

            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            this.getList(1, 10); //获取列表
        },
        methods: {
            loadPreData() {
                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                        this.markedOptions2_all = res.markedOptions2_all;
                    });
                getDictionariesNameData().then(res => { //获取全部数据字典名称
                    this.dictionariesNameData = res;

                });
                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                })
            },

            getList() { // 获取列表
                axiosPost('/examMgr/mark/personList', {
                    loading:'.loading-table',
                    noRepeat:'.searchList',
                    examId: this.$route.query.examId,
                    paperId: this.$route.query.paperId,
                    marked: this.searchData.marked,
                    studentName: this.searchData.studentName,
                    paperName: this.$route.query.paperName,
                }).then(res => {
                    this.records = res.data.selectPersonList;
                })
            },
            searchList() { // 通过查询条件获取列表
                this.getList();
            },
            resetSearchCondition(){ // 清空搜索条件 重置
                this.searchData = {};
            },
            back() {
                this.$router.go(-1);//返回
            },
            postMarking(examId,studentId,paperId,studentName,paperName) { //逐人阅卷跳转
                examId = this.$route.query.examId;
                paperId = this.$route.query.paperId;
                paperName = this.$route.query.paperName;
                this.$router.push({path: '/marking-people', query: {examId: examId,studentId:studentId,paperId:paperId,studentName:studentName,paperName:paperName}});
                studentId = this.student_id;
                studentName = this.student_name;
             },

            handleSelectionChange(val) { // 选择批阅考试表格
                this.multipleSelection = val;
            },
        }
    }
</script>

<style scoped>
    .title-h3 {
        font-size:18px;
        line-height: 50px;
        border-bottom: 1px solid #000;
    }
    .search-container {
        margin:0 auto;
        clear:both;
        padding-top:20px;
    }
    .search-container ul li {
        margin: 0 20px 0 0;
        float: left;
    }
    .search-form {
        float:left;
        width:90%;
    }
    .el-form-item {
        margin-bottom:0!important;
    }
    .el-form--inline .el-form-item {
        margin-right: 20px!important;
    }

    .button-container {
        margin: 0 auto;
        clear:both;
        padding-top:20px;
        text-align: center;
    }

    .edit-form p, .add-form p {
        margin: 10px auto;
        width: 80%;
    }

    .edit-form p span, .add-form p span {
        width: 100px;
        display: inline-block;
    }

    .wid500 {
        width: 505px;
    }
</style>

