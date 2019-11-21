<template>
    <div class="activityPlan-box">
        <ul class="tab-title">
            <li :class="activeName == 1 ? 'on' : ''" @click="changeTab(1)">消息通知</li>
            <li :class="activeName == 2 ? 'on' : ''" @click="changeTab(2)">通知列表</li>
        </ul>
        <div v-show="activeName == 1">
            <el-form size="small" :rules="rules" ref="ruleForm" inline :model="notice" label-width="120px">
                <el-form-item label="发送时间">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="notice.sendTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <span class="tip" style="margin-top: 10px;">tips: 不选择即为即时发送</span>
                <el-form-item label="关联课程">
                    <el-select v-model="notice.courseId" placeholder="请选择关联课程">
                        <el-option
                            v-for="item in course"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sendTypes" label="通知方式">
                    <el-checkbox-group v-model="notice.sendTypes">
                        <el-checkbox label="邮件">邮件</el-checkbox>
                        <el-checkbox label="APP">APP</el-checkbox>
                        <el-checkbox label="钉钉">钉钉</el-checkbox>
                        <el-checkbox label="微信">微信</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="收件人" style="width:100%">
                    <div class="input-box">
                        <span v-if="notice.to.length == 0" class="tip">tips: 默认已添加培训计划内全体人员</span>
                        <el-tag size="mini" @close="tagClose(item, 1)" v-for="(item, index) in notice.to" style="margin-right: 10px;" :key="index" closable>{{item.receiverName}}</el-tag>
                    </div>
                    <el-button type="text" @click="selectPersonnel(1)">选择人员</el-button>
                </el-form-item>
                <el-form-item v-if="notice.sendTypes.indexOf('邮件') > -1" label="抄送" style="width:100%">
                    <div class="input-box">
                        <el-tag size="mini" @close="tagClose(item, 2)" v-for="(item, index) in notice.cc" style="margin-right: 10px;" :key="index" closable>{{item.receiverName}}</el-tag>
                    </div>
                    <el-button type="text" @click="selectPersonnel2(2)">选择人员</el-button>
                </el-form-item>
                <el-form-item prop="topic" label="主题">
                    <el-input style="width: 530px;" v-model="notice.topic" placeholder="请输入主题"></el-input>
                </el-form-item>
                <el-form-item label="正文" style="width: 100%;">
                    <quill-editor
                        style="line-height: 1;width: 770px;"
                        v-model="notice.content"
                        ref="myQuillEditor">
                    </quill-editor>
                </el-form-item>
                <el-form-item label="相关附件" prop="files" style="width: 100%;">
                    <div style="min-width: 200px;">
                        <el-tag  
                            @close="fileClose(item)" 
                            v-for="(item, index) in notice.files" 
                            style="margin-right: 10px;" 
                            :key="index" 
                            closable>
                                {{item.fileName}}
                        </el-tag>
                        <label for="fileUpload" style="cursor: pointer;color: #409EFF">附件上传</label>
                        <input type="file" id="fileUpload" @change="file" style="display: none;">
                    </div>
                </el-form-item>
                <!-- <el-form-item label="默认已添加人员" style="width: 100%;">
                    <el-checkbox v-model="notice.defaultStudent"></el-checkbox>
                </el-form-item> -->
                <div class="btn-box">
                    <el-button :disabled="isShare" size="mini" type="primary" class="btnNotice-1" @click="submitForm('ruleForm', true)">发送</el-button>
                    <el-button :disabled="isShare" size="mini" type="primary" class="btnNotice-0" @click="submitForm('ruleForm', false)">存草稿</el-button>
                    <!-- <el-button size="mini" @click="noticeClear">清空</el-button> -->
                </div>
            </el-form>
        </div>
        <div v-show="activeName == 2">
            <el-form size="small" inline :model="noticeListSearch" label-width="80px">
                <el-form-item label="主题">
                    <el-input v-model="noticeListSearch.topic" placeholder="请输入主题"></el-input>
                </el-form-item>
                <el-form-item label="消息状态">
                    <el-select v-model="noticeListSearch.sendStatus" placeholder="请选择消息状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待发送" value="0"></el-option>
                        <el-option label="已发送" value="1"></el-option>
                        <el-option label="未发送" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button size="mini" class="no-repeat-click1" type="primary" @click="searchNoticeList">查 询</el-button>
                <el-button size="mini" @click="resetNoticeList">重 置</el-button>
            </div>
            <div class="loading-notice-1">
                <el-table 
                    size="mini"
                    :data="noticeListTable.records"
                    cell-class-name="cellName"
                    stripe
                    header-cell-class-name="headerCellName">
                    <el-table-column 
                        prop="topic" 
                        align="center" 
                        label="主题">
                    </el-table-column>
                    <el-table-column  
                        align="center" 
                        label="消息状态"> 
                        <template slot-scope="scope">
                            {{scope.row.sendStatus == 0 ? '待发送' : scope.row.sendStatus == 1 ? '已发送' : '未发送'}}
                        </template>
                    </el-table-column>
                    <el-table-column 
                        prop="sendTime" 
                        align="center" 
                        label="发送时间"> 
                    </el-table-column>
                    <el-table-column 
                        label="操作"
                        width="250"
                        align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="infoNoticeList(scope.row.id)">查看</el-button>
                            <el-button :disabled="isShare" type="text" v-if="scope.row.sendStatus != 1 && operationData.includes('b06e1274')" @click="sendNoticeList(scope.row.id)">发送</el-button>
                            <el-button :disabled="isShare" type="text" v-if="scope.row.sendStatus != 1 && operationData.includes('a5cb03f4')" @click="edit(scope.row.id)">编辑</el-button>
                            <el-button :disabled="isShare" type="text" v-if="scope.row.sendStatus != 1 && operationData.includes('492e324b')" @click="remove(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="noticeListSearch.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page.sync="noticeListSearch.pageNo"
                    :total="noticeListTable.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            :show-close="false"
            :visible.sync="detailVisible"
            width="800px">
            <p slot="title" class="module-title">通知详情</p>
            <el-form size="small" :model="detailData" label-width="120px">
                <el-form-item label="发送时间">
                    {{detailData.sendTime}}
                </el-form-item>
                <el-form-item label="关联课程">
                    {{detailData.courseName}}
                </el-form-item>
                <el-form-item label="通知方式">
                    <el-tag style="margin-right: 10px;" v-for="(item, index) in detailData.sendTypes" :key="index">{{item}}</el-tag>
                </el-form-item>
                <el-form-item label="收件人">
                    <el-tag style="margin-right: 10px;" v-for="(item, index) in detailData.to" :key="index">{{item.receiverName}}</el-tag>
                </el-form-item>
                <el-form-item v-if="detailData.sendTypes && detailData.sendTypes.indexOf('邮件') > -1" label="抄送">
                    <el-tag style="margin-right: 10px;" v-for="(item, index) in detailData.cc" :key="index">{{item.receiverName}}</el-tag>
                </el-form-item>
                <el-form-item label="主题">
                    {{detailData.topic}}
                </el-form-item>
                <el-form-item label="正文">
                    <div style="line-height: normal;padding-top: 11px;" v-html="detailData.content"></div>
                </el-form-item>
                <el-form-item label="相关附件">
                    <span class="file" @click="downFile(item.realFilePath)" v-for="(item, index) in detailData.files" :key="index">{{item.fileName}}</span>
                </el-form-item>
                <!-- <el-form-item label="默认已添加人员">
                    <el-checkbox v-model="detailData.defaultStudent" disabled></el-checkbox>
                </el-form-item> -->
            </el-form>
            <div class="btn-box">
                <el-button size="mini" @click="detailVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <PersonnelSelection 
            v-if="selectConfigIsShow" 
            :selectConfigIsShow="selectConfigIsShow" 
            :types="types" 
            :cascadeOrg="cascadeOrg" 
            @listenEventData="getDataFun" 
            :existingData="existingData"
            @listenEventClose="getCloseFun">
        </PersonnelSelection>
        <PersonnelSelection 
            v-if="selectConfigIsShow2" 
            :selectConfigIsShow="selectConfigIsShow2" 
            :types="types" 
            :cascadeOrg="cascadeOrg" 
            @listenEventData="getDataFun2" 
            :existingData="existingData2"
            @listenEventClose="getCloseFun2">
        </PersonnelSelection>
    </div>
