<template><!-- 地图课程考试统计 shuling.xiang-->
    <div class="TestStat">
        <h2 class="title-h2">地图-课程-考试统计</h2>
        <div class="map-list">
            <div class="map-table mar-top20">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            prop="paperName" label="考试名称">
                    </el-table-column>
                    <el-table-column
                            prop="examinationNumber" align="center"
                            label="应参考人数">
                    </el-table-column>
                    <el-table-column
                            prop="actualExamination" align="center"
                            label="实际参考人数">
                    </el-table-column>
                    <el-table-column
                            prop="absenceRate" align="center"
                            label="缺考率">
                    </el-table-column>
                    <el-table-column
                            prop="passRate" align="center"
                            label="及格率">
                    </el-table-column>
                    <el-table-column
                            prop="highScore" align="center"
                            label="最高分">
                    </el-table-column>
                    <el-table-column
                            prop="minimumScore" align="center"
                            label="最低分">
                    </el-table-column>
                    <el-table-column
                            prop="average" align="center"
                            label="平均分">
                    </el-table-column>
                    <el-table-column
                            label="操作" align="center">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="postMethodsTest(scope.row.id)">详情</span>
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
            </div>
        </div>
    </div>
</template>

<script>
    import {
        axiosPost,
    } from '@/assets/js/api';

    import '@/assets/js/dateFormat';

    export default {
        name: "TestStat",
        components: {
        },
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数

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
                    paperName: this.paperName, //考试名称
                    examinationNumber: this.examinationNumber, //应参考人数
                    actualExamination: this.actualExamination, //实际参考人数
                    absenceRate: this.absenceRate, //缺考率
                    passRate: this.passRate, //及格率
                    highScore: this.highScore, //最高分
                    minimumScore: this.minimumScore, //最低分
                    average: this.average, //平均分
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
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
            postMethodsTest(res) { //详情页跳转
                this.$router.push({path: '/test-stat-detail', query: {id:res}});
                axiosPost('/emap/mapCountInfo',{ //逐题阅卷请求
                })
                    .then(()=> {
                    })
            },
        }
    }

</script>

<style scoped>
    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .table-operation {
        color: #409EFF;
        margin-left: 5px;
        cursor: pointer;
    }

    .pagination{
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }
    .total{
        font-weight: bold;
    }
    .mar-top20 {
        margin-top:20px;
    }

</style>
