<template><!-- 课程授权 dongjie.zhu -->
    <div class="lectureCourseSave-selection">
        <el-dialog :visible.sync="lecturerCourseSaveIsShowCopy" width="1100px" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeRemodal">
            <p slot="title" class="module-title need-header">课程授权  <span>[讲师：{{lecturerName}}]</span> </p>
            <div class="search-container clearfix">
                <el-form :inline="true" size="small" :model="searchData" class="demo-form-inline" label-width="100px">
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
                            <el-option v-for="(item,ind) in dictionariesAllData['courseType_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程状态" v-show="false" >
                        <el-select v-model="searchData.enabled" placeholder="请选择课程状态">
                            <el-option v-for="(item,ind) in dictionariesAllData['status_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
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
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="button-container-course">
                    <el-button class="queryList el-btn-min-100" size="mini" type="primary" @click="queryList">查询</el-button>
                    <el-button class="el-btn-min-100" size="mini" style="margin-left: 30px;" @click="reset">重置</el-button>
                </div>
            </div>
            <div class="map-table loading-table2">
                <el-table :data="records" border style="width: 100%" size="mini"  @selection-change ="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="40px"> </el-table-column>
                    <el-table-column prop="code" align="center" label="课程编号" width="150px"> </el-table-column>
                    <el-table-column prop="knowledgePath" align="center" label="课程分类" width="100px"> </el-table-column>
                    <el-table-column prop="type" align="center" label="课程类型" width="100px"> </el-table-column>
                    <el-table-column prop="name" align="center" label="课程名称"> </el-table-column>
                    <el-table-column prop="enabled" align="center" label="课程状态" width="80px">
                        <template slot-scope="scope">
                            <em v-if="scope.row.enabled === true">启用</em>
                            <em v-else>停用</em>
                        </template>
                    </el-table-column>
                    <el-table-column prop="studyMode" align="center" label="学习方式" width="80px"></el-table-column>
                    <el-table-column prop="duration" align="center" label="课程时长" width="80px"> </el-table-column>
                    <el-table-column prop="audience" align="center" label="培训受众"></el-table-column>
                    <el-table-column prop="createUser" align="center" label="创建人" width="70px"></el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{recordsTotal}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20, 50]"
                            :page-size="5"
                            layout="sizes, prev, pager, next, jumper"
                            :total="recordsTotal"
                            :current-page.sync="pageNo">
                    </el-pagination>
                </div>
            </div>
            <div class="btn-box" slot="footer" >
                <el-button class="saveCourseDataFun el-btn-min-100" size="mini" type="primary" @click="saveCourseDataFun(multipleSelection.map((i) => i.id))">确定</el-button>
                <el-button class="el-btn-min-100" size="mini" style="margin-left: 30px;" @click="lecturerCourseSaveIsShowCopy = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {axiosPost,getKnowAllData,getDictionariesAllData } from '@/assets/js/api'
    export default {
        name: 'LectureCourseSave',
        components:{
            Treeselect
        },
        props:['lecturerCourseSaveIsShow','interfaceUrl','lecturerId','lecturerName','addOrEditFlag'],
        data(){
            return {
                lecturerCourseSaveIsShowCopy: this.lecturerCourseSaveIsShow, // 复制props 里面的数据
                knowAllData: [], // 获取知识体系字典项数据
                dictionariesAllData: [], // 获取基本类型字典项数据
                searchData: { // 搜索课程数据
                    knowledgeId: null,
                    typeId: '',
                    enabled: '',
                    studyModeId: '',
                    name: '',
                    createUser: '',
                    createTime: null,
                },
                records: [],//表格数据列表
                recordsTotal: 0, // 表格数据的条数
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                multipleSelection:[], // 表格选择后的数据
            }
        },
        created(){
            getKnowAllData().then(res => {
                // 知识体系
                this.knowAllData = res;
            });
            getDictionariesAllData().then(res => {
                // courseType_all：课程类型 studyWay_all：学习方式 status_all：课程状态
                this.dictionariesAllData = res;
            });
            this.getList(this.pageNo,this.pageSize,this.searchData.knowledgeId,this.searchData.typeId,this.searchData.enabled,this.searchData.studyModeId,this.searchData.name,this.searchData.createUser,this.searchData.createTime);
        },
        methods:{
            normalizer(node) { // 知识体系树
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },
            getList(pageNo,pageSize,knowledgeId,typeId,enabled,studyModeId,name,createUser,createTime){ //获取列表
                axiosPost( this.interfaceUrl,{ //讲师未授权课程查询
                    loading:'.loading-table2',
                    noRepeat:'.queryList',
                    lecturerId: this.lecturerId,
                    knowledgeId: knowledgeId,
                    typeId: typeId,
                    enabled: enabled,
                    studyModeId: studyModeId,
                    name: name,
                    createUser: createUser,
                    createTimeStart: createTime !== null ? createTime[0] : '', //创建开始日期
                    createTimeEnd: createTime !== null ? createTime[1] : '', //创建结束日期
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            queryList(){ // 通过查询条件获取列表内容
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.knowledgeId,this.searchData.typeId,this.searchData.enabled,this.searchData.studyModeId,this.searchData.name,this.searchData.createUser,this.searchData.createTime);
            },
            reset(){ // 重置
                this.searchData.knowledgeId = null;
                this.searchData.typeId = '';
                this.searchData.enabled = '';
                this.searchData.studyModeId = '';
                this.searchData.name = '';
                this.searchData.createUser = '';
                this.searchData.createTime = null;
            },
            handleSizeChange(res) { //每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.knowledgeId,this.searchData.typeId,this.searchData.enabled,this.searchData.studyModeId,this.searchData.name,this.searchData.createUser,this.searchData.createTime);
            },
            handleCurrentChange(res) { //第几页
                this.pageNo = res;
                this.getList(this.pageNo,this.pageSize,this.searchData.knowledgeId,this.searchData.typeId,this.searchData.enabled,this.searchData.studyModeId,this.searchData.name,this.searchData.createUser,this.searchData.createTime);
            },
            handleSelectionChange(res){ // 表格选择更改
                this.multipleSelection = res;
            },
            saveCourseDataFun(idArr){ // 返回数据
                if (idArr.length === 0) {
                    this.$message({message:'请至少选择一条数据',type: 'warning'});
                    return;
                }
                axiosPost('/educateMgr/lecturer/course/save',{ //讲师授权课程接口
                    noRepeat:'.saveCourseDataFun',
                    lecturerId: this.lecturerId,
                    lecturerName: this.lecturerName !== '' ? this.lecturerName: '',
                    courses: idArr,
                }).then(res => {
                    if(res.code == '1000') {
                        this.lecturerCourseSaveIsShowCopy = false;
                        this.messageAlert("授权成功！");
                        this.$emit('listenEventData',this.addOrEditFlag);
                    }
                });
            },
            closeRemodal(){   //关闭弹框返回
                this.$emit('listenEventClose',this.lecturerCourseSaveIsShowCopy);
            },
            messageAlert(message){
                this.$message({message: message,type: 'success'});
            },
        }
    }
</script>

<style scoped lang="scss">
    .button-container-course {
        text-align: center;
        margin-bottom: 20px;
        button {
            width: 80px;
        }
    }
    .btn-box {
        text-align: center;
        button {
            width: 80px;
        }
    }
    .vue-treeselect{
        width: 202px;
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
    .module-title {
        border-left: 4px solid #409EFF;
        padding-left: 10px;
        font-size: 22px;
        line-height: 20px;
    }
    .module-title span{
        padding-left: 5px;
        font-size: 18px;
        color: #409EFF;
        line-height: 20px;
    }

</style>
