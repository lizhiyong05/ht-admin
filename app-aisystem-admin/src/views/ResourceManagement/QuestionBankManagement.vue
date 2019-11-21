<!--题库管理-->
<!--周硕梁-->
<template>
    <div >
        <h2 class="title-h2">题库管理</h2>
        <div class="preservation-container">
            <div class="search-container">
                <el-form size="small" :inline="true" :model="searchData" class="demo-form-inline" label-width="100px"
                        ref="courseForm">
                    <!--2019-06-03 16:38:03 钉钉群咨询后未得到需求答复,暂不做-->
                    <!--2019-06-12 16:58:29 按照继军的数据权限控制邮件，试题分类=知识体系-->
                    <!--2019-06-17 15:26:36最新版原型增加-->
                    <el-form-item label="试题分类" prop="qClassify">
                        <treeselect v-model="searchData.qClassify"
                        :options="qClassifyAllOptions"
                        placeholder="请选择试题分类"
                                    noResultsText="未找到，请重新输入"
                        :normalizer="normalizer"
                        />
                    </el-form-item>
                    <el-form-item label="试题类型" prop="qType">
                        <el-select v-model="searchData.qType" placeholder="请选择">
                            <el-option
                                    v-for="item in qTypeAllOptions"
                                    :key="item.dicCode"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.dicCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试题状态" prop="qState">
                        <el-select v-model="searchData.qState" placeholder="请选择">
                            <el-option
                                    v-for="item in qStateAllOptions"
                                    :key="item.dicCode"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.dicCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试题内容" prop="qContent">
                        <el-input v-model="searchData.qContent" placeholder="请输入 "></el-input>
                    </el-form-item>

                    <el-form-item label="创建人" prop="qCreateUser">
                        <el-input v-model="searchData.qCreateUser" placeholder="请输入 "></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="qCreateTime">
                        <el-date-picker
                                v-model="searchData.qCreateTime"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                        >
                        </el-date-picker>

                    </el-form-item>

                </el-form>
                <div class="button-container">
                    <el-button size="small" class="reloadTable el-btn-min-100" type="primary" @click="reloadTable(1)">查询</el-button>
                    <el-button size="small" class="el-btn-min-100" @click="searchReset">重置</el-button>
                </div>
            </div>
            <div class="map-list">
                <div class="map-button">

                    <el-button v-if="perLoaded ? PERMISSIONS.QUESTION.ADD : false" size="small" @click="pushOperationPage(flag='add')">新增</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.QUESTION.IMPORT : false" size="small" @click="btnImport()">导入</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.QUESTION.EXPORT : false" size="small" class="btn-export" @click="btnExport()">导出</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.QUESTION.ENABLE : false" size="small" @click="operationAffirm(flag='enable', val=multipleSelection.map(i => i.qID))">启用</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.QUESTION.DISABLED : false" size="small" @click="operationAffirm(flag='disable', val=multipleSelection.map(i => i.qID))">停用</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.QUESTION.DELETE : false" size="small" @click="operationAffirm(flag='delete', val=multipleSelection.map(i => i.qID))">删除</el-button>

                </div>

                <div class="map-table loading-table">
                    <el-table size="mini" ref='multipleTable' :data="tableData" border style="width: 100%"
                              @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection" align="center"
                                width="40" fixed="left">
                        </el-table-column>
                        <el-table-column align="center" prop="qNumber"
                                         label="试题编号" width="180" fixed="left" >
                            <template slot-scope="scope">
                                <span class="table-operation" @click="pushDetail(scope.row.qID)">{{scope.row.qNumber}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="qContent" align="center" min-width="200" 
                                label="试题内容">
                        </el-table-column>
                        <!--<el-table-column-->
                                <!--prop="qCourseType" align="center" min-width="120" -->
                                <!--label="课程类别">-->
                        <!--</el-table-column>-->

                        <el-table-column
                                prop="qCourseName" align="center" min-width="150" 
                                label="课程名称">
                        </el-table-column>
                        <el-table-column
                                prop="qType" align="center" width="80" 
                                label="试题类型" :formatter="(row, column) => fieldTranslate(row.qType, qTypeAllOptions, 'dicCode')">
                        </el-table-column>
                        <el-table-column
                                prop="qDegree" align="center" width="80" 
                                label="难度系数" :formatter="(row, column) => fieldTranslate(row.qDegree, qDegreeAllOptions, 'dicCode')">
                        </el-table-column>
                        <el-table-column
                                prop="qClassify" align="center" width="120" 
                                label="试题分类" :formatter="(row, column) => knowMap[row.qClassify]? knowMap[row.qClassify]['knowName'] : ''">
                        </el-table-column>

                        <!--<el-table-column-->
                                <!--prop="qLine" align="center" width="100" -->
                                <!--label="适用产线">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                                <!--prop="qProject" align="center" width="100" -->
                                <!--label="适用项目">-->
                        <!--</el-table-column>-->
                        <el-table-column
                                prop="qState" align="center" width="100" 
                                label="试题状态" :formatter="(row, column) => fieldTranslate(row.qState, qStateAllOptions, 'dicCode')">
                        </el-table-column>
                        <el-table-column
                                prop="cCreateUser" align="center" min-width="120" 
                                label="创建人">
                        </el-table-column>
                        <el-table-column
                                prop="cCreateTime" align="center" width="165" 
                                label="创建时间">
                        </el-table-column>

                        <el-table-column v-if="perLoaded ? (PERMISSIONS.QUESTION.EDIT || PERMISSIONS.QUESTION.DELETE) : false" label="操作" fixed="right"  width="105" align="center">
                            <template slot-scope="scope">

                                <span v-if="perLoaded ? PERMISSIONS.QUESTION.EDIT : false" class="table-operation" @click="pushOperationPage(flag='edit', id=scope.row.qID)">修改</span>
                                <span v-if="perLoaded ? PERMISSIONS.QUESTION.DELETE : false" class="table-operation" @click="operationAffirm(flag='delete', val=[scope.row.qID, ])">删除</span>
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
                                :current-page.sync="pageNo"
                                layout="sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>


        <el-dialog class="el-dialog-500" title="" :visible.sync="affirmIsShow">
            <span class="align-center">{{operationAffirmMessage}}</span>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="affirmIsShow = false">取消</el-button>
                <el-button size="small" class="operationSubmit el-btn-min-100" type="primary" @click="operationSubmit">确定</el-button>
            </div>

        </el-dialog>
        <el-dialog
            @close="resetForm('fileRule')"
            :visible.sync="importVisible"
            width="800px">
            <h2 slot="title" class="title-h2">文件导入</h2>
            <el-form size="small" :model="fileForm" :inline="true" :rules="rules" ref="fileRule" label-width="100px">
                <el-form-item label="试题分类" prop="knowledgePath">
                    <treeselect 
                        v-model="fileForm.knowledgePath"
                        :options="qClassifyAllOptions"
                        @input="chengeTreeSelect"
                        placeholder="请选择试题分类"
                        noResultsText="未找到，请重新输入"
                        :normalizer="normalizer2"/>
                </el-form-item>
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="fileForm.courseName" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="选择文件">
                    <input id="fileUpload" type="file" @change="fileNameEdit" style="display: none;">
                    <el-input style="width: 300px;margin-right: 20px;margin-bottom: 20px;" readonly placeholder="请选择文件" v-model="fileForm.fileName"></el-input>
                    <el-button size="small" type="primary" @click="selectFile" class="el-btn-min-100">选择</el-button> <br>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="importVisible = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="importFile('fileRule')" class="el-btn-min-100 btn-import">导入</el-button>
                <el-button size="small" type="primary" @click="moduleUpload" class="el-btn-min-100 no-repeat-down">下载模板</el-button>
            </div>
            <p class="title">
                <span class="sub-title">导入结果</span>
            </p>
            <p class="result-title">1.Excel中不符合格式要求的数据：</p>
            <el-table 
                size="mini"
                border
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
        getDictionariesNameData,
        getDictionariesAllData,
        getKnowAllData,
        getMapNameData,
        trainFileUplaod,
        fileUpload,
    } from '@/assets/js/api';
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import '@/assets/js/dateFormat';
    import { API } from '@/assets/js/urls';
    import { PERMISSION } from "@/assets/js/permissions";



    export default {
        name: "QuestionBankManagement",
        components:{
            treeselect: Treeselect,
        },
        computed:{

        },
        data(){
          return{
              PERMISSIONS: {},
              perLoaded: false,
              // 搜索
              searchData:{
                  qClassify: null,  // TODO ⭐2019-06-03 16:38:03 钉钉群咨询后未得到需求答复,暂不做
                  qType: null,
                  qState: null,
                  qContent: '',
                  qCreateUser: '',
                  qCreateTime: [],

              },
                fileForm: {},
                fileResult: {},
                importVisible: false,
                rules: {
                    knowledgePath: [
                        { required: true, message: '请选择知识体系', trigger: 'blur' }
                    ],
                    courseName: [
                        { required: true, message: '请输入课程名称', trigger: 'blur' },
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    fileName: [
                        { required: true, message: '请选择文件', trigger: 'change' }
                    ],
                },



              // 字典项
              qClassifyAllOptions: [], // TODO ⭐2019-06-03 16:38:03 钉钉群咨询后未得到需求答复,暂不做
              qTypeAllOptions: [],
              qStateAllOptions: [],
              qDegreeAllOptions: [],

              dictData: {},
              dictMap: {},
              knowPathOptions: {},
              knowMap: {},



              // 操作状态存储
              operations: [],
              operationFlag: '', // 启用：enable；停用：disable； 删除：delete

              multipleSelection: [], // 多选状态存储

              // 页面控制
              affirmIsShow: false, // 提示框
              operationAffirmMessage: '',  // 操作提示信息


              tableData: [],

              // 分页
              total: 0, // 数据总条数
              pageNo: 1, // 页码
              pageSize: 5, // 每页条数
          }
        },
        created(){
            this.loadPreData();
            this.reloadTable(1);
        },

        methods:{
            loadPreData() {

                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {

                        this.dictData = res;

                        // TODO 字典项待杰斌添加
                        // this.qClassifyAllOptions = res. ; // TODO ⭐2019-06-03 16:38:03 钉钉群咨询后未得到需求答复,暂不做
                        this.qTypeAllOptions = res.questionType_all;
                        this.qStateAllOptions = res.status_all;
                        this.qDegreeAllOptions = res.subjectDifficult_all;


                    });
                getDictionariesNameData()
                    .then(res => {
                        this.dictMap = res;
                    });
                getKnowAllData()
                    .then(res => {
                        this.knowPathOptions = res;
                        this.qClassifyAllOptions = res;


                    });
                getMapNameData()
                    .then(res => {
                        this.knowMap = res;
                        // console.log(this.knowMap)

                    })
                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                });


            },
            chengeTreeSelect(){ // tree change
                if(this.importVisible) {
                    this.$refs['fileRule'].validateField('knowledgePath');
                }
            },
            resetForm(formName) {
                this.$refs[formName].clearValidate();
                this.fileForm = {};
                document.getElementById('fileUpload').value = '';
            },
            btnImport() {
                this.fileResult = {};
                this.importVisible = true;
            },
            selectFile() {
                document.getElementById('fileUpload').click();
            },
            fileNameEdit() {
                var fileUploadDOM = document.getElementById('fileUpload');
                if(fileUploadDOM.files[0].name.indexOf('.xls') == -1 && fileUploadDOM.files[0].name.indexOf('.xlsx') == -1) {
                    this.$message({message:'只能上传.xls或.xlsx文件',type: 'warning'});
                    fileUploadDOM.value = '';
                    return;
                }
                if(fileUploadDOM.value) {
                    this.fileForm.fileName = fileUploadDOM.files[0].name;
                }else {
                    this.fileForm.fileName = '';
                }
                this.$forceUpdate();
            },
            btnExport() {
                var params = {
                    knowledgeId: this.searchData.qClassify,
                    questionType: this.searchData.qType,
                    questionState: this.searchData.qState,
                    questionName: this.searchData.qContent,
                    createUserName: this.searchData.qCreateUser,
                    createTimeStart: this.searchData.qCreateTime ? this.searchData.qCreateTime[0] : '',
                    createTimeEnd: this.searchData.qCreateTime ? this.searchData.qCreateTime[1] : '',
                    noRepeat: '.btn-export',
                }
                axiosPost('/examMgr/question/export', params).then(res => {
                    if(res.code == 1000) {
                        window.open(res.data);
                    }
                })
            },
            importFile(formName) {
                if(!this.fileForm.fileName) {
                    this.$message({message:'请选择一个文件',type: 'warning'});
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fileResult = {};
                        var fileUploadDOM = document.getElementById('fileUpload');
                        document.querySelector('.btn-import').disabled = true;
                        document.querySelector('.btn-import').classList.add('is-disabled');
                        var file = {
                            file: fileUploadDOM.files[0],
                            data: {frontId: ''},
                            onProgress: function() {},
                            onSuccess: function() {},
                        }
                        fileUpload(file).then(data => {
                            this.fileForm.knowledgeId = this.fileForm.knowledgePath.split('/').reverse()[0];
                            this.fileForm.url = data.data.readAbsoluteLocation;
                            axiosPost('/examMgr/question/import', this.fileForm).then(res => {
                                if(res.code == 1000) {
                                    this.reloadTable(1);
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
                                document.querySelector('.btn-import').disabled = false;
                                document.querySelector('.btn-import').classList.remove('is-disabled');
                            })
                        }).catch(() => {
                            document.querySelector('.btn-import').disabled = false;
                            document.querySelector('.btn-import').classList.remove('is-disabled');
                        })
                    } else {
                        return false;
                    }
                });
            },
            moduleUpload() {
                axiosPost('/examMgr/question/file', {noRepeat: '.no-repeat-down'}).then(res => {
                    if(res.code == 1000) {
                        window.open(res.data);
                    }
                })
            },
            reloadTable(val) {
                // 请求Table数据，重新渲染
                this.pageNo = val;

                axiosPost(API.QUESTION_LIST, {
                    loading:'.loading-table',
                    noRepeat:'.reloadTable',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    questionType: this.searchData.qType,
                    questionState: this.searchData.qState,
                    questionName: this.searchData.qContent,
                    createUserName: this.searchData.qCreateUser,
                    createTimeStart: this.searchData.qCreateTime && this.searchData.qCreateTime.length === 2 ? this.searchData.qCreateTime[0] : '',
                    createTimeEnd: this.searchData.qCreateTime && this.searchData.qCreateTime.length === 2 ? this.searchData.qCreateTime[1] : '',
                    knowledgeId: this.searchData.qClassify,
                    // courseName: this.searchData.,   // TODO ⭐课程名称 接口文档提供字段，原型里没有

                }).then(res => {
                    // // console.log(res);
                    let resData = res.data.records;
                    this.total = res.data.total;
                    try {
                        // 前后端字段对应
                        resData.map(i => {
                            i.qID = i.id;
                            i.qNumber = i.questionNo;
                            i.qContent = i.questionName;
                            // i.qCourseType = i.courseType;  // TODO ⭐课程类别 接口文档未提供字段，原型里有
                            i.qCourseName = i.courseName;
                            i.qType = i.questionType;
                            i.qDegree = i.questionDegree;
                            // i.qLine = i. ;  // TODO 适用产线 待后端接口确定后开发
                            // i.qProject = i. // TODO 适用项目 待后端接口确定后开发
                            i.qState = i.questionState;
                            i.cCreateUser = i.createUserName;
                            i.cCreateTime = i.createTime;
                            i.qClassify = i.knowledgeId;
                            return i;



                        });
                        this.tableData = resData;
                    } catch (e) {
                        // console.log(e);
                        this.tableData = [];
                    }
                })

            },



            searchReset(){
                this.searchData = {
                    qClassify: null,  // TODO ⭐2019-06-03 16:38:03 钉钉群咨询后未得到需求答复,暂不做
                    qType: null,
                    qState: null,
                    qContent: '',
                    qCreateUser: '',
                    // qCreateTime: ['', ''],
                    qCreateTime: [],

                }
            },


            // 跳转新增/编辑页面
            pushOperationPage(flag, id){

                let canEdit = true;

                // flag: 'add' 新增； 'edit' 编辑
                if (flag === 'edit') {
                    axiosPost(API.QUESTION_CHECK, {
                        id: id
                    }).then(res => {
                        if (!res.data || res.data === false) {
                            canEdit = false;

                        }
                        if (canEdit) {
                            this.$router.push({
                                path:'/question-operation',
                                query:{
                                    flag: flag,
                                    id: id,
                                }
                            })
                        }else{
                            this.$message({message:'已被引用的试题不允许修改',type: 'warning'});
                        }
                    })
                    
                }else{
                    this.$router.push({
                        path:'/question-operation',
                        query:{
                            flag: flag,
                            id: id,
                        }
                    })
                }


               


            },
            pushDetail(id){
                this.$router.push({
                    path:'/question-detail',
                    query:{
                        id: id,
                    }
                })
            },


            // 题库操作，弹框
            operationAffirm(flag, val, affirm=true){
                if (val.length <= 0 ){
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }

                this.operations = val;
                this.operationFlag = flag;


                if (!affirm){
                    // 不提示，直接提交(不涉及childFlag) 默认需弹窗
                    this.operationSubmit();
                    return;
                }

                switch (flag) {
                    case 'enable':
                        this.operationAffirmMessage = '确认将所选择的试题设置为启用？';

                        break;
                    case 'disable':
                        this.operationAffirmMessage = '确认将所选择的试题设置为禁用？';

                        break;

                    case 'delete':
                        this.operationAffirmMessage = '是否确认删除所选择的试题？';

                        break;
                    default:
                        // console.log(`未定义的操作: ${flag}`);
                        break;
                }

                this.affirmIsShow = true;

            },

            // 操作提交
            operationSubmit(childFlag){
                // console.log(childFlag);

                let temFlag = null;
                switch (this.operationFlag) {  // 后端接口设计为通过数字类型动作码指定操作 0停用 1启用 2删除
                    case 'enable':
                        temFlag = 1;
                        break;
                    case 'disable':
                        temFlag = 0;
                        break;
                    case 'delete':
                        temFlag = 9;
                        break;
                    default:
                        // console.log(`未定义的操作: ${this.operationFlag}`);
                        return;

                }

                axiosPost(API.QUESTION_DELETE, {
                    noRepeat:'.operationSubmit',
                    state: temFlag,
                    id: this.operations
                }).then(res => {
                    // console.log(res);
                    // 错误信息展示

                    if (res.data) {
                        this.$message({
                            message: res.data,
                            type: 'warning',
                            center: true,
                        });
                    }else {
                        this.$message({message:'操作成功',type: 'success'});
                    }

                    this.affirmIsShow = false;
                    this.reloadTable(1);

                });



            },






            normalizer(node) {
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },
            normalizer2(node) {
                return {
                    id: node.path,
                    label: node.knowName,
                    children: node.children,
                }
            },


            handleSelectionChange(val) {
                this.multipleSelection = val;
                // console.log(this.multipleSelection)

            },


            // 字段翻译
            fieldTranslate(value, dicMap=false, key='id', label='dicName') {
                if (dicMap && dicMap.constructor === Array && dicMap.length > 0 ) {
                    const re = dicMap.find(i => i[key] === value);
                    return re ? re[label] : ''
                }
                return ''
            },


            handleSizeChange(val) { // 每页数据条数改变
                // console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.reloadTable(1);
            },

            handleCurrentChange(val) { // 页码改变
                // console.log(`当前页: ${val}`);
                this.reloadTable(val)

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

    .table-operation-disable {
        color: #909399;
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


    .vue-treeselect {
        width: 200px;
        float: left;
    }

    .preservation-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }


    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
    }

    .list-group-item {
        cursor: move;
        margin: 10px 0;
    }

    .list-group-item i {
        cursor: pointer;

    }

    .course-des {
        width: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .result-title {
        font-size: 14px;
        margin: 10px 0;
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
</style>


<!--TODO 需求变更记录-->
<!--2019-06-11 15:55:52 赵立强 小鱼视频会议-->
<!--1、搜索区试题名称（题目名称）字段改为试题内容-->
<!--2、列表字段试题名称改为试题内容-->
<!--3、列表字段去掉课程类型-->

<!--2019-06-18 18:47:06 邮件通知更新SVN原型-->
<!--1、搜索区题目名称字段改为试题内容-->
