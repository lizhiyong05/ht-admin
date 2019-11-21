<template>
    <div>
        <h2 class="title-h2">参数管理</h2>
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
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="loading-table">
            <el-table 
                size="mini"
                border
                style="margin-top: 20px;"
                :data="dataList.records" 
                tooltip-effect="dark">
                <el-table-column
                    :formatter="getKnowName"
                    align="center"
                    label="知识体系">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="参数详情">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="operationData.includes('075c3610')" size="mini" @click="btnEdit(scope.row)">编辑</el-button>
                        </template>
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
            width="1000px">
            <h2 slot="title" class="title-h2">编辑参数</h2>
            <el-form 
                size="small"
                :model="formData"
                :rules="rules" 
                label-width="120px" 
                inline 
                ref="ruleForm">
                <div>
                    <p class="title">
                        <span class="sub-title">对练难度参数设置</span>
                        <span class="tip-title">（需要有顺序规则，先扣分最多， 然后其次）</span>
                    </p>
                    <span class="span-title">简单：</span>
                    <el-form-item 
                        label="定向：" 
                        prop="difficulty.easy_a"
                        required
                        :show-message="false">
                        <el-input-number v-model="formData.difficulty.easy_a" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item 
                        label="随机：" 
                        prop="difficulty.easy_b"
                        required
                        :show-message="false">
                        <el-input-number v-model="formData.difficulty.easy_b" :min="0"></el-input-number>
                    </el-form-item>
                    <br>
                    <span class="span-title">一般：</span>
                    <el-form-item 
                        label="定向：" 
                        prop="difficulty.normal_a"
                        required
                        :show-message="false">
                        <el-input-number v-model="formData.difficulty.normal_a" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item 
                        label="随机：" 
                        prop="difficulty.normal_b"
                        required
                        :show-message="false">
                        <el-input-number v-model="formData.difficulty.normal_b" :min="0"></el-input-number>
                    </el-form-item>
                    <br>
                    <span class="span-title">困难：</span>
                    <el-form-item 
                        label="定向：" 
                        prop="difficulty.hard_a"
                        required
                        :show-message="false">
                        <el-input-number v-model="formData.difficulty.hard_a" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item 
                        label="随机：" 
                        prop="difficulty.hard_b"
                        required
                        :show-message="false">
                        <el-input-number v-model="formData.difficulty.hard_b" :min="0"></el-input-number>
                    </el-form-item>
                </div>
                <div>
                    <p class="title">
                        <span class="sub-title">口头语出现次数扣分</span>
                        <span class="tip-title">（需要有顺序规则，先扣分最多， 然后其次）</span>
                    </p>
                    <div v-for="(item, index) in formData.tongue" :key="index">
                        <el-form-item 
                            label="大于等于：" 
                            :prop="'tongue.'+ index +'.range'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.range" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item 
                            label="得分：" 
                            :prop="'tongue.'+ index +'.score'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.score" :max="0"></el-input-number>
                        </el-form-item>
                        <i @click="itemDelete('tongue', index)" v-if="formData.tongue.length > 1" class="el-icon-delete"></i>
                        <i @click="itemAdd('tongue')" v-if="index == formData.tongue.length - 1 && formData.tongue.length < 10" class="el-icon-circle-plus-outline"></i>
                    </div>
                </div>
                <div>
                    <p class="title">
                        <span class="sub-title">敏感词出现次数扣分</span>
                        <span class="tip-title">（需要有顺序规则，先扣分最多， 然后其次）</span>
                    </p>
                    <div v-for="(item, index) in formData.sensitively" :key="index">
                        <el-form-item 
                            label="大于等于：" 
                            :prop="'sensitively.'+ index +'.range'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.range" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item 
                            label="得分：" 
                            :prop="'sensitively.'+ index +'.score'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.score" :max="0"></el-input-number>
                        </el-form-item>
                        <i @click="itemDelete('sensitively', index)" v-if="formData.sensitively.length > 1" class="el-icon-delete"></i>
                        <i @click="itemAdd('sensitively')" v-if="index == formData.sensitively.length - 1 && formData.sensitively.length < 10" class="el-icon-circle-plus-outline"></i>
                    </div>
                </div>
                <div>
                    <p class="title">
                        <span class="sub-title">反应停顿时长扣分</span>
                        <span class="tip-title">（需要有顺序规则，先扣分最多， 然后其次）</span>
                    </p>
                    <div v-for="(item, index) in formData.response" :key="index">
                        <el-form-item 
                            label="大于等于：" 
                            :prop="'response.'+ index +'.range'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.range" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item 
                            label="得分：" 
                            :prop="'response.'+ index +'.score'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.score" :max="0"></el-input-number>
                        </el-form-item>
                        <i @click="itemDelete('response', index)" v-if="formData.response.length > 1" class="el-icon-delete"></i>
                        <i @click="itemAdd('response')" v-if="index == formData.response.length - 1 && formData.response.length < 10" class="el-icon-circle-plus-outline"></i>
                    </div>
                    <p class="tip-content">（单位：秒）</p>
                </div>
                <div>
                    <p class="title">
                        <span class="sub-title">消极情绪概率扣分</span>
                        <span class="tip-title">（需要有顺序规则，先扣分最多， 然后其次）</span>
                    </p>
                    <div v-for="(item, index) in formData.negative" :key="index">
                        <el-form-item 
                            label="大于等于：" 
                            :prop="'negative.'+ index +'.range'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.range" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item 
                            label="得分：" 
                            :prop="'negative.'+ index +'.score'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.score" :max="0"></el-input-number>
                        </el-form-item>
                        <i @click="itemDelete('negative', index)" v-if="formData.negative.length > 1" class="el-icon-delete"></i>
                        <i @click="itemAdd('negative')" v-if="index == formData.negative.length - 1 && formData.negative.length < 10" class="el-icon-circle-plus-outline"></i>
                    </div>
                    <p class="tip-content">（范围：1~100）</p>
                </div>
                <div>
                    <p class="title">
                        <span class="sub-title">积极情绪概率加分</span>
                        <span class="tip-title">（需要有顺序规则，先加分最多， 然后其次）</span>
                    </p>
                    <div v-for="(item, index) in formData.positive" :key="index">
                        <el-form-item 
                            label="大于等于：" 
                            :prop="'positive.'+ index +'.range'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.range" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item 
                            label="得分：" 
                            :prop="'positive.'+ index +'.score'"
                            required
                            :show-message="false">
                            <el-input-number v-model="item.score" :min="0"></el-input-number>
                        </el-form-item>
                        <i @click="itemDelete('positive', index)" v-if="formData.positive.length > 1" class="el-icon-delete"></i>
                        <i @click="itemAdd('positive')" v-if="index == formData.positive.length - 1 && formData.positive.length < 10" class="el-icon-circle-plus-outline"></i>
                    </div>
                    <p class="tip-content">（范围：1~100）</p>
                </div>
                <div>
                    <p class="title">
                        <span class="sub-title">客户人群设置</span>
                        <span class="tip-title">（为定向问题或者异议问题配置答案的选项）</span>
                    </p>
                    <el-tag
                        :key="tag+index"
                        v-for="(tag,index) in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加人群</el-button>
                </div>
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
    name: 'params',
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
            formData: {
                difficulty: {},
                tongue:[{}],
                sensitively:[{}],
                response:[{}],
                negative:[{}],
                positive:[{}],
            },
            rules: {},
            dynamicTags: [],
            inputVisible: false,
            inputValue: ''
        }
    },
    created() {
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getKnowTraimData('param').then(res => { // 知识体系
            this.knowAllData = res;
        });
        getOperationData().then(res => {
            this.operationData = res;
        });
        this.search();
    },
    methods: {
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
            axiosPost('/trainMgr/paramMgr/list',this.formSearch).then(res => {
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
                axiosPost('/trainMgr/paramMgr/detail',{id: row.id}).then(res => {
                    if(res.code == 1000) {
                        this.formData = res.data;
                        this.dynamicTags = this.formData.custAttr || [];
                        this.dialogVisible = true;
                    }
                })
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dynamicTags = [];
            this.formData = {
                difficulty: {},
                tongue:[{}],
                sensitively:[{}],
                response:[{}],
                negative:[{}],
                positive:[{}],
            }
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
            if(this.inputVisible) {
                this.$message({message:'请将数据填写完整',type: 'warning'});
                this.$refs.saveTagInput.$refs.input.focus();
                return;
            }
            this.formData.noRepeat = '.no-repeat-1'
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            this.formData.custAttr = this.dynamicTags;
            axiosPost('/trainMgr/paramMgr/alter',this.formData).then(res => {
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

        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                if(this.dynamicTags.indexOf(inputValue) > -1) {
                    this.$message({message:'不可重复添加，请重新填写数据',type: 'warning'});
                }else {
                    this.dynamicTags.push(inputValue);
                    this.inputVisible = false;
                    this.inputValue = '';
                }
            }
        }
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
    .tip-content {
        margin-left: 120px;
        margin-bottom: 30px;
        color: #409EFF;
        font-size: 12px;
    }
    .el-input-number {
        width: 180px;
    }
    .span-title {
        display: inline-block;
        text-indent: 2em;
        font-size: 24px;
        height: 40px;
        line-height: 40px;
    }
    .el-icon-delete {
        margin-left: 15px;
        margin-top: 11px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    .el-icon-circle-plus-outline {
        margin-left: 15px;
        margin-top: 11px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
