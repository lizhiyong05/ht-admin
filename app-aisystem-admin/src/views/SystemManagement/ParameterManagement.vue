<template><!-- 参数管理 zhiyong.li -->
    <div class="param-management">
        <h2 class="title-h2">参数管理</h2>
        <div class="search-container">
            <div class="curriculum-button">
                <el-button size="small" @click="addFun({id: 'root'})" v-if="operationData.includes('54b876be')">新增主参数</el-button>
            </div>
        </div>
        <el-table :data="record" style="width: 100%;" border row-key="id" ref="mechanismTable" class="loading-table" :expand-row-keys="expands" size="mini">
            <el-table-column prop="paramName" label="参数名称"></el-table-column>
            <el-table-column prop="paramValue" label="参数值" align="center"></el-table-column>
            <el-table-column prop="sortno" label="排序号" align="center"></el-table-column>
            <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column label="状态" width="80" align="center">
                <template slot-scope="scope">
                    {{scope.row.status ? dictionariesNameData[scope.row.status] : ''}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <span @click="editFun(scope.row)" v-if="operationData.includes('5a1fbdda')">编辑</span>
                    <span @click="addFun(scope.row)" v-if="operationData.includes('a6ed8615')">新增子参数</span>
                    <span @click="enableFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '停用' && operationData.includes('ca1d09d1')">启用</span>
                    <span @click="prohibitFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '启用' && operationData.includes('78610f0a')">停用</span>
                    <span @click="deleteFun(scope.row)" v-if="operationData.includes('92caee8b') && dictionariesNameData[scope.row.status] != '启用'">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增弹窗 -->
        <el-dialog title="新增" :visible.sync="addIsShow" @close='remodalClose("addForm")' class="need-header">
            <div class="add-form clearfix">
                <el-form :model="addData" :inline="true" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="参数名称" prop="paramName" size="small">
                        <el-input v-model="addData.paramName" placeholder="请输入参数名称"></el-input>
                    </el-form-item>
                    <el-form-item label="参数值" prop="paramValue" size="small">
                        <el-input v-model="addData.paramValue" placeholder="请输入参数值"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sortno" size="small">
                        <el-input v-model="addData.sortno" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <el-form-item label="参数类型" prop="paramType" size="small">
                        <el-select v-model="addData.paramType" placeholder="请选择参数类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['paramType']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="参数描述" prop="paramDesc" size="small">
                        <el-input type="textarea" :rows="3" v-model="addData.paramDesc" placeholder="请输入参数描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addIsShow = false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="addSubmit('addForm')" class="el-btn-min-100 no-repeat-click" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" :visible.sync="editIsShow" @close='remodalClose("editForm")' class="need-header">
            <div class="edit-form clearfix">
                <el-form :model="editData" :inline="true" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="参数名称" prop="paramName" size="small">
                        <el-input v-model="editData.paramName" placeholder="请输入参数名称"></el-input>
                    </el-form-item>
                    <el-form-item label="参数值" prop="paramValue" size="small">
                        <el-input v-model="editData.paramValue" placeholder="请输入参数值"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sortno" size="small">
                        <el-input v-model="editData.sortno" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <el-form-item label="参数类型" prop="paramType" size="small">
                        <el-select v-model="editData.paramType" placeholder="请选择参数类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['paramType']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="参数描述" prop="paramDesc" size="small">
                        <el-input type="textarea" :rows="3" v-model="editData.paramDesc" placeholder="请输入参数描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editIsShow = false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="editSubmit('editForm')" class="el-btn-min-100 no-repeat-click2" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 启用弹窗 -->
        <el-dialog :visible.sync="enableIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要启用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="enableIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="enableSubmit" class="el-btn-min-100 no-repeat-click3" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 停用弹窗 -->
        <el-dialog :visible.sync="prohibitIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要停用吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="prohibitIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="prohibitSubmit" class="el-btn-min-100 no-repeat-click4" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 删除数据 -->
        <el-dialog :visible.sync="deleteIsShow" class="el-dialog-500">
            <div class="dialog-container">
                <p class="align-center">确定要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="deleteSubmit" class="el-btn-min-100 no-repeat-click5" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesAllData,getDictionariesNameData,getOperationData} from "@/assets/js/api";
    import{ intValidate } from '@/assets/js/verification'
    export default {
        name: 'param-management',
        data(){
            return {
                record: [],
                addIsShow: false, // 新增弹窗
                editIsShow: false, // 编辑弹窗
                deleteIsShow: false, // 删除弹窗
                enableIsShow: false, // 启用
                prohibitIsShow: false, // 停用
                rules: { // 规则
                    paramName: [
                        { required: true, message: '请输入参数名称',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    paramValue: [
                        { required: true, message: '请输入参数值',trigger: 'blur'},
                        { max: 128, message: '长度应小于等于128个字符', trigger: 'blur' }
                    ],
                    sortno: [
                        { required: true, message: '请输入排序号',trigger: 'blur'},
                        { validator: intValidate,message: '请输入正确的排序号',trigger: 'blur'},
                        { max: 4, message: '长度应小于等于4个字符', trigger: 'blur' }
                    ],
                    paramDesc: [
                        { required: true, message: '请输入参数描述',trigger: 'blur'},
                        { max: 128, message: '长度应小于等于128个字符', trigger: 'blur' }
                    ],
                    paramType: [
                        { required: true, message: '请选择参数类型',trigger: 'blur'}
                    ]
                },
                addData:{ // 新增数据
                    paramName: '',
                    paramValue: '',
                    sortno: '',
                    paramDesc: '',
                    paramKey: '',
                    paramType: ''
                },
                editData:{ // 编辑数据
                    paramName: '',
                    paramValue: '',
                    sortno: '',
                    paramDesc: '',
                    parentKey: '',
                    paramType: ''
                },
                enableData: {}, // 启用数据
                prohibitData: {}, // 停用数据
                deleteData:{}, // 删除数据
                dictionariesNameData: {}, // 字典数据
                dictionariesAllData: {},
                operationData: [], // 操作权限
                expands: [] // 默认展开项
            }
        },
        created(){
            getDictionariesAllData()
                .then(res => {
                    this.dictionariesAllData = res;
                });
            getDictionariesNameData()
                .then(res => {
                    this.dictionariesNameData = res;
                });
            getOperationData("参数管理")
                .then(res => {
                    this.operationData = res;
                });
            this.getList();
        },
        methods:{
            getList(){ // 获取机构列表
                axiosPost('/systemMgr/param/tree',{
                    loading: '.loading-table'
                })
                    .then( res => {
                        this.record = res.data;
                    })
            },
            addFun(row){ // 新增
                this.addIsShow = true;
                this.addData.parentKey = row.paramKey;
            },
            addSubmit(formName){ // 新增 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/param/create',{
                            paramName: this.addData.paramName,
                            paramValue: this.addData.paramValue,
                            sortno: this.addData.sortno,
                            paramDesc: this.addData.paramDesc,
                            parentKey: this.addData.parentKey,
                            paramType: this.addData.paramType,
                            noRepeat: '.no-repeat-click'
                        })
                            .then(() => {
                                this.addIsShow = false;
                                this.$refs['addForm'].resetFields();
                                this.getList();
                            })
                    }
                });
            },
            editFun(row){ // 编辑
                this.editData.sortno = window.String(row.sortno);
                this.editData.paramName = row.paramName;
                this.editData.paramValue = row.paramValue;
                this.editData.paramDesc = row.paramDesc;
                this.editData.paramKey = row.paramKey;
                this.editData.paramType = row.paramType;
                this.editIsShow = true;
            },
            editSubmit(formName){ // 编辑 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/param/alter',{
                            paramName: this.editData.paramName,
                            paramValue: this.editData.paramValue,
                            sortno: this.editData.sortno,
                            paramDesc: this.editData.paramDesc,
                            paramKey: this.editData.paramKey,
                            paramType: this.editData.paramType,
                            noRepeat: '.no-repeat-click2'
                        })
                            .then(() => {
                                this.editIsShow = false;
                                this.getList();
                            })
                    }
                })
            },
            enableFun(row){ // 启用
                this.enableData = row;
                this.enableIsShow = true;
            },
            enableSubmit(){ // 启用 提交
                axiosPost('/systemMgr/param/permit',{
                    paramKey: this.enableData.paramKey,
                    noRepeat: '.no-repeat-click3'
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
                axiosPost('/systemMgr/param/forbid',{
                    paramKey: this.prohibitData.paramKey,
                    noRepeat: '.no-repeat-click4'
                }).then(()=>{
                    this.prohibitIsShow = false;
                    this.getList();
                })
            },
            deleteFun(row){// 删除
                this.deleteData = row;
                this.deleteIsShow = true;
            },
            deleteSubmit(){ // 删除 提交
                axiosPost('/systemMgr/param/delete',{
                    paramKey: this.deleteData.paramKey,
                    noRepeat: '.no-repeat-click5'
                }).then(()=>{
                    this.deleteIsShow = false;
                    this.getList();
                })
            },
            remodalClose(addForm){ // 弹窗关闭
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
    .curriculum-button{
        margin-top: 20px;
    }
    .param-management >>> .el-textarea{
        width: 200px;
    }
    .param-management >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
</style>
