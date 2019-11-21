<!--@menu 讲师管理 @author dongjie.zhu-->
<template>
    <div class="lecturerManagement">
        <h2 class="title-h2">讲师管理</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="searchData" label-width="100px" >
                <el-form-item label="区域">
                    <el-select v-model="searchData.area" placeholder="请选择区域">
                        <el-option
                                v-for="item in dictionariesAllData['area_all']"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属机构">
                    <treeselect 
                        v-model="searchData.orgId" 
                        placeholder="请选择所属机构"
                        :options="orgData"
                        class="treeInline2"
                        noResultsText="未找到，请重新输入"/>
                </el-form-item>
                <el-form-item label="职级">
                    <el-select v-model="searchData.userRank" filterable placeholder="请选择">
                        <el-option
                            v-for="item in userRankDataAll"
                            :key="item.id"
                            :value="item.id"
                            :label="item.dicName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="讲师类别">
                    <el-select v-model="searchData.workTime" filterable placeholder="请选择">
                        <el-option
                            v-for="item in workTimeDataAll"
                            :key="item.id"
                            :value="item.id"
                            :label="item.dicName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="讲师姓名">
                    <el-input v-model="searchData.userName" placeholder="请输入" ></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" class="queryList el-btn-min-100" type="primary" @click="queryList">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="map-list">
            <div class="map-button ">
                <el-button v-if="perLoaded ? PERMISSIONS.LECTURER.ADD : false" size="small" @click="addDataFun">新增</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.LECTURER.LEAVE : false" size="small" @click="leaveFun(multipleSelection.map((i) => i.userId))">离职</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.LECTURER.ENTRY : false" size="small" @click="entryFun(multipleSelection.map((i) => i.userId))">入职</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.LECTURER.DELETE : false" size="small" @click="deleteFun(multipleSelection.map((i) => i.userId))">删除</el-button>
<!--                <el-button v-if="perLoaded ? PERMISSIONS.LECTURER.REVERT : false" size="small" @click="revertFun(multipleSelection.map((i) => i.userId))">恢复</el-button>-->
            </div>
            <div class="map-table loading-table">
                <el-table :data="records" size="mini" border style="width: 100%"  @selection-change ="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="40px"> </el-table-column>
                    <el-table-column align="center" label="讲师编号" width="160px">
                        <template slot-scope="scope" align="center">
                            <span class="table-operation"  @click="detailFun(scope.row)">{{scope.row.number}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userName" align="center" label="讲师姓名"> </el-table-column>
                    <el-table-column prop="orgId" align="center" label="所属机构" width="160px">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{(scope.row.orgId !== '' && scope.row.orgId !== null) ? orgNameData[scope.row.orgId].orgName : ''}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userRank" align="center" label="职级">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.userRank]}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="authentication" align="center" label="认证状态">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.authentication]}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="workAge" align="center" label="工龄"> </el-table-column>
                    <el-table-column prop="workTime" align="center" label="讲师类别">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.workTime]}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="onJob" align="center" label="状态">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.onJob]}} </span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="deleted" align="center" label="讲师标识">-->
<!--                        <template slot-scope="scope">-->
<!--                            <span class="table-dicFront">{{dictionariesNameData[scope.row.deleted]}} </span>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span v-if="perLoaded ? PERMISSIONS.LECTURER.EDIT : false" class="table-operation" @click="editDataFun(scope.row)">编辑</span>
                        </template>
                    </el-table-column>
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
        </div>
        <!-- 新增讲师信息 -->
        <el-dialog class="need-header" title = "新增讲师" :visible.sync="addIsShow" @close="close('addForm')"  width="800px">
            <div class="add-form">
                <el-form :model="addData" size="small" :inline="true" :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" >
                    <el-form-item label="用户姓名" prop="userName" style="margin-right: 10px">
                        <el-input v-model="addData.userName" placeholder="请输入姓名" class="el-input-width" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <span class="btn-buttonUser" @click="selectPersonnel">机构用户</span>
                    <el-form-item label="用户ID" prop="userId" v-show="false">
                        <el-input v-model="addData.userId" placeholder="自动生成用户ID" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNo">
                        <el-input v-model="addData.idNo" placeholder="请输入身份证号" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="addData.mobile" placeholder="请输入手机号码" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="email">
                        <el-input v-model="addData.email" placeholder="请输入邮箱地址" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="登录帐号" prop="userAccount">
                        <el-input v-model="addData.userAccount" placeholder="请输入登录帐号" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" prop="orgId" >
                        <treeselect v-model="addData.orgId" placeholder="请选择所属机构"
                                    :options="orgData"
                                    class="treeInline"
                                    noResultsText="未找到，请重新输入"
                                    @input="changeTree('addForm')"
                                    :disabled="isDisabled"
                        />
                    </el-form-item>
                    <el-form-item label="职级" prop="userRank">
                        <el-select v-model="addData.userRank" placeholder="请选择职级" :disabled="isDisabled">
                            <el-option
                                    v-for="item in userRankData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>
