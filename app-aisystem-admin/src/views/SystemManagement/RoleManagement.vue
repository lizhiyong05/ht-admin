<template><!-- 角色管理 zhiyong.li -->
    <div class="roleManagement">
        <h2 class="title-h2">角色管理</h2>
        <div class="search-container">
            <el-form :inline="true" class="demo-form-inline" label-width="100px">
                <el-form-item label="角色编号" size="small">
                    <el-input v-model="roleCode" placeholder="请输入角色编号"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" size="small">
                    <el-input v-model="roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button type="primary" @click="searchList" class="el-btn-min-100 no-repeat-click" size="small">查询</el-button>
                <el-button @click="resetSearchCondition" class="el-btn-min-100" size="small">重置</el-button>
            </div>
            <div class="curriculum-button">
                <el-button size="small" @click="deleteDataFun" v-if="operationData.includes('00a56f47')">删除</el-button>
                <el-button size="small" @click="addDataFun" v-if="operationData.includes('edb7ea07')">新增</el-button>
            </div>
        </div>
        <div class="menu4 loading-table">
            <el-table ref="multipleTable" border :data="records" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange" size="small">
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="roleCode" label="角色编号" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="userCount" label="人员数量" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status ? dictionariesNameData[scope.row.status] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span @click="editFun(scope.row)" v-if="operationData.includes('e0d4b4f3')">编辑</span>
                        <span @click="deleteSingleFun(scope.row)" v-if="operationData.includes('00a56f47')">删除</span>
                        <span @click="enableFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '停用' && operationData.includes('e73ff63e')">启用</span>
                        <span @click="prohibitFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '启用' && operationData.includes('118dcb0b')">停用</span>
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
        <el-dialog :visible.sync="deleteIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">角色删除操作，将影响已分配该角色的用户权限，请确认要继续删除么?</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click2" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="addIsShow" @close='addClose("addForm")' class="need-header">
            <div class="dialog-container">
                <div class="add-form">
                    <el-form :model="addData" :inline="true" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="角色名称" prop="roleName" size="small">
                            <el-input v-model="addData.roleName" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="roleDesc" size="small">
                            <el-input type="textarea" v-model="addData.roleDesc" placeholder="请输入角色描述"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="addSubmit('addForm')" class="el-btn-min-100 no-repeat-click3" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editIsShow" class="need-header">
            <div class="add-form">
                <el-form :model="editData" :inline="true" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="roleName" size="small">
                        <el-input v-model="editData.roleName" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" size="small" prop="roleDesc">
                        <el-input type="textarea" v-model="editData.roleDesc" placeholder="请输入角色描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="editSubmitForm('editForm')" class="el-btn-min-100 no-repeat-click4" size="small">保 存</el-button>
            </div>
        </el-dialog>
        <!-- 启用弹窗 -->
        <el-dialog :visible.sync="enableIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要启用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="enableIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="enableSubmit" class="el-btn-min-100 no-repeat-click5" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 停用弹窗 -->
        <el-dialog :visible.sync="prohibitIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要停用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="prohibitIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="prohibitSubmit" class="el-btn-min-100 no-repeat-click6" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesAllData,getDictionariesNameData,getOperationData} from "@/assets/js/api";

    export default {
        name: 'roleManagement',
        data(){
            return {
                records: [], // 表格数据列表
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                roleCode: '',  // 角色编号
                roleName: '',  // 角色名称
                multipleSelection: [], // 已经选择的内容
                recordsTotal: 0, // 总数据
                deleteIsShow: false, // 删除弹窗是否显示
                addIsShow: false, // 新增弹窗是否显示
                addData: { // // 添加的数据
                    roleDesc: '',
                    roleName: ''
                },
                rules: { // 规则
                    roleName: [
                        { required: true, message: '请输入角色名称',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    roleDesc: [
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ]
                },
                editData: { // 编辑的数据
                    roleDesc: '',
                    roleName: '',
                    roleId: ''
                },
                editIsShow: false, // 编辑的弹窗
                dictionariesAllData: {},
                dictionariesNameData: {},
                operationData: [], // 操作权限
                enableData: {}, // 启用数据
                prohibitData: {}, // 停用数据
                enableIsShow: false, // 启用
                prohibitIsShow: false, // 停用
            }
        },
        created(){
            this.getList();
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getDictionariesAllData().then(res => {
                this.dictionariesAllData = res;
            });
            getOperationData("角色管理")
                .then(res => {
                    this.operationData = res;
                });
        },
        methods:{
            getList(){ // 获取角色列表
                axiosPost('/systemMgr/role/list',{
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    roleCode: this.roleCode,
                    roleName: this.roleName,
                    loading: '.loading-table',
                    noRepeat: '.no-repeat-click'
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                })
            },
            handleSelectionChange(val) { // 选择表格
                this.multipleSelection = val;
            },
            handleSizeChange(res){ // 每页第几条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList();
            },
            handleCurrentChange(res){ // 当前第几页
                this.pageNo = res;
                this.getList();
            },
            searchList(){ // 搜索列表 查询
                this.pageNo = 1;
                this.getList();
            },
            resetSearchCondition(){ // 清空搜索条件  重置
                this.roleCode = '';
                this.roleName = '';
            },
            addDataFun(){ // 添加数据 新增
                this.addIsShow = true;
            },
            addSubmit(formName){ // 添加数据 提交
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        axiosPost('/systemMgr/role/create',{
                            roleDesc: this.addData.roleDesc,
                            roleName: this.addData.roleName,
                            noRepeat: '.no-repeat-click3'
                        }).then(() => {
                            this.addIsShow = false;
                            this.pageNo = 1;
                            this.getList();
                            this.addData = {};
                        })
                    }
                })
            },
            deleteDataFun(){ // 删除数据
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.deleteIsShow = true;
            },
            deleteSingleFun(res){
                this.deleteIsShow = true;
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.toggleRowSelection(res,true);
            },
            deleteSubmit(){ // 删除数据 提交
                let idArr = this.multipleSelection.map((item) => {
                    return item.roleId;
                });
                axiosPost('/systemMgr/role/delete',{
                    ids: idArr,
                    noRepeat: '.no-repeat-click2'
                }).then(() => {
                    this.deleteIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                })
            },
            editFun(row){ // 点击编辑按钮
                this.editIsShow = true;
                this.editData.roleName = row.roleName;
                this.editData.roleDesc = row.roleDesc;
                this.editData.roleId = row.roleId;
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.toggleRowSelection(row,true);
            },
            editSubmitForm(formName){ // 编辑数据 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/role/alter',{
                            roleDesc: this.editData.roleDesc,
                            roleName: this.editData.roleName,
                            roleId: this.editData.roleId,
                            noRepeat: '.no-repeat-click4'
                        }).then(() => {
                            this.editIsShow = false;
                            this.pageNo = 1;
                            this.getList();
                        })
                    }
                });
            },
            addClose(addForm){ // 关闭添加弹窗时清空验证
                this.$refs[addForm].resetFields();
            },
            enableFun(row){ // 启用
                this.enableData = row;
                this.enableIsShow = true;
            },
            enableSubmit(){ // 启用 提交
                axiosPost('/systemMgr/role/permit',{
                    id: this.enableData.roleId,
                    noRepeat: '.no-repeat-click5'
                }).then(()=>{
                    this.enableIsShow = false;
                    this.getList();
                })
            },
            prohibitFun(row){// 禁用
                this.prohibitData = row;
                this.prohibitIsShow = true;
            },
            prohibitSubmit(){ // 禁用 提交
                axiosPost('/systemMgr/role/forbid',{
                    id: this.prohibitData.roleId,
                    noRepeat: '.no-repeat-click6'
                }).then(()=>{
                    this.prohibitIsShow = false;
                    this.getList();
                })
            },
        }
    }
</script>
<style scoped>
    .roleManagement >>> .el-textarea{
        width: 200px;
    }
    .roleManagement >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
</style>
