<!--@menu 班主任管理 @author dongjie.zhu-->
<template>
    <div class="teacherManagement">
        <h2 class="title-h2">班主任管理</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="searchData" label-width="100px" >
               <!-- <el-form-item label="区域" v-show="false">
                   <el-select v-model="searchData.area" placeholder="请选择区域">
                       <el-option
                               v-for="item in this.dictionariesAllData['area_all']"
                               :key="item.id"
                               :value="item.id"
                               :label="item.dicName">
                       </el-option>
                   </el-select>
               </el-form-item> -->
                <el-form-item label="所属机构" prop="orgId">
                    <treeselect v-model="searchData.orgId" placeholder="请选择所属机构"
                                noResultsText="未找到，请重新输入"
                                :options="orgData"
                                class="treeInline"
                    />
                </el-form-item>

                <el-form-item label="职级">
                    <el-select v-model="searchData.userRank" placeholder="请选择职级">
                        <el-option
                                v-for="item in this.dictionariesAllData['userRank_all']"
                                :key="item.id"
                                :value="item.id" :disabled="item.disabled"
                                :label="item.dicName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchData.onJob" placeholder="请选择状态">
                        <el-option
                                v-for="item in this.dictionariesAllData['onJob_all']"
                                :key="item.id"
                                :value="item.id" :disabled="item.disabled"
                                :label="item.dicName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班主任姓名">
                    <el-input v-model="searchData.userName" placeholder="请输入班主任姓名" ></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" class="queryList el-btn-min-100" type="primary" @click="queryList">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="map-list">
            <div class="map-button ">
                <el-button v-if="perLoaded ? PERMISSIONS.TEACHER.ADD : false" size="small" @click="addDataFun">新增</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.TEACHER.LEAVE : false" size="small" @click="leaveFun(multipleSelection.map((i) => i.userId))">离职</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.TEACHER.ENTRY : false" size="small" @click="entryFun(multipleSelection.map((i) => i.userId))">入职</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.TEACHER.DELETE : false" size="small" @click="deleteFun(multipleSelection.map((i) => i.userId))">删除</el-button>
<!--                <el-button v-if="perLoaded ? PERMISSIONS.TEACHER.REVERT : false" size="small" @click="revertFun(multipleSelection.map((i) => i.userId))">恢复</el-button>-->
            </div>
            <div class="map-table loading-table">
                <el-table :data="records" size="mini" border style="width: 100%"  @selection-change ="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="40px"> </el-table-column>
                    <el-table-column align="center" label="班主任编号" width="160px">
                        <template slot-scope="scope" align="center">
                            <span class="table-operation"  @click="detailFun(scope.row)">{{scope.row.number}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userName" align="center" label="班主任姓名"> </el-table-column>
                    <el-table-column prop="gender" align="center" label="性别" width="80px"> </el-table-column>
<!--                    <el-table-column prop="age" align="center" label="年龄" width="60px"> </el-table-column>-->
                    <el-table-column prop="workAge" align="center" label="工龄" width="80px"> </el-table-column>
<!--                    <el-table-column prop="area" align="center" label="区域" v-if="false">-->
<!--                        <template slot-scope="scope">-->
<!--                            <span class="table-dicFront">{{dictionariesNameData[scope.row.area]}} </span>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
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
                    <el-table-column prop="level" align="center" label="星级">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.level]}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="onJob" align="center" label="状态">
                        <template slot-scope="scope">
                            <span class="table-dicFront">{{dictionariesNameData[scope.row.onJob]}} </span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="deleted" align="center" label="班主任标识">-->
