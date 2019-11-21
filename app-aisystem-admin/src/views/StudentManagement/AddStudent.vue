<template><!-- 新增学员/编辑学员  zhiyong.li  -->
    <div class="add-student">
        <h2 class="title-h2" v-if="routeName === 'add-student'">学员信息管理\新增学员</h2>
        <h2 class="title-h2" v-if="routeName === 'edit-student'">学员信息管理\编辑学员</h2>
        <div class="add-container">
            <p class="student-title">人事信息</p>
            <el-form :inline="true" :model="addData" :rules="rules" class="demo-form-inline" label-width="100px" ref="addStudent">
                <el-form-item label="姓名" prop="userName" size="small">
                    <el-input v-model="addData.userName" placeholder="请输入姓名" style="width: 100px;"></el-input>
                    <el-button type="primary" size="mini" style="padding:10px 16px;margin-left: 11px;" @click="selectPersonal" v-if="routeName === 'add-student'">选择人员</el-button>
                    <el-button type="primary" size="mini" style="padding:10px 16px;margin-left: 11px;" v-if="routeName === 'edit-student'" disabled>选择人员</el-button>
                </el-form-item>
                <el-form-item label="身份证号" prop="idNo" size="small">
                    <el-input v-model="addData.idNo" placeholder="请输入身份证号码" @blur="idNoBlur('addStudent')"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="small">
                    <el-input v-model="addData.gender" placeholder="自动计算" disabled></el-input>
                </el-form-item>
                <el-form-item label="出生日期" size="small">
                    <el-input v-model="addData.birthDay" placeholder="自动计算" disabled></el-input>
                </el-form-item>
                <el-form-item label="年龄" size="small">
                    <el-input v-model="addData.age" placeholder="自动计算" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile" size="small">
                    <el-input v-model="addData.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" prop="email" size="small">
                    <el-input v-model="addData.email" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>
                <el-form-item label="登陆账号" prop="userAccount" size="small">
                    <el-input v-model.trim="addData.userAccount" placeholder="请输入登陆账号"></el-input>
                </el-form-item>
                <el-form-item label="工作地" size="small">
                    <el-select v-model="addData.area" placeholder="请选择工作地">
                        <el-option v-for="(item,ind) in dictionariesAllData['area']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产线/项目" size="small">
                    <treeselect v-model="addData.knowId"
                                :options="knowLineAllData"
                                placeholder="请选择产线/项目"
                                :disable-branch-nodes="true"
                                :clearable="false"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                    />
                </el-form-item>
                <el-form-item label="最高学历" size="small">
                    <el-select v-model="addData.educationBg" placeholder="请选择最高学历">
                        <el-option v-for="(item,ind) in dictionariesAllData['educationBg']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="毕业学校" size="small" prop="graduatedFrom">
                    <el-input v-model="addData.graduatedFrom" placeholder="请输入毕业学校"></el-input>
                </el-form-item>
                <el-form-item label="籍贯" size="small" prop="nativePlace">
                    <el-input v-model="addData.nativePlace" placeholder="请输入籍贯"></el-input>
                </el-form-item>
                <el-form-item label="组织机构" size="small">
                    <treeselect v-model="addData.orgId"
                                :options="orgData"
                                :clearable="false"
                                noResultsText="未找到，请重新输入"
                                placeholder="请选择组织机构"
                    />
                </el-form-item>
                <el-form-item label="员工属性" size="small" prop="staffType">
                    <el-input v-model="addData.staffType" placeholder="请输入员工属性"></el-input>
                </el-form-item>
                <el-form-item label="人事工号" size="small" prop="jobNo">
                    <el-input v-model="addData.jobNo" placeholder="请输入人事工号"></el-input>
                </el-form-item>
                <el-form-item label="招聘渠道" size="small" prop="">
                    <el-select v-model="addData.recruitFrom" placeholder="请选择招聘渠道">
                        <el-option v-for="(item,ind) in dictionariesAllData['recruitFrom']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="招聘负责人" size="small" prop="recruiter">
                    <el-input v-model="addData.recruiter" placeholder="请输入招聘负责人"></el-input>
                </el-form-item>
                <el-form-item label="内荐人编号" size="small" prop="recommender">
                    <el-input v-model="addData.recommender" placeholder="请输入内荐人编号"></el-input>
                </el-form-item>
                <el-form-item label="用工形式" size="small" prop="workType">
                    <el-input v-model="addData.workType" placeholder="请输入用工形式"></el-input>
                </el-form-item>
                <el-form-item label="入职日期" size="small">
                    <el-date-picker
                            v-model="addData.entryTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择入职日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="岗位名称" size="small">
                    <el-select v-model="addData.position" placeholder="请选择岗位名称">
                        <el-option v-for="(item,ind) in dictionariesAllData['position']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职级" size="small">
                    <el-select v-model="addData.userRank" placeholder="请选择职级">
                        <el-option v-for="(item,ind) in dictionariesAllData['userRank']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <p class="student-title">培训信息</p>
                <el-form-item label="员工期数" size="small" prop="batchNo">
                    <el-input v-model="addData.batchNo" placeholder="请输入员工期数"></el-input>
                </el-form-item>
                <el-form-item label="员工班次" size="small" prop="classNo">
                    <el-input v-model="addData.classNo" placeholder="请输入员工班次"></el-input>
                </el-form-item>
                <el-form-item label="是否报到" size="small">
                    <el-select v-model="addData.isRegisted" placeholder="请选择是否报到">
                        <el-option v-for="(item,ind) in dictionariesAllData['isRegisted']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预报到时间" size="small">
                    <el-date-picker
                            v-model="addData.preRegistDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择预报到时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报到日期" size="small">
                    <el-date-picker
                            v-model="addData.registDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择报到时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="通用讲师" size="small" prop="genericLecturer">
                    <el-input v-model="addData.genericLecturer" placeholder="请输入通用讲师"></el-input>
                </el-form-item>
                <el-form-item label="通用开始日期" size="small">
                    <el-date-picker
                            v-model="addData.genericStartDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="通用结束日期" size="small">
                    <el-date-picker
                            v-model="addData.genericEndDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="班主任" size="small" prop="teacher">
                    <el-input v-model="addData.teacher" placeholder="请输入班主任"></el-input>
                </el-form-item>
                <el-form-item label="业务讲师" size="small" prop="professionalLecturer">
                    <el-input v-model="addData.professionalLecturer" placeholder="请输入业务讲师"></el-input>
                </el-form-item>
                <el-form-item label="业务开始日期" size="small">
                    <el-date-picker
                            v-model="addData.professionalStartDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="业务结束日期" size="small">
                    <el-date-picker
                            v-model="addData.professionalEndDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合同签约日期" size="small">
                    <el-date-picker
                            v-model="addData.contractSignDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择签约日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="上岗日期" size="small">
                    <el-date-picker
                            v-model="addData.boardDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择上岗日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="首月结束日期" size="small">
                    <el-date-picker
                            v-model="addData.firstMonthEndDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="转岗日期" size="small">
                    <el-date-picker
                            v-model="addData.transferPostDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择转岗日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="未签合同离职日期" label-width="150px" size="small">
                    <el-date-picker
                            v-model="addData.noSignLeaveDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择离职日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="未签合同离职原因" label-width="150px" size="small" prop="noSignLeaveReason">
                    <el-input type="textarea" v-model="addData.noSignLeaveReason" placeholder="请输入原因"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="button-container2">
            <el-button type="primary" @click="preservationSubmit('addStudent')" class="el-btn-min-100 no-repeat-click" size="small">保存</el-button>
            <el-button @click="backList" class="el-btn-min-100" size="small">取消</el-button>
        </div>
        <PersonnelSelection v-if="selectConfigIsShow" :selectConfigIsShow="selectConfigIsShow" :types="types" cascadeOrg="cascadeOrg" dataLength="1" withOut="widthOut" :existingData="existingData" @listenEventData="getDataFun" @listenEventClose="getCloseFun"></PersonnelSelection>
    </div>
