<template><!-- 逐题阅卷详情  shuling.xiang-->
    <div class="MarkingItem clearfix">
        <h2 class="title-h2">{{paperName}}</h2>
        <div class="left-paper">
            <h3 class="topic-title">
                简答题-{{questionId}}
                <cite>({{score}}分)</cite>
            </h3>
            <span class="question-title clearfix">{{questionName}}</span>
            <h4 class="title-answer margin-top40 clearfix">参考答案：</h4>
            <div class="answer-box margin40">{{questionAnswer}}</div>
        </div>
        <div class="right-answer">
            <div class="margin20">
                <h4 class="title- answer clearfix">考生答案：</h4>
                <div class="answer-box clearfix">{{userAnswer}}</div>
                <div class="score-box">
                    <h4 class="title-score">考生得分：</h4>
                    <span class="score"><el-input-number   v-model="userScore" controls-position="right"  :min="0" :max="score*1" placeholder="请输入考生得分"></el-input-number></span>
                    <!-- <span class="score"><el-input type="number" v-model="userScore" class="width150" placeholder="请输入考生得分" @blur="BlurText($event)"></el-input></span> -->
                </div>
                <div class="margin-top40">
                    <el-button size="small" class="mapMutationsSubmit_saveExit el-btn-min-100" type="primary" v-if="perLoaded ? PERMISSIONS.MARKING.SAVEEXIT : false" @click="mapMutationsSubmit('saveExit')">保存退出</el-button>
                    <el-button size="small" class="mapMutationsSubmit_saveContinue el-btn-min-100" type="primary" v-if="perLoaded ? PERMISSIONS.MARKING.SAVECONTINUE : false" @click="mapMutationsSubmit('saveContinue')">保存继续</el-button>
                    <el-button size="small" class="el-btn-min-100" v-if="perLoaded ? PERMISSIONS.MARKING.EXIT : false" @click="backMark">退出</el-button>
                </div>
            </div>
        </div>
        <!-- 该题已阅完弹窗-->
        <el-dialog class="el-dialog-500" title="" :visible.sync="saveContinueIsShow">
            <div class="dialog-container">
                <p class="align-center">"<span class="font-blue">{{paperName}} - 简答题{{questionId}}</span>" 已全部批阅完成，是否批阅"<span class="font-blue">{{paperName}} - 简答题{{curQuestionId}}</span>"</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="backMark">取消</el-button>
                <el-button size="small" class="saveContinueSubmit el-btn-min-100" type="primary" @click="saveContinueSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 所有题目已阅完弹窗 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="allQuestionIsShow" @close="backMark">
            <div class="dialog-container">
                <p class="center">所有题目已全部批阅完成</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="allQuestionIsShow = false">取消</el-button>
                <el-button size="small" class="el-btn-min-100"  type="primary" @click="allQuestionIsShow = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        axiosPost,
    } from "@/assets/js/api";
    import { PERMISSION } from "@/assets/js/permissions";

    export default {
        name: "MarkingItem",
        data() { // 存储数据
            return {
                examId:'', //考试ID
                examName: '', // 考试名称
                questionId:'', //试题ID
                question_id:'', //试题ID
                paperId:'', //试卷ID
                answerId:'', //考生答题明细表ID
                examUserId:'', //考生考试关联表ID
                score:'', //题目分数
                questionName:'', //题目名称
                questionAnswer:'', //题目答案
                userAnswer:'', //考生答案
                userScore:'', //考生得分
                saveType:'', //保存类型
                paperName:'', //试卷名称
                buttonText:'',
                QuestionMark:'',
                saveContinueIsShow: false, //该题已阅完弹窗
                allQuestionIsShow: false, //所有题目已阅完弹窗
                contentHasSave: false, // 记录用户是否已经保存内容
                operationFlag: '', // 保存退出：saveExit；保存继续：saveContinue;
                scoreRules: { // 打分的规则
                    userScore: [{required: true, message: '请输入考生得分', trigger: 'change'}],
                },
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,

                questionIdsOther:[],
                questionIdNextRandom: '',
                curQuestionId: '', // 下一题的id
            }
        },

        created() { //创建完成 生命周期
            this.loadPreData();
            // console.log(this.$route.query.questionIdsOther);
            if(this.$route.query.questionIdsOther){
                this.questionIdsOther = this.$route.query.questionIdsOther.split('|');
            }
            // console.log(this.questionIdsOther.length);
            this.curQuestionId = this.questionIdsOther[0];
            this.questionId = this.$route.query.questionId;
            this.paperName = this.$route.query.paperName;
            this.examId = this.$route.query.examId;
            this.examName = this.$route.query.examName;
            this.paperId = this.$route.query.paperId;
            axiosPost('/examMgr/mark/selectQuestion', { //逐题阅卷请求
                examId: this.$route.query.examId,  // 考试ID
                questionId: this.$route.query.questionId, //  试题ID
                paperId: this.$route.query.paperId, // 试卷ID
                paperName:this.$route.query.paperName, // 试卷名称
            }).then(res => {
                this.examUserId = res.data.examUserId; // 考生考试关联表ID
                this.score = res.data.score; // 题目分数
                this.questionName = res.data.questionName; // 题目名称
                this.questionAnswer = res.data.questionAnswer; // 题目答案
                this.userAnswer = res.data.userAnswer; // 学员答案
                this.marked = res.data.marked; // 是否打分
                this.userScore = res.data.userScore; // 学员得分
                this.answerId = res.data.answerId; // 考生答题明细表ID
            })
        },

        methods: {

            loadPreData() {
                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                })
            },

            BlurText(e) { //考生得分打分规则只能输入正整数
                let boolean = new RegExp("^(?:0|[1-9][0-9]?|100)$").test(e.target.value);
                if(!boolean){
                    this.$message.warning('请输入0-100间整数');
                    e.target.value = ''
                }

            },


            // 保存操作提交
            mapMutationsSubmit(operationFlag){
                switch (operationFlag) {  // 后端接口设计为通过数字类型动作码指定操作 0保存退出 1保存继续
                    case 'saveContinue':
                        if (this.userScore === undefined || this.userScore === '') {
                            this.$message({message: '请输入考生得分', type: 'warning'});
                            return;
                        } else {
                            if(this.score < this.userScore*1){
                                this.$message({message: '考生得分不能大于试题分数', type: 'warning'});
                                return;
                            }

                            axiosPost('/examMgr/mark/questionSave', { //保存继续按钮提交数据
                                noRepeat:'.mapMutationsSubmit_saveContinue',
                                examId: this.$route.query.examId, // 考试ID
                                answerId: this.answerId, // 考生答题明细表ID
                                paperId: this.paperId, // 试卷ID
                                examUserId: this.examUserId, // 考生考试关联表ID
                                userScore: this.userScore, // 学员得分
                                score: this.score, // 题目分数
                                questionId: this.questionId, // 试题ID
                                saveType: '1',
                            }).then((res) => {
                                if(res.data === null){ // 无下一题
                                    if(this.questionIdsOther.length > 0 ){
                                        this.saveContinueIsShow = true;
                                    }else{
                                        this.allQuestionIsShow =true;
                                    }
                                }else{ // 有下一题
                                    this.examUserId = res.data.examUserId; // 考生考试关联表ID
                                    this.score = res.data.score; // 题目分数
                                    this.questionName = res.data.questionName; // 题目名称
                                    this.questionAnswer = res.data.questionAnswer; // 题目答案
                                    this.userAnswer = res.data.userAnswer; // 学员答案
                                    this.marked = res.data.marked; // 是否打分
                                    this.userScore = res.data.userScore; // 学员得分
                                    this.answerId = res.data.answerId; // 考生答题明细表ID
                                }
                            })
                        }
                        break;
                    case 'saveExit':
                        // this.saveType = 0;
                        if (this.userScore === undefined || this.userScore === ''){
                            this.$message({message: '请输入考生得分', type: 'warning'});
                            return;
                        } else {
                            if(this.score < this.userScore*1){
                                this.$message({message: '考生得分不能大于试题分数', type: 'warning'});
                                return;
                            }

                            axiosPost('/examMgr/mark/questionSave', { //保存退出按钮提交
                                noRepeat:'.mapMutationsSubmit_saveExit',
                                examId: this.examId,
                                answerId: this.answerId,
                                paperId: this.paperId,
                                examUserId: this.examUserId,
                                userScore: this.userScore,
                                score: this.score,
                                questionId: this.questionId,
                                saveType: '0',
                            }).then(() => {
                                this.backMark();
                            })
                        }
                        break;
                    default:
                        // console.log(`未定义的操作: ${operationFlag}`);
                        break;

                }

            },
            saveContinueSubmit(){ //逐题阅卷审阅下一题提交
                this.saveContinueIsShow = false;
                this.questionIdsOther.splice(this.questionIdsOther.findIndex(item => item == this.curQuestionId),1);
                this.$router.push({path: '/marking-item',query:{examId: this.examId,examName: this.examName,questionId: this.curQuestionId,paperId: this.paperId,paperName: this.paperName,questionIdsOther: this.questionIdsOther.join('|')}});
            },
            backMark(){ // 返回列表页
                this.$router.push({path: '/marking-by-item',query:{examId: this.examId,examName: this.examName,paperId: this.paperId,paperName: this.paperName}});
            }
        },
        watch: {
            '$route' () {
                this.$router.go(0);
            }
        }
    }
</script>

<style scoped>
   .left-paper {
       float:left;
       width:60%;
       margin-top:20px;
       border-right:1px solid #c0ccda;
   }
    .topic-title {
        margin-right:20px;
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
        height:300px;
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
    .font-blue {
       color:#409eff;
   }
    .center {
        text-align: center;
    }
</style>
