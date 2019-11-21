<template><!-- 教学地图统计 shuling.xiang-->
    <div class="MapStatistics">
        <h2 class="title-h2">教学地图统计</h2>
        <div class="search-container">
            <el-form ref="form" :model="searchData" class="search-form clearfix" label-width="100px">
                <el-form-item label="地图状态" size="small">
                    <el-select v-model="searchData.mapStatus" placeholder="请选择" label-width="100px">
                        <el-option
                                v-for="item in isPubed_all"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="知识体系" size="small">
                    <treeselect v-model="searchData.knowledgeId"
                                :options="knowOptions"
                                placeholder="请选择所属知识体系"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                    />
                </el-form-item>
                <el-form-item label="地图名称" size="small">
                    <el-input v-model="searchData.mapName" placeholder="请输入地图名称"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" size="small">
                    <el-select v-model="searchData.areaId" placeholder="请选择">
                        <el-option
                                v-for="item in area_all"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用岗位" size="small">
                    <el-select v-model="searchData.positionId" placeholder="请选择">
                        <el-option
                                v-for="item in position_all"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用职级" size="small">
                    <el-select v-model="searchData.stationId" placeholder="请选择">
                        <el-option
                                v-for="item in userRank_all"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button class="searchList el-btn-min-100" type="primary" @click="searchList" size="small">查询</el-button>
                <el-button class="el-btn-min-100" @click="resetSearchCondition" size="small">重置</el-button>
            </div>
        </div>
        <div class="map-list loading-table">
            <div class="map-table mar-top20">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange" size="mini">
                    <el-table-column
                            type="selection" align="center"
                            width="40">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="地图编号">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="postMethods(scope.row.mapId,scope.row.personCount,scope.row)">{{scope.row.mapId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mapName" align="center"
                            label="地图名称">
                    </el-table-column>
                    <el-table-column
                            prop="mapStatus" align="center"
                            label="地图状态">
                        <template slot-scope="scope">
<!--                            {{scope.row.mapStatus == '1' ?'已发布':(scope.row.mapStatus == '2'?'待发布':'')}}-->
<!--                            {{scope.row.mapStatus ? dictionariesNameData[scope.row.isPubed] : ''}}-->
                            {{dictionariesNameData[scope.row.mapStatus]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="mapIntroduce" align="center"
                            label="地图简述">
                    </el-table-column>
                    <el-table-column
                            prop="courseCount" align="center"
                            label="课程数量">
                    </el-table-column>
                    <el-table-column
                            prop="positionId" align="center"
                            label="适用岗位">
                        <template slot-scope="scope">
                            <!--                            {{scope.row.position == '1' ?'专员级':(scope.row.position == '2'?'经理级':'主管级')}}-->
                            {{scope.row.position ?  scope.row.position : dictionariesNameData[scope.row.positionId]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="stationId" align="center"
                            label="适用职级">
                        <template slot-scope="scope">
<!--                            {{scope.row.stationId == '1' ?'坐席':(scope.row.stationId == '2'?'组长':(scope.row.stationId == '3'?'班长':'部门主管'))}}-->
                            {{scope.row.station ? scope.row.station : dictionariesNameData[scope.row.stationId]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createUser" align="center"
                            label="创建人">
                    </el-table-column>
                    <el-table-column
                            prop="createTime" align="center"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="personCount" align="center"
                            label="关联学员数量">
                    </el-table-column>
                </el-table>
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
    // import {API} from '@/assets/js/urls';

    export default {
        name: "MapStatistics",
        components: {
            Treeselect
        },
        data() { // 存储数据
            return {
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                records: [], // 表格数据列表
                recordsTotal: 0, // 表格数据的条数
                isPubed_all: [],
                // mapStatus: '', //地图状态
                area_all: [], //地图状态字典
                // areaId: '', //所属区域
                isPubed:'',
                userRank_all: [], //适用职级字典
                // stationId: '', //适用岗位
                station:'', //适用岗位
                position_all: [], //适用岗位字典
                productLine:'', //产线
                searchData: {
                    mapStatus:'',
                    mapName:'',
                    areaId:'',
                    knowledgeId: null,
                    stationId:'',
                    positionId:'',
                }, //查询表单
                // positionId: '', //适用职级
                mapId:'', //地图编号
                // mapName: '', //地图名称
                knowMap: {}, // 知识体系
                knowledgeId: null, //知识体系
                multipleSelection: [], // 表格已经选择的内容
                createTime: ['', ''], //创建时间
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条

                // 字典项
                dictData: {},
                dictMap: {},

                // // 组织机构
                // knowOptions: [{
                //     path: 'id',
                //     orgName: 'label',
                //     children: 'children'
                // }],
                knowOptions: [], // 获取知识体系字典项数据
            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            this.getList(1,10);
        },
        methods: {
            loadPreData() {

                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                        this.area_all = res.area_all;
                        this.isPubed_all = res.isPubed_all;
                        this.userRank_all = res.userRank_all;
                        this.position_all = res.position_all;
                        // console.log(this.dictData)
                    });
                getDictionariesNameData().then(res => { //获取全部数据字典名称
                    this.dictionariesNameData = res;

                });
                getKnowAllData()
                    .then(res => {
                        this.knowOptions = res;
                    });

                getMapNameData()
                    .then(res => {
                        this.knowMap = res;
                    })
            },

            getList(){ // 获取列表
                axiosPost('/educateMgr/emap/mapCountList',{
                    loading:'.loading-table',
                    noRepeat:'.searchList',
                    areaId: this.searchData.areaId, //所属区域
                    knowledgeId: this.searchData.knowledgeId, //知识体系id
                    mapStatus: this.searchData.mapStatus, //地图状态
                    mapName: this.searchData.mapName, //地图名称
                    stationId: this.searchData.stationId, //适用职级
                    positionId: this.searchData.positionId, //适用岗位
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
            resetSearchCondition(){ // 清空搜索条件 重置
                this.searchData = {};
            },

            // changeTree(Form) { // 下拉框选择出发事件
            //     this.$refs[Form].validateField(`${Form}.knowPath`)
            // },
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },

            handleSelectionChange(val) { // 选择用户角色表格
                this.multipleSelection = val;
            },
            handleSizeChange(res){ // 每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList();
            },
            handleCurrentChange(res){ // 第几页
                this.pageNo = res;
                this.getList();
            },
            postMethods(mapId,personCount,row) { //详情页跳转
                this.$router.push({path: '/map-statistics-detail', query: {mapId: mapId,personCount:personCount,row:row}});
                // axiosPost('/educateMgr/emap/mapCountInfo',{ //逐题阅卷请求
                //     mapId: mapId,
                //     personCount: personCount,
                // })
                //     .then(()=> {
                //     })
            },
        }
    }

</script>

<style scoped>

    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .search-form {
        margin-top:20px;
    }
    .search-form .el-form-item {
        float:left!important;

    }
    .button-container {
        text-align: center;
        margin-top: 0px;
    }
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
    .mar-top20 {
        margin-top:20px;
    }
</style>
