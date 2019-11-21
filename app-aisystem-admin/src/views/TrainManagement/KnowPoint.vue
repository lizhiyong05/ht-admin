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
                <el-form-item label="知识点：">
                    <el-input v-model="formSearch.knowTitle" placeholder="请输入知识点"></el-input>
                </el-form-item>
                <el-form-item label="知识内容：">
                    <el-input v-model="formSearch.knowContent" placeholder="请输入知识内容"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" @click="btnImport" v-if="operationData.includes('e06fd9a8')">导入</el-button>
            <el-button size="small" @click="dialogVisible = true" v-if="operationData.includes('75fa990c')">新增</el-button>
            <el-button size="small" @click="remove" v-if="operationData.includes('663c28ec')">删除</el-button>
        </div>
        <div class="loading-table-1">
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
                    prop="knowTitle"
                    align="center"
                    label="知识点">
                </el-table-column>
                <el-table-column
                    prop="knowContent"
                    align="center"
                    label="知识内容">
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
                            <el-button type="text" size="mini" v-if="operationData.includes('c6bece7b')" @click="btnEdit(scope.row.id)">编辑</el-button>
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
                <el-form-item label="知识点：" prop="knowTitle">
                    <el-input style="width: 550px;" v-model="formData.knowTitle" :autosize="{minRows: 2}" type="textarea" placeholder="请输入知识点"></el-input>
                </el-form-item>
                <el-form-item label="知识内容：" prop="knowContent">
                    <el-input style="width: 550px;" v-model="formData.knowContent" :autosize="{minRows: 2}" type="textarea" placeholder="请输入知识内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('ruleForm')" class="el-btn-min-100 no-repeat-1">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="importVisible"
            width="800px">
            <h2 slot="title" class="title-h2">文件导入</h2>
            <el-form label-width="100px" size="small">
                <el-form-item label="选择文件：">
                    <input id="fileUpload" type="file" style="display: none;" @change="importFile">
                    <el-input style="width: 300px;margin-right: 20px;margin-bottom: 20px;" readonly placeholder="请选择文件" v-model="fileName"></el-input>
                    <el-button type="primary" @click="selectFile" class="el-btn-min-100">选择</el-button>
                    <el-button @click="importVisible = false" class="el-btn-min-100">取消</el-button> <br>
                    <el-button type="primary" @click="moduleUpload" class="el-btn-min-100">下载模板</el-button>
                    <el-button type="primary" @click="$refs.moduleFile.click()" class="el-btn-min-100">上传模板</el-button>
                    <input ref="moduleFile" type="file" style="display: none;" @change="importModule">
                </el-form-item>
            </el-form>
            <p class="title">
                <span class="sub-title">导入结果</span>
            </p>
            <p class="result-title">1.Excel中不符合格式要求的数据：</p>
            <el-table 
                size="mini"
                border
                :data="fileResult.errList" 
                tooltip-effect="dark">
                <el-table-column
                    type="index" 
                    width="60"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="list"
                    align="center"
                    label="不符合格式要求的原因">
                </el-table-column>
            </el-table>
            <p class="result-title">2.数据导入的结果：</p>
            <el-table 
                border
                size="mini"
                :data="fileResult.result" 
                tooltip-effect="dark">
                <el-table-column
                    type="index" 
                    width="60"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="list"
                    align="center"
                    label="数据导入的结果">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import {
    axiosPost,
    trainFileUplaod,
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
    name: 'konwPoint',
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
                knowTitle: [
                    { required: true, message: '请输入知识点', trigger: 'blur' },
                    { max: 500, message: '长度应小于等于500个字符', trigger: 'blur' }
                ],
                knowContent: [
                    { required: true, message: '请输入知识内容', trigger: 'blur' },
                    { max: 4000, message: '长度应小于等于4000个字符', trigger: 'blur' }
                ],
            },
            importVisible: false,
            fileName: '',
            fileResult: {},
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
            this.formSearch.loading = '.loading-table-1';
            axiosPost('/trainMgr/knowMgr/list',this.formSearch).then(res => {
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
            axiosPost('/trainMgr/knowMgr/detail',{id: id}).then(res => {
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
                axiosPost('/trainMgr/knowMgr/delete',{ids: ids.join(',')}).then(res => {
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
            if(!this.formData.id) {
                this.formData.knowGroupId = this.knowGroupId;
            }
            this.formData.noRepeat = '.no-repeat-1'
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            var URL = this.formData.id ? '/trainMgr/knowMgr/alter' : '/trainMgr/knowMgr/create'
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
        btnImport() {
            this.fileName = '';
            this.fileResult = {};
            this.importVisible = true;
        },
        selectFile() {
            document.getElementById('fileUpload').click();
        },
        importFile() {
            var fileUploadDOM = document.getElementById('fileUpload');
            var params = {
                file: fileUploadDOM.files[0]
            }
            this.fileName = fileUploadDOM.files[0].name;
            trainFileUplaod('/trainMgr/knowMgr/knowImport', params).then(res => {
                if(res.code == 1000) {
                    this.search();
                    this.fileResult = {
                        result: [],
                        errList: [],
                    }
                    res.data.result.forEach(item => {
                        this.fileResult.result.push({
                            list: item
                        })
                    })
                    res.data.errList.forEach(item => {
                        this.fileResult.errList.push({
                            list: item
                        })
                    })
                }
            }).finally(() => {
                fileUploadDOM.value = '';
            })
        },
        importModule() {
            var fileUploadDOM = this.$refs.moduleFile;
            var params = {
                file: fileUploadDOM.files[0],
                name: 'know'
            }
            trainFileUplaod('/trainMgr/special/uploadFile', params).then(res => {
                if(res.code == 1000) {
                    this.$message({message: '上传成功',type: 'success'});
                }
            }).finally(() => {
                fileUploadDOM.value = '';
            })
        },
        moduleUpload() {
            axiosPost('/trainMgr/special/downloadFile',{
                name: 'know'
            }).then(res => {
                if(res.code == 1000) {
                    window.open(res.data)
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
    .vue-treeselect{
        width: 200px;
        float: left;
    }
    .result-title {
        font-size: 14px;
        margin: 10px 0;
    }
    .title {
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
    }
    .sub-title {
        display: inline-block;
        border: 1px solid #ccc;
        background: #eee;
        color: #333;
        padding: 5px 8px;
    }
</style>
