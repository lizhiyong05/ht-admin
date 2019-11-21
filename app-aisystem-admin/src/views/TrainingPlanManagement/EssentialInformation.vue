<template><!-- 基础信息  zhiyong.li  -->
    <div class='essential-information'>
        <div class="preservation-container">
            <el-form :inline="true" :model="baseInfoData" class="demo-form-inline" label-width="100px" :rules="rules" ref="infoForm">
                <el-form-item label="计划编号" size="small">
                    <el-input v-model="baseInfoData.code" placeholder="自动生成" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="计划名称" prop="name" size="small">
                    <el-input v-model="baseInfoData.name" placeholder="请输入计划名称"></el-input>
                </el-form-item>
                <el-form-item label="计划时间" prop="createTime" size="small">
                    <el-date-picker
                            v-model="baseInfoData.createTime"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="培训周期" size="small">
                    <el-input v-model="baseInfoData.trainDays" placeholder="自动计算" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属产线" prop="lineId" size="small">
                    <el-select v-model="baseInfoData.lineId" placeholder="请选择所属产线" @change="projectChange">
                        <el-option v-for="(item,ind) in lineData" :key="ind" :label="item.knowName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属项目" prop="projectId" size="small">
                    <el-select v-model="baseInfoData.projectId" placeholder="请选择所属项目">
                        <el-option v-for="(item,ind) in projectData[baseInfoData.lineId]" :key="ind" :label="item.knowName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域" prop="areaId" size="small">
                    <el-select v-model="baseInfoData.areaId" placeholder="请选择区域">
                        <el-option v-for="(item,ind) in dictionariesAllData['area']" :key="ind" :label="item.dicName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="期数" prop="batchNo" size="small">
                    <el-input v-model="baseInfoData.batchNo" placeholder="请输入期数"></el-input>
                </el-form-item>
                <el-form-item label="班次" size="small" prop="classNo">
                    <el-input v-model="baseInfoData.classNo" placeholder="请输入班次"></el-input>
                </el-form-item>
                <el-form-item label="班主任" size="small">
                    <el-input v-model="baseInfoData.teacherName" :readonly="true" placeholder="请选择班主任" style="width:110px;margin-right: 5px;"></el-input>
                    <el-button type="primary" size="small" @click="selectPersonnel()">选择</el-button>
                </el-form-item>
                <el-form-item label="场地设置" size="small">
                    <el-input v-model="baseInfoData.siteName" :readonly="true" placeholder="请选择场地" style="width:110px;margin-right: 5px;"></el-input>
                    <el-button type="primary" size="small" @click="selectClass()" :disabled="($route.query.isShare === true || $route.query.isShare === 'true') ? true : false">选择</el-button>
                </el-form-item>
                <el-form-item label="讲师" size="small">
                    <el-input v-model="baseInfoData.lecturerName" :readonly="true" placeholder="请选择讲师" style="width:110px;margin-right: 5px;"></el-input>
                    <el-button type="primary" size="small" @click="selectPersonnel2()" >选择</el-button>
                </el-form-item>
                <el-form-item label="计划介绍" size="small" prop="description">
                    <el-input type="textarea" v-model="baseInfoData.description" placeholder="请输入计划介绍"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button type="primary" @click="preservationSubmit('infoForm')" class="no-repeat-click el-btn-min-100" :disabled="($route.query.isShare === true || $route.query.isShare === 'true') ? true : false" size="small">保存</el-button>
                <router-link to="/training-plan-management" style="margin-left: 10px;"><el-button size="small" class="el-btn-min-100">取消</el-button></router-link>
            </div>
        </div>
        <PersonnelSelection v-if="selectConfigIsShow" :selectConfigIsShow="selectConfigIsShow" :types="types" cascadeOrg="cascadeOrg" dataLength="1" :existingData="existingData" @listenEventData="getDataFun" @listenEventClose="getCloseFun"></PersonnelSelection>
        <PersonnelSelection v-if="selectConfigIsShow2" :selectConfigIsShow="selectConfigIsShow2" :types="types" cascadeOrg="cascadeOrg" dataLength="1" :existingData="existingData2" @listenEventData="getDataFun2" @listenEventClose="getCloseFun2"></PersonnelSelection>
        <class-room-appointAdd v-if="dialogVisible" ref="ClassRoomAppointAdd" @getAppointData="getAppointDataFun" :usedIdCopy="usedId" :dialogVisible="dialogVisible" @listenEventClose="getCloseFun3"></class-room-appointAdd>
        <newClassRoomReserve v-if="reserveIsShow" :copyUsedId="usedId" :reserveIsShow="reserveIsShow" @listenEventClose="getClose4" @getAppointData="reserveData"></newClassRoomReserve>
    </div>
