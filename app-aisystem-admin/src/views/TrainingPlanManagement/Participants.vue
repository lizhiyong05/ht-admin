<template><!-- 参加人员  zhiyong.li  -->
    <div class='participants'>
        <div class="participants-btn">
            <el-button size="small" @click="addFun" :disabled="($route.query.isShare === true || $route.query.isShare === 'true') ? true : false" v-if="operationData.includes('30008d6c')">添加人员</el-button>
            <el-button size="small" @click="deleteFun" :disabled="($route.query.isShare === true || $route.query.isShare === 'true') ? true : false" v-if="operationData.includes('639ebbdb')">撤销人员</el-button>
            <el-button size="small" @click="exportFun" class="no-repeat-click2" :disabled="($route.query.isShare === true || $route.query.isShare === 'true') ? true : false" v-if="operationData.includes('3bdf671d')">导出名单</el-button>
        </div>
        <div class="participants-table loading-table">
            <el-table border :data="records" tooltip-effect="dark" style="margin-top: 20px;width: 100%" @selection-change="handleSelectionChange" size="mini">
                <el-table-column type="selection" align="center" width="40"></el-table-column>
                <el-table-column prop="number" label="学员编号" ></el-table-column>
                <el-table-column  prop="userName" label="学员姓名"></el-table-column>
                <el-table-column  prop="jobNo" label="学员工号"></el-table-column>
                <el-table-column prop="mobile" label="联系方式"></el-table-column>
                <el-table-column prop="nativePlace" label="地址"></el-table-column>
                <el-table-column prop="onJob" label="状态"></el-table-column>
                <el-table-column prop="area" label="区域"></el-table-column>
                <el-table-column prop="line" label="所属产线"></el-table-column>
                <el-table-column prop="item" label="所属项目"></el-table-column>
                <el-table-column prop="position" label="岗位"></el-table-column>
                <el-table-column prop="userRank" label="职级"></el-table-column>
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
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要撤销吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click4">确定</el-button>
            </div>
        </el-dialog>
        <!-- 添加人员 -->
        <el-dialog title="添加人员" :visible.sync="addIsShow" class="need-header">
            <div class="dialog-container add-search">
                <el-form :inline="true" class="demo-form-inline" label-width="100px">
                    <el-form-item label="姓名" size="small">
                        <el-input v-model="studentSearchData.userName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" size="small">
                        <el-input v-model="studentSearchData.idNo" placeholder="请输入身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item label="区域" size="small">
                        <el-select v-model="studentSearchData.area" placeholder="请选择区域" ref="elSelect1">
                            <el-option v-for="(item,ind) in dictionariesAllData['area']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产线/项目" size="small">
                        <treeselect v-model="studentSearchData.knowId"
                                    :options="knowLineAllData"
                                    placeholder="请选择产线/项目"
                                    @open="opens"
                                    noResultsText="未找到，请重新输入"
                                    :normalizer="normalizer"
                        />
                    </el-form-item>
                    <el-form-item label="组织机构" size="small">
                        <treeselect v-model="studentSearchData.orgId"
                                    :options="orgData"
                                    @open="opens"
                                    placeholder="请选择组织机构"
                                    noResultsText="未找到，请重新输入"
                        />
                    </el-form-item>
                    <el-form-item label="期数" size="small">
                        <el-input v-model="studentSearchData.batchNo" placeholder="请输入期数"></el-input>
                    </el-form-item>
                    <el-form-item label="班次" size="small">
                        <el-input v-model="studentSearchData.classNo" placeholder="请输入班次"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位" size="small">
                        <el-select v-model="studentSearchData.position" placeholder="请选择岗位" ref="elSelect2">
                            <el-option v-for="(item,ind) in dictionariesAllData['position']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职级" size="small">
                        <el-select v-model="studentSearchData.userRank" placeholder="请选择职级" ref="elSelect3">
                            <el-option v-for="(item,ind) in dictionariesAllData['userRank']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报道日期" size="small">
                        <el-date-picker
                                v-model="studentSearchData.registDate"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="button-container">
                    <el-button type="primary" @click="studentSearchFun" class="el-btn-min-100 no-repeat-click3" size="small">查询</el-button>
                    <el-button @click="studentResetFun" class="el-btn-min-100" size="small">重置</el-button>
                </div>
                <div class="loading-table2">
                    <el-table border :data="studentRecords" tooltip-effect="dark" style="margin-top: 20px;width: 100%" @selection-change="handleSelectionChangeStudent" size="mini">
                        <el-table-column type="selection" width="40" align="center" fixed="left"></el-table-column>
                        <el-table-column prop="number" label="学员编号" fixed="left" min-width="150"></el-table-column>
                        <el-table-column prop="userName" label="姓名" fixed="left"></el-table-column>
                        <el-table-column prop="jobNo" label="学员工号" min-width="160"></el-table-column>
                        <el-table-column prop="registDate" label="报到日期" min-width="160"></el-table-column>
                        <el-table-column prop="batchNo" label="期数" min-width="100"></el-table-column>
                        <el-table-column prop="classNo" label="班次" min-width="100"></el-table-column>
                        <el-table-column label="状态" min-width="100">
                            <template slot-scope="scope">
                                {{scope.row.status ? dictionariesNameData[scope.row.onJob] : ''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="区域" min-width="100">
                            <template slot-scope="scope">
                                {{scope.row.status ? dictionariesNameData[scope.row.area] : ''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="产线" min-width="120">
                            <template slot-scope="scope">
                                {{ (scope.row.knowId && Object.keys(mapNameData).length > 0) ? mapNameData[mapNameData[scope.row.knowId].path.split('/')[1]].knowName : ''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="项目" min-width="120">
                            <template slot-scope="scope">
                                {{ (scope.row.knowId && Object.keys(mapNameData).length > 0) ? mapNameData[mapNameData[scope.row.knowId].path.split('/')[2]].knowName : ''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="岗位" min-width="100">
                            <template slot-scope="scope">
                                {{scope.row.status ? dictionariesNameData[scope.row.position] : ''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="职级" min-width="100">
                            <template slot-scope="scope">
                                {{scope.row.status ? dictionariesNameData[scope.row.userRank] : ''}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <span>一共 <span class="total">{{recordsTotalStudent}}</span> 条数据</span>
                        <el-pagination
                                @size-change="handleSizeChangeStudent"
                                @current-change="handleCurrentChangeStudent"
                                :page-sizes="[5, 10, 15, 20,50]"
                                :page-size="5"
                                layout="sizes, prev, pager, next, jumper"
                                :total="recordsTotalStudent"
                                :current-page.sync="studentPageNo"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="addSubmit" class="el-btn-min-100 no-repeat-click" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { axiosPost,getDictionariesNameData,getKnowLineAllData,getDictionariesAllData,getMapNameData,getOrgAllData,getOperationData } from "@/assets/js/api";

export default {
    name: 'Participants',
    components:{
        Treeselect
    },
    data(){
        return {
            multipleSelection: [], // 选择后的表格
            records: [], // 表格数据
            recordsTotal: 0, // 总数据
            pageNo: 1, // 第几页
            pageSize: 5, // 每页几条
            deleteIsShow: false, // 删除
            addIsShow: false, // 新增
            studentSearchData:{ // 搜索数据
                userName: '', // 姓名
                idNo: '', // 身份证号码
                area: '', // 区域
                knowId: null, // 产线/项目
                orgId: null, // 组织机构
                batchNo: '', // 期数
                classNo: '', // 班次
                position: '', // 岗位
                userRank: '', // 职级
                registDate: ['',''] // 报道日期
            },
            orgData: [], // 机构数据
            studentRecords: [], // 学员数据
            recordsTotalStudent: 0, // 学员总数据
            studentPageNo: 1, // 页数
            studentPageSize: 5, // 条数
            dictionariesNameData: {}, // 字典
            dictionariesAllData:{}, // 字典
            multipleStudent: [], // 学员选择的数据
            knowLineAllData: [], // 产线项目
            mapNameData: {}, // 知识体系
            operationData: [], // 操作权限
        }
    },
    created(){
        getDictionariesNameData().then(res => {
            this.dictionariesNameData = res;
        });
        getDictionariesAllData().then(res => {
            this.dictionariesAllData = res;
        });
        getKnowLineAllData().then(res => {
            this.knowLineAllData = res;
        });
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getOrgAllData().then(res => { // 机构字典项数据
            this.orgData = res;
        });
        getOperationData('培训计划管理').then(res => {
            this.operationData = res;
        });
        this.getList();
    },
    methods:{
        getList(){ // 获取数据
            axiosPost('/educateMgr/plan/student/list',{
                planId: this.$route.query.id,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                loading: '.loading-table'
            })
                .then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                })
        },
        studentList(){ // 获取
            axiosPost('/resourceMgr/student/list',{
                cascadeOrg: '级联',
                userName: this.studentSearchData.userName,
                idNo: this.studentSearchData.idNo,
                area: this.studentSearchData.area,
                knowId: this.studentSearchData.knowId,
                orgId: this.studentSearchData.orgId,
                batchNo: this.studentSearchData.batchNo,
                classNo: this.studentSearchData.classNo,
                position: this.studentSearchData.position,
                userRank: this.studentSearchData.userRank,
                registDateStart: this.studentSearchData.registDate ? this.studentSearchData.registDate[0] : '',
                registDateEnd: this.studentSearchData.registDate ? this.studentSearchData.registDate[1] : '',
                pageNo: this.studentPageNo, // 第几页
                pageSize: this.studentPageSize, // 每页的数量
                loading: '.loading-table2',
                noRepeat: '.no-repeat-click3',
                permitAndObJob: '任意值'
            }).then(res => {
                this.studentRecords = res.data.records;
                this.recordsTotalStudent = res.data.total;
            });
        },
        handleSelectionChange(res){ // 表格选择
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
                return item.userId;
            });
            axiosPost('/educateMgr/plan/student/remove',{
                planId: this.$route.query.id,
                ids: idArr,
                noRepeat: '.no-repeat-click4'
            })
                .then(() => {
                    this.deleteIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                })
        },
        normalizer(node) { // 知识体系树
            return {
                id: node.id,
                label: node.knowName,
                children: node.children,
            }
        },
        addFun(){ // 添加人员
            this.addIsShow = true;
            this.studentPageNo = 1;
            this.studentList();
        },
        addSubmit(){ // 添加人员 提交
            if(this.multipleStudent.length <= 0){
                this.$message({message:'请选择数据后再操作',type: 'warning'});
                return false;
            }
            this.addIsShow = false;
            let students = this.multipleStudent.map((item) => {
                return {
                    studentId: item.userId,
                    number: item.userAccount,
                    studentName: item.userName,
                }
            });
            axiosPost('/educateMgr/plan/student/add',{
                planId: this.$route.query.id,
                students: students,
                noRepeat: '.no-repeat-click'
            })
                .then(() => {
                    this.$message({message: '添加成功',type: 'success'});
                    this.getList();
                })
        },
        studentSearchFun(){ // 学员查询
            this.studentPageNo = 1;
            this.studentList();
        },
        studentResetFun(){ // 学员重置
            this.studentSearchData = { // 搜索数据
                userName: '', // 姓名
                idNo: '', // 身份证号码
                area: '', // 区域
                knowId: null, // 产线/项目
                orgId: null, // 产线/项目
                batchNo: '', // 期数
                classNo: '', // 班次
                position: '', // 岗位
                userRank: '', // 职级
                registDate: ['',''] // 报道日期
            }
        },
        handleSizeChangeStudent(res){ // 更改条数
            this.studentPageNo = 1;
            this.studentPageSize = res;
            this.studentList();
        },
        handleCurrentChangeStudent(res){ // 更改页数
            this.studentPageNo = res;
            this.studentList();
        },
        handleSelectionChangeStudent(res){  // 选择数据
            this.multipleStudent = res;
        },
        exportFun(){ // 导出名单
            axiosPost('/educateMgr/plan/student/export',{
                planId: this.$route.query.id,
                noRepeat: '.no-repeat-click2'
            })
                .then((res) => {
                    window.location.href = res.data;
                })
        },
        opens(){ // vue-selectTree打开时隐藏el-select
            this.$refs.elSelect1.blur();
            this.$refs.elSelect2.blur();
            this.$refs.elSelect3.blur();
        },
    }
}
</script>
<style scoped>
    .vue-treeselect{
        width: 160px;
        float: left;
    }
    .add-search .el-input,.add-search .el-select{
        width: 160px;
    }
</style>

