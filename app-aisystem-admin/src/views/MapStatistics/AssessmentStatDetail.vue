<template><!-- 地图课程评估统计详情 shuling.xiang-->
    <div class="AssessmentStatDetail">
        <h2 class="title-h2">地图-课程-评估统计详情</h2>
        <el-tabs v-model="activeName" type="card" class="mar-top20" @tab-click="handleClick">
            <el-tab-pane label="汇总统计" name="first">
                <div class="content-tab">
                    <div class="export-results">
                        <el-button type="primary">导出结果</el-button>
                    </div>
                    <div class="top-table">
                        <span>评估参与人：XXX</span>
                        <span>平均分：XX</span>
                    </div>
                    <div class="clearfix"></div>
                    <div>
<!--                    <div v-for="index in questionList" :key="index">-->
                        <div class="question-number">Q1：</div>
                        <div class="mid-question">
                            <div class="question-title">
                                <el-input v-model="questionTitle" placeholder="题目名称"></el-input>
                            </div>
                            <ul class="answer-list">
                                <li>
                                    <span class="width20">A</span>
                                    <span class="width70"><el-input v-model="answerA" placeholder="选项内容1"></el-input></span>
                                    <span class="width30">(1%{{scale}})</span>
                                </li>
                                <li>
                                    <span class="width20">B</span>
                                    <span class="width70"><el-input v-model="answerB" placeholder="选项内容2"></el-input></span>
                                    <span class="width30">(1%{{scale}})</span>
                                </li>
                                <li>
                                    <span class="width20">C</span>
                                    <span class="width70"><el-input v-model="answerC" placeholder="选项内容3"></el-input></span>
                                    <span class="width30">(1%{{scale}})</span>
                                </li>
                                <li>
                                    <span class="width20">D</span>
                                    <span class="width70"><el-input v-model="answerD" placeholder="选项内容4"></el-input></span>
                                    <span class="width30">(1%{{scale}})</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="button-container">
                        <el-button @click="back">返 回</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="单人统计" name="second">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable" class="mar-top20" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            prop="name" align="center"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="time" align="center"
                            label="提交时间">
                    </el-table-column>
                    <el-table-column
                            label="操作" align="center">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="detailFun(scope.row.id)">详情</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20,50]"
                            :page-size="10"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo"
                    >
                    </el-pagination>

                </div>
                <div class="button-container">
                    <el-button @click="back">返 回</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- TODO 个人详情需求不明确 -->
        <el-dialog title="个人详情" :visible.sync="detailIsShow" @close='detailIsShow = false'>
            <div class="dialog-container">
                <div class="member-tab">
                    <h3>学员信息：</h3>
                    <span v-for="index in memberInfo" :key="index">{{memberInfo}}</span>
                </div>
                <div class="question-number">Q1：</div>
                <div class="mid-question">
                    <div class="question-title">
                        <el-input v-model="questionTitle" placeholder="请输入标题"></el-input>
                    </div>
                    <ul class="answer-list mar-bottom20">
                        <li>
                            <span class="width20">A</span>
                            <span class="width70"><el-input v-model="answerA" placeholder="请输入选项内容"></el-input></span>
                        </li>
                        <li>
                            <span class="width20">B</span>
                            <span class="width70"><el-input v-model="answerB" placeholder="请输入选项内容"></el-input></span>
                        </li>
                        <li>
                            <span class="width20">C</span>
                            <span class="width70"><el-input v-model="answerC" placeholder="请输入选项内容"></el-input></span>
                        </li>
                        <li>
                            <span class="width20">D</span>
                            <span class="width70"><el-input v-model="answerD" placeholder="请输入选项内容"></el-input></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="clearfix"></div>
            <div slot="footer" class="dialog-footer bot-button">
                <el-button @click="detailIsShow = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
        getMapNameData,
    } from '@/assets/js/api';

    import '@/assets/js/dateFormat';

    export default {
        name: "AssessmentStatDetail",
        components: {
        },
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数
                activeName: 'first', //标签
                number: '', //数量
                scale: '', //比例
                questionTitle: '', //题目名称
                answerA: '', //答案A
                answerB: '', //答案B
                answerC: '', //答案C
                answerD: '', //答案D
                rightKey: '', //正确答案
                accuracy: '', //正确率
                multipleSelection: [], // 表格已经选择的内容
                createTime: ['', ''], //创建时间
                pageNo: 1, // 第几页
                pageSize: 10, // 每页几条
                itemList: '',
                memberInfo: '', //学员信息
                questionList:{},
                // 字典项
                dictData: {},
                dictMap: {},
                detailIsShow: false, //个人详情弹窗是否显示

            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            this.getList(1,10);
        },
        methods: {
            loadPreData() {

                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                    });
                getDictionariesNameData().then(res => { //获取全部数据字典名称
                    this.dictionariesNameData = res;

                });
                getMapNameData()
                    .then(res => {
                        this.knowMap = res;
                    })
            },

            getList(){ // 获取列表
                axiosPost('/emap/mapCountList',{
                    name: this.name, //姓名
                    time: this.time, //提交时间
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },

            handleClick(tab, event) {
                console.log(tab, event);
            },

            handleSelectionChange(val) { // 选择用户角色表格
                this.multipleSelection = val;
            },
            handleSizeChange(res){ // 每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList();
            },
            handleCurrentChange(res){ // 第几页
                this.pageNo = res;
                this.getList();
            },
            back() {
                this.$router.go(-1);//返回
            },
            detailFun() { // 新增数据
                this.detailIsShow = true;
            },
        }
    }

</script>

<style scoped>
    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }
    .mar-top20 {
        margin-top:20px;
    }
    .export-results {
        clear:both;
        padding:10px 0 20px 0;
    }
    .top-table {
        background-color:#f8f8f8;
        border-radius:6px;
        padding:10px 0;
        text-align: center;
        margin-bottom:20px;
    }
    .top-table span {
        margin-right:40px;
    }
    .question-number {
        float:left;
        width:3%;
        font-size:15px;
        line-height:40px;
        font-weight:bold;
    }
    .mid-question {
        float:left;
        width:97%;
    }
    .question-title {
        padding:0 10.8% 10px 2%;
        color:#409EFF;
    }
    .answer-list {
        width:100%;
        clear:both;
    }
    .answer-list li {
        display:block;
        clear:both;
        padding-top:10px;
    }
    .answer-list li span {
        font-size:14px;
        line-height:40px;
        padding-right:10px;
    }
    .width20 {
        float:left;
        width:2%;
    }
    .width70 {
        float:left;
        width:88%;
    }
    .width30 {
        float:left;
        width:10%;
        text-align: center;
        color:#409EFF;
    }
    .right-key span em {
        color:#ff0000;
        font-style: normal;
        font-weight: normal;
    }
    .subtotal-ul li,.scale-ul li {
        clear:both;
        line-height:4px;
    }
    .button-container {
        margin: 0 auto;
        clear:both;
        padding-top:20px;
        text-align: center;
    }
    .member-tab {
        width:84%;
        border:1px solid #dfdfdf;
        margin:-20px 0 20px 5%;
    }
    .member-tab h3 {
        background:#f8f8f8;
        font-weight:bold;
        padding:10px;
    }
    .member-tab span {
        margin:10px 20px;
        clear:both;
        font-size:14px;
        line-height:30px;
    }
    .dialog-container {
        width:90%;
        margin:0 auto;
        clear:both;
    }
    .bot-button {
        text-align:center;
    }
</style>
