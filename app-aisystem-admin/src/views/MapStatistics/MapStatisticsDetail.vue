<template><!-- 教学地图统计详情 shuling.xiang-->
    <div class="MapStatisticsDetail">
        <h2 class="title-h2">教学地图统计详情</h2>
        <div class="search-container">
            <ul class="detail-list clearfix">
                <li>
                    <span class="left-tit">地图编号：</span>
                    <span class="doc-context">{{mapId}}</span>
                </li>
                <li>
                    <span class="left-tit">地图名称：</span>
                    <span class="doc-context">{{mapName}}</span>
                </li>
                <li>
                    <span class="left-tit">适用岗位：</span>
                    <!--                    <span class="doc-context">{{position == '1' ?'专员级':(position == '2'?'经理级':'主管级')}}</span>-->
                    <span class="doc-context">{{dictionariesNameData[positionId]}}</span>
                </li>
                <li>
                    <span class="left-tit">适用职级：</span>
<!--                    <span class="doc-context">{{stationId == '1' ?'坐席':(stationId == '2'?'组长':(stationId == '3'?'班长':'部门主管'))}}</span>-->
                    <span class="doc-context">{{dictionariesNameData[stationId]}}</span>
                </li>
                <li>
                    <span class="left-tit">适用区域：</span>
                    <span class="doc-context">{{dictionariesNameData[areaId]}}</span>
                </li>
                <li>
                    <span class="left-tit">知识体系：</span>
                    <span class="doc-context">{{ knowledgeId && Object.keys(mapNameData).length > 0 ? mapNameData[knowledgeId].knowName : ''}}</span>
                </li>
                <li class="wid100">
                    <span class="left-tit">地图简述：</span>
                    <span class="doc-context">{{mapIntroduce}}</span>
                </li>
                <li>
                    <span class="left-tit">创建人：</span>
                    <span class="doc-context">{{createUser}}</span>
                </li>
                <li>
                    <span class="left-tit">创建时间：</span>
                    <span class="doc-context">{{createTime}}</span>
                </li>
            </ul>
        </div>
        <div class="map-list">
            <div class="map-table martop40">
                <el-table border :data="records" tooltip-effect="dark" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange" size="mini">
                    <el-table-column
                            prop="courseId" align="center"
                            label="序号" width="100">
                    </el-table-column>
                    <el-table-column
                            prop="courseName" align="center"
                            label="课程名称">
                    </el-table-column>
                    <el-table-column
                            prop="courseDescribe" align="center"
                            label="课程描述">
                    </el-table-column>
                    <el-table-column
                            prop="before_count" align="center"
                            label="已学">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="lessonOnConfig(scope.row.stationId,scope.row.positionId,scope.row.courseName,scope.row.queryType)">{{scope.row.before_count}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="after_count" align="center"
                            label="未学">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="lessonNoConfig(scope.row.stationId,scope.row.positionId,scope.row.courseName,scope.row.queryType)">{{scope.row.after_count}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="button-container">
                    <el-button class="el-btn-min-100" type="primary" @click="back" size="small">返回</el-button>
                </div>
            </div>
        </div>
         <!-- 已学人员列表弹窗 -->
        <el-dialog class="need-header" title="已学人员列表" :visible.sync="lessonOnConfigIsShow" @close='closerLessonOnConfig'>
            <div class="dialog-container">
                <el-table :data="lessonOnConfigData" border style="width: 100%" ref="lessonOnConfigRef" @selection-change="multipleSelectionChange2" size="mini">
                    <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                    <el-table-column prop="position" label="岗位" align="center"></el-table-column>
                    <el-table-column prop="userRank" label="职级" align="center"></el-table-column>
                    <el-table-column prop="idNo" label="身份证号" align="center"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="lessonOnConfigIsShow = false" size="small">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 未学人员列表弹窗 -->
        <el-dialog class="need-header" title="未学人员列表" :visible.sync="lessonNoConfigIsShow" @close='closerLessonNoConfig'>
            <div class="dialog-container">
                <el-table :data="lessonNoConfigData" border style="width: 100%" ref="lessonNoConfigRef" @selection-change="multipleSelectionChange3" size="mini">
                    <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                    <el-table-column prop="position" label="岗位" align="center"></el-table-column>
                    <el-table-column prop="userRank" label="职级" align="center"></el-table-column>
                    <el-table-column prop="idNo" label="身份证号" align="center"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="el-btn-min-100" @click="lessonNoConfigIsShow = false" size="small">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesNameData,getMapNameData} from '@/assets/js/api'
    import '@/assets/js/dateFormat';

    export default {
        name: "MapStatisticsDetail",
        data() { // 存储数据
            return {
                records: [], // 表格数据列表
                mapId:'', //地图编号
                mapName:'', //地图名称
                mapIntroduce:'', //简述
                createUser:'', //创建人
                knowledgeId :'', //知识体系
                knowledgePath:'', //
                areaId: '', //适用区域
                station: '', //适用职级
                position: '', //适用岗位
                stationId:'', //职级
                positionId:'', //岗位
                multipleSelection: [], // 表格已经选择的内容
                multipleSelection2: [], //已学人员列表的内容
                multipleSelection3: [], //未学人员列表的内容
                personCount: '', //关联学员数量
                courseName:'', //课程名称
                // createTime: ['', ''], //创建时间
                createTime: '', //创建时间
                after_count: '', //未学
                before_count: '', //已学
                lessonOnConfigIsShow: false, //已学人员弹窗是否显示
                lessonOnConfigData: [], //已学人员列表

                lessonNoConfigIsShow: false, //未学人员弹窗是否显示
                lessonNoConfigData: [], //未学人员列表

                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                mapNameData:[],
            }
        },
        created() { //创建完成 生命周期

            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getMapNameData().then(res => {
                this.mapNameData = res;
            });

            this.getList(1,10); //列表请求
            this.mapId = this.$route.query.mapId;
            this.mapName = this.$route.query.row.mapName;
            this.stationId = this.$route.query.row.stationId;
            this.positionId = this.$route.query.row.positionId;
            this.areaId = this.$route.query.row.areaId;
            this.knowledgeId = this.$route.query.row.knowledgeId;
            this.mapIntroduce = this.$route.query.row.mapIntroduce;
            this.createUser = this.$route.query.row.createUser;
            this.createTime = this.$route.query.row.createTime;

            this.getLessonOnList(); //获取已学人员列表
            this.getLessonNoList(); //获取未学人员列表
        },
        methods: {
            back() {
                this.$router.go(-1);//返回
            },
            getList(){ // 获取列表
                axiosPost('/educateMgr/emap/mapCountInfo',{ //详情页请求
                    mapId: this.$route.query.mapId,
                    personCount: this.$route.query.personCount
                }).then(res => {
                    this.records = res.data;
                });
            },
            getLessonOnList() { // 获取已学人员列表
                axiosPost('/educateMgr/emap/showPerson', {
                    stationId: this.stationId,
                    positionId: this.positionId,
                    courseName: this.courseName,
                    queryType: 1,
                }).then((res) => {
                    this.lessonOnConfigData = res.data.records;

                });
            },
            getLessonNoList() { // 获取未学人员列表
                axiosPost('/educateMgr/emap/showPerson', {
                    stationId: this.stationId,
                    positionId: this.positionId,
                    courseName: this.courseName,
                    queryType: 2,
                }).then((res) => {
                    this.lessonNoConfigData = res.data.records;

                });
            },
            handleSelectionChange(val) { // 课程表格
                this.multipleSelection = val;
            },
            lessonOnConfig() { // 已学人员弹窗
                this.lessonOnConfigIsShow = true;
            },
            multipleSelectionChange2(val) { // 已学人员列表表格
                this.multipleSelection2 = val;
            },
            closerLessonOnConfig() { // 关闭已学人员列表 弹窗
                this.$refs.lessonOnConfigRef.clearSelection();
            },
            lessonNoConfig() { // 未学人员弹窗
                this.lessonNoConfigIsShow = true;
            },
            multipleSelectionChange3(val) { // 已学人员列表表格
                this.multipleSelection3 = val;
            },
            closerLessonNoConfig() { // 关闭未学人员列表 弹窗
                this.$refs.lessonNoConfigRef.clearSelection();
            },
        }
    }
</script>

<style scoped>

    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .el-input {
        width: 200px;
    }

    .button-container {
        text-align: center;
        margin-top: 20px;
    }
    .pagination{
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }
    .total{
        font-weight: bold;
    }
    .martop40 {
        margin-top:40px;
    }
    .wid100 {
        width:100%;
    }
    .detail-list li {
        float:left;
        width:30%;
        padding:10px 0 0 0;
    }
    .detail-list li.wid100 {
        width:100%;
        padding:10px 0 0 0;
    }
    .detail-list .left-tit {
        display:inline-block;
        width:100px;
        font-size:16px;
        font-weight: bold;
    }
    .detail-list .doc-context {
        display:inline-block;
        font-size:14px;
    }
</style>