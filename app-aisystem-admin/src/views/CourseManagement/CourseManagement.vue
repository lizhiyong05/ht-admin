<template><!-- 课程管理  zhiyong.li  -->
    <div class="course-management">
        <h2 class="title-h2">课程管理</h2>
        <div class="search-container">
            <el-form :inline="true" :model="searchData" class="demo-form-inline" label-width="100px">
                <el-form-item label="课程分类" size="small">
                    <treeselect   v-model="searchData.knowledgeId"
                                  :options="knowAllData"
                                  placeholder="请选择课程分类"
                                  @open="opens"
                                  noResultsText="未找到，请重新输入"
                                  :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="课程类型" size="small">
                    <el-select v-model="searchData.typeId" placeholder="请选择课程类型" ref="elSelect1" >
                        <el-option v-for="(item,ind) in dictionariesAllData['courseType_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程状态" size="small">
                    <el-select v-model="searchData.enabled" placeholder="请选择课程状态" ref="elSelect2" >
                        <el-option v-for="(item,ind) in dictionariesAllData['status_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学习方式" size="small">
                    <el-select v-model="searchData.studyModeId" placeholder="请选择学习方式" ref="elSelect3">
                        <el-option v-for="(item,ind) in dictionariesAllData['studyWay_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程名称" size="small">
                    <el-input v-model="searchData.name" placeholder="请输入课程名称"></el-input>
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
                <el-button type="primary" @click="searchList" class="el-btn-min-100 no-repeat-click1" size="small">查询</el-button>
                <el-button @click="resetSearchCondition" class="el-btn-min-100" size="small">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" @click="addFun" v-if="operationData.includes('6afc6e9f')">新增</el-button>
            <el-button size="small" @click="startFun" v-if="operationData.includes('6abc8e75')">启用</el-button>
            <el-button size="small" @click="stopFun" v-if="operationData.includes('26d4b06a')">停用</el-button>
            <el-button size="small" @click="deleteFun" v-if="operationData.includes('e172c201')">删除</el-button>
        </div>
        <div class="curriculum-table loading-table">
            <el-table border :data="records" tooltip-effect="dark" ref="courseTable" style="width: 100%" @selection-change="handleSelectionChange" size="mini">
                <el-table-column
                        type="selection" align="center"
                        width="40">
                </el-table-column>
                <el-table-column align="center" label="课程编号">
                    <template slot-scope="scope">
                        <router-link :to="{path: '/detail-course',query:{id:scope.row.id}}" tag="span">{{scope.row.code}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="knowledgePath" align="center"
                        label="课程分类">
                </el-table-column>
                <el-table-column
                        prop="type" align="center"
                        label="课程类型">
                </el-table-column>
                <el-table-column
                        prop="name" align="center"
                        label="课程名称">
                </el-table-column>
                <el-table-column label="课程状态" align="center">
                    <template slot-scope="scope">
                        <em v-if="scope.row.enabled === true">启用</em>
                        <em v-else>停用</em>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="studyMode" align="center"
                        label="学习方式">
                </el-table-column>
                <el-table-column
                        prop="duration" align="center"
                        label="课程时长">
                </el-table-column>
                <el-table-column
                        prop="audience" align="center"
                        label="培训受众">
                </el-table-column>
                <el-table-column
                        prop="createUser" align="center"
                        label="创建人">
                </el-table-column>
                <el-table-column
                        prop="createTime" align="center"
                        label="创建时间">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <router-link :to="{path: '/add-course',query:{id:scope.row.id}}" tag="span" v-if="operationData.includes('195c1cf8')">修改</router-link>
                        <span @click="deleteSingleFun(scope.row)" v-if="operationData.includes('e172c201')">删除</span>
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
        <!-- 开启 -->
        <el-dialog :visible.sync="startIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确认要开启吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="startIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="startSubmit" class="el-btn-min-100 no-repeat-click2" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 停用 -->
        <el-dialog :visible.sync="stopIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确认要停用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="stopIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="stopSubmit" class="el-btn-min-100 no-repeat-click3" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click4" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesAllData,getKnowAllData,getMapNameData,getDictionariesNameData,fileUpload,getOperationData} from "@/assets/js/api";
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    export default {
        name: "CourseManagement",
        components:{
            Treeselect
        },
        data(){
            return {
                selectConfigIsShow: false, // 选择人员弹窗
                interfaceUrl: '', // 接口地址
                cascadeOrg: 'true', // 按机构查询时是否级联子机构
                searchData: { // 搜索数据
                    knowledgeId: null,
                    typeId: '',
                    enabled: '',
                    studyModeId: '',
                    name: '',
                    createUser: '',
                    createTime: ['',''],
                    createTimeStart: '',
                    createTimeEnd: ''
                },
                records: [], // 数据
                recordsTotal: 0, // 总数居
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                addIsShow: false, // 新增
                startIsShow: false, // 开启
                stopIsShow: false, // 停用
                deleteIsShow: false, // 删除
                multipleSelection:[], // 表格选择后的数据
                dictionariesAllData: [], // 获取基本类型字典项数据
                knowAllData: [], // 获取知识体系字典项数据
                mapNameData: [], // 获取知识体系字典项数据的某个值
                dictionariesNameData: [], // 获取基本类型字典项数据的某个值
                operationData: [], // 操作权限
            }
        },
        created(){
            this.getList();
            getDictionariesAllData().then(res => {
                // courseType_all：课程类型 studyWay_all：学习方式 status_all：课程状态
                this.dictionariesAllData = res;
            });
            getKnowAllData().then(res => {
                // 知识体系
                this.knowAllData = res;
            });
            getMapNameData().then(res => {
                this.mapNameData = res;
            });
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getOperationData('课程管理').then(res => {
                this.operationData = res;
            });
        },
        methods:{
            getList(){ // 获取列表数据
                axiosPost('/educateMgr/course/list',{
                    knowledgeId: this.searchData.knowledgeId,
                    typeId: this.searchData.typeId,
                    enabled: this.searchData.enabled,
                    studyModeId: this.searchData.studyModeId,
                    name: this.searchData.name,
                    createUser: this.searchData.createUser,
                    createTimeStart: this.searchData.createTime ? this.searchData.createTime[0] : '',
                    createTimeEnd: this.searchData.createTime ? this.searchData.createTime[1] : '',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    loading: '.loading-table',
                    noRepeat: '.no-repeat-click1'
                })
                    .then(res => {
                        this.records = res.data.records;
                        this.recordsTotal = res.data.total;
                    })
            },
            searchList(){ // 搜索
                if(this.searchData.createTime){
                    this.searchData.createTimeStart = this.searchData.createTime[0];
                    this.searchData.createTimeEnd = this.searchData.createTime[1];
                }
                this.pageNo = 1;
                this.getList();
            },
            resetSearchCondition(){ // 重置
                this.searchData = {};
            },
            handleSelectionChange(res){ // 表格选择更改
                this.multipleSelection = res;
            },
            addFun(){ // 新增
                this.$router.push({path: '/add-course'})
                // this.addIsShow = true;
            },
            startFun(){ // 启用
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.startIsShow = true;
            },
            startSubmit(){ // 启用 提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.id;
                });
                axiosPost('/educateMgr/course/permit',{
                    strs: idArr,
                    noRepeat: '.no-repeat-click2'
                }).then(() => {
                    this.startIsShow =false;
                    this.pageNo = 1;
                    this.getList();
                })
            },
            stopFun(){ // 停用
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.stopIsShow = true;
            },
            stopSubmit(){ // 停用 提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.id;
                });
                axiosPost('/educateMgr/course/forbid',{
                    strs: idArr,
                    noRepeat: '.no-repeat-click3'
                }).then(() => {
                    this.stopIsShow =false;
                    this.pageNo = 1;
                    this.getList();
                })
            },
            deleteFun(){ // 删除
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.deleteIsShow = true;
            },
            deleteSingleFun(res){
                this.deleteIsShow = true;
                this.$refs.courseTable.clearSelection();
                this.$refs.courseTable.toggleRowSelection(res,true);
            },
            deleteSubmit(){ // 删除 提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.id;
                });
                axiosPost('/educateMgr/course/remove',{
                    strs: idArr,
                    noRepeat: '.no-repeat-click4'
                }).then(() => {
                    this.deleteIsShow =false;
                    this.pageNo = 1;
                    this.getList();
                })
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
            normalizer(node) { // 知识体系树
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
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
    .add-title{
        font-size: 16px;
        font-weight: bold;
        color: #323232;
    }
    .item{
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 15px;
        margin-bottom: 15px;
        font-size: 14px;
    }
    .item:last-child{
        border-bottom: none;
    }
    .catalog{
        margin-top: 10px;
    }
    .catalog-list .el-select{
        width: 120px!important;
        margin-right: 20px;
    }
    .catalog>div:first-child{
        margin-left: 15px;
    }
    .catalog>div span{
        cursor: pointer;
        padding-left: 15px;
        color: #409EFF;
        font-size: 14px;
    }
    .catalog-list{
        padding-left: 30px;
    }
    .catalog-list li{
        padding: 15px 0;
        display: flex;
        align-items: center;
    }
    .catalog-list .class-name{
        width: 80px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    .catalog-list .file-name{
        padding-left: 20px;
        width: 220px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    .operation {
        flex: 1;
        text-align: right;
    }
    .operation span{
        cursor: pointer;
        color: #409EFF;
        padding-left: 15px;
        font-size: 14px;
    }
    .catalog-list .el-input{
        width: 130px;
        margin-right: 10px;
    }
    .test-list,.research-list,.cover-list{
        padding-left: 30px;
    }
    .test-list li,.research-list li{
        line-height: 30px;
    }
    .del{
        color: #409EFF;
        cursor: pointer;
    }
    .title-right{
        font-size: 14px;
        color: #409EFF;
        cursor: pointer;
        font-weight: normal;
    }
    .cover-list img{
        width: 150px;
        height: 150px;
    }
    .vue-treeselect{
        width: 200px;
        float: left;
    }
    .demo-form-inline .el-textarea{
        width: 202px;
    }
    .upload-text{
        display: inline-block;
        color: #409EFF;
        font-size: 14px;
    }
    .upload-text p{
        font-size: 14px;
    }
    .des-name{
        font-size: 14px;
    }
    .catalog-em{
        display: inline-block;
    }
    .option-delete{
        color: #409EFF;
        font-size: 14px;
    }
    .problem-title{
        width: 60%;
    }
</style>