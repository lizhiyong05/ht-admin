<template><!-- 培训计划管理  zhiyong.li  -->
    <div class="training-plan-management">
        <h2 class="title-h2">培训计划管理</h2>
        <div class="search-container">
            <el-form :inline="true" :model="searchData" class="demo-form-inline" label-width="100px">
                <el-form-item label="计划名称" size="small">
                    <el-input v-model="searchData.name" placeholder="请输入计划名称"></el-input>
                </el-form-item>
                <el-form-item label="创建人" size="small">
                    <el-input v-model="searchData.createUser" placeholder="请输入创建人"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" size="small">
                    <el-date-picker
                            v-model="searchData.createTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button type="primary" @click="searchList" class="el-btn-min-100 no-repeat-click2" size="small">查询</el-button>
                <el-button @click="resetSearchCondition" class="el-btn-min-100" size="small">重置</el-button>
            </div>
        </div>
        <div class="train-list">
            <div class="train-button">
                <router-link to='/essential-information' style="margin-right: 10px;" v-if="operationData.includes('0695a7cc')"><el-button size="small">新增</el-button></router-link>
                <el-button size="small" @click="deleteFun" v-if="operationData.includes('bccf7dd3')">删除</el-button>
                <el-button size="small" @click="shareFun" v-if="operationData.includes('bc150355')">共享</el-button>
                <el-button size="small" @click="coordinationFun" v-if="operationData.includes('26ac04c4')">协同</el-button>
            </div>
            <div class="train-table loading-table">
                <el-table border :data="records" tooltip-effect="dark" ref="trainTable" style="width: 100%" @selection-change="handleSelectionChange" size="mini">
                    <el-table-column
                            type="selection" align="center"
                            width="40">
                    </el-table-column>
                    <el-table-column align="center" label="计划编号">
                        <template slot-scope="scope">
                            <router-link tag="span" :to="{path: '/essential-information',query:{id: scope.row.id,isShare: scope.row.type === '共享' ? true : false}}">{{scope.row.code}}</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="计划名称">
                    </el-table-column>
                    <el-table-column
                            prop="lineName" 
                            label="所属产线">
                    </el-table-column>
                    <el-table-column
                            prop="projectName"
                            label="所属项目">
                    </el-table-column>
                    <el-table-column
                            prop="createUser"
                            label="创建人">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <router-link tag="span" :to="{path: '/essential-information',query:{id: scope.row.id,copy:'copy'}}">复制新增</router-link>
                        </template>
                    </el-table-column>
                </el-table>
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
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 共享选择人员 -->
        <PersonnelSelection v-if="selectConfigIsShow" :selectConfigIsShow="selectConfigIsShow" :types="types" cascadeOrg="cascadeOrg" @listenEventData="getDataFun" @listenEventClose="getCloseFun"></PersonnelSelection>
        <!--协同选择人员-->
        <PersonnelSelection v-if="selectConfigIsShow2" :selectConfigIsShow="selectConfigIsShow2" :types="types" cascadeOrg="cascadeOrg" @listenEventData="getDataFun2" @listenEventClose="getCloseFun2"></PersonnelSelection>
    </div>
</template>
<script>
    import PersonnelSelection from '@/components/PersonnelSelection'
    import {axiosPost,getOperationData} from "@/assets/js/api";
    export default {
        name: 'TrainingPlanManagement',
        components:{
            PersonnelSelection
        },
        data(){
            return {
                selectConfigIsShow: false,
                selectConfigIsShow2: false,
                types: ["TEACHER","LECTURER"], // 人员类型
                searchData: { // 搜索数据
                    name: '',
                    createUser: '',
                    createTime: ['',''],
                    startTime: '',
                    endTime: ''
                },
                records: [], // 表格数据
                recordsTotal: 0, // 总数居
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                deleteIsShow: false, // 删除
                multipleSelection:[], // 表格选择后的数据
                operationData: [], // 操作权限
            }
        },
        created(){
            this.getList();
            getOperationData('培训计划管理').then(res => {
                this.operationData = res;
            });
        },
        methods:{
            getList(){ // 获取列表
                axiosPost('/educateMgr/plan/list',{
                    name: this.searchData.name,
                    createUser: this.searchData.createUser,
                    startTime: this.searchData.createTime ? this.searchData.createTime[0] : '',
                    endTime: this.searchData.createTime ? this.searchData.createTime[1] : '',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    loading: '.loading-table',
                    noRepeat: '.no-repeat-click2'
                })
                    .then((res) => {
                        this.records = res.data.records;
                        this.recordsTotal = res.data.total;
                    })
            },
            searchList(){ // 搜索条件
                if(this.searchData.createTime){
                    this.searchData.startTime = this.searchData.createTime[0];
                    this.searchData.endTime = this.searchData.createTime[1];
                }
                this.pageNo = 1;
                this.getList();
            },
            resetSearchCondition(){ // 清空搜索条件
                this.searchData = {};
            },
            handleSelectionChange(res){ // 表格选择更改
                this.multipleSelection = res;
            },
            handleSizeChange(res){ // 更改条数
                this.pageNo = 1;
                this.pageSize = res;
                this.getList();
            },
            handleCurrentChange(res){ // 更改页数
                this.pageNo = res;
                this.getList();
            },
            deleteFun(){ // 删除
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.deleteIsShow = true;
            },
            deleteSubmit(){ // 删除 提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.id;
                });
                axiosPost('/educateMgr/plan/remove',{
                    strs: idArr,
                    noRepeat: '.no-repeat-click'
                })
                    .then(() => {
                        this.deleteIsShow = false;
                        this.pageNo = 1;
                        this.getList();
                    })
            },
            shareFun(){ // 共享
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.selectConfigIsShow = true;
            },
            coordinationFun(){ // 协同
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.selectConfigIsShow2 = true;
            },
            getDataFun(res){ // 共享获取数据
                let lecturers = res.map(item => {
                   return {
                       lecturerId: item.userId,
                       lecturerName: item.userName
                   }
                });
                let planIds = this.multipleSelection.map((item) => {
                    return item.id;
                });
                axiosPost('/educateMgr/plan/share',{
                    type: '共享',
                    lecturers: lecturers,
                    planIds: planIds
                })
                    .then(() => {
                        this.$message({message: '共享成功',type: 'success'});
                    })
            },
            getDataFun2(res){ // 协同获取数据
                let lecturers = res.map(item => {
                    return {
                        lecturerId: item.userId,
                        lecturerName: item.userName
                    }
                });
                let planIds = this.multipleSelection.map((item) => {
                    return item.id;
                });
                axiosPost('/educateMgr/plan/share',{
                    type: '协同',
                    lecturers: lecturers,
                    planIds: planIds
                })
                    .then(() => {
                        this.$message({message: '协同成功',type: 'success'});
                    })
            },
            getCloseFun(){ // 关闭共享
                this.selectConfigIsShow = false;
            },
            getCloseFun2(){ // 关闭协同
                this.selectConfigIsShow2 = false;
            }
    }
}
</script>
<style scoped>
    .train-button{
        margin-bottom: 10px;
    }
</style>

