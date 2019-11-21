<template><!-- 逐题阅卷  shuling.xiang-->
    <div class="MarkingByItem">
        <h2 class="title-h2">逐题阅卷</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="markingData" class="demo-form-inline search-form">
                <el-form-item label="考试名称：">
                    <span>{{examName}}</span>
                </el-form-item>
                <el-form-item label="试卷名称：">
                    <span>{{paperName}}</span>
                </el-form-item>
                <el-form-item label="应阅试题总量：">
                    <span>{{allNum}}</span>
                </el-form-item>
                <el-form-item label="未阅试题总量：">
                    <span>{{notMarked}}</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="map-list">
            <h3 class="title-h3">试卷题型统计</h3>
            <div class="map-table loading-table">
                <el-table border size="mini" :data="records" tooltip-effect="dark" ref="multipleTable"
                          style="margin-top: 20px;width: 100%" >
                    <el-table-column
                            prop="question_id"
                            label="题目">
<!--                        <template>-->
<!--                            简答题-{{scope.$index + 1}}-->
<!--                        </template>-->
                        <template slot-scope="scope">
                            简答题-{{scope.row.question_id}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="题号" prop="question_no">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="应阅试题量" prop="allQuestionNum">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="未阅试题量" prop="noMarkedQuestionNum">
                    </el-table-column>
                    <el-table-column label="状态" align="center" prop="marked">
                        <template slot-scope="scope">
                            <span class="font666" v-if="scope.row.noMarkedQuestionNum == 0">已阅完</span>
                            <span class="font666" v-else-if="scope.row.noMarkedQuestionNum != 0 && scope.row.noMarkedQuestionNum < scope.row.allQuestionNum">审阅中</span>
                            <span class="font666" v-else-if="scope.row.noMarkedQuestionNum == scope.row.allQuestionNum">未审阅</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span class="table-operation" v-if="scope.row.noMarkedQuestionNum ===0" style="color:#999999">阅卷</span>
                            <span class="table-operation" v-if="scope.row.noMarkedQuestionNum!==0 && (perLoaded ? PERMISSIONS.MARKING.MARKING : false)" @click="postMarking(scope.row.question_id)">阅卷</span>
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
    } from "@/assets/js/api";
    import { PERMISSION } from "@/assets/js/permissions";
    export default {
        name: "MarkingByItem",
        data() { // 存储数据
            return {
                // dictionariesAllData: [], //获取全部数据字典
                // dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 试题列表
                markingData: { // 逐题阅卷数据
                    examName: '', //考试名称
                    paperName: '', //试卷名称
                    allNum:'', //应阅试题总量
                    notMarked: '', //未阅试题总量
                },
                examName: '', //考试名称
                paperName: '', //试卷名称
                allNum:'', //应阅试题总量
                notMarked: '', //未阅试题总量
                examId:'', //考试ID
                paperId:'', //试卷ID
                marked:'', //审阅状态
                answerId:'', //考生答题明细表ID
                questionId:'', //试题ID
                question_id:'',
                examUserId:'', //考生考试关联表ID
                score:'', //题目分数
                questionName:'', //题目名称
                questionAnswer:'', //题目答案
                userAnswer:'', //学员答案
                userScore:'', //学员得分
                multipleSelection: [], // 表格选择后的数据
                question_no:'', //试题编号
                showRead:false, //已阅完显示隐藏
                noMarkedQuestionNum:'', //未阅试题量
                // 字典项
                dictData: {},
                dictMap: {},

                knowMap: {}, // 知识体系
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,

                question_ids:[],

            }
        },
        created() { //创建完成 生命周期
            this.getList(); //获取列表
            this.loadPreData();
            
        },

        methods: {
            loadPreData() {
                PERMISSION().then( res => {

                    this.PERMISSIONS = res;
                    // console.log(this.PERMISSIONS)
                    this.perLoaded = true;
                })
            },
            getList() { // 获取列表
                axiosPost('/examMgr/mark/questionList', {
                    loading:'.loading-table',
                    examId: this.$route.query.examId,
                    examName: this.$route.query.examName,
                    paperId: this.$route.query.paperId,
                    paperName: this.$route.query.paperName,
                }).then(res => {
                    this.records = res.data.selectQuestionList;
                    this.examId = res.data.examId;
                    this.paperId = res.data.paperId;
                    this.examName = res.data.examName;
                    this.paperName = res.data.paperName;
                    this.allNum = res.data.allNum;
                    this.notMarked = res.data.notMarked;

                    if(this.records.length>0){
                        this.question_ids = [];
                        this.records.forEach((item)=>{
                            if(item.noMarkedQuestionNum !== 0 ){
                                this.question_ids.push(item.question_id);
                            }
                        });
                    }

                })
                .catch((err)=> {
                    // console.log(err)
                })
            },
            back() {
                this.$router.push({path: '/examination-paper-marking'});
            },
            postMarking(questionId) { //逐题阅卷跳转
                this.question_ids.splice(this.question_ids.findIndex(item => item == questionId),1);


                const examId = this.$route.query.examId;
                const paperId = this.$route.query.paperId;
                const paperName = this.$route.query.paperName;
                const examName = this.$route.query.examName;
                this.$router.push({path: '/marking-item', query: {examId: examId,examName: examName,questionId:questionId,paperId:paperId,paperName:paperName,questionIdsOther:this.question_ids.join('|')}});
            },


        }
    }
</script>

<style scoped>
    .title-h3 {
        clear:both;
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
    .search-form span {
        margin-right:40px;
        color:#888!important;
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
    .font666 {
        color:#666;
    }
</style>
