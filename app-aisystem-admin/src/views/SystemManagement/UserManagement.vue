<template><!-- 用户管理zhiyong.li -->
    <div class="userManagement">
        <h2 class="title-h2">用户管理</h2>
        <div class="search-container">
            <el-form :inline="true" class="demo-form-inline" label-width="100px">
                <el-form-item label="OA号" size="small">
                    <el-input v-model="oaNo" placeholder="请输入OA号"></el-input>
                </el-form-item>
                <el-form-item label="姓名" size="small">
                    <el-input v-model="userName" placeholder="请输入姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item label="手机号" size="small">
                    <el-input v-model="mobile" placeholder="请输入手机号" size="small"></el-input>
                </el-form-item>
                <el-form-item label="所属机构" size="mini">
                    <treeselect
                            :options="orgData"
                            placeholder="请选择所属机构"
                            v-model="orgValue"
                            noResultsText="未找到，请重新输入"
                    />
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button type="primary" @click="searchList" class="el-btn-min-100 no-repeat-click" size="small">查询</el-button>
                <el-button @click="resetSearchCondition" class="el-btn-min-100" size="small">重置</el-button>
            </div>
            <div class="curriculum-button">
                <el-button size="small" @click="deleteDataFun" v-if="operationData.includes('f81f4416')">删除</el-button>
                <el-button size="small" @click="addDataFun" v-if="operationData.includes('0c29ed29')">新增</el-button>
                <el-button size="small" @click="passwordReset" v-if="operationData.includes('28bd04f6')">密码重置</el-button>
            </div>
        </div>
        <div class="menu4 loading-table">
            <el-table border :data="records" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" ref="userTable" size="mini">
                <el-table-column type="selection" width="40" align="center"> </el-table-column>
                <el-table-column prop="oaNo" label="OA号" align="center" width="80"></el-table-column>
                <el-table-column prop="userName" label="姓名" align="center" width="80"></el-table-column>
                <el-table-column prop="userAccount" label="登陆账号" align="center"></el-table-column>
                <el-table-column label="所属机构" align="center">
                    <template slot-scope="scope">
                        {{(scope.row.orgId && orgNameData[scope.row.orgId]) ? orgNameData[scope.row.orgId].orgName : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="idNo" label="身份证号" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                <el-table-column prop="email" label="邮件地址" align="center"></el-table-column>
                <el-table-column label="状态" align="center" width="80">
                    <template slot-scope="scope">
                        {{scope.row.status ? dictionariesNameData[scope.row.status] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="职级" align="center" width="80">
                    <template slot-scope="scope">
                        {{scope.row.userRank ? dictionariesNameData[scope.row.userRank] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span @click="editFun(scope.row)" v-if="operationData.includes('71d9526d')">编辑</span>
                        <span @click="deleteSingleFun(scope.row)" v-if="operationData.includes('f81f4416')">删除</span>
                        <span @click="roleConfig(scope.row)" v-if="operationData.includes('273fc2a4')">角色配置</span>
                        <span @click="enableFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '停用' && operationData.includes('39229cb0')">启用</span>
                        <span @click="prohibitFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '启用' && operationData.includes('a05e1001')">停用</span>
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
        <!-- 添加用户列表 -->
        <el-dialog title="新增" :visible.sync="addIsShow" @close='addClose("addForm")' class="need-header">
            <div class="add-form">
                <el-form :model="addData" :inline="true" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="姓名" prop="userName" size="small">
                        <el-input v-model.trim="addData.userName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNo" size="small">
                        <el-input v-model="addData.idNo" placeholder="请输入身份证号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile" size="small">
                        <el-input v-model="addData.mobile" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="email" size="small">
                        <el-input v-model="addData.email" placeholder="请输入邮箱地址"></el-input>
                    </el-form-item>
                    <el-form-item label="登陆账号" prop="userAccount" size="small">
                        <el-input v-model.trim="addData.userAccount" placeholder="请输入登陆账号"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" prop="orgValue" size="small">
                        <treeselect v-model="addData.orgValue" @input="changeTree('addForm')"
                                    :options="orgData"
                                    placeholder="请选择所属机构"
                                    noResultsText="未找到，请重新输入"
                                    @open="opens('addForm')"
                        />
                    </el-form-item>
                    <el-form-item label="OA号" prop="oaNo" size="small">
                        <el-input v-model="addData.oaNo" placeholder="请输入OA号"></el-input>
                    </el-form-item>
                    <el-form-item label="工号" prop="jobNo" size="small">
                        <el-input v-model="addData.jobNo" placeholder="请输入工号"></el-input>
                    </el-form-item>
                    <el-form-item label="标准职务" prop="userDuty" size="small">
                        <el-input v-model="addData.userDuty" placeholder="请输入标准职务"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位" prop="position" size="small">
                        <el-select v-model="addData.position" placeholder="请选择岗位">
                            <el-option v-for="(item,ind) in dictionariesAllData['position']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职级" prop="userRank" size="small">
                        <el-select v-model="addData.userRank" placeholder="请选择职级" ref="elSelect1">
                            <el-option v-for="(item,ind) in dictionariesAllData['userRank']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工作地" prop="area" size="small">
                        <el-select v-model="addData.area" placeholder="请选择工作地" ref="elSelect2">
                            <el-option v-for="(item,ind) in dictionariesAllData['area']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="addSubmitForm('addForm')" class="el-btn-min-100 no-repeat-click2" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 密码重置 -->
        <el-dialog :visible.sync="passIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要密码重置吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="passIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="passResetSubmit" class="el-btn-min-100 no-repeat-click3" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" :show-close="false" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">选中项确定要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click4" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editIsShow" class="need-header">
            <div class="add-form">
                <el-form :model="editData" :inline="true" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="姓名" prop="userName" size="small">
                        <el-input v-model.trim="editData.userName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNo" size="small">
                        <el-input v-model="editData.idNo" placeholder="请输入身份证号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile" size="small">
                        <el-input v-model="editData.mobile" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="email" size="small">
                        <el-input v-model="editData.email" placeholder="请输入邮箱地址"></el-input>
                    </el-form-item>
                    <el-form-item label="登陆账号" prop="userAccount" size="small">
                        <el-input v-model.trim="editData.userAccount" placeholder="请输入登陆账号"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" size="small">
                        <treeselect v-model="editData.orgValue" @input="changeTree('editForm')"
                                    :options="orgData"
                                    placeholder="请选择所属机构"
                                    noResultsText="未找到，请重新输入"
                                    @open="opens('editForm')"
                        />
                    </el-form-item>
                    <el-form-item label="OA号" size="small" prop="oaNo">
                        <el-input v-model="editData.oaNo" placeholder="请输入OA号"></el-input>
                    </el-form-item>
                    <el-form-item label="工号" size="small" prop="jobNo">
                        <el-input v-model="editData.jobNo" placeholder="请输入工号"></el-input>
                    </el-form-item>
                    <el-form-item label="标准职务" size="small" prop="userDuty">
                        <el-input v-model="editData.userDuty" placeholder="请输入标准职务"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位" size="small">
                        <el-select v-model="editData.position" placeholder="请选择岗位">
                            <el-option v-for="(item,ind) in dictionariesAllData['position']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职级" size="small">
                        <el-select v-model="editData.userRank" placeholder="请选择职级" ref="elSelect3">
                            <el-option v-for="(item,ind) in dictionariesAllData['userRank']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工作地" size="small">
                        <el-select v-model="editData.area" placeholder="请选择工作地" ref="elSelect4">
                            <el-option v-for="(item,ind) in dictionariesAllData['area']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="editSubmitForm('editForm')" class="el-btn-min-100 no-repeat-click5" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 角色配置 -->
        <el-dialog title="角色配置" :visible.sync="roleConfigIsShow" @close='closeRoleConfig' class="need-header">
            <div class="dialog-container">
                <el-table :data="roleConfigData" max-height="300" border style="width: 100%" ref="roleConfigRef" @selection-change="handleSelectionChange2" class="loading-table2">
                    <el-table-column type="selection" align="center"  width="40"></el-table-column>
                    <el-table-column prop="roleId" label="角色编号"></el-table-column>
                    <el-table-column prop="roleName" label="角色名称"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleConfigIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="roleConfigSubmit" class="el-btn-min-100 no-repeat-click6" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 启用弹窗 -->
        <el-dialog :visible.sync="enableIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要启用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="enableIsShow=false" size="small">取消</el-button>
                <el-button type="primary" @click="enableSubmit" class="no-repeat-click7" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 停用弹窗 -->
        <el-dialog :visible.sync="prohibitIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要停用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="prohibitIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="prohibitSubmit" class="el-btn-min-100 no-repeat-click8" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import{mobileValidate,idValidate} from '@/assets/js/verification'

    import {axiosPost,getOrgAllData,getOrgNameData,getDictionariesAllData,getDictionariesNameData,getOperationData} from '@/assets/js/api'
    export default {
        name: 'userManagement',
        components:{
            Treeselect
        },
        data(){
            return {
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数
                oaNo: '',  // 工号
                userName: '',  // 姓名
                mobile: '',  // 手机号
                addIsShow: false, // 新增弹窗是否显示
                orgNameData: {}, // 所属机构数据
                dictionariesNameData:{}, // 基本字典项
                dictionariesAllData: {},
                addData:{ // 添加的数据
                    oaNo: '',
                    userName: '',
                    mobile: '',
                    idNo: '',
                    email: '',
                    orgValue: null,
                    jobNo: '',
                    userDuty: '', //标准职务
                    position: '', // 岗位
                    area: '', // 工作地
                    userRank: '', // 职级
                    userAccount: '' // 登陆账号
                },
                editData:{ // 编辑的数据
                    oaNo: '',
                    userName: '',
                    mobile: '',
                    idNo: '',
                    email: '',
                    orgValue: null,
                    jobNo: '',
                    userDuty: '',
                    position: '',
                    area: '',
                    userRank: '',
                    userId: '',
                    userAccount: '' // 登陆账号
                },
                rules: { // 新增的规则
                    userName: [
                        { required: true, message: '请输入姓名',trigger: 'blur'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    userAccount: [
                        { required: true, message: '请输入用户账号',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号',trigger: 'blur'},
                        { validator: mobileValidate,trigger: 'blur'},
                        { max: 11, message: '长度应小于等于11个字符', trigger: 'blur' }
                    ],
                    idNo: [
                        { required: true, message: '请输入身份证号',trigger: 'blur'},
                        { validator: idValidate,trigger: 'blur'},
                        { max: 18, message: '长度应小于等于18个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址',trigger: 'blur'},
                        { type: 'email', message: '请输入正确的邮箱地址' },
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    oaNo: [
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    jobNo: [
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    userDuty: [
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ]

                },
                orgValue: null,  // 用于搜索的所属机构 某个数据
                orgData: [],  // 所属机构 整体数据
                multipleSelection: [], // 表格已经选择的内容
                multipleSelection2: [], // 角色权限已经选择的内容
                passIsShow: false, // 密码重置弹窗是否显示
                deleteIsShow: false, // 删除弹窗是否显示
                editIsShow: false, // 编辑弹窗是否显示
                roleConfigIsShow: false, // 角色配置弹窗是否显示
                roleConfigData: [], // 用户角色数据
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                selectUserData: [], // 角色配置  用户选择的数据
                roleConfigSelectId: '', // 角色配置  item
                operationData: [], // 操作权限
                enableData: {}, // 启用数据
                prohibitData: {}, // 停用数据
                enableIsShow: false, // 启用
                prohibitIsShow: false, // 停用
            }
        },
        created(){
            getOrgAllData().then(res => {
                this.orgData = res;
            });
            getOrgNameData().then(res => {
                this.orgNameData = res;
            });
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getDictionariesAllData().then(res => {
                this.dictionariesAllData = res;
            });
            getOperationData("用户管理")
                .then(res => {
                    this.operationData = res;
                });
            this.getList();
        },
        methods:{
            getList(){ // 获取列表
                axiosPost('/systemMgr/user/list',{
                    oaNo: this.oaNo,
                    userName: this.userName,
                    mobile: this.mobile,
                    orgId: this.orgValue, // 所属机构
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize, // 每页的数量
                    cascadeOrg: '级联',
                    loading: '.loading-table',
                    noRepeat: '.no-repeat-click'
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            searchList(){ // 通过查询条件获取列表
                this.pageNo = 1;
                this.getList();
            },
            resetSearchCondition(){ // 清空搜索条件 重置
                this.oaNo = '';
                this.userName = '';
                this.mobile = '';
                this.orgValue = null;
            },
            passwordReset(){ // 密码重置
                if(this.multipleSelection.length <= 0){
                    this.$message({message:'请选择数据后再操作',type: 'warning'});
                    return false;
                }
                this.passIsShow = true;
            },
            passResetSubmit(){ // 密码重置请求
                let idArr = this.multipleSelection.map((item) => {
                    return item.userId;
                });
                axiosPost('/systemMgr/user/resetPwd',{
                    userIds: idArr,
                    noRepeat: '.no-repeat-click3'
                }).then((res) => {
                    this.passIsShow = false;
                    this.pageNo = 1;
                    this.$message({ message: res.msg, type: 'success'});
                    this.getList();
                });
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
                this.$refs.userTable.clearSelection();
                this.$refs.userTable.toggleRowSelection(res,true);
            },
            deleteSubmit(){ // 删除请求
                let idArr = this.multipleSelection.map((item) => {
                    return item.userId;
                });
                axiosPost('/systemMgr/user/delete',{
                    userIds: idArr,
                    noRepeat: '.no-repeat-click4'
                }).then(() => {
                    this.deleteIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                });
            },
            addDataFun(){ // 新增数据
                this.addIsShow = true;
            },
            addSubmitForm(formName) { // 新增数据 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/user/create',{
                            oaNo: this.addData.oaNo,
                            jobNo: this.addData.jobNo,
                            userName: this.addData.userName,
                            userAccount: this.addData.userAccount,
                            mobile: this.addData.mobile,
                            idNo: this.addData.idNo,
                            email: this.addData.email,
                            orgId: this.addData.orgValue,
                            userDuty: this.addData.userDuty,
                            position: this.addData.position,
                            area: this.addData.area,
                            userRank: this.addData.userRank,
                            noRepeat: '.no-repeat-click2'
                        }).then(() => {
                            this.addIsShow = false;
                            this.pageNo = 1;
                            this.getList();
                            this.addData = {};
                        });
                    }
                });
            },
            editFun(row){ // 点击编辑按钮
                this.editIsShow = true;
                this.editData.oaNo = row.oaNo;
                this.editData.userName = row.userName;
                this.editData.mobile = row.mobile;
                this.editData.idNo = row.idNo;
                this.editData.email = row.email;
                this.editData.userId = row.userId;
                this.editData.orgValue = row.orgId;
                this.editData.jobNo = row.jobNo;
                this.editData.userDuty = row.userDuty;
                this.editData.position = row.position;
                this.editData.area = row.area;
                this.editData.orgValue = row.orgId;
                this.editData.userRank = row.userRank;
                this.editData.userAccount = row.userAccount;
                this.$refs.userTable.clearSelection();
                this.$refs.userTable.toggleRowSelection(row,true);
            },
            editSubmitForm(formName){ // 编辑数据 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/user/alter',{
                            oaNo: this.editData.oaNo,
                            userName: this.editData.userName,
                            mobile: this.editData.mobile,
                            idNo: this.editData.idNo,
                            email: this.editData.email,
                            userId: this.editData.userId,
                            orgId: this.editData.orgValue,
                            jobNo: this.editData.jobNo,
                            userDuty: this.editData.userDuty,
                            position: this.editData.position,
                            area: this.editData.area,
                            userRank: this.editData.userRank,
                            userAccount: this.editData.userAccount,
                            noRepeat: '.no-repeat-click5'
                        }).then(() => {
                            this.editIsShow = false;
                            this.pageNo = 1;
                            this.getList();
                        });
                    }
                });
            },
            handleSelectionChange(val) { // 选择用户角色表格
                this.multipleSelection = val;
            },
            handleSelectionChange2(val) { // 选择用户角色配置表格
                this.multipleSelection2 = val;
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
            roleConfig(row){ // 角色配置
                this.roleConfigIsShow = true;
                this.$refs.userTable.clearSelection();
                this.$refs.userTable.toggleRowSelection(row,true);
                this.roleConfigSelectId = row;
                axiosPost('/systemMgr/user/roleList',{
                    userId: row.userId,
                    loading: '.loading-table2'
                }).then((res) => {
                    this.roleConfigData = res.data;
                    this.roleConfigData.forEach((item,ind) => {
                        if(item.isHave == true){
                            setTimeout(() => {
                                this.$refs.roleConfigRef.toggleRowSelection(this.roleConfigData[ind],true); // 通过判断选中默认的数据
                            })
                        }
                    });
                });
            },
            roleConfigSubmit(){ // 角色配置 提交
                let idArr = this.multipleSelection2.map((item) => {
                    return item.roleId;
                });
                axiosPost('/systemMgr/user/alterRole',{
                    roleIds: idArr,
                    userId: this.roleConfigSelectId.userId,
                    noRepeat: '.no-repeat-click6'
                }).then(() => {
                    this.roleConfigIsShow = false;
                });
            },
            closeRoleConfig(){ // 关闭角色配置 弹窗
                this.$refs.roleConfigRef.clearSelection();
            },
            changeTree(Form){ // 下拉框选择出发事件
                this.$refs[Form].validateField('orgValue')
            },
            addClose(addForm){ // 关闭添加弹窗时清空验证
                this.$refs[addForm].resetFields();
            },
            enableFun(row){ // 启用
                this.enableData = row;
                this.enableIsShow = true;
            },
            enableSubmit(){ // 启用 提交
                axiosPost('/systemMgr/user/permit',{
                    userId: this.enableData.userId,
                    noRepeat: '.no-repeat-click7'
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
                axiosPost('/systemMgr/user/forbid',{
                    userId: this.prohibitData.userId,
                    noRepeat: '.no-repeat-click8'
                }).then(()=>{
                    this.prohibitIsShow = false;
                    this.getList();
                })
            },
            opens(form){ // vue-selectTree打开时隐藏el-select
                if(form == 'addForm'){
                    this.$refs.elSelect1.blur();
                    this.$refs.elSelect2.blur();
                }else{
                    this.$refs.elSelect3.blur();
                    this.$refs.elSelect4.blur();
                }
            },
        }
    }
</script>
<style scoped>
    .menu4 .el-table span{
        font-size: 14px;
        color: #409EFF;
        padding-right: 8px;
        cursor: pointer;
    }
    .vue-treeselect{
        width: 200px;
        float: left;
    }
    .orgId-p>span{
        float: left;
        line-height: 40px;
    }
</style>
