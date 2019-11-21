<!--教室管理-->
<!--周硕梁-->
<template>
    <div class="container">
        <h2 class="title-h2">教室管理</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="searchData" label-width="100px" >
                <el-form-item label="区域">
                    <el-select v-model="searchData.searchArea" placeholder="请选择区域">
                        <el-option
                                v-for="item in searchAreaAllOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="教室类型">
                    <el-select v-model="searchData.searchRoomType" filterable placeholder="请选择教室类型">
                        <el-option
                                v-for="item in searchRoomTypeAllOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="教室状态">
                    <el-select v-model="searchData.searchRoomState" filterable placeholder="请选择教室状态">
                        <el-option
                                v-for="item in searchRoomStateAllOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="教室名称">
                    <el-input v-model="searchData.searchRoomName" placeholder="请输入教室名称" ></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" class="reloadTable el-btn-min-100" type="primary" @click="reloadTable(1)">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="resetFun">重置</el-button>
            </div>
        </div>

        <div class="map-list">
            <div class="map-button">

                <el-button v-if="perLoaded ? PERMISSIONS.ROOM.ADD : false" size="small" @click="addFun">新增</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.ROOM.DELETE : false" size="small" @click="deleteFun(multipleSelection.map((i) => i.cID))">删除</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.ROOM.ENABLE : false" size="small" @click="enableFun(multipleSelection.map((i) => i.cID))">启用</el-button>
                <el-button v-if="perLoaded ? PERMISSIONS.ROOM.DISABLED : false" size="small" @click="disableFun(multipleSelection.map((i) => i.cID))">停用</el-button>
                <!--<el-button v-if="perLoaded ? PERMISSIONS.ROOM.ADD : false" size="small" @click="reserveFun()">教室预订</el-button>-->
                <!--<el-button size="small" @click="reserveFun(1)">按时间段预订</el-button>-->

            </div>
            <ClassAppointment v-if="selectConfigIsShow" :selectConfigIsShow='selectConfigIsShow'
                              :selectRoom="selectRoom" :defaultTimeSlot="defaultTimeSlot"
                              @listenEventClose="closeRemodal" @listenEventData="getData"></ClassAppointment>
            <div class="map-table loading-table">
                <el-table size="mini" ref="multipleTable" :data="tableData" border style="width: 100%"
                          @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection" align="center"
                            width="40" fixed="left">
                    </el-table-column>

                    <el-table-column
                            prop="cNumber" align="center" width="170"
                            label="教室编号">
                        <template slot-scope="scope">
                            <span class="table-operation" @click="pushDetail(scope.row)">{{scope.row.cNumber}}</span>
                        </template>

                    </el-table-column>
                    <el-table-column
                            prop="cName" align="center" min-width="120" show-overflow-tooltip
                            label="教室名称">
                    </el-table-column>
                    <el-table-column
                            prop="cState" align="center" width="100"
                            label="教室状态">
                        <template slot-scope="scope">
                            {{scope.row.cState ? dictMap[scope.row.cState] : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="cArea" align="center" width="100"
                            label="所属区域">
                        <template slot-scope="scope">
                            {{scope.row.cArea ? dictMap[scope.row.cArea] : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="cLocation" align="center" min-width="170" show-overflow-tooltip
                            label="教室位置" >
                    </el-table-column>
                    <el-table-column
                            prop="cType" align="center" width="120"
                            label="教室类型">
                        <template slot-scope="scope">
                            {{scope.row.cType ? dictMap[scope.row.cType] : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="cCapacity" align="center" width="100"
                            label="教室容量">
                    </el-table-column>
                    <!--TODO 接口无此字段，待后端添加后验证-->
                    <el-table-column
                            prop="cEquipment" align="center" min-width="120" show-overflow-tooltip
                            label="教室设备">
                        <template slot-scope="scope">
<!--                            {{scope.row.cEquipment ? scope.row.cEquipment.reduce(i => i+ dictMap[i] + '|' , '') : ''}}-->
                            <span v-for="(item,ind) in scope.row.cEquipment" :key='ind'> {{dictMap[item]}} </span>
<!--                            {{scope.row.cEquipment}}-->
                        </template>
                    </el-table-column>
                    <el-table-column v-if="perLoaded ? (PERMISSIONS.ROOM.EDIT || PERMISSIONS.ROOM.DELETE) : false" label="操作" fixed="right" align="center" width="110">
                        <template slot-scope="scope">
                            <span v-if="perLoaded ? PERMISSIONS.ROOM.EDIT : false" class="table-operation" @click="editFun(scope.row)">编辑</span>
                            <span v-if="perLoaded ? PERMISSIONS.ROOM.DELETE : false" class="table-operation" @click="deleteFun([scope.row.cID, ])">删除</span>
                            <!--TODO 后端尚未提供删除功能-->

                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{total}}</span> 条数据</span>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 15, 20,50]"
                            :page-size="pageSize"
                            :current-page.sync="pageNo"
                            layout="sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog class="need-header" title="新增教室" :visible.sync="addIsShow">
            <div class="add-form">
                <el-form :model="addData" :inline="true" size="small" :rules="addRules" ref="addForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="教室名称" prop="cName">
                        <el-input v-model="addData.cName" placeholder="请输入教室名称"></el-input>
                    </el-form-item>
                    <el-form-item label="教室类型" prop="cType">
                        <el-select v-model="addData.cType" placeholder="请选择教室类型">

                            <el-option
                                    v-for="item in cTypeOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="教室状态" prop="cState">
                        <el-select v-model="addData.cState" placeholder="请选择教室状态">

                            <el-option
                                    v-for="item in cStateOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属区域" prop="cArea">
                        <el-select v-model="addData.cArea" placeholder="请选择所属区域">

                            <el-option
                                    v-for="item in cAreaOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="教室位置" prop="cLocation">
                        <el-input v-model="addData.cLocation" placeholder="请输入教室位置"></el-input>
                    </el-form-item>
                    <el-form-item label="教室容量" prop="cCapacity">
                        <el-input :maxlength="4" v-model="addData.cCapacity" placeholder="请输入教室容量"></el-input>
                    </el-form-item>

                    <el-form-item label="教室设备" prop="cEquipment">
                        <el-select v-model="addData.cEquipment" multiple placeholder="请选择教室设备">

                            <el-option
                                    v-for="item in cEquipmentOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>


                    <el-form-item label="教室描述" prop="cDes">
                        <el-input v-model="addData.cDes" placeholder="请输入教室描述"></el-input>
                    </el-form-item>


                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="addReset">重置</el-button>
                <el-button size="small" class="formSubmit_addForm el-btn-min-100" type="primary" @click="formSubmit('addForm')">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog class="need-header" title="编辑教室" :visible.sync="editIsShow">
            <div class="edit-form">
                <el-form :model="editData" :inline="true" size="small" :rules="editRules" ref="editForm"
                         @cancel="$refs['editForm'].resetFields()" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="教室名称" prop="cName">
                        <el-input v-model="editData.cName" placeholder="请输入教室名称"></el-input>
                    </el-form-item>
                    <el-form-item label="教室类型" prop="cType">
                        <el-select v-model="editData.cType" placeholder="请选择教室类型">

                            <el-option
                                    v-for="item in cTypeOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="教室状态" prop="cState">
                        <el-select v-model="editData.cState" placeholder="请选择教室状态">

                            <el-option
                                    v-for="item in cStateOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属区域" prop="cArea">
                        <el-select v-model="editData.cArea" placeholder="请选择所属区域">

                            <el-option
                                    v-for="item in cAreaOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="教室位置" prop="cLocation">
                        <el-input v-model="editData.cLocation" placeholder="请输入教室位置"></el-input>
                    </el-form-item>
                    <el-form-item label="教室容量" prop="cCapacity">
                        <el-input :maxlength="4" v-model="editData.cCapacity" placeholder="请输入教室容量"></el-input>
                    </el-form-item>
                    <!--TODO 后端接口未开发此字段 待验证-->
                    <el-form-item label="教室设备" prop="cEquipment">
                        <el-select v-model="editData.cEquipment" multiple placeholder="请选择教室设备">

                            <el-option
                                    v-for="item in cEquipmentOptions"
                                    :key="item.id"
                                    :label="item.dicName" :disabled="item.disabled"
                                    :value="item.id">
                            </el-option>

                        </el-select>
                    </el-form-item>


                    <el-form-item label="教室描述" prop="cDes">
                        <el-input v-model="editData.cDes" placeholder="请输入教室描述"></el-input>
                    </el-form-item>


                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="editIsShow = false">取消</el-button>
                <el-button size="small" class="formSubmit_editForm el-btn-min-100" type="primary" @click="formSubmit('editForm')">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="el-dialog-500" title="" :visible.sync="deleteIsShow">
            <div class="dialog-container">
                <p class="align-center">选中项选定教室确认要删除吗？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="el-btn-min-100" @click="deleteIsShow = false">取消</el-button>
                <el-button size="small" class="deleteSubmit el-btn-min-100" type="primary" @click="deleteSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
        // getKnowAllData,
        // getMapNameData,
    } from '@/assets/js/api';

    import {
        API
    } from '@/assets/js/urls';
    import '@/assets/js/dateFormat';
    import ClassAppointment from '@/components/ClassAppointment'
    import { PERMISSION } from "@/assets/js/permissions";
    import {debugLog} from "../../assets/js/tool";
    import{NumberValidate} from '@/assets/js/verification'

    export default {
        name: "ClassRoomManagement",
        components: {
            ClassAppointment
        },
        data() {
            return {
                searchData: {},

                PERMISSIONS: {},
                perLoaded: false,

                // 搜索区
                // 所属区域
                searchArea: null,
                searchAreaAllOptions: [
                    // {
                    //     value: '',
                    //     label: '全部',
                    // },
                    // {
                    //     value: '1',
                    //     label: '合肥',
                    // },
                    // {
                    //     value: '2',
                    //     label: '花桥',
                    // },
                    // {
                    //     value: '3',
                    //     label: '北京',
                    // },
                    // {
                    //     value: '4',
                    //     label: '大庆',
                    // },
                    // {
                    //     value: '5',
                    //     label: '马鞍山',
                    // },
                ],

                // 教室类型
                searchRoomType: null,
                searchRoomTypeAllOptions: [
                    // {
                    //     value: '',
                    //     label: '全部'
                    // },
                    // {
                    //     value: '1',
                    //     label: '大教室'
                    // }, {
                    //     value: '2',
                    //     label: '小教室'
                    // }, {
                    //     value: '3',
                    //     label: '多媒体教室'
                    // }, {
                    //     value: '4',
                    //     label: '七星级VIP豪华露天教室'
                    // },
                ],

                // 教室状态
                searchRoomState: null,
                searchRoomStateAllOptions: [
                    // {
                    //     value: '',
                    //     label: '全部'
                    // },
                    // {
                    //     value: '1',
                    //     label: '启用'
                    // }, {
                    //     value: '2',
                    //     label: '停用'
                    // },
                ],

                // 教室名称
                searchRoomName: '',


                // 列表区
                tableData: // 列表元数据
                    [],

                // 分页
                total: 0, // 数据总条数
                pageNo: 1, // 页码
                pageSize: 5, // 每页条数

                // 多选状态存储
                multipleSelection: [],

                // 操作状态存储
                operations: [],

                //弹出页面控制
                deleteIsShow: false,
                addIsShow: false,
                editIsShow: false,


                // 表单存储
                addData: {
                    cName: '',
                    cArea: '',
                    cType: '',
                    cDes: '',
                    cState: '',
                    cCapacity: '',
                    cEquipment: [],
                },
                editData: {},

                // 表单校验
                addRules: {
                    cType: [{required: true, message: '请选择教室类型', trigger: 'change'}],
                    cName: [
                        {required: true, message: '请输入教室名称', trigger: 'change'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    cDes: [
                        {required: true, message: '请输入教室描述', trigger: 'change'},
                        { max: 256, message: '长度应小于等于256个字符', trigger: 'blur' }
                    ],
                    cState: [{required: true, message: '请选择教室状态', trigger: 'change'}],
                    cArea: [{required: true, message: '请选择所属区域', trigger: 'change'}],
                    cCapacity: [
                        {required: true, message: '请输入教室容量', trigger: 'change'},
                        { validator: NumberValidate, message: '请输入数字',trigger: 'blur'}
                    ],
                    cLocation: [
                        {required: true, message: '请输入教室位置', trigger: 'change'},
                        { max: 128, message: '长度应小于等于128个字符', trigger: 'blur' }
                    ],
                    cEquipment:  [{required: true, message: '请选择教室设备', trigger: 'change'}],
                },
                editRules: {
                    cType: [{required: true, message: '请选择教室类型', trigger: 'change'}],
                    cName: [
                        {required: true, message: '请输入教室名称', trigger: 'change'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    cDes: [
                        {required: true, message: '请输入教室描述', trigger: 'change'},
                        { max: 256, message: '长度应小于等于256个字符', trigger: 'blur' }
                    ],
                    cState: [{required: true, message: '请选择教室状态', trigger: 'change'}],
                    cArea: [{required: true, message: '请选择所属区域', trigger: 'change'}],
                    cCapacity: [
                        {required: true, message: '请输入教室容量', trigger: 'change'},
                        { validator: NumberValidate, message: '请输入数字',trigger: 'blur'}
                    ],
                    cLocation: [
                        {required: true, message: '请输入教室位置', trigger: 'change'},
                        { max: 128, message: '长度应小于等于128个字符', trigger: 'blur' }
                    ],
                    cEquipment:  [{required: true, message: '请选择教室设备', trigger: 'change'}],
                },


                // 字典
                dictData: {},
                dictMap: {},

                // 知识体系
                // knowData: {},
                // knowMap: {},


                cTypeOptions: [
                    {
                        id: '1',
                        dicName: '大教室'
                    }, {
                        id: '2',
                        dicName: '小教室'
                    }, {
                        id: '3',
                        dicName: '多媒体教室'
                    }, {
                        id: '4',
                        dicName: '七星级VIP豪华露天教室'
                    },
                ],
                cStateOptions: [
                    {
                        id: '1',
                        dicName: '启用'
                    }, {
                        id: '2',
                        dicName: '停用'
                    },
                ],
                cAreaOptions: [

                    {
                        id: '1',
                        dicName: '合肥',
                    },
                    {
                        id: '2',
                        dicName: '花桥',
                    },
                    {
                        id: '3',
                        dicName: '北京',
                    },
                    {
                        id: '4',
                        dicName: '大庆',
                    },
                    {
                        id: '5',
                        dicName: '马鞍山',
                    },
                ],
                cEquipmentOptions: [],

                // 教室预订
                selectConfigIsShow: false,
                selectRoom: { // 选择后的时间段 或者 修改已预约的默认时间段
                    roomId: '',
                    data: []
                },
                defaultTimeSlot: ['', ''], // 默认开始时间和结束时间
                planId: '', // 计划id


            }
        },
        created() {


            // 教室预订初始化时间
            let now = new Date();
            this.defaultTimeSlot[0] = now.Format("yyyy-MM-dd");
            now.setDate(now.getDate() + 1); // 默认为当天到明天
            this.defaultTimeSlot[1] = now.Format("yyyy-MM-dd");

            // 字典预加载
            this.loadPreData();

            // 列表刷新
            this.reloadTable(1);


        },
        methods: {
            loadPreData() {
                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {

                        this.dictData = res;

                        this.searchRoomStateAllOptions = res.status_all;
                        this.cStateOptions = res.status;
                        this.searchAreaAllOptions = res.area_all;
                        this.cAreaOptions = res.area;

                        this.searchRoomTypeAllOptions = res.roomType_all;
                        this.cTypeOptions = res.roomType;
                        this.cEquipmentOptions = res.equipment;


                    });
                getDictionariesNameData()
                    .then(res => {
                        this.dictMap = res;
                    });


                PERMISSION().then( res => {
                    this.PERMISSIONS = res;
                    this.perLoaded = true;
                });
            },
            reloadTable(val) {
                // 请求Table数据，重新渲染
                this.pageNo = val;
                // console.log(this.searchArea, this.searchRoomType, this.searchRoomName, this.searchRoomState)
                axiosPost(API.ROOM_LIST, {
                    loading:'.loading-table',
                    noRepeat:'.reloadTable',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    roomName: this.searchData.searchRoomName,
                    roomType: this.searchData.searchRoomType,
                    area: this.searchData.searchArea,
                    status: this.searchData.searchRoomState
                }).then(res => {
                    // console.log(res);
                    const resData = res.data.records;
                    this.total = res.data.total;
                    try {
                        // console.log('+++++++++++++++++++');
                        // console.log(resData);
                        // 前后端字段对应
                        resData.map(i => {
                            i.cID = i.roomId;
                            i.cNumber = i.roomId;
                            i.cName = i.roomName;
                            i.cType = i.roomType;
                            i.cState = i.status;
                            i.cArea = i.area;
                            i.cDes = i.roomDesc;
                            i.cCapacity = i.capacity;
                            i.cLocation = i.location;
                            i.cEquipment = i.equipmentsArr; //TODO 后端无此字段，先写上，后期接口完善后需要调试
                        });
                        this.tableData = resData;
                        // console.log(resData);
                    } catch (e) {
                        // console.log(e);
                        this.tableData = [];
                    }
                })

            },
            resetFun() {
                // 重置搜索条件
                this.searchData = {};
            },

            addFun() { // 新增

                this.addIsShow = true;

            },
            editFun(val) {
                this.editIsShow = true;
                // console.log(val);
                // console.log(this.cAreaOptions)
                this.editData = {
                    cName: val.cName,
                    cType: val.cType,
                    cState: val.cState,
                    cArea: val.cArea,
                    cLocation: val.cLocation,
                    cCapacity: val.cCapacity,
                    cDes: val.roomDesc,
                    cEquipment: val.cEquipment,
                    cID: val.cID,
                }
            },

            // 表单提交
            formSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {


                        switch (formName) {
                            case 'addForm': {
                                // console.log(formName);
                                this.addIsShow = false;
                                axiosPost(API.ROOM_ADD, {
                                    noRepeat:'.formSubmit_addForm',
                                    roomName: this.addData.cName,
                                    status: this.addData.cState,
                                    area: this.addData.cArea,
                                    location: this.addData.cLocation,
                                    roomType: this.addData.cType,
                                    capacity: this.addData.cCapacity,
                                    roomDesc: this.addData.cDes,
                                    equipmentsArr:  this.addData.cEquipment,
                                }).then(res => {
                                    // console.log(res)
                                    this.$message({message:'新增成功',type: 'success'});
                                    this.reloadTable(1)
                                    this.addData=  {
                                        cName: '',
                                        cArea: '',
                                        cType: '',
                                        cDes: '',
                                        cState: '',
                                        cCapacity: '',
                                        cEquipment: [],
                                    }

                                });
                                break;

                            }
                            case 'editForm': {
                                // console.log(formName);
                                this.editIsShow = false;
                                axiosPost(API.ROOM_EDIT, {
                                    noRepeat:'.formSubmit_editForm',
                                    roomId: this.editData.cID,
                                    roomName: this.editData.cName,
                                    status: this.editData.cState,
                                    area: this.editData.cArea,
                                    location: this.editData.cLocation,
                                    roomType: this.editData.cType,
                                    capacity: this.editData.cCapacity,
                                    roomDesc: this.editData.cDes,
                                    equipmentsArr: this.editData.cEquipment, //TODO 后端接口未开发此字段 待验证
                                }).then(res => {
                                    // console.log(res);
                                    this.$message({message:'编辑成功',type: 'success'});
                                    this.reloadTable(1)
                                    this.editData = {}
                                });
                                break;

                            }
                            default:
                                // console.log(`${formName}表单在提交前需定义`);
                                break;

                        }
                    }
                })


            },

            enableFun(val) {
                //启用 传参用于后期单独操作预留
                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }

                axiosPost(API.ROOM_ENABLE, {
                    roomIds: val
                }).then(res => {
                    // console.log(res);
                    this.$message({message:'启用成功',type: 'success'});
                    this.reloadTable(1)

                })

            },
            disableFun(val) {
                //停用 传参用于后期单独操作预留
                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }

                axiosPost(API.ROOM_DISABLE, {
                    roomIds: val
                }).then(res => {
                    // console.log(res);
                    this.$message({message:'停用成功',type: 'success'});
                    this.reloadTable(1)

                })
            },

            pushDetail(row) {
                // console.log(row)
                this.$router.push({
                    path: '/classroom-detail',
                    query: {
                        id: row.cID,
                        row: row
                    }
                })
            },

            deleteFun(val) { // 批量删除,按后端要求暂时不做
                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }
                this.operations = val;
                this.deleteIsShow = true;

            },
            deleteSubmit() {

                this.deleteIsShow = false;

                axiosPost(API.ROOM_DELETE, {
                    noRepeat:'.deleteSubmit',
                    roomIds: this.operations
                }).then(res => {
                    // console.log(res);
                    this.reloadTable(1);
                });


            },
            addReset() {
                this.addData = {
                    cName: '',
                    cArea: '',
                    cType: '',
                    cDes: '',
                    cState: '',
                    cCapacity: '',
                    cEquipment: [],
                };

            },
            reserveFun() {
                this.selectConfigIsShow = true;
            },
            closeRemodal() { // 关闭弹窗
                this.selectConfigIsShow = false;
            },
            getData(res) {  // 接收数据
                this.selectRoom = res;
                this.selectConfigIsShow = false;
            },
            fieldTranslate(value, dicMap=false, key='id', label='dicName') {
                if (dicMap && dicMap.constructor === Array && dicMap.length > 0 ) {
                    const re = dicMap.find(i => i[key] === value);
                    return re ? re[label] : ''
                }
                return ''
            },


            handleSelectionChange(val) { // 多选框点击
                this.multipleSelection = val;
                // console.log('当前选择的是：' + this.multipleSelection)

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

    .map-button {
        margin: 10px 0;
    }

    .table-operation {
        color: #409EFF;
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
</style>
