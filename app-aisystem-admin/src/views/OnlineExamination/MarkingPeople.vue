<template><!-- 逐人阅卷详情  shuling.xiang-->
    <div class="MarkingItem clearfix">
        <h2 class="title-h2">{{paperName}}</h2>
        <div class="top-info">
            <div class="marking-number">
                <span>【应阅试题数】：{{allNum}}</span>
                <span>【未阅试题数】：{{notMarked}}</span>
            </div>
            <div class="right-student">
                <span>考生姓名：<em>{{studentName}}</em></span>
            </div>
        </div>

        <div v-for="(item,ind) in markList" :key="ind" >
            <div class="left-paper">
                <h3 class="topic-title">简答题-{{questionId}}<cite>({{item.score}}分)</cite></h3>
                <span class="question-title clearfix">{{item.questionName}}</span>
                <h4 class="title-answer margin-top40 clearfix">参考答案：</h4>
                <div class="answer-box margin40">{{item.questionAnswer}}</div>
            </div>
            <div class="right-answer">
                <div class="margin20">
                    <h4 class="title-answer clearfix">考生答案：</h4>
                    <div class="answer-box2 clearfix">{{item.userAnswer}}</div>
                    <div class="score-box">
                        <h4 class="title-score">考生得分：</h4>
                        <!-- <span class="score"><el-input type="number" v-model="userScore" class="width150" placeholder="请输入考生得分" @blur="BlurText($event)"></el-input></span>-->
                        <span class="score"><el-input-number   v-model="item.userScore" controls-position="right"  :min="0" :max="item.score*1" placeholder="请输入考生得分"></el-input-number></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="button-container">
            <el-button size="small" class="mapMutations el-btn-min-100" type="primary" v-if="perLoaded ? PERMISSIONS.MARKING.SAVEEXIT : false" v-model="saveType" @click="mapMutations()">保存退出</el-button>
            <el-button size="small" class="el-btn-min-100" @click="back">返 回</el-button>
        </div>
    </div>
</template>

<script>
    import {
        axiosPost,
    } from "@/assets/js/api";
    import { PERMISSION } from "@/assets/js/permissions";

    export default {
        name: "MarkingPeople",
        data() { // 存储数据
            return {
                selectQuestionList: [], // 表格数据列表
                examId:'', //考试ID
                paperName:'', //试卷名称
                allNum:'', //应阅试题数
                notMarked:'', //未阅试题数
                studentName:'', //考生姓名
                studentId:'', //考生账号
                questionId:'', //试题ID
                score:'', //题目分数
                questionName:'', //题目名称
                questionAnswer:'', //题目答案
                userAnswer:'', //考生答案
                userScore:'', //考生得分
                saveType:'', //保存类型
                nextStudentId:'', //下一个学员ID
                nextStudentName:'', //下一个学员姓名
                multipleSelection: [], // 表格选择后的数据
                markList:[],
                name:'简答题', //题目
                number:'', //题目序号
                buttonText:'',
                list:[], //试题得分集合
                // scoreRules: { // 打分的规则
                //     userScore: [{required: true, message: '请输入考生得分', trigger: 'change'}],
                // },
                // 字典项
                dictData: {},
                dictMap: {},

                knowMap: {}, // 知识体系

                contentHasSave: false, // 记录用户是否已经保存内容
                changeIntroduceState:'',
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,
            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            axiosPost('/examMgr/mark/selectPerson', { //逐人阅卷请求
                examId: this.$route.query.examId,
                paperId: this.$route.query.paperId,
                studentId: this.$route.query.studentId,
                studentName: this.$route.query.studentName,
                paperName: this.$route.query.paperName,
            }).then(res => {
                this.allNum = res.data.allNum;
                this.notMarked = res.data.notMarked;
                this.studentName = res.data.studentName;
                this.studentId = res.data.studentId;
                this.questionId = res.data.questionId;
                this.paperName = res.data.paperName;
                this.nextStudentId = res.data.nextStudentId;
                this.nextStudentName = res.data.nextStudentName;
                this.markList = res.data.markList;
                this.markList.forEach(item =>{
                    item.oldUserScore = item.userScore;
                });
            });
        },

        methods: {
            loadPreData() {
                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                })
            },

            mapMutations() {

                if (!this.scoreRules()) {
                    this.$message({message: '请输入考生得分', type: 'warning'});
                } else
                {
                    axiosPost('/examMgr/mark/personSave', { //逐人阅卷保存
                        noRepeat:'.mapMutations',
                        examId: this.$route.query.examId,
                        studentId: this.$route.query.studentId,
                        paperId: this.$route.query.paperId,
                        studentName: this.$route.query.studentName,
                        saveType: 0,
                        list: this.markList,
                    }).then(() => {
                        this.$router.go(-1);//返回
                    });
                }
            },
            scoreRules(){
                let flag = true;
                this.markList.forEach(item =>{
                    if(item.userScore === null || item.userScore === ''  || item.userScore === undefined){
                        flag = false;
                    }
                });
                return flag;
            },

            back() {
                this.$router.back();
            },
        }
    }
</script>

<style scoped>
    .top-info {
        background:#f2f2f2;
        height:40px;
        margin:20px 0;
    }
    .marking-number {
        float:left;
        width:50%;
        text-align: center;
    }
    .marking-number span {
        font-size:15px;
        line-height: 40px;
        padding:0 20px;
    }
    .right-student {
        float:left;
        width:50%;
        text-align: right;
    }
    .right-student span {
        font-size:15px;
        line-height: 40px;
        padding:0 20px;
    }
    .right-student span em {
        font-style: normal;
        font-family:'Microsoft YaHei';
        color:#409EFF;
    }
    .left-paper {
        float:left;
        width:60%;
        margin-top:20px;
        border-right:1px solid #c0ccda;
    }
    .topic-title {
        margin-right:40px;
        font-size:16px;
        font-weight:bold;
        padding-bottom:20px;
    }
    .topic-title cite {
        font-style: normal;
        font-family:'Microsoft YaHei';
    }
    .question-title {
        display:block;
        font-size:15px;
        line-height:20px;
        margin-right:40px;
    }
    .right-answer {
        float:left;
        width:40%;
        margin-top:20px;
    }
    .title-answer {
        font-weight:bold;
        color:#409EFF;
    }
    .answer-box {
        height:200px;
        border:1px dashed #c0ccda;
        padding:10px;
        border-radius: 6px;
        margin-top:20px;
        overflow-y: auto;
    }
    .answer-box2 {
        height:270px;
        border:1px dashed #c0ccda;
        padding:10px;
        border-radius: 6px;
        margin-top:20px;
        overflow-y: auto;
    }
    .score-box {
        margin-top:40px;
    }
    .score-box .title-score {
        display:inline-block;
        font-weight:bold;
        font-size:15px;
        line-height:30px;
    }
    .score-box .score {
        display:inline-block;
        width:30%;

    }
    .score-box .score .el-input .el-input__inner {
        border:0!important;
        border-bottom:1px dashed #c0ccda!important;
        color:#ff0000;
    }
    .button-container {
        margin: 0 auto;
        clear:both;
        padding-top:40px;
        text-align: center;
    }
    .margin-top40 {
        margin-top:40px;
    }
    .margin20 {
        margin:0 0 20px 40px;
    }
    .margin40 {
        margin:20px 40px 20px 0;
    }
    margin-top20 {
        margin-top:20px;
    }
    .width150 {
        width:150px;
    }
</style>