</template>
<script>
    import {axiosPost,getDictionariesAllData,getDictionariesNameData} from "@/assets/js/api"
    import PersonnelSelection from '@/components/PersonnelSelection'
    import ClassAppointment from '@/components/ClassAppointment'
    import '@/assets/js/dateFormat';
    import ClassRoomAppointAdd from "@/components/ClassRoomAppointAdd"
    import newClassRoomReserve from "@/components/newClassRoomReserve"

    export default {
        name: 'EssentialInformation',
        components:{
            PersonnelSelection,
            ClassAppointment,
            ClassRoomAppointAdd,
            newClassRoomReserve
        },
        data(){
            return {
                reserveIsShow: false, // 教室预约 zhiyong.li
                dialogVisible: false, // 预约教室
                usedId: -1,
                selectConfigIsShow: false, // 选择人员弹窗
                selectConfigIsShow2: false, // 选择人员弹窗
                types: [], // 人员类型
                cascadeOrg: 'true', // 按机构查询时是否级联子机构
                baseInfoData: { // 基础信息
                    createTime: null,
                    lineName: '',
                    lineId: '',
                    id: '',
                    code: '',
                    name: '',
                    trainDays: '',
                    areaId: '',
                    batchNo: '', // 批次
                    classNo: '', // 班次
                    teacherName: '',
                    teacherId: '',
                    lecturerName: '', // 讲师
                    lecturerId: '',
                    projectName: '',
                    projectId: '',
                    description: '',
                    siteName: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入计划名称', trigger: 'blur' },
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    createTime: { required: true, message: '请选择创建时间', trigger: 'blur' },
                    lineId: { required: true, message: '请选择所属产线', trigger: 'blur' },
                    projectId: { required: true, message: '请选择所属项目', trigger: 'blur' },
                    areaId: { required: true, message: '请选择区域', trigger: 'blur' },
                    batchNo:[
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    classNo:[
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    description:[
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ]
                },
                allLineProjectData: [], // 所有项目产线数据
                lineData: [], // 产线
                projectData: {}, // 项目
                dictionariesNameData: [],
                dictionariesAllData: [],
                existingData: [], // 传递的数据 班主任
                existingData2: [], // 传递的数据 讲师
            }
        },
        created(){
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getDictionariesAllData().then(res => {
                this.dictionariesAllData = res;
            });
            this.getLineData();
            let id = this.$route.query.id;
            if(id){
                this.getInfo(id);
            }
        },
        methods:{
            getLineData(){
                axiosPost('/systemMgr/know/tree',{
                  isLine: 'isLine'
                }).then(res => {
                        this.allLineProjectData = res.data;
                        res.data.forEach((item) => {
                            if(!item.isDisabled){
                                this.lineData.push({knowName: item.knowName,id: item.id});
                            }
                            let it = [];
                            item.children.forEach((item2) => {
                                if(!item2.isDisabled){
                                    it.push({knowName: item2.knowName,id: item2.id});
                                }

                            });
                            this.projectData[item.id] = it;
                        });
                    })
            },
            getInfo(id){
                axiosPost('/educateMgr/plan/info',{
                    id: id
                })
                    .then(res => {
                        this.baseInfoData.id = res.data.id;
                        this.baseInfoData.code = res.data.code;
                        this.baseInfoData.name = res.data.name;
                        this.baseInfoData.createTime = [res.data.startTime,res.data.endTime];
                        this.baseInfoData.lineId = res.data.lineId;
                        this.baseInfoData.projectId = res.data.projectId;
                        this.baseInfoData.trainDays = res.data.trainDays;
                        this.baseInfoData.areaId = res.data.areaId;
                        this.baseInfoData.batchNo = res.data.batchNo;
                        this.baseInfoData.classNo = res.data.classNo;
                        this.baseInfoData.teacherName = res.data.teacherName;
                        this.baseInfoData.teacherId = res.data.teacherId;
                        this.baseInfoData.lecturerName = res.data.lecturerName;
                        this.baseInfoData.lecturerId = res.data.lecturerId;
                        this.baseInfoData.description = res.data.description;
                        if(res.data.usedId){
                            this.baseInfoData.siteName = '已预约';
                            this.usedId = res.data.usedId;
                        }
                        this.classIsShow = true;
                    })
            },
            preservationSubmit(formName){ // 保存 提交
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.lineData.forEach((item) => {
                            if(item.id == this.baseInfoData.lineId){
                                this.baseInfoData.lineName = item.knowName;
                            }
                        });
                        this.projectData[this.baseInfoData.lineId].forEach((item) => {
                            if(item.id == this.baseInfoData.projectId){
                                this.baseInfoData.projectName = item.knowName;
                            }
                        });
                    }
                    if(valid && this.$route.query.copy !== 'copy'){
                        axiosPost('/educateMgr/plan/save',{
                            id: this.baseInfoData.id,
                            name: this.baseInfoData.name,
                            startTime: this.baseInfoData.createTime[0],
                            endTime: this.baseInfoData.createTime[1],
                            trainDays: this.baseInfoData.trainDays,
                            lineName: this.baseInfoData.lineName,
                            lineId: this.baseInfoData.lineId,
                            projectName: this.baseInfoData.projectName,
                            projectId: this.baseInfoData.projectId,
                            areaName: this.dictionariesNameData[this.baseInfoData.areaId],
                            areaId: this.baseInfoData.areaId,
                            batchNo: this.baseInfoData.batchNo,
                            classNo: this.baseInfoData.classNo,
                            teacherName: this.baseInfoData.teacherName,
                            teacherId: this.baseInfoData.teacherId,
                            lecturerName: this.baseInfoData.lecturerName,
                            lecturerId: this.baseInfoData.lecturerId,
                            description: this.baseInfoData.description,
                            usedId: this.usedId == -1 ? '' : this.usedId,
                            noRepeat: '.no-repeat-click'
                        })
                            .then(res => {
                                this.$router.push({path: '/participants',query:{id: res.data}});
                            })
                    }else if(valid && this.$route.query.copy === 'copy'){
                        axiosPost('/educateMgr/plan/copy',{
                            copyId: this.baseInfoData.id,
                            name: this.baseInfoData.name,
                            startTime: this.baseInfoData.createTime[0],
                            endTime: this.baseInfoData.createTime[1],
                            trainDays: this.baseInfoData.trainDays,
                            lineName: this.baseInfoData.lineName,
                            lineId: this.baseInfoData.lineId,
                            projectName: this.baseInfoData.projectName,
                            projectId: this.baseInfoData.projectId,
                            areaName: this.dictionariesNameData[this.baseInfoData.areaId],
                            areaId: this.baseInfoData.areaId,
                            batchNo: this.baseInfoData.batchNo,
                            classNo: this.baseInfoData.classNo,
                            teacherName: this.baseInfoData.teacherName,
                            teacherId: this.baseInfoData.teacherId,
                            lecturerName: this.baseInfoData.lecturerName,
                            lecturerId: this.baseInfoData.lecturerId,
                            description: this.baseInfoData.description,
                            usedId: this.usedId == -1 ? '' : this.usedId
                        })
                            .then(res => {
                                this.$router.push({path: '/participants',query:{id: res.data}});
                            })
                    }
                })
            },
            selectPersonnel(){ // 班主任 选择人员
                this.selectConfigIsShow = true;
                this.types = ["TEACHER"];
            },
            getDataFun(res){ // 班主任 获取数据
                this.baseInfoData.teacherName = res[0].userName;
                this.baseInfoData.teacherId = res[0].userId;
            },
            getCloseFun(res){ // 班主任 弹窗是否关闭
                this.selectConfigIsShow = res;
            },
            selectPersonnel2(){ // 讲师选择选择人员
                this.selectConfigIsShow2 = true;
                this.types = ["LECTURER"];
            },
            getDataFun2(res){ // 讲师选择 获取数据
                this.baseInfoData.lecturerName = res[0].userName;
                this.baseInfoData.lecturerId = res[0].userId;
            },
            getCloseFun2(res){ // 讲师选择 弹窗是否关闭
                this.selectConfigIsShow2 = res;
            },
            getCloseFun3(res){ // 教室选择 弹窗是否关闭
                this.dialogVisible = res;
            },
            selectClass(){ // 教室选择
                this.reserveIsShow = true;
            },
            projectChange(){
                this.baseInfoData.projectId = '';
            },
            getAppointDataFun(param){ // 接收预约数据
                this.usedId = param.usedId;
                this.baseInfoData.siteName = '已预约';
            },
            getClose4(){
                this.reserveIsShow = false;
            },
            reserveData(param){ // 教室预约 zhiyong.li
                this.usedId = param;
                if(this.usedId != -1){
                    this.baseInfoData.siteName = '已预约';
                }else{
                    this.baseInfoData.siteName = '';
                }
            }
        },
        watch:{
            'baseInfoData.createTime': function(newVal){
                if(newVal !== null){
                    let trainDays = (new Date(newVal[1]) - new Date(newVal[0]))/(1000*60*60*24);
                    if(trainDays>=0 && trainDays<1){
                        this.baseInfoData.trainDays = 1;
                    }else{
                        this.baseInfoData.trainDays = trainDays+1;
                    }
                }else{
                    this.baseInfoData.trainDays = '';
                }
            },
            'baseInfoData.teacherId': function(val){ // 班主任
                this.existingData = [{userId: val}];
            },
            'baseInfoData.lecturerId': function(val){ // 讲师
                this.existingData2 = [{userId: val}];
            }
        }
}
</script>
<style scoped>
    .preservation-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }
    .preservation-container .el-input,.preservation-container .el-select{
        width: 160px;
    }
    .preservation-container .el-input,.preservation-container .el-select,.preservation-container .el-textarea{
        width: 160px;
    }
    .preservation-container >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
</style>

