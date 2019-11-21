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
                        @open="$refs.select1 && $refs.select1.blur()"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="关联环节：" v-if="knowGroupId.split('@')[0] == 2">
                    <el-select ref="select1" v-model="formSearch.relaNode" placeholder="请选择关联环节">
                        <el-option
                            v-for="item in stepList"
                            :key="item.nodeId"
                            :label="item.nodeName"
                            :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="场景问题：">
                    <el-input v-model="formSearch.knowTitle" placeholder="请输入场景问题"></el-input>
                </el-form-item>
                <el-form-item label="推荐话术：">
                    <el-input v-model="formSearch.knowContent" placeholder="请输入推荐话术"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button" v-if="knowGroupId.split('@')[0] == 2">
            <el-button size="small" @click="btnImport" v-if="operationData.includes('d1b9d9f1')">导入</el-button>
            <el-button size="small" @click="dialogVisible = true" v-if="operationData.includes('cabb9a8a')">新增</el-button>
            <el-button size="small" @click="remove" v-if="operationData.includes('d6f6bc41')">删除</el-button>
        </div>
        <div class="curriculum-button" v-else>
            <el-button size="small" @click="btnImport" v-if="operationData.includes('1fe8d1dc')">导入</el-button>
            <el-button size="small" @click="dialogVisible = true" v-if="operationData.includes('ed7badd8')">新增</el-button>
            <el-button size="small" @click="remove" v-if="operationData.includes('886c2a1a')">删除</el-button>
        </div>
        <div class="loading-table-2">
            <el-table 
                border
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
                    v-if="knowGroupId.split('@')[0] == 2"
                    prop="relaNode"
                    align="center"
                    label="关联环节">
                </el-table-column>
                <el-table-column
                    prop="knowTitle"
                    align="center"
                    label="场景问题(机器人)">
                </el-table-column>
                <el-table-column
                    prop="knowContent"
                    align="center"
                    label="推荐话术(学员)">
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
                            <el-button type="text" size="mini" v-if="operationData.includes('55b5c29b') && knowGroupId.split('@')[0] == 2" @click="btnEdit(scope.row.id)">编辑</el-button>
                            <el-button type="text" size="mini" v-if="operationData.includes('183df2c9') && knowGroupId.split('@')[0] != 2" @click="btnEdit(scope.row.id)">编辑</el-button>
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
                        @open="$refs.select2 && $refs.select2.blur()"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="关联环节：" v-if="knowGroupId.split('@')[0] == 2">
                    <el-select ref="select2" v-model="formData.relaNode" placeholder="请选择关联环节">
                        <el-option
                            v-for="item in stepList2"
                            :key="item.nodeId"
                            :label="item.nodeName"
                            :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="场景问题：" prop="knowTitle">
                    <el-input style="width: 550px;" v-model="formData.knowTitle" :autosize="{minRows: 2}" type="textarea" placeholder="请输入场景问题"></el-input>
                    <i @click="getAudio(formData)" v-if="formData.id" class="iconfont htfg-customerservice_fill"></i>
                </el-form-item>
                <p class="line"></p>
                <div v-for="(item, index) in formData.listContent" :key="index">
                    <el-form-item 
                        required
                        :show-message="false"
                        :prop="'listContent.'+ index +'.knowContent'"
                        :label="'推荐话术'+ (index + 1) +'：'">
                        <el-input style="width: 500px;" :maxlength="4000" v-model="item.knowContent" :autosize="{minRows: 2}" type="textarea" placeholder="4000字以内"></el-input>
                        <i @click="getAudio(item)" v-if="item.relaId && item.id" class="iconfont htfg-customerservice_fill"></i>
                        <i @click="itemDelete('listContent', index)" v-if="formData.listContent.length > 1" class="el-icon-delete"></i>
                        <i @click="itemAdd('listContent')" v-if="index == formData.listContent.length - 1 && formData.listContent.length < 10" class="el-icon-circle-plus-outline"></i>
                        <p>
                            <span style="color: #606266;">适合客户属性：</span>
                            <el-radio-group v-model="item.custAttr">
                                <el-radio v-for="(item2, index2) in custAttr" :key="index2" :label="item2">{{item2}}</el-radio>
                            </el-radio-group>
                        </p>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small" class="el-btn-min-100">取消</el-button>
                <el-button type="primary" size="small" @click="submitForm('ruleForm')" class="el-btn-min-100 no-repeat-2">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="voiceVisible"
            width="800px">
            <h2 slot="title" class="title-h2">不同发音的录音调听如下：</h2>
            <el-table 
                border
                :data="voiceList" 
                tooltip-effect="dark">
                <el-table-column
                    type="index" 
                    width="60"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="voiceKind"
                    align="center"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="voiceType"
                    align="center"
                    label="类型">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="350"
                    label="操作">
                        <template slot-scope="scope">
                            <!-- <span class="iconfont htfg-customerservice_fill ear" @click="listen(scope.row)"></span> -->
                            <audio :ref="'audio' + scope.row.id" controls :src="scope.row.voicePath"></audio>
                        </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="voiceVisible = false" size="small" class="el-btn-min-100">取消</el-button>
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
                size="mini"
                border
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
    name: 'konwQuestion',
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
            stepList: [],
            stepList2: [],
            dialogVisible: false,
            voiceVisible: false,
            voiceList: [],
            formData: {
                knowledgePath: null,
                listContent: [{}]
            },
            rules: {
                knowledgePath: [
                    { required: true, message: '请选择知识体系', trigger: 'blur' }
                ],
                knowTitle: [
                    { required: true, message: '请输入场景问题', trigger: 'blur' },
                    { max: 500, message: '长度应小于等于500个字符', trigger: 'blur' }
                ],
            },
            custAttr: [],
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
        },
        'formSearch.knowledgePath' (val) {
            delete this.formSearch.relaNode
            this.stepList = [];
            if(val) {
                this.getStepList(val.split('/').reverse()[0], 1);
            }
        },
        'formData.knowledgePath' (val, old) {
            if(old !== null) {
                delete this.formData.relaNode
            }
            this.stepList2 = [];
            this.custAttr = [];
            if(val) {
                this.getStepList(val.split('/').reverse()[0], 2);
                this.getCustAttr(val.split('/').reverse()[0]);
            }
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
            this.formSearch.loading = '.loading-table-2';
            axiosPost('/trainMgr/knowMgr/listContent',this.formSearch).then(res => {
                if(res.code == 1000) {
                    this.dataList = res.data;
                }
            })
        },
        getCustAttr(id) {
            axiosPost('/trainMgr/paramMgr/custAttr',{knowledgeId: id}).then(res => {
                if(res.code == 1000) {
                    this.custAttr = res.data && res.data.custAttr || [];
                    if(this.custAttr.length == 0) {
                        this.formData.listContent.forEach(item => {
                            delete item.custAttr;
                        })
                    }
                }
            })
        },
        getStepList(id, type) {
            axiosPost('/trainMgr/paramMgr/queryNodeByKowId',{knowledgeId: id}).then(res => {
                if(res.code == 1000) {
                    if(type == 1) {
                        this.stepList = res.data;
                    }else {
                        this.stepList2 = res.data;
                    }
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
            this.formData.knowledgePath = null;
            axiosPost('/trainMgr/knowMgr/detailContent',{id: id}).then(res => {
                if(res.code == 1000) {
                    res.data.relaNode = Number(res.data.relaNode) || ''
                    this.formData = res.data;
                    this.dialogVisible = true;
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
                axiosPost('/trainMgr/knowMgr/deleteContent',{ids: ids.join(',')}).then(res => {
                    if(res.code == 1000) {
                        this.search();
                    }
                })
            }).catch(() => {   

            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.formData = {
                knowledgePath: null,
                listContent: [{}]
            };
            this.stepList2 = [];
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
            this.formData.noRepeat = '.no-repeat-2';
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            var URL = this.formData.id ? '/trainMgr/knowMgr/alterContent' : '/trainMgr/knowMgr/createContent'
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
        itemDelete(list, index) {
            this.formData[list].splice(index, 1);
        },
        itemAdd(list) {
            this.formData[list].push({})
        },
        getAudio(item) {
            if(item.relaId) {
                var params = {
                    relaId: item.relaId,
                    contentId: item.id
                }
            }else {
                var params = {
                    relaId: item.id,
                }
            }
            axiosPost('/trainMgr/knowMgr/listVoice', params).then(res => {
                if(res.code == 1000) {
                    this.voiceList = res.data;
                    this.voiceVisible = true;
                }
            })
        },
        listen(row) {
            if(row.voicePath.indexOf('null') > -1) {
                this.$message({message:'解析录音文件路径错误，请重新获取',type: 'warning'});
                return;
            }
            var audio = this.$refs['audio' + row.id];
            if(audio.paused) {
                audio.play();
            }else {
                audio.pause();
            }
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
            var URL = this.knowGroupId.split('@')[0] == 2 ? '/trainMgr/knowMgr/knowFixedImport' : '/trainMgr/knowMgr/knowRandomImport'
            trainFileUplaod(URL, params).then(res => {
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
                name: this.knowGroupId.split('@')[0] == 2 ? 'fixProblem' : 'RandomProblem'
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
            var str = this.knowGroupId.split('@')[0] == 2 ? 'fixProblem' : 'randomProblem'
            axiosPost('/trainMgr/special/downloadFile',{
                name: str
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
    .el-icon-delete {
        margin-left: 15px;
        margin-top: 6px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: top;
        cursor: pointer;
    }
    .el-icon-circle-plus-outline {
        margin-left: 15px;
        margin-top: 6px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: top;
        cursor: pointer;
    }
    .line {
        border: 1px dashed #eee;
        margin-bottom: 20px;
    }
    .htfg-customerservice_fill {
        margin-left: 15px;
        margin-top: 1px;
        font-size: 21px;
        color: #409EFF;
        vertical-align: top;
        cursor: pointer;
        display: inline-block;
    }
    .htfg-customerservice_fill.ear {
        cursor: pointer;
        font-size: 20px;
        color: #409EFF;
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
