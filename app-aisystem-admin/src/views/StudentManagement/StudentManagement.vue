<template><!-- 学员信息管理  zhiyong.li  -->
    <div class="student-management">
        <h2 class="title-h2">学员信息管理</h2>
        <div class="search-container">
            <el-form :inline="true" class="demo-form-inline" label-width="100px">
                <el-form-item label="姓名" size="mini">
                    <el-input v-model="searchData.userName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" size="mini">
                    <el-input v-model="searchData.idNo" placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="区域" size="mini">
                    <el-select v-model="searchData.area" placeholder="请选择区域">
                        <el-option v-for="(item,ind) in dictionariesAllData['area']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产线/项目" size="mini">
                    <treeselect v-model="searchData.knowId"
                                :options="knowLineAllData"
                                placeholder="请选择产线/项目"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                    />
                </el-form-item>
                <el-form-item label="组织机构" size="mini">
                    <treeselect v-model="searchData.orgId"
                                :options="orgData"
                                noResultsText="未找到，请重新输入"
                                placeholder="请选择组织机构"
                    />
                </el-form-item>
                <el-form-item label="期数" size="mini">
                    <el-input v-model="searchData.batchNo" placeholder="请输入期数"></el-input>
                </el-form-item>
                <el-form-item label="班次" size="mini">
                    <el-input v-model="searchData.classNo" placeholder="请输入班次"></el-input>
                </el-form-item>
                <el-form-item label="岗位" size="mini">
                    <el-select v-model="searchData.position" placeholder="请选择岗位">
                        <el-option v-for="(item,ind) in dictionariesAllData['position']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职级" size="mini">
                    <el-select v-model="searchData.userRank" placeholder="请选择职级">
                        <el-option v-for="(item,ind) in dictionariesAllData['userRank']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报道日期" size="mini">
                    <el-date-picker
                            v-model="searchData.registDate"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button type="primary" @click="searchList" class="el-btn-min-100 no-repeat-click" size="mini">查询</el-button>
                <el-button @click="resetSearch" class="el-btn-min-100" size="mini">重置</el-button>
            </div>
            <div class="curriculum-button">
                <el-button size="small" @click="addDataFun" v-if="operationData.includes('0986fa72')">新增</el-button>
                <el-button size="small" @click="deleteDataFun" v-if="operationData.includes('fb7f5e12')" class="upload-pre">删除</el-button>
                <el-upload
                        v-if="operationData.includes('1bb102dc')"
                        action=""
                        :show-file-list="false"
                        :disabled="uploadLoading"
                        :before-upload="beforeAvatarUpload"
                        :http-request="fileUploadFun"
                >
                    <el-button size="small" :loading="uploadLoading" >导入</el-button>
                </el-upload>
                <el-button size="small" @click="downloadTemplate" v-if="operationData.includes('7dfbe76b')" class="no-repeat-click4">导入模板下载</el-button>
                <el-button size="small" @click="quitDataFun" v-if="operationData.includes('25003465')">离职</el-button>
                <el-button size="small" @click="entryDataFun" v-if="operationData.includes('bfe59c64')">入职</el-button>
            </div>
        </div>
        <div class="loading-table">
            <el-table border :data="records" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" ref="studentList">
                <el-table-column type="selection" width="40" align="center" fixed="left"></el-table-column>
                <el-table-column label="学员编号" fixed="left" min-width="150" align="center">
                    <template slot-scope="scope">
                        <router-link :to="{path: '/student-detail',query:{userId:scope.row.userId}}" tag="span">{{scope.row.number}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="姓名" fixed="left" align="center"></el-table-column>
                <el-table-column prop="jobNo" label="学员工号" min-width="160" align="center"></el-table-column>
                <el-table-column prop="registDate" label="报到日期" min-width="160" align="center"></el-table-column>
                <el-table-column prop="batchNo" label="期数" min-width="100" align="center"></el-table-column>
                <el-table-column prop="classNo" label="班次" min-width="100" align="center"></el-table-column>
                <el-table-column label="状态" min-width="100" align="center">
                    <template slot-scope="scope">
                        {{scope.row.onJob ? dictionariesNameData[scope.row.onJob] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="区域" min-width="100" align="center">
                    <template slot-scope="scope">
                        {{scope.row.area ? dictionariesNameData[scope.row.area] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="产线" min-width="120" align="center">
                    <template slot-scope="scope">
                        {{ (scope.row.knowId && Object.keys(mapNameData).length > 0) ? mapNameData[mapNameData[scope.row.knowId].path.split('/')[1]].knowName : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="项目" min-width="120" align="center">
                    <template slot-scope="scope">
                        {{ (scope.row.knowId && Object.keys(mapNameData).length > 0) ? mapNameData[mapNameData[scope.row.knowId].path.split('/')[2]].knowName : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="岗位" min-width="100" align="center">
                    <template slot-scope="scope">
                        {{scope.row.position ? dictionariesNameData[scope.row.position] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="职级" min-width="100" align="center">
                    <template slot-scope="scope">
                        {{scope.row.userRank ? dictionariesNameData[scope.row.userRank] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="100" align="center">
                    <template slot-scope="scope">
                        <span @click="$router.push({name: 'edit-student',query:{userId: scope.row.userId}})" v-if="operationData.includes('eb210868')">编辑</span>
                        <span @click="deleteSingleFun(scope.row)" v-if="operationData.includes('fb7f5e12')">删除</span>
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
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" :show-close="false" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click1" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 离职 -->
        <el-dialog :visible.sync="quitIsShow" :show-close="false" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要离职吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="quitIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="quitSubmit" class="el-btn-min-100 no-repeat-click2" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 入职 -->
        <el-dialog :visible.sync="entryIsShow" :show-close="false" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要入职吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="entryIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="entrySubmit" class="el-btn-min-100 no-repeat-click3" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { axiosPost,getDictionariesAllData,getDictionariesNameData,getKnowLineAllData,getOrgAllData,getMapNameData,getOperationData,fileUpload } from "@/assets/js/api";

    export default {
        name: "StudentManagement",
        components:{
            Treeselect
        },
        data(){
            return {
                dictionariesAllData: [], // 基本类型字典项数据
                dictionariesNameData: '', // 获取基本类型字典项数据的某个值
                knowLineAllData: [], // 产线项目数据
                searchData:{ // 搜索数据
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
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                records: [], // 人员数据
                recordsTotal: 0, // 总条数
                multipleSelection: [], // 已选择人员数据
                orgData: [], // 机构数据
                mapNameData: '', // 获取知识体系字典项数据的某个值
                deleteIsShow: false, // 删除数据弹窗是否显示
                quitIsShow: false, //  离职数据弹窗是否显示
                entryIsShow: false, //  入职数据弹窗是否显示
                operationData: [], // 获取本页面操作权限
                uploadLoading: false, // 是否在上传状态
            }
        },
        created(){
            getDictionariesAllData().then(res => { // 基本类型字典项数据
                this.dictionariesAllData = res;
            });
            getDictionariesNameData().then(res => {  // 获取基本类型字典项数据的某个值
                this.dictionariesNameData = res;
            });
            getKnowLineAllData().then(res => { // 知识体系字典项数据(仅获取产线项目)
                this.knowLineAllData = res;
            });
            getOrgAllData().then(res => { // 机构字典项数据
                this.orgData = res;
            });
            getMapNameData().then(res => { // 获取知识体系字典项数据的某个值
                this.mapNameData = res;
            });
            getOperationData("学员信息管理")
                .then(res => {
                    this.operationData = res;
                });
            this.getList();
        },
        methods:{
            getList(){
                axiosPost('/resourceMgr/student/list',{
                    cascadeOrg: '级联',
                    userName: this.searchData.userName,
                    idNo: this.searchData.idNo,
                    area: this.searchData.area,
                    knowId: this.searchData.knowId,
                    orgId: this.searchData.orgId,
                    batchNo: this.searchData.batchNo,
                    classNo: this.searchData.classNo,
                    position: this.searchData.position,
                    userRank: this.searchData.userRank,
                    registDateStart: this.searchData.registDate ? this.searchData.registDate[0] : '',
                    registDateEnd: this.searchData.registDate ? this.searchData.registDate[1] : '',
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize, // 每页的数量
                    loading: '.loading-table',
                    noRepeat: '.no-repeat-click'
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            searchList(){ // 搜索列表
                this.pageNo = 1;
                this.getList();
            },
            resetSearch(){ // 重置查询条件
                this.searchData = { // 搜索数据
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
                }
            },
            normalizer(node) { // 知识体系树
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },
            handleSelectionChange(val) { // 选择人员
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
            deleteDataFun(){ // 删除 选中项数据
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.deleteIsShow = true;
            },
            deleteSingleFun(res){ // 删除 单条数据
                this.deleteIsShow = true;
                this.$refs.studentList.clearSelection();
                this.$refs.studentList.toggleRowSelection(res,true);
            },
            deleteSubmit(){ // 删除 提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.userId;
                });
                axiosPost('/resourceMgr/student/delete',{
                    userIds: idArr,
                    noRepeat: '.no-repeat-click1'
                }).then(() => {
                    this.deleteIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                });
            },
            addDataFun(){  // 新增
                this.$router.push({path: '/add-student'});
            },
            quitDataFun(){ // 离职
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.quitIsShow = true;
            },
            entryDataFun(){ // 入职
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.entryIsShow = true;
            },
            quitSubmit(){ // 离职提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.userId;
                });
                axiosPost('/resourceMgr/student/leave',{
                    userIds: idArr,
                    noRepeat: '.no-repeat-click2'
                }).then(() => {
                    this.quitIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                });
            },
            entrySubmit(){ // 入职提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.userId;
                });
                axiosPost('/resourceMgr/student/entry',{
                    userIds: idArr,
                    noRepeat: '.no-repeat-click3'
                }).then(() => {
                    this.entryIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                });
            },
            beforeAvatarUpload(file){ // 上传前
                let reg = /\.(xlsx)$/;
                if (!reg.test(file.name)) {
                    this.$message({type: 'warning',message:'只能上传xlsx格式的文件!'});
                }
                return reg.test(file.name);
            },
            fileUploadFun(item){ // 上传 提交
                this.uploadLoading = true;
                fileUpload(item)
                    .then((res) => {
                        this.excelUpload(res.data.lastStoreLocation);
                    })
            },
            excelUpload(url){ // 导入
                axiosPost('/resourceMgr/excel/student/import',{
                    importPath: url
                }).then((res) => {
                    this.uploadLoading = false;
                    this.pageNo = 1;
                    this.getList();
                    this.$message({type: 'success',showClose: true,duration: 0,message: res.data,dangerouslyUseHTMLString: true,customClass:'messageMaxHeight'});
                });
            },
            downloadTemplate(){// 导入模板下载
                axiosPost('/resourceMgr/excel/student/template',{
                    noRepeat: '.no-repeat-click4'
                }).then((res) => {
                    window.open(res.data);
                });
            }
        }
    }
</script>

<style scoped>
    .search-container{
        margin-top: 20px;
    }
    .vue-treeselect{
        width: 202px;
        float: left;
    }
    .upload-pre + div{
        display: inline-block;
        margin: 0 10px;
    }
</style>
