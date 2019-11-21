<template><!-- 知识体系管理 zhiyong.li -->
    <div class="know-management">
        <h2 class="title-h2">知识体系管理</h2>
        <div class="search-container">
            <div class="curriculum-button">
                <el-button size="small" @click="addFun({id: 'root'})" v-if="operationData.includes('e176e710')">新增主知识体系</el-button>
            </div>
        </div>
        <el-table :data="record" style="width: 100%;" border ref="mechanismTable" row-key="id" class="loading-table" :expand-row-keys="expands"
                  @expand-change="expandChange" size="mini">
            <el-table-column prop="knowName" label="知识体系名称"></el-table-column>
            <el-table-column prop="sortno" label="排序号" align="center"></el-table-column>
            <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="knowLevel" label="知识体系级别" align="center"></el-table-column>
            <el-table-column prop="isLine" label="类型" align="center">
                <template slot-scope="scope">
                    {{scope.row.isLine ? dictionariesNameData[scope.row.isLine] : ''}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="80">
                <template slot-scope="scope">
                    {{scope.row.status ? dictionariesNameData[scope.row.status] : ''}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <span @click="editFun(scope.row)" v-if="operationData.includes('f77cdbcc')">编辑</span>
                    <span @click="addFun(scope.row)" v-if="operationData.includes('eddfae5d')">新增子知识体系</span>
                    <span @click="enableFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '停用' && operationData.includes('bbdc355a')">启用</span>
                    <span @click="prohibitFun(scope.row)" v-if="dictionariesNameData[scope.row.status] == '启用' && operationData.includes('4b04472e')">停用</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增弹窗 -->
        <el-dialog title="新增" :visible.sync="addIsShow" @close='remodalClose("addForm")' class="need-header">
            <div class="add-form clearfix">
                <el-form :model="addData" :inline="true" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="体系名称" prop="knowName" size="small">
                        <el-input v-model="addData.knowName" placeholder="请输入知识体系名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sortno" size="small">
                        <el-input v-model="addData.sortno" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <el-form-item label="体系描述" prop="knowDesc" size="small">
                        <el-input type="textarea" :rows="3" v-model="addData.knowDesc" placeholder="请输入知识体系描述"></el-input>
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
                    <el-form-item label="体系名称" prop="knowName" size="small">
                        <el-input v-model="editData.knowName" placeholder="请输入知识体系名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sortno" size="small">
                        <el-input v-model="editData.sortno" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <el-form-item label="体系描述" prop="knowDesc" size="small">
                        <el-input type="textarea" :rows="3" v-model="editData.knowDesc" placeholder="请输入知识体系描述"></el-input>
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
    </div>
</template>

<script>
    import {axiosPost,getDictionariesAllData,getDictionariesNameData,getOperationData} from "@/assets/js/api";
    import{ intValidate } from '@/assets/js/verification'
    export default {
        name: 'know-management',
        data(){
            return {
                record: [],
                addIsShow: false, // 新增弹窗
                editIsShow: false, // 编辑弹窗
                deleteIsShow: false, // 删除弹窗
                enableIsShow: false, // 启用
                prohibitIsShow: false, // 停用
                rules: { // 规则
                    knowName: [
                        { required: true, message: '请输入知识体系名称',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    sortno: [
                        { required: true, message: '请输入排序号',trigger: 'blur'},
                        { validator: intValidate,message: '请输入正确的排序号',trigger: 'blur'},
                        { max: 4, message: '长度应小于等于4个字符', trigger: 'blur' }
                    ],
                    knowDesc: [
                        { required: true, message: '请输入知识体系描述',trigger: 'blur'},
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                        ]
                },
                addData:{ // 新增数据
                    knowName: '',
                    sortno: '',
                    knowDesc: '',
                    pid: ''
                },
                editData:{ // 编辑数据
                    knowName: '',
                    sortno: '',
                    knowDesc: '',
                    id: ''
                },
                enableData: {}, // 启用数据
                prohibitData: {}, // 停用数据
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
            getOperationData("知识体系管理")
                .then(res => {
                    this.operationData = res;
                });
            this.getList();
        },
        methods:{
            getList(){ // 获取机构列表
                axiosPost('/systemMgr/know/tree',{
                    loading: '.loading-table'
                })
                    .then( res => {
                        this.record = res.data;
                    })
            },
            addFun(row){ // 新增
                this.addIsShow = true;
                this.addData.pid = row.id;
            },
            addSubmit(formName){ // 新增 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/know/create',{
                            knowName: this.addData.knowName,
                            sortno: this.addData.sortno,
                            knowDesc: this.addData.knowDesc,
                            pid: this.addData.pid,
                            noRepeat: '.no-repeat-click'
                        })
                            .then(() => {
                                this.addIsShow = false;
                                this.addData = {};
                                this.getList();
                            })
                    }
                });
            },
            editFun(row){ // 编辑
                this.editData.knowName = row.knowName;
                this.editData.sortno = window.String(row.sortno);
                this.editData.knowDesc = row.knowDesc;
                this.editData.id = row.id;
                this.editIsShow = true;
            },
            editSubmit(formName){ // 编辑 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/systemMgr/know/alter',{
                            knowName: this.editData.knowName,
                            sortno: this.editData.sortno,
                            knowDesc: this.editData.knowDesc,
                            id: this.editData.id,
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
                axiosPost('/systemMgr/know/permit',{
                    id: this.enableData.id,
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
                axiosPost('/systemMgr/know/forbid',{
                    id: this.prohibitData.id,
                    noRepeat: '.no-repeat-click4'
                }).then(()=>{
                    this.prohibitIsShow = false;
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
    .know-management >>> .el-textarea{
        width: 200px;
    }
    .know-management >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
</style>
