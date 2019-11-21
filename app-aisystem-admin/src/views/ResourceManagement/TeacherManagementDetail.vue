<!--@menu 班主任管理详情 @author dongjie.zhu-->
<template>
    <div class="teacherManagementDetail">
        <h2 class="title-h2">班主任详情</h2>
        <div class="search-container">
            <ul class="detail-list clearfix">
                <li>
                    <span class="left-tit">用户ID</span>
                    <span class="doc-context" >{{infoData.userId}}</span>
                </li>
                <li>
                    <span class="left-tit">用户姓名</span>
                    <span class="doc-context">{{infoData.userName}}</span>
                </li>
                <li>
                    <span class="left-tit">身份证号</span>
                    <span class="doc-context">{{infoData.idNo}}</span>
                </li>
                <li>
                    <span class="left-tit">手机号码</span>
                    <span class="doc-context">{{infoData.mobile}}</span>
                </li>
                <li>
                    <span class="left-tit">邮箱地址</span>
                    <span class="doc-context">{{infoData.email}}</span>
                </li>
                <li>
                    <span class="left-tit">登录帐号</span>
                    <span class="doc-context">{{infoData.userAccount}}</span>
                </li>
                <li>
                    <span class="left-tit">所属机构</span>
                    <span class="doc-context" >{{infoData.orgName}}</span>
                </li>
                <li>
                    <span class="left-tit">用户状态</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.status]}}</span>
                </li>
                <li>
                    <span class="left-tit">班主任编号</span>
                    <span class="doc-context">{{infoData.number}}</span>
                </li>
                <li>
                    <span class="left-tit">性别</span>
                    <span class="doc-context">{{infoData.gender}}</span>
                </li>
                <li>
                    <span class="left-tit">入职日期</span>
                    <span class="doc-context">{{infoData.entryTime}}</span>
                </li>
                <li>
                    <span class="left-tit">工龄</span>
                    <span class="doc-context">{{infoData.workAge}}</span>
                </li>
<!--                <li>-->
<!--                    <span class="left-tit">区域</span>-->
<!--                    <span class="doc-context">{{dictionariesNameData[infoData.area]}}</span>-->
<!--                </li>-->
                <li>
                    <span class="left-tit">职级</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.userRank]}}</span>
                </li>
                <li>
                    <span class="left-tit">星级</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.level]}}</span>
                </li>
                <li>
                    <span class="left-tit">奖励荣誉</span>
                    <span class="doc-context">{{infoData.honor}}</span>
                </li>
                <li>
                    <span class="left-tit">擅长课程</span>
                    <span class="doc-context">{{infoData.skilled}}</span>
                </li>
                <li>
                    <span class="left-tit">状态</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.onJob]}}</span>
                </li>
                <li class="wid100">
                    <span class="left-tit">备注</span>
                    <span class="doc-context">{{infoData.userDesc}}</span>
                </li>
            </ul>
        </div>
        <div class="button-container">
            <el-button class="el-btn-min-100" size="small" type="primary" @click="back()">返 回</el-button>
        </div>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesNameData,getOrgNameData} from "@/assets/js/api";

    export default {
        name: "TeacherManagementDetail",
        data() { // 存储数据
            return {
                infoDataAll:[],  //全部返回数据
                infoData:{ // 详情Info数据
                    userId: '',     //用户ID
                    userName: '',   //用户姓名
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '',      //登录帐号
                    orgId: '',    //所属机构
                    orgName: '',    //所属机构名
                    status: '',     //用户状态
                    number: '',     //班主任编号
                    gender: '',     //性别
                    entryTime: '',     //入职日期
                    workAge:'',     //工龄
                    // area:'',        //区域
                    userRank: '',       //职级
                    level: '',      //星级
                    honor:'',       //奖励荣誉
                    skilled: '',    //擅长课程
                    onJob:'',       //状态
                    userDesc:'',    //备注多行文本
                },
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                orgNameData:[],//获取全部机构名称
            }
        },
        created(){  //创建生命周期

            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getOrgNameData().then(res =>{   //获取全部机构名称
                this.orgNameData = res;
            });

            axiosPost('/resourceMgr/teacher/info', {
                userId: this.$route.query.userId,  //主键id
            }).then( res => {
                this.infoDataAll = res.data;
                if(this.infoDataAll !== null || this.infoDataAll === ''){
                    this.infoData.userId = res.data.userId;        //用户ID
                    this.infoData.userName = res.data.userName;    //用户姓名
                    this.infoData.idNo = res.data.idNo;            //身份证号
                    this.infoData.mobile = res.data.mobile;        //手机号码
                    this.infoData.email = res.data.email;          //邮箱地址
                    this.infoData.userAccount = res.data.userAccount;          //登录帐号
                    this.infoData.orgId = res.data.orgId;          //所属机构
                    this.infoData.status = res.data.status;        //用户状态
                    this.infoData.number = res.data.number;         //班主任编号
                    this.infoData.gender = res.data.gender;         //性别
                    this.infoData.entryTime = res.data.entryTime;         //入职日期
                    this.infoData.workAge = res.data.workAge;       //工龄
                    // this.infoData.area = res.data.area;             //区域
                    this.infoData.userRank = res.data.userRank;            //职级
                    this.infoData.level = res.data.level;           //星级
                    this.infoData.honor = res.data.honor;           //奖励荣誉
                    this.infoData.skilled = res.data.skilled;       //擅长课程
                    this.infoData.onJob = res.data.onJob;           //状态
                    this.infoData.userDesc = res.data.userDesc;   //备注
                    this.infoData.orgName = (this.infoData.orgId !== '' && this.infoData.orgId !== null) ? this.orgNameData[this.infoData.orgId].orgName:''; //机构名称

                }
            });
        },
        methods:{
            back() {
                this.$router.back();
            }
        },
    }
</script>

<style scoped lang="scss">
    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }
    .detail-list li {
        width:30%;
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
    .detail-list li.wid100 {
        width:100%;
        padding:10px 0 0 0;
    }
    .button-container {
        text-align: center;
        margin-top: 20px;
    }
</style>