<!--                    <el-form-item label="区域" prop="area">-->
<!--                        <el-select v-model="addData.area" placeholder="请选择区域" :disabled="isDisabled">-->
<!--                            <el-option-->
<!--                                    v-for="item in this.dictionariesAllData['area']"-->
<!--                                    :key="item.id"-->
<!--                                    :value="item.id"-->
<!--                                    :label="item.dicName">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <div class="horizontal-line"></div>
                    <el-form-item label="讲师编号" prop="number" v-show="false">
                        <el-input v-model="addData.number" placeholder="讲师编号自动生成" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="星级" prop="level">
                        <el-select v-model="addData.level" placeholder="请选择星级">
                            <el-option
                                    v-for="item in levelData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="擅长课程" prop="skilled">
                        <el-input v-model="addData.skilled" placeholder="请输入擅长课程"></el-input>
                    </el-form-item>
                    <el-form-item label="奖励荣誉" prop="honor">
                        <el-input v-model="addData.honor" placeholder="请输入奖励荣誉"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师类别" prop="workTime">
                        <el-select v-model="addData.workTime" placeholder="请选择讲师类别" @change="changeWorkTime(addData.workTime)">
                            <el-option
                                    v-for="item in workTimeData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <span v-show="fullTimeContentIsShow">
                        <el-form-item label="入职日期" prop="entryTime" >
                            <el-date-picker v-model="addData.entryTime" placeholder="请选择入职日期" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
                        </el-form-item>
                    </span>
                    <span v-show="partTimeContentIsShow">
                         <el-form-item label="课时费" prop="cost">
                            <el-input v-model="addData.cost" :maxlength="4" placeholder="请输入课时费"></el-input>
                         </el-form-item>
                         <el-form-item label="认证状态" prop="authentication">
                            <el-select v-model="addData.authentication" placeholder="请选择认证状态">
                                <el-option
                                        v-for="item in authenticationData"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.dicName">
                                </el-option>
                            </el-select>
                         </el-form-item>
                         <el-form-item label="任命期限" prop="dateLine">
                            <el-date-picker
                                    v-model="addData.dateLine"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                         </el-form-item>
                    </span>
                    <!--<el-form-item label="讲师状态" prop="onJob">
                        <el-select v-model="addData.onJob" placeholder="请选择讲师状态">
                            <el-option
                                    v-for="item in onJobData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="备注" prop="userDesc" class="width100">
                        <el-input v-model="addData.userDesc" placeholder="请输入备注"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 5}"
                                  class="textarea-input"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="cancelOperation()">取消</el-button>
                <el-button size="small" class="addSubmitForm el-btn-min-100" type="primary" @click="addSubmitForm('addForm')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 编辑讲师信息 -->
        <el-dialog class="need-header" title = "基本信息" :visible.sync="editIsShow" @close="close('editForm')" width="800px">
            <div class="edit-form">
                <el-form :model="editData" size="small" :inline="true" :rules="rules" ref="editForm" label-width="130px" class="demo-ruleForm">
                    <el-form-item label="用户姓名" prop="userName">
                        <el-input v-model="editData.userName" placeholder="请输入用户姓名" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="用户ID" prop="userId" v-show="false">
                        <el-input v-model="editData.userId" placeholder="自动生成用户ID" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNo">
                        <el-input v-model="editData.idNo" placeholder="请输入身份证号" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="editData.mobile" placeholder="请输入手机号码" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="email">
                        <el-input v-model="editData.email" placeholder="请输入邮箱地址" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="登录帐号" prop="userAccount">
                        <el-input v-model="editData.userAccount" placeholder="请输入登录帐号" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" >
                        <treeselect v-model="editData.orgId" placeholder="请选择所属机构"
                                    :options="orgData"
                                    class="treeInline"
                                    @input="changeTree('editForm')"
                                    noResultsText="未找到，请重新输入"
                                    :disabled="true"
                        />
                    </el-form-item>
                    <el-form-item label="职级">
                        <el-select v-model="editData.userRank" placeholder="请选择职级" :disabled="true">
                            <el-option
                                    v-for="item in userRankData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>
