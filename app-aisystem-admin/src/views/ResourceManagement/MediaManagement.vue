<!--多媒体资源管理-->
<!--周硕梁-->
<template>
    <div>
        <h2 class="title-h2">多媒体资源管理</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="searchData" label-width="100px" >
                <el-form-item label="资源类型">
                    <el-select v-model="searchData.searchMediaType" filterable placeholder="请选择">
                        <el-option
                                v-for="item in searchMediaTypeOptions"
                                :key="item.id"
                                :label="item.dicName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源名称">
                    <el-input v-model="searchData.searchName" placeholder="请输入" ></el-input>
                </el-form-item>
                <el-form-item label="创建人">
                    <el-input v-model="searchData.searchCreateUser" placeholder="请输入" ></el-input>
                </el-form-item>
                <el-form-item label="创建日期">
                    <el-date-picker
                            v-model="searchData.searchCreateDate"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" class="chaxun el-btn-min-100" type="primary" @click="reloadTable(1)">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="resetFun">重置</el-button>
            </div>
        </div>
        <div class="map-list">
            <div class="map-button">
                <el-button v-if="perLoaded ? PERMISSIONS.MEDIA.ADD : false" size="small" @click="addFun">新增</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.MEDIA.DELETE : false" size="small" @click="deleteFun(multipleSelection.map((i) => i.id))">删除</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.MEDIA.ENABLE : false" size="small" @click="enableFun(multipleSelection.map((i) => i.id))">启用</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.MEDIA.DISABLED : false" size="small" @click="disableFun(multipleSelection.map((i) => i.id))">停用</el-button>


            </div>

            <div class="map-table loading-table">
                <el-table ref='multipleTable' size="mini" :data="tableData" border style="width: 100%"
                          @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection" align="center" width="40">
                    </el-table-column>

                    <el-table-column
                            prop="mNumber" align="center"
                            label="资源编号">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="pushDetail(scope.row)">{{scope.row.mNumber}}</span>
                        </template>

                    </el-table-column>
                    <el-table-column
                            prop="mName" align="center"
                            label="资源名称">
                    </el-table-column>
                    <el-table-column
                            prop="mType" align="center"
                            label="资源类型">
                        <template slot-scope="scope">
                            {{scope.row.mType? dictMap[scope.row.mType]: ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mDes" align="center" show-overflow-tooltip
                            label="资源描述">
                    </el-table-column>
                    <el-table-column
                            prop="mState" align="center"
                            label="状态">
                        <template slot-scope="scope">
                            {{scope.row.mState? dictMap[scope.row.mState]: ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mCreateUser" align="center"
                            label="创建人">
                    </el-table-column>
                    <el-table-column
                            prop="mCreateTime" align="center"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column v-if="perLoaded ? (PERMISSIONS.MEDIA.EDIT || PERMISSIONS.MEDIA.DELETE) : false" label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <span v-if="perLoaded ? PERMISSIONS.MEDIA.EDIT : false" class="table-operation" @click="editFun(scope.row)">修改</span>
                            <span v-if="perLoaded ? PERMISSIONS.MEDIA.DELETE : false" class="table-operation" @click="deleteFun([scope.row.id,])">删除</span>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <span>一共 <span class="total">{{total}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20, 50]"
                            :page-size="pageSize"
                            layout="sizes, prev, pager, next, jumper"
                            :total="total"
                            :current-page.sync="pageNo"
                    >

                    </el-pagination>
                </div>
            </div>

        </div>

        <el-dialog class="el-dialog-500" title="" :visible.sync="deleteIsShow">
            <div class="dialog-container">
                <p class="align-center">选中项确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="deleteIsShow = false">取消</el-button>
                <el-button size="small" class="deleteSubmit el-btn-min-100" type="primary" @click="deleteSubmit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="need-header" title="新增资源" :visible.sync="addIsShow" @cancel="$refs['addForm'].resetFields()">
            <div class="add-form">
                <el-form :model="addData" :inline="true" size="small" :rules="addRules" ref="addForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="知识体系" prop="knowPath">

                        <treeselect v-model="addData.knowPath"
                                    :options="knowOptions"
                                    placeholder="请选择所属知识体系"
                                    noResultsText="未找到，请重新输入"
                                    @input="changeTree('addForm')"
                                    :normalizer="normalizer"
                        />
                    </el-form-item>
                    <el-form-item label="资源名称" prop="mName">
                        <el-input v-model="addData.mName" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <el-form-item label="资源类型" prop="mType">
                        <el-select v-model="addData.mType" placeholder="请选择类型">

                            <el-option
                                    v-for="item in mTypeOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源状态" prop="mState">
                        <el-select v-model="addData.mState" placeholder="请选择状态">

                            <el-option
                                    v-for="item in mStateOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源来源" prop="mRes">
                        <el-select v-model="addData.mRes" placeholder="请选择来源">

                            <el-option
                                    v-for="item in mResOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item label="资源描述" prop="mDes">
                        <el-input v-model="addData.mDes" placeholder="请输入描述"></el-input>
                    </el-form-item>

                    <!--  TODO 附件上传-->
                    <el-form-item label="附件" prop="mFiles">
                        <!--v-model="addData.mFiles"-->
                        <!--:on-exceed="handleExceed"-->
                        <!--multiple-->
                        <el-upload
                                action=""
                                class="upload-demo"
                                :limit="1"
                                :on-remove="handleRemove"
                                :http-request="fileUploadFun"
                                :on-exceed="handleExceed"
                                :file-list="mFiles"
                        >
                            <el-button class="el-btn-min-100" size="small" type="primary">点击上传</el-button>
                            <!--&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;-->
                            <!--<div slot="tip" class="el-upload__tip">只能上传指定格式的音频、视频文件</div>-->
                        </el-upload>
                    </el-form-item>


                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button  size="small" class="el-btn-min-100" @click="addReset">重置</el-button>
                <el-button  size="small" class="addSubmit el-btn-min-100" type="primary" @click="addSubmit('addForm')">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="need-header" title="编辑资源" :visible.sync="editIsShow" v-if="editIsShow" @cancel="$refs['editForm'].resetFields()">
            <div class="add-form">
                <el-form :model="editData" :inline="true" size="small" :rules="editRules" ref="editForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="知识体系" prop="knowPath">
                        <treeselect v-model="editData.knowPath"
                                    @input="changeTree('editForm')"
                                    :options="knowOptions"
                                    placeholder="请选择知识体系"
                                    noResultsText="未找到，请重新输入"
                                    :normalizer="normalizer"
                        />


                    </el-form-item>
                    <el-form-item label="资源名称" prop="mName">
                        <el-input v-model="editData.mName" placeholder="请输入资源名称"></el-input>
                    </el-form-item>

                    <el-form-item label="资源类型" prop="mType">
                        <el-select v-model="editData.mType" placeholder="请选择类型">

                            <el-option
                                    v-for="item in mTypeOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源来源" prop="mRes">
                        <el-select v-model="editData.mRes" placeholder="请选择来源">

                            <el-option
                                    v-for="item in mResOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源状态" prop="mState">
                        <el-select v-model="editData.mState" placeholder="请选择状态">

                            <el-option
                                    v-for="item in mStateOptions"
                                    :key="item.id"
                                    :label="item.dicName"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item label="资源描述" prop="mDes">
                        <el-input v-model="editData.mDes" placeholder="请输入描述"></el-input>
                    </el-form-item>

                    <!--  TODO 附件上传-->
                    <el-form-item label="附件" prop="mFiles">
                        <!--v-model="addData.mFiles"-->
                        <!--:on-exceed="handleExceed"-->
                        <!--multiple-->
                        <el-upload
                                action=""
                                class="upload-demo"
                                :limit="1"
                                :on-remove="handleRemove"
                                :http-request="fileUploadFun"
                                :on-exceed="handleExceed"
                                :file-list="mFiles"
                        >
                            <el-button class="el-btn-min-100" size="small" type="primary">点击上传</el-button>
                            <!--&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;-->
                            <!--<div slot="tip" class="el-upload__tip">只能上传指定格式的音频、视频文件</div>-->
                        </el-upload>
                    </el-form-item>


                    <!--                    TODO 附件上传-->
                    <!--                    <el-form-item label="资源附件" prop="mFile">-->
                    <!--                        <el-upload-->
                    <!--                                class="upload-demo"-->
                    <!--                                ref="upload"-->
                    <!--                                action="https://jsonplaceholder.typicode.com/posts/"-->
                    <!--                                :on-preview="handlePreview"-->
                    <!--                                :on-remove="handleRemove"-->
                    <!--                                :file-list="fileList"-->
                    <!--                                :auto-upload="false">-->
                    <!--                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
                    <!--                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
                    <!--                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                    <!--                        </el-upload>-->
                    <!--                    </el-form-item>-->

                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="editIsShow = false">取消</el-button>
                <el-button size="small" class="editSubmit el-btn-min-100" type="primary" @click="editSubmit('editForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
        getKnowAllData,
        getMapNameData,
        fileUpload,
    } from '@/assets/js/api';
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import '@/assets/js/dateFormat';
    import {API} from '@/assets/js/urls';

    import { PERMISSION } from "@/assets/js/permissions";
    import {debugLog} from "../../assets/js/tool";


    export default {
        name: "MediaManagement",
        components: {
            Treeselect
        },
        watch: {
            searchCreateDate(val){
                if (!val || val === null) {
                    this.searchCreateDate = ['', '']
                }
            }
        },
        data() {
            return {
                searchData: {},

                // 搜索区
                // 资源类型

                searchMediaType: null,
                searchMediaTypeOptions: [
                ],
                // 资源名称
                searchName: '',
                // 创建人
                searchCreateUser: '',
                // 创建时间
                searchCreateDate: [],


                // 列表区
                tableData: // 列表元数据
                    [ ],

                // 分页
                total: 0, // 数据总条数
                pageNo: 1, //页码
                pageSize: 5, //每页条数


                fileList: [], // 文件上传
                mFiles: [],


                // 新增表单
                addData: {
                },
                addRules: {

                    // 校验需求为需求口头约定，预计后期还要改动
                    knowPath: [{required: true, message: '请选择知识体系', trigger: 'input'}],
                    mType: [{required: true, message: '请选择类型', trigger: 'change'}],
                    mName: [
                        {required: true, message: '请输入名称', trigger: 'change'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    mRes: [
                        {required: true, message: '请选择来源', trigger: 'change'},
                    ],
                    mDes: [
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    mState: [{required: true, message: '请选择状态', trigger: 'change'}],


                },


                // 字典项
                dictData: {},
                dictMap: {},

                mTypeOptions: [],  // 类型字典
                mResOptions: [], // 来源字典
                mStateOptions: [], // 状态字典

                knowMap: {}, // 知识体系




                // 知识体系
                know: {}, // 列表

                knowPath: '',

                knowOptions: '',
                knowOptionsProps: {
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },


                // 编辑表单
                editData: {},
                editRules: {
                    // 校验需求为需求口头约定，预计后期还要改动
                    knowPath: [{required: true, message: '请选择知识体系', trigger: 'input'}],
                    mType: [{required: true, message: '请选择类型', trigger: 'change'}],
                    mName: [
                        {required: true, message: '请输入名称', trigger: 'change'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    mDes: [
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    mRes: [{required: true, message: '请选择来源', trigger: 'change'}],
                    mState: [{required: true, message: '请选择状态', trigger: 'change'}],


                },


                // 多选状态存储
                multipleSelection: [],

                // 操作状态存储
                operations: [],

                // 页面控制

                deleteIsShow: false, // 删除提示框
                addIsShow: false, // 新增页面
                editIsShow: false, // 编辑页面

                PERMISSIONS: {},
                perLoaded: false,



            }
        },
        created() {
            this.loadPreData();
            this.reloadTable(1);

        },
        methods: {
            loadPreData() {

                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {

                        this.dictData = res;

                        this.searchMediaTypeOptions = res.mediaType_all;
                        this.mTypeOptions = res.mediaType;
                        this.mResOptions = res.mediaResource;
                        this.mStateOptions = res.status;

                    });
                getDictionariesNameData()
                    .then(res => {
                        this.dictMap = res;
                    });
                getKnowAllData()
                    .then(res => {
                        this.knowOptions = res;



                    });
                getMapNameData()
                    .then(res => {
                        this.knowMap = res;

                    })

                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                });




            },
            reloadTable(val) {

                //  请求Table数据，重新渲染
                this.pageNo = val;
                // console.log(this.searchMediaType, this.searchName, this.searchCreateUser, this.searchCreateDate)
                axiosPost(API.MEDIA_LIST, {
                    loading:'.loading-table',
                    noRepeat:'.chaxun',
                    mediaType: this.searchData.searchMediaType,
                    mediaName: this.searchData.searchName,
                    createUser: this.searchData.searchCreateUser,
                    startTime: this.searchData.searchCreateDate && this.searchData.searchCreateDate.length === 2 ? this.searchData.searchCreateDate[0] : '',
                    endTime: this.searchData.searchCreateDate && this.searchData.searchCreateDate.length === 2 ? this.searchData.searchCreateDate[1] : '',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,

                }).then(res => {
                    // // console.log(res);
                    const resData = res.data;
                    this.total = resData.total;

                    try {
                        // 前后端字段对应
                        resData.records.map(i => {
                            i.mID = i.id;
                            i.mNumber = i.mediaId;
                            i.mName = i.mediaName;
                            i.mType = i.mediaType;
                            i.mDes = i.mediaDesc;
                            i.mCreateUser = i.createUser;
                            i.mCreateTime = i.createTime;
                            i.knowPath = i.knowledgePath;
                            i.mRes = i.mediaResource;
                            i.mState = i.mediaStatus;
                            // i.know.knowId = i.knowledgeId;


                        });
                        this.tableData = resData.records;
                    } catch (e) {

                        // 数据异常捕获
                        // console.log(e);
                        this.tableData = [];
                    }


                });


            },

            resetFun() { // 重置搜索条件
                //  重置搜索条件
                this.searchData = {}
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
                // console.log(this.multipleSelection)

            },

            pushDetail(row) {
                // console.log(row)
                this.$router.push({
                    path: '/media-detail',
                    query: {
                        id: row.id,
                        row: row
                    }
                })
            },

            addFun() { // 新增
                this.addIsShow = true;


            },

            deleteFun(val) { // 批量删除

                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});

                    return;
                }


                // console.log(val);

                this.operations = val;
                this.deleteIsShow = true;


                //  批量删除功能

            },
            enableFun(val) { // 启用

                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }

                this.operations = val;
                const tem = this.operations.reduce((a, b) => a + ', ' + b, '');
                // console.log(`要启用${tem}`);
                // 批量启用功能

                axiosPost(API.MEDIA_ENABLE, {
                    ids: this.operations,
                    mediaStatus: 'd9a95689'
                }).then(res => {
                    // console.log(res)
                    this.$message({message:'启用成功',type: 'success'});
                    this.reloadTable(1)

                })

            },
            disableFun(val) { // 停用
                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }

                this.operations = val;
                const tem = this.operations.reduce((a, b) => a + ', ' + b, '');
                // console.log(`要停用${tem}`);
                // 批量停用功能

                axiosPost(API.MEDIA_ENABLE, {
                    ids: this.operations,
                    mediaStatus: 'a965e78b'
                }).then(res => {
                    // console.log(res);
                    this.$message({message:'停用成功',type: 'success'});
                    this.reloadTable(1)


                })

            },

            handleExceed(files, fileList) { //附件上传
                this.$message.warning('只能上传一个附件');
            },
            handleRemove() {
                this.mFiles = [];
            },
            fileUploadFun(item){
                fileUpload(item)
                    .then(res => {
                        // console.log(res);

                        // TODO 目前接口仅可上传单文件，需求原型未明确，先按照单文件开发
                        this.mFiles= [{
                            name:res.data.oriName,
                            url:res.data.lastStoreLocation,
                        }]

                        // this.mFiles.push({
                        //     name:res.data.oriName,
                        //     url:res.data.lastStoreLocation,
                        // })
                    })

            },

            handleSizeChange(val) { // 每页数据条数改变
                // 每页数据条数改变
                this.pageSize = val;

                // console.log(`条数改变${val}`)
                this.reloadTable(1);
            },

            handleCurrentChange(val) { // 页码改变

                // console.log(`页面改变${val}`)
                this.reloadTable(val)

            },
            handleChange(val) {
                // console.log(val)
            },

            editFun(val) {
                // 修改编辑学员信息弹框

                this.editData = {
                    knowPath: '',
                    mType: '',
                    mRes: '',
                    mName: '',
                    mDes: '',
                    id: '',
                    mState: null,
                };

                // console.log(`编辑${val}学员`);

                this.editIsShow = true;

                this.editData.knowPath = val.knowPath;
                this.editData.mType = val.mType;
                this.editData.mRes = val.mRes;
                this.editData.mName = val.mName;
                this.editData.mDes = val.mDes;
                this.editData.id = val.id;
                this.editData.mState = val.mState;

                // TODO 按单文件考虑
                this.mFiles = val.filePath ? [
                    {
                        url: val.filePath,
                        name: val.fileName,
                    }]: [];


            },

            deleteSubmit() { // 删除提交
                this.deleteIsShow = false;

                const tem = this.operations.reduce((a, b) => a + ', ' + b, '');
                // console.log(`要删除${tem}`);


                axiosPost(API.MEDIA_DELETE, {
                    noRepeat:'.deleteSubmit',
                    ids: this.operations
                }).then(res => {
                    // console.log(res);
                    this.$message({message:'删除成功',type: 'success'});
                    this.reloadTable(1)

                })

            },
            editSubmit(editForm) { // 新增/编辑提交

                this.$refs[editForm].validate((valid) => {
                    if (valid) {


                        if (!this.editData.knowPath) {
                            this.$message({message: '请选择知识体系', type: 'warning'});
                        } else {
                            axiosPost(API.MEDIA_EDIT, {
                                noRepeat:'.editSubmit',
                                id: this.editData.id,
                                knowledgeId: this.editData.knowPath.split('/').pop(),
                                knowledgePath: this.editData.knowPath,
                                mediaType: this.editData.mType,
                                mediaName: this.editData.mName,
                                mediaResource: this.editData.mRes,
                                mediaDesc: this.editData.mDes,
                                mediaStatus: this.editData.mState,
                                // attachFile: '',
                                fileName: this.mFiles[0] ? this.mFiles[0].name: '',
                                filePath: this.mFiles[0] ? this.mFiles[0].url: '',
                            }).then(() => {
                                this.editIsShow = false;
                                this.$message({message:'编辑成功',type: 'success'});
                                // this.editReset();

                                this.reloadTable(1);
                                this.editData = {};
                                this.mFiles = []
                            });
                        }
                    }
                });
            },

            changeTree(Form) { // 下拉框选择触发事件
                this.$refs[Form].validateField(`${Form}.knowPath`)
            },

            normalizer(node) {
                return {
                    id: node.path,
                    label: node.knowName,
                    children: node.children,
                }
            },

            addReset() {


                this.addData = {};
                this.mFiles = [];
                this.$refs['addForm'].resetFields();


            },
            addSubmit(addForm) { // 新增提交
                this.$refs[addForm].validate((valid) => {
                    if (valid) {

                        if (!this.addData.knowPath) {
                            this.$message({message: '请选择知识体系', type: 'warning'});
                        } else {


                            axiosPost(API.MEDIA_ADD, {
                                noRepeat:'.addSubmit',
                                knowledgeId: this.addData.knowPath.split('/').pop(),
                                knowledgePath: this.addData.knowPath,
                                mediaType: this.addData.mType,
                                mediaName: this.addData.mName,
                                mediaResource: this.addData.mRes,
                                mediaDesc: this.addData.mDes,
                                mediaStatus: this.addData.mState,
                                attachFile: '',
                                createUser: '',
                                fileName: this.mFiles[0] ? this.mFiles[0].name: '',
                                filePath: this.mFiles[0] ? this.mFiles[0].url: '',

                            }).then(() => {
                                this.addIsShow = false;
                                this.$message({message: '新增成功', type: 'success'});
                                this.addReset();

                                this.reloadTable(1);
                                this.addData = {};
                            });
                        }
                    }
                });


            },


        }
    }
</script>

<style scoped>

    .map-button {
        margin: 10px 0;
    }
    /*.map-table{*/
        /*margin: 0 20px 0 20px;*/
    /*}*/

    .table-operation {
        color: #409EFF;
        margin-top: 20px;
        cursor: pointer;
    }
    .vue-treeselect {
        width: 200px;
        float: left;
    }

    .pagination {

        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }

    .total {
        font-weight: bold;
    }
</style>
