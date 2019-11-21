<template>
    <div class="activityPlan-box">
        <ul class="tab-title">
            <li :class="activeName == 1 ? 'on' : ''" @click="changeTab(1)">签到设置</li>
            <li :class="activeName == 2 ? 'on' : ''" @click="changeTab(2)">发放签到</li>
            <li :class="activeName == 3 ? 'on' : ''" @click="changeTab(3)">签到统计</li>
        </ul>
        <div v-show="activeName == 1">
            <el-form size="small" ref="signRuleForm" inline :model="sign" label-width="80px">
                <div v-for="(item, index) in sign.settings" :key="index">
                    <el-form-item
                        :rules="[
                            { validator: (rule, value, callback) => startTimeValidator(rule, value, callback, index), trigger: 'blur' },
                        ]" 
                        label="签到时间" :prop="'settings.'+ index +'.startTime'">
                        <el-date-picker 
                            @change="clearValidate('signRuleForm')"
                            v-show="isEdit"
                            :editable="false"
                            prefix-icon="el-icon-date"
                            v-model="item.startTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
                        </el-date-picker>
                        <p v-show="!isEdit" style="width: 400px;">{{item.startOpenTime}} {{item.startOpenTime ? ' 至 ' : ''}} {{item.startCloseTime}}</p>
                    </el-form-item>
                    <el-form-item
                        :rules="[
                            { validator: (rule, value, callback) => endTimeValidator(rule, value, callback, index), trigger: 'blur' },
                        ]" 
                        label="签退时间" :prop="'settings.'+ index +'.endTime'">
                        <el-date-picker
                            @change="clearValidate('signRuleForm')"
                            v-show="isEdit"
                            :editable="false"
                            prefix-icon="el-icon-date"
                            v-model="item.endTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
                        </el-date-picker>
                        <p v-show="!isEdit" style="width: 400px;">{{item.endOpenTime}} {{item.endOpenTime ? ' 至 ' : ''}} {{item.endCloseTime}}</p>
                    </el-form-item>
                    <i @click="signDelete(sign.settings, index)" v-if="sign.settings.length > 1 && isEdit" class="el-icon-delete"></i>
                </div>
                <div class="btn-box" v-if="isEdit">
                    <el-button type="text" @click="signAdd()">添加签到</el-button>
                </div>
            </el-form>
            <div class="btn-box" style="margin-top: 30px;">
                <el-button size="mini" @click="getSignSetList()" v-if="isEdit && isFirst">取消</el-button>
                <el-button :disabled="isShare" type="primary" size="mini" v-if="isEdit" @click="submitForm('signRuleForm')">保存</el-button>
                <el-button :disabled="isShare" type="primary" size="mini" v-else @click="signEdit()">修改</el-button>
            </div>
        </div>
        <div class="signSend-box loading-sign-1" v-show="activeName == 2">
            <img class="qrCode" :src="qrCode" alt="二维码">
            <el-form size="small" inline ref="formName" :rules="rules" :model="form" label-width="120px">
                <el-form-item prop="" label="发放方式">
                    <div v-if="signSendInfo">
                        <el-radio-group v-model="signSendInfo.signType">
                            <el-radio disabled label="静态二维码">静态二维码</el-radio>
                            <el-radio disabled label="动态二维码">动态二维码</el-radio>
                        </el-radio-group>
                        <div style="display:inline-block;margin-left: 20px;">
                            <el-button type="text" @click="downQrcode" v-if="signSendInfo.signType == '静态二维码'">下载二维码</el-button>
                            <el-button type="text" @click="printQrcode" v-if="signSendInfo.signType == '静态二维码'">打印二维码</el-button>
                            <el-button :disabled="isShare" type="text" @click="openQrcode" v-if="signSendInfo.signType == '动态二维码'">投屏</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <el-radio-group v-model="form.signType">
                            <el-radio label="静态二维码">静态二维码</el-radio>
                            <el-radio label="动态二维码">动态二维码</el-radio>
                        </el-radio-group>
                        <div style="display:inline-block;margin-left: 20px;">
                            <el-button type="text" @click="downQrcode" v-if="form.signType == '静态二维码'">下载二维码</el-button>
                            <el-button type="text" @click="printQrcode" v-if="form.signType == '静态二维码'">打印二维码</el-button>
                            <el-button :disabled="isShare" type="text" @click="openQrcode" v-if="form.signType == '动态二维码'">投屏</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="签到方式" style="width: 100%;">
                    <div v-if="signSendInfo">
                        <el-tag
                            :key="index"
                            v-for="(tag,index) in signSendInfo.signHead.split('|')">
                            {{tag}}
                        </el-tag>
                    </div>
                    <div v-else>
                        <el-tag
                            :key="index"
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
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
                    </div>
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
                <el-button :disabled="isShare" size="mini" v-if="!signSendInfo" type="primary" @click="submitForm2('formName')">保存</el-button>
            </div>
        </div>
        <div v-show="activeName == 3">
            <div class="tab-box">
                <ul class="tab-title-sub clearfix">
                    <li :class="item.id == signId ? 'on' : ''" v-for="(item, index) in sign.settings" :key="index" @click="changeSignTab(item.id)">签到{{index + 1}}</li>
                </ul>
                <el-button type="primary" :disabled="isShare" v-if="operationData.includes('906b0001')" class="btnExport" size="mini" @click="exportSign">导出</el-button>
            </div>
            <table class="sign-title loading-sign-2" cellspacing="0">
                <tbody>
                    <tr>
                        <td rowspan="2" style="width: 450px;">
                            <div class="sign-oud">
                                <p>签到时间:{{signStatistics.startOpenTime}} - {{signStatistics.startCloseTime}}</p>
                                <p>签退时间:{{signStatistics.endOpenTime}} - {{signStatistics.endCloseTime}}</p>
                            </div>
                        </td>
                        <td>出勤：{{signStatistics.sign}}人</td>
                        <td>正常签到：{{signStatistics.signIn}}人</td>
                        <td>正常签退：{{signStatistics.signOut}}人</td>
                    </tr>
                    <tr>
                        <td>请假：{{signStatistics.signLeave}}人</td>
                        <td>迟到：{{signStatistics.late}}人</td>
                        <td>早退：{{signStatistics.early}}人</td>
                    </tr>
                </tbody>
            </table>
            <div class="clearfix">
                <el-button :disabled="isShare" type="primary" v-if="operationData.includes('83a2f3ff')" class="fl" size="mini" @click="signStatusEdit">编辑</el-button>
                <el-input size="mini" class="fr" style="width: 200px;" 
                    v-model="signListSearch.name" placeholder="请输入关键字搜索">
                    <el-button size="mini" slot="append" @click="searchSignList" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <div class="loading-sign-3">
                <el-table 
                    size="mini"
                    :data="signListTable.records"
                    cell-class-name="cellName"
                    stripe
                    header-cell-class-name="headerCellName">
                    <el-table-column 
                        prop="studentName" 
                        align="center" 
                        label="姓名">
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="签到"> 
                        <template slot-scope="scope">
                            <el-checkbox v-if="isStatusEdit" v-model="scope.row.signIn"></el-checkbox>  
                            <span v-else>{{scope.row.signIn ? '✔' : ''}}</span>                      
                        </template>
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="迟到"> 
                        <template slot-scope="scope">
                            <el-checkbox v-if="isStatusEdit" v-model="scope.row.late"></el-checkbox>  
                            <span v-else>{{scope.row.late ? '✔' : ''}}</span>                      
                        </template>
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="签退"> 
                        <template slot-scope="scope">
                            <el-checkbox v-if="isStatusEdit" v-model="scope.row.signOut"></el-checkbox>  
                            <span v-else>{{scope.row.signOut ? '✔' : ''}}</span>                      
                        </template>
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="早退"> 
                        <template slot-scope="scope">
                            <el-checkbox v-if="isStatusEdit" v-model="scope.row.early"></el-checkbox>  
                            <span v-else>{{scope.row.early ? '✔' : ''}}</span>                      
                        </template>
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="缺勤"> 
                        <template slot-scope="scope">
                            <el-checkbox v-if="isStatusEdit" v-model="scope.row.absence"></el-checkbox>  
                            <span v-else>{{scope.row.absence ? '✔' : ''}}</span>                      
                        </template>
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="请假"> 
                        <template slot-scope="scope">
                            <el-checkbox v-if="isStatusEdit" v-model="scope.row.signLeave"></el-checkbox>  
                            <span v-else>{{scope.row.signLeave ? '✔' : ''}}</span>                      
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @current-change="changeSignList"
                    :current-page.sync="signListSearch.pageNo"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="signListSearch.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="signListTable.total">
                </el-pagination>
            </div>
            <div class="btn-box" v-if="isStatusEdit">
                <el-button :disabled="isShare" type="primary" size="mini" @click="signStatusSave">保存</el-button>
                <el-button size="mini" @click="getSignList()">取消</el-button>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="1200px">
            <div class="clearfix">
                <div class="left">
                    <p class="qr-title">扫码签到</p>
                    <img style="width: 350px;height 350px;" v-if="qrCodeDong" :src="qrCodeDong" alt="">
                    <div v-else class="qr-hover">未获取到二维码</div>
                </div>
                <div class="right">
                    <p class="sign-num">已签到人数：<span>{{qrNum}}</span></p>
                    <div class="man-box clearfix">
                        <ul v-if="qrArr.list0.length > 0" class="man-item">
                            <li v-for="(item2, index2) in qrArr.list0" :key="index2" :title="item2.name">{{item2.name}}</li>
                        </ul>
                        <ul v-if="qrArr.list1.length > 0" class="man-item">
                            <li v-for="(item2, index2) in qrArr.list1" :key="index2" :title="item2.name">{{item2.name}}</li>
                        </ul>
                        <ul v-if="qrArr.list2.length > 0" class="man-item">
                            <li v-for="(item2, index2) in qrArr.list2" :key="index2" :title="item2.name">{{item2.name}}</li>
                        </ul>
                        <ul v-if="qrArr.list3.length > 0" class="man-item">
                            <li v-for="(item2, index2) in qrArr.list3" :key="index2" :title="item2.name">{{item2.name}}</li>
                        </ul>
                    </div>
                </div>
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
    name: 'sign',
    data() {
        return {
            selectConfigIsShow: false, // 选择人员弹窗
            types: [], // 接口地址
            cascadeOrg: null, // 按机构查询时是否级联子机构
            course: [],
            operationData: [],
            activeName: 1,
            signListTable: {},
            signListSearch: {
                pageNo: 1,
                pageSize: 5
            },
            sign: {
                settings: [
                    {
                        startTime: [],
                        endTime: [],
                    }
                ]
            },
            form: {
                defaultStudent: true
            },
            dynamicTags: [],
            inputVisible: false,
            dialogVisible: false,
            inputValue: '',
            isEdit: false,
            isFirst: false,
            signId: '',
            signSendInfo: '',
            signStatistics: {},
            isStatusEdit: false,
            rules: {
                signType: [
                    { required: true, message: '请选择发放方式', trigger: 'change' }
                ],
            },
            qrCode: '',
            qrCodeDong: '',
            qrTimer: null,
            qrNum: 0,
            qrArr: {
                list0: [],
                list1: [],
                list2: [],
                list3: [],
            },
            isShare: false,
        }
    },
    components: {
        PersonnelSelection
    },
    watch: {
        signId(newVal, oldVal) {
            if(newVal) {
                this.getStatistics();
            }
        },
        dialogVisible(newVal, oldVal) {
            if(!newVal) {
                window.clearInterval(this.qrTimer);
            }
        },
    },
    beforeDestroy() {
        window.clearInterval(this.qrTimer);
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
        this.$nextTick(() => {
            this.getSignSetList();
        });
        this.getQrCode();
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    methods: {
        changeTab(index) {
            this.activeName = index;
            if(index == 1) { this.getSignSetList() }
            if(index == 2) {
                if(!this.signSendInfo){
                    this.getSaveSendInfo();
                }
            }
            if(index == 3) {}
        },
        searchSignList() {
            this.signListSearch.pageNo = 1;
            this.getSignList();
        },
        getSignList() {
            this.signListSearch.signId = this.signId
            this.signListSearch.loading = '.loading-sign-3'
            axiosPost('/educateMgr/plan/sign/statistic/list', this.signListSearch).then(res => {
                this.signListTable = res.data;
                this.isStatusEdit = false;
            })
        },
        getStatistics() {
            axiosPost('/educateMgr/plan/sign/statistic', {signId: this.signId,loading: '.loading-sign-2'}).then(res => {
                this.signStatistics = res.data;
                this.searchSignList();
            })
        },
        changeSignList(res) {
            this.signListSearch.pageNo = res;
            this.getSignList();
        }, 
        handleSizeChange(res){ // 更改条数
            this.signListSearch.pageNo = 1;
            this.signListSearch.pageSize = res;
            this.getSignList();
        },
        exportSign() {
            axiosPost('/educateMgr/plan/sign/export', {planId: this.planId,noRepeat: '.btnExport'}).then(res => {
                if(res.code == 1000) {
                    window.open(res.data)
                }else if(res.code == 1002){
                    this.$message({message: res.msg,type: 'warning'});
                }
            })
        },
        signStatusEdit() {
            if(this.signListTable.records.length > 0) {
                this.isStatusEdit = true;
            }
        },
        signStatusSave() {
            this.$confirm('请确认以上记录的迟到、早退、缺勤状态是否正确，修改后以上状态不再进行自动计算，以本次提交为准', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = [];
                this.signListTable.records.forEach(item => {
                    params.push({
                        id: item.id,
                        absence: item.absence,
                        early: item.early,
                        late: item.late,
                        signIn: item.signIn,
                        signLeave: item.signLeave,
                        signOut: item.signOut,
                    })
                })
                axiosPost('/educateMgr/plan/sign/statistic/modify', {list: params}).then(res => {
                    this.isStatusEdit = false;
                    this.$message({message: '操作成功',type: 'success'});
                    this.getStatistics();
                })
            }).catch(() => {   

            });
        },
        getSignSetList() {
            this.clearValidate('signRuleForm');
            axiosPost('/educateMgr/plan/sign/list', {planId: this.planId}).then(res => {
                if(res.data.length == 0) {
                    this.isEdit = true;
                }else{
                    this.isEdit = false;
                    this.isFirst = true;
                    res.data.forEach(item => {
                        item.startTime = [];
                        item.endTime = [];
                        if(item.startOpenTime) {
                            item.startTime.push(item.startOpenTime);
                            item.startTime.push(item.startCloseTime)
                        }
                        if(item.endOpenTime) {
                            item.endTime.push(item.endOpenTime);
                            item.endTime.push(item.endCloseTime)
                        }
                    })
                    this.sign.settings = res.data;
                    this.signId = this.sign.settings[0].id;
                    this.changeSignTab(this.signId);
                }
            })
        },
        changeSignTab(id) {
            if(this.signId == id) {
                return;
            }
            this.signId = id;
        },
        clearValidate(formName) {
            this.$refs[formName].clearValidate();
        },
        signAdd() {
            this.clearValidate('signRuleForm');
            this.sign.settings.push({
                startTime: [],
                endTime: [],
            })
        },
        signEdit() {
            this.isEdit = true;
        },
        signDelete(sign, index) {
            sign.splice(index, 1);
            this.clearValidate('signRuleForm');
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.signSave();
                } else {
                    return false;
                }
            });
        },
        timeSort(tempStart, tempEnd) {
            tempStart = tempStart.sort();
            tempEnd = tempEnd.sort();
            var result = 0;
            for(var k = 1;k < tempStart.length;k++){
                if (tempStart[k] <= tempEnd[k-1]){
                    result+=1;
                }
            }
            return result>0;
        },
        signSave() {
            var tempStart = [], tempEnd = [];
            this.sign.planId = this.planId;
            this.sign.settings.forEach((item, index) => {
                item.startOpenTime = item.startTime ? item.startTime[0] || '' : '';
                item.startCloseTime = item.startTime ? item.startTime[1] || '' : '';
                item.endOpenTime = item.endTime ? item.endTime[0] || '' : '';
                item.endCloseTime = item.endTime ? item.endTime[1] || '' : '';
                tempStart.push(new Date(item.startOpenTime.replace(/-/g, '/')))
                tempEnd.push(new Date(item.endCloseTime.replace(/-/g, '/')))
            })
            if(this.timeSort(tempStart, tempEnd)) {
                this.$message({message: '时间段不可重复',type: 'warning'});
                return;
            }
            axiosPost('/educateMgr/plan/sign/save', this.sign).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.getSignSetList();
            })
        },
        getSaveSendInfo() {
            axiosPost('/educateMgr/plan/sign/info', {planId: this.planId,loading: '.loading-sign-1'}).then(res => {
                this.signSendInfo = res.data;
            })
        },
        submitForm2(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveSend();
                } else {
                    return false;
                }
            });
        },
        saveSend() {
            this.form.planId = this.planId;
            if(!this.form.signType) {
                this.$message({message: '请选择发放方式',type: 'error'});
                return;
            }
            this.form.signHeads = this.dynamicTags;
            axiosPost('/educateMgr/plan/sign/send', this.form).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.getSaveSendInfo();
                this.form = {};
                this.dynamicTags = [];
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
        startTimeValidator(rule, value, callback, index) {
            let endTime = this.sign.settings[index].endTime ? this.sign.settings[index].endTime[0] : '';
            let startTime = value ? value[1] : '';
            if(!startTime) {
                callback('请选择签到时间');
                return;
            }
            if(startTime && endTime && new Date(Date.parse(endTime.replace(/-/g,"/"))) < new Date(Date.parse(startTime.replace(/-/g,"/")))) {
                callback('签退开始时间应大于签到结束时间');
            }else {
                callback();
            }
        },
        endTimeValidator(rule, value, callback, index) {
            let startTime = this.sign.settings[index].startTime ? this.sign.settings[index].startTime[1] : '';
            let endTime = value ? value[0] : '';
            if(!endTime) {
                callback('请选择签退时间');
                return;
            }
            if(startTime && endTime && new Date(Date.parse(endTime.replace(/-/g,"/"))) < new Date(Date.parse(startTime.replace(/-/g,"/")))) {
                callback('签退开始时间应大于签到结束时间');
            }else {
                callback();
            }
        },
        getQrCode() {
            axiosPost('/educateMgr/plan/qrcode', {planId: this.planId}).then(res => {
                this.qrCode = res.data;
            })
        },
        printQrcode() {
            var qrWin = window.open();
            qrWin.document.body.innerHTML = `<style>@page {margin: 0;}</style><img style="margin: auto;" src="${this.qrCode}" alt="二维码">`;
            setTimeout(function() { qrWin.print(); }, 1); // setTimeout 等图片加载完再打印;
        },
        downQrcode() {
            window.open(this.qrCode)
        },
        openQrcode() {
            this.dialogVisible = true;
            this.getSignInfo();
            this.qrTimer = setInterval(() => {
                this.getSignInfo()
            }, 8000);
        },
        getSignInfo() {
            axiosPost('/educateMgr/plan/sign/screen', {planId: this.planId}).then(res => {
                if(res.code == 1000) {
                    this.qrCodeDong = res.data.qrWeb;
                    if(this.qrCodeDong) {
                        this.qrNum = res.data.infos.length;
                        this.qrArr = {
                            list0: [],
                            list1: [],
                            list2: [],
                            list3: [],
                        }
                        res.data.infos.forEach((item,index) => {
                            this.qrArr['list' + (index % 4)].push(item);
                        })
                    }
                }else if(res.code == 1002) {
                    this.qrCodeDong = null;
                    window.clearInterval(this.qrTimer);
                    this.$message({message: '未到签到时间或签到时间已过',type: 'warning'});
                }
            })
        }
    }
}
</script>

