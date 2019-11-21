<template>
    <div class="clearfix">
        <h2 class="title-h2">教学地图详情</h2>
        <div class="preservation-container">
            <el-form :inline="true" :model="formData" class="demo-form-inline" label-width="100px"
                     ref="operationForm">

                <!--TODO CSS待调整-->
                <el-form-item label="地图编号" >
                    {{formData.mNumber}}
                </el-form-item>
                <el-form-item label="地图名称" prop="mName">
                    {{formData.mName}}

                </el-form-item>

                <el-form-item label="适用区域" prop="mArea">
                    {{formData.mArea}}

                </el-form-item>

                <el-form-item label="知识体系" prop="mKnowPath">
                    {{formData.mKnowPath ? knowMap[formData.mKnowPath.split('/').pop()]['knowName']: ''}}

                </el-form-item>

                <el-form-item label="适用岗位" prop="mPositionID">
                    {{formData.mPositionID? dictMap[formData.mPositionID] : ''}}

                </el-form-item>

                <el-form-item label="适用职级" prop="mRankID">
                    {{formData.mRankID? dictMap[formData.mRankID] : ''}}

                </el-form-item>

                <el-form-item label="地图介绍" prop="mDes">
                    {{formData.mDes}}

                </el-form-item>


            </el-form>

        </div>


        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="已添加课程" name="1">

                <div class="map-list table-view">
                    <draggable
                            class="list-group"
                            tag="ul"
                            v-model="tableData"
                            v-bind="dragOptions"
                            :options="{sort: false}"
                            @start="drag = false"
                            @end="endDrag"
                    >
                        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                            <li
                                    class="list-group-item"
                                    v-for="(element, index) in tableData"
                                    :key="element.cNumber"
                            >
                                <i
                                        :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
                                        @click="element.fixed = !element.fixed"
                                        aria-hidden="true"
                                ></i>
                                <span>{{index + 1}}、</span>

                                <el-switch
                                        v-model="element.cMustCourse"
                                        active-text="必修"
                                        inactive-text="选修"
                                        :disabled="true"
                                >
                                </el-switch>
                                <span>【{{element.cName}}】</span>


                                <span v-if="element.cMustCourse">【{{element.cMustCourse}}】</span>
                                <span>{{element.cSyllabus}}</span>
                                <!--教学大纲（原为课程描述）-->
                                <span class="course-des">通过对业务知识的学习，学员可以对实际生产过程中遇到的常见问题进行解决。</span>

                                <!--TODO 以上为假数据，仅用于开发阶段调试，后期删除-->


                            </li>
                        </transition-group>
                    </draggable>

                </div>
            </el-collapse-item>
        </el-collapse>


        <div class="button-container">

            <el-button class="el-btn-min-100" type="primary" @click="$router.back()" size="small">返回</el-button>
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


    import draggable from 'vuedraggable'


    export default {
        name: "MapDetail",
        components: {

            draggable,
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }
        },


        data() { // 存储数据
            return {


                // 标题
                formData: {
                    // mNumber: '',
                    // mName: '',
                    // mArea: '',
                    // mKnowPath: null,
                    // mPositionID: '',
                    // mRankID: '',
                    // mDes: '',
                },


                // 字典项
                dictData: {},
                mAreaOptions: {},
                mStateOptions: {},
                mRankOptions: {},
                mPositionOptions: {},
                dictMap: {},
                knowPathOptions: [],
                knowMap: {},


                cAreaAllOptions: {},
                cStateAllOptions: {},
                cLearnAllOptions: {},


                activeNames: ['1'],

                tableData: [], // 绑定的课程
                tableDataKey: [],  // id 问题待解决
                list: [
                    {
                        name: '123',
                        order: 1,
                    },
                    {
                        name: '123',
                        order: 2,
                    },
                    {
                        name: '123',
                        order: 3,
                    },
                    {
                        name: '123',
                        order: 4,
                    },


                ],
                drag: false,


                // 课程搜索
                //课程搜索表单
                courseFormData: {
                    createTime: ['', ''],
                    cType: null,
                    cState: null,
                    cLearnStyle: null,
                    cName: '',
                    cCreateUser: '',


                },
                //课程列表
                courseData: [],
                courseDataKey: [],

                pageNo: 1,
                pageSize: 10,
                total: 0
            }
        },
        created() {

            // this.operationFlag = this.$route.query.flag;  // flag: 'add' 新增； 'edit' 编辑
            this.loadPreData();
            // this.reloadCourseTable(1);
            this.mID = this.$route.query.id;

            axiosPost(API.MAP_DETAIL, {
                id: this.mID
            }).then(res => {
                res = res.data;
                res.mID = res.id;
                res.mNumber = res.mapId;
                res.mName = res.mapName;
                res.mArea = res.area;
                res.mAreaID = res.areaId;
                res.mState = res.mapStatus;
                res.mDes = res.mapIntroduce;
                res.mType = res.mediaType;
                res.courseCount = res.cmList ? res.cmList.length : 0; // TODO 后期由后端直接提供数量?
                res.mPosition = res.position;
                res.mPositionID = res.positionId;
                res.mRank = res.station;
                res.mRankID = res.stationId;
                res.mCreateUser = res.createUser;
                res.mCreateTime = res.createTime;
                res.mUpdateUser = res.updateUser;
                res.mUpdateTime = res.updateTime;
                res.mKnowPath = res.knowledgePath;
                res.Course = res.cmList;
                res.studentCount = res.personCount;
                console.log(this.$route.query.row);
                console.log(res);

                this.row = res;
                this.mNumber = this.row.mNumber;

                res.Course.map(i => {
                    this.tableData.push({

                        cID: i.id,
                        cNumber: i.courseId,
                        cName: i.courseName,
                        cIndex: i.courseOrder,
                        cMustCourse: i.courseType,
                        cSyllabus: i.courseDescribe,
                    })
                });





                this.tableDataKey = this.tableData.map(i => i.cNumber); // TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空
                console.log(this.tableData)
                console.log(this.tableDataKey)
                this.formData = this.row;
                this.formRules = this.editRules;


            });



        },

        methods: {

            handleChange(val) {
                console.log(val);
            },


            loadPreData() {

                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {

                        this.dictData = res;

                        this.mAreaOptions = res.area;
                        this.mStateOptions = res.status;
                        this.mRankOptions = res.userRank;
                        this.mPositionOptions = res.position;

                    });
                getDictionariesNameData()
                    .then(res => {
                        this.dictMap = res;
                    });
                getKnowAllData()
                    .then(res => {
                        this.knowPathOptions = res;


                    });
                getMapNameData()
                    .then(res => {
                        this.knowMap = res;

                    })


            },

            reloadCourseTable(val) {
                // 请求Table数据，重新渲染
                this.pageNo = val;

                axiosPost(API.COURSE_LIST, {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    typeId: this.courseFormData.cType,
                    enabled: this.courseFormData.cState,
                    studyModeId: this.courseFormData.cLearnStyle,
                    name: this.courseFormData.cName,
                    createUser: this.courseFormData.cCreateUser,
                    startTime: this.courseFormData.createTime[0].constructor === Date ? this.courseFormData.createTime[0].Format("yyyy-MM-dd hh:mm:ss") : '',
                    endTime: this.courseFormData.createTime[1].constructor === Date ? this.courseFormData.createTime[1].Format("yyyy-MM-dd hh:mm:ss") : '',

                }).then(res => {
                    console.log(res);
                    const resData = res.data.records;
                    this.total = res.data.total;
                    try {
                        // 前后端字段对应
                        resData.map(i => {


                            i.cID = i.id;
                            i.cNumber = i.code;
                            i.cName = i.name;
                            i.cType = i.type;
                            i.cTypeID = i.typeId;
                            i.cKnowID = i.knowledgeId;
                            i.cPathName = i.knowledgePath; // 课程分类？？
                            i.cLearnID = i.studyModeId;
                            i.cLearn = i.studyMode;
                            i.cStarLevelId = i.starLevelId
                            i.cStarLevel = i.starLevel;
                            i.cDuration = i.duration;
                            i.cAudience = i.audience; // 受众
                            i.cStudyPurpose = i.studyPurpose; // 课程目标？
                            i.cSyllabus = i.syllabus; // 大纲?
                            i.cCreateTime = i.createTime;
                            i.cCreateUser = i.createUser;
                            i.cUpdateTime = i.updateTime;
                            i.cUpdateUser = i.updateUser;
                            i.cMustCourse = i.mustCourse; // 必修/选修  true or false
                            i.cEnabled = i.enabled ? '启用' : '禁用';


                        });
                        this.courseData = resData;
                    } catch (e) {
                        console.log(e);
                        this.tableData = []
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


            tableHandleSelectionChange(val) {
                this.tableMultipleSelection = val;
                console.log(this.tableMultipleSelection);

            },


            searchReset() {
                this.courseFormData = {
                    createTime: ['', ''],
                    cType: null,
                    cState: null,
                    cLearnStyle: null,
                    cName: '',
                    cCreateUser: '',
                }
            },


            addCourse(val) {

                console.log(val);
                if (val.length === 0) {
                    this.$notify({
                        title: '未选择',
                        message: '需选择后方可执行操作',
                        type: 'warning',
                        position: 'bottom-right'
                    });
                    return;
                }

                // TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空
                val.map(i => {

                    if (this.tableDataKey.indexOf(i.cNumber) < 0) {
                        // 重复不添加
                        this.tableDataKey.push(i.cNumber);
                        this.tableData.push(i);
                    }
                })

                console.log(this.tableDataKey)
                console.log(this.tableData)


            },

            removeCourse(val) {

                console.log(val);
                if (val.length === 0) {
                    this.$notify({
                        title: '未选择',
                        message: '需选择后方可执行操作',
                        type: 'warning',
                        position: 'bottom-right'
                    });
                    return;
                }


                // TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空
                val.map(i => {
                    let score = this.tableDataKey.indexOf(i.cNumber);
                    this.tableDataKey.splice(score, 1);
                    this.tableData.splice(score, 1);

                })

            },
            endDrag() {
                this.drag = false;
                this.tableDataKey = this.tableData.map(i => i.cNumber);
                // TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空

            },


            formSubmit(val) {

                try {


                    this.tableData.map((item, i) => {
                        item.courseOrder = i;
                        item.id = item.cID;
                        item.courseId = item.cNumber;
                        console.log(item.cMustCourse);
                        item.courseType = item.cMustCourse;
                        item.courseName = item.cName;
                        item.courseDescribe = item.cSyllabus;

                    });
                    switch (this.operationFlag) {
                        case 'add':
                            axiosPost(API.MAP_ADD, {
                                mapName: this.formData.mName,
                                area: this.dictMap[this.formData.mArea],
                                areaId: this.formData.mArea,
                                knowledgePath: this.formData.mKnowPath,
                                knowledgeId: this.formData.mKnowPath ? this.formData.mKnowPath.split('/').pop() : '',
                                positionId: this.formData.mPositionID,
                                position: this.formData.mPosition,
                                stationId: this.formData.mRankID,
                                station: this.formData.mRank,
                                mapIntroduce: this.formData.mDes,
                                createUser: '', // TODO 创建人传空
                                mapStatus: val === 'save' ? this.dictData.isPubed[0]['id'] : this.dictData.isPubed[1]['id'],
                                // 字典配好后替换
                                // mapStatus: '0',
                                cmList: this.tableData,

                            }).then(res => {
                                console.log(res);
                                this.$router.back();
                            });
                            break;

                        case 'edit':
                            console.log(this.formData);
                            axiosPost(API.MAP_EDIT, {
                                id: this.mID,  // TODO 主键
                                mapIds: this.mNumber,// TODO 编号
                                mapName: this.formData.mName,
                                area: this.dictMap[this.formData.mArea],
                                areaId: this.formData.mArea,
                                knowledgePath: this.formData.mKnowPath,
                                knowledgeId: this.formData.mKnowPath ? this.formData.mKnowPath.split('/').pop() : '',
                                positionId: this.formData.mPositionID,
                                position: this.formData.mPosition,
                                stationId: this.formData.mRankID,
                                station: this.formData.mRank,
                                mapIntroduce: this.formData.mDes,
                                createUser: '', // TODO 创建人传空
                                mapStatus: val === 'save' ? this.dictData.isPubed[0]['id'] : this.dictData.isPubed[1]['id'],
                                // 字典配好后替换
                                // mapStatus: '0',
                                cmList: this.tableData

                            }).then(res => {
                                console.log(res);
                                this.$router.back();


                            })
                            break;
                        default:

                            console.log(`${this.operationFlag}未定义`)

                            break;


                    }

                } catch (e) {
                    console.log(e);
                }

            },

            handleSelectionChange(val) { // 多选框点击
                this.multipleSelection = val;
                console.log('当前选择的是：' + this.multipleSelection)

            },


            handleSizeChange(val) {
                this.pageSize = val;
                console.log(`每页 ${val} 条`);
                this.reloadCourseTable(1);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.reloadCourseTable(val)
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

    .el-input {
        width: 200px;
    }

    .vue-treeselect {
        width: 200px;
        float: left;
    }

    .preservation-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .demo-form-inline {
        margin: 20px 20px 0 0;
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

    /*.orgId-p{*/
    /*display: block;*/
    /*}*/
    /*.orgId-p>span{*/
    /*float: left;*/
    /*line-height: 40px;*/
    /*}*/

</style>
