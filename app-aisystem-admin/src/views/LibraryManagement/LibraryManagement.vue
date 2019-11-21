<template><!-- 文库管理 shuling.xiang-->
    <div class="library-management">
        <h2 class="title-h2">文库管理</h2>
        <div class="search-container">
            <el-form :inline="true" class="demo-form-inline" label-width="100px">
                <el-form-item label="文档标题" size="small">
                    <el-input v-model="docTitle" placeholder="请输入文档标题"></el-input>
                </el-form-item>
                <el-form-item label="文档类型" size="small">
                    <el-select v-model="docType" placeholder="请选择">
                        <el-option
                                v-for="item in docTypeOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建人" size="small">
                    <el-input v-model="createUser" placeholder="请输入创建人"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" size="small">
                    <el-date-picker
                            v-model="createTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button class="searchList el-btn-min-100" type="primary" @click="searchList" size="small">查询</el-button>
                <el-button class="el-btn-min-100" @click="resetSearchCondition" size="small">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" v-if="perLoaded ? PERMISSIONS.LIBRARY.ADD : false" @click="addDataFun">新增</el-button>
            <el-button size="small" v-if="perLoaded ? PERMISSIONS.LIBRARY.DELETE : false" @click="deleteDataFun(multipleSelection.map((i) => i.id))">删除</el-button>
        </div>
        <div class="map-list">
            <div class="map-table loading-table">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable"
                          style="width: 100%" @selection-change="handleSelectionChange" size="small">
                    <el-table-column
                            type="selection" align="center"
                            width="40">
                    </el-table-column>
                    <el-table-column align="center"
                            label="文档编号" width="200">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="postMethods(scope.row.id)">{{scope.row.docId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="docTitle" align="center"
                            label="文档标题">
                    </el-table-column>
                    <el-table-column
                            prop="docType" align="center"
                            label="文档类型" width="160" :formatter="(row, col) => fieldTranslate(row.docType, docTypeOptions)">
                        <!--<template slot-scope="scope">-->
                            <!--{{scope.row.docType ? dictionariesNameData[scope.row.docType] : ''}}-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column
                            prop="createUser" align="center"
                            label="创建人" width="130">
                    </el-table-column>
                    <el-table-column
                            prop="createTime" align="center"
                            label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <span class="table-operation" v-if="perLoaded ? PERMISSIONS.LIBRARY.EDIT : false" @click="editFun(scope.row)">修改</span>
                            <span class="table-operation" v-if="perLoaded ? PERMISSIONS.LIBRARY.DELETE : false"  @click="deleteDataFun([scope.row.id])">删除</span>
                            <span class="table-operation" @click="getTopSubmit(scope.row.docOrder, scope.row.id)">{{scope.row.docOrder === '1' ? '取消置顶' : '置顶'}}</span>
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

                <!-- 新增文库文档弹窗 -->
                <el-dialog class="need-header" title="新增文档" :visible.sync="addIsShow" @close='addClose("addForm")'>
                    <div class="edit-form">
                        <el-form :model="addData" :inline="true" :rules="addRules" ref="addForm" label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item label="文档编号：" prop="docId" size="small">
                                <el-input v-model="addData.docId" placeholder="请输入文档编号" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="文档类型：" prop="docType" size="small">
                                <el-select v-model="addData.docType" placeholder="请选择">
                                    <el-option
                                            v-for="item in docTypeOptions"
                                            :key="item.id"
                                            :label="item.dicName" :disabled="item.disabled"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文档标题：" prop="docTitle" size="small">
                                <el-input v-model="addData.docTitle" placeholder="请输入文档标题"></el-input>
                            </el-form-item>
                            <el-form-item label="正文：" prop="docContext">
                                <quill-editor class="Context-content"
                                        v-model="addData.docContext"
                                        ref="myQuillEditor"
                                >
                                </quill-editor>
                            </el-form-item>
                            <el-form-item label="相关附件：" prop="docFiles">
                                <el-upload
                                        action=""
                                        ref="upload"
                                        v-model="addData.docFiles"
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
                        <el-button class="addDocSubmit el-btn-min-100" type="primary" @click="addDocSubmit('addForm')" size="small">保存</el-button>
                    </div>
                </el-dialog>
                <!-- 修改文库文档弹窗 -->
                <el-dialog class="need-header" title="修改文档" :visible.sync="editIsShow" @close='editClose("editForm")'>
                    <div class="edit-form">
                        <el-form :model="editData" :inline="true" :rules="editRules" ref="editForm" label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item label="文档编号：" prop="docId" size="small">
                                <el-input v-model="editData.docId" placeholder="请输入文档编号" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="文档类型：" prop="docType" size="small">
                                <el-select v-model="editData.docType" placeholder="请选择">
                                    <el-option
                                            v-for="item in docTypeOptions"
                                            :key="item.id"
                                            :label="item.dicName" :disabled="item.disabled"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文档标题：" prop="docTitle" size="small">
                                <el-input v-model="editData.docTitle" placeholder="请输入文档标题"></el-input>
                            </el-form-item>
                            <el-form-item label="正文：" prop="docContext">
                                <quill-editor class="Context-content"
                                              v-model="editData.docContext"
                                              ref="myQuillEditor"
                                >
                                </quill-editor>
                            </el-form-item>
                            <el-form-item label="相关附件：" prop="docFiles">
                                <el-upload
                                           action=""
                                           ref="upload"
                                           v-model="editData.docFiles"
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
                        <el-button class="editDocSubmit el-btn-min-100" type="primary" @click="editDocSubmit('editForm')" size="small">保存</el-button>
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
                <!-- 置顶 -->
                <el-dialog class="el-dialog-500" title="" :visible.sync="getTopIsShow">
                    <div class="dialog-container">
                        <p class="align-center">选中项确认要置顶吗？</p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="el-btn-min-100" @click="getTopIsShow = false" size="small">取消</el-button>
                        <el-button class="getTopSubmit el-btn-min-100" type="primary" @click="getTopSubmit" size="small">确定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        fileUpload,
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
    } from "@/assets/js/api"

    import ElUploadList from "element-ui/packages/upload/src/upload-list";
    import { PERMISSION } from "@/assets/js/permissions";

    export default {
        name: "LibraryManagement",
        components: {
            // quillEditor,
            ElUploadList,
        },
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数
                docId: '', //文档编号
                docTitle: '', //文档标题
                createUser: '', //创建人
                docFiles1:'',
                addData: { //添加的数据
                    docId: '',
                    docType: '',
                    docTitle: null,
                    docContext: '',
                    docFiles: null,

                    createUser:''
                },
                editData: { // 编辑的数据
                    docId: '',
                    docType: '',
                    docTitle: '',
                    docContext: '',
                    docFiles: null,
                },
                addRules: { // 新增的规则
                    docType: [{required: true, message: '请选择文档类型', trigger: 'change'}],
                    docTitle: [
                        {required: true, message: '请输入文档标题', trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    docContext: [{required: true, message: '请输入正文', trigger: 'blur'}],
                },
                editRules: { // 修改的规则
                    docId: [{required: true, message: '请输入文档编号', trigger: 'blur'}],
                    docType: [{required: true, message: '请选择文档类型', trigger: 'change'}],
                    docTitle: [
                        {required: true, message: '请输入文档标题', trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    docContext: [{required: true, message: '请输入正文', trigger: 'blur'}],
                },
                docTypeOptions: [],
                docType: '', //文档类型
                addIsShow: false, // 新增文档
                editIsShow: false, // 修改文档
                getTopIsShow: false, //置顶
                multipleSelection: [], // 表格已经选择的内容
                deleteIsShow: false, // 删除弹窗是否显示
                createTime: ['', ''], //创建时间
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                opearTions: [],
                needTop: '', // 置顶ID保存
                fileList:[], //附件上传
                docFiles: [{ //附件
                    fileName: '',
                    filePath: ''
                }],
                fileName: '', //附件名称
                filePath: '', //附件地址
                // 字典项
                dictData: {},
                dictMap: {},
                //数据权限设置
                PERMISSIONS: {},
                perLoaded: false,
            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            this.getList(1, 10);
        },
        methods: {
            loadPreData() {

                // 页面字典等数据预加载
                getDictionariesAllData().then(res => {
                        this.dictData = res;
                        this.docTypeOptions = res.docTypeOptions;
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
                axiosPost('/materialMgr/materDoc/list', {
                    loading:'.loading-table',
                    noRepeat:'.searchList',
                    docTitle: this.docTitle,
                    docType: this.docType,
                    createUser: this.createUser,
                    startTime:  this.createTime !== null ? this.createTime[0] : '',
                    endTime: this.createTime !== null ? this.createTime[1] : '',
                    pageNo: this.pageNo, // 第几页
                    pageSize: this.pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            searchList() { // 通过查询条件获取列表
                this.pageNo = 1;
                this.getList();
            },
            resetSearchCondition() { // 清空搜索条件 重置
                this.docTitle = '';
                this.docType = '';
                this.createUser = '';
                this.createTime = ['', ''];
            },
            deleteDataFun(val) { // 删除数据
                this.opearTions = val;
                if (val <= 0) {
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
                    return;
                }
                this.deleteIsShow = true;
            },
            deleteSubmit() { // 删除请求请求
                axiosPost('/materialMgr/materDoc/delete', {
                    noRepeat:'.deleteSubmit',
                    ids: this.opearTions
                }).then(() => {
                    this.deleteIsShow = false;
                    this.pageNo = 1;
                    this.getList();
                });
            },
            addDataFun() { // 新增数据
                this.addIsShow = true;
            },
            addDocSubmit(formName) { // 新增 提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!this.addRules) {
                            this.$message({message: '请选择', type: 'warning'});
                        } else {
                            axiosPost('/materialMgr/materDoc/create', {
                                noRepeat:'.addDocSubmit',
                                docType: this.addData.docType,
                                docTitle: this.addData.docTitle,
                                docContext: this.addData.docContext,
                                docFiles: this.docFiles
                            }).then(() => {
                                this.addIsShow = false;
                                this.pageNo = 1;
                                this.getList();
                                this.addData.docFiles = this.docFiles;
                            });
                        }
                    }
                });
            },
            addClose(addForm) { //关闭新增弹窗时清空验证
                this.$nextTick(() => {
                    this.$refs[addForm].resetFields();
                    this.$refs.upload.clearFiles();
                    this.fileList = [];
                    this.docFiles = [
                        { //附件
                            fileName: '',
                            filePath: ''
                        }
                    ];
                });
            },

            editFun(row) { // 点击编辑按钮
                this.editIsShow = true;
                axiosPost('/materialMgr/materDoc/info',{
                    id: row.id
                })
                    .then((res)=> {
                        this.editData.docId = res.data.docId,
                        this.editData.docType = res.data.docType,
                        this.editData.docTitle = res.data.docTitle,
                        this.editData.docContext = res.data.docContext,
                        this.editData.docFiles = res.data.docFiles,
                        this.editData.id = res.data.id,
                        res.data.docFiles.forEach(element => {
                            if(element.filePath!=""&&element.fileName) {
                                this.fileList.push({
                                    name: element.fileName,
                                    url: element.filePath
                                });
                                this.docFiles.push({
                                    fileName: element.fileName,
                                    filePath: element.filePath
                                })
                            }

                        });
                    })
            },
            editDocSubmit(formName) { // 编辑数据 提交
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        axiosPost('/materialMgr/materDoc/alter', {
                            noRepeat:'.editDocSubmit',
                            docId: this.editData.docId,
                            docType: this.editData.docType,
                            docTitle: this.editData.docTitle,
                            docContext: this.editData.docContext,
                            docFiles: this.docFiles,
                            id: this.editData.id
                        }).then(() => {
                            this.editIsShow = false;
                            this.pageNo = 1;
                            this.getList();
                            this.editData.docFiles = this.docFiles;
                        });
                    }
                });
            },
            editClose(editForm) { //关闭编辑弹窗时清空验证
                this.$nextTick(() => {
                    this.$refs[editForm].resetFields();
                    this.$refs.upload.clearFiles();
                    this.fileList = [];
                    this.docFiles = [
                        { //附件
                            fileName: '',
                            filePath: ''
                        }
                    ];
                });
            },

            handleSelectionChange(val) { // 选择用户角色表格
                this.multipleSelection = val;
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

            postMethods(res) { //res为详情页id
                this.$router.push({path: '/library-management-detail', query: {id: res}});
            },

            getTopSubmit(tag, val) { // 置顶请求
                switch (tag) {
                    case '1':
                        axiosPost('/materialMgr/materDoc/cancelTop', {
                            noRepeat:'.getTopSubmit',
                            id: val
                        }).then((res) => {
                            console.log(`取消置顶接口返回： ${res}` );
                            this.pageNo = 1;
                            this.getList(this.pageNo, this.pageSize);
                        });
                        break;

                    default:
                        axiosPost('/materialMgr/materDoc/docTop', {
                            id: val
                        }).then(() => {
                            console.log('置顶接口返回： ');
                            this.pageNo = 1;
                            this.getList(this.pageNo, this.pageSize);
                        });
                        break;

                }


            },
            handleRemove(file, fileList) {
                this.docFiles.forEach((item, index, arr) => {
                    if(item.fileName == file.name) {
                       arr.splice(index, 1);
                    }
                });
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },

            handleExceed(files, fileList) { //附件上传
                this.$message.warning(`当前无限制上传文件个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },

            // 字段翻译
            fieldTranslate(value, dicMap=false, key='id', label='dicName') {
                if (dicMap && dicMap.constructor === Array && dicMap.length > 0 ) {
                    const re = dicMap.find(i => i[key] === value);
                    return re ? re[label] : ''
                }
                return ''
            },
            fileUploadFun(item){ //附件上传
                fileUpload(item)
                    .then(res => {
                        this.docFiles1 = [{
                            name: res.data.oriName,
                            url:  res.data.readAbsoluteLocation,
                            fileName:res.data.oriName,
                            filePath:res.data.lastStoreLocation,
                        }];

                        this.docFiles1.forEach(element => {
                            this.docFiles.push({
                                fileName: element.fileName,
                                filePath: element.filePath
                            })
                        });
                        this.docFiles1 = [];
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
    .map-button {
        margin: 10px 0;
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

    .edit-form-input, .add-form-input {
        width: 70%;
    }

    .el-textarea__inner {
        height: 300px !important;
    }


    .wid100 {
        width: 100%;
    }

    .wid450 {
        width: 450px;
    }
    .wid148 {
        width:148px;
    }
    .maright20 {
        margin-right: 16px;
    }
    .Context-content {
        line-height: normal;
        width: 800px;
    }
    .font-link {
        color:#409EFF;
    }
    .library-management >>> em {font-style: italic!important;}
    .upload-demo >>> .el-upload-list {
        width: 320px;
    }
</style>
