<template>
    <div class="activityPlan-box">
        <ul class="tab-title">
            <li :class="activeName == 1 ? 'on' : ''" @click="changeTab(1)">评估设置</li>
            <li :class="activeName == 2 ? 'on' : ''" @click="changeTab(2)">发放评估</li>
            <li :class="activeName == 3 ? 'on' : ''" @click="changeTab(3)">评估统计</li>
        </ul>
        <div v-show="activeName == 1">
            <ul class="tab-title-sub clearfix">
                <li :class="activeNameSub == 1 ? 'on' : ''" @click="changeTabSub(1)">新建评估</li>
                <li :class="activeNameSub == 2 ? 'on' : ''" @click="changeTabSub(2)">模板选择</li>
            </ul>
            <div v-show="activeNameSub == 1">
                <el-form :model="formAssess" size="small" label-width="80px" ref="ruleformAssess" >
                    <el-form-item label="评估名称" class="">
                        <el-input v-model="formAssess.name" placeholder="请输入评估名称"></el-input>
                    </el-form-item>
                    <el-form-item label="评估描述" class="">
                        <el-input v-model="formAssess.content" :autosize="{minRows: 2}" type="textarea" placeholder="请输入评估描述"></el-input>
                    </el-form-item>
                    <el-form-item label="被评估人" style="display:inline-block">
                        <el-input v-model="formAssess.assessedPerson" placeholder="请输入被评估人"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="满分值" style="display:inline-block">
                        <el-input v-model="formAssess.score" disabled placeholder="满分值"></el-input>
                    </el-form-item> -->
                    <div class="el-form-item" :key="index" v-for="(item, index) in formAssess.questions">
                        <div class="que-item">
                            <span class="que-name ">问题{{index + 1}}</span>
                            <el-input size="small" v-model="item.title" class="que-input" style="padding-right: 350px;" placeholder="在此输入标题"></el-input>
                            <div class="que-opt" style="width: 350px;">
                                <el-radio-group v-model="item.type" style="padding-left: 20px;margin-right: 20px;">
                                    <el-radio label="单选">单选</el-radio>
                                    <el-radio label="多选">多选</el-radio>
                                    <el-radio label="主观">主观</el-radio>
                                </el-radio-group>
                                <i @click="questionDelete(formAssess.questions, index)" v-if="formAssess.questions.length > 1" class="el-icon-delete"></i>
                            </div>
                        </div>
                        <div v-if="item.type != '主观'">
                            <div class="que-item " v-for="(item2, index2) in item.options" :key="index2">
                                <span class="que-name">{{String.fromCharCode(index2 + 65)}}</span>
                                <el-input size="small" v-model="item2.optionContent" class="que-input" placeholder="在此输入选项"></el-input>
                                <div class="que-opt">
                                    <el-input-number size="small" v-show="item.type == '单选'" label="分值" v-model="item2.score" @change="handleChange" controls-position="right" :min="0" :max="100" style="width: 100px;margin-left: 15px;"></el-input-number>
                                    <!-- <el-input size="small" v-show="item.type == '单选'" @input.native="numLimit(index, index2, item2.score)" v-model="item2.score" style="width: 70px;margin-left: 15px;" placeholder="分值"></el-input> -->
                                    <i @click="optionDelete(item.options, index2)" v-if="item.options.length > 4" class="el-icon-delete"></i>
                                    <i @click="optionAdd(item.options)" v-if="index2 == item.options.length - 1 && item.options.length < 10" class="el-icon-circle-plus-outline"></i>
                                </div>
                            </div>
                        </div>
                        <div class="btn-box" v-if="index == formAssess.questions.length - 1">
                            <el-button type="text" @click="questionAdd">添加问题</el-button>
                        </div>
                    </div>
                    <div class="btn-box">
                        <el-button size="mini" :disabled="isShare" :loading="saveLoading" type="primary" @click="saveAdd('普通')">保存</el-button>
                        <el-button size="mini" :disabled="isShare" :loading="saveLoading" type="primary" @click="saveAdd('模板')">保存并另存为模板</el-button>
                        <!-- <el-button size="mini" @click="questionClear">清空</el-button> -->
                    </div>
                </el-form>
            </div>
            <div v-show="activeNameSub == 2">
                <el-form size="small" :model="moduleSearch" label-width="80px">
                    <el-form-item label="模板名称">
                        <el-input v-model.trim="moduleSearch.name" placeholder="请输入模板名称" style="width: 200px;"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btn-box">
                    <el-button size="mini" class="no-repeat-click1" type="primary" @click="searchModule">查 询</el-button>
                    <el-button size="mini" @click="resetModule">重 置</el-button>
                </div>
                <div class="loading-assess-1">
                    <el-table 
                        size="mini"
                        :data="tableModule.records"
                        cell-class-name="cellName"
                        stripe
                        header-cell-class-name="headerCellName">
                        <el-table-column 
                            align="center" 
                            label="模板编号">
                            <template slot-scope="scope">
                                <span @click="getModuleDetail(scope.row.id)">{{scope.row.code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column 
                            prop="name" 
                            align="center" 
                            label="模板名称"> </el-table-column>
                        <el-table-column 
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <span @click="useModule(scope.row.id)">使用</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :page-sizes="[5, 10, 15, 20,50]"
                        :page-size="moduleSearch.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page.sync="moduleSearch.pageNo"
                        :total="tableModule.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-show="activeName == 2">
            <el-table
                size="mini"
                class="loading-assess-2"
                :data="tableAssessList"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    align="center"
                    width="50"
                    label="选择">
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.sendStatus == '待发送'" @change="check => checkboxChange(check, scope.row)" v-model="scope.row.checked"></el-checkbox>
                        </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    align="center"
                    label="序号">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="评估名称">
                        <template slot-scope="scope">
                            <el-button type="text" @click="getInfo(scope.row.assessId)">{{scope.row.name}}</el-button>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="sendStatus"
                    align="center"
                    label="状态">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button :disabled="isShare" size="mini" type="text" v-if="operationData.includes('27b37ea3') && scope.row.sendStatus == '未发送'" @click="edit(scope.row.assessId)">编辑</el-button>
                            <el-button :disabled="isShare" size="mini" type="text" v-if="operationData.includes('3484c97f') && scope.row.sendStatus == '未发送'" @click="remove(scope.row.id)">删除</el-button>
                        </template>
                </el-table-column>
            </el-table>
            <el-form size="small" :rules="rules" ref="ruleForm" inline :model="form" label-width="120px">
                <el-form-item prop="" label="发放时间">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="form.sendTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="关联课程">
                    <el-select v-model="form.courseId" placeholder="请选择关联课程">
                        <el-option
                            v-for="item in course"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sendTypes" label="发放方式">
                    <el-checkbox-group v-model="form.sendTypes">
                        <el-checkbox label="生成二维码">生成二维码</el-checkbox>
                        <!-- <el-checkbox label="网址链接">网址链接</el-checkbox> -->
                        <el-checkbox label="App推送">App推送</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="assessType" label="评估方式" style="width: 100%;">
                    <el-radio-group v-model="form.assessType">
                        <el-radio label="匿名评估">匿名评估</el-radio>
                        <el-radio label="实名评估">实名评估</el-radio>
                    </el-radio-group>
                    <div v-if="form.assessType == '实名评估'" style="display: inline-block;margin-left: 20px;">
                        <el-tag
                            :key="index"
                            v-for="(tag,index) in dynamicTags"
                            :closable="tag == '姓名' ? false : true"
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
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="参加人员" style="width: 100%;">
                    <div class="input-box">
                        <el-tag size="small" @close="tagClose(index)" v-for="(item, index) in form.students" style="margin-right: 10px;" :key="index" closable>{{item.studentName}}</el-tag>
                    </div>
                    <el-button type="text" @click="selectPersonnel">选择人员</el-button>
                </el-form-item> -->
                <el-form-item label="默认已添加人员" style="width: 100%;">
                    <el-checkbox v-model="form.defaultStudent"></el-checkbox>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button size="mini" :disabled="isShare" :loading="sendLoading" type="primary" @click="submitAssessSend('ruleForm')">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 3">
            <div class="boxTittle">
                <div class="item-list" style="margin-right: 100px;">评估参与人：{{tableStatistics.total.num}}</div>
                <div class="item-list">平均分：{{tableStatistics.total.avgScore}}</div>
            </div>
            <el-form size="small" inline :model="assessResultSearch" label-width="80px">
                <el-form-item label="评估时段" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="assessResultSearch.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="评估名称">
                    <el-input v-model="assessResultSearch.name" placeholder="请输入评估名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button size="mini" class="no-repeat-click2" type="primary" @click="searchAssessList">查 询</el-button>
                <el-button size="mini" @click="resetAssessResult">重 置</el-button>
            </div>
            <el-table
                size="mini"
                class="loading-assess-3"
                :data="tableStatistics.records"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="评估名称">
                    </el-table-column>
                    <el-table-column
                        prop="sendTime"
                        align="center"
                        label="评估时间">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="assessedPerson"
                        label="被评估人">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="sort"
                        label="排名">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="maxScore"
                        label="最高分">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="minScore"
                        label="最低分">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="avgScore"
                        label="平均分">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="assessDetail(scope.row.id)">详情</el-button>
                            <el-button v-if="scope.row.realQrCode" type="text" @click="qrCodeDownload(scope.row.realQrCode)">二维码下载</el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
        <el-dialog :show-close="false" :visible.sync="moduleDetailVisible" width="1000px">
            <p slot="title" class="module-title">{{moduleType == 1 ? '模板详情' : '评估详情'}}</p>
            <div class="detail-box">
                <span class="detail-name">评估名称</span>
                <span>{{moduleDetail.name}}</span>
            </div>
            <div class="detail-box">
                <span class="detail-name">评估描述</span>
                <span>{{moduleDetail.content}}</span>
            </div>
            <div class="detail-box" style="width: 450px;display: inline-block;">
                <span class="detail-name">被评估人</span>
                <span>{{moduleDetail.assessedPerson}}</span>
            </div>
            <!-- <div class="detail-box" style="width: 450px;display: inline-block;">
                <span class="detail-name">满分值</span>
                <span>{{moduleDetail.score}}</span>
            </div> -->
            <div class="detail-box" v-for="(item, index) in moduleDetail.questions" :key="index">
                <span class="detail-name">问题{{index + 1}}</span>
                <span>【{{item.type}}】{{item.title}}</span>
                <div class="detail-box" style="margin-top: 15px;" v-for="(item2, index2) in item.options" :key="index2">
                    <span class="detail-name">{{String.fromCharCode(index2 + 65)}} {{item.type == '单选' ? `[${item2.score}分]` : ''}}</span>
                    <span>{{item2.optionContent}}</span>
                </div>
            </div>
            <div class="btn-box">
                <el-button size="mini" @click="moduleDetailVisible = false;">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="resultVisible" width="1000px">
            <p slot="title" class="module-title">评估结果</p>
            <ul class="tab-title-sub clearfix">
                <li :class="activeNameDialog == 1 ? 'on' : ''" @click="changeTabDialog(1)">汇总统计</li>
                <li :class="activeNameDialog == 2 ? 'on' : ''" @click="changeTabDialog(2)">单人统计</li>
            </ul>
            <div v-show="activeNameDialog == 1">
                <el-button size="mini" :disabled="isShare" @click="fileExport('0')" class="btn-export-0" v-if="operationData.includes('e639c663')" style="margin-bottom: 20px;" type="primary">导出结果</el-button>
                <div class="detail-box">
                    <span class="detail-name">评估名称</span>
                    <span>{{resultTotal.name}}</span>
                </div>
                <div class="detail-box">
                    <span class="detail-name">评估描述</span>
                    <span>{{resultTotal.content}}</span>
                </div>
                <div class="detail-box" style="width: 450px;display: inline-block;">
                    <span class="detail-name">被评估人</span>
                    <span>{{resultTotal.assessedPerson}}</span>
                </div>
                <!-- <div class="detail-box" style="width: 450px;display: inline-block;">
                    <span class="detail-name">满分值</span>
                    <span>{{resultTotal.score}}</span>
                </div> -->
                <div class="detail-box" v-for="(item, index) in resultTotal.questions" :key="index">
                    <span class="detail-name">问题{{index + 1}}</span>
                    <span>【{{item.type}}】{{item.title}}</span>
                    <div class="detail-box" style="margin-top: 15px;" v-for="(item2, index2) in item.options" :key="index2">
                        <span class="detail-name" style="width: 120px; left: -40px;">{{item2.percent}} {{String.fromCharCode(index2 + 65)}}</span>
                        <span>{{item.type == '单选' ? `[${item2.score}分]` : ''}} {{item2.optionContent}}</span>
                    </div>
                </div>
            </div>
            <div v-show="activeNameDialog == 2">
                <el-button size="mini" :disabled="isShare" @click="fileExport('1')" class="btn-export-1" v-if="operationData.includes('7b6488de')" style="margin-bottom: 20px;" type="primary">导出结果</el-button>
                <el-table
                    size="mini"
                    style="margin-top: 0"
                    :data="resultSingle"
                    cell-class-name="cellName"
                    header-cell-class-name="headerCellName"
                    stripe>
                        <el-table-column
                            type="index"
                            align="center"
                            label="序号">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            align="center"
                            label="姓名">
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            align="center"
                            label="提交时间">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="操作">
                            <template slot-scope="scope">
                                <span @click="getResultSingleInfo(scope.row.id)">详情</span>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <div class="btn-box">
                <el-button size="mini" @click="resultVisible = false;">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="resultSingleInfoVisible" width="1000px">
            <p slot="title" class="module-title">单人统计详情</p>
            <div class="detail-box" style="width: 450px;display: inline-block;" v-for="(val, key) in resultSingleInfo.info" :key="val+key">
                <span class="detail-name">{{key}}</span>
                <span style="display: inline-block;height: 16px;">{{val}}</span>
            </div>
            <div class="detail-box">
                <span class="detail-name">评估名称</span>
                <span>{{resultSingleInfo.assess.name}}</span>
            </div>
            <div class="detail-box">
                <span class="detail-name">评估描述</span>
                <span>{{resultSingleInfo.assess.content}}</span>
            </div>
            <div class="detail-box" style="width: 450px;display: inline-block;">
                <span class="detail-name">被评估人</span>
                <span>{{resultSingleInfo.assess.assessedPerson}}</span>
            </div>
            <!-- <div class="detail-box" style="width: 450px;display: inline-block;">
                <span class="detail-name">满分值</span>
                <span>{{resultSingleInfo.assess.score}}</span>
            </div> -->
            <div class="detail-box" v-for="(item, index) in resultSingleInfo.assess.questions" :key="index">
                <span class="detail-name">问题{{index + 1}}</span>
                <span>【{{item.type}}】{{item.title}}</span>
                <div class="detail-box" style="margin-top: 15px;" v-for="(item2, index2) in item.options" :key="index2">
                    <span class="detail-name">{{item2.selected ? '✔' : ''}} {{String.fromCharCode(index2 + 65)}}</span>
                    <span>{{item2.optionContent}}</span>
                </div>
                <div class="detail-box" style="margin-top: 15px;" v-if="item.type == '主观'">
                    <span class="detail-name">回答</span>
                    <span>{{item.content || '无'}}</span>
                </div>
            </div>
            <div class="btn-box">
                <el-button size="mini" @click="resultSingleInfoVisible = false;">关闭</el-button>
            </div>
        </el-dialog>
        <PersonnelSelection 
            v-if="selectConfigIsShow" 
            :selectConfigIsShow="selectConfigIsShow" 
            :types="types" 
            :cascadeOrg="cascadeOrg" 
            @listenEventData="getDataFun" 
            @listenEventClose="getCloseFun">
        </PersonnelSelection>   
    </div>
</template>

<script>
import {
    axiosPost,
    getOperationData,
} from '@/assets/js/api';
import PersonnelSelection from '@/components/PersonnelSelection'
export default {
    name: 'assess',
    data() {
        return {
            operationData: [],
            selectConfigIsShow: false, // 选择人员弹窗
            types: [], // 获取用户类型
            cascadeOrg: null, // 按机构查询时是否级联子机构
            course: [],
            activeName: 1,
            activeNameSub: 1,
            activeNameDialog: 1,
            dynamicTags: ['姓名'],
            inputVisible: false,
            inputValue: '',
            exportId: '',
            formAssess: {
                name: '',
                content: '',
                assessedPerson: '',
                score: '',
                questions: [
                    {
                        title: '',
                        type: '单选', // 单选 多选 主观
                        options:[
                            {
                                optionContent: '',
                                score: ''
                            },
                            {
                                optionContent: '',
                                score: ''
                            },
                            {
                                optionContent: '',
                                score: ''
                            },
                            {
                                optionContent: '',
                                score: ''
                            }
                        ]
                    }
                ]
            },
            tableAssessList: [],
            tableSendChecked: '',
            form: {
                sendTypes: [],
                defaultStudent: true
            },
            tableStatistics: {
                records: [],
                total: {}
            },
            moduleSearch: {
                pageNo: 1,
                pageSize: 5
            },
            tableModule: {},
            moduleDetailVisible: false,
            moduleType: 1,
            statisticsVisible: false,
            moduleDetail: {},
            assessResultSearch: {},
            resultVisible: false,
            resultTotal: {},
            resultSingle: [],
            resultSingleInfo: {
                assess: {},
                info: {},
            },
            resultSingleInfoVisible: false,
            rules: {
                sendTypes: [
                    { type: 'array', required: true, message: '请选择发放方式', trigger: 'change' }
                ],
                assessType: [
                    { required: true, message: '请选择评估方式', trigger: 'change' }
                ],
                sendTime: [
                    { required: true, message: '请选择发放时间', trigger: 'blur' }
                ],
            },
            sendLoading: false,
            saveLoading: false,
            isShare: false,
        }
    },
    components: {
        PersonnelSelection
    },
    computed: {
        planId() {
            return this.$route.query.id;
        }
    },
    created() {
        this.getCourse();
        getOperationData('培训计划管理').then(res => {
            this.operationData = res;
        });
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    methods: {
        changeTab(index) {
            if(index != 1 && this.formAssess.id) {
                this.$confirm('正在编辑评估中,是否放弃编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.questionClear(); 
                    this.changeTab2(index);
                }).catch(() => {   

                });
            }else{
                this.changeTab2(index);
            }
        },
        changeTab2(index) {
            this.activeName = index;
            this.tableAssessList = [];
            if(index == 1) {}
            if(index == 2) { this.getTableAssessList() }
            if(index == 3) { this.searchAssessList() }
        },
        changeTabSub(index) {
            if(index != 1 && this.formAssess.id) {
                this.$confirm('正在编辑评估中,是否放弃编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.questionClear(); 
                    this.changeTabSub2(index);
                }).catch(() => {   

                });
            }else{
                this.changeTabSub2(index);
            }
        },
        changeTabSub2(index) {
            this.activeNameSub = index;
            if(index == 1) {}
            if(index == 2) { this.getModuleList(); }
        },
        changeTabDialog(index) {
            this.activeNameDialog = index;
        },
        questionAdd() {
            this.formAssess.questions.push({
                title: '',
                type: '单选', // 单选 多选
                options:[
                    {
                        optionContent: '',
                        score: ''
                    },
                    {
                        optionContent: '',
                        score: ''
                    },
                    {
                        optionContent: '',
                        score: ''
                    },
                    {
                        optionContent: '',
                        score: ''
                    }
                ]
            });
        },
        questionClear() {
            this.formAssess = {
                name: '',
                content: '',
                assessedPerson: '',
                score: '',
                questions: [
                    {
                        title: '',
                        type: '单选', // 单选 多选 主观
                        options:[
                            {
                                optionContent: '',
                                score: ''
                            },
                            {
                                optionContent: '',
                                score: ''
                            },
                            {
                                optionContent: '',
                                score: ''
                            },
                            {
                                optionContent: '',
                                score: ''
                            }
                        ]
                    }
                ]
            };
        },
        questionDelete(question, index) {
            question.splice(index, 1)
        },
        optionDelete(option, index) {
            option.splice(index, 1)
        },
        optionAdd(option) {
            option.push({
                optionContent: '',
                score: ''
            })
        },
        qrCodeDownload(qrCode) {
            window.open(qrCode, '_blank');
        },
        handleSelectionChange(val) {
            this.tableChecked = val;
        },
        saveAdd(type) {
            let flag = false;
            var num = 0;
            var num1 = 0;
            if(!this.formAssess.name || !this.formAssess.content || !this.formAssess.assessedPerson) {
                flag = true;
            }else{
                try {
                    this.formAssess.questions.forEach(item => {
                        if(!item.title) {
                            throw new Error()
                        }
                        if(item.title.length > 128) {
                            num1++;
                        }
                        if(item.type != '主观') {
                            item.options.forEach(item2 => {
                                if(!item2.optionContent) {
                                    throw new Error()
                                }
                                if(item.type == '单选') {
                                    if(item2.score === '') {
                                        throw new Error()
                                    }
                                }
                            })
                            let isMax = item.options.every((item2) => {
                                return item2.optionContent.length <= 128
                            })
                            if(!isMax){
                                num++;
                            }
                        }
                    })
                }catch (e){
                    flag = true;
                }
            }

            if(flag) {
                this.$message({message: '请输入完整后提交',type: 'warning'});
                return;
            }
            if(this.formAssess.name.length > 32) {
                this.$message({message: '评估名称长度应小于等于32个字符',type: 'warning'});
                return;
            }
            if(this.formAssess.assessedPerson.length > 32) {
                this.$message({message: '被评估人长度应小于等于32个字符',type: 'warning'});
                return;
            }
            if(this.formAssess.content.length > 512) {
                this.$message({message: '评估内容长度应小于等于512个字符',type: 'warning'});
                return;
            }
            if(num1 != 0) {
                this.$message({message: '问题长度应小于等于128个字符',type: 'warning'});
                return;
            }
            if(num != 0) {
                this.$message({message: '选项长度应小于等于128个字符',type: 'warning'});
                return;
            }
            this.formAssess.type = type;
            this.formAssess.planId = this.planId;
            this.saveLoading = true;
            var URL = this.formAssess.id ? '/educateMgr/assess/modify' : '/educateMgr/plan/assess/save';
            axiosPost(URL, this.formAssess).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.questionClear();
                this.saveLoading = false;
            }).catch(() => {
                this.saveLoading = true;
            })
        },
        checkboxChange(check, row){ // 单选
            this.tableAssessList.forEach(item => {
                if (item.id != row.id) {
                    item.checked = false
                }
            })
            if(check) {
                this.tableSendChecked = row;
            }else {
                this.tableSendChecked = {}
            }
        },
        searchAssessList() {
            this.assessResultSearch.startTime = this.assessResultSearch.time ? this.assessResultSearch.time[0] : ''
            this.assessResultSearch.endTime = this.assessResultSearch.time ? this.assessResultSearch.time[1] : ''
            this.assessResultSearch.planId = this.planId;
            this.assessResultSearch.loading = '.loading-assess-3';
            this.assessResultSearch.noRepeat = '.no-repeat-click2';
            axiosPost('/educateMgr/plan/assess/list/statistics', this.assessResultSearch).then(res => {
                this.tableStatistics.records = res.data.records;
                this.tableStatistics.total = res.data.total || {};
            })
        },
        resetAssessResult() {
            this.assessResultSearch = {}
        },
        getTableAssessList(params = {}) {
            params.planId = this.planId;
            params.loading = '.loading-assess-2'
            axiosPost('/educateMgr/plan/assess/list', params).then(res => {
                res.data.map(item => {
                    item.checked = false;
                    return item;
                })
                this.tableAssessList = res.data;
            })
        },
        assessDetail(id) {
            this.activeNameDialog = 1;
            this.exportId = id;
            this.getResultTotal(id);
            this.getResultSingle(id);
        },
        getResultTotal(id) {
            this.resultTotal = {};
            axiosPost('/educateMgr/plan/assess/result', {id: id}).then(res => {
                this.resultTotal = res.data;
                this.resultVisible = true;
            })
        },
        getResultSingle(id) {
            this.resultSingle = [];
            axiosPost('/educateMgr/plan/assess/single/result', {id: id}).then(res => {
                this.resultSingle = res.data;
            })
        },
        getResultSingleInfo(id) {
            axiosPost('/educateMgr/plan/assess/single/info', {id: id}).then(res => {
                this.resultSingleInfo = res.data;
                this.resultSingleInfoVisible = true;
            })
        },
        submitAssessSend(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveSend()
                } else {
                    return false;
                }
            });
        },
        saveSend() {
            this.form.id = this.tableSendChecked.id
            if(!this.form.id) {
                this.$message({message: '请选择一个评估',type: 'error'});
                return;
            }
            this.course.forEach(item => {
                if(item.id == this.form.courseId) {
                    this.form.courseName = item.name;
                }
            })
            this.sendLoading = true;
            this.form.assessHeads = this.form.assessType == '实名评估' ?  this.dynamicTags : [];
            axiosPost('/educateMgr/plan/assess/send',this.form).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.sendLoading = false;
                this.getTableAssessList();
                this.$refs['ruleForm'].resetFields();
                this.dynamicTags = ['姓名'];
                this.tableSendChecked = {};
                this.form = {
                    sendTypes: [],
                    defaultStudent: true
                }
            }).catch(() => {
                this.sendLoading = false;
            })
        },
        tagClose(item) {
            this.form.students.splice(this.form.students.indexOf(item), 1);
        },
        selectPersonnel(){ // 选择人员            
            this.selectConfigIsShow = true;
            this.types = ['STUDENT'];
        },
        getDataFun(res){ // 获取数据
            this.form.students = [];
            res.forEach(item => {
                this.form.students.push({
                    receiverId: item.id,
                    receiverName: item.userName,
                })
            })
        },
        getCloseFun(res){ // 弹窗是否关闭
            this.selectConfigIsShow = res;
        },
        handleChange() {
            let temp = 0
            this.formAssess.questions.forEach(item => {
                if(item.type == '单选') {
                    item.options.forEach(item2 => {
                        temp += Number(item2.score);
                    })
                }
            })
            this.formAssess.score = temp;
        },
        numLimit(index, index2, score) {
            this.formAssess.questions[index].options[index2].score = this.formAssess.questions[index].options[index2].score.replace(/[^\d]/g,'').replace(/^0[0-9]/g,'0')
            let temp = 0
            this.formAssess.questions.forEach(item => {
                if(item.type == '单选') {
                    item.options.forEach(item2 => {
                        temp += Number(item2.score);
                    })
                }
            })
            this.formAssess.score = temp;
        },
        numLimit2(score) {
            this.formAssess.score = score.replace(/[^\d]/g,'').replace(/^0[0-9]/g,'0')
        },
        searchModule() {
            this.moduleSearch.pageNo = 1;
            this.getModuleList();
        },
        resetModule() {
            this.moduleSearch.name = '';
        },
        handleCurrentChange(res){ // 更改页数
            this.moduleSearch.pageNo = res;
            this.getModuleList();
        },
        handleSizeChange(res){ // 更改条数
            this.moduleSearch.pageNo = 1;
            this.moduleSearch.pageSize = res;
            this.getModuleList();
        },
        getModuleList() {
            this.moduleSearch.loading = '.loading-assess-1';
            this.moduleSearch.noRepeat = '.no-repeat-click1';
            axiosPost('/educateMgr/assess/list',this.moduleSearch).then(res => {
                this.tableModule = res.data;
            })
        },
        getModuleDetail(id) {
            axiosPost('/educateMgr/assess/info',{
                id: id
            }).then(res => {
                this.moduleType = 1;
                this.moduleDetail = res.data;
                this.moduleDetailVisible = true;
            })
        },
        useModule(id) {
            axiosPost('/educateMgr/assess/info',{
                id: id
            }).then(res => {
                this.formAssess.name = res.data.name;
                this.formAssess.content = res.data.content;
                this.formAssess.questions = res.data.questions;
                this.formAssess.assessedPerson = res.data.assessedPerson;
                this.formAssess.score = res.data.score;
                this.activeNameSub = 1;
            })
        },
        getCourse() {
            axiosPost('/educateMgr/plan/course/dropDown', {planId: this.planId}).then(res => {
                this.course = res.data;
            })
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
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        fileExport(flag) {
            axiosPost('/educateMgr/plan/assess/export', {id: this.exportId,noRepeat: '.btn-export-' + flag}).then(res => {
                window.open(res.data)
            })
        },
        getInfo(id) {
            axiosPost('/educateMgr/assess/info', {id: id}).then(res => {
                this.moduleType = 2;
                this.moduleDetail = res.data;
                this.moduleDetailVisible = true;
            })
        },
        edit(id) {
            axiosPost('/educateMgr/assess/info', {id: id}).then(res => {
                this.activeName = 1;
                this.activeNameSub = 1;
                this.formAssess = res.data;
            })
        },
        remove(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axiosPost('/educateMgr/plan/assess/remove', {id: id}).then(res => {
                    this.getTableAssessList();
                })
            }).catch(() => {   

            });
        },
    }
}
</script>

<style scoped>
    .que-name {
        width: 80px;
        padding-right: 12px;
        text-align: right;
        color: #606266;
        line-height: 32px;
        font-size: 14px;
        position: absolute;
        top: 0;
        left: 0;
    }
    .que-item {
        margin-bottom: 10px;
        position: relative;
    }
    .que-opt {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 250px;
    }
    .que-input {
        padding: 0 250px 0 80px;
    }
    .el-icon-delete {
        margin-left: 15px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    .el-icon-circle-plus-outline {
        margin-left: 15px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    .detail-box {
        padding-left: 80px;
        position: relative;
        margin-bottom: 15px;
        line-height: 25px;
    }
    .detail-name {
        position: absolute;
        width: 80px;
        padding-right: 12px;
        text-align: right;
        left: 0;
        top: 0;
    }
    .boxTittle {
        border: 1px solid #DCDFE6;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        margin-bottom: 20px;
    }
    .item-list {
        display: inline-block;
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