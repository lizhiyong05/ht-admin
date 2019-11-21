<template>
    <div>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="formSearch" class="demo-form-inline" label-width="100px">
                <el-form-item label="知识体系：">
                    <treeselect 
                        v-model="formSearch.knowledgePath"
                        :options="knowAllData"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item v-if="knowGroupId.split('@')[0] == 4" label="敏感词：">
                    <el-input v-model="formSearch.knowContent" placeholder="请输入敏感词"></el-input>
                </el-form-item>
                <el-form-item v-else label="口头语：">
                    <el-input v-model="formSearch.knowContent" placeholder="请输入口头语"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="loading-table-3" style="margin-top: 20px;">
            <el-table 
                border
                size="mini"
                :data="dataList.records" 
                tooltip-effect="dark" 
                @selection-change="handleSelectionChange">
                <el-table-column
                    :formatter="getKnowName"
                    align="center"
                    label="知识体系">
                </el-table-column>
                <el-table-column
                    prop="knowContent"
                    align="center"
                    :label="knowGroupId.split('@')[0] == 4 ? '敏感词内容' : '口头语内容'">
                </el-table-column>
                <el-table-column
                    prop="updateUser"
                    align="center"
                    label="更新人">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    align="center"
                    label="更新时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" v-if="operationData.includes('6837c828') && knowGroupId.split('@')[0] == 4" @click="btnEdit(scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" v-if="operationData.includes('2597dc55') && knowGroupId.split('@')[0] != 4" @click="btnEdit(scope.row)">编辑</el-button>
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
            <h2 slot="title" class="title-h2">编辑</h2>
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
                        :disabled="true"
                        placeholder="请选择知识体系"
                        :disable-branch-nodes="true"
                        @input="chengeTreeSelect"
                        noResultsText="未找到，请重新输入"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item v-if="knowGroupId.split('@')[0] == 4" label="敏感词：" prop="knowContent">
                    <el-input style="width: 550px;" v-model="formData.knowContent" :autosize="{minRows: 2}" type="textarea" placeholder="请输入敏感词"></el-input>
                    <br><span class="tip-title">（以“顿号”分割每一个敏感词）</span>
                </el-form-item>
                <el-form-item v-else label="口头语：" prop="knowContent">
                    <el-input style="width: 550px;" v-model="formData.knowContent" :autosize="{minRows: 2}" type="textarea" placeholder="请输入口头语"></el-input>
                    <br><span class="tip-title">（以“顿号”分割每一个口头语）</span>
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
    name: 'konwOral',
    components:{
        Treeselect
    },
    props: [
        'knowGroupId'
    ],
    data() {
        return {
            knowAllData: [], // 获取知识体系字典项数据
            operationData: [],
            formSearch: {
                pageNo: 1,
                pageSize: 5
            },
            dataList: {},
            dataListChecked: [],
            mapNameData: [],
            dialogVisible: false,
            formData: {},
            rules: {
                knowledgePath: [
                    { required: true, message: '请选择知识体系', trigger: 'blur' }
                ],
                knowContent: [
                    { required: true, message: '内容不得为空', trigger: 'blur' },
                    { max: 4000, message: '长度应小于等于4000个字符', trigger: 'blur' }
                ],
            },
        }
    },
    watch: {
        knowGroupId() {
            this.reset();
            this.formSearch.pageSize = 5;
            this.search();
        }
    },
    created() {
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getKnowTraimData('know').then(res => { // 知识体系
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
            this.formSearch.knowGroupId = this.knowGroupId;
            this.formSearch.loading = '.loading-table-3';
            axiosPost('/trainMgr/knowMgr/listParam',this.formSearch).then(res => {
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
        btnEdit(row) {
            if(row.id == 0) {
                this.dialogVisible = true;
                this.formData.knowledgePath = row.knowledgePath;
            }else {
                axiosPost('/trainMgr/knowMgr/detailParam',{id: row.id}).then(res => {
                    if(res.code == 1000) {
                        this.formData = res.data;
                        this.dialogVisible = true;
                    }
                })
            }
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
            this.formData.knowGroupId = this.knowGroupId;
            this.formData.noRepeat = '.no-repeat-1'
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            axiosPost('/trainMgr/knowMgr/alterParam',this.formData).then(res => {
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
    .tip-title {
        font-size: 12px;
        color: #999;
    }
</style>