<!--                    <el-form-item label="区域" prop="area">-->
<!--                        <el-select v-model="editData.area" placeholder="请选择区域" :disabled="true">-->
<!--                            <el-option-->
<!--                                    v-for="item in this.dictionariesAllData['area']"-->
<!--                                    :key="item.id"-->
<!--                                    :value="item.id"-->
<!--                                    :label="item.dicName">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <div class="horizontal-line"></div>
                    <el-form-item label="讲师编号" prop="number">
                        <el-input v-model="editData.number" placeholder="请输入讲师编号" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="星级" prop="level">
                        <el-select v-model="editData.level" placeholder="请选择星级">
                            <el-option
                                    v-for="item in levelData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="擅长课程" prop="skilled">
                        <el-input v-model="editData.skilled" placeholder="请输入擅长课程"></el-input>
                    </el-form-item>
                    <el-form-item label="奖励荣誉" prop="honor">
                        <el-input v-model="editData.honor" placeholder="请输入奖励荣誉"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师类别" prop="workTime" >
                        <el-select v-model="editData.workTime" placeholder="请选择讲师类别" @change="changeWorkTime(editData.workTime)">
                            <el-option
                                    v-for="item in workTimeData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <span v-show="fullTimeContentIsShow">
                        <el-form-item label="入职日期" prop="entryTime" v-if="fullTimeContentIsShow">
                            <el-date-picker v-model="editData.entryTime" placeholder="请选择入职日期" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
                        </el-form-item>
                    </span>
                    <span v-show="partTimeContentIsShow">
                        <el-form-item label="课时费" prop="cost">
                            <el-input v-model="editData.cost" :maxlength="4" placeholder="请输入课时费"></el-input>
                        </el-form-item>
                        <el-form-item label="认证状态" prop="authentication">
                            <el-select v-model="editData.authentication" placeholder="请选择认证状态">
                                <el-option
                                        v-for="item in authenticationData"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.dicName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任命期限" prop="dateLine">
                            <el-date-picker
                                    v-model="editData.dateLine"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                    </span>
                    <!--<el-form-item label="讲师状态" prop="onJob">
                        <el-select v-model="editData.onJob" placeholder="请选择讲师状态">
                            <el-option
                                    v-for="item in onJobData"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="备注" prop="userDesc" class="width100">
                        <el-input v-model="editData.userDesc" placeholder="请输入备注"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 5}"
                                  class="textarea-input"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer edit-footer">
                <el-button size="small" class="el-btn-min-100" @click="cancelOperation">取消</el-button>
                <el-button size="small" class="editSubmitForm el-btn-min-100" type="primary" @click="editSubmitForm('editForm')">保存</el-button>
            </div>
            <h3 class="title-h3">授课管理</h3>
            <div class="border-card">
                <el-tabs type="border-card">
                    <el-tab-pane label="已授权课程">
                        <div>
                            <span v-if="perLoaded ? PERMISSIONS.LECTURER.UNAUTH : false" class="btn-button-Css" @click="removeFun(multipleSelectionPermit.map((i) => i.id))">撤销授权</span>
                            <span v-if="perLoaded ? PERMISSIONS.LECTURER.AUTH : false" class="btn-button-Css" @click="saveFun">课程授权</span>
                        </div>
                        <div class="permit-table loading-table3">
                            <el-table :data="recordsPermit" size="mini" border style="width: 100%"  @selection-change ="handleSelectionChangePermit">
                                <el-table-column type="selection" align="center" width="40px" > </el-table-column>
                                <el-table-column prop="code" align="center" label="课程编号" width="150px"> </el-table-column>
                                <el-table-column prop="knowledgePath" align="center" label="课程分类" width="100px"> </el-table-column>
                                <el-table-column prop="type" align="center" label="课程类型" width="100px" > </el-table-column>
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
                            </el-table>
                            <div class="pagination">
                                <span>共 <span class="total">{{recordsTotalPermit}}</span> 条数据</span>
                                <el-pagination
                                        @size-change="handleSizeChangePermit"
                                        @current-change="handleCurrentChangePermit"
                                        :page-sizes="[5, 10, 15, 20]"
                                        :page-size="5"
                                        layout="sizes, prev, pager, next, jumper"
                                        :total="recordsTotalPermit"
                                        :current-page.sync="pageNoPermit">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="授课历史">
                        <div class="permit-history-table loading-table4">
                            <el-table :data="recordsPermitHistory" size="mini" border style="width: 100%" >
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
                            </el-table>
                            <div class="pagination">
                                <span>共 <span class="total">{{recordsTotalPermitHistory}}</span> 条数据</span>
                                <el-pagination
                                        @size-change="handleSizeChangePermitHistory"
                                        @current-change="handleCurrentChangePermitHistory"
                                        :page-sizes="[5, 10, 15, 20]"
                                        :page-size="5"
                                        layout="sizes, prev, pager, next, jumper"
                                        :total="recordsTotalPermitHistory"
                                        :current-page.sync="pageNoPermitHistory">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
        <!-- 离职 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="leaveIsShow" :close-on-click-modal="false" >
            <div class="dialog-container">
                <p class="align-center">选中项讲师确认要离职吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="leaveIsShow = false">取消</el-button>
                <el-button size="small" class="leaveSubmit el-btn-min-100" type="primary" @click="leaveSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 入职 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="entryIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项讲师确认要入职吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="entryIsShow = false">取消</el-button>
                <el-button size="small" class="entrySubmit el-btn-min-100" type="primary" @click="entrySubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 删除 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="deleteIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项讲师确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="deleteIsShow = false">取消</el-button>
                <el-button size="small" class="deleteSubmit el-btn-min-100" type="primary" @click="deleteSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 恢复 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="revertIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项讲师确认要恢复吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="revertIsShow = false">取消</el-button>
                <el-button size="small" class="revertSubmit el-btn-min-100" type="primary" @click="revertSubmit">确定</el-button>
            </div>
        </el-dialog>
        <PersonnelSelection v-if="selectConfigIsShow" :selectConfigIsShow="selectConfigIsShow" :types="types" withOut="withOut" dataLength="1" cascadeOrg="cascadeOrg" :existingData="existingData" @listenEventData="getDataFun" @listenEventClose="getCloseFun"></PersonnelSelection>
        <!-- 撤销授权 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="removeIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项课程确认要撤销授权吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="removeIsShow = false">取消</el-button>
                <el-button size="small" class="removeSubmit el-btn-min-100" type="primary" @click="removeSubmit">确定</el-button>
            </div>
        </el-dialog>
        <LecturerCourseSave v-if="lecturerCourseSaveIsShow" :lecturerCourseSaveIsShow="lecturerCourseSaveIsShow" :interfaceUrl="interfaceUrl" :lecturerId="lecturerId" :lecturerName="lecturerName" :addOrEditFlag="addOrEditFlag" @listenEventData="getCourseDataFun" @listenEventClose="getCourseCloseFun"></LecturerCourseSave>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {axiosPost,getDictionariesNameData,getDictionariesAllData,getOrgNameData} from "@/assets/js/api";
    import PersonnelSelection from '@/components/PersonnelSelection';
    import LecturerCourseSave from '@/views/ResourceManagement/LecturerCourseSave'
    import '@/assets/js/dateFormat';
    import { PERMISSION } from '@/assets/js/permissions';
    import{mobileValidate,idValidate,zhengshuValidate} from '@/assets/js/verification'
    export default {
        name: "LecturerManagement",
        components:{
            Treeselect,
            PersonnelSelection,
            LecturerCourseSave
        },

        data() { // 存储数据
            return {
                searchData: {},
                area: '', //区域
                dictionariesAllData:[], //获取全部数据字典
                userRank: '',
                userRankDataAll: [],//职级全部下拉数据
                userRankData: [],//职级下拉数据
                workTime: '',
                userName: '',
                records: [],//表格数据列表
                recordsTotal: 0, // 表格数据的条数
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                orgNameData:[],//获取全部机构名称map

                multipleSelection:[], // 表格选择后的数据
                addIsShow: false, // 新增弹窗是否显示
                leaveIsShow: false, //离职弹框是否显示
                entryIsShow: false, //入职弹框是否显示
                deleteIsShow: false, //删除弹框是否显示
                revertIsShow: false, //恢复弹框是否显示
                orgId: null,  // 用于添加数据的所属机构 某个数据
                orgData: [],  // 所属机构 整体数据
                statusData: [],  //状态下拉数据
                levelData: [], //星级数据
                workTimeData: [], //兼职专职下拉数据
                workTimeDataAll: [],
                authenticationData: [], //认证状态下拉数据
                onJobData:'',//讲师状态下拉数据
                addSuccess: false, //新增成功标识
                returnNumber: '',
                returnUserName: '',
                addData:{ // 添加的数据
                    // id: '',         //主键id 无值为新增用户，有值为机构用户
                    userId: '',     //用户ID
                    userName: '',   //用户姓名（讲师姓名）
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '', //登录帐号
                    orgId: null,    //所属机构
                    number: '',  //讲师编号
                    // area:'',        //区域
                    userRank: '',       //职级
                    skilled: '',    //擅长课程
                    level: '',      //星级
                    honor:'',       //奖励荣誉
                    workTime: '',   //专职，兼职
                    entryTime: null,     //入职日期
                    cost:'',        //课时费
                    dateLine: ['',''],    //任命期限
                    authentication:'',//认证状态
                    // onJob:'',       //讲师状态
                    userDesc:'',//备注多行文本
                },
                editIsShow: false, // 编辑弹窗是否显示
                editData:{ // 编辑的数据
                    // id: '',         //主键id
                    userId: '',     //用户ID
                    userName: '',   //用户姓名（讲师姓名）
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '', //登录帐号
                    orgId: null,    //所属机构
                    number: '',  //讲师编号
                    // area:'',        //区域
                    userRank: '',       //职级
                    skilled: '',    //擅长课程
                    level: '',      //星级
                    honor:'',       //奖励荣誉
                    workTime: '',   //专职，兼职
                    entryTime: null,   //入职日期
                    cost:'',        //课时费
                    dateLine: ['',''],    //任命期限
                    authentication:'',//认证状态
                    // onJob:'',       //讲师状态
                    userDesc:'',//备注多行文本
                },
                rules:{// 规则校验
                    // userId: [{ required: true, message: '请输入用户ID',trigger: 'change'}],
                    userName: [
                        { required: true, message: '请输入用户姓名',trigger: 'change'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    idNo: [
                        { required: true, message: '请输入身份证号',trigger: 'change'},
                        { validator: idValidate,trigger: 'blur'},
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码',trigger: 'change'},
                        { validator: mobileValidate,trigger: 'blur'},
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址',trigger: 'change'},
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    userAccount: [
                        { required: true, message: '请输入登录帐号',trigger: 'change'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    cost: [
                        { validator: zhengshuValidate,message: '请输入正确的格式',trigger: 'change'}
                    ],
                    skilled: [
                        { max: 128, message: '长度应小于等于128个字符', trigger: 'blur' }
                    ],
                    honor: [
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    userDesc: [
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    // orgId: [{ required: true, message: '请选择所属机构',trigger: 'input'}],
                    // userRank: [{ required: true, message: '请选择职级',trigger: 'change'}],
                    // area: [{ required: true, message: '请选择区域',trigger: 'change'}],
                    // number: [{ required: true, message: '请输入讲师编号',trigger: 'change'}],
                },
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                operations: [],         // 操作选择的id数据存储
                isDisabled: false,      //用户基本信息是否禁用
                // isDisabledOrgId: false,      //用户基本信息机构是否禁用  暂时保留
                // isDisabledRank: false,      //用户基本信息职级是否禁用   暂时保留
                selectConfigIsShow: false, // 选择人员弹窗
                types: [], //获取用户类型
                interfaceUrl: '', // 接口地址
                cascadeOrg: 'true', // 按机构查询时是否级联子机构
                withOut: 'withOut', //非当前用户入参
                partTimeContentIsShow: false,//兼职内容
                fullTimeContentIsShow: false,//专职内容

                //课程授权内容course
                recordsPermit: [],//已授权课程数据
                multipleSelectionPermit:[], // 表格选择后的数据
                recordsTotalPermit: 0, // 表格数据的条数
                pageNoPermit: 1, // 第几页
                pageSizePermit: 5, // 每页几条
                removeIsShow: false, //撤销授权弹框是否显示

                //授课历史内容courseHistory
                recordsPermitHistory: [],//授课历史数据
                recordsTotalPermitHistory: 0, // 授课历史表格数据的条数
                pageNoPermitHistory: 1, // 第几页
                pageSizePermitHistory: 5, // 每页几条

                //课程授权部分
                lecturerCourseSaveIsShow: false, //课程授权弹框是否显示
                lecturerId: '',   //讲师编号
                lecturerName: '',  //讲师姓名
                addOrEditFlag: '', //新增或编辑时课程授权

                PERMISSIONS: {},
                perLoaded: false,
                existingData:[], //传递的数据
            }
        },
        created() {
            this.getDictionData();//获取数据字典
            this.getOrgList();
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getDictionariesAllData().then(res =>{   //获取全部数据字典
                this.dictionariesAllData = res;
            });
            getOrgNameData().then(res =>{   //获取全部机构名称
                this.orgNameData = res;
            });
            PERMISSION().then(res =>{   //获取控制权限
                this.PERMISSIONS = res;
                this.perLoaded = true;
            });

            this.getList(1,this.pageSize);
        },
        mounted() { // 挂载后的 生命周期

        },
        methods: {
            getDictionData(){ //获取数据字典全量
                axiosPost('/systemMgr/param/dictionary', {
                    dicGroupIds: ['userRank_all','userRank','level','workTime','workTime_all','authentication','onJob'],
                }).then(res => {
                    this.userRankDataAll = res.data.userRank_all;
                    this.userRankData = res.data.userRank;
                    this.levelData = res.data.level;
                    this.workTimeData = res.data.workTime;
                    this.workTimeDataAll = res.data.workTime_all;
                    this.authenticationData = res.data.authentication;
                    this.onJobData = res.data.onJob;
                });
            },
            getList(pageNo,pageSize,orgId,area,userRank,workTime,userName){ //获取列表
                axiosPost('/resourceMgr/lecturer/list',{
                    loading: '.loading-table',
                    noRepeat:'.queryList',
                    orgId: this.searchData.orgId,
                    area: this.searchData.area,
                    userRank: this.searchData.userRank,
                    workTime: this.searchData.workTime,
                    userName: this.searchData.userName,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            queryList(){ // 通过查询条件获取列表内容
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.orgId,this.area,this.userRank,this.workTime,this.userName);
            },
            reset(){ // 重置
                this.searchData = {};
            },
            handleSelectionChange(res){ // 表格选择更改
                this.multipleSelection = res;
            },
            addDataFun(){//新增数据
                this.addIsShow = true;
                this.partTimeContentIsShow = false;
                this.fullTimeContentIsShow = false;
            },
            messageAlert(message){
                this.$message({message: message,type: 'success'});
            },
            idArrNum(idArr){ //选择的条数判断
                if (idArr.length === 0) {
                    this.$message({message: '请选择至少一条数据！',type: 'warning'});
                    return false;
                }else{
                    return true;
                }
            },
            leaveFun(idArr){ //离职
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.leaveIsShow = true;
                }
            },
            entryFun(idArr){ //入职
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.entryIsShow = true;
                }
            },
            deleteFun(idArr){ //删除
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.deleteIsShow = true;
                }
            },
            revertFun(idArr){ //恢复
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.revertIsShow = true;
                }
            },
            leaveSubmit(){ //离职提交
                axiosPost('/resourceMgr/lecturer/leave',{
                    userIds: this.operations,
                    noRepeat:'.leaveSubmit',
                }).then(() => {
                    this.leaveIsShow = false;
                    this.messageAlert("离职成功！");
                    this.queryList();
                })
            },
            entrySubmit(){ //入职提交
                axiosPost('/resourceMgr/lecturer/entry',{
                    userIds: this.operations,
                    noRepeat:'.entrySubmit',
                }).then(() => {
                    this.entryIsShow = false;
                    this.messageAlert("入职成功！");
                    this.queryList();
                })
            },
            deleteSubmit(){ //删除提交
                axiosPost('/resourceMgr/lecturer/delete',{
                    userIds: this.operations,
                    noRepeat:'.deleteSubmit',
                }).then(() => {
                    this.deleteIsShow = false;
                    this.messageAlert("删除成功！");
                    this.queryList();
                })
            },
            revertSubmit(){ //恢复提交   20190624取消此功能，物理删除
                axiosPost('/resourceMgr/lecturer/chanelDelete',{
                    userIds: this.operations,
                    noRepeat:'.revertSubmit',
                }).then(() => {
                    this.revertIsShow = false;
                    this.messageAlert("恢复成功！");
                    this.queryList();
                })
            },
            editDataFun(row){    //编辑行，弹框并获取讲师详情数据
                this.editIsShow = true;
                this.partTimeContentIsShow = false;
                this.fullTimeContentIsShow = false;

                axiosPost('/resourceMgr/lecturer/info', {
                    userId: row.userId,         //主键id
                }).then( res => {
                    // this.editData.id = res.data.id;                //主键id
                    this.editData.userId = res.data.userId;        //用户ID
                    this.editData.userName = res.data.userName;    //用户姓名（讲师姓名）
                    this.editData.idNo = res.data.idNo;            //身份证号
                    this.editData.mobile = res.data.mobile;        //手机号码
                    this.editData.email = res.data.email;          //邮箱地址
                    this.editData.userAccount = res.data.userAccount;          //登录帐号
                    this.editData.orgId = res.data.orgId !== '' ? res.data.orgId:null ;          //所属机构
                    this.editData.number = res.data.number;//讲师编号
                    this.editData.userRank = res.data.userRank;            //职级
                    this.editData.skilled = res.data.skilled;       //擅长课程
                    // this.editData.area = res.data.area;             //区域
                    this.editData.level = res.data.level;           //星级
                    this.editData.honor = res.data.honor;           //奖励荣誉
                    this.editData.workTime = res.data.workTime;     //兼职，专职
                    this.editData.entryTime = res.data.entryTime;       //入职日期
                    this.editData.cost = res.data.cost;             //课时费
                    let dateLine = ['',''];//返回的任命期限
                    dateLine[0] = res.data.startLine != null ? res.data.startLine : '';  //任命开始日期
                    dateLine[1] = res.data.startLine != null ? res.data.endLine : '';  //任命结束日期
                    this.editData.dateLine = dateLine; //任命期限
                    this.editData.authentication = res.data.authentication;//认证状态
                    // this.editData.onJob = res.data.onJob;           //讲师状态
                    this.editData.userDesc = res.data.userDesc;   //备注
                    this.workTimeData.forEach(item => {
                        if(item.id === this.editData.workTime && item.dicName === '兼职'){
                            this.partTimeContentIsShow = true;
                            this.fullTimeContentIsShow = false;
                        }else if(item.id === this.editData.workTime && item.dicName === '专职'){
                            this.partTimeContentIsShow = false;
                            this.fullTimeContentIsShow = true;
                        }
                    });

                    this.queryListPermit(this.editData.userId);   // 已授权课程查询接口入参
                    this.queryListPermitHistory(this.editData.userId)   // 授课历史查询接口入参
                });
            },
            detailFun(row){    //讲师详情，打开新路由URL
                this.$router.push({path: '/lecturer-management-detail', query: {userId: row.userId}});
            },
            getOrgList(){ // 获取所属机构列表
                axiosPost('/systemMgr/org/tree',{}).then(res => {
                    this.orgData = res.data;
                });
            },
            addSubmitForm(formName){  //新增讲师信息提交
                this.$refs[formName].validate((valid) => {
                    // // console.log(valid)
                    if (valid) {
                        this.addSuccess = false;
                        this.returnNumber = '';
                        this.returnUserName = '';
                        let addUrl = '';
                        if(this.isDisabled){ //机构选择用户
                            addUrl = '/resourceMgr/lecturer/createByUser';
                        }else{//同时新增用户
                            addUrl = '/resourceMgr/lecturer/create';
                        }
                        axiosPost(addUrl, {
                            noRepeat:'.addSubmitForm',     //2019-07-31 重复提交过滤功能
                            // id: this.addData.id,         //主键id 无值为新增用户，有值为机构用户
                            userId: this.addData.userId,      //用户ID
                            userName: this.addData.userName, //用户姓名（讲师姓名）
                            idNo: this.addData.idNo,         //身份证号
                            mobile: this.addData.mobile,     //手机号码
                            email: this.addData.email,       //邮箱地址
                            userAccount: this.addData.userAccount,       //登录帐号
                            orgId: this.addData.orgId,       //所属机构
                            // status: "",      //用户状态
                            number: this.addData.number,        //讲师编号
                            userRank: this.addData.userRank,            //职级
                            skilled: this.addData.skilled,      //擅长课程
                            // area: this.addData.area,            //区域
                            level: this.addData.level,          //星级
                            honor: this.addData.honor,          //奖励荣誉
                            workTime: this.addData.workTime,    //兼职，专职
                            entryTime: this.addData.entryTime !== null ? this.addData.entryTime: '',      //入职日期
                            cost: this.addData.cost,            //课时费
                            startLine: this.addData.dateLine !== null ? this.addData.dateLine[0] : '', //任命期限开始日期
                            endLine: this.addData.dateLine !== null  ? this.addData.dateLine[1] : '', //任命期限结束日期
                            authentication: this.addData.authentication, //认证状态
                            // onJob: this.addData.onJob,          //讲师状态
                            userDesc: this.addData.userDesc,  //备注
                        }).then((res) => {
                            if(res.code == '1000'){
                                this.messageAlert("新增成功！");
                                this.addSuccess = true;
                                this.returnNumber = res.data.userId;
                                this.returnUserName = this.addData.userName;
                                this.cancelOperation(); //清楚重置数据

                                this.$confirm('新增讲师成功！可进行【课程授权】, 是否继续?', '课程授权', {
                                    confirmButtonText: '是',
                                    cancelButtonText: '否',
                                    type: 'success',
                                    showClose: false,
                                    closeOnPressEscape: false,
                                    closeOnClickModal: false,
                                }).then(() => {
                                    this.saveFun(); //课程授权
                                }).catch(() => {
                                    this.queryList();
                                });
                            }else{
                                this.$message.error('保存失败！后台返回错误！');
                                // this.$message({message:'保存失败！后台返回错误！',type: 'error'});
                            }

                        });
                    }
                });
            },
            editSubmitForm(formName){  //编辑讲师信息提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/resourceMgr/lecturer/alter', {  //编辑讲师接口
                            noRepeat:'.editSubmitForm',
                            // id: this.editData.id,              //主键id
                            userId: this.editData.userId,      //用户ID
                            userName: this.editData.userName, //用户姓名（讲师姓名）
                            idNo: this.editData.idNo,         //身份证号
                            mobile: this.editData.mobile,     //手机号码
                            email: this.editData.email,       //邮箱地址
                            userAccount: this.editData.userAccount,       //登录帐号
                            orgId: this.editData.orgId,       //所属机构
                            // status: "",      //用户状态
                            number: this.editData.number,       //讲师编号
                            userRank: this.editData.userRank,            //职级
                            skilled: this.editData.skilled,      //擅长课程
                            // area: this.editData.area,            //区域
                            level: this.editData.level,          //星级
                            honor: this.editData.honor,          //奖励荣誉
                            workTime: this.editData.workTime,    //兼职，专职
                            entryTime: this.editData.entryTime !== null ? this.editData.entryTime : '',      //入职日期
                            cost: this.editData.cost,            //课时费
                            startLine: this.editData.dateLine !== null ? this.editData.dateLine[0] : '', //任命期限开始日期
                            endLine: this.editData.dateLine !== null ? this.editData.dateLine[1] : '', //任命期限结束日期
                            authentication: this.editData.authentication, //认证状态
                            // onJob: this.editData.onJob,          //讲师状态
                            userDesc: this.editData.userDesc,  //备注

                        }).then(() => {
                            this.editIsShow = false;
                            this.messageAlert("编辑成功！");
                            this.queryList();
                        });
                    }
                });
            },
            selectPersonnel(){ // 选择人员
                this.selectConfigIsShow = true;
                // this.interfaceUrl = '/resourceMgr/lecturer/withOutList'; // 非讲师人员接口
                this.types = ["LECTURER"];    //2019-06-27 接口参数变动   USER = TEACHER + LECTURER + STUDENT +OTHER
            },
            getDataFun(res){ // 获取机构人员数据
                this.addData.userName = res[0].userName;
                this.addData.userId = res[0].userId;
                axiosPost('/systemMgr/user/list2',{
                    userIds: [res[0].userId]
                })
                    .then(res => {
                        this.addData.idNo = res.data[0].idNo;
                        this.addData.mobile = res.data[0].mobile;
                        this.addData.email = res.data[0].email;
                        this.addData.userAccount = res.data[0].userAccount;
                        this.addData.orgId = res.data[0].orgId !== '' ? res.data[0].orgId:null;
                        this.addData.userRank = res.data[0].userRank;
                        this.isDisabled = true;
                    });
            },
            getCloseFun(res){ // 弹窗是否关闭
                this.selectConfigIsShow = res;
            },
            changeTree(formName){//机构下拉框选择触发事件
                this.$refs[formName].validateField('orgId');
            },
            close(formName){   //维护讲师弹框，清空操作
                this.$refs[formName].resetFields();
                this.resetAddData(); //重置清空数据
                this.isDisabled = false;
            },
            cancelOperation(){//取消操作
                this.addIsShow = false;
                this.editIsShow = false;
                this.isDisabled = false;
                this.resetAddData(); //重置清空数据
            },
            resetAddData(){ //新增重置清空数据
                this.addData = {
                    userId: '',     //用户ID
                    userName: '',   //用户姓名（讲师姓名）
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '',      //登录帐号
                    orgId: null,    //所属机构
                    number: '',  //讲师编号
                    userRank: '',       //职级
                    skilled: '',    //擅长课程
                    // area: '',      //区域
                    level: '',      //星级
                    honor:'',       //奖励荣誉
                    workTime: '',   //专职，兼职
                    entryTime: null,     //入职日期
                    cost:'',        //课时费
                    dateLine: ['',''],    //任命期限
                    authentication:'',//认证状态
                    // onJob:'',       //讲师状态
                    userDesc:'',//备注多行文本
                };
            },
            handleSizeChange(res) { //每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.orgId,this.area,this.userRank,this.workTime,this.userName);
            },
            handleCurrentChange(res) { //第几页
                this.pageNo = res;
                this.getList(this.pageNo,this.pageSize,this.orgId,this.area,this.userRank,this.workTime,this.userName);
            },
            changeWorkTime(workTime){
                this.workTimeData.forEach(item => {
                    if(item.id === workTime && item.dicName === '兼职'){
                        this.partTimeContentIsShow = true;
                        this.fullTimeContentIsShow = false;
                    }else if(item.id === workTime && item.dicName === '专职'){
                        this.partTimeContentIsShow = false;
                        this.fullTimeContentIsShow = true;
                    }
                });
                if(this.addIsShow === true){  //选项切换时清空
                    this.addData.entryTime = null;
                    this.addData.cost = '';
                    this.addData.dateLine = ['',''];
                    this.addData.authentication = '';
                }
                if (this.editIsShow === true) { //选项切换时清空
                    this.editData.entryTime = null;
                    this.editData.cost = '';
                    this.editData.dateLine = ['',''];
                    this.editData.authentication = '';
                }
            },

            //已授权课程部分
            handleSelectionChangePermit(res){ // 授权表格选择更改
                this.multipleSelectionPermit = res;
            },
            queryListPermit(lecturerId){ // 已授权课程接口查询
                this.pageNoPermit = 1;
                this.getListPermit(this.pageNoPermit,this.pageSizePermit,lecturerId);
            },
            handleSizeChangePermit(res) { //每页多少条
                this.pageSizePermit = res;
                this.pageNoPermit = 1;
                this.getListPermit(this.pageNoPermit,this.pageSizePermit,this.editData.userId);
            },
            handleCurrentChangePermit(res) { //第几页
                this.pageNoPermit = res;
                this.getListPermit(this.pageNoPermit,this.pageSizePermit,this.editData.userId);
            },
            getListPermit(pageNo,pageSize,lecturerId){ // 获取已授权课程列表
                axiosPost('/educateMgr/lecturer/course/list',{
                    loading:'.loading-table3',
                    lecturerId: lecturerId,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.recordsPermit = res.data.records;
                    this.recordsTotalPermit = res.data.total;
                });
            },
            removeFun(idArr){ //撤销授权
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.removeIsShow = true;
                }
            },
            removeSubmit(){ //撤销授权提交
                if(this.editData.userId !== ''){      // 撤销授权接口
                    axiosPost('/educateMgr/lecturer/course/remove',{
                        noRepeat:'.removeSubmit',
                        courses: this.operations,     //已授权课程id
                        lecturerId: this.editData.userId,  //讲师编号
                    }).then(() => {
                        this.removeIsShow = false;
                        this.messageAlert("撤销授权成功！");
                        this.queryListPermit(this.editData.userId);  //刷新已授权课程
                        // this.queryListPermitHistory(this.editData.userId)   // 刷新授课历史列表
                    })
                }else{
                    this.$message({message: '讲师编号为空，不能撤销授权！', type: 'warning'});
                }
            },

            //授课历史部分
            queryListPermitHistory(lecturerId){ // 授课历史接口查询
                this.pageNoPermitHistory = 1;
                this.getListPermitHistory(this.pageNoPermitHistory,this.pageSizePermitHistory,lecturerId);
            },
            handleSizeChangePermitHistory(res) { //每页多少条
                this.pageSizePermitHistory = res;
                this.pageNoPermitHistory = 1;
                this.getListPermitHistory(this.pageNoPermitHistory,this.pageSizePermitHistory,this.editData.userId);
            },
            handleCurrentChangePermitHistory(res) { //第几页
                this.pageNoPermitHistory = res;
                this.getListPermitHistory(this.pageNoPermitHistory,this.pageSizePermitHistory,this.editData.userId);
            },
            getListPermitHistory(pageNo,pageSize,lecturerId){ // 获取授课历史列表
                axiosPost('/educateMgr/lecturer/course/history',{
                    loading:'.loading-table4',
                    lecturerId: lecturerId,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.recordsPermitHistory = res.data.records;
                    this.recordsTotalPermitHistory = res.data.total;
                });
            },
            //课程授权部分
            saveFun(){ // 课程授权
                if(this.editIsShow){
                    if(this.editData.userId !== ''){
                        this.lecturerCourseSaveIsShow = true;
                        this.interfaceUrl = '/educateMgr/lecturer/course/unAuth';  // 讲师未授权课程查询url
                        this.lecturerId = this.editData.userId;
                        this.lecturerName = this.editData.userName;
                        this.addOrEditFlag = 'editFlag';
                    }else{
                        this.$message({message: '讲师编号为空，不能课程授权！', type: 'warning'});
                    }
                    return;
                }
                if(this.addSuccess){
                    if(this.returnNumber !== ''){
                        this.lecturerCourseSaveIsShow = true;
                        this.interfaceUrl = '/educateMgr/lecturer/course/unAuth';  // 讲师未授权课程查询url
                        this.lecturerId = this.returnNumber;      //返回的讲师编号
                        this.lecturerName = this.returnUserName;  //返回的姓名
                        this.addOrEditFlag = 'addFlag';
                    }else{
                        this.$message({message: '讲师编号为空，不能课程授权！', type: 'warning'});
                    }
                }
            },
            getCourseDataFun(res){ // 课程授权成功返回
                if(res === 'editFlag'){
                    this.queryListPermit(this.editData.userId);   // 授权成功后，刷新已授权列表
                    // this.queryListPermitHistory(this.editData.userId)   // 刷新授课历史列表
                }else if(res === 'addFlag'){
                    this.queryList();                 //刷新讲师管理查询界面
                }
            },
            getCourseCloseFun(res){ // 弹窗是否关闭
                this.lecturerCourseSaveIsShow = res;
            },
        },
        watch: {
            'addData.userId': function(val){
                this.existingData = [{userId: val}];
            }
        }
    }
