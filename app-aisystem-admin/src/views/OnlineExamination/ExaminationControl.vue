<!--@menu 考试监控 @author dongjie.zhu-->
<template>
    <div class="examinationControl">
        <h2 class="title-h2">考试监控</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="searchData" label-width="100px" >
                <el-form-item label="区域：">
                    <el-select v-model="searchData.area" placeholder="请选择区域">
                        <el-option
                                v-for="item in this.dictionariesAllData['area_all']"
                                :key="item.id"
                                :value="item.id" :disabled="item.disabled"
                                :label="item.dicName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属机构：" v-show="false">
                    <treeselect v-model="searchData.orgId" placeholder="请选择所属机构"
                                :options="orgData"
                                noResultsText="未找到，请重新输入"
                                class="treeInline"
                    />
                </el-form-item>
                <el-form-item label="考试名称：">
                    <el-input v-model="searchData.examName" placeholder="请输入考试名称" ></el-input>
                </el-form-item>
                <el-form-item label="考试日期：" >
                    <el-date-picker
                            v-model="searchData.examDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" class="queryList el-btn-min-100" type="primary" @click="queryList">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="map-list">
            <div class="map-table loading-table">
                <el-table :data="records" size="mini" border style="width: 100%"  >
                    <el-table-column prop="paperType" align="center" label="测评类型" width="120px" >
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.paperType]}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="examName" align="center" label="考试名称"> </el-table-column>
                    <el-table-column prop="startTime" align="center" label="开始时间" > </el-table-column>
                    <el-table-column prop="endTime" align="center" label="结束时间" > </el-table-column>
                    <el-table-column prop="examHour" align="center" label="考试时长(分钟)" width="120px"> </el-table-column>
                    <el-table-column prop="createUser" align="center" label="创建人" v-if="true" width="120px"> </el-table-column>
                    <el-table-column label="操作" align="center" width="120px">
                        <template slot-scope="scope">
                            <span v-if="perLoaded ? PERMISSIONS.MONITOR.KSJK : false" class="table-operation" @click="examMonitorFun(scope.row)" >考试监控</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20, 50]"
                            :page-size="5"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {axiosPost,getDictionariesNameData,getDictionariesAllData,getOrgNameData} from "@/assets/js/api";
    import { PERMISSION } from '@/assets/js/permissions';

    export default {
        name: "ExaminationControl",
        components:{
            Treeselect,
        },

        data() { // 存储数据
            return {
                dictionariesAllData:[], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                orgData: [],  // 所属机构 整体数据
                orgNameData:[],//获取全部机构名称
                searchData: { // 搜索数据
                    area: '',
                    orgId: null,
                    examName: '',
                    examDate: null,
                },
                records: [],//表格数据列表
                recordsTotal: 0, // 表格数据的条数
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条

                PERMISSIONS: {},
                perLoaded: false,
            }
        },
        created() {
            getDictionariesAllData().then(res =>{   //获取全部数据字典
                this.dictionariesAllData = res;
            });
            getDictionariesNameData().then(res => { //获取全部数据字典名称
                this.dictionariesNameData = res;
            });
            getOrgNameData().then(res =>{   //获取全部机构名称
                this.orgNameData = res;
            });
            PERMISSION().then(res =>{   //获取控制权限
                this.PERMISSIONS = res;
                this.perLoaded = true;
            });

            this.getOrgList();
            this.getList(1,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.examName,this.searchData.examDate);
        },
        mounted() { // 挂载后的 生命周期

        },
        methods: {
            getOrgList(){ // 获取所属机构列表
                axiosPost('/systemMgr/org/tree',{}).then(res => {
                    this.orgData = res.data;
                });
            },
            getList(pageNo,pageSize,area,orgId,examName,examDate){ //获取考试监控查询接口
                axiosPost('/examMgr/examMonitor/list',{
                    loading:'.loading-table',
                    noRepeat:'.queryList',
                    areaId: area,
                    orgId: orgId,
                    examName: examName,
                    startDate: examDate !== null ? examDate[0] : '',
                    endDate: examDate !== null ? examDate[1] : '',
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            queryList(){ // 通过查询条件获取列表内容
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.examName,this.searchData.examDate);
            },
            reset(){ // 重置
                this.searchData.area = '';
                this.searchData.orgId = null;
                this.searchData.examName = '';
                this.searchData.examDate = null;
            },
            examMonitorFun(row){    //考试监控详情，打开新路由URL
                this.$router.push({path: '/examination-control-info', query: {id: row.id}});
            },
            handleSizeChange(res) { //每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.examName,this.searchData.examDate);
            },
            handleCurrentChange(res) { //第几页
                this.pageNo = res;
                this.getList(this.pageNo,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.examName,this.searchData.examDate);
            }
        }
    }
</script>

<style scoped lang="scss">
    .table-operation {
        color: #409EFF;
        margin-left: 5px;
        cursor: pointer;
    }
    .el-pagination{
        display: inline-block;
    }
    .pagination{
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }
    .total{
        font-weight: bold;
    }
    .treeInline{
        width: 202px;
        float: left;
    }
    .table-dicFront{
        color: #606266;
        cursor: default;
    }
</style>