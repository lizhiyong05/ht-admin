<template>
    <div class="clearfix">
        <h2 class="title-h2">{{viewTitle}}教学地图</h2>
        <div class="preservation-container search-container">
            <el-form :inline="true" :model="formData" class="demo-form-inline" label-width="100px" :rules="formRules"
                     ref="operationForm">
                <el-form-item label="地图编号" v-if="operationFlag !== 'add'" size="small">
                    <el-input v-model="formData.mNumber" placeholder="自动生成" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="地图名称" prop="mName" size="small">
                    <el-input v-model="formData.mName" placeholder="请输入地图名称"></el-input>
                </el-form-item>

                <el-form-item label="适用区域" prop="mAreaID" size="small">
                    <el-select v-model="formData.mAreaID" placeholder="请选择适用区域">
                        <el-option
                                v-for="item in mAreaOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="知识体系" prop="mKnowPath" size="small">
                    <treeselect v-model="formData.mKnowPath"
                                :options="knowPathOptions"
                                placeholder="请选择知识体系"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                    />
                </el-form-item>

                <el-form-item label="适用岗位" prop="mPositionID" size="small">
                    <el-select v-model="formData.mPositionID" placeholder="请选择适用岗位">
                        <el-option
                                v-for="item in mPositionOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="适用职级" prop="mRankID" size="small">
                    <el-select v-model="formData.mRankID" placeholder="请选择适用职级">
                        <el-option
                                v-for="item in mRankOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地图介绍" prop="mDes" size="small">
                    <el-input type="textarea" v-model="formData.mDes" placeholder="请输入地图介绍"></el-input>
                </el-form-item>
            </el-form>

        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-dialog class="need-header" title="添加自定义课程" :visible.sync="addIsShow">
                <el-form :model="customCourseData" class="demo-form-inline" label-width="100px" :rules="formRules2" ref="courseFormDialog">
                    <el-form-item label="课程名称" prop="cName">
                        <el-input v-model="customCourseData.cName" auto-complete="off" placeholder="请输入课程名称"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必修" prop="cMustCourseKey">
                        <el-select v-model="customCourseData.cMustCourseKey" placeholder="请选择">
                            <el-option label="必修" value='1' > </el-option>
                            <el-option label="选修" value='0' > </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="教学大纲" prop="cSyllabus">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  placeholder="请输入教学大纲"
                                  v-model="customCourseData.cSyllabus"

                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="el-btn-min-100" @click="addIsShow = false" size="small">取消</el-button>
                    <el-button class="el-btn-min-100" type="primary" @click="addCustomCourseSave('courseFormDialog')" size="small">确定</el-button>
                </div>
            </el-dialog>

            <el-collapse-item title="已添加课程" name="1">
                <p v-if="GLOBAL.TIPS_DISPLAY" class="tips">tips：可通过点按拖拽修改课程顺序</p>
                <el-button size="small" @click="addCustomCourse">添加自定义课程</el-button>
                <div class="map-list table-view">
                    <!--TODO 要求能手动自定义添加课程,考虑使用serialNumber生成的流水号-->
                    <draggable
                            class="list-group"
                            tag="ul"
                            v-model="tableData"
                            v-bind="dragOptions"
                            @start="drag = true"
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
                                <!--<el-tag>{{element.cLearn}}</el-tag> -->
                                <!--学习方式-->
                                <el-switch
                                        v-model="element.cMustCourse"
                                        active-text="必修"
                                        inactive-text="选修"
                                        @change="mustChange">
                                </el-switch>
                                <span>【{{element.cName}}】</span>
                                <span>{{element.cSyllabus}}</span>
                                <!--教学大纲（原为课程描述）-->

                                <!--<br/>-->

                                <span class="table-operation fr" @click="removeCourse([element, ])">移除</span>
                            </li>
                        </transition-group>
                    </draggable>

                </div>
            </el-collapse-item>
            <el-collapse-item title="搜索课程" name="2">
                <div class="preservation-container">
                    <el-form :inline="true" :model="courseFormData" class="demo-form-inline" label-width="100px"
                             ref="courseForm">
                        <el-form-item label="课程类型" prop="cType" size="small">
                            <el-select v-model="courseFormData.cType" placeholder="请选择">
                                <el-option
                                        v-for="item in cTypeAllOptions"
                                        :key="item.id"
                                        :label="item.dicName" :disabled="item.disabled"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程状态" prop="cState" size="small">
                            <el-select v-model="courseFormData.cState" placeholder="请选择">
                                <el-option
                                        v-for="item in cStateAllOptions"
                                        :key="item.id"
                                        :label="item.dicName" :disabled="item.disabled"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学习方式" prop="cLearnStyle" size="small">
                            <el-select v-model="courseFormData.cLearnStyle" placeholder="请选择">
                                <el-option
                                        v-for="item in cLearnAllOptions"
                                        :key="item.id"
                                        :label="item.dicName" :disabled="item.disabled"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程名称" prop="cName" size="small">
                            <el-input v-model="courseFormData.cName" placeholder="请输入名称"></el-input>
                        </el-form-item>

                        <el-form-item label="创建人" prop="cCreateUser" size="small">
                            <el-input v-model="courseFormData.cCreateUser" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间" prop="createTime" size="small">
                            <el-date-picker
                                    v-model="courseFormData.createTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <div class="button-container">
                        <el-button class="reloadCourseTable el-btn-min-100" type="primary" @click="reloadCourseTable(1)" size="small">查询</el-button>
                        <el-button class="el-btn-min-100" @click="searchReset" size="small">重置</el-button>
                    </div>
                    <div class="curriculum-button">
                        <el-button size="small" @click="addCourse(multipleSelection)">批量添加</el-button>
                    </div>
                    <div class="map-list">
                        <div class="map-table loading-table">
                            <el-table ref='multipleTable' :data="courseData" border style="width: 100%" size="small"
                                      @selection-change="handleSelectionChange">
                                <el-table-column
                                        type="selection" align="center"
                                        width="40" >
                                </el-table-column>
                                <el-table-column align="center" prop="cNumber"
                                                 label="课程编号">
                                </el-table-column>
                                <el-table-column
                                        prop="cType" align="center"
                                        label="课程类型">
                                </el-table-column>
                                <el-table-column
                                        prop="cPathName" align="center"
                                        label="课程分类">
                                </el-table-column>

                                <el-table-column
                                        prop="cName" align="center"
                                        label="课程名称">
                                </el-table-column>
                                <el-table-column
                                        prop="cEnabled" align="center"
                                        label="课程状态">
                                </el-table-column>
                                <el-table-column
                                        prop="cLearn" align="center"
                                        label="学习方式">
                                </el-table-column>
                                <el-table-column
                                        prop="cDuration" align="center"
                                        label="课程时长">
                                </el-table-column>
                                <el-table-column
                                        prop="cAudience" align="center"
                                        label="培训受众">
                                </el-table-column>
                                <el-table-column
                                        prop="cCreateUser" align="center"
                                        label="创建人">
                                </el-table-column>
                                <el-table-column
                                        prop="cCreateTime" align="center"
                                        label="创建时间">
                                </el-table-column>

                                <el-table-column label="操作" fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <!--TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空-->
                                        <span v-if="tableDataKey.indexOf(scope.row.cNumber) < 0" class="table-operation"
                                              @click="addCourse([scope.row])">添加</span>
                                        <span v-if="tableDataKey.indexOf(scope.row.cNumber) > -1"
                                              class="table-operation-disable">已添加</span>
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
                                        :current-page.sync="pageNo"
                                        layout="sizes, prev, pager, next, jumper"
                                        :total="total">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="button-container2">
            <el-button class="formSubmit el-btn-min-100" type="success" @click="formSubmit('save')" size="small">保存</el-button>
            <el-button class="formSubmit el-btn-min-100" type="primary" @click="formSubmit('fire')" size="small">发布</el-button>
            <el-button class="el-btn-min-100" @click="$router.back()" size="small">取消</el-button>
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
    import GLOBAL from '@/assets/js/globalVariable.js';


    import draggable from 'vuedraggable'


    export default {
        name: "add",
        components: {
            Treeselect,
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
                GLOBAL: GLOBAL,

                // 标题
                viewTitle: '',
                multipleSelection: [], // 多选状态保存
                tableMultipleSelection: [], //已绑定课程

                // 标识
                operationFlag: 'add',


                addData: {
                    mNumber: '',
                    mName: '',
                    mArea: '',
                    mKnowPath: null,
                    mPositionID: '',
                    mRankID: '',
                    mDes: '',


                },


                // TODO 校验字段待明确
                addRules: {

                    // mName: [{required: true, message: '请输入名称', trigger: 'change'}],
                    // mArea: [{required: true, message: '请选择区域', trigger: 'change'}],
                    // mKnowPath: [{required: true, message: '请选择知识体系', trigger: 'input'}],
                    // mPositionID: [{required: true, message: '请选择岗位', trigger: 'change'}],
                    // mRankID: [{required: true, message: '请选择职级', trigger: 'change'}],
                    // mDes: [{required: true, message: '请输入描述', trigger: 'change'}],


                },

                editData: {},

                //  校验字段
                editRules: {
                    // mName: [{required: true, message: '请输入名称', trigger: 'change'}],
                    // mArea: [{required: true, message: '请选择区域', trigger: 'change'}],
                    // mKnowPath: [{required: true, message: '请选择知识体系', trigger: 'input'}],
                    // mPositionID: [{required: true, message: '请选择岗位', trigger: 'change'}],
                    // mRankID: [{required: true, message: '请选择职级', trigger: 'change'}],
                    // mDes: [{required: true, message: '请输入描述', trigger: 'change'}],
                },


                // formData: this.operationFlag === 'add' ? this.addData : this.editData,
                //
                // formRules: this.operationFlag === 'add' ? this.addRules : this.editRules,


                formData: {
                    // mNumber: '',
                    // mName: '',
                    // mArea: '',
                    // mKnowPath: null,
                    // mPositionID: '',
                    // mRankID: '',
                    // mDes: '',
                },
                formRules: {

                    mName: [
                        {required: true, message: '请输入地图名称', trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    mPositionID: [{required: true, message: '请选择适用岗位', trigger: 'change'}],
                    mRankID: [{required: true, message: '请选择适用职级', trigger: 'change'}],
                    mDes:[
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ]

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


                cTypeAllOptions: {},
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
                pageSize: 5,
                total: 0,


                addIsShow: false, // 新增自定义课程
                customCourseData: {
                    cName: '',
                    cMustCourseKey: '1',
                    cSyllabus: '',
                },
                formRules2:{
                    cName: [
                        {required: true, message: '请输入课程名称', trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    cMustCourseKey:[
                        {required: true, message: '请选择是否必修', trigger: 'blur'},
                    ],
                    cSyllabus:[
                        {required: true, message: '请输入教学大纲', trigger: 'blur'},
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {

            this.operationFlag = this.$route.query.flag;  // flag: 'add' 新增； 'edit' 编辑
            this.loadPreData();
            this.reloadCourseTable(1);

            if (this.operationFlag === 'edit') {

                // 编辑模式，接收从列表页传来的信息
                // this.row = this.$route.query.row;  // 不再使用 改为重新请求


                this.viewTitle = '编辑';
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
                    res.mKnowPath = res.knowledgePath == '' ? null : res.knowledgePath;
                    res.Course = res.cmList;
                    res.studentCount = res.personCount;
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
                    this.formData = this.row;
                    // this.formRules = this.editRules;
                })
            } else {
                // 新增模式
                this.viewTitle = '新增';
                this.formData = this.addData;
                // this.formRules = this.addRules;
            }
        },

        methods: {
            handleChange(val) {
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
                        this.cTypeAllOptions = res.courseType_all;
                        this.cStateAllOptions = res.status_all;
                        this.cLearnAllOptions = res.studyWay_all;

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
                    loading:'.loading-table',
                    noRepeat:'.reloadCourseTable',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    typeId: this.courseFormData.cType,
                    enabled: this.courseFormData.cState,
                    studyModeId: this.courseFormData.cLearnStyle,
                    name: this.courseFormData.cName,
                    createUser: this.courseFormData.cCreateUser,
                    createTimeStart: this.courseFormData.createTime[0].constructor === Date ? this.courseFormData.createTime[0].Format("yyyy-MM-dd hh:mm:ss") : '',
                    createTimeEnd: this.courseFormData.createTime[1].constructor === Date ? this.courseFormData.createTime[1].Format("yyyy-MM-dd hh:mm:ss") : '',

                }).then(res => {
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
                if (val.length === 0) {
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
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
                this.$refs['multipleTable'].clearSelection();
            },
            removeCourse(val) {
                if (val.length === 0) {
                    this.$message({message: '请选择数据后再操作', type: 'warning'});
                    return;
                }
                // TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空
                val.map(i => {
                    let score = this.tableDataKey.indexOf(i.cNumber);
                    this.tableDataKey.splice(score, 1);
                    this.tableData.splice(score, 1);
                })
            },
            addCustomCourse() {
                this.addIsShow = true;

            },

            addCustomCourseSave(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.customCourseData.cMustCourse = this.customCourseData.cMustCourseKey === '1';
                        this.customCourseData.cNumber = this.getRandomKey();
                        this.customCourseData.cID = this.customCourseData.cNumber;
                        let temData = this.customCourseData;
                        this.addCourse([temData, ]);
                        this.customCourseData = {
                            cName: '',
                            cMustCourseKey: '1',
                            cSyllabus: '',
                        };
                        this.addIsShow = false;
                    }
                });
            },
            mustChange(val){
                this.$forceUpdate()
            },
            getRandomKey() { // 流水号
                const now = new Date();
                let month = now.getMonth() + 1;
                let day = now.getDate();
                let hour = now.getHours();
                let minutes = now.getMinutes();
                let seconds = now.getSeconds();
                month = this.setTimeDateFmt(month);
                hour = this.setTimeDateFmt(hour);
                minutes = this.setTimeDateFmt(minutes);
                seconds = this.setTimeDateFmt(seconds);
                return now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.floor(Math.random() * 1000)).toString();
            },
            setTimeDateFmt(res){
                if(res <= 10){
                    return '0'+res;
                }else{
                    return res;
                }
            },
            endDrag() {
                this.drag = false;
                this.tableDataKey = this.tableData.map(i => i.cNumber);
                // TODO 暂时改为用课程编号做key，要求课程编号唯一且不为空
            },


            formSubmit(val) {


                this.$refs['operationForm'].validate((valid) => {
                    if (valid) {
                        try {


                            this.tableData.map((item, i) => {
                                item.courseOrder = i;
                                item.id = item.cID;
                                item.courseId = item.cNumber;
                                item.courseType = item.cMustCourse;
                                item.courseName = item.cName;
                                item.courseDescribe = item.cSyllabus;

                            });
                            switch (this.operationFlag) {
                                case 'add':

                                    axiosPost(API.MAP_ADD, {
                                        noRepeat:'.formSubmit',
                                        mapName: this.formData.mName,
                                        area: this.dictMap[this.formData.mAreaID],
                                        areaId: this.formData.mAreaID,
                                        knowledgePath: this.formData.mKnowPath,
                                        knowledgeId: this.formData.mKnowPath ? this.formData.mKnowPath.split('/').pop() : '',
                                        positionId: this.formData.mPositionID,
                                        position: this.formData.mPosition,
                                        stationId: this.formData.mRankID,
                                        station: this.formData.mRank,
                                        mapIntroduce: this.formData.mDes,

                                        // 与后端约定，字典中第0个是已发布，第1个是待发布
                                        mapStatus: val === 'save' ? this.dictData.isPubed[1]['id'] : this.dictData.isPubed[0]['id'],
                                        // 字典配好后替换
                                        // mapStatus: '0',
                                        cmList: this.tableData,

                                    }).then(() => {
                                        this.$router.back();
                                    });
                                    break;

                                case 'edit':
                                    axiosPost(API.MAP_EDIT, {
                                        noRepeat:'.formSubmit',
                                        id: this.mID,  // TODO 主键
                                        mapId: this.mNumber,// TODO 编号
                                        mapName: this.formData.mName,
                                        area: this.dictMap[this.formData.mAreaID],
                                        areaId: this.formData.mAreaID,
                                        knowledgePath: this.formData.mKnowPath,
                                        knowledgeId: this.formData.mKnowPath ? this.formData.mKnowPath.split('/').pop() : '',
                                        positionId: this.formData.mPositionID,
                                        position: this.formData.mPosition,
                                        stationId: this.formData.mRankID,
                                        station: this.formData.mRank,
                                        mapIntroduce: this.formData.mDes,

                                        // 与后端约定，字典中第0个是已发布，第1个是待发布
                                        mapStatus: val === 'save' ? this.dictData.isPubed[1]['id'] : this.dictData.isPubed[0]['id'],
                                        // 字典配好后替换
                                        // mapStatus: '0',
                                        cmList: this.tableData

                                    }).then(() => {
                                        this.$router.back();
                                    });
                                    break;
                                default:
                                    break;
                            }

                        } catch (e) {
                        }

                    }
                })


            },

            handleSelectionChange(val) { // 多选框点击
                this.multipleSelection = val;
            },


            handleSizeChange(val) {
                this.pageSize = val;
                this.reloadCourseTable(1);
            },
            handleCurrentChange(val) {
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

    /* type=textarea 样式 */
    .search-container >>> .el-textarea{
        width: 160px;
    }
    .search-container >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
    .button-container2{
        margin-top: 10px;
        text-align: center;
    }

</style>
