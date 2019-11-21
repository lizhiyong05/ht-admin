<template>
    <div >
        <h2 class="title-h2">教学地图管理</h2>
        <div class="search-container">
            <el-form :inline="true" class="demo-form-inline" label-width="100px">
                <el-form-item label="所属区域" size="small">
                    <el-select v-model="searchArea" placeholder="请选择">
                        <el-option v-for="(item,ind) in dictData['area_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="知识体系" size="small">
                    <treeselect v-model="searchKnowPath"
                                :options="searchKnowPathAllOptions"
                                placeholder="请选择所属知识体系"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                    />
                </el-form-item>
                <el-form-item label="地图状态" size="small">
                    <el-select v-model="searchState" placeholder="请选择">
                        <el-option v-for="(item,ind) in dictData['isPubed_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地图名称" size="small">
                    <el-input v-model="searchName" placeholder="请输入地图名称" size="small"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" size="small">
                    <el-date-picker
                            v-model="searchCreateDate"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button class="reloadTable el-btn-min-100" type="primary" @click="reloadTable(1)" size="small">查询</el-button>
                <el-button class="el-btn-min-100" @click="resetFun" size="small">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button v-if="perLoaded ? PERMISSIONS.MAP.ADD : false" size="small" @click="pushAdd(flag='add')">新增</el-button>
            <el-button v-if="perLoaded ? PERMISSIONS.MAP.RELEASE : false" size="small" @click="releaseMap(multipleSelection.map(i => i.mID))">发布</el-button>
            <el-button v-if="perLoaded ? PERMISSIONS.MAP.DELETE : false" size="small" @click="deleteMap(multipleSelection.map(i => i.mNumber))">删除</el-button>
        </div>
        <div class="map-list">
            <el-dialog class="el-dialog-500" title="" :visible.sync="deleteIsShow">
                <div class="dialog-container">
                    <p class="align-center">选中项确认要删除吗？</p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button class="el-btn-min-100" @click="deleteIsShow=false" size="small">取消</el-button>
                    <el-button class="deleteSubmit el-btn-min-100" type="primary" @click="deleteSubmit" size="small">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog class="el-dialog-500" title="" :visible.sync="releaseIsShow">
                <div class="dialog-container">
                    <p class="align-center">选中项确认要发布吗？</p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button class="el-btn-min-100" @click="releaseIsShow=false" size="small">取消</el-button>
                    <el-button class="releaseSubmit el-btn-min-100" type="primary" @click="releaseSubmit" size="small">确定</el-button>
                </div>
            </el-dialog>
            <div class="map-table loading-table">
                <el-table ref='multipleTable' :data="tableData" border style="width: 100%" size="mini"
                          @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection" align="center"
                            width="40">
                    </el-table-column>
                    <el-table-column align="center" prop="mNumber"
                            label="地图编号" >
                        <template slot-scope="scope">
                            <span class="table-operation" @click="pushDetail(scope.row)">{{scope.row.mNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mName" align="center"
                            label="地图名称">
                    </el-table-column>
                    <el-table-column
                            prop="mState" align="center"
                            label="地图状态">
                        <template slot-scope="scope">
                            {{scope.row.mState ? dictMap[scope.row.mState] : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mDes" align="center" show-overflow-tooltip
                            label="地图简述">
                    </el-table-column>
                    <el-table-column
                            prop="courseCount" align="center"
                            label="课程数量">
                    </el-table-column>
                    <el-table-column
                            prop="mPositionID" align="center"
                            label="适用岗位">
                        <template slot-scope="scope">
                            {{scope.row.mPositionID ? dictMap[scope.row.mPositionID] : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mRankID" align="center"
                            label="适用职级">
                        <template slot-scope="scope">
                            {{scope.row.mRankID ? dictMap[scope.row.mRankID] : ''}}
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
                    <el-table-column  v-if="perLoaded ? (PERMISSIONS.MAP.EDIT || PERMISSIONS.MAP.DELETE) : false" label="操作" width="110" align="center">
                        <template slot-scope="scope">
                            <span v-if="perLoaded ? PERMISSIONS.MAP.EDIT : false" class="table-operation" @click="pushAdd(flag='edit',val=scope.row,id=scope.row.id)">编辑</span>
                            <span v-if="perLoaded ? PERMISSIONS.MAP.DELETE : false" class="table-operation" @click="deleteMap([scope.row.mNumber,])">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{total}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20,50]"
                            :page-size="5"
                            layout="sizes, prev, pager, next, jumper"
                            :current-page.sync="pageNo"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
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
    import {API} from '@/assets/js/urls';
    import { PERMISSION } from "@/assets/js/permissions";
    import {debugLog} from "../../assets/js/tool";

    export default {
        name: "MapManagement",
        components: {
            Treeselect
        },
        data() { // 存储数据
            return {
                PERMISSIONS: {},
                perLoaded: false,

                // 检索区
                searchArea: null,
                searchAreaAllOptions: [],
                searchKnowPath: null,
                searchKnowPathAllOptions: [],
                searchState: null,
                searchStateAllOptions: [],
                searchName: '',
                searchUser: '',
                searchCreateDate: [],

                tableData: [],

                // 多选状态存储
                multipleSelection: [],

                // 操作状态存储
                operations: [],

                // 分页
                total: 0,
                pageNo: 1,
                pageSize: 5,

                deleteIsShow: false, // 删除提示框
                releaseIsShow: false,



                // 字典项
                dictData: {},
                dictMap: {},

                mPositionOptions: [],  // 岗位字典
                mAreaOptions: [], // 区域字典
                mRankOptions: [], // 职级字典
                mStateOptions: [], // 状态字典

                //二级弹窗 课程选择
                cTypeAllOptions: [], // 课程类型

                knowMap: {}, // 知识体系


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

                        this.searchAreaAllOptions = res.area_all;
                        this.mAreaOptions = res.area;

                        this.searchStateAllOptions = res.isPubed_all;
                        this.mStateOptions = res.isPubed;

                        this.mRankOptions = res.userRank;
                        this.mPositionOptions = res.position;

                    });
                getDictionariesNameData()
                    .then(res => {
                        this.dictMap = res;
                    });
                getKnowAllData()
                    .then(res => {
                        this.searchKnowPathAllOptions = res;



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
                axiosPost(API.MAP_LIST, {
                    loading:'.loading-table',
                    noRepeat:'.reloadTable',
                    areaId: this.searchArea,
                    knowledgeId: this.searchKnowPath ? this.searchKnowPath.split('/').pop() : '',
                    mapStatus: this.searchState,
                    mapName: this.searchName,
                    createUser: this.searchUser,
                    startTime: this.searchCreateDate && this.searchCreateDate.length === 2 ? this.searchCreateDate[0] : '',
                    endTime: this.searchCreateDate && this.searchCreateDate.length === 2 ? this.searchCreateDate[1] : '',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,

                }).then(res => {
                    const resData = res.data;
                    this.total = resData.total;

                    try {
                        // 前后端字段对应
                        resData.records.map(i => {
                            i.mID = i.id;
                            i.mNumber = i.mapId;
                            i.mName = i.mapName;
                            i.mArea = i.area;
                            i.mAreaID = i.areaId;
                            i.mState = i.mapStatus;
                            i.mDes = i.mapIntroduce;
                            i.mType = i.mediaType;
                            // i.courseCount = i.cmList ? i.cmList.length : 0;
                            i.courseCount = i.courseCount;
                            i.mPosition = i.position;
                            i.mPositionID = i.positionId;
                            i.mRank = i.station;
                            i.mRankID = i.stationId;
                            i.mCreateUser = i.createUser;
                            i.mCreateTime = i.createTime;
                            i.mUpdateUser = i.updateUser;
                            i.mUpdateTime = i.updateTime;
                            i.mKnowPath = i.knowledgePath;
                            i.Course = i.cmList;
                            i.studentCount= i.personCount;




                        });
                        this.tableData = resData.records;
                    } catch (e) {

                        // 数据异常捕获
                        this.tableData = [];
                    }


                });


            },


            releaseMap(val){
                if (val.length <= 0 ){
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
                    return;
                }
                this.operations = val;
                this.releaseIsShow = true;
            },


            deleteMap(val){
                if (val.length <= 0 ){
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
                    return;
                }

                this.operations = val;
                this.deleteIsShow = true;


            },
            deleteSubmit(){
                axiosPost(API.MAP_DELETE,{
                    noRepeat:'.deleteSubmit',
                    mapIds: this.operations
                }).then( () => {
                    this.deleteIsShow = false;
                    this.reloadTable(1)
                } )
            },
            releaseSubmit(){
                axiosPost(API.MAP_RELEASE,{
                    noRepeat:'.releaseSubmit',
                    ids: this.operations,
                    mapStatus: '74d44cf6'
                }).then( res => {
                    this.releaseIsShow = false;
                    this.$message({message: '发布成功', type: 'success'});
                    this.reloadTable(1)
                } )
            },





            resetFun() { // 重置搜索条件

                this.searchArea = null;
                this.searchKnowPath = null;
                this.searchState = null;
                this.searchName = '';
                this.searchUser = '';
                this.searchCreateDate = [];

            },


            // 跳转新增/编辑页
            pushAdd(flag, val, id){


                // flag: 'add' 新增； 'edit' 编辑

                this.$router.push({
                    path:'/add-map',
                    query:{
                        flag: flag,
                        row: val,
                        id: id,
                    }
                })
            },

            pushDetail(row) {
                //跳转详情页
                this.$router.push({
                    path: '/map-detail',
                    query: {
                        id: row.id,
                        row: row,


                    }
                })
            },
            normalizer(node) {
                return {
                    id: node.path,
                    label: node.knowName,
                    children: node.children,
                }
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handleSizeChange(val) {
                this.pageSize = val;
                this.reloadTable(1);
            },
            handleCurrentChange(val) {
                this.reloadTable(val)
            },

        }
    }
</script>

<style scoped>
    .table-operation {
        color: #409EFF;
        margin-left: 5px;
        cursor: pointer;
    }
    .el-pagination{
        display: inline-block;
    }
    .pagination{
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }
    .total{
        font-weight: bold;
    }
    .xinzeng{
        margin-right: 10px;
    }
    .vue-treeselect {
        width: 200px;
        float: left;
    }
    .orgId-p{
        display: block;
    }
    .orgId-p>span{
        float: left;
        line-height: 40px;
    }
    .preservation-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }
    .management-ul li {
        font-size:14px;
    }
</style>