<style scoped>
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
    .sign-title {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    .sign-title td {
        height: 40px;
        line-height: 40px;
        border: 1px solid #ddd;
        text-align: center;
        font-size: 14px;
    }
    .sign-oud {
        padding-left: 20px;
        line-height: 25px;
        text-align: left;
    }
    .el-icon-delete {
        margin-left: 15px;
        margin-top: 9px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    .signSend-box {
        padding-left: 150px;
        position: relative;
    }
    .qrCode {
        position: absolute;
        top: 0;
        left: 30px;
        width: 150px;
        height: 150px;
    }

    .tab-box {
        position: relative;
        padding-right: 70px;
    }
    .btnExport {
        position: absolute;
        top: 0;
        right: 0;
    }

    .left {
        float: left;
        width: 350px;
    }
    .qr-title {
        height: 50px;
        color: #63B5F2;
        font-size: 30px;
        padding-left: 150px;
        line-height: 37px;
        background: url('~@/assets/img/icon-sao.png') no-repeat 90px 0;
    }
    .right {
        float: right;
        width: 780px;
    }
    .sign-num {
        color: #666;
        font-size: 18px;
        margin-bottom: 30px;
    }
    .sign-num>span {
        font-size: 36px;
        color: #63B5F2;
    }
    .qr-hover {
        width: 350px;
        height: 350px;
        text-align: center;
        line-height: 350px;
    }
    .man-item {
        box-shadow: 0 0 5px 1px rgba(0,0,0,.05);
        float: left;
        width: 175px;
        line-height: 30px;
        margin-right: 20px;
        font-size: 14px;
        color: #333;
    }
    .man-item>li {
        text-align: center;
        overflow: hidden;
        height: 30px;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: #fff;
    }
    .man-item>li:nth-child(odd) {
        background: #F8FCFF;
    }
</style>