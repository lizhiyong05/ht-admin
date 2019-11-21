<!--@menu 试卷查看 @author dongjie.zhu-->
<template>
    <div class="examinationPaperDetail">
        <div class="title-h2-div clearfix" style="margin-bottom: 5px">
            <h2 style="float:left; ">查看试卷</h2>
<!--            <h4 style="float:left; margin-left: 50px"><span class="left-tit-bold">试卷:</span>{{this.paperDataAll.paperName}}</h4>-->
            <h4 class="left-tit-bold-left" style="float: right">得分:<span class="doc-context">{{this.examUserInfo.score}}</span></h4>
            <h4 class="left-tit-bold-left" style="float:right">考生:<span class="doc-context">{{this.examUserInfo.studentName}}</span></h4>
            <h4 class="left-tit-bold" style="float:right;">所属机构:<span class="doc-context">{{this.examUserInfo.studentOrgName}}</span></h4>
            <div style=" text-align:center; display:block;" >
                <span class="left-tit-bold" >总分:</span><span>{{this.paperDataAll.score}}</span>
                <span class="left-tit-bold-left" >时间:</span><span>{{this.examUserInfo.examTime}}分钟</span>
            </div>
        </div>
        <div class="button-container">
            <h3 style="float:left; line-height: 36px; margin-left: 15px"><span class="left-tit-bold">试卷:</span>{{this.paperDataAll.paperName}}</h3>
            <el-button class="el-btn-min-100" type="primary" size="small"  @click="back">返回</el-button>
        </div>
        <div class="tabs-container">
            <el-tabs v-model="activeName">
                <el-tab-pane label="显示所有题" name="allQuestion">
                    <div class="singleChoice-list" v-show="this.singleChoiceQuestionCount > 0">
                        <div class="question-title">单选题(共{{this.singleChoiceQuestionCount}}题,合计{{this.singleChoiceQuestionScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in singleChoiceQuestionList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul>
                                <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                                    <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                        <el-radio :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                        <div class="question-context" v-for="(item,ind) in multipleChoiceQuestionList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul >
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
                        <div class="question-context" v-for="(item,ind) in judgeQuestionList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul >
                                <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                                    <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                        <el-radio :label="itemOption.optionContent" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                        <div class="question-context" v-for="(item,ind) in voiceQuestionList" :key="ind">
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
                                        <el-radio :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                        <div class="question-context" v-for="(item,ind) in completionQuestionList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、<span v-html="nameFilter(item)"></span> &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <!-- <div>考生答案：{{item.examUserAnswer.userAnswer}}</div> -->
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
                        <div class="question-context" v-for="(item,ind) in shortQuestionList" :key="ind">
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
                </el-tab-pane>
                <el-tab-pane label="显示答对题目" name="rightQuestion">
                    <div class="singleChoiceRight-list" v-show="this.singleChoiceQuestionRightCount > 0">
                        <div class="question-title">单选题(共{{this.singleChoiceQuestionRightCount}}题,合计{{this.singleChoiceQuestionRightScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in singleChoiceQuestionRightList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul>
                                <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                                    <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                        <el-radio :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                    <div class="multipleChoiceRight-list" v-show="this.multipleChoiceQuestionRightCount > 0">
                        <div class="question-title">多选题(共{{this.multipleChoiceQuestionRightCount}}题,合计{{this.multipleChoiceQuestionRightScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in multipleChoiceQuestionRightList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul >
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
                    <div class="judgeRight-list" v-show="this.judgeQuestionRightCount > 0">
                        <div class="question-title">判断题(共{{this.judgeQuestionRightCount}}题,合计{{this.judgeQuestionRightScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in judgeQuestionRightList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul >
                                <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                                    <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                        <el-radio :label="itemOption.optionContent" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
                                    </li>
                                </el-radio-group>
                            </ul>
                            <div>正确答案：{{item.relativeAnswer}}</div>
                            <!--                            <div>考生答案：{{item.examUserAnswer.userAnswer}}</div>-->
                            <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                        </div>
                    </div>
                    <div class="voiceRight-list" v-show="this.voiceQuestionRightCount > 0">
                        <div class="question-title">语音题(共{{this.voiceQuestionRightCount}}题,合计{{this.voiceQuestionRightScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in voiceQuestionRightList" :key="ind">
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
                                        <el-radio :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                    <div class="completionRight-list" v-show="this.completionQuestionRightCount > 0">
                        <div class="question-title">填空题(共{{this.completionQuestionRightCount}}题,合计{{this.completionQuestionRightScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in completionQuestionRightList" :key="ind">
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
                    <div class="shortRight-list" v-show="this.shortQuestionRightCount > 0">
                        <div class="question-title">简答题(共{{this.shortQuestionRightCount}}题,合计{{this.shortQuestionRightScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in shortQuestionRightList" :key="ind">
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
                </el-tab-pane>
                <el-tab-pane label="显示答错题目" name="errorQuestion">
                    <div class="singleChoiceError-list" v-show="this.singleChoiceQuestionErrorCount > 0">
                        <div class="question-title">单选题(共{{this.singleChoiceQuestionErrorCount}}题,合计{{this.singleChoiceQuestionErrorScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in singleChoiceQuestionErrorList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul>
                                <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                                    <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                        <el-radio :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                    <div class="multipleChoiceError-list" v-show="this.multipleChoiceQuestionErrorCount > 0">
                        <div class="question-title">多选题(共{{this.multipleChoiceQuestionErrorCount}}题,合计{{this.multipleChoiceQuestionErrorScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in multipleChoiceQuestionErrorList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul >
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
                    <div class="judgeError-list" v-show="this.judgeQuestionErrorCount > 0">
                        <div class="question-title">判断题(共{{this.judgeQuestionErrorCount}}题,合计{{this.judgeQuestionErrorScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in judgeQuestionErrorList" :key="ind">
                            <div class="question-context-name">{{ind + 1}}、 {{item.questionName}} &nbsp;&nbsp;【{{item.score}}分】</div>
                            <div class="clearfix">
                                <span v-for="(itemFile,ind) in item.file" :key="ind" >
                                    <img :src="URL + itemFile.filePath" :alt="itemFile.fileName">
                                </span>
                            </div>
                            <ul >
                                <el-radio-group v-model="item.examUserAnswer.userAnswer" >
                                    <li v-for="(itemOption,ind) in item.choices" :key="ind">
                                        <el-radio :label="itemOption.optionContent" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
                                    </li>
                                </el-radio-group>
                            </ul>
                            <div>正确答案：{{item.relativeAnswer}}</div>
                            <!--                            <div>考生答案：{{item.examUserAnswer.userAnswer}}</div>-->
                            <div>考生得分：{{item.examUserAnswer.userScore !== null ? item.examUserAnswer.userScore:0}}分</div>
                        </div>
                    </div>
                    <div class="voiceError-list" v-show="this.voiceQuestionErrorCount > 0">
                        <div class="question-title">语音题(共{{this.voiceQuestionErrorCount}}题,合计{{this.voiceQuestionErrorScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in voiceQuestionErrorList" :key="ind">
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
                                        <el-radio :label="itemOption.showOption" disabled >{{itemOption.showOption}}. {{itemOption.optionContent}}</el-radio>
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
                    <div class="completionError-list" v-show="this.completionQuestionErrorCount > 0">
                        <div class="question-title">填空题(共{{this.completionQuestionErrorCount}}题,合计{{this.completionQuestionErrorScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in completionQuestionErrorList" :key="ind">
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
                    <div class="shortError-list" v-show="this.shortQuestionErrorCount > 0">
                        <div class="question-title">简答题(共{{this.shortQuestionErrorCount}}题,合计{{this.shortQuestionErrorScore}}分)</div>
                        <div class="question-context" v-for="(item,ind) in shortQuestionErrorList" :key="ind">
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
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {axiosPost} from "@/assets/js/api";
    // import GLOBAL from '@/assets/js/globalVariable.js';

    export default {
        name: "ExaminationPaperDetail",
        data() { // 存储数据
            return {
                activeName: 'allQuestion',
                paperDataAll:'',    //全部返回试卷数据
                examUserInfo:'',    //考生用户信息
                questionList:[],    //试题全部数据
                singleChoiceQuestionList: [],  //单选题数据集合
                multipleChoiceQuestionList: [],  //多选题数据集合
                judgeQuestionList: [],  //判断题数据集合
                completionQuestionList: [],  //填空题数据集合
                shortQuestionList: [],  //简答题数据集合
                voiceQuestionList: [],  //语音题数据集合

                singleChoiceQuestionRightList: [],  //正确单选题数据集合
                multipleChoiceQuestionRightList: [],  //正确多选题数据集合
                judgeQuestionRightList: [],  //正确判断题数据集合
                completionQuestionRightList: [],  //正确填空题数据集合
                shortQuestionRightList: [],  //正确简答题数据集合
                voiceQuestionRightList: [],  //正确语音题数据集合

                singleChoiceQuestionErrorList: [],  //错误单选题数据集合
                multipleChoiceQuestionErrorList: [],  //错误多选题数据集合
                judgeQuestionErrorList: [],  //错误判断题数据集合
                completionQuestionErrorList: [],  //错误填空题数据集合
                shortQuestionErrorList: [],  //错误简答题数据集合
                voiceQuestionErrorList: [],  //错误语音题数据集合

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

                singleChoiceQuestionRightCount: 0, //正确单选题数量
                singleChoiceQuestionRightScore: 0, //正确单选题分数
                multipleChoiceQuestionRightCount: 0, //正确多选题数量
                multipleChoiceQuestionRightScore: 0, //正确多选题分数
                judgeQuestionRightCount: 0, //正确判断题数量
                judgeQuestionRightScore: 0, //正确判断题分数
                completionQuestionRightCount: 0, //正确填空题数量
                completionQuestionRightScore: 0, //正确填空题分数
                shortQuestionRightCount: 0, //正确简答题数量
                shortQuestionRightScore: 0, //正确简答题分数
                voiceQuestionRightCount: 0, //正确语音题数量
                voiceQuestionRightScore: 0, //正确语音题分数

                singleChoiceQuestionErrorCount: 0, //错误单选题数量
                singleChoiceQuestionErrorScore: 0, //错误单选题分数
                multipleChoiceQuestionErrorCount: 0, //错误多选题数量
                multipleChoiceQuestionErrorScore: 0, //错误多选题分数
                judgeQuestionErrorCount: 0, //错误判断题数量
                judgeQuestionErrorScore: 0, //错误判断题分数
                completionQuestionErrorCount: 0, //错误填空题数量
                completionQuestionErrorScore: 0, //错误填空题分数
                shortQuestionErrorCount: 0, //错误简答题数量
                shortQuestionErrorScore: 0, //错误简答题分数
                voiceQuestionErrorCount: 0, //错误语音题数量
                voiceQuestionErrorScore: 0, //错误语音题分数

                // URL: GLOBAL.SERVE_FILE_ADDRESS,
                URL: '',
            }
        },
        created(){  //创建生命周期
            axiosPost('/examMgr/examMonitor/checkPaper', {
                id: this.$route.query.id,  //考生考试关联id
                paperId: this.$route.query.paperId,  //试卷id
            }).then( res => {
                this.paperDataAll = res.data;   //试卷返回全部数据
                this.questionList = res.data.questionList; //试题全部数据
                this.examUserInfo = res.data.examUserInfo; //考生用户信息

                if(this.questionList.length >= 1){
                    this.questionList.forEach(item => {
                        if(item.questionType === '1'){ //单选题
                            this.singleChoiceQuestionList.push(item);
                            this.singleChoiceQuestionCount = this.singleChoiceQuestionList.length;
                            this.singleChoiceQuestionScore = this.singleChoiceQuestionScore + item.score;

                            if(item.score === item.examUserAnswer.userScore){
                                this.singleChoiceQuestionRightList.push(item);
                                this.singleChoiceQuestionRightCount = this.singleChoiceQuestionRightList.length;
                                this.singleChoiceQuestionRightScore = this.singleChoiceQuestionRightScore + item.score;
                            }else{
                                this.singleChoiceQuestionErrorList.push(item);
                                this.singleChoiceQuestionErrorCount = this.singleChoiceQuestionErrorList.length;
                                this.singleChoiceQuestionErrorScore = this.singleChoiceQuestionErrorScore + item.score;
                            }
                        }else if(item.questionType === '2'){  //多选题
                            if (item.examUserAnswer.userAnswer) {    //内容不为空""
                                item.examUserAnswer.userAnswer = item.examUserAnswer.userAnswer.split("|");
                            } else {
                                item.examUserAnswer.userAnswer = [];
                            }
                            this.multipleChoiceQuestionList.push(item);
                            this.multipleChoiceQuestionCount = this.multipleChoiceQuestionList.length;
                            this.multipleChoiceQuestionScore = this.multipleChoiceQuestionScore + item.score;

                            if(item.score === item.examUserAnswer.userScore){
                                this.multipleChoiceQuestionRightList.push(item);
                                this.multipleChoiceQuestionRightCount = this.multipleChoiceQuestionRightList.length;
                                this.multipleChoiceQuestionRightScore = this.multipleChoiceQuestionRightScore + item.score;
                            }else{
                                this.multipleChoiceQuestionErrorList.push(item);
                                this.multipleChoiceQuestionErrorCount = this.multipleChoiceQuestionErrorList.length;
                                this.multipleChoiceQuestionErrorScore = this.multipleChoiceQuestionErrorScore + item.score;
                            }
                        }else if(item.questionType === '3'){  //判断题
                            this.judgeQuestionList.push(item);
                            this.judgeQuestionCount = this.judgeQuestionList.length;
                            this.judgeQuestionScore = this.judgeQuestionScore + item.score;

                            if(item.score === item.examUserAnswer.userScore){
                                this.judgeQuestionRightList.push(item);
                                this.judgeQuestionRightCount = this.judgeQuestionRightList.length;
                                this.judgeQuestionRightScore = this.judgeQuestionRightScore + item.score;
                            }else{
                                this.judgeQuestionErrorList.push(item);
                                this.judgeQuestionErrorCount = this.judgeQuestionErrorList.length;
                                this.judgeQuestionErrorScore = this.judgeQuestionErrorScore + item.score;
                            }
                        }else if(item.questionType === '4'){  //填空题
                            if(item.examUserAnswer.userAnswer == null) {
                                item.examUserAnswer.userAnswer = '';
                            }
                            this.completionQuestionList.push(item);
                            this.completionQuestionCount = this.completionQuestionList.length;
                            this.completionQuestionScore = this.completionQuestionScore + item.score;

                            if(item.score === item.examUserAnswer.userScore){
                                this.completionQuestionRightList.push(item);
                                this.completionQuestionRightCount = this.completionQuestionRightList.length;
                                this.completionQuestionRightScore = this.completionQuestionRightScore + item.score;
                            }else{
                                this.completionQuestionErrorList.push(item);
                                this.completionQuestionErrorCount = this.completionQuestionErrorList.length;
                                this.completionQuestionErrorScore = this.completionQuestionErrorScore + item.score;
                            }
                        }else if(item.questionType === '5'){  //简答题
                            this.shortQuestionList.push(item);
                            this.shortQuestionCount = this.shortQuestionList.length;
                            this.shortQuestionScore = this.shortQuestionScore + item.score;

                            if(item.score === item.examUserAnswer.userScore){
                                this.shortQuestionRightList.push(item);
                                this.shortQuestionRightCount = this.shortQuestionRightList.length;
                                this.shortQuestionRightScore = this.shortQuestionRightScore + item.score;
                            }else{
                                this.shortQuestionErrorList.push(item);
                                this.shortQuestionErrorCount = this.shortQuestionErrorList.length;
                                this.shortQuestionErrorScore = this.shortQuestionErrorScore + item.score;
                            }
                        }else if(item.questionType === '6'){  //语音题
                            this.voiceQuestionList.push(item);
                            this.voiceQuestionCount = this.voiceQuestionList.length;
                            this.voiceQuestionScore = this.voiceQuestionScore + item.score;

                            if(item.score === item.examUserAnswer.userScore){
                                this.voiceQuestionRightList.push(item);
                                this.voiceQuestionRightCount = this.voiceQuestionRightList.length;
                                this.voiceQuestionRightScore = this.voiceQuestionRightScore + item.score;
                            }else{
                                this.voiceQuestionErrorList.push(item);
                                this.voiceQuestionErrorCount = this.voiceQuestionErrorList.length;
                                this.voiceQuestionErrorScore = this.voiceQuestionErrorScore + item.score;
                            }
                        }
                    });
                }
            });
        },
        methods:{
            back() {
                this.$router.back();
            },
            nameFilter(item) {
                var questionName = item.questionName;
                var answer = item.examUserAnswer.userAnswer.replace(/\)\(/g,'|').replace(/\(|\)/g, '').split('|');
                if(item.questionType == 4) {
                    item.choices.forEach((val,i) => {
                        questionName = questionName.replace(/\[blank\]/,'<span class="textName">'+ (answer[i] || '') +'</span>');
                    })
                }
                return questionName;
            },
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
    .question-context{
        margin-bottom: 15px;
        font-size: 15px;
    }
    .question-context img{
        width: 150px;
        height: 150px;
        float: left;
        margin-right: 20px;
    }
    .question-context div{
        margin-bottom: 5px;
        padding-left: 30px;
    }
    .question-context ul li{
        margin-bottom: 5px;
    }
    .question-context-name{
        margin-bottom: 5px  !important;
        padding-left: 0 !important;
    }
    .question-context-answer{
        padding-left: 30px;
    }
    .button-container {
        text-align: right;
        margin-top: 10px;
    }
</style>
<style>
    .question-context .textName {
        display: inline-block;
        padding: 0 5px;
        min-width: 40px;
        border-bottom: 1px solid #c5c5c5;
        text-align: center;
    }
</style>