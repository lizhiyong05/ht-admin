<template><!-- 试卷阅卷 shuling.xiang-->
    <div class="examination-paper-marking">
        <h2 class="title-h2">试卷阅卷</h2>
        <div class="search-container">
            <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline search-form" label-width="130px">
                <el-form-item label="审阅状态：" >
                    <el-select v-model="searchData.marked" placeholder="请选择">
                        <el-option
                                v-for="item in markedOptions_all"
                                :key="item.dicCode"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="考试状态：" >-->
<!--                    <el-select v-model="searchData.testStatus" placeholder="请选择">-->
<!--                        <el-option-->
<!--                                v-for="item in testStatusOptions_all"-->
<!--                                :key="item.dicCode"-->
<!--                                :label="item.dicName"-->
<!--                                :value="item.dicCode">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
                <el-form-item label="考试名称：">
                    <el-input v-model="searchData.examName" class="wid500" placeholder="请输入考试名称"></el-input>
                </el-form-item>
                <el-form-item label="考试开始时间：">
                    <el-date-picker
                            v-model="searchData.createTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm:ss "
                            value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button class="searchList el-btn-min-100" size="small" type="primary" @click="searchList">查询</el-button>
                <el-button class="el-btn-min-100" size="small" @click="resetSearchCondition">重置</el-button>
            </div>
        </div>

        <div class="map-list">
            <div class="map-table loading-table">
                <el-table border size="mini" :data="records" tooltip-effect="dark" ref="multipleTable"
                          style="margin-top: 20px;width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            label="考试名称" prop="examName">
                    </el-table-column>
                    <el-table-column
                            label="开始时间" prop="startTime">
                    </el-table-column>
                    <el-table-column
                            label="结束时间" prop="endTime">
                    </el-table-column>
                    <el-table-column
                            label="审阅状态" prop="approvalType" width="160" align="center">
                        <template slot-scope="scope">
                            {{scope.row.approvalType == '0' ?'未审阅':(scope.row.approvalType == '1'?'审阅中':'已阅完')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" prop="markingType">
                        <template slot-scope="scope">
                            <!--<span class="table-operation"  v-if="scope.row.markingType=='0' || scope.row.markingType=='1' && perLoaded ? PERMISSIONS.MARKING.BYITEM : false" @click="postMethodsItem(scope.row.id,scope.row.examName,scope.row.paperId,scope.row.paperName)">逐题阅卷</span>-->
                            <!--<span class="table-operation" v-if="(scope.row.markingType=='0' || scope.row.markingType=='2' || scope.row.approvalType=='2') && perLoaded ? PERMISSIONS.MARKING.BYPEOPLE : false" @click="postMethodsPeople(scope.row.id,scope.row.paperId,scope.row.approvalType,scope.row.studentName,scope.row.paperName)">逐人阅卷</span>-->

                            <!--approvalType !=2 ，markingType==0 就显示二种逐题阅卷，逐人阅卷-->
                            <!--approvalType !=2 ，markingType==1 就显示逐题阅卷-->
                            <!--approvalType !=2 ，markingType==2 就显示逐人阅卷-->
                            <!--approvalType =2  逐人阅卷-->
                            <span class="table-operation"  v-if="(perLoaded ? PERMISSIONS.MARKING.BYITEM : false) && (scope.row.approvalType != 2 && (scope.row.markingType == 0 || scope.row.markingType == 1))" @click="postMethodsItem(scope.row.id,scope.row.examName,scope.row.paperId,scope.row.paperName)">逐题阅卷</span>
                            <span class="table-operation" v-if="(perLoaded ? PERMISSIONS.MARKING.BYPEOPLE : false) && (scope.row.approvalType == 2 || (scope.row.approvalType !=2 && (scope.row.markingType == 2 || scope.row.markingType == 0)))" @click="postMethodsPeople(scope.row.id,scope.row.paperId,scope.row.approvalType,scope.row.studentName,scope.row.paperName)">逐人阅卷</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
                <!--page-->
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20,50]"
                            :page-size="5"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo"
                    >
                    </el-pagination>
                </div>
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
        name: "ExaminationPaperMarking",
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数
                examId:'', //考试ID
                searchData: { // 搜索数据
                    examName: '', //考试名称
                    marked: '', //审阅状态
                    // testStatus:'', //考试状态
                    createTime: ['', ''],
                    startTime: '',
                    endTime: ''
                },
                markedOptions_all: [], //审阅状态字典
                // testStatusOptions_all:[], //考试状态字典
                approvalType:'', //审阅状态
                marked:'', //审阅状态
                markingType:'', //阅卷方式
                multipleSelection: [], // 表格选择后的数据
                createTime: ['', ''],
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                studentName:'', //考生姓名
                // 字典项
                dictData: {},
                dictMap: {},

                knowMap: {}, // 知识体系

                // 组织机构
                orgPath: null,
                orgOptions: [{
                    path: 'id',
                    orgName: 'label',
                    children: 'children'
                }],
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,
            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            this.getList(1, this.pageSize); //获取列表
        },
        methods: {
            loadPreData() {
                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                        this.markedOptions_all = res.markedOptions_all;
                        // this.testStatusOptions_all = res.testStatusOptions_all;
                        // console.log(this.dictData)
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
                axiosPost('/examMgr/mark/markExamList', {
                    loading:'.loading-table',
                    noRepeat:'.searchList',
                    examName: this.searchData.examName,
                    approvalType: this.searchData.marked,
                    startTime: this.searchData.createTime !== null ? this.searchData.createTime[0]: '',
                    endTime: this.searchData.createTime !== null ? this.searchData.createTime[1]: '',
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                    this.markingType = res.data.markingType;
                })
            },
            searchList() { // 通过查询条件获取列表
                this.pageNo = 1;
                this.getList();
            },
            resetSearchCondition(){ // 清空搜索条件 重置
                this.searchData = {
                    examName: '', //考试名称
                    marked: '', //审阅状态
                    // testStatus:'', //考试状态
                    createTime: ['', ''],
                    startTime: '',
                    endTime: ''
                };
            },

            postMethodsItem(examId,examName,paperId,paperName) { //逐题阅卷跳转
                this.$router.push({path: '/marking-by-item', query: {examId: examId,examName:examName,paperId:paperId,paperName:paperName}});
                // axiosPost('/examMgr/mark/questionList',{ //逐题阅卷请求
                //     examId: examId,
                //     examName: examName,
                //     paperId: paperId,
                //     paperName: paperName,
                // })
                //     .then(()=> {
                //     })
            },
            postMethodsPeople(examId,paperId,marked,studentName,paperName) { //逐人阅卷跳转
                // debugger;
                this.$router.push({path: '/marking-by-people', query: {examId: examId,paperId:paperId,marked:marked,studentName:studentName,paperName:paperName}});
                // axiosPost('/examMgr/mark/personList',{ //逐题阅卷请求
                //     examId: examId,
                //     paperId: paperId,
                //     marked: marked,
                //     studentName: studentName,
                //     paperName: paperName,
                //     pageNo: this.pageNo, // 第几页
                //     pageSize: this.pageSize // 每页的数量
                // })
                //     .then(()=> {
                //
                //     })
            },

            handleSelectionChange(val) { // 选择批阅考试表格
                this.multipleSelection = val;
            },
            handleSizeChange(res) { // 每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList();
            },
            handleCurrentChange(res) { // 第几页
                this.pageNo = res;
                this.getList();
            },
        }
    }
</script>

<style scoped>
    .pagination {
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }

    .total {
        font-weight: bold;
    }

</style>