<!--                        <template slot-scope="scope">-->
<!--                            <span class="table-dicFront">{{dictionariesNameData[scope.row.deleted]}} </span>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span v-if="perLoaded ? PERMISSIONS.TEACHER.EDIT : false" class="table-operation" @click="editDataFun(scope.row)">编辑</span>
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
        <!-- 新增班主任信息 -->
        <el-dialog class="need-header" title = "新增班主任" :visible.sync="addIsShow" @close="close('addForm')" width="800px">
            <div class="add-form">
                <el-form :model="addData" size="small" :inline="true" :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" >
                    <el-form-item label="用户姓名" prop="userName" style="margin-right: 10px">
                        <el-input v-model="addData.userName" placeholder="请输入姓名" class="el-input-width" :disabled="isDisabled"></el-input>
                    </el-form-item>
                    <span class="btn-buttonUser" @click="selectPersonnel()">机构用户</span>
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
                    <el-form-item label="所属机构" prop="orgId">
                        <treeselect v-model="addData.orgId" placeholder="请选择所属机构"
                                    :options="orgData"
                                    class="treeInline"
                                    @input="changeTree('addForm')"
                                    noResultsText="未找到，请重新输入"
                                    :disabled="isDisabled"
                        />
                    </el-form-item>
                    <el-form-item label="职级" prop="userRank">
                        <el-select v-model="addData.userRank" placeholder="请选择职级" :disabled="isDisabled">
                            <el-option
                                    v-for="item in this.dictionariesAllData['userRank']"
                                    :key="item.id"
                                    :value="item.id" :disabled="item.disabled"
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
                    <el-form-item label="班主任编号" prop="number" v-show="false">
                        <el-input v-model="addData.number" placeholder="班主任编号自动生成" :disabled="true"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="性别" prop="gender">
                        <el-select v-model="addData.gender" placeholder="请选择性别">
                            <el-option
                                    v-for="item in this.dictionariesAllData['gender']"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="星级" prop="level">
                        <el-select v-model="addData.level" placeholder="请选择星级">
                            <el-option
                                    v-for="item in this.dictionariesAllData['level']"
                                    :key="item.id"
                                    :value="item.id" :disabled="item.disabled"
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
                    <el-form-item label="入职日期" prop="entryTime" >
                        <el-date-picker v-model="addData.entryTime" placeholder="请选择入职日期" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
                    </el-form-item>
                    <!--<el-form-item label="班主任状态" prop="onJob">
                        <el-select v-model="addData.onJob" placeholder="请选择班主任状态">
                            <el-option
                                    v-for="item in this.dictionariesAllData['onJob']"
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
        <!-- 编辑班主任信息 -->
        <el-dialog class="need-header" title = "编辑班主任" :visible.sync="editIsShow" @close="close('editForm')" width="800px">
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
                    <el-form-item label="所属机构" prop="orgId">
                        <treeselect v-model="editData.orgId" placeholder="请选择所属机构"
                                    :options="orgData"
                                    class="treeInline"
                                    @input="changeTree('editForm')"
                                    noResultsText="未找到，请重新输入"
                                    :disabled="true"
                        />
                    </el-form-item>
                    <el-form-item label="职级" prop="userRank">
                        <el-select v-model="editData.userRank" placeholder="请选择职级" :disabled="true">
                            <el-option
                                    v-for="item in this.dictionariesAllData['userRank']"
                                    :key="item.id"
                                    :value="item.id" :disabled="item.disabled"
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
                    <!--<el-form-item label="性别" prop="gender">
                        <el-select v-model="editData.gender" placeholder="请选择性别">
                            <el-option
                                    v-for="item in this.dictionariesAllData['gender']"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.dicName">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="班主任编号" prop="number">
                        <el-input v-model="editData.number" placeholder="班主任编号自动生成" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="星级" prop="level">
                        <el-select v-model="editData.level" placeholder="请选择星级">
                            <el-option
                                    v-for="item in this.dictionariesAllData['level']"
                                    :key="item.id"
                                    :value="item.id" :disabled="item.disabled"
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
                    <el-form-item label="入职日期" prop="entryTime" >
                        <el-date-picker v-model="editData.entryTime" placeholder="请选择入职日期" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
                    </el-form-item>
                    <!--<el-form-item label="班主任状态" prop="onJob">
                        <el-select v-model="editData.onJob" placeholder="请选择班主任状态">
                            <el-option
                                    v-for="item in this.dictionariesAllData['onJob']"
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
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="cancelOperation">取消</el-button>
                <el-button size="small" class="editSubmitForm el-btn-min-100" type="primary" @click="editSubmitForm('editForm')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 离职 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="leaveIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项班主任确认要离职吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="leaveIsShow = false">取消</el-button>
                <el-button size="small" class="leaveSubmit el-btn-min-100" type="primary" @click="leaveSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 入职班主任 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="entryIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项班主任确认要入职吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="entryIsShow = false">取消</el-button>
                <el-button size="small" class="entrySubmit el-btn-min-100" type="primary" @click="entrySubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 删除班主任 -->
        <el-dialog class="el-dialog-500" title="" :visible.sync="deleteIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项班主任确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="deleteIsShow = false">取消</el-button>
                <el-button size="small" class="deleteSubmit el-btn-min-100" type="primary" @click="deleteSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 恢复 -->
        <el-dialog class="need-header" title="" :visible.sync="revertIsShow" :close-on-click-modal="false">
            <div class="dialog-container">
                <p class="align-center">选中项班主任确认要恢复吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="revertIsShow = false">取消</el-button>
                <el-button size="small" class="revertSubmit el-btn-min-100" type="primary" @click="revertSubmit">确定</el-button>
            </div>
        </el-dialog>
        <PersonnelSelection v-if="selectConfigIsShow" :selectConfigIsShow="selectConfigIsShow" :types="types" withOut="withOut" cascadeOrg="cascadeOrg" dataLength="1" :existingData="existingData" @listenEventData="getDataFun" @listenEventClose="getCloseFun"></PersonnelSelection>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {axiosPost,getDictionariesNameData,getDictionariesAllData,getOrgNameData} from "@/assets/js/api";
    import PersonnelSelection from '@/components/PersonnelSelection'
    import '@/assets/js/dateFormat';
    import { PERMISSION } from '@/assets/js/permissions';
    import{mobileValidate,idValidate} from '@/assets/js/verification'

    export default {
        name: "TeacherManagement",
        components:{
            Treeselect,
            PersonnelSelection
        },

        data() { // 存储数据
            return {
                dictionariesAllData:[], //获取全部数据字典
                orgNameData:[],//获取全部机构名称
                searchData: { // 搜索数据
                    area: '',
                    orgId: null,
                    userRank: '',
                    onJob: '',
                    userName: '',
                },
                records: [],//表格数据列表
                recordsTotal: 0, // 表格数据的条数
                pageNo: 1, // 第几页
                pageSize: 5, // 每页几条
                multipleSelection:[], // 表格选择后的数据
                addIsShow: false, // 新增弹窗是否显示
                leaveIsShow: false, //离职弹框是否显示
                entryIsShow: false, //入职弹框是否显示
                deleteIsShow: false, //删除弹框是否显示
                revertIsShow: false, //恢复弹框是否显示

                orgId: null,  // 用于添加数据的所属机构 某个数据
                orgData: [],  // 所属机构 整体数据

                addData:{ // 添加的数据
                    userId: '',     //用户ID，主键id 无值为新增用户，有值为机构用户
                    userName: '',   //用户姓名
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '',      //登录帐号
                    orgId: null,    //所属机构
                    number: '',     //班主任编号
                    // area:'',        //区域
                    // gender: '',     //性别
                    userRank: '',       //职级
                    level: '',      //星级
                    skilled: '',    //擅长课程
                    honor:'',       //奖励荣誉
                    entryTime: null,     //入职日期
                    // onJob:'',       //班主任状态
                    userDesc:'',    //备注多行文本
                },
                editIsShow: false, // 编辑弹窗是否显示
                editData:{ // 编辑的数据
                    userId: '',     //用户ID
                    userName: '',   //用户姓名
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '',      //登录帐号
                    orgId: null,    //所属机构
                    number: '',     //班主任编号
                    // area:'',        //区域
                    // gender: '',     //性别
                    userRank: '',       //职级
                    level: '',      //星级
                    skilled: '',    //擅长课程
                    honor:'',       //奖励荣誉
                    entryTime: null,     //入职日期
                    // onJob:'',       //班主任状态
                    userDesc:'',    //备注多行文本
                },
                rules:{// 规则校验
                    // userId: [{ required: true, message: '请输入用户ID',trigger: 'change'}],
                    userName: [
                        { required: true, message: '请输入用户姓名',trigger: 'change'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    idNo: [
                        { required: true, message: '请输入身份证号',trigger: 'change'},
                        { validator: idValidate,trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码',trigger: 'change'},
                        { validator: mobileValidate,trigger: 'blur'}
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
                    // level: [{ required: true, message: '请选择星级',trigger: 'change'}],
                    // onJob: [{ required: true, message: '请选择班主任状态',trigger: 'change'}],
                },
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                operations: [],         // 操作选择的id数据存储
                isDisabled: false,      //用户基本信息是否禁用
                selectConfigIsShow: false, // 选择人员弹窗
                types: [], // 获取人员类型
                cascadeOrg: 'true', // 按机构查询时是否级联子机构
                withOut: 'withOut', // 非用户人员类型入参

                PERMISSIONS: {},
                perLoaded: false,
                existingData:[], //传递的数据
            }
        },
        created() {
            getDictionariesAllData().then(res =>{   //获取全部数据字典
                this.dictionariesAllData = res;
            });
            getDictionariesNameData().then(res => { //获取全部数据字典名称
                this.dictionariesNameData = res;
            });
            getOrgNameData().then(res =>{   //获取全部机构名称
                this.orgNameData = res;
            });
            PERMISSION().then(res =>{   //获取控制权限
                this.PERMISSIONS = res;
                this.perLoaded = true;
            });

            this.getOrgList();
            this.getList(1,this.pageSize);

        },
        mounted() { // 挂载后的 生命周期

        },
        methods: {
            getList(pageNo,pageSize,area,orgId,userRank,onJob,userName){ //获取列表
                axiosPost('/resourceMgr/teacher/list',{
                    loading:'.loading-table',
                    noRepeat:'.queryList',
                    area: area,
                    orgId: orgId,
                    userRank: userRank,
                    onJob: onJob,
                    userName: userName,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.records = res.data.records;
                    this.recordsTotal = res.data.total;
                });
            },
            queryList(){ // 通过查询条件获取列表内容
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.userRank,this.searchData.onJob,this.searchData.userName);
            },
            reset(){ // 重置
                this.searchData.area = '';
                this.searchData.orgId = null;
                this.searchData.userRank = '';
                this.searchData.onJob = '';
                this.searchData.userName = '';
            },
            handleSelectionChange(res){ // 表格选择更改
                this.multipleSelection = res;
            },
            addDataFun(){//新增数据
                this.addIsShow = true;
            },
            messageAlert(message){
                this.$message({message: message,type: 'success'});
            },
            idArrNum(idArr){ //选择的条数判断
                if (idArr.length === 0) {
                    this.$message({message:'请选择至少一条数据！',type: 'warning'});
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
            revertFun(idArr){ //恢复   20190624 取消此功能，由逻辑删除变为物理删除
                if(this.idArrNum(idArr)){
                    this.operations = idArr;
                    this.revertIsShow = true;
                }
            },
            leaveSubmit(){ //离职提交
                axiosPost('/resourceMgr/teacher/leave',{
                    noRepeat:'.leaveSubmit',
                    userIds: this.operations
                }).then(() => {
                    this.leaveIsShow = false;
                    this.messageAlert("离职成功！");
                    this.queryList();
                })
            },
            entrySubmit(){ //入职提交
                axiosPost('/resourceMgr/teacher/entry',{
                    noRepeat:'.entrySubmit',
                    userIds: this.operations
                }).then(() => {
                    this.entryIsShow = false;
                    this.messageAlert("入职成功！");
                    this.queryList();
                })
            },
            deleteSubmit(){ //删除提交
                axiosPost('/resourceMgr/teacher/delete',{
                    noRepeat:'.deleteSubmit',
                    userIds: this.operations
                }).then(() => {
                    this.deleteIsShow = false;
                    this.messageAlert("删除成功！");
                    this.queryList();
                })
            },
            revertSubmit(){ //恢复提交
                axiosPost('/resourceMgr/teacher/chanelDelete',{
                    noRepeat:'.revertSubmit',
                    userIds: this.operations
                }).then(() => {
                    this.revertIsShow = false;
                    this.messageAlert("恢复成功！");
                    this.queryList();
                })
            },
            editDataFun(row){    //编辑行，弹框并获取详情数据
                this.editIsShow = true;
                axiosPost('/resourceMgr/teacher/info', {
                    userId: row.userId,         //主键id
                }).then( res => {
                    this.editData.userId = res.data.userId;        //用户ID 主键id
                    this.editData.userName = res.data.userName;    //用户姓名
                    this.editData.idNo = res.data.idNo;            //身份证号
                    this.editData.mobile = res.data.mobile;        //手机号码
                    this.editData.email = res.data.email;          //邮箱地址
                    this.editData.userAccount = res.data.userAccount;          //登录帐号
                    this.editData.orgId = res.data.orgId !== ''? res.data.orgId: null;          //所属机构
                    this.editData.number = res.data.number;         //班主任编号
                    // this.editData.gender = res.data.gender;         //性别
                    // this.editData.entryTime = res.data.entryTime instanceof Object ? res.data.entryTime.Format("yyyy-MM-dd") : res.data.entryTime;       //入职日期
                    this.editData.entryTime = res.data.entryTime;       //入职日期
                    // this.editData.area = res.data.area;             //区域
                    this.editData.userRank = res.data.userRank;            //职级
                    this.editData.level = res.data.level;           //星级
                    this.editData.honor = res.data.honor;           //奖励荣誉
                    this.editData.skilled = res.data.skilled;       //擅长课程
                    // this.editData.onJob = res.data.onJob;           //班主任状态
                    this.editData.userDesc = res.data.userDesc;   //备注
                });
            },
            detailFun(row){    //班主任详情，打开新路由URL
                this.$router.push({path: '/teacher-management-detail', query: {userId: row.userId}});
            },
            getOrgList(){ // 获取所属机构列表
                axiosPost('/systemMgr/org/tree',{}).then(res => {
                    this.orgData = res.data;
                });
            },
            addSubmitForm(formName){  //新增班主任信息提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let addUrl = '';
                        if(this.isDisabled){ //机构选择用户
                            addUrl = '/resourceMgr/teacher/createByUser';
                        }else{//同时新增用户
                            addUrl = '/resourceMgr/teacher/create';
                        }
                        axiosPost(addUrl, {
                            noRepeat:'.addSubmitForm',
                            userId: this.addData.userId,      //用户ID 主键id 无值为新增用户，有值为机构用户返回
                            userName: this.addData.userName, //用户姓名
                            idNo: this.addData.idNo,         //身份证号
                            mobile: this.addData.mobile,     //手机号码
                            email: this.addData.email,       //邮箱地址
                            userAccount: this.addData.userAccount,       //登录帐号
                            orgId: this.addData.orgId,       //所属机构
                            number: this.addData.number,        //班主任编号
                            // gender: this.addData.gender,        //性别
                            entryTime: this.addData.entryTime !== null ? this.addData.entryTime: '', //入职日期
                            // area: this.addData.area,            //区域
                            userRank: this.addData.userRank,            //职级
                            level: this.addData.level,          //星级
                            honor: this.addData.honor,          //奖励荣誉
                            skilled: this.addData.skilled,      //擅长课程
                            // onJob: this.addData.onJob,          //班主任状态
                            userDesc: this.addData.userDesc,  //备注
                        }).then(() => {
                            this.addIsShow = false;
                            this.messageAlert("新增成功！");
                            this.queryList();
                        });
                    }
                });
            },
            editSubmitForm(formName){  //编辑班主任信息提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/resourceMgr/teacher/alter', {
                            noRepeat:'.editSubmitForm',
                            userId: this.editData.userId,      //用户ID 主键id
                            userName: this.editData.userName, //用户姓名
                            idNo: this.editData.idNo,         //身份证号
                            mobile: this.editData.mobile,     //手机号码
                            email: this.editData.email,       //邮箱地址
                            userAccount: this.editData.userAccount,       //登录帐号
                            orgId: this.editData.orgId,       //所属机构
                            number: this.editData.number,        //班主任编号
                            // gender: this.editData.gender,        //性别
                            // entryTime: this.editData.entryTime instanceof Object ? this.editData.entryTime.Format("yyyy-MM-dd") : this.editData.entryTime,      //入职日期
                            entryTime: this.editData.entryTime !== null ? this.editData.entryTime : '',      //入职日期
                            // area: this.editData.area,            //区域
                            userRank: this.editData.userRank,            //职级
                            level: this.editData.level,          //星级
                            honor: this.editData.honor,          //奖励荣誉
                            skilled: this.editData.skilled,      //擅长课程
                            // onJob: this.editData.onJob,          //班主任状态
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
                // this.interfaceUrl = '/resourceMgr/teacher/withOutList'; //非班主任人员接口
                this.types = ["TEACHER"];    //2019-06-27 接口参数变动   USER = TEACHER + LECTURER + STUDENT +OTHER
            },
            getDataFun(res){ // 获取机构人员数据
                // console.log(res);
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
                        this.addData.orgId = res.data[0].orgId !== ''? res.data[0].orgId : null;
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
            close(formName){   //维护班主任弹框，清空操作
                this.$refs[formName].resetFields();
                this.addData = {};
                this.isDisabled = false;
            },
            cancelOperation(){//取消操作
                this.addIsShow = false;
                this.editIsShow = false;
                this.isDisabled = false;
            },
            handleSizeChange(res) { //每页多少条
                this.pageSize = res;
                this.pageNo = 1;
                this.getList(this.pageNo,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.userRank,this.searchData.onJob,this.searchData.userName);
            },
            handleCurrentChange(res) { //第几页
                this.pageNo = res;
                this.getList(this.pageNo,this.pageSize,this.searchData.area,this.searchData.orgId,this.searchData.userRank,this.searchData.onJob,this.searchData.userName);
            }
        },
        watch: {
            'addData.userId': function(val){
                // console.log(val);
                this.existingData = [{userId: val}];
            }
        }
    }
</script>

<style scoped lang="scss">

    .map-button {
        margin: 10px 0;
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
    .btn-button {
        display: inline-block;
        background: #13ce67;
        padding: 0 10px;
        color: #fff;
        border-radius: 5px;
        line-height: 25px;
        height: 25px;
        cursor: pointer;
        margin-left: 20px;
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

</style>