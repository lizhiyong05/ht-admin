<!--@menu 监控查看 @author dongjie.zhu-->
<template>
    <div class="examinationMonitorDetail clearfix" >
        <div class="title-h2-div clearfix" style="margin-bottom: 5px">
            <h2 style="float:left;">监控查看</h2>
            <h4 style="float:left; margin-left: 50px"><span class="left-tit-bold">试卷:</span>{{this.paperDataAll.paperName}}</h4>
<!--            <h4 class="left-tit-bold-left" style="float: right">得分:<span class="doc-context">{{this.examUserInfo.score}}</span></h4>-->
            <h4 class="left-tit-bold-left" style="float:right">考生:<span class="doc-context">{{this.examUserInfo.studentName}}</span></h4>
            <h4 class="left-tit-bold" style="float:right;">所属机构:<span class="doc-context">{{this.examUserInfo.studentOrgName}}</span></h4>
            <div style=" text-align:center; display:block;" >
                 <span class="left-tit-bold" >总分:</span><span>{{this.paperDataAll.score}}</span>
                 <span class="left-tit-bold-left" >时间:</span><span>{{this.examUserInfo.examTime}}分钟</span>
            </div>
        </div>
        <div class="left-content">
            <div class="paper-container-title" v-show="this.questionCount > 0">
                <div class="paper-container-title-dtk" >答题卡</div>
                <div style="text-align: center"><span>剩余时间：</span><span>{{this.finishingTimeShow}}</span></div>
                <div style="text-align: center"><span>剩余考题：</span><span>{{this.questionCount - (this.paperDataAll.answerCount !== '' ? this.paperDataAll.answerCount: 0)}} / {{this.questionCount}}</span></div>
                <div style="text-align: center">
                    <el-input-number size="mini" v-model="fontsize" @change="handleChange" :min="12" :max="20" ></el-input-number>
                </div>
                <div class="horizontal-line"></div>

                <div style="padding-left: 15px">
                    <div v-show="this.singleChoiceQuestionCount > 0">
                        <div class="question-title-left">单选题</div>
                        <div>
                            (共{{this.singleChoiceQuestionCount}}题,合计{{this.singleChoiceQuestionScore}}分)
                        </div>
                        <ul class="clearfix">
                            <li class="default-circle" v-for="(item,ind) in singleChoiceQuestionList" :key="ind" :class="{'change-Background':item.examUserAnswer.userAnswer}">
                                {{ind + 1}}
                            </li>
                        </ul>
                    </div>
                    <div v-show="this.multipleChoiceQuestionCount > 0">
                        <div class="question-title-left">多选题</div>
                        <div>
                            (共{{this.multipleChoiceQuestionCount}}题,合计{{this.multipleChoiceQuestionScore}}分)
                        </div>
                        <ul class="clearfix">
                            <li class="default-circle" v-for="(item,ind) in multipleChoiceQuestionList" :key="ind" :class="{'change-Background':item.examUserAnswer.userAnswer.length > 0}">
                                {{ind + 1}}
                            </li>
                        </ul>
                    </div>
                    <div v-show="this.judgeQuestionCount > 0">
                        <div class="question-title-left">判断题</div>
                        <div>
                            (共{{this.judgeQuestionCount}}题,合计{{this.judgeQuestionScore}}分)
                        </div>
                        <ul class="clearfix">
                            <li class="default-circle" v-for="(item,ind) in judgeQuestionList" :key="ind" :class="{'change-Background':item.examUserAnswer.userAnswer}">
                                {{ind + 1}}
                            </li>
                        </ul>
                    </div>
                    <div v-show="this.voiceQuestionCount > 0">
                        <div class="question-title-left">语音题</div>
                        <div>
                            (共{{this.voiceQuestionCount}}题,合计{{this.voiceQuestionScore}}分)
                        </div>
                        <ul class="clearfix">
                            <li class="default-circle" v-for="(item,ind) in voiceQuestionList" :key="ind" :class="{'change-Background':item.examUserAnswer.userAnswer}">
                                {{ind + 1}}
                            </li>
                        </ul>
                    </div>
                    <div v-show="this.completionQuestionCount > 0">
                        <div class="question-title-left">填空题</div>
                        <div>
                            (共{{this.completionQuestionCount}}题,合计{{this.completionQuestionScore}}分)
                        </div>
                        <ul class="clearfix">
                            <li class="default-circle" v-for="(item,ind) in completionQuestionList" :key="ind" :class="{'change-Background':item.examUserAnswer.userAnswer && item.examUserAnswer.userAnswer.replace(/\(|\)/g, '') !== ''}">
                                {{ind + 1}}
                            </li>
                        </ul>
                    </div>
                    <div v-show="this.shortQuestionCount > 0">
                        <div class="question-title-left">简答题</div>
                        <div>
                            (共{{this.shortQuestionCount}}题,合计{{this.shortQuestionScore}}分)
                        </div>
                        <ul class="clearfix">
                            <li class="default-circle" v-for="(item,ind) in shortQuestionList" :key="ind" :class="{'change-Background':item.examUserAnswer.userAnswer}">
                                {{ind + 1}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="button-container">
                <el-button class="el-btn-min-100" type="primary" size="small" @click="back">返回</el-button>
            </div>
        </div>

        <div class="paper-container" >
            <div class="singleChoice-list" v-show="this.singleChoiceQuestionCount > 0">
                <div class="question-title">单选题(共{{this.singleChoiceQuestionCount}}题,合计{{this.singleChoiceQuestionScore}}分)</div>
                <div class="question-context" v-for="(item,ind) in singleChoiceQuestionList" :key="ind" :style="{'font-size': fontsize +'px'}">
                    <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                    <div class="clearfix">
                        <span v-for="(itemFile,ind) in item.file" :key="ind" >
                            <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                        </span>
                    </div>
                    <ul>
                        <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                            <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                <el-radio :label="itemOption.showOption" disabled>{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
                                <div class="clearfix">
                                    <span v-for="(itemFile,ind) in itemOption.file" :key="ind" >
                                        <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                    </span>
                                </div>
                            </li>
                        </el-radio-group>
                    </ul>
                    <div>正确答案：{{item.relativeAnswer}}</div>
                    <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                </div>
            </div>
            <div class="multipleChoice-list" v-show="this.multipleChoiceQuestionCount > 0">
                <div class="question-title">多选题(共{{this.multipleChoiceQuestionCount}}题,合计{{this.multipleChoiceQuestionScore}}分)</div>
                <div class="question-context" v-for="(item,ind) in multipleChoiceQuestionList" :key="ind" :style="{'font-size': fontsize +'px'}">
                    <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                    <div class="clearfix">
                        <span v-for="(itemFile,ind) in item.file" :key="ind" >
                            <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                        </span>
                    </div>
                    <ul>
                        <el-checkbox-group v-model="item.examUserAnswer.userAnswer" >
                            <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                <el-checkbox :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-checkbox>
                                <div class="clearfix">
                                    <span v-for="(itemFile,ind) in itemOption.file" :key="ind" >
                                        <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                    </span>
                                </div>
                            </li>
                        </el-checkbox-group>
                    </ul>
                    <div>正确答案：{{item.relativeAnswer.replace(/\|/g," ")}}</div>
                    <!--                            <div>考生答案：{{item.examUserAnswer.userAnswer.join('|')}}</div>-->
                    <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                </div>
            </div>
            <div class="judge-list" v-show="this.judgeQuestionCount > 0">
                <div class="question-title">判断题(共{{this.judgeQuestionCount}}题,合计{{this.judgeQuestionScore}}分)</div>
                <div class="question-context"   v-for="(item,ind) in judgeQuestionList" :key="ind" :style="{'font-size': fontsize +'px'}">
                    <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                    <div class="clearfix">
                        <span v-for="(itemFile,ind) in item.file" :key="ind" >
                            <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                        </span>
                    </div>
                    <ul >
                        <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                            <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                <el-radio :label="itemOption.optionContent" disabled>{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
                            </li>
                        </el-radio-group>
                    </ul>
                    <div>正确答案：{{item.relativeAnswer}}</div>
                    <!--                            <div>考生答案：{{item.examUserAnswer.userAnswer}}</div>-->
                    <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                </div>
            </div>
            <div class="voice-list" v-show="this.voiceQuestionCount > 0">
                <div class="question-title">语音题(共{{this.voiceQuestionCount}}题,合计{{this.voiceQuestionScore}}分)</div>
                <div class="question-context" v-for="(item,ind) in voiceQuestionList" :key="ind" :style="{'font-size': fontsize +'px'}">
                    <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                    <div><audio controls :src="URL + item.voicePath"></audio></div>
                    <div class="clearfix">
                        <span v-for="(itemFile,ind) in item.file" :key="ind" >
                            <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                        </span>
                    </div>
                    <ul>
                        <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                            <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                <el-radio :label="itemOption.showOption" disabled>{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
                                <div class="clearfix">
                                    <span v-for="(itemFile,ind) in itemOption.file" :key="ind" >
                                        <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                    </span>
                                </div>
                            </li>
                        </el-radio-group>
                    </ul>
                    <div>正确答案：{{item.relativeAnswer}}</div>
                    <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                </div>
            </div>
            <div class="completion-list" v-show="this.completionQuestionCount > 0">
                <div class="question-title">填空题(共{{this.completionQuestionCount}}题,合计{{this.completionQuestionScore}}分)</div>
                <div class="question-context" v-for="(item,ind) in completionQuestionList" :key="ind" :style="{'font-size': fontsize +'px'}">
                    <div class="question-context-name">{{ind + 1}}、 {{item.questionName.replace(/\[blank]/g,"_____")}} &nbsp;&nbsp;【{{item.score}}分】</div>
                    <div class="clearfix">
                        <span v-for="(itemFile,ind) in item.file" :key="ind" >
                            <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                        </span>
                    </div>
                    <div>考生答案：{{item.examUserAnswer.userAnswer}}</div>
                    <div>正确答案：[{{item.isOrder == '1' ? '有序':'无序'}}]</div>
                    <ul class="question-context-answer">
                        <li v-for="(itemOption,ind) in item.choices" :key="ind">
                            <span >填空{{ind + 1}}. {{itemOption.optionContent}}</span>
                        </li>
                    </ul>
                    <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                </div>
            </div>
            <div class="short-list" v-show="this.shortQuestionCount > 0">
                <div class="question-title">简答题(共{{this.shortQuestionCount}}题,合计{{this.shortQuestionScore}}分)</div>
                <div class="question-context" v-for="(item,ind) in shortQuestionList" :key="ind" :style="{'font-size': fontsize +'px'}">
                    <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                    <div class="clearfix">
                        <span v-for="(itemFile,ind) in item.file" :key="ind" >
                            <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                        </span>
                    </div>
                    <div>考生答案：</div>
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" v-model="item.examUserAnswer.userAnswer" :disabled="true"> </el-input>
                    <div>正确答案：</div>
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" v-model="item.questionAnswer" :disabled="true"> </el-input>
                    <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {axiosPost} from "@/assets/js/api";
    // import GLOBAL from '@/assets/js/globalVariable.js';

    export default {
        name: "ExaminationMonitorDetail",
        data() { // 存储数据
            return {
                paperDataAll:'',    //全部返回试卷数据
                examUserInfo:'',    //考生用户信息
                questionList:[],    //试题全部数据
                singleChoiceQuestionList: [],  //单选题数据集合
                multipleChoiceQuestionList: [],  //多选题数据集合
                judgeQuestionList: [],  //判断题数据集合
                completionQuestionList: [],  //填空题数据集合
                shortQuestionList: [],  //简答题数据集合
                voiceQuestionList: [],  //语音题数据集合
                questionCount: 0, //试题总数
                finishingTime: 0, //考试剩余秒数
                finishingTimeShow: "", //显示考试剩余时间

                singleChoiceQuestionCount: 0, //单选题数量
                singleChoiceQuestionScore: 0, //单选题分数
                multipleChoiceQuestionCount: 0, //多选题数量
                multipleChoiceQuestionScore: 0, //多选题分数
                judgeQuestionCount: 0, //判断题数量
                judgeQuestionScore: 0, //判断题分数
                completionQuestionCount: 0, //填空题数量
                completionQuestionScore: 0, //填空题分数
                shortQuestionCount: 0, //简答题数量
                shortQuestionScore: 0, //简答题分数
                voiceQuestionCount: 0, //语音题数量
                voiceQuestionScore: 0, //语音题分数

                timer: null,    //定时器
                timerMon: null,  //监控定时器
                fontsize: 15,
                // URL: GLOBAL.SERVE_FILE_ADDRESS,  //暂时不用此URL1
                URL: '',
            }
        },
        created(){  //创建生命周期
            this.examMonitorQuery();
        },
        methods:{
            examMonitorQuery(){
                axiosPost('/examMgr/examMonitor/monitor', {
                    id: this.$route.query.id,  //考生考试关联id
                    paperId: this.$route.query.paperId,  //试卷id
                }).then( res => {
                    this.paperDataAll = res.data;   //试卷返回全部数据
                    this.questionList = res.data.questionList; //试题全部数据
                    this.examUserInfo = res.data.examUserInfo; //考生用户信息
                    this.finishingTime = res.data.finishingTime; //考试剩余秒数
                    if(this.finishingTime > 0){
                        if(this.examUserInfo.examFlag == '2'){   //表示已交卷，计时清零
                            this.finishingTime = 0;
                            this.finishingTimeShow = "00:00:00";

                            clearInterval(this.timer);
                            clearInterval(this.timerMon);
                            this.timer = null;
                            this.timerMon = null;
                        }else {
                            this.leftTimer(this.finishingTime);  //剩余秒进行处理
                            this.setMonitorTimer();//10秒执行一次监控
                        }

                    }else {
                        this.finishingTime = 0;
                        this.finishingTimeShow = "00:00:00";

                        clearInterval(this.timer);
                        clearInterval(this.timerMon);
                        this.timer = null;
                        this.timerMon = null;
                    }
                    if(this.questionList.length >= 1){
                        this.singleChoiceQuestionList = [];
                        this.multipleChoiceQuestionList = [];
                        this.judgeQuestionList = [];
                        this.completionQuestionList = [];
                        this.shortQuestionList = [];
                        this.voiceQuestionList = [];
                        this.singleChoiceQuestionScore = 0;
                        this.multipleChoiceQuestionScore = 0;
                        this.judgeQuestionScore = 0;
                        this.completionQuestionScore = 0;
                        this.shortQuestionScore = 0;
                        this.voiceQuestionScore = 0;

                        this.questionList.forEach(item => {
                            if(item.questionType === '1'){ //单选题
                                this.singleChoiceQuestionList.push(item);
                                this.singleChoiceQuestionCount = this.singleChoiceQuestionList.length;
                                this.singleChoiceQuestionScore = this.singleChoiceQuestionScore + item.score;
                            }else if(item.questionType === '2'){  //多选题
                                if (item.examUserAnswer.userAnswer) {    //内容不为空""
                                    item.examUserAnswer.userAnswer = item.examUserAnswer.userAnswer.split("|");
                                } else {
                                    item.examUserAnswer.userAnswer = [];
                                    // item.examUserAnswer.userAnswer = null;
                                }
                                this.multipleChoiceQuestionList.push(item);
                                this.multipleChoiceQuestionCount = this.multipleChoiceQuestionList.length;
                                this.multipleChoiceQuestionScore = this.multipleChoiceQuestionScore + item.score;
                            }else if(item.questionType === '3'){  //判断题
                                this.judgeQuestionList.push(item);
                                this.judgeQuestionCount = this.judgeQuestionList.length;
                                this.judgeQuestionScore = this.judgeQuestionScore + item.score;
                            }else if(item.questionType === '4'){  //填空题
                                this.completionQuestionList.push(item);
                                this.completionQuestionCount = this.completionQuestionList.length;
                                this.completionQuestionScore = this.completionQuestionScore + item.score;
                            }else if(item.questionType === '5'){  //简答题
                                this.shortQuestionList.push(item);
                                this.shortQuestionCount = this.shortQuestionList.length;
                                this.shortQuestionScore = this.shortQuestionScore + item.score;
                            }else if(item.questionType === '6'){  //语音题
                                this.voiceQuestionList.push(item);
                                this.voiceQuestionCount = this.voiceQuestionList.length;
                                this.voiceQuestionScore = this.voiceQuestionScore + item.score;
                            }
                        });
                        this.questionCount = this.singleChoiceQuestionCount + this.multipleChoiceQuestionCount + this.judgeQuestionCount + this.completionQuestionCount + this.shortQuestionCount + this.voiceQuestionCount;
                    }
                });
            },
            leftTimer(finishingTime){
                let leftTime = parseInt(finishingTime, 10);  //剩余秒数
                let hours = parseInt(leftTime / 60 / 60 % 24 , 10); //计算剩余的小时
                let minutes = parseInt(leftTime / 60 % 60, 10);//计算剩余的分钟
                let seconds = parseInt(leftTime % 60, 10);//计算剩余的秒数
                hours = this.checkTime(hours);
                minutes = this.checkTime(minutes);
                seconds = this.checkTime(seconds);
                this.finishingTimeShow = hours + ":" + minutes + ":" + seconds;

                clearInterval(this.timer);
                this.timer = null;
                if(leftTime > 0){
                    this.setTimer(leftTime-1); //启动定时器
                }
            },
            checkTime(i){ //将0-9的数字前面加上0，例1变为01
                if(i<10) {
                    i = "0" + i;
                }
                return i;
            },
            setTimer(finishingTime) {   //定时器每隔1秒执行一次倒计时
                if(this.timer == null) {
                    this.timer = setInterval( () => {
                        this.leftTimer(finishingTime);
                    }, 1000)
                }
            },
            handleChange(value) {
                this.fontsize = value;
            },
            setMonitorTimer(){ //定时器每隔10秒执行一次监控查询
                clearInterval(this.timerMon);
                this.timerMon = null;
                if(this.timerMon == null) {
                    this.timerMon = setInterval( () => {
                        this.examMonitorQuery();
                    }, 1000*10);
                }
            },
            back() {
                this.$router.back();
            },
        },
        destroyed(){ //每次离开当前界面时，清除定时器
            clearInterval(this.timer);
            clearInterval(this.timerMon);
            this.timer = null;
            this.timerMon = null;
        },
    }
</script>

<style scoped lang="scss">
    /* 页面主标题 */
    .title-h2-div{
        border-left: 4px solid #409eff;
        padding-left: 10px;
        line-height: 22px;
        margin: 10px 0;
    }
    .left-tit-bold-left {
        font-weight: bold;
        margin-left: 50px;
    }
    .left-tit-bold {
        font-weight: bold;
    }
    .doc-context {
        font-weight:normal;
    }
    .question-title{
        font-weight: bold;
        margin-bottom: 15px;
    }
    .question-title-left{
        font-weight: bold;
    }
    .paper-container-title div{
        margin-bottom: 5px;
    }
    .paper-container-title{
        border: 1px solid #CCCCCC;
    }
    .paper-container{
        width:80%;
        float:left;
        padding-top: 20px;
    }
    .question-context{
        margin-bottom: 15px;
        /*font-size: 15px;*/
    }
    .question-context div{
        margin-bottom: 5px;
        padding-left: 30px;
    }
    .question-context ul li{
        margin-bottom: 5px;
    }
    .question-context img{
        width: 150px;
        height: 150px;
        float: left;
        margin-right: 20px;
    }
    .question-context-name{
        margin-bottom: 5px  !important;
        padding-left: 0 !important;
    }
    .question-context-answer{
        padding-left: 30px;
    }
    .horizontal-line {
        border-bottom: 1px solid #dfdfdf;
        margin-bottom: 21px;
    }
    .default-circle{
        float: left;
        margin-right: 10px;
        border:1px solid #ccc;
        border-radius:30px;
        width:25px;
        height:25px;
        text-align:center;
        line-height:23px;
    }
    .change-Background{
        color: white;
        background-color: #409EFF;
    }
    .paper-container-title-dtk{
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        padding: 10px 0;
    }
    .left-content {
        float:left;
        width:18%;
        margin:15px 20px 0 0;
    }
    .button-container {
        text-align: center;
        margin: 0 auto;
        clear:both;
        padding-top:20px;
    }
</style>