</template>

<script>
import {
    axiosPost, 
    getOperationData, 
    fileUpload
} from "@/assets/js/api";
import PersonnelSelection from '@/components/PersonnelSelection'
export default {
    name: 'notice',
    data() {
        return {
            selectConfigIsShow: false, // 选择人员弹窗
            selectConfigIsShow2: false, // 选择人员弹窗
            types: [], // 获取用户类型
            cascadeOrg: null, // 按机构查询时是否级联子机构
            course: [],
            operationData: [],
            activeName: 1,
            noticeListTable: {},
            noticeListSearch: {
                pageNo: 1,
                pageSize: 5
            },
            notice: {
                sendTypes: [],
                files: [],
                defaultStudent: true,
                to: [],
                cc: []
            },
            noticeType: 1, // 1 app 2 邮件
            detailData: {
                sendTypes: [],
            },
            detailVisible: false,
            rules: {
                sendTypes: [
                    { type: 'array', required: true, message: '请选择通知方式', trigger: 'change' }
                ],
                topic: [
                    { required: true, message: '请输入主题', trigger: 'blur' },
                    { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                ],
            },
            existingData:[], //传递的数据
            existingData2:[], //传递的数据
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
    watch: {
        'notice.to': function(val){
            this.existingData = val.map(item => {
                return {userId: item.receiverId};
            })
        },
        'notice.cc': function(val){
            this.existingData2 = val.map(item => {
                return {userId: item.receiverId};
            })
        }
    },
    created() {
        getOperationData('培训计划管理').then(res => {
            this.operationData = res;
        });
        this.getCourse();
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    methods: {
        changeTab(index) {
            if(index != 1 && this.notice.id) {
                this.$confirm('正在编辑通知中,是否放弃编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.noticeClear();
                    this.changeTab2(index);
                }).catch(() => {   

                });
            }else{
                this.changeTab2(index);
            }
        },
        changeTab2(index) {
            this.activeName = index;
            if(index == 1) {}
            if(index == 2) {
                this.searchNoticeList();
            }
        },
        searchNoticeList() {
            this.noticeListSearch.pageNo = 1;
            this.getNoticeList();
        },
        resetNoticeList() {
            var obj = this.noticeListSearch;
            this.noticeListSearch = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            }
        },
        getNoticeList() {
            this.noticeListSearch.planId = this.planId;
            this.noticeListSearch.loading = '.loading-notice-1';
            this.noticeListSearch.noRepeat = '.no-repeat-click1';
            axiosPost('/educateMgr/plan/notice/list', this.noticeListSearch).then(res => {
                this.noticeListTable = res.data;
            })
        },
        handleCurrentChange(res) {
            this.noticeListSearch.pageNo = res;
            this.getNoticeList();
        },
        handleSizeChange(res){ // 更改条数
            this.noticeListSearch.pageNo = 1;
            this.noticeListSearch.pageSize = res;
            this.getNoticeList();
        },
        infoNoticeList(id) {
            axiosPost('/educateMgr/plan/notice/info', {id: id}).then(res => {
                this.detailData = res.data;
                this.detailData.to.unshift({receiverName: '培训计划内全体人员'})
                this.detailVisible = true;
            })
        },
        sendNoticeList(id) {
            this.$confirm('确定发送?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axiosPost('/educateMgr/plan/notice/send', {id: id}).then(res => {
                    this.$message({message: '发送成功',type: 'success'});
                    this.getNoticeList();
                })
            }).catch(() => {   

            });
        },
        fileClose(item) {
            this.notice.files.splice(this.notice.files.indexOf(item), 1);
        },
        file() {
            var fileUploadDOM = document.getElementById('fileUpload');
            var file = {
                file: fileUploadDOM.files[0],
                data: {frontId: ''},
                onProgress: function() {},
                onSuccess: function() {},
            }
            fileUpload(file).then(res => {
                this.notice.files.push({
                    fileName: res.data.oriName,
                    filePath: res.data.lastStoreLocation
                })
                fileUploadDOM.value = ''
            })
        },
        noticeClear() {
            this.$refs['ruleForm'].resetFields();
            this.notice = {
                files: [],
                sendTypes: [],
                defaultStudent: true,
                to: [],
                cc: []
            }
        },
        submitForm(formName, type) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.noticeSend(type);
                } else {
                    return false;
                }
            });
        },
        noticeSend(type) {
            this.notice.type = type;
            this.notice.planId = this.planId;
            this.course.forEach(item => {
                if(item.id == this.notice.courseId) {
                    this.notice.courseName = item.name;
                }
            })
            this.notice.noRepeat = '.btnNotice-' + Number(type);
            axiosPost('/educateMgr/plan/notice/save', this.notice).then(res => {
                this.$message({message: '操作成功',type: 'success'});
                this.noticeClear();
            })
        },
        tagClose(item, type) {
            if(type == 1) {
                this.notice.to.splice(this.notice.to.indexOf(item), 1);
            }else {
                this.notice.cc.splice(this.notice.cc.indexOf(item), 1);
            }
        },
        selectPersonnel(type){ // 选择人员            
            this.selectConfigIsShow = true;
            this.types = ['USER'];
            this.noticeType = type;
        },
        selectPersonnel2(type){ // 选择人员            
            this.selectConfigIsShow2 = true;
            this.types = ['USER'];
            this.noticeType = type;
        },
        getDataFun(res){ // 获取数据 接收人员
            this.notice.to = [];
            res.forEach(item => {
                this.notice.to.push({
                    receiverId: item.userId,
                    receiverName: item.userName,
                })
            })
        },
        getDataFun2(res){ // 获取数据 抄送人员
            this.notice.cc = [];
            res.forEach(item => {
                this.notice.cc.push({
                    receiverId: item.userId,
                    receiverName: item.userName,
                })
            })
        },
        getCloseFun(res){ // 弹窗是否关闭
            this.selectConfigIsShow = res;
        },
        getCloseFun2(res){ // 弹窗是否关闭
            this.selectConfigIsShow2 = res;
        },
        getCourse() {
            axiosPost('/educateMgr/plan/course/dropDown', {planId: this.planId}).then(res => {
                this.course = res.data;
            })
        },
        downFile(url) {
            window.open(url, '_blank')
        },
        edit(id) {
            axiosPost('/educateMgr/plan/notice/info', {id: id}).then(res => {
                this.activeName = 1;
                this.notice = res.data;
            })
        },
        remove(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axiosPost('/educateMgr/plan/notice/remove', {id: id}).then(res => {
                    this.searchNoticeList();
                })
            }).catch(() => {   

            });
        },
    }
}
</script>

<style scoped>
    .file {
        color:#409eff;
        margin-right: 10px;
        cursor: pointer;
    }
    .tip {
        font-size: 12px;
        color: #999;
        display: inline-block;
    }
</style>

<style>
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
</style>
