<template>
    <div>
        <h2 class="title-h2">对话管理</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="formSearch" class="demo-form-inline" label-width="100px">
                <el-form-item label="知识体系：">
                    <treeselect 
                        v-model="formSearch.knowledgePath"
                        :options="knowAllData"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        @open="$refs.select1.blur();$refs.select2.blur()"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="关联环节：">
                    <el-select ref="select1" v-model="formSearch.relaNode" placeholder="请选择关联环节">
                        <el-option
                            v-for="item in stepList"
                            :key="item.nodeId"
                            :label="item.nodeName"
                            :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对话名称：">
                    <el-input v-model="formSearch.talkName" placeholder="请输入对话名称"></el-input>
                </el-form-item>
                <el-form-item label="对话状态：">
                    <el-select ref="select2" v-model="formSearch.talkStatus" placeholder="请选择对话状态">
                        <el-option label="正常" :value="true"></el-option>
                        <el-option label="停用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" @click="btnImport" v-if="operationData.includes('b23ccc21')">导入</el-button>
            <el-button size="small" @click="dialogVisible = true" v-if="operationData.includes('4a78917e')">新增</el-button>
            <el-button size="small" @click="remove" v-if="operationData.includes('8b28a266')">删除</el-button>
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
                    prop="talkName"
                    align="center"
                    label="对话名称">
                </el-table-column>
                <el-table-column
                    prop="relaNode"
                    align="center"
                    label="关联环节">
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
                            <el-button type="text" size="mini" v-if="operationData.includes('4d3c6915')" @click="btnEdit(scope.row.id)">编辑</el-button>
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="状态">
                        <template slot-scope="scope">
                            <el-switch 
                                @change="(flag) => enable(flag, scope.row)" 
                                :disabled="!operationData.includes('7c8e3c83')" 
                                v-model="scope.row.talkStatus">
                            </el-switch>
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
            width="900px">
            <h2 slot="title" class="title-h2">{{formData.id ? '编辑' : '新增'}}</h2>
            <el-form 
                size="small"
                :model="formData"
                :rules="rules" 
                label-width="120px" 
                inline 
                ref="ruleForm">
                <p class="title">
                    <span class="sub-title">基本信息</span>
                </p>
                <el-form-item label="知识体系：" prop="knowledgePath">
                    <treeselect 
                        v-model="formData.knowledgePath"
                        :options="knowAllData"
                        :disable-branch-nodes="true"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        @open="$refs.select3.blur();$refs.select4.blur()"
                        @input="chengeTreeSelect"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="关联环节：">
                    <el-select ref="select3" v-model="formData.relaNode" placeholder="请选择关联环节">
                        <el-option
                            v-for="item in stepList2"
                            :key="item.nodeId"
                            :label="item.nodeName"
                            :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对话名称：" prop="talkName">
                    <el-input v-model="formData.talkName" placeholder="请输入对话名称"></el-input>
                </el-form-item>
                <el-form-item label="对话状态：" prop="talkStatus">
                    <el-select ref="select4" v-model="formData.talkStatus" placeholder="请选择对话状态">
                        <el-option label="正常" :value="true"></el-option>
                        <el-option label="停用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对话描述：" prop="talkName">
                    <el-input style="width: 650px;" v-model="formData.talkDesc" :autosize="{minRows: 2}" type="textarea" placeholder="请输入对话描述"></el-input>
                </el-form-item>
                <el-form-item label="对话讲解：" prop="talkExplain">
                    <el-input style="width: 650px;" v-model="formData.talkExplain" :autosize="{minRows: 2}" type="textarea" placeholder="请输入对话讲解"></el-input>
                </el-form-item>
                <p class="title">
                    <span class="sub-title">对话内容</span>
                </p>
                <div v-for="(item, index) in formData.listContent" :key="index">
                    <div v-if="index == 0">
                        <p class="dia-title">1.学员说话内容：</p>
                        <div class="dia-box">
                            <el-form-item 
                                label="参考话术：" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkContent'">
                                <el-input style="width: 600px;" :maxlength="2000" v-model="item.talkContent" placeholder="2000字以内"></el-input>
                            </el-form-item>
                            <i @click="getAudio(item)" v-if="item.talkId && item.id" class="iconfont htfg-customerservice_fill"></i>
                            <el-form-item 
                                label="关键内容：" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkPoint'">
                                <el-input style="width: 300px;" :maxlength="1000" v-model="item.talkPoint" placeholder="1000字以内"></el-input>
                                <span class="tip-title">（检测是否全部覆盖和顺序是否正确？）</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-else>
                        <p class="dia-title" v-if="index == 1">2.机器人回答内容：
                            <el-button @click="itemAdd('listContent')" type="primary" icon="el-icon-plus" size="mini" class="el-btn-min-100">添加回答</el-button>
                        </p>
                        <div class="dia-box" v-show="item.action != 'delete'">
                            <el-form-item 
                                :label="'回答'+ index +'：'" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkContent'">
                                <el-input style="width: 600px;" :maxlength="2000" v-model="item.talkContent" placeholder="2000字以内"></el-input>
                            </el-form-item>
                            <i @click="getAudio(item)" v-if="item.talkId && item.id" class="iconfont htfg-customerservice_fill"></i>
                            <i @click="itemDelete('listContent', index)" v-if="isRemoveShow" class="el-icon-delete"></i>
                            <el-form-item 
                                :label="'意图'+ index +'：'" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkPurpose'">
                                <el-input v-model="item.talkPurpose" :maxlength="15" placeholder="15字以内"></el-input>
                            </el-form-item>
                            <el-form-item 
                                label="概率权重：" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkWeight'">
                                <el-input-number controls-position="right" style="width: 140px;" v-model="item.talkWeight" :min="1" :max="999"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('ruleForm')" class="el-btn-min-100 no-repeat-1">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="voiceVisible"
            width="800px">
            <h2 slot="title" class="title-h2">不同发音的录音调听如下：</h2>
            <el-table 
                border
                size="mini"
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
                <el-button size="small" @click="voiceVisible = false" class="el-btn-min-100">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="importVisible"
            width="800px">
            <h2 slot="title" class="title-h2">文件导入</h2>
            <el-form size="small" label-width="100px">
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
                border
                size="mini"
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
    name: 'dialogue',
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
            stepList: [],
            stepList2: [],
            dataList: {},
            dataListChecked: [],
            dialogVisible: false,
            voiceVisible: false,
            importVisible: false,
            voiceList: [],
            formData: {
                knowledgePath: null,
                listContent: [
                    {talkType: 1, action: 'add'},
                    {talkType: 2, action: 'add'},
                ]
            },
            rules: {
                knowledgePath: [
                    { required: true, message: '请选择知识体系', trigger: 'blur' }
                ],
                talkName: [
                    { required: true, message: '请输入对话名称', trigger: 'blur' },
                    { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                ],
                talkStatus: [
                    { required: true, message: '请选择对话状态', trigger: 'change' }
                ],
                talkDesc: [
                    { max: 1000, message: '长度应小于等于1000个字符', trigger: 'blur' }
                ],
                talkExplain: [
                    { max: 1000, message: '长度应小于等于1000个字符', trigger: 'blur' }
                ],
            },
            fileName: '',
            fileResult: {},
        }
    },
    computed: {
        isRemoveShow() {
            var num = 0
            if(this.formData.id) {
                this.formData.listContent.forEach(item => {
                    item.action == 'delete' ? num++ : null
                })
                return this.formData.listContent.length - num > 2;
            }else {
                return this.formData.listContent.length > 2;
            }
        }
    },
    watch: {
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
            if(val) {
                this.getStepList(val.split('/').reverse()[0], 2);
            }
        }
    },
    created() {
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getKnowTraimData('talk').then(res => { // 知识体系
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
            axiosPost('/trainMgr/talkMgr/list',this.formSearch).then(res => {
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
            trainFileUplaod('/trainMgr/talkMgr/talkImport', params).then(res => {
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
                name: 'talk'
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
                name: 'talk'
            }).then(res => {
                if(res.code == 1000) {
                    window.open(res.data)
                }
            })
        },
        btnEdit(id) {
            this.formData.knowledgePath = null;
            axiosPost('/trainMgr/talkMgr/detail',{id: id}).then(res => {
                if(res.code == 1000) {
                    res.data.relaNode = Number(res.data.relaNode) || ''
                    res.data.listContent.forEach(item => {
                        item.action = 'update'
                    })
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
                axiosPost('/trainMgr/talkMgr/delete',{ids: ids.join(',')}).then(res => {
                    if(res.code == 1000) {
                        this.search();
                    }
                })
            }).catch(() => {   

            });
        },
        enable(flag, row) {
            this.$confirm(`确定${flag ? '启用' : '禁用'}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var URL = flag ? '/trainMgr/talkMgr/permit' : '/trainMgr/talkMgr/forbid'
                axiosPost(URL,{id: row.id}).then(res => {
                    if(res.code == 1000) {
                        this.search();
                    }
                }).catch(() => {
                    row.talkStatus = !flag;
                })
            }).catch(() => {   
                row.talkStatus = !flag;
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.formData = {
                knowledgePath: null,
                listContent: [
                    {talkType: 1, action: 'add'},
                    {talkType: 2, action: 'add'},
                ]
            }
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
            this.formData.noRepeat = '.no-repeat-1'
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            var URL = this.formData.id ? '/trainMgr/talkMgr/alter' : '/trainMgr/talkMgr/create';
            axiosPost(URL,this.formData).then(res => {
                if(res.code == 1000) {
                    this.dialogVisible = false;
                    this.search();
                }
            })
        },
        itemDelete(list, index) {
            if(this.formData[list][index].action == 'add') {
                this.formData[list].splice(index, 1);
            }else {
                this.formData[list][index].action = 'delete';
            }
        },
        itemAdd(list) {
            this.formData[list].push({talkType: 2, action: 'add'})
        },
        getKnowName(row) {
            return this.mapNameData[row.knowledgeId] ? this.mapNameData[row.knowledgeId].knowName : '';
        },
        getAudio(item) {
            var params = {
                relaId: item.talkId,
                contentId: item.id
            }
            axiosPost('/trainMgr/talkMgr/listVoice', params).then(res => {
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
    },
}
</script>

<style lang="scss" scoped>
    .vue-treeselect{
        width: 200px;
        float: left;
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
    .tip-title {
        margin-left: 30px;
        font-size: 12px;
        color: #999;
    }
    .dia-box {
        border-bottom: 1px dashed #eee;
        margin-bottom: 20px;
    }
    .dia-title {
        margin-bottom: 20px;
        font-size: 14px;
    }
    .el-icon-delete {
        margin-left: 15px;
        margin-top: 11px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    .htfg-customerservice_fill {
        margin-left: 15px;
        margin-top: 9px;
        font-size: 21px;
        color: #409EFF;
        vertical-align: middle;
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
</style>
