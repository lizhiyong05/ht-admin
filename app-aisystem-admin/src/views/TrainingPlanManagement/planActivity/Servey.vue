<template>
    <div class="activityPlan-box">
        <ul class="tab-title">
            <li :class="activeName == 1 ? 'on' : ''" @click="changeTab(1)">调研设置</li>
            <li :class="activeName == 2 ? 'on' : ''" @click="changeTab(2)">发放调研</li>
            <li :class="activeName == 3 ? 'on' : ''" @click="changeTab(3)">调研统计</li>
        </ul>
        <div v-show="activeName == 1">
            <ul class="tab-title-sub clearfix">
                <li :class="activeNameSub == 1 ? 'on' : ''" @click="changeTabSub(1)">新建调研</li>
                <li :class="activeNameSub == 2 ? 'on' : ''" @click="changeTabSub(2)">模板选择</li>
            </ul>
            <div v-show="activeNameSub == 1">
                <el-form :model="form" size="small" label-width="80px">
                    <el-form-item label="调研名称">
                        <el-input size="small" v-model="form.name" placeholder="请输入调研名称"></el-input>
                    </el-form-item>
                    <el-form-item label="调研内容">
                        <el-input size="small" v-model="form.content" :autosize="{minRows: 2}" type="textarea" placeholder="请输入调研内容"></el-input>
                    </el-form-item>
                    <div class="el-form-item" :key="index" v-for="(item, index) in form.questions">
                        <div class="que-item">
                            <span class="que-name">问题{{index + 1}}</span>
                            <el-input size="small" v-model="item.title" class="que-input" style="padding-right: 350px;" placeholder="在此输入标题"></el-input>
                            <div class="que-opt" style="width: 350px;">
                                <el-radio-group v-model="item.type" style="padding-left: 20px;margin-right: 20px;">
                                    <el-radio label="单选">单选</el-radio>
                                    <el-radio label="多选">多选</el-radio>
                                    <el-radio label="主观">主观</el-radio>
                                </el-radio-group>
                                <i @click="questionDelete(form.questions, index)" v-if="form.questions.length > 1" class="el-icon-delete"></i>
                            </div>
                        </div>
                        <div v-if="item.type != '主观'">
                            <div class="que-item" v-for="(item2, index2) in item.options" :key="index2">
                                <span class="que-name">{{String.fromCharCode(index2 + 65)}}</span>
                                <el-input size="small" v-model="item2.optionContent" class="que-input" placeholder="在此输入选项"></el-input>
                                <div class="que-opt">
                                    <i @click="optionDelete(item.options, index2)" v-if="item.options.length > 4" class="el-icon-delete"></i>
                                    <i @click="optionAdd(item.options)" v-if="index2 == item.options.length - 1 && item.options.length < 10" class="el-icon-circle-plus-outline"></i>
                                </div>
                            </div>
                        </div>
                        <div class="btn-box" v-if="index == form.questions.length - 1">
                            <el-button type="text" @click="questionAdd">添加问题</el-button>
                        </div>
                    </div>
                    <div class="btn-box">
                        <el-button :disabled="isShare" size="mini" :loading="saveLoading" type="primary" @click="submitForm('普通')">保存</el-button>
                        <el-button :disabled="isShare" size="mini" :loading="saveLoading" type="primary" @click="submitForm('模板')">保存并另存为模板</el-button>
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
                <div class="loading-survey-1">
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
                            label="模板名称"> 
                        </el-table-column>
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
                class="loading-survey-2"
                style="margin-top: 0"
                :data="tableServeyList"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                    <el-table-column
                        align="center"
                        width="100"
                        label="选择">
                        <template slot-scope="scope">
                            <el-checkbox @change="check => checkboxChange(check, scope.row)" v-model="scope.row.checked"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                        type="index"
                        align="center"
                        label="序号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="调研名称">
                        <template slot-scope="scope">
                            <el-button type="text" @click="getInfo(scope.row.surveyId)">{{scope.row.surveyName}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120"
                        label="操作">
                            <template slot-scope="scope">
                                <el-button :disabled="isShare" size="mini" type="text" v-if="operationData.includes('27b37ea3')" @click="edit(scope.row.surveyId)">编辑</el-button>
                                <el-button :disabled="isShare" size="mini" type="text" v-if="operationData.includes('3484c97f')" @click="remove(scope.row.id)">删除</el-button>
                            </template>
                    </el-table-column>
            </el-table>
            <el-form size="small" :rules="rules" ref="ruleForm" inline :model="serveySend" label-width="120px">
                <el-form-item label="调研时段" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="serveySend.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="关联课程" prop="courseId">
                    <el-select v-model="serveySend.courseId" placeholder="请选择关联课程">
                        <el-option
                            v-for="item in course"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sendTypes" label="发放方式">
                    <el-checkbox-group v-model="serveySend.sendTypes">
                        <el-checkbox label="生成二维码">生成二维码</el-checkbox>
                        <!-- <el-checkbox label="网址链接">网址链接</el-checkbox> -->
                        <el-checkbox label="App推送">App推送</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="surveyType" label="调研方式" style="width: 100%;">
                    <el-radio-group v-model="serveySend.surveyType">
                        <el-radio label="匿名调研">匿名调研</el-radio>
                        <el-radio label="实名调研">实名调研</el-radio>
                    </el-radio-group>
                    <div v-if="serveySend.surveyType == '实名调研'" style="display: inline-block;margin-left: 20px;">
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
                        <el-tag size="small" @close="tagClose(index)" v-for="(item, index) in serveySend.students" style="margin-right: 10px;" :key="index" closable>{{item.studentName}}</el-tag>
                    </div>
                    <el-button type="text" @click="selectPersonnel">选择人员</el-button>
                </el-form-item> -->
                <el-form-item label="默认已添加人员" style="width: 100%;">
                    <el-checkbox v-model="serveySend.defaultStudent"></el-checkbox>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button :disabled="isShare" type="primary" :loading="sendLoading" size="mini" @click="submitServeySend('ruleForm')">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 3">
            <el-form size="small" inline :model="serveyResultSearch" label-width="80px">
                <el-form-item label="调研开始时间" label-width="120px" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="serveyResultSearch.time"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="调研名称">
                    <el-input v-model="serveyResultSearch.name" placeholder="请输入调研名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button size="mini" class="no-repeat-click2" type="primary" @click="searchServeyList">查 询</el-button>
                <el-button size="mini" @click="resetServeyResult">重 置</el-button>
            </div>
            <el-table
                size="mini"
                class="loading-survey-3"
                :data="tableServeyList"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                    <el-table-column
                        prop="surveyName"
                        align="center"
                        label="调研名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="调研时段">
                        <template slot-scope="scope">
                            <p>{{scope.row.startTime}} - {{scope.row.endTime}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="100"
                        label="调研结果">
                        <template slot-scope="scope">
                            <el-button type="text" @click="serveyResultDetail(scope.row.id)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="280"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.realQrCode" type="text" @click="qrCodeDownload(scope.row.realQrCode)">二维码下载</el-button>
                            <el-button v-if="scope.row.realQrCode" type="text" @click="qrCodeShow(scope.row.realQrCode)">二维码投屏</el-button>
                            <el-button v-if="scope.row.realQrCode" type="text" @click="qrCodeShow(scope.row.realQrCode)">二维码展示</el-button>
                            <!-- <el-button v-if="scope.row.webUrl" type="text" @click="copyUrl(scope.row.webUrl)">复制链接</el-button> -->
                        </template>
                    </el-table-column>
            </el-table>
        </div>
        <el-dialog :show-close="false" :visible.sync="moduleDetailVisible" width="1000px">
            <p slot="title" class="module-title">{{moduleType == 1 ? '模板详情' : '调研详情'}}</p>
            <div class="detail-box">
                <span class="detail-name">调研名称</span>
                <span>{{moduleDetail.name}}</span>
            </div>
            <div class="detail-box">
                <span class="detail-name">调研内容</span>
                <span>{{moduleDetail.content}}</span>
            </div>
            <div class="detail-box" v-for="(item, index) in moduleDetail.questions" :key="index">
                <span class="detail-name">问题{{index + 1}}</span>
                <span>【{{item.type}}】{{item.title}}</span>
                <div class="detail-box" style="margin-top: 15px;" v-for="(item2, index2) in item.options" :key="index2">
                    <span class="detail-name">{{String.fromCharCode(index2 + 65)}}</span>
                    <span>{{item2.optionContent}}</span>
                </div>
            </div>
            <div class="btn-box">
                <el-button size="mini" @click="moduleDetailVisible = false;">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog class="dia-img-box" :visible.sync="dialogVisible" width="85vh">
            <img style="width: 80vh;height: 80vh;" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="resultVisible" width="1000px">
            <p slot="title" class="module-title">调研结果</p>
            <ul class="tab-title-sub clearfix">
                <li :class="activeNameDialog == 1 ? 'on' : ''" @click="changeTabDialog(1)">汇总统计</li>
                <li :class="activeNameDialog == 2 ? 'on' : ''" @click="changeTabDialog(2)">单人统计</li>
            </ul>
            <div v-show="activeNameDialog == 1">
                <el-button size="mini" :disabled="isShare" @click="fileExport('0')" class="btn-export-0" v-if="operationData.includes('964ebfb7')" style="margin-bottom: 20px;" type="primary">导出结果</el-button>
                <div class="detail-box">
                    <span class="detail-name">调研名称</span>
                    <span>{{resultTotal.name}}</span>
                </div>
                <div class="detail-box">
                    <span class="detail-name">调研内容</span>
                    <span>{{resultTotal.content}}</span>
                </div>
                <div class="detail-box" v-for="(item, index) in resultTotal.questions" :key="index">
                    <span class="detail-name">问题{{index + 1}}</span>
                    <span>【{{item.type}}】{{item.title}}</span>
                    <div class="detail-box" style="margin-top: 15px;" v-for="(item2, index2) in item.options" :key="index2">
                        <span class="detail-name" style="width: 120px; left: -40px;">{{item2.percent}} {{String.fromCharCode(index2 + 65)}}</span>
                        <span>{{item2.optionContent}}</span>
                    </div>
                </div>
            </div>
            <div v-show="activeNameDialog == 2">
                <el-button size="mini" :disabled="isShare" @click="fileExport('1')" class="btn-export-1" v-if="operationData.includes('8cdf0c23')" style="margin-bottom: 20px;" type="primary">导出结果</el-button>
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
                <span class="detail-name">调研名称</span>
                <span>{{resultSingleInfo.survey.name}}</span>
            </div>
            <div class="detail-box">
                <span class="detail-name">调研内容</span>
                <span>{{resultSingleInfo.survey.content}}</span>
            </div>
            <div class="detail-box" v-for="(item, index) in resultSingleInfo.survey.questions" :key="index">
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
} from "@/assets/js/api";
import PersonnelSelection from '@/components/PersonnelSelection'
export default {
    name: 'servey',
    data() {
        return {
            dialogVisible: false,
            dialogImageUrl: '',
            selectConfigIsShow: false, // 选择人员弹窗
            types: [], // 接口地址
            cascadeOrg: null, // 按机构查询时是否级联子机构
            course: [],
            operationData: [],
            activeName: 1,
            activeNameSub: 1,
            activeNameDialog: 1,
            exportId: '',
            form: {
                name: '',
                content: '',
                questions: [
                    {
                        title: '',
                        type: '单选', // 单选 多选 主观
                        options:[
                            {
                                optionContent: ''
                            },
                            {
                                optionContent: ''
                            },
                            {
                                optionContent: ''
                            },
                            {
                                optionContent: ''
                            }
                        ]
                    }
                ]
            },
            moduleDetailVisible: false,
            moduleType: 1,
            moduleSearch: {
                pageNo: 1,
                pageSize: 5
            },
            serveyResultSearch: {
                time: []
            },
            tableModule: {},
            tableServeyList: [],
            serveyChecked: {},
            serveySend: {
                time: [],
                sendTypes: [],
                defaultStudent: true
            },
            moduleDetail: {},
            dynamicTags: ['姓名'],
            inputVisible: false,
            inputValue: '',
            resultVisible: false,
            resultTotal: {},
            resultSingle: [],
            resultSingleInfo: {
                survey: {},
                info: {},
            },
            resultSingleInfoVisible: false,
            rules: {
                time: [
                    { type: 'array', required: true, message: '请选择调研时段', trigger: 'change' }
                ],
                sendTypes: [
                    { type: 'array', required: true, message: '请选择发放方式', trigger: 'change' }
                ],
                surveyType: [
                    { required: true, message: '请选择调研方式', trigger: 'change' }
                ],
            },
            sendLoading: false,
            saveLoading: false,
            isShare: false,
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
        this.getCourse();
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    components: {
        PersonnelSelection
    },
    methods: {
        changeTab(index) {
            if(index != 1 && this.form.id) {
                this.$confirm('正在编辑调研中,是否放弃编辑?', '提示', {
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
            this.tableServeyList = [];
            if(index == 1) {}
            if(index == 2) {
                this.getServeyList({sendStatus: false});
            }
            if(index == 3) {
                this.searchServeyList();
            }
        },
        changeTabSub(index) {
            if(index != 1 && this.form.id) {
                this.$confirm('正在编辑调研中,是否放弃编辑?', '提示', {
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
        submitForm(type) {
            let flag = false;
            var num = 0;
            var num1 = 0;
            if(!this.form.name || !this.form.content) {
                flag = true;
            }else{
                try {
                    this.form.questions.forEach(item => {
                        if(!item.title) {
                            throw new Error()
                        }
                        if(item.title.length > 128) {
                            num1++;
                        }
                        if(item.type != '主观') {
                            let isQualified = item.options.every((item2) => {
                                return item2.optionContent.length > 0
                            })
                            let isMax = item.options.every((item2) => {
                                return item2.optionContent.length <= 128
                            })
                            if(!isQualified){
                                throw new Error();
                            }
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
            if(this.form.name.length > 32) {
                this.$message({message: '调研名称长度应小于等于32个字符',type: 'warning'});
                return;
            }
            if(this.form.content.length > 512) {
                this.$message({message: '调研内容长度应小于等于512个字符',type: 'warning'});
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
            this.form.type = type;
            this.form.planId = this.planId;
            this.saveLoading = true;
            var URL = this.form.id ? '/educateMgr/survey/modify' : '/educateMgr/plan/survey/save';
            axiosPost(URL, this.form).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.saveLoading = false;
                this.questionClear();
            }).catch(() => {
                this.saveLoading = true;
            })
        },
        questionAdd() {
            this.form.questions.push({
                title: '',
                type: '单选', // 单选 多选 主观
                options:[
                    {
                        optionContent: ''
                    },
                    {
                        optionContent: ''
                    },
                    {
                        optionContent: ''
                    },
                    {
                        optionContent: ''
                    }
                ]
            });
        },
        questionClear() {
            this.form = {
                name: '',
                content: '',
                questions: [
                    {
                        title: '',
                        type: '单选', // 单选 多选 主观
                        options:[
                            {
                                optionContent: ''
                            },
                            {
                                optionContent: ''
                            },
                            {
                                optionContent: ''
                            },
                            {
                                optionContent: ''
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
                optionContent: ''
            })
        },
        searchModule() {
            this.moduleSearch.pageNo = 1;
            this.getModuleList();
        },
        resetModule() {
            var obj = this.moduleSearch;
            this.moduleSearch = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            }
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
            this.moduleSearch.loading = '.loading-survey-1';
            this.moduleSearch.noRepeat = '.no-repeat-click1';
            axiosPost('/educateMgr/survey/list',this.moduleSearch).then(res => {
                this.tableModule = res.data;
            })
        },
        getModuleDetail(id) {
            axiosPost('/educateMgr/survey/info',{
                id: id
            }).then(res => {
                this.moduleType = 1;
                this.moduleDetail = res.data;
                this.moduleDetailVisible = true;
            })
        },
        useModule(id) {
            axiosPost('/educateMgr/survey/info',{
                id: id
            }).then(res => {
                this.form.name = res.data.name;
                this.form.content = res.data.content;
                this.form.questions = res.data.questions;
                this.activeNameSub = 1;
            })
        },
        checkboxChange(check, row){ // 表格选择更改
            this.tableServeyList.forEach(item => {
                if (item.id != row.id) {
                    item.checked = false
                }
            })
            if(check) {
                this.serveyChecked = row;
            }else {
                this.serveyChecked = {}
            }
        },
        submitServeySend(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btnServeySend()
                } else {
                    return false;
                }
            });
        },
        btnServeySend() {
            this.serveySend.id = this.serveyChecked.id
            if(!this.serveySend.id) {
                this.$message({message: '请选择一个调研',type: 'error'});
                return;
            }
            this.serveySend.startTime = this.serveySend.time[0] || '';
            this.serveySend.endTime = this.serveySend.time[1] || '';
            this.course.forEach(item => {
                if(item.id == this.serveySend.courseId) {
                    this.serveySend.courseName = item.name;
                }
            })
            this.sendLoading = true;
            this.serveySend.surveyHeads = this.serveySend.surveyType == '实名调研' ?  this.dynamicTags : [];
            axiosPost('/educateMgr/plan/survey/send',this.serveySend).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.sendLoading = false;
                this.getServeyList({sendStatus: false});
                this.$refs['ruleForm'].resetFields();
                this.serveyChecked = {};
                this.dynamicTags = ['姓名'];
                this.serveySend = {
                    time: [],
                    sendTypes: [],
                    defaultStudent: true
                }
            }).catch(() => {
                this.sendLoading = false;
            })
        },
        searchServeyList() {
            this.serveyResultSearch.loading = '.loading-survey-3'
            this.serveyResultSearch.sendStatus = true;
            this.serveyResultSearch.startTime = this.serveyResultSearch.time ? this.serveyResultSearch.time[0] : '';
            this.serveyResultSearch.endTime = this.serveyResultSearch.time ? this.serveyResultSearch.time[1] : '';
            this.serveyResultSearch.noRepeat = '.no-repeat-click2'
            this.getServeyList(this.serveyResultSearch);
        },
        resetServeyResult() {
            this.serveyResultSearch = {
                time: []
            }
        },
        getServeyList(params) {
            params.planId = this.planId;
            params.loading ? null : params.loading = '.loading-survey-2';
            axiosPost('/educateMgr/plan/survey/list',params).then(res => {
                if(res.code == 1000) {
                    res.data.map(item => {
                        item.checked = false;
                        return item;
                    })
                    this.tableServeyList = res.data;
                }
            })
        },
        serveyResultDetail(id) {
            this.activeNameDialog = 1;
            this.exportId = id;
            this.getResultTotal(id);
            this.getResultSingle(id);
        },
        getResultTotal(id) {
            this.resultTotal = {};
            axiosPost('/educateMgr/plan/survey/result', {id: id}).then(res => {
                this.resultTotal = res.data;
                this.resultVisible = true;
            })
        },
        getResultSingle(id) {
            this.resultSingle = [];
            axiosPost('/educateMgr/plan/survey/single/result', {id: id}).then(res => {
                this.resultSingle = res.data;
            })
        },
        getResultSingleInfo(id) {
            axiosPost('/educateMgr/plan/survey/single/info', {id: id}).then(res => {
                this.resultSingleInfo = res.data;
                this.resultSingleInfoVisible = true;
            })
        },
        tagClose(item) {
            this.serveySend.students.splice(this.serveySend.students.indexOf(item), 1);
        },
        selectPersonnel(){ // 选择人员            
            this.selectConfigIsShow = true;
            this.types = ['STUDENT'];
        },
        getDataFun(res){ // 获取数据
            this.serveySend.students = [];
            res.forEach(item => {
                this.serveySend.students.push({
                    studentId: item.id,
                    studentName: item.userName,
                })
            })
        },
        getCloseFun(res){ // 弹窗是否关闭
            this.selectConfigIsShow = res;
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
        getCourse() {
            axiosPost('/educateMgr/plan/course/dropDown', {planId: this.planId}).then(res => {
                this.course = res.data;
            })
        },
        copyUrl(url) {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', url);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                this.$message({message: '复制成功',type: 'success'});
            }else {
                this.$message({message: '复制失败',type: 'error'});
            }
            document.body.removeChild(input);
        },
        qrCodeDownload(qrCode) {
            window.open(qrCode, '_blank');
        },
        qrCodeShow(qrCode) {
            this.dialogImageUrl = qrCode;
            this.dialogVisible = true;
        },
        fileExport(flag) {
            axiosPost('/educateMgr/plan/survey/export', {id: this.exportId,noRepeat: '.btn-export-' + flag}).then(res => {
                window.open(res.data)
            })
        },
        getInfo(id) {
            axiosPost('/educateMgr/survey/info', {id: id}).then(res => {
                this.moduleType = 2;
                this.moduleDetail = res.data;
                this.moduleDetailVisible = true;
            })
        },
        edit(id) {
            axiosPost('/educateMgr/survey/info', {id: id}).then(res => {
                this.activeName = 1;
                this.activeNameSub = 1;
                this.form = res.data;
            })
        },
        remove(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axiosPost('/educateMgr/plan/survey/remove', {id: id}).then(res => {
                    this.getServeyList({sendStatus: false});
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
        width: 200px;
    }
    .que-input {
        padding: 0 200px 0 80px;
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
<style>
    .dia-img-box .el-dialog{
        margin-top: 5vh !important;
    }
</style>