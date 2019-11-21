<template><!-- 菜单管理 zhiyong.li -->
    <div class="menuManagement">
        <div class="search-container">
            <h2 class="title-h2">菜单管理</h2>
            <div class="curriculum-button">
                <el-button size="small" @click="addMenu({id: 'root'})" v-if="operationData.includes('4c0a8276')">新增主菜单</el-button>
            </div>
        </div>
        <div class="menu4 loading-table">
            <el-table border :data="records" row-key="id" style="width: 100%" :expand-row-keys="expands" size="mini">
                <el-table-column prop="cnName" label="菜单名称"></el-table-column>
                <el-table-column label="菜单类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.isInvented ? dictionariesNameData[scope.row.isInvented] : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="value" label="菜单路径" align="center"></el-table-column>
                <el-table-column prop="icon" label="图标" align="center"></el-table-column>
                <el-table-column prop="sortno" label="排序号" align="center"></el-table-column>
                <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status ? dictionariesNameData[scope.row.status] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span @click="editFun(scope.row)" v-if="operationData.includes('0d5271e5')">编辑</span>
                        <span @click="addMenu(scope.row)" v-if="operationData.includes('0847de89')">新增子菜单</span>
                        <span @click="deleteFun(scope.row)" v-if="operationData.includes('98a238bd')">删除</span>
                        <span @click="pointFun(scope.row)" v-if="operationData.includes('87753579')">维护权限点</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--新增弹窗-->
        <el-dialog title="新增" :visible.sync="addMenuIsShow" @close='addClose("addForm")' class="need-header">
            <div class="add-form clearfix">
                <el-form :model="addData" :inline="true" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="菜单名称" prop="cnName" size="small">
                        <el-input v-model="addData.cnName" placeholder="请输入菜单名称"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单类型" prop="isInvented" size="small">
                        <el-select v-model="addData.isInvented" placeholder="请选择类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['isInvented']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单路径" prop="value" size="small">
                        <el-input v-model="addData.value" placeholder="请输入菜单路径"></el-input>
                    </el-form-item>
                    <el-form-item label="图标" prop="icon" size="small">
                        <el-input v-model="addData.icon" placeholder="请输入icon"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单代码" prop="code" size="small">
                        <el-input v-model="addData.code" placeholder="请输入菜单代码"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sortno" size="small">
                        <el-input v-model="addData.sortno" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" size="small">
                        <el-select v-model="addData.status" placeholder="请选择状态">
                            <el-option v-for="(item,ind) in dictionariesAllData['status']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="rightDesc" size="small">
                        <el-input type="textarea" :rows="3" v-model="addData.rightDesc" placeholder="请输入描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMenuIsShow = false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="addMenuSubmit('addForm')" class="el-btn-min-100 no-repeat-click" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editIsShow" @close='addClose("editForm")' class="need-header">
            <el-form :model="editData" :inline="true" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="菜单名称" prop="cnName" size="small">
                    <el-input v-model="editData.cnName" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="value" size="small">
                    <el-input v-model="editData.value" placeholder="请输入菜单路径"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon" size="small">
                    <el-input v-model="editData.icon" placeholder="请输入icon"></el-input>
                </el-form-item>
                <el-form-item label="菜单代码" prop="code" size="small">
                    <el-input v-model="editData.code" placeholder="请输入菜单代码"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortno" size="small">
                    <el-input v-model="editData.sortno" placeholder="请输入排序号"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" size="small">
                    <el-select v-model="editData.status" placeholder="请选择状态">
                        <el-option v-for="(item,ind) in dictionariesAllData['status']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="rightDesc" size="small">
                    <el-input type="textarea" :rows="3" v-model="editData.rightDesc" placeholder="请输入描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editIsShow = false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="editSubmit('editForm')" class="el-btn-min-100 no-repeat-click2" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click3" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!--维护权限点-->
        <el-dialog title="维护权限点" :visible.sync="accessPointsIsShow" class="need-header">
            <div class="point">
                <p class="name">菜单名称：{{rowData.cnName}}</p>
                <el-button size="small" @click="addPointFun" style="margin: 20px 0 10px 0;">新增</el-button>
                <el-table ref="point" border :data="pointData" max-height="300" style="width: 100%" row-key="id">
                    <el-table-column prop="code" label="权限点" align="center"></el-table-column>
                    <el-table-column prop="cnName" label="权限名称" align="center"></el-table-column>
                    <el-table-column label="权限类型" align="center">
                        <template slot-scope="scope">
                            {{dictionariesNameData[scope.row.flag]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="rightDesc" label="权限描述" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span @click="deleteFunPoint(scope.row)" size="small">删除</span>
                            <span @click="editPointFun(scope.row)" size="small">编辑</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!--新增权限点弹窗-->
        <el-dialog title="新增" :visible.sync="addPointIsShow" @close='addClose("addPointForm")' class="need-header">
            <div class="add-container">
                <el-form :model="addPointData" :inline="true" :rules="rulesPoint" ref="addPointForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="权限点" prop="code" align="center" size="small">
                        <el-input v-model="addPointData.code" placeholder="请输入权限点"></el-input>
                    </el-form-item>
                    <el-form-item label="权限名称" prop="cnName" align="center" size="small">
                        <el-input v-model="addPointData.cnName" placeholder="请输入权限名称"></el-input>
                    </el-form-item>
                    <el-form-item label="权限类型" prop="flag" align="center" size="small">
                        <el-select v-model="addPointData.flag" placeholder="请选择权限类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['rightType']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="权限描述" prop="rightDesc" align="center" size="small">
                        <el-input type="textarea" :rows="3" v-model="addPointData.rightDesc" placeholder="请输入描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPointIsShow = false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="addPointSubmit('addPointForm')" class="el-btn-min-100 no-repeat-click6" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!--编辑权限点弹窗-->
        <el-dialog title="编辑" :visible.sync="editPointIsShow" @close='addClose("editPointForm")' class="need-header">
            <div class="edit-container">
                <el-form :model="editPointData" :inline="true" :rules="rulesPoint" ref="editPointForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="权限点" prop="code" size="small" align="center">
                        <el-input v-model="editPointData.code" placeholder="请输入权限点"></el-input>
                    </el-form-item>
                    <el-form-item label="权限名称" prop="cnName" size="small" align="center">
                        <el-input v-model="editPointData.cnName" placeholder="请输入权限名称"></el-input>
                    </el-form-item>
                    <el-form-item label="权限类型" prop="flag" size="small" align="center">
                        <el-select v-model="editPointData.flag" placeholder="请选择权限类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['rightType']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="权限描述" prop="rightDesc" size="small" align="center">
                        <el-input type="textarea" :rows="3" v-model="editPointData.rightDesc" placeholder="请输入权限描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editPointIsShow = false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="editPointSubmit('editPointForm')" class="el-btn-min-100 no-repeat-click4" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShowPoint" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShowPoint=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmitPoint" class="el-btn-min-100 no-repeat-click5" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { axiosPost,getDictionariesAllData,getDictionariesNameData,getOperationData} from "@/assets/js/api"
    import{ intValidate } from '@/assets/js/verification'
    export default {
        name: 'menuManagement',
        data(){
            return {
                records: [], // 列表数据
                pointData: [], // 权限点 数据
                addData:{ // 添加数据
                    cnName: '',
                    value:'',
                    sortno: '',
                    code: '',
                    icon: '',
                    status: '',
                    rightDesc: '',
                    pid: '',
                    isInvented:''
                },
                editData:{ // 编辑数据
                    cnName: '',
                    value: '',
                    icon: '',
                    sortno: '',
                    code: '',
                    status: '',
                    rightDesc: '',
                    id: ''
                },
                addPointData:{ // 添加权限点数据
                    code: '',
                    cnName: '',
                    flag: '',
                    rightDesc: '',
                },
                editPointData:{ // 编辑权限点数据
                    code: '',
                    cnName: '',
                    flag: '',
                    rightDesc: '',
                },
                addPointIsShow: false,
                editPointIsShow: false,
                rules: { // 规则
                    cnName: [
                        { required: true, message: '请输入菜单名称',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    value: [
                        { required: true, message: '请输入菜单路径',trigger: 'blur'},
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    isInvented: [{ required: true, message: '请选择菜单类型',trigger: 'blur'}],
                    icon: [
                        { required: true, message: '请输入图标',trigger: 'blur'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    sortno: [
                        { required: true, message: '请输入排序号',trigger: 'blur'},
                        { validator: intValidate,message: '请输入正确的排序号',trigger: 'blur'},
                        { max: 4, message: '长度应小于等于4个字符', trigger: 'blur' }
                    ],
                    rightDesc: [
                        { required: true, message: '请输入描述',trigger: 'blur'},
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    status: [{ required: true, message: '请选择状态',trigger: 'blur'}],
                    code: [
                        { required: true, message: '请输入菜单代码',trigger: 'blur'},
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                },
                rulesPoint: { // 规则
                    cnName: [
                        { required: true, message: '请输入权限名称',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    rightDesc: [
                        { required: true, message: '请输入权限描述',trigger: 'blur'},
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    flag: [
                        { required: true, message: '请选择权限类型',trigger: 'blur'}
                    ],
                    code: [
                        { required: true, message: '请输入权限点',trigger: 'blur'},
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                },
                accessPointsIsShow: false, // 维护权限点弹窗是否打开
                editIsShow: false, // 编辑弹窗是否打开
                deleteIsShow: false, // 删除弹窗是否打开
                rowData: [], // 一行的数据
                deleteIsShowPoint: false, // 删除权限点
                editIsShowPoint: false,// 编辑权限点
                addMenuIsShow: false, //  新增菜单弹窗
                deletePointData: false, // 删除权限点数据
                dictionariesNameData: {}, // 获取字典
                dictionariesAllData: {},
                operationData: [], // 操作权限
                expands: [] // 默认展开项
            }
        },
        created(){
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getDictionariesAllData().then(res => {
                this.dictionariesAllData = res;
            });
            getOperationData("菜单管理")
                .then(res => {
                    this.operationData = res;
                });
            this.getList();
        },
        methods:{
            getList(){ // 获取列表
                axiosPost('/systemMgr/menu/tree',{
                    loading: '.loading-table'
                })
                    .then(res => {
                      this.records = res.data;
                    })
            },
            addMenu(res){ // 添加菜单
                this.addData.pid = res.id;
                this.addMenuIsShow = true;
            },
            addMenuSubmit(formName){ // 添加菜单 提交
                this.$refs[formName].validate((valid) => {
                   if(valid) {
                       axiosPost('/systemMgr/menu/create',{
                           cnName: this.addData.cnName,
                           value: this.addData.value,
                           isInvented: this.addData.isInvented,
                           icon: this.addData.icon,
                           sortno: this.addData.sortno,
                           code: this.addData.code,
                           rightDesc: this.addData.rightDesc,
                           status: this.addData.status,
                           pid: this.addData.pid,
                           noRepeat: '.no-repeat-click'
                       })
                           .then(() => {
                               this.addMenuIsShow = false;
                               this.getList();
                               this.addData = {};
                           })
                   }
                });
            },
            editFun(res){ // 编辑弹窗打开
                this.editIsShow = true;
                this.editData.cnName = res.cnName;
                this.editData.value = res.value;
                this.editData.icon = res.icon;
                this.editData.code = res.code;
                this.editData.rightDesc = res.rightDesc;
                this.editData.sortno = window.String(res.sortno);
                this.editData.status = res.status;
                this.editData.id = res.id;
            },
            editSubmit(formName){ // 编辑 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/menu/alter',{
                            cnName: this.editData.cnName,
                            value: this.editData.value,
                            icon: this.editData.icon,
                            code: this.editData.code,
                            rightDesc: this.editData.rightDesc,
                            sortno: this.editData.sortno,
                            status: this.editData.status,
                            id: this.editData.id,
                            noRepeat: '.no-repeat-click2'
                        }).then(()=>{
                            this.editIsShow = false;
                            this.getList();
                        })
                    }
                })
            },
            pointFun(res){ // 维护权限点
                this.rowData  = res;
                this.accessPointsIsShow = true;
                this.getListPoint();
            },
            getListPoint(){
                axiosPost('/systemMgr/right/list',{
                    pid: this.rowData.id
                })
                    .then(res => {
                        this.pointData = res.data;
                    })
            },
            addPointFun(){ // 新增权限点
                this.addPointIsShow = true;
            },
            addPointSubmit(formName){ // 新增权限点 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/right/create',{
                            code: this.addPointData.code,
                            cnName: this.addPointData.cnName,
                            flag: this.addPointData.flag,
                            rightDesc: this.addPointData.rightDesc,
                            pid: this.rowData.id,
                            noRepeat: '.no-repeat-click6'
                        }).then(()=>{
                            this.addPointIsShow = false;
                            this.getListPoint();
                        })
                    }
                })
            },
            editPointFun(row){ // 编辑权限点
                this.editPointIsShow = true;
                this.editPointData.code = row.code;
                this.editPointData.cnName = row.cnName;
                this.editPointData.flag = row.flag;
                this.editPointData.rightDesc = row.rightDesc;
                this.editPointData.id = row.id;
            },
            editPointSubmit(formName){// 编辑权限点 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/right/alter',{
                            code: this.editPointData.code,
                            cnName: this.editPointData.cnName,
                            flag: this.editPointData.flag,
                            rightDesc: this.editPointData.rightDesc,
                            id: this.editPointData.id,
                            noRepeat: '.no-repeat-click4'
                        }).then(()=>{
                            this.editPointIsShow = false;
                            this.getListPoint();
                        })
                    }
                })
            },
            deleteFun(res){ // 删除
                this.deleteIsShow = true;
                this.rowData = res;
            },
            deleteSubmit(){ // 删除提交
                axiosPost('/systemMgr/right/delete',{
                    id: this.rowData.id,
                    noRepeat: '.no-repeat-click3'
                }).then(()=>{
                    this.deleteIsShow = false;
                    this.getList();
                })
            },
            deleteFunPoint(res){ // 删除权限点
                this.deletePointData = res;
                this.deleteIsShowPoint = true;
            },
            deleteSubmitPoint(){ // 删除权限点 提交
                axiosPost('/systemMgr/right/delete',{
                    id: this.deletePointData.id,
                    noRepeat: '.no-repeat-click5'
                }).then(()=>{
                    this.deleteIsShowPoint = false;
                    this.getListPoint();
                })
            },
            addClose(addForm){ // 关闭添加弹窗时清空验证
                this.$refs[addForm].resetFields();
            },
            expandChange(row,isOpen) { // 树状表格保留展开操作状态
                if(isOpen){
                    this.expands.push(row.id);
                }else{
                    this.expands.splice(this.expands.findIndex(item => item == row.id),1);
                }
            }
        }
    }
</script>
<style scoped>
    .menu1 button,.menu3 button{
        margin-top: 5px;
        margin-right: 15px;
    }
    .add-form p,.modify-form p{
        float: left;
        width: 50%;
        line-height: 54px;
    }
    .add-form p span,.modify-form p span{
        display: inline-block;
        width: 100px;
    }
    .point .name{
        font-size: 16px;
    }
    .curriculum-button{
        margin-top: 20px;
    }
    .menuManagement >>> .el-textarea{
        width: 200px;
    }
    .menuManagement >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
</style>
