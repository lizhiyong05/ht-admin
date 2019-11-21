<template>
    <div class="activityPlan-box">
        <ul class="tab-title">
            <li :class="activeName == 1 ? 'on' : ''" @click="changeTab(1)">考试设置</li>
            <li :class="activeName == 2 ? 'on' : ''" @click="changeTab(2)">发放考试</li>
            <li :class="activeName == 3 ? 'on' : ''" @click="changeTab(3)">成绩统计</li>
        </ul>
        <div v-show="activeName == 1">
            <el-form size="small" inline :rules="rules" ref="ruleForm" :model="formAdd" label-width="120px">
                <el-form-item label="考试名称" prop="examName">
                    <el-input v-model="formAdd.examName" placeholder="请输入考试名称"></el-input>
                </el-form-item>
                <el-form-item label="是否乱序" prop="discover">
                    <el-radio-group style="width: 202px;" v-model="formAdd.discover">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="examHour" label="考试时长">
                    <el-input v-model="formAdd.examHour" placeholder="请输入考试时长 (分钟)"></el-input>
                </el-form-item>
                <el-form-item prop="adoptRate" label="合格比率">
                    <el-input v-model="formAdd.adoptRate" placeholder="请输入合格比率"></el-input>
                </el-form-item>
                <el-form-item prop="timeOut" label="页面超时时间">
                    <el-input v-model="formAdd.timeOut" placeholder="请输入页面超时时间 (分钟)"></el-input>
                </el-form-item>
                <el-form-item label="关联课程">
                    <el-select @change="getCoursePaper" v-model="formAdd.courseId" placeholder="请选择关联课程">
                        <el-option
                            v-for="item in course"
                            :key="item.id"
                            :label="item.name" :disabled="item.disabled"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试日期" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="formAdd.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 100%;" prop="" label="学员信息">
                    <el-checkbox-group v-model="formAdd.infos">
                        <el-checkbox label="区部">区部</el-checkbox>
                        <el-checkbox label="备注">备注</el-checkbox>
                        <el-checkbox label="工号">工号</el-checkbox>
                        <el-checkbox label="开班时间">开班时间</el-checkbox>
                        <el-checkbox label="承接范围">承接范围</el-checkbox>
                        <el-checkbox label="组别">组别</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div>
                <el-button :disabled="isShare" size="mini" type="primary" @click="btnGetPaper">从试卷管理获取</el-button>
                <el-button :disabled="isShare" size="mini" type="primary" v-if="operationData.includes('884b49fb')" @click="paperAddEdit('add','')">新增试卷</el-button>
            </div>
            <el-table
                size="mini"
                :data="tablePaper"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                <el-table-column
                    align="center"
                    width="50"
                    label="选择">
                        <template slot-scope="scope">
                            <el-checkbox @change="check => checkboxChange2(check, scope.row)" v-model="scope.row.checked"></el-checkbox>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="paperName"
                    align="center"
                    label="试卷名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    :formatter="getPaperTypeName"
                    label="分类">
                </el-table-column>
                <el-table-column
                    prop="score"
                    align="center"
                    label="总分">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态">
                        <template slot-scope="scope">
                            {{scope.row.deleted == 0 ? '停用' : '启用'}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="createUserName"
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
                    width="80"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" :disabled="isShare" type="text" v-if="operationData.includes('8d66880a')" @click="paperAddEdit('edit',scope.row.id)">编辑</el-button>
                        </template>
                </el-table-column>
            </el-table>
            <div class="btn-box" style="margin-top: 40px;">
                <el-button size="mini" :disabled="isShare" class="no-repeat-click1" type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 2">
            <el-table
                size="mini"
                class="loading-exam-1"
                :data="tableSend"
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
                    prop="examName"
                    align="center"
                    label="考试名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="考试日期">
                        <template slot-scope="scope">
                            {{scope.row.startTime}} - {{scope.row.endTime}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="createUser"
                    align="center"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    prop="sendStatus"
                    align="center"
                    width="120"
                    label="状态">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" :disabled="isShare" type="text" v-if="operationData.includes('5af687d7') && scope.row.sendStatus == '未发送'" @click="examEdit(scope.row.id)">编辑</el-button>
                            <el-button size="mini" :disabled="isShare" type="text" v-if="operationData.includes('afcca643') && scope.row.sendStatus == '未发送'" @click="btnExamRemove(scope.row.id)">删除</el-button>
                        </template>
                </el-table-column>
            </el-table>
            <el-form size="small" inline :model="form" label-width="120px">
                <el-form-item label="发放时间">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="form.sendTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="参加人员" style="width: 100%;">
                    <div class="input-box">
                        <el-tag size="small" @close="tagClose(index)" v-for="(item, index) in form.students" style="margin-right: 10px;" :key="index" closable>{{item.studentName}}</el-tag>
                    </div>
                    <el-button type="text" @click="selectPersonnel">选择人员</el-button>
                </el-form-item> -->
                <!-- <el-form-item label="默认已添加人员" style="width: 100%;">
                    <el-checkbox v-model="form.defaultStudent"></el-checkbox>
                </el-form-item> -->
            </el-form>
            <div class="btn-box">
                <el-button size="mini" :disabled="isShare" class="btn-repeat-click2" type="primary" @click="saveSend">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 3">
            <el-form size="small" inline :model="searchStatisticsList" label-width="80px">
                <el-form-item label="区域">
                    <el-select v-model="searchStatisticsList.areaId" placeholder="请选择区域">
                        <el-option
                            v-for="item in dictionariesAllData['area_all']"
                            :key="item.id"
                            :label="item.dicName" :disabled="item.disabled"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试名称">
                    <el-input v-model="searchStatisticsList.examName" placeholder="请输入考试名称"></el-input>
                </el-form-item>
                <el-form-item label="考试日期" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="searchStatisticsList.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <div class="btn-box">
                    <el-button size="mini" class="no-repeat-click2" type="primary" @click="searchStatistics()">查询</el-button>
                    <el-button size="mini" @click="resetStatistics()">重置</el-button>
                </div>
            </el-form>
            <div class="loading-exam-2">
                <el-table
                    size="mini"
                    :data="tableStatistics.records"
                    cell-class-name="cellName"
                    header-cell-class-name="headerCellName"
                    stripe>
                    <el-table-column
                        prop="examName"
                        align="center"
                        label="考试名称">
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        align="center"
                        label="应参考人数">
                    </el-table-column>
                    <el-table-column
                        prop="studentNum"
                        align="center"
                        label="实际参考人数">
                    </el-table-column>
                    <el-table-column
                        prop="noPer"
                        align="center"
                        label="缺考率">
                    </el-table-column>
                    <el-table-column
                        prop="passedPer"
                        align="center"
                        label="及格率">
                    </el-table-column>
                    <el-table-column
                        prop="maxScore"
                        align="center"
                        label="最高分">
                    </el-table-column>
                    <el-table-column
                        prop="minScore"
                        align="center"
                        label="最低分">
                    </el-table-column>
                    <el-table-column
                        prop="avgScore"
                        align="center"
                        label="平均分">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="examInfo(scope.row)">详情</el-button>
                            </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @current-change="handleCurrentChange2"
                    :current-page.sync="searchStatisticsList.pageNo"
                    @size-change="handleSizeChange2"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="searchStatisticsList.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableStatistics.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :show-close="false" :visible.sync="paperVisible" width="1000px">
            <p slot="title" class="module-title">试卷获取</p>
            <el-form size="small" inline :model="searchList" label-width="80px">
                <el-form-item label="试卷分类">
                    <treeselect 
                        v-model="searchList.knowledgeId"
                        :options="knowAllData"
                        placeholder="请选择试卷分类"
                        noResultsText="未找到，请重新输入"
                        :normalizer="normalizer"/>
                </el-form-item>
                <el-form-item label="试卷名称">
                    <el-input v-model="searchList.paperName" placeholder="请输入试卷名称"></el-input>
                </el-form-item>
                <el-form-item label="创建人">
                    <el-input v-model="searchList.createUserName" placeholder="请输入创建人"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="searchList.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <div class="btn-box">
                    <el-button size="mini" class="no-repeat-click3" type="primary" @click="search()">查询</el-button>
                    <el-button size="mini" @click="reset()">重置</el-button>
                </div>
            </el-form>
            <div v-loading="loading">
                <el-table
                    size="mini"
                    :data="tableList.records"
                    cell-class-name="cellName"
                    @selection-change="handleSelectionChange"
                    header-cell-class-name="headerCellName"
                    stripe>
                    <el-table-column
                        type="selection"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="paperNo"
                        align="center"
                        label="试卷编号">
                    </el-table-column>
                    <el-table-column
                        prop="paperName"
                        align="center"
                        label="试卷名称">
                    </el-table-column>
                    <el-table-column
                        :formatter="getPaperTypeName"
                        align="center"
                        label="试卷分类">
                    </el-table-column>
                    <el-table-column
                        prop="score"
                        align="center"
                        label="试卷总分">
                    </el-table-column>
                    <el-table-column
                        prop="createUserName"
                        align="center"
                        label="创建人">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        align="center"
                        label="创建时间">
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page.sync="searchList.pageNo"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="searchList.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableList.total">
                </el-pagination>
            </div>
            <div class="btn-box">
                <el-button :disabled="isShare" size="mini" type="primary" @click="saveAdd">保存</el-button>
                <el-button size="mini" @click="paperVisible = false;">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="resultVisible" width="1000px">
            <p slot="title" class="module-title">考试详情</p>
            <ul class="tab-title-sub clearfix">
                <li :class="activeNameDialog == 1 ? 'on' : ''" @click="changeTabDialog(1)">成绩汇总统计</li>
                <li :class="activeNameDialog == 2 ? 'on' : ''" @click="changeTabDialog(2)">人员成绩详情</li>
            </ul>
            <div v-show="activeNameDialog == 1">
                <el-button size="mini" :disabled="isShare" @click="fileExport('1')" class="btn-export-1" v-if="operationData.includes('59763b9e')" style="margin-bottom: 20px;" type="primary">导出结果</el-button>
                <p class="paperTitle">{{examResultTotal.paperName}}</p>
                <div v-for="(item, index) in examResultTotal.answerAnalysisList" :key="index" class="que-box">
                    <div class="item">
                        <span class="item-name">Q{{index + 1}}.</span>
                        <span>[{{item.questionType | typeFilter}}] {{item.questionType == 4 ? item.questionName.replace(/\[blank\]/g, '____') : item.questionName}}</span>
                        <div v-if="item.questionType != 4 && item.questionType != 5" class="paperRight">
                            <span>小计</span>
                            <span>比例</span>
                        </div>
                    </div>
                    <div style="padding-left: 20px;">
                        <div v-if="item.questionType != 4 && item.questionType != 5">
                            <div v-for="(item2, index2) in item.choices" :key="index2" class="item">
                                <span class="item-name">{{String.fromCharCode(index2 + 65)}}.</span>
                                <span>{{item2.optionContent}}</span>
                                <div class="paperRight">
                                    <span>{{item2.optionNum}}</span>
                                    <span>{{item2.optionPer}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="item">
                            <span class="item-name" v-if="item.questionType == 4">正确答案:
                                <span v-for="(item2, index2) in item.choices" :key="index2">
                                    ({{item2.optionContent.replace(/\|/g, '、')}})
                                </span>
                            </span>
                            <span class="item-name" v-else>正确答案: {{item.questionAnswer.replace(/\|/g, ' ')}}</span>
                            <span class="item-name">正确率: {{item.truePer}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="activeNameDialog == 2">
                <el-button size="mini" :disabled="isShare" @click="fileExport('0')" class="btn-export-0" v-if="operationData.includes('bff1b5a2')" style="margin-bottom: 20px;" type="primary">导出结果</el-button>
                <el-table
                    size="mini"
                    style="margin-top: 0"
                    :data="resultSingle"
                    cell-class-name="cellName"
                    header-cell-class-name="headerCellName"
                    stripe>
                        <el-table-column
                            prop="student_name"
                            align="center"
                            label="姓名">
                        </el-table-column>
                        <el-table-column
                            prop="score"
                            align="center"
                            label="成绩">
                        </el-table-column>
                        <el-table-column
                            prop="rownum"
                            align="center"
                            label="排名">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="状态">
                            <template slot-scope="scope">
                                {{scope.row.passed == 1 ? '通过' : '未通过'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            :formatter="timeUse"
                            align="center"
                            label="用时">
                        </el-table-column>
                        <el-table-column
                            prop="end_time"
                            align="center"
                            label="交卷时间">
                        </el-table-column>
                </el-table>
            </div>
            <div class="btn-box">
                <el-button size="mini" @click="resultVisible = false;">关闭</el-button>
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
    getDictionariesAllData,
    getKnowAllData,
    getMapNameData,
    getOperationData,
    getDictionariesNameData
} from '@/assets/js/api';
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import PersonnelSelection from '@/components/PersonnelSelection'
export default {
    name: 'exam',
    data() {
        var numValidate = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入考试时长'));
            } else {
                if (/^(0?|[1-9][0-9]*)$/.test(value)) {
                    if(Number(value) > 9999 || Number(value) < 0) {
                        callback('请输入0-9999正整数');
                    }else {
                        callback();
                    }
                } else {
                    callback('请输入0-9999正整数');
                }
            } 
        };
        var numValidate2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入合格比率'));
            } else {
                if (/^(0?|[1-9][0-9]*)$/.test(value)) {
                    if(Number(value) > 100 || Number(value) < 0) {
                        callback('请输入0-100正整数');
                    }else {
                        callback();
                    }
                } else {
                    callback('请输入0-100正整数');
                }
            } 
        };
        var numValidate3 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入页面超时时间'));
            } else {
                if (/^(0?|[1-9][0-9]*)$/.test(value)) {
                    if(Number(value) > 9999 || Number(value) < 0) {
                        callback('请输入0-9999正整数');
                    }else {
                        callback();
                    }
                } else {
                    callback('请输入0-9999正整数');
                }
            } 
        };
        return {
            loading: false,
            operationData: [],
            dictionariesAllData: [],
            knowAllData: [],
            mapNameData: [],
            dictionariesNameData: [],
            selectConfigIsShow: false, // 选择人员弹窗
            types: [], // 获取用户类型
            cascadeOrg: null, // 按机构查询时是否级联子机构
            course: [],
            activeName: 1,
            activeNameDialog: 1,
            searchList: {
                pageNo: 1,
                pageSize: 5,
            },
            tableList: {},
            tableChecked: [],
            tableSend: [],
            tableSendChecked: {},
            formAdd: {
                infos: [],
                time: [],
                discover: true,
            },
            form: {
                defaultStudent: true
            },
            searchStatisticsList: {
                time: [],
                pageNo: 1,
                pageSize: 5
            },
            tableStatistics: {},
            tablePaper: [],
            tablePaperChecked: {},
            paperVisible: false,
            activeNameDialog: 1,
            resultVisible: false,
            resultSingle: [],
            ids: [],
            rules: {
                examHour: [
                    { required: true, message: '请输入考试时长', trigger: 'blur' },
                    { validator: numValidate, trigger: 'blur' }
                ],
                adoptRate: [
                    { required: true, message: '请输入合格比率', trigger: 'blur' },
                    { validator: numValidate2, trigger: 'blur' }
                ],
                timeOut: [
                    { required: true, message: '请输入页面超时时间', trigger: 'blur' },
                    { validator: numValidate3, trigger: 'blur' }
                ],
                examName: [
                    { required: true, message: '请输入考试名称', trigger: 'blur' },
                    { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                ],
                discover: [
                    { required: true, message: '请选择是否乱序', trigger: 'change' }
                ],
                time: [
                    { required: true, message: '请选择考试日期', trigger: 'change' }
                ],
            },
            examResultTotal: {},
            isShare: false,
            exportParams: {},
        }
    },
    components: {
        PersonnelSelection, Treeselect
    },
    filters: {
        typeFilter(type) {
            switch (type) {
                case '1':
                case 1:
                    return '单选题';
                    break;
                case '2':
                case 2:
                    return '多选题';
                    break;
                case '3':
                case 3:
                    return '判断题';
                    break;
                case '4':
                case 4:
                    return '填空题';
                    break;
                case '5':
                case 5:
                    return '简答题';
                    break;
                case '6':
                case 6:
                    return '语音题';
                    break;
                default: 
                    return '';
                    break;
            }
        }
    },
    computed: {
        planId() {
            return this.$route.query.id;
        }
    },
    created() {
        getOperationData('培训计划管理').then(res => {
            this.operationData = res;
        });
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getDictionariesAllData().then(res => {
            this.dictionariesAllData = res;
        });
        getKnowAllData().then(res => {
            // 知识体系
            this.knowAllData = res;
        });
        getDictionariesNameData().then(res => {
            this.dictionariesNameData = res;
        })
        this.getCourse();
        if(this.$route.query.ids) {
            this.ids = JSON.parse(this.$route.query.ids);
            this.getPaperSetList();
        }
        if(this.$route.query.info) {
            this.formAdd = JSON.parse(decodeURIComponent(this.$route.query.info));
        }
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    methods: {
        normalizer(node) { // 知识体系树
            return {
                id: node.id,
                label: node.knowName,
                children: node.children,
            }
        },
        timeUse(row) {
            if(row.time) {
                var m = Math.floor(row.time / 60);
                var s = row.time % 60;
                return m + ' min ' + s + ' s';
            }else {
                return '-';
            }
        },
        changeTab(index) {
            if(index != 1 && this.formAdd.id) {
                this.$confirm('正在编辑考试中,是否放弃编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['ruleForm'].resetFields();
                    this.formAdd = {
                        infos: [],
                        time: [],
                        discover: true,
                    }
                    this.ids = [];
                    this.tablePaperChecked = {};
                    this.tablePaper = [];
                    this.changeTab2(index);
                }).catch(() => {   

                });
            }else{
                this.changeTab2(index);
            }
        },
        changeTab2(index) { 
            this.activeName = index;
            if(index == 2) { this.getTableSend() }
            if(index == 3) { this.searchStatistics() }
        },
        changeTabDialog(index) {
            this.activeNameDialog = index;
            if(index == 1) {}
            if(index == 2) {}
        },
        getList() {
            this.tableChecked = [];
            this.searchList.startDate = this.searchList.time ? this.searchList.time[0] : '';
            this.searchList.endDate = this.searchList.time ? this.searchList.time[1] : '';
            this.searchList.planId = this.planId;
            this.loading = true;
            this.searchList.noRepeat = '.no-repeat-click3';
            axiosPost('/examMgr/paper/paperList', this.searchList).then(res => {
                this.loading = false;
                this.tableList = res.data;
            }).catch(() => {
                this.loading = false;
            })
        },
        search() {
            this.searchList.pageNo = 1;
            this.getList();
        },
        reset() {
            var obj = this.searchList;
            this.searchList = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            }
        },
        getStatisticstList() {
            this.searchStatisticsList.planId = this.planId;
            this.searchStatisticsList.startTime = this.searchStatisticsList.time ? this.searchStatisticsList.time[0] : '';
            this.searchStatisticsList.endTime = this.searchStatisticsList.time ? this.searchStatisticsList.time[1] : '';
            this.searchStatisticsList.loading = '.loading-exam-2';
            this.searchStatisticsList.noRepeat = '.no-repeat-click2';
            axiosPost('/examMgr/scoreStatistics/scoreStatistics', this.searchStatisticsList).then(res => {
                this.tableStatistics = res.data;
            })
        },
        searchStatistics() {
            this.searchStatisticsList.pageNo = 1;
            this.getStatisticstList();
        },
        resetStatistics() {
            var obj = this.searchStatisticsList;
            this.searchStatisticsList = {
                time: [],
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            }
        },
        handleSelectionChange(val) {
            this.tableChecked = val;
        },
        handleCurrentChange(val) {
            this.searchList.pageNo = val;
            this.getList();
        },
        handleSizeChange(res){ // 更改条数
            this.searchList.pageNo = 1;
            this.searchList.pageSize = res;
            this.getList();
        },
        handleCurrentChange2(val) {
            this.searchStatisticsList.pageNo = val;
            this.getStatisticstList();
        },
        handleSizeChange2(res){ // 更改条数
            this.searchStatisticsList.pageNo = 1;
            this.searchStatisticsList.pageSize = res;
            this.getStatisticstList();
        },
        saveAdd() {
            if(this.tableChecked.length == 0) {
                this.$message.error('请至少选择一个试卷');
                return;
            }
            this.tableChecked.forEach(item => {
                this.ids.push(item.id)
            })
            this.paperVisible = false;
            this.getPaperSetList();
        },
        checkboxChange(check, row){ // 单选
            this.tableSend.forEach(item => {
                if (item.id !== row.id) {
                    item.checked = false
                }
            })
            if(check) {
                this.tableSendChecked = row;
            }else {
                this.tableSendChecked = {}
            }
        },
        getTableSend() {
            axiosPost('/educateMgr/plan/exam/list', {planId: this.planId,loading: '.loading-exam-1'}).then(res => {
                res.data.forEach(item => {
                    item.checked = false;
                })
                this.tableSend = res.data;
            })
        },
        saveSend() {
            this.form.id = this.tableSendChecked.id;
            if(!this.form.id) {
                this.$message({message: '请选择一个考试',type: 'error'});
                return;
            }
            this.form.noRepeat = '.btn-repeat-click2'
            axiosPost('/educateMgr/plan/exam/send', this.form).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.tableSendChecked = {};
                this.form = {};
                this.getTableSend();
            })
        },
        btnGetPaper() {
            this.reset();
            this.search();
            this.paperVisible = true;
        },
        paperAddEdit(flag, id) {
            this.$router.push({
                name: 'paper-operation',
                query:{
                    flag: flag,
                    id: id,
                    ids: JSON.stringify(this.ids),
                    planId: this.planId,
                    info: encodeURIComponent(JSON.stringify(this.formAdd))
                }
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
        getCourse() {
            axiosPost('/educateMgr/plan/course/dropDown', {planId: this.planId}).then(res => {
                this.course = res.data;
            })
        },
        checkboxChange2(check, row){ // 单选
            this.tablePaper.forEach(item => {
                if (item.id !== row.id) {
                    item.checked = false
                }
            })
            if(check) {
                this.tablePaperChecked = row;
            }else {
                this.tablePaperChecked = {}
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.examAdd();
                } else {
                    return false;
                }
            });
        },
        examAdd() {
            this.formAdd.planId = this.planId;
            this.formAdd.paperId = this.tablePaperChecked.id;
            this.formAdd.paperName = this.tablePaperChecked.paperName;
            if(!this.formAdd.paperId) {
                this.$message({message: '请选择一个试卷',type: 'error'});
                return;
            }
            this.course.forEach(item => {
                if(item.id == this.formAdd.courseId) {
                    this.formAdd.courseName = item.name;
                }
            })
            this.formAdd.startTime = this.formAdd.time[0] || '';
            this.formAdd.endTime = this.formAdd.time[1] || '';
            this.formAdd.noRepeat = '.no-repeat-click1'
            axiosPost('/educateMgr/plan/exam/save', this.formAdd).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.$refs['ruleForm'].resetFields();
                this.formAdd = {
                    infos: [],
                    time: [],
                    discover: true,
                }
                this.ids = [];
                this.tablePaperChecked = {};
                this.tablePaper = [];
            })
        },
        examEdit(id) {
            axiosPost('/educateMgr/plan/exam/info', {id: id}).then(res => {
                res.data.time = [res.data.startTime, res.data.endTime];
                this.formAdd = res.data;
                this.ids.push(this.formAdd.paperId);
                this.getCoursePaper(this.formAdd.courseId);
                this.activeName = 1;
            })
        },
        examRemove(id) {
            axiosPost('/educateMgr/plan/exam/remove', {id: id}).then(res => {
                this.getTableSend();
            })
        },
        btnExamRemove(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.examRemove(id);
            }).catch(() => {   

            });
        },
        examInfo(row) {
            let params = {
                paperId: row.paperId,
                paperName: row.paperName,
                examId: row.id,
                examName: row.examName,
            }
            this.exportParams = params;
            this.activeNameDialog = 1;
            this.getResultSingle(params);
            axiosPost('/examMgr/scoreStatistics/answerAnalysis', params).then(res => {
                this.examResultTotal = res.data;
                this.resultVisible = true;
            })
        },
        fileExport(flag) {
            this.exportParams.noRepeat = '.btn-export-' + flag;
            var URL = flag == 1 ? '/examMgr/scoreStatistics/exportAnswerAnalysis' : '/examMgr/scoreStatistics/exportPersonScore';
            axiosPost(URL, this.exportParams).then(res => {
                window.open(res.data)
            })
        },
        getResultSingle(params) {
            axiosPost('/examMgr/scoreStatistics/personScore', params).then(res => {
                this.resultSingle = res.data.personScoreList;
            })
        },
        getPaperTypeName(row) {
            return this.mapNameData[row.knowledgeId] ? this.mapNameData[row.knowledgeId].knowName : '';
        },
        getCoursePaper(id) {
            axiosPost('/educateMgr/course/paper', {id: id}).then(res => {
                this.ids = this.ids.concat(res.data)
                this.getPaperSetList();
            })
        },
        repeatNot() {
            return Array.from(new Set(this.ids));
        },
        getPaperSetList() {
            axiosPost('/examMgr/paper/planPaperList', {ids: this.repeatNot()}).then(res => {
                res.data.forEach(item => {
                    if(this.formAdd.paperId == item.id) {
                        item.checked = true;
                        this.tablePaperChecked = item;
                    }else{
                        item.checked = false;
                    }
                })
                this.tablePaper = res.data;
            })
        }
    }
}
</script>

<style scoped>
    .paperTitle {
        margin: 20px 0;
        font-size: 16px;
        text-align: center;
    }
    .que-box {
        margin-bottom: 20px;
    }
    .item {
        padding-right: 150px;
        position: relative;
        line-height: 25px;
    }
    .item-name {
        margin-right: 10px;
    }
    .paperRight {
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
    }
    .paperRight>span {
        width: 48%;
        display: inline-block;
        text-align: center;
    }
</style>