</script>

<style scoped lang="scss">

    .map-button {
        margin: 10px 0;
        clear:both;
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
    .treeInline{
        width: 202px;
        float: left;
    }
    .width100 {
        width: 100%;
    }
    .textarea-input{
        width: 564px;
    }
    .horizontal-line {
        border-bottom: 1px solid #dfdfdf;
        margin-bottom: 21px;
    }
    .table-dicFront{
        color: #606266;
        cursor: default;
    }
    .el-input-width{
        width: 112px;
    }
    .btn-button-Css {
        display: inline-block;
        background: #66b1ff;
        padding: 0 10px;
        color: #fff;
        border-radius: 5px;
        line-height: 25px;
        height: 25px;
        cursor: pointer;
        margin-right: 20px;
        margin-bottom: 6px;
    }
    .add-form span.btn-buttonUser {
        display: inline-block;
        background: #13ce67;
        padding: 0 10px;
        color: #fff;
        border-radius: 5px;
        line-height: 25px;
        height: 25px;
        cursor: pointer;
        margin: 7px 30px 0 5px;
    }
    .add-form .el-form-item {
        margin-right: 30px;
    }
    .edit-form .el-form-item {
        margin-right: 30px;
    }
    .edit-footer{
        margin-bottom: 20px;
    }
    .title-h3{
        border-left: 4px solid #409eff;
        padding-left: 10px;
        line-height: 24px;
        font-size: 18px;
        color: #303133;
        margin: 20px 0;
    }
</style>