</template>
<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import PersonnelSelection from '@/components/PersonnelSelection'
    import { axiosPost,getDictionariesAllData,getKnowLineAllData,getOrgAllData } from "@/assets/js/api";
    import { idValidate,mobileValidate } from "@/assets/js/verification";

    export default {
        name: "add-student",
        components:{
            Treeselect,
            PersonnelSelection
        },
        data(){
            return {
                selectConfigIsShow: false, // 选择人员弹窗是否显示
                types: ['STUDENT'], // 选择类型
                cascadeOrg: 'true', // 是否级联
                addData:{ // 新增数据
                    userId: '', // 用户id
                    userName: '', // 姓名
                    idNo: '', // 身份证号
                    gender: '', // 性别
                    birthDay: '', // 出生日期
                    age: '', // 年龄
                    mobile: '', // 手机号码
                    email: '', // 邮箱地址
                    userAccount: '', // 登陆账号
                    area: '', // 工作地
                    knowId: null, // 产线/项目
                    educationBg: '', // 最高学历
                    graduatedFrom: '', // 毕业学校
                    nativePlace: '', // 籍贯
                    orgId: null, // 所属机构
                    staffType: '', // 员工属性
                    jobNo: '', // 人事工号
                    recruitFrom: '', // 招聘渠道
                    recruiter: '', // 招聘负责人
                    recommender: '', // 内荐人编号
                    workType: '', // 用工形式
                    entryTime: '', // 入职日期
                    position: '', // 岗位名称
                    userRank: '', // 职级
                    batchNo: '', // 员工期数
                    classNo: '', // 员工班次
                    isRegisted: '', // 是否报到
                    preRegistDate: '', // 预报到时间
                    registDate: '', // 报到日期
                    genericLecturer: '', // 通用讲师
                    genericStartDate: '', // 通用开始日期
                    genericEndDate: '', // 通用结束日期
                    teacher: '', // 班主任
                    professionalLecturer: '', // 业务讲师
                    professionalStartDate: '', // 业务开始日期
                    professionalEndDate: '', // 业务结束日期
                    contractSignDate: '', // 合同签约日期
                    boardDate: '', // 上岗日期
                    firstMonthEndDate: '', // 首月结束日期
                    transferPostDate: '', // 转岗日期
                    noSignLeaveDate: '', // 未签合同离职日期
                    noSignLeaveReason: '' // 未签合同离职原因
                },
                rules: { // 新增的规则
                    userName: [
                        { required: true, message: '请输入姓名',trigger: 'blur'},
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    idNo: [
                        { required: true, message: '请输入身份证号',trigger: 'blur'},
                        { validator: idValidate,trigger: ['blur','change']},
                        { max: 18, message: '长度应小于等于18个字符', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码',trigger: 'blur'},
                        { validator: mobileValidate,trigger: 'blur'},
                        { max: 11, message: '长度应小于等于11个字符', trigger: 'blur' }
                    ],
                    email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    userAccount: [
                        { required: true, message: '请输入登陆账号',trigger: 'blur'},
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    graduatedFrom:[
                        { max: 128, message: '长度应小于等于128个字符', trigger: 'blur' }
                    ],
                    nativePlace:[
                        { max: 256, message: '长度应小于等于256个字符', trigger: 'blur' }
                    ],
                    staffType:[
                        { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                    ],
                    jobNo:[
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    recruiter:[
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    recommender:[
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    workType:[
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    batchNo:[
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    classNo:[
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    genericLecturer:[
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    teacher:[
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    professionalLecturer:[
                        { max: 16, message: '长度应小于等于16个字符', trigger: 'blur' }
                    ],
                    noSignLeaveReason:[
                        { max: 256, message: '长度应小于等于256个字符', trigger: 'blur' }
                    ]
                },
                dictionariesAllData: [],// 基本类型字典项数据
                knowLineAllData: [], // 知识体系字典项数据(仅获取产线项目)
                orgData: [], // 机构数据
                interfaceUrl: '/resourceMgr/student/create', // 接口url
                routeName: '',
                existingData:[], //传递的数据
            }
        },
        created(){
            getDictionariesAllData().then(res => { // 基本类型字典项数据
                this.dictionariesAllData = res;
            });
            getKnowLineAllData().then(res => { // 知识体系字典项数据(仅获取产线项目)
                this.knowLineAllData = res;
            });
            getOrgAllData().then(res => { // 机构字典项数据
                this.orgData = res;
            });
            this.routeName = this.$route.name;
            if(this.routeName === 'edit-student' && this.$route.query.userId){
                this.getInfo(this.$route.query.userId);
                this.interfaceUrl = '/resourceMgr/student/alter';
            }
        },
        methods:{
            getInfo(userId){ // 获取用户信息
                axiosPost('/resourceMgr/student/info',{
                    userId: userId, // 用户id
                }).then((res) => {
                    Object.assign(this.addData,res.data);
                    if(this.addData.idNo){
                        this.addData.gender = this.getGender(this.addData.idNo);
                        this.addData.birthDay = this.getDateBirth(this.addData.idNo);
                        this.addData.age = this.getAge(this.addData.idNo);
                    }
                });
            },
            idNoBlur(formName){ // 验证身份证号
                this.$refs[formName].validateField('idNo',(valid) => {
                    if(!valid){
                        this.addData.gender = this.getGender(this.addData.idNo);
                        this.addData.birthDay = this.getDateBirth(this.addData.idNo);
                        this.addData.age = this.getAge(this.addData.idNo);
                    }else{

                        this.addData.gender = '';
                        this.addData.birthDay = '';
                        this.addData.age = '';
                    }
                });
            },
            getGender(idNo){ // 获取性别
                if (parseInt(idNo.substr(16, 1)) % 2 == 1) {
                    return "男";
                } else {
                    return "女";
                }
            },
            getDateBirth(idNo){ // 获取出生日期
                return idNo.substring(6, 10) + "-" + idNo.substring(10, 12) + "-" + idNo.substring(12, 14);
            },
            getAge(idNo){ // 获取年龄 周岁
                let nowDate = new Date(), // 现在日期
                    month = nowDate.getMonth() + 1, // 当月
                    day = nowDate.getDate(), // 当天
                    age = nowDate.getFullYear() - idNo.substring(6, 10) - 1;
                if (idNo.substring(10, 12) < month || idNo.substring(10, 12) == month && idNo.substring(12, 14) <= day) {
                    age++;
                }
                return age;
            },
            preservationSubmit(formName){ // 保存
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost(this.interfaceUrl,{
                            userId: this.addData.userId, // 用户id
                            userName: this.addData.userName, // 姓名
                            idNo: this.addData.idNo, // 身份证号
                            gender: this.addData.gender, // 性别
                            birthDay: this.addData.birthDay, // 出生日期
                            age: this.addData.age, // 年龄
                            mobile: this.addData.mobile, // 手机号码
                            email: this.addData.email, // 邮箱地址
                            userAccount: this.addData.userAccount, // 登陆账号
                            area: this.addData.area, // 工作地
                            knowId: this.addData.knowId, // 产线/项目
                            educationBg: this.addData.educationBg, // 最高学历
                            graduatedFrom: this.addData.graduatedFrom, // 毕业学校
                            nativePlace: this.addData.nativePlace, // 籍贯
                            orgId: this.addData.orgId, // 所属机构
                            staffType: this.addData.staffType, // 员工属性
                            jobNo: this.addData.jobNo, // 人事工号
                            recruitFrom: this.addData.recruitFrom, // 招聘渠道
                            recruiter: this.addData.recruiter, // 招聘负责人
                            recommender: this.addData.recommender, // 内荐人编号
                            workType: this.addData.workType, // 用工形式
                            entryTime: this.addData.entryTime, // 入职日期
                            position: this.addData.position, // 岗位名称
                            userRank: this.addData.userRank, // 职级
                            batchNo: this.addData.batchNo, // 员工期数
                            classNo: this.addData.classNo, // 员工班次
                            isRegisted: this.addData.isRegisted, // 是否报到
                            preRegistDate: this.addData.preRegistDate, // 预报到时间
                            registDate: this.addData.registDate, // 报到日期
                            genericLecturer: this.addData.genericLecturer, // 通用讲师
                            genericStartDate: this.addData.genericStartDate, // 通用开始日期
                            genericEndDate: this.addData.genericEndDate, // 通用结束日期
                            teacher: this.addData.teacher, // 班主任
                            professionalLecturer: this.addData.professionalLecturer, // 业务讲师
                            professionalStartDate: this.addData.professionalStartDate, // 业务开始日期
                            professionalEndDate: this.addData.professionalEndDate, // 业务结束日期
                            contractSignDate: this.addData.contractSignDate, // 合同签约日期
                            boardDate: this.addData.boardDate, // 上岗日期
                            firstMonthEndDate: this.addData.firstMonthEndDate, // 首月结束日期
                            transferPostDate: this.addData.transferPostDate, // 转岗日期
                            noSignLeaveDate: this.addData.noSignLeaveDate, // 未签合同离职日期
                            noSignLeaveReason: this.addData.noSignLeaveReason, // 未签合同离职原因
                            noRepeat: '.no-repeat-click', // 防止重复点击
                        }).then(() => {
                            this.$router.push({path: '/student'});
                        });
                    }
                });
            },
            backList(){ // 取消
                this.$router.go(-1);
            },
            normalizer(node) { // 知识体系树
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },
            selectPersonal(){ //  选择人员弹窗开启
                this.selectConfigIsShow = true;
            },
            getCloseFun(res){ //  选择人员弹窗关闭
                this.selectConfigIsShow = res;
            },
            getDataFun(res){ //  选择人员获取数据
                this.addData.userName = res[0].userName;
                this.addData.userId = res[0].userId;
                axiosPost('/systemMgr/user/list2',{
                    userIds: [res[0].userId]
                })
                    .then(res => {
                        this.addData.idNo = res.data[0].idNo;
                        this.addData.mobile = res.data[0].mobile;
                        this.addData.area = res.data[0].area;
                        this.addData.nativePlace = res.data[0].nativePlace;
                        this.addData.orgId = res.data[0].orgId;
                        this.addData.jobNo = res.data[0].jobNo;
                        this.addData.position = res.data[0].position;
                        this.addData.userRank = res.data[0].userRank;
                        this.addData.email = res.data[0].email;
                        this.addData.userAccount = res.data[0].userAccount;
                        if(this.addData.idNo){
                            this.addData.gender = this.getGender(this.addData.idNo);
                            this.addData.birthDay = this.getDateBirth(this.addData.idNo);
                            this.addData.age = this.getAge(this.addData.idNo);
                        }
                    });
                this.interfaceUrl = '/resourceMgr/student/createByUser';
            },
        },
        watch: {
            'addData.userId': function(val){
                this.existingData = [{userId: val}];
            }
        }
    }
</script>

<style scoped>
    .add-container{
        margin-top: 20px;
    }
    .student-title{
        margin: 20px 0;
        font-size: 18px;
        font-weight: bold;
    }
    .vue-treeselect{
        width: 160px;
        float: left;
    }
    .el-select,.el-input,.el-textarea{
        width: 160px;
    }
    .add-container >>> .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 160px;
    }
    .demo-form-inline{
        border-bottom: 1px solid #EBEEF5;
    }
    .add-container >>> .el-textarea textarea{
        padding: 6px 15px 0 15px;
        height: 32px;
    }
    .button-container2{
        margin-top: 20px;
        text-align: center;
    }
</style>
