<template><!-- 地图课程考试统计详情 shuling.xiang-->
    <div class="TestStatDetail">
        <h2 class="title-h2">地图-课程-考试统计详情</h2>
        <el-tabs v-model="activeName" type="card" class="mar-top20" @tab-click="handleClick">
            <el-tab-pane label="XXX试卷名称" name="first">
                <h3 class="paper-title">XXX试卷名称</h3>
                <div class="right-stat">
                    <h4>小计</h4>
                    <h4>比例</h4>
                </div>
                <div class="clearfix"></div>
<!--                <div v-for="index in questionList" :key="index">-->
                <div>
                    <div class="question-number">Q1：</div>
                    <div class="mid-question">
                        <div class="question-title">
                            <el-input v-model="questionTitle" placeholder="请输入标题"></el-input>
                        </div>
                        <ul class="answer-list">
                            <li>
                                <span class="width20">A</span>
                                <span class="width70"><el-input v-model="answerA" placeholder="请输入选项内容"></el-input></span>
                                <span class="width30">
                                    <em>11{{number}}</em>
                                    <em>1%{{scale}}</em>
                                </span>
                            </li>
                            <li>
                                <span class="width20">B</span>
                                <span class="width70"><el-input v-model="answerB" placeholder="请输入选项内容"></el-input></span>
                                <span class="width30">
                                    <em>11{{number}}</em>
                                    <em>1%{{scale}}</em>
                                </span>
                            </li>
                            <li>
                                <span class="width20">C</span>
                                <span class="width70"><el-input v-model="answerC" placeholder="请输入选项内容"></el-input></span>
                                <span class="width30">
                                    <em>11{{number}}</em>
                                    <em>1%{{scale}}</em>
                                </span>
                            </li>
                            <li>
                                <span class="width20">D</span>
                                <span class="width70"><el-input v-model="answerD" placeholder="请输入选项内容"></el-input></span>
                                <span class="width30">
                                    <em>11{{number}}</em>
                                    <em>1%{{scale}}</em>
                                </span>
                            </li>
                        </ul>
                        <div class="right-key">
                            <span>正确答案：<em>ABC{{rightKey}}</em></span>
                            <span>正确率：<em>100%{{accuracy}}</em></span>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="人员成绩详情" name="second">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable" class="mar-top20" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            prop="name" align="center"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="score" align="center"
                            label="成绩（分）">
                    </el-table-column>
                    <el-table-column
                            prop="ranking" align="center"
                            label="排名">
                    </el-table-column>
                    <el-table-column
                            prop="status" align="center"
                            label="状态">
                    </el-table-column>
                    <el-table-column
                            prop="useTime" align="center"
                            label="用时">
                    </el-table-column>
                    <el-table-column
                            prop="paperTime" align="center"
                            label="交卷时间">
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
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {
        axiosPost,
    } from '@/assets/js/api';

    import '@/assets/js/dateFormat';

    export default {
        name: "TestStatDetail",
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
                // 字典项
                dictData: {},
                dictMap: {},

            }
        },
        created() { //创建完成 生命周期
            this.getList(1,10);
        },
        methods: {

            getList(){ // 获取列表
                axiosPost('/emap/mapCountList',{
                    name: this.name, //姓名
                    score: this.score, //成绩
                    ranking: this.ranking, //排名
                    status: this.status, //状态
                    useTime: this.useTime, //用时
                    paperTime: this.paperTime, //交卷时间
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
    .paper-title {
        font-size:24px;
        font-weight:bold;
        text-align:center;
        padding:15px 0;
    }
    .question-number {
        float:left;
        width:3%;
        font-size:15px;
        line-height:40px;
        /*color:#409EFF;*/
        font-weight:bold;
    }
    .mid-question {
        float:left;
        width:97%;
    }
    .question-title {
        padding:0 20.8% 10px 2%;
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
        width:78%;
    }
    .width30 {
        float:left;
        width:20%;
    }
    .width30 em {
        float:left;
        width:50%;
        text-align:center;
        color:#409EFF;
    }
    .right-key {
        margin:0 auto;
        clear:both;
        padding:20px 0;
        font-size:15px;
    }
    .right-key span {
        padding-right:40px;
        font-weight:bold;
    }
    .right-key span em {
        color:#ff0000;
        font-style: normal;
        font-weight: normal;
    }
    .right-stat {
        float:right;
        width:20%;
    }
    .right-stat h4 {
        float:left;
        width:50%;
        text-align: center;
    }
    .subtotal-ul li,.scale-ul li {
        clear:both;
        line-height:4px;
    }
</style>
