<template><!-- 开班计划管理 shuling.xiang-->
    <div class="class-open-plan">
        <h2 class="title-h2">开班计划管理</h2>
        <div class="search-container">
            <el-form :inline="true" class="demo-form-inline" label-width="100px">
                <el-form-item label="所属区域" size="small">
                    <el-select v-model="areaId" placeholder="请选择">
                        <el-option v-for="(item,ind) in dictData['area_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划状态" size="small">
                    <el-select v-model="planStatus" placeholder="请选择">
                        <el-option v-for="item in planStatusOption" :key="item.id" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划名称" size="small">
                    <el-input v-model="planName" placeholder="请输入计划名称" size="small"></el-input>
                </el-form-item>
                <el-form-item label="创建人" size="small">
                    <el-input v-model="createUser" placeholder="请输入创建人" size="small"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" size="small">
                    <el-date-picker
                            v-model="createTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button class="searchList el-btn-min-100" type="primary" @click="searchList" size="small">查询</el-button>
                <el-button class="el-btn-min-100" @click="resetSearchCondition" size="small">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" v-if="perLoaded ? PERMISSIONS.CLASSPLAN.ADD : false" @click="addDataFun">新增</el-button>
            <el-button size="small" v-if="perLoaded ? PERMISSIONS.CLASSPLAN.DELETE : false" @click="deleteDataFun(multipleSelection.map((i) => i.id))">删除</el-button>
            <el-button size="small" v-if="perLoaded ? PERMISSIONS.CLASSPLAN.REPORT : false" @click="reportDataFun(multipleSelection.map((i) => i.id))">上报</el-button>
        </div>
        <div class="map-list">
            <div class="map-table loading-table">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable" size="mini"
                          style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection" align="center"
                            width="40"
                            :selectable="selectable" >
                    </el-table-column>
                    <el-table-column align="center"
                            label="计划编号" width="160px">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="postMethods(scope.row.id)">{{scope.row.planId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                            prop="planName"
                            label="计划名称">
                    </el-table-column>
                    <el-table-column align="center"
                            prop="planStatus"
                            label="计划状态" width="130px">
                        <template slot-scope="scope">
<!--                            {{scope.row.planStatus ? dictionariesNameData[scope.row.planStatus] : ''}}-->
                            {{scope.row.planStatus == '1' ?'待上报':(scope.row.planStatus == '2'?'已上报':(scope.row.planStatus == '3'?'审核不通过':'审核通过并发布'))}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="areaId" label="所属区域" width="80" align="center">
                        <template slot-scope="scope">
                            {{scope.row.areaId !== null ? dictionariesNameData[scope.row.areaId]:''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="计划附件" prop="opFiles" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.files" :key="index" >
                                <a :href="item.readAbsoluteLocation" target="_blank">{{item.fileName}}</a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createUser" align="center"
                            label="创建人" width="80">
                    </el-table-column>
                    <el-table-column
                            prop="createTime" align="center"
                            label="创建时间" width="160px">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="150">
                        <template slot-scope="scope">
                            <span class="table-operation" v-if="(scope.row.planStatus !== '1' && scope.row.planStatus !== '3') && (perLoaded ? PERMISSIONS.CLASSPLAN.EDIT : false)" style="color:#999999;">修改</span>
                            <span class="table-operation" v-else-if="(scope.row.planStatus === '1' || scope.row.planStatus === '3') && (perLoaded ? PERMISSIONS.CLASSPLAN.EDIT : false)" @click="editFun(scope.row)">修改</span>
                            <span class="table-operation" v-if="scope.row.planStatus !== '2' && (perLoaded ? PERMISSIONS.CLASSPLAN.EXAMINE : false )" style="color:#999999;">审核</span>
                            <span class="table-operation" v-else-if="scope.row.planStatus === '2' && (perLoaded ? PERMISSIONS.CLASSPLAN.EXAMINE : false)" @click="checkDataFun(scope.row)">审核</span>
                            <span class="table-operation" v-if="perLoaded ? PERMISSIONS.CLASSPLAN.DELETE : false" @click="deleteDataFun([scope.row.id])">删除</span>
                        </template>
                    </el-table-column>
                </el-table>

                <!--page-->
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20,50]"
                            :page-size="5"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 新增开班计划弹窗 -->
        <el-dialog class="need-header" title="新增开班计划" :visible.sync="addIsShow" @close='addClose("addForm")'>
            <div class="edit-form">
                <el-form :model="addData" :inline="true" :rules="addRules" ref="addForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="计划编号" prop="planId" size="small">
                        <el-input placeholder="计划编号自动生成" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="计划名称" prop="planName" size="small">
                        <el-input v-model="addData.planName" placeholder="请输入计划名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区域" prop="areaId" size="small">
                        <el-select v-model="addData.areaId" placeholder="请选择">
                            <el-option v-for="(item,ind) in dictData['area']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="相关附件">
                            <el-upload
                                       action=""
                                       ref="upload"
                                       v-model="addData.opFiles"
                                       class="upload-demo"
                                       :on-remove="handleRemove"
                                       :before-remove="beforeRemove"
                                       multiple
                                       :limit="100"
                                       :http-request="fileUploadFun"
                                       :on-exceed="handleExceed"
                                       :file-list="fileList">
                                <p class="font-link">点击上传</p>
                            </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="addIsShow = false" size="small">取消</el-button>
                <el-button class="addPlanSubmit el-btn-min-100" type="primary" @click="addPlanSubmit('addForm')" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 修改开班计划弹窗 -->
        <el-dialog class="need-header" title="修改开班计划" :visible.sync="editIsShow" @close='editClose("editForm")'>
            <div class="edit-form">
                <el-form :model="editData" :inline="true" :rules="editRules" ref="editForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="计划编号" size="small">
                        <el-input v-model="editData.planId" placeholder="计划编号自动生成" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="计划名称" prop="planName" size="small">
                        <el-input v-model="editData.planName" placeholder="请输入计划名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区域" prop="areaId" size="small">
                        <el-select v-model="editData.areaId" placeholder="请选择">
                            <el-option v-for="(item,ind) in dictData['area']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="相关附件">
                            <el-upload
                                   action=""
                                   ref="upload"
                                   v-model="editData.opFiles"
                                   class="upload-demo"
                                   :on-remove="handleRemove"
                                   :before-remove="beforeRemove"
                                   multiple
                                   :limit="100"
                                   :http-request="fileUploadFun"
                                   :on-exceed="handleExceed"
                                   :file-list="fileList">
                                <p class="font-link">点击上传</p>
                            </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="editIsShow = false" size="small">取消</el-button>
                <el-button class="editPlanSubmit el-btn-min-100" type="primary" @click="editPlanSubmit('editForm')" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 审核开班计划弹窗 -->
        <el-dialog class="need-header" title="审核开班计划" :visible.sync="checkIsShow" @close="$refs['checkForm'].resetFields();">
            <div class="edit-form">
                <el-form :model="checkData" :inline="true" :rules="checkRules" ref="checkForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="计划编号：" prop="planId" size="small">
                        <el-input v-model="checkData.planId" placeholder="请输入计划编号" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="计划名称：" prop="planName" size="small">
                        <el-input v-model="checkData.planName" placeholder="请输入计划名称" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区域：" prop="area" size="small">
                        <el-select v-model="checkData.area" disabled placeholder="请选择" class="edit-form-select">
                            <el-option
                                    v-for="(item,ind) in areaOptions"
                                    :key="ind"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="相关附件：" prop="opFiles">
                        <div style="padding-top: 9px">
                            <div v-for="(item, index) in checkData.opFiles" :key="index" >
                                <a :href="item.readAbsoluteLocation" target="_blank">{{item.fileName}}</a>
                            </div>
                        </div>
                    </el-form-item>
                    <br>
                    <el-form-item label="审核：" prop="planStatus">
                        <template>
                            <el-radio v-model="checkData.planStatus" label="4">审核通过并发布</el-radio>
                            <el-radio v-model="checkData.planStatus" label="3">审核不通过</el-radio>
                        </template>
                    </el-form-item>
                    <el-form-item label="审核意见：" prop="auditMessage">
                        <el-input type="textarea" v-model="checkData.auditMessage" class="wid500"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="checkIsShow = false" size="small">取消</el-button>
                <el-button class="checkPlanSubmit el-btn-min-100" type="primary" @click="checkPlanSubmit('checkForm')" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!-- 删除数据 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="deleteIsShow">
            <div class="dialog-container">
                <p class="align-center">选中项确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="deleteIsShow = false" size="small">取消</el-button>
                <el-button class="deleteSubmit el-btn-min-100" type="primary" @click="deleteSubmit" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 上报 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="reportIsShow">
            <div class="dialog-container">
                <p class="align-center">选中项确认要上报吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="reportIsShow = false" size="small">取消</el-button>
                <el-button class="reportSubmit el-btn-min-100" type="primary" @click="reportSubmit" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        fileUpload,
        // exportExcel,
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
    } from "@/assets/js/api"
    import ElUploadList from "element-ui/packages/upload/src/upload-list";
    import { PERMISSION } from "@/assets/js/permissions";

    export default {
        name: "ClassOpenPlan",
        components: {
            ElUploadList,
            // exportExcel,
        },
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数
                planId: '', //计划编号
                planName: '', //计划名称
                createUser: '', //创建人
                opFilesId:'',
                planStatusOption: [{
                    value: 1,
                    label: '待上报'
                }, {
                    value: 2,
                    label: '已上报'
                }, {
                    value: 3,
                    label: '审核不通过'
                },{
                    value: 4,
                    label: '审核通过并发布'
                }],
                planStatus: '', //计划状态
                areaOptions: [],
                area: '', //所属区域
                areaId: '', //区域 id
                // opFiles: null, //附件
                addIsShow: false, // 新增开班计划
                addData: { //添加的数据
                    planName: '',
                    area: '',
                    areaId: '',
                    opFiles: null
                },
                addRules: { // 新增的规则
                    planName: [
                        {required: true, message: '请输入计划名称', trigger: 'change'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    areaId: [{required: true, message: '请选择所属区域', trigger: 'change'}],
                },
                editIsShow: false, // 修改开班计划
                editData: { // 编辑的数据
                    planId: '',
                    planName: '',
                    area: '',
                    areaId: '',
                    // planStatusOption: [],
                    opFiles: null

                },
                editRules: { // 修改的规则
                    planName: [
                        {required: true, message: '请输入计划名称', trigger: 'change'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    areaId: [{required: true, message: '请选择所属区域', trigger: 'change'}],
                },
                checkIsShow: false, //审核开班计划
                checkData: { // 审核的数据
                    planId: '',
                    planName: '',
                    area: '',
                    createUser: '',
                    createTime: ['',''],
                    opFiles: [{ //附件
                        fileName: '',
                        filePath: '',
                        readAbsoluteLocation: '',
                    }
                    ],
                    planStatus: '',
                    auditMessage: '',
                },
                checkRules: { // 审核的规则
                    planStatus: [{required: true, message: '请选择审核结果', trigger: 'change'}],
                    auditMessage:[
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ]
                },

                opFiles: [{ //附件
                    fileName: '',
                    filePath: '',
                    }
                ],
                fileName: '', //附件名称
                filePath: '', //附件地址
                multipleSelection: [], // 表格已经选择的内容
                deleteIsShow: false, // 删除弹窗是否显示

                multipleSelection2: [], // 角色权限已经选择的内容
                reportIsShow: false, // 上报弹窗是否显示
                reportSelectId: '', // 上报人配置  item
                createTime: ['', ''], //创建时间
                fileList:[], //附件上传
                userName: '', //用户名
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条

                // 字典项
                dictData: {},
                dictMap: {},

                knowMap: {}, // 知识体系

                // 组织机构
                orgPath: null,
                orgOptions: [{
                    path: 'id',
                    orgName: 'label',
                    children: 'children'
                }],
                pID: [],
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,
            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            this.getList(1, 10); //获取列表
        },

        methods: {
            loadPreData() {

                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                        this.areaOptions = res['area_all'];
                        // this.planStatusOption = res['planStatusOption'];
                    });

                getDictionariesNameData().then(res => { //获取全部数据字典名称
                    this.dictionariesNameData = res;

                });

                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                })
            },

            getList() { // 获取列表
                axiosPost('/educateMgr/openPlan/list', {
                // planId: this.planId,
                    loading:'.loading-table',
                    noRepeat:'.searchList',
                    planName: this.planName,
                    // planStatus: this.planStatus == '1' ?'待上报':(this.planStatus == '2'?'已上报':(this.planStatus == '3'?'审核不通过':'审核通过并发布')),
                    planStatus: this.planStatus,
                    // area: this.area,
                    areaId: this.areaId,
                    //opFiles: this.opFiles,
                    createUser: this.createUser,
                    startTime: this.createTime ? this.createTime[0]: '',
                    endTime: this.createTime ? this.createTime[1] : '',
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                    this.records.map( i => {
                        i.files = i.opFiles;
                        return i;
                    });
                });
            },
            searchList() { // 通过查询条件获取列表
                this.pageNo = 1;
                this.getList();
            },

            resetSearchCondition() { // 清空搜索条件 重置
                this.planName = '';
                this.planStatus = '';
                this.areaId = '';
                this.createUser = '';
                this.createTime = ['', ''];
            },
            deleteDataFun(val) { // 删除数据
                this.pID = val;
                if (val <= 0) {
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
                    return;
                }
                this.deleteIsShow = true;
            },
            reportDataFun(val) { // 上报数据
                this.pID = val;
                if (val <= 0) {
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
                    return;
                }
                this.reportIsShow = true;
            },
            reportSubmit() { // 上报数据请求        2019-07-19 新增 zdj
                // const tem = this.pID.reduce((a, b) => a + ',' + b );
                // console.log(`要上报   ${tem}`);
                // 批量上报功能
                axiosPost('/educateMgr/openPlan/appear', {
                    noRepeat:'.reportSubmit',
                    ids: this.pID
                }).then(res => {
                    this.$message({message:'上报成功',type: 'success'});
                    this.reportIsShow = false;
                    this.getList(1, 10); //获取列表
                })
            },
            deleteSubmit() { // 删除请求请求
                axiosPost('/educateMgr/openPlan/delete', {
                    noRepeat:'.deleteSubmit',
                    ids: this.pID
                }).then(() => {
                    this.deleteIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                });
            },
            addDataFun() { // 新增数据
                this.addIsShow = true;
            },
            addPlanSubmit(formName) { // 新增 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/educateMgr/openPlan/create', {
                            noRepeat:'.addPlanSubmit',
                            planName: this.addData.planName,
                            area: this.dictionariesNameData[this.addData.areaId],
                            areaId: this.addData.areaId,
                            opFiles: this.opFiles

                        }).then(() => {
                            this.addIsShow = false;
                            this.$message({message:'新增成功',type: 'success'});
                            this.pageNo = 1;
                            this.getList();
                            this.addData.opFiles = this.opFiles;
                        });
                    }
                });
            },
            addClose(addForm) { //关闭新增弹窗时清空验证
                this.$nextTick(() => {
                    this.$refs[addForm].resetFields();
                    this.$refs.upload.clearFiles();
                    this.fileList = [];
                    this.opFiles = [
                        { //附件
                            fileName: '',
                            filePath: '',
                        }
                    ];
                });
            },

            editFun(row) { // 点击编辑按钮
                this.editIsShow = true;
                axiosPost('/educateMgr/openPlan/info',{
                    id: row.id
                })
                    .then((res)=> {
                        this.editData.planId = res.data.planId,
                        this.editData.planName = res.data.planName,
                        this.editData.area = res.data.area,
                        this.editData.areaId = res.data.areaId,
                        // this.editData.planStatusOption = res.data.planStatusOption,
                        this.editData.opFiles = res.data.opFiles,
                        this.editData.id = res.data.id,
                        res.data.opFiles.forEach(element => {
                            if(element.filePath!=""&&element.fileName) {
                                this.fileList.push({
                                    name: element.fileName,
                                    url: element.filePath
                                });
                                this.opFiles.push({
                                    fileName: element.fileName,
                                    filePath: element.filePath
                                });
                            }
                        });

                    })
            },
            editPlanSubmit(formName) { // 编辑数据 提交
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        axiosPost('/educateMgr/openPlan/alter', {
                            noRepeat:'.editPlanSubmit',
                            planId: this.editData.planId,
                            planName: this.editData.planName,
                            area: this.editData.area,
                            areaId: this.editData.areaId,
                            opFiles: this.opFiles,
                            id: this.editData.id
                        }).then(() => {
                            this.editIsShow = false;
                            this.$message({message:'修改成功',type: 'success'});
                            this.pageNo = 1;
                            this.getList();
                            this.editData.opFiles = this.opFiles
                        });
                    }
                });
            },
            editClose(editForm) { //关闭编辑弹窗时清空验证
                this.$nextTick(() => {
                    this.$refs[editForm].resetFields();
                    this.$refs.upload.clearFiles();
                    this.fileList = [];
                    this.opFiles = [
                        { //附件
                            fileName: '',
                            filePath: '',
                        }
                    ];
                });
            },

            checkDataFun(row) { // 审核开班计划
                this.checkIsShow = true;
                axiosPost('/educateMgr/openPlan/info',{
                    id: row.id
                })
                    .then((res)=> {
                        this.checkData.planId = res.data.planId,
                        this.checkData.planName = res.data.planName,
                        this.checkData.area = res.data.area,
                        this.checkData.createUser = res.data.createUser,
                        this.checkData.createTime = res.data.createTime,
                        this.checkData.auditMessage = res.data.auditMessage,
                        this.checkData.opFiles = res.data.opFiles,
                        this.checkData.id = res.data.id
                    })
            },
            checkPlanSubmit(formName) { // 审核 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!this.checkRules) {
                            this.$message({message: '请选择', type: 'warning'});
                        } else {
                            axiosPost('/educateMgr/openPlan/audit', {
                                noRepeat:'.checkPlanSubmit',
                                planStatus: this.checkData.planStatus,
                                auditMessage: this.checkData.auditMessage,
                                id: this.checkData.id
                            }).then(() => {
                                this.checkIsShow = false;
                                this.$message({message:'审核成功',type: 'success'});
                                this.pageNo = 1;
                                this.getList();
                            });
                        }
                    }
                });
            },

            handleSelectionChange(val) { // 选择用户角色表格
                this.multipleSelection = val;
            },
            handleSelectionChange2(val) { // 选择审核人配置表格
                this.multipleSelection2 = val;
            },
            changeTree(Form) { // 下拉框选择出发事件
                this.$refs.Form.validateField(`${Form}.orgPath`)
            },
            selectable(row, index){  //勾选框部分内容禁用
                if(row.planStatus === '1' || row.planStatus === '3'){
                    return true;
                }else{
                    return false;
                }
            },

            messageAlert(message){
                this.$notify({
                    title: message,
                    type: 'success',
                    position: 'bottom-right'
                });
            },

            handleSizeChange(res) { // 每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList();
            },
            handleCurrentChange(res) { // 第几页
                this.pageNo = res;
                this.getList();
            },
            normalizer(node) { //机构树形菜单
                return {
                    id: node.path,
                    label: node.orgName,
                    children: node.children,
                }
            },
            postMethods(res) { //res为详情页id
                this.$router.push({path: '/class-open-plan-detail', query: {id: res}});
            },

            handleRemove(file, fileList) {
                this.opFiles.forEach((item, index, arr) => {
                    if(item.fileName == file.name) {
                        arr.splice(index, 1);
                    }
                });
            },
            beforeRemove(file) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },

            handleExceed(files, fileList) { //附件上传
                this.$message.warning(`当前无限制上传文件个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            fileUploadFun(item){ //附件上传
                fileUpload(item)
                    .then(res => {
                       this.opFiles1 = [{
                           name: res.data.oriName,
                           url: res.data.readAbsoluteLocation,
                            fileName:res.data.oriName,
                            filePath:res.data.lastStoreLocation,
                        }];

                        this.opFiles1.forEach(element => {

                            this.opFiles.push({
                                fileName: element.fileName,
                                filePath: element.filePath
                            })
                        });
                        this.opFiles1 = [];
                    })

            },
        }
    }
</script>

<style scoped>
    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .search-container2 ul li {
        margin: 0 20px 0 0;
        float: left;
    }
    .table-operation {
        color: #409EFF;
        margin-left: 5px;
        cursor: pointer;
    }

    .el-pagination {
        display: inline-block;
    }

    .pagination {
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }

    .total {
        font-weight: bold;
    }

    .edit-form p, .add-form p {
        /*margin: 10px auto;*/
        width: 100%;
    }

    .edit-form p span, .add-form p span {
        width: 100px;
        display: inline-block;
    }

    .edit-form-select {
        width: 100%;
    }

    .wid100 {
        width: 100%;
    }

    .wid500 {
        width: 504px;
    }
    .margin-right-20 {
        margin-right:18px;
    }
    .font-link {
        color:#409EFF;
    }
    .el-table_1_column_6 .cell a {
        display: block;
        width:100%;
    }
    .el-form-item__content a {
        display: block;
        width:100%;
        line-height: 25px;
    }
    .el-form-item__content{
        padding-top: 9px;
    }
    .upload-demo >>> .el-upload-list {
        width: 320px;
    }
</style>
