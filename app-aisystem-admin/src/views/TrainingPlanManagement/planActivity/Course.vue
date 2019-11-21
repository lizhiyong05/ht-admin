<template>
    <div class="activityPlan-box">
        <el-button :disabled="isShare" size="mini" @click="btnGetCourse">获取课程</el-button>
        <div class="loading-course-1">
            <el-table
                size="mini"
                :data="tableData.records"
                cell-class-name="cellName"
                header-cell-class-name="headerCellName"
                stripe>
                    <el-table-column
                        align="center"
                        label="课程编号">
                            <template slot-scope="scope">
                                <span @click="editInfo(scope.row.courseId, 1)">{{scope.row.code}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="课程名称">
                    </el-table-column>
                    <el-table-column
                        prop="studyMode"
                        align="center"
                        label="授课形式">
                    </el-table-column>
                    <el-table-column
                        prop="duration"
                        align="center"
                        label="课程时长">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="计划日期">
                            <template slot-scope="scope">
                                {{scope.row.startTime}} - {{scope.row.endTime}}
                            </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="250"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button :disabled="isShare" type="text" size="mini" v-if="operationData.includes('eb87d525')" @click="setting(scope.row.id,scope.row.studyMode)">设置</el-button>
                            <el-button :disabled="isShare" v-if="scope.row.sort != 1" type="text" size="mini" @click="move(scope.row.id, true)">上移</el-button>
                            <el-button :disabled="isShare" v-if="scope.row.sort != tableData.total" type="text" size="mini" @click="move(scope.row.id, false)">下移</el-button>
                            <el-button :disabled="isShare" type="text" size="mini" v-if="operationData.includes('d56b1050')" @click="editInfo(scope.row.courseId, 2)">编辑</el-button>
                            <el-button :disabled="isShare" type="text" size="mini" v-if="operationData.includes('a8d936a0')" @click="btnRemove(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="handleCurrentChange2"
                :current-page.sync="courSearch.pageNo"
                @size-change="handleSizeChange2"
                :page-sizes="[5, 10, 15, 20,50]"
                :page-size="courSearch.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
            </el-pagination>
        </div>
        <el-dialog
            :show-close="false"
            :visible.sync="courseVisible"
            width="1200px">
            <p slot="title" class="module-title">获取课程</p>
            <el-form size="small" :inline="true" :model="searchData" label-width="100px">
                <el-form-item label="课程分类">
                    <treeselect   v-model="searchData.knowledgeId"
                                  :options="knowAllData"
                                  placeholder="请选择课程类型"
                                  noResultsText="未找到，请重新输入"
                                  :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="课程类型">
                    <el-select v-model="searchData.typeId" placeholder="请选择课程类型">
                        <el-option v-for="(item,ind) in dictionariesAllData['courseType_all']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="课程状态">
                    <el-select v-model="searchData.enabled" placeholder="请选择课程状态">
                        <el-option v-for="(item,ind) in dictionariesAllData['status_all']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="学习方式">
                    <el-select v-model="searchData.studyModeId" placeholder="请选择学习方式">
                        <el-option v-for="(item,ind) in dictionariesAllData['studyWay_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-input v-model="searchData.name" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="创建人">
                    <el-input v-model="searchData.createUser" placeholder="请输入创建人"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="searchData.createTime"
                        prefix-icon="el-icon-date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button size="mini" class="btn-repeat-click2" type="primary" @click="searchList">查 询</el-button>
                <el-button size="mini" @click="resetSearchCondition">重 置</el-button>
            </div>
            <div v-loading="loading">
                <el-table
                    size="mini"
                    :data="tableCourse.records"
                    cell-class-name="cellName"
                    @selection-change="handleSelectionChange"
                    header-cell-class-name="headerCellName"
                    stripe>
                        <el-table-column
                            type="selection"
                            align="center"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="code"
                            align="center"
                            label="课程编号">
                        </el-table-column>
                        <el-table-column
                            prop="knowledgePath"
                            align="center"
                            label="课程分类">
                        </el-table-column>
                        <el-table-column
                            prop="type"
                            align="center"
                            label="课程类型">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            align="center"
                            label="课程名称">
                        </el-table-column>
                        <!-- <el-table-column
                            align="center"
                            width="90"
                            label="课程状态">
                                <template slot-scope="scope">
                                    <em>{{scope.row.enabled ? '启用' : '停用'}}</em>
                                </template>
                        </el-table-column> -->
                        <el-table-column
                            prop="duration"
                            align="center"
                            label="课程时长">
                        </el-table-column>
                        <el-table-column
                            prop="studyMode"
                            align="center"
                            width="90"
                            label="学习方式">
                        </el-table-column>
                        <el-table-column
                            prop="audience"
                            align="center"
                            label="培训受众">
                        </el-table-column>
                        <el-table-column
                            prop="createUser"
                            align="center"
                            label="创建人">
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            align="center"
                            label="创建时间">
                        </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page.sync="searchData.pageNo"
                    @size-change="handleSizeChange"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableCourse.total">
                </el-pagination>
            </div>
            <div class="btn-box">
                <el-button :disabled="isShare" size="mini" class="btn-repeat-click3" type="primary" @click="courseOk">确定</el-button>
                <el-button size="mini" @click="courseVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :show-close="false"
            @close="settingClose"
            :visible.sync="settingVisible"
            width="770px">
            <p slot="title" class="module-title">设置</p>
            <el-form :model="form" size="small" :rules="rules" label-width="120px" inline ref="ruleForm" >
                <el-form-item label="讲师设置" prop="lecturerId">
                    <el-select v-model="form.lecturerId" placeholder="请选择讲师">
                        <el-option
                            v-for="item in teacher"
                            :key="item.lecturerId"
                            :label="item.lecturerName" :disabled="item.disabled"
                            :value="item.lecturerId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划日期" prop="time">
                    <el-date-picker
                        :editable="false"
                        prefix-icon="el-icon-date"
                        v-model="form.time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="直播密码" v-if="studyMode == '直播'" prop="livePwd">
                    <el-input v-model="form.livePwd" placeholder="请输入直播密码"></el-input>
                </el-form-item>
                <el-form-item v-if="studyMode == '直播'" label="房间容量" prop="liveNum">
                    <el-input v-model="form.liveNum" placeholder="请输入房间容量"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button :disabled="isShare" size="mini" class="no-repeat-click1" type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button size="mini" @click="settingVisible = false;">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    axiosPost,
    getDictionariesAllData,
    getKnowAllData,
    getMapNameData,
    getOperationData,
    getDictionariesNameData
} from "@/assets/js/api";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import axios from 'axios';
export default {
    name: 'course',
    components: {
        Treeselect
    },
    data() {
        var numValidate = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入房间容量'));
            } else {
                if (/^(0?|[1-9][0-9]*)$/.test(value)) {
                    if(Number(value) > 9999) {
                        callback('请输入小于9999的数字');
                    }else {
                        callback();
                    }
                } else {
                    callback('请输入数字');
                }
            } 
        };
        return {
            loading: false,
            operationData: [],
            tableData: {},
            courseVisible: false,
            settingVisible: false,
            searchData: {
                pageNo: 1,
                pageSize: 5,
            },
            courSearch: {
                pageNo: 1,
                pageSize: 5,
            },
            dictionariesAllData: [],
            knowAllData: [],
            mapNameData: [],
            dictionariesNameData: [],
            tableCourse: {},
            courseSelected: [],
            studyMode: '',
            form: {
                time: []
            },
            rules: {
                liveNum: [
                    { validator: numValidate, trigger: 'blur' }
                ],
                time: [
                    { type: 'array', required: true, message: '请选择计划日期', trigger: 'change' }
                ],
                livePwd: [
                    { required: true, message: '请输入直播密码', trigger: 'blur' },
                    { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                ],
                lecturerId: [
                    { required: true, message: '请选择讲师', trigger: 'blur' }
                ],
            },
            teacher: [],
            isShare: false,
        }
    },
    computed: {
        planId() {
            return this.$route.query.id;
        }
    },
    created() {
        this.getList();
        getDictionariesAllData().then(res => {
            // courseType_all：课程类型 studyWay_all：学习方式 status_all：课程状态
            this.dictionariesAllData = res;
        });
        getKnowAllData().then(res => {
            // 知识体系
            this.knowAllData = res;
        });
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getDictionariesNameData().then(res => {
            this.dictionariesNameData = res;
        })
        getOperationData('培训计划管理').then(res => {
            this.operationData = res;
        });
        this.isShare = this.$route.query.isShare === true || this.$route.query.isShare === 'true';
    },
    methods: {
        getTeacherList(id) {
            axiosPost('/educateMgr/plan/course/lecturer',{id: id}).then(res => {
                if(res.code == 1000) {
                    this.teacher = res.data;
                }
            })
        },
        getList() {
            this.courSearch.planId = this.planId;
            this.courSearch.loading = '.loading-course-1';
            axiosPost('/educateMgr/plan/course/list', this.courSearch).then(res => {
                if(res.code == 1000) {
                    this.tableData = res.data;
                }
            })
        },
        editInfo(id, type) {
            if(type == 1) {
                this.$router.push({path: 'detail-course', query: {id: id}});
            }else {
                this.$router.push({
                    name: 'add-course',
                    query: {
                        id: id,
                        planId: this.planId
                    }
                })
            }
        },
        setting(id, studyMode) {
            this.studyMode = studyMode;
            this.settingVisible = true;
            this.getTeacherList(id);
            axiosPost('/educateMgr/plan/course/info',{id: id}).then(res => {
                if(res.code == 1000) {
                    res.data.time = []
                    this.form = res.data; 
                    if(res.data.startTime) {
                        this.form.time.push(res.data.startTime)
                        this.form.time.push(res.data.endTime)
                    }
                }
            })
        },
        settingClose() {
            this.$refs['ruleForm'].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.save();
                } else {
                    return false;
                }
            });
        },
        save() {
            this.form.planId = this.planId;
            this.form.startTime = this.form.time[0];
            this.form.endTime = this.form.time[1];
            this.teacher.forEach(item => {
                if(item.lecturerId == this.form.lecturerId) {
                    this.form.lecturerName = item.lecturerName;
                }
            })
            this.form.noRepeat = '.no-repeat-click1';
            axiosPost('/educateMgr/plan/course/set',this.form).then(res => {
                if(res.code == 1000) {
                    this.reset();
                    this.getList();
                    this.settingVisible = false;
                }
            })
        },
        reset() {
            this.courSearch.pageNo = 1;
        },
        move(id, up) {
            let params = {
                id: id,
                up: up
            }
            axiosPost('/educateMgr/plan/course/move',params).then(res => {
                if(res.code == 1000) {
                    this.reset();
                    this.getList();
                }
            })
        },
        btnRemove(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.remove(id);
            }).catch(() => {   

            });
        },
        remove(id) {
            axiosPost('/educateMgr/plan/course/remove',{id: id}).then(res => {
                if(res.code == 1000) {
                    this.reset();
                    this.getList();
                }
            })
        },
        normalizer(node) { // 知识体系树
            return {
                id: node.id,
                label: node.knowName,
                children: node.children,
            }
        },
        searchList(){ // 搜索
            this.searchData.pageNo = 1;
            this.getCourseList();
        },
        resetSearchCondition(){ // 重置
            var obj = this.searchData;
            this.searchData = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            };
        },
        handleCurrentChange(res){ // 更改页数
            this.searchData.pageNo = res;
            this.getCourseList();
        },
        handleSizeChange(res){ // 更改条数
            this.searchData.pageNo = 1;
            this.searchData.pageSize = res;
            this.getCourseList();
        },
        handleCurrentChange2(res){ // 更改页数
            this.courSearch.pageNo = res;
            this.getList();
        },
        handleSizeChange2(res){ // 更改条数
            this.courSearch.pageNo = 1;
            this.courSearch.pageSize = res;
            this.getList();
        },
        btnGetCourse() {
            this.courseVisible = true;
            this.tableCourse = {};
            this.courseSelected = [];
            this.resetSearchCondition();
            this.searchList();
        },
        handleSelectionChange(val) {
            this.courseSelected = [];
            val.forEach(item => {
                this.courseSelected.push(item.id)
            })
        },
        courseOk() {
            if(this.courseSelected.length == 0) {
                this.$message.error('请至少选择一门课程');
                return;
            }
            let params = {
                planId: this.planId,
                ids: this.courseSelected,
                noRepeat: '.btn-repeat-click3',
            }
            axiosPost('/educateMgr/plan/course/save',params).then(res => {
                if(res.code == 1000) {
                    this.courseVisible = false;
                    this.reset();
                    this.getList();
                }
            })
        },
        getCourseList() {
            this.searchData.createTimeStart = this.searchData.createTime ? this.searchData.createTime[0] : '';
            this.searchData.createTimeEnd = this.searchData.createTime ? this.searchData.createTime[1] : '';
            this.searchData.planId = this.planId;
            this.loading = true;
            this.searchData.noRepeat = '.btn-repeat-click2'
            axiosPost('/educateMgr/plan/course/sources',this.searchData).then(res => {
                this.loading = false;
                this.tableCourse = res.data;
            }).catch(() => {
                this.loading = false;
            })
        },
    }
}
</script>

<style scoped>
</style>