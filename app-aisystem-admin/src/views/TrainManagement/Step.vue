<template>
    <div>
        <h2 class="title-h2">环节管理</h2>
        <div class="search-container">
            <el-form size="small" :inline="true" :model="formSearch" class="demo-form-inline" label-width="100px">
                <el-form-item label="知识体系：">
                    <treeselect 
                        v-model="formSearch.knowledgePath"
                        :options="knowAllData"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="环节名称：">
                    <el-input v-model="formSearch.nodeName" placeholder="请输入环节名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" @click="dialogVisible = true" v-if="operationData.includes('49060ab0')">新增</el-button>
            <el-button size="small" @click="remove" v-if="operationData.includes('04bc2944')">删除</el-button>
        </div>
        <div class="loading-table">
            <el-table 
                border
                size="mini"
                :data="dataList.records" 
                tooltip-effect="dark" 
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection" 
                    align="center"
                    width="40">
                </el-table-column>
                <el-table-column
                    :formatter="getKnowName"
                    align="center"
                    label="知识体系">
                </el-table-column>
                <el-table-column
                    prop="nodeName"
                    align="center"
                    label="环节名称">
                </el-table-column>
                <el-table-column
                    prop="nodeWeight"
                    align="center"
                    label="分值权重">
                </el-table-column>
                <el-table-column
                    prop="createUser"
                    align="center"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" v-if="operationData.includes('167780d8')" @click="btnEdit(scope.row.id)">编辑</el-button>
                        </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <span>一共 <span class="total">{{dataList.total}}</span> 条数据</span>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="formSearch.pageSize"
                    layout="sizes, prev, pager, next, jumper"
                    :total="dataList.total"
                    :current-page.sync="formSearch.pageNo">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            @close="resetForm('ruleForm')"
            :visible.sync="dialogVisible"
            width="800px">
            <h2 slot="title" class="title-h2">{{formData.id ? '编辑' : '新增'}}</h2>
            <el-form 
                size="small"
                :model="formData"
                :rules="rules" 
                label-width="120px" 
                inline 
                ref="ruleForm">
                <el-form-item label="知识体系：" prop="knowledgePath" style="width: 100%;">
                    <treeselect 
                        v-model="formData.knowledgePath"
                        :options="knowAllData"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        :disable-branch-nodes="true"
                        @input="chengeTreeSelect"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="环节名称：" prop="nodeName">
                    <el-input v-model="formData.nodeName" placeholder="请输入环节名称"></el-input>
                </el-form-item>
                <el-form-item label="分值权重：" prop="nodeWeight">
                    <el-input :maxlength="3" v-model="formData.nodeWeight" placeholder="请输入分值权重"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('ruleForm')" class="el-btn-min-100 no-repeat-1">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    axiosPost,
    getMapNameData,
    getKnowTraimData,
    getOperationData
} from "@/assets/js/api";
import{
    NumberValidate
} from '@/assets/js/verification'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'step',
    components:{
        Treeselect
    },
    data() {
        return {
            mapNameData: [],
            knowAllData: [], // 获取知识体系字典项数据
            operationData: [],
            formSearch: {
                pageNo: 1,
                pageSize: 5
            },
            dataList: {},
            dataListChecked: [],
            dialogVisible: false,
            formData: {},
            rules: {
                nodeWeight: [
                    { required: true, message: '请输入分值权重', trigger: 'change'},
                    { validator: NumberValidate, message: '请输入数字',trigger: 'blur'}
                ],
                nodeName: [
                    { required: true, message: '请输入环节名称', trigger: 'blur' },
                    { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                ],
                knowledgePath: [
                    { required: true, message: '请选择知识体系', trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getKnowTraimData('node').then(res => { // 知识体系
            this.knowAllData = res;
        });
        getOperationData().then(res => {
            this.operationData = res;
        });
        this.search();
    },
    methods: {
        chengeTreeSelect(){ // tree change
            if(this.dialogVisible) {
                this.$refs['ruleForm'].validateField('knowledgePath');
            }
        },
        normalizer(node) { // 知识体系树
            return {
                id: node.path,
                label: node.knowName,
                children: node.children,
            }
        },
        search() {
            this.formSearch.pageNo = 1;
            this.getList();
        },
        reset() {
            var obj = this.formSearch;
            this.formSearch = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            }
        },
        getList() {
            this.formSearch.loading = '.loading-table';
            axiosPost('/trainMgr/nodeMgr/list',this.formSearch).then(res => {
                if(res.code == 1000) {
                    this.dataList = res.data;
                }
            })
        },
        handleSelectionChange(res) {
            this.dataListChecked = res;
        },
        handleSizeChange(res){ // 更改条数
            this.formSearch.pageNo = 1;
            this.formSearch.pageSize = res;
            this.getList();
        },
        handleCurrentChange(res){ // 更改页数
            this.formSearch.pageNo = res;
            this.getList();
        },
        btnEdit(id) {
            axiosPost('/trainMgr/nodeMgr/detail',{id: id}).then(res => {
                if(res.code == 1000) {
                    this.dialogVisible = true;
                    this.formData = res.data;
                }
            })
        },
        remove() {
            if(this.dataListChecked.length < 1) {
                this.$message({message:'请至少选择一条数据',type: 'warning'});
                return;
            }
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var ids = [];
                this.dataListChecked.forEach(item => {
                    ids.push(item.id);
                })
                axiosPost('/trainMgr/nodeMgr/delete',{ids: ids.join(',')}).then(res => {
                    if(res.code == 1000) {
                        this.search();
                    }
                })
            }).catch(() => {   

            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.formData = {};
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addEdit();
                } else {
                    return false;
                }
            });
        },
        addEdit() {
            this.formData.noRepeat = '.no-repeat-1'
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            var URL = this.formData.id ? '/trainMgr/nodeMgr/alter' : '/trainMgr/nodeMgr/create'
            axiosPost(URL,this.formData).then(res => {
                if(res.code == 1000) {
                    this.dialogVisible = false;
                    this.search();
                }
            })
        },
        getKnowName(row) {
            return this.mapNameData[row.knowledgeId] ? this.mapNameData[row.knowledgeId].knowName : '';
        },
    },
}
</script>

<style lang="scss" scoped>
    .vue-treeselect{
        width: 200px;
        float: left;
    }
</style>
