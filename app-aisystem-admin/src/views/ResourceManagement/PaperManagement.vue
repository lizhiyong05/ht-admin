<!--试卷管理-->
<!--周硕梁-->
<template>
    <div >
        <h2 class="title-h2">试卷管理</h2>
        <div class="preservation-container">
            <div class="search-container">
                <el-form size="small" :inline="true" :model="searchData" class="demo-form-inline" label-width="100px"
                        ref="courseForm">
                    <el-form-item label="试卷分类" prop="pClassify">
                    <treeselect v-model="searchData.pClassify"
                    :options="pClassifyAllOptions"
                    placeholder="请选择试卷分类"
                                noResultsText="未找到，请重新输入"
                    :normalizer="normalizer"
                    />
                    </el-form-item>
                    <el-form-item label="试卷名称" prop="pName">
                        <el-input v-model="searchData.pName" placeholder="请输入名称"></el-input>
                    </el-form-item>

                    <el-form-item label="创建人" prop="pCreateUser">
                        <el-input v-model="searchData.pCreateUser" placeholder="请输入创建人"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="pCreateTime">
                        <el-date-picker
                                v-model="searchData.pCreateTime"
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

                    <el-button v-if="perLoaded ? PERMISSIONS.PAPER.ADD : false" size="small" @click="pushOperationPage(flag='add')">新增</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.PAPER.ENABLE :  false" size="small" @click="operationAffirm(flag='enable', val=multipleSelection.map(i => i.pID))">启用</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.PAPER.DISABLED : false" size="small" @click="operationAffirm(flag='disable', val=multipleSelection.map(i => i.pID))">停用</el-button>
                    <el-button v-if="perLoaded ? PERMISSIONS.PAPER.DELETE : false" size="small" @click="operationAffirm(flag='delete', val=multipleSelection.map(i => i.pID))">删除</el-button>

                </div>

                <div class="map-table loading-table">
                    <el-table size="mini" ref='multipleTable' :data="tableData" border style="width: 100%"
                              @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection" align="center"
                                width="40" fixed="left">
                        </el-table-column>
                        <el-table-column align="center" prop="pNumber"
                                         label="试卷编号" width="150" fixed="left" >
                            <template slot-scope="scope">
                                <span class="table-operation" @click="pushDetail(scope.row.pID)">{{scope.row.pNumber}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column

                                prop="pName" align="center" min-width="150" 
                                label="试卷名称">
                        </el-table-column>
                        <el-table-column
                                prop="pClassify" align="center" width="120" 
                                label="试卷分类" >
                            <template slot-scope="scope">
                                <!--{{scope.row.pClassify}}-->
                                {{scope.row.pClassify in knowMap ? knowMap[scope.row.pClassify]['knowName']: ''}}
                            </template>


                        </el-table-column>

                        <el-table-column
                                prop="pTotal" align="center" width="80" 
                                label="试卷总分">
                        </el-table-column>
                        <el-table-column
                                prop="pState" align="center" width="80" 
                                label="试卷状态" :formatter="(row, column) => {return {'0': '停用', '1':'启用', '2':'删除',}[row.pState]}">
                        </el-table-column>
                        <el-table-column
                                prop="pCreateUser" align="center" min-width="100" 
                                label="创建人">
                        </el-table-column>
                        <el-table-column
                                prop="pCreateTime" align="center" width="165" 
                                label="创建时间">
                        </el-table-column>

                        <el-table-column v-if="perLoaded ? (PERMISSIONS.PAPER.EDIT || PERMISSIONS.PAPER.DELETE) : false" label="操作" fixed="right"  width="105" align="center">
                            <template slot-scope="scope">

                                <span v-if="perLoaded ? PERMISSIONS.PAPER.EDIT : false" class="table-operation" @click="pushOperationPage(flag='edit', id=scope.row.pID)">修改</span>
                                <span v-if="perLoaded ? PERMISSIONS.PAPER.DELETE : false" class="table-operation" @click="operationAffirm(flag='delete', val=[scope.row.pID, ])">删除</span>
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

    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
        getKnowAllData,
        getMapNameData,

    } from '@/assets/js/api';
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import '@/assets/js/dateFormat';
    import { API } from '@/assets/js/urls';
    import { PERMISSION } from "@/assets/js/permissions";
    import {debugLog} from "../../assets/js/tool";




    export default {
        name: "PaperManagement",
        components:{
            treeselect: Treeselect,
        },
        computed:{

        },
        data(){
            return{
                userPermission: [],

                // 搜索
                searchData:{
                    pClassify: null,
                    pName: '',
                    pCreateUser: '',
                    pCreateTime: [],

                },



                // 字典项
                pClassifyAllOptions: [],

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

                PERMISSIONS: {},
                perLoaded: false,
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
                        this.pClassifyAllOptions = res;


                    });
                getMapNameData()
                    .then(res => {
                        this.knowMap = res;

                    });
                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                });


            },
            reloadTable(val) {
                // 请求Table数据，重新渲染
                this.pageNo = val;

                axiosPost(API.PAPER_LIST, {
                    loading:'.loading-table',
                    noRepeat:'.reloadTable',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    knowledgeId: this.searchData.pClassify,
                    paperName: this.searchData.pName,
                    createUserName: this.searchData.pCreateUser,
                    startDate: this.searchData.pCreateTime && this.searchData.pCreateTime.length === 2 ?  this.searchData.pCreateTime[0] : '',
                    endDate: this.searchData.pCreateTime && this.searchData.pCreateTime.length === 2 ?  this.searchData.pCreateTime[1] : '',
                    // courseName: this.searchData.,   // TODO ⭐课程名称 接口文档提供字段，原型里没有

                }).then(res => {
                    // console.log(res);
                    const resData = res.data.records;
                    this.total = res.data.total;
                    try {
                        // 前后端字段对应
                        resData.map(i => {
                            i.pID = i.id;
                            i.pNumber = i.paperNo;
                            i.pName = i.paperName;
                            i.pClassify = i.knowledgeId;
                            i.pTotal = i.score;
                            i.pState = i.deleted; // 1启用 0停用 字符串
                            i.pCreateUser = i.createUserName;
                            i.pCreateTime = i.createTime;

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
                    pClassify: null,
                    pName: '',
                    pCreateUser: '',
                    pCreateTime: [],

                }
            },


            // 跳转新增/编辑页面
            pushOperationPage(flag, id){

                let canEdit = true;

                 if (flag === 'edit') {
                      axiosPost(API.PAPER_CHECK, {
                        id: id
                    }).then(res => {
                        if (!res.data || res.data === false) {
                            canEdit = false;

                        }
                          if (canEdit){
                              // flag: 'add' 新增； 'edit' 编辑
                              this.$router.push({
                                  path:'/paper-operation',
                                  query:{
                                      flag: flag,
                                      id: id,
                                  }
                              })

                          }else{
                            this.$message({message: '已被复用，无法修改',type: 'warning'});
                          }
                    })

                } else{
                     // flag: 'add' 新增； 'edit' 编辑
                     this.$router.push({
                         path:'/paper-operation',
                         query:{
                             flag: flag,
                             id: id,
                         }
                     })

                 }










            },
            pushDetail(id){
                this.$router.push({
                    path:'/paper-detail',
                    query:{
                        id: id,
                    }
                })
            },


            // 操作弹框
            operationAffirm(flag, val, affirm=true){
                if (val.length <= 0 ){
                    this.$message({message: '需选择后方可执行操作',type: 'warning'});
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
                        this.operationAffirmMessage = '确认将所选择的试卷设置为启用？';

                        break;
                    case 'disable':
                        this.operationAffirmMessage = '确认将所选择的试卷设置为禁用？';

                        break;

                    case 'delete':
                        this.operationAffirmMessage = '是否确认删除所选择的试卷？';

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
                let temURL = '';
                switch (this.operationFlag) {  // 后端接口设计为通过字符串类型动作码指定操作 0停用 1启用 2删除
                    case 'enable':
                        temFlag = '1';
                        temURL = API.PAPER_RELEASE;
                        break;
                    case 'disable':
                        temFlag = '0';
                        temURL = API.PAPER_RELEASE;
                        break;
                    case 'delete':
                        temFlag = '2';
                        temURL = API.PAPER_DELETE;
                        break;
                    default:
                        // console.log(`未定义的操作: ${this.operationFlag}`);
                        return;

                }

                axiosPost(temURL, {
                    noRepeat:'.operationSubmit',
                    deleted: temFlag,
                    paperId: this.operations
                }).then(res => {
                    this.affirmIsShow = false;
                    this.reloadTable(1);

                });



            },



            // TODO ⭐2019-06-03 16:38:03 钉钉群咨询后未得到需求答复,暂不做
            normalizer(node) {
                return {
                    id: node.id,
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


    .table-view {
        margin-top: 10px;
    }

    .tips {
        color: #909399;

        cursor: pointer;
        margin-bottom: 5px;
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
</style>
