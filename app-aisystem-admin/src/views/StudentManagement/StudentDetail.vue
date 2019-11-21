<template><!-- 学员信息管理详情  zhiyong.li  -->
    <div class="student-detail">
        <h2 class="title-h2">学员信息详情</h2>
        <div class="detail-content">
            <ul class="clearfix loading-table">
                <li class="clearfix fl"><span class="title fl">姓名：</span><span class="info fl">{{ studentInfo.userName }}</span></li>
                <li class="clearfix fl"><span class="title fl">身份证号：</span><span class="info fl">{{ studentInfo.idNo }}</span></li>
                <li class="clearfix fl"><span class="title fl">性别：</span><span class="info fl">{{ studentInfo.gender }}</span></li>
                <li class="clearfix fl"><span class="title fl">出生日期：</span><span class="info fl">{{ studentInfo.birthDay }}</span></li>
                <li class="clearfix fl"><span class="title fl">年龄：</span><span class="info fl">{{ studentInfo.age }}</span></li>
                <li class="clearfix fl"><span class="title fl">手机号码：</span><span class="info fl">{{ studentInfo.mobile }}</span></li>
                <li class="clearfix fl"><span class="title fl">邮箱地址：</span><span class="info fl">{{ studentInfo.email }}</span></li>
                <li class="clearfix fl"><span class="title fl">登陆账号：</span><span class="info fl">{{ studentInfo.userAccount }}</span></li>
                <li class="clearfix fl"><span class="title fl">工作地：</span><span class="info fl">{{ dictionariesNameData[studentInfo.area] }}</span></li>
                <li class="clearfix fl"><span class="title fl">产线/项目：</span><span class="info fl">{{ Object.keys(mapNameData).length>0 && studentInfo.knowId ? mapNameData[studentInfo.knowId].knowName : '' }}</span></li>
                <li class="clearfix fl"><span class="title fl">最高学历：</span><span class="info fl">{{ dictionariesNameData[studentInfo.educationBg] }}</span></li>
                <li class="clearfix fl"><span class="title fl">毕业学校：</span><span class="info fl">{{ studentInfo.graduatedFrom }}</span></li>
                <li class="clearfix fl"><span class="title fl">籍贯：</span><span class="info fl">{{ studentInfo.nativePlace }}</span></li>
                <li class="clearfix fl"><span class="title fl">组织机构：</span><span class="info fl">{{ Object.keys(orgNameData).length>0 && studentInfo.orgId ? orgNameData[studentInfo.orgId].orgName : '' }}</span></li>
                <li class="clearfix fl"><span class="title fl">员工属性：</span><span class="info fl">{{ studentInfo.staffType }}</span></li>
                <li class="clearfix fl"><span class="title fl">人事工号：</span><span class="info fl">{{ studentInfo.jobNo }}</span></li>
                <li class="clearfix fl"><span class="title fl">招聘渠道：</span><span class="info fl">{{ dictionariesNameData[studentInfo.recruitFrom] }}</span></li>
                <li class="clearfix fl"><span class="title fl">招聘负责人：</span><span class="info fl">{{ studentInfo.recruiter }}</span></li>
                <li class="clearfix fl"><span class="title fl">内荐人编号：</span><span class="info fl">{{ studentInfo.recommender }}</span></li>
                <li class="clearfix fl"><span class="title fl">用工形式：</span><span class="info fl">{{ studentInfo.workType }}</span></li>
                <li class="clearfix fl"><span class="title fl">入职日期：</span><span class="info fl">{{ studentInfo.entryTime }}</span></li>
                <li class="clearfix fl"><span class="title fl">岗位名称：</span><span class="info fl">{{ dictionariesNameData[studentInfo.position] }}</span></li>
                <li class="clearfix fl"><span class="title fl">职级：</span><span class="info fl">{{ dictionariesNameData[studentInfo.userRank] }}</span></li>
                <li class="clearfix fl"><span class="title fl">员工期数：</span><span class="info fl">{{ studentInfo.batchNo }}</span></li>
                <li class="clearfix fl"><span class="title fl">员工班次：</span><span class="info fl">{{ studentInfo.classNo }}</span></li>
                <li class="clearfix fl"><span class="title fl">是否报到：</span><span class="info fl">{{ dictionariesNameData[studentInfo.isRegisted] }}</span></li>
                <li class="clearfix fl"><span class="title fl">预报到时间：</span><span class="info fl">{{ studentInfo.preRegistDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">报到日期：</span><span class="info fl">{{ studentInfo.registDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">通用讲师：</span><span class="info fl">{{ studentInfo.genericLecturer }}</span></li>
                <li class="clearfix fl"><span class="title fl">通用开始日期：</span><span class="info fl">{{ studentInfo.genericStartDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">通用结束日期：</span><span class="info fl">{{ studentInfo.genericEndDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">班主任：</span><span class="info fl">{{ studentInfo.teacher }}</span></li>
                <li class="clearfix fl"><span class="title fl">业务讲师：</span><span class="info fl">{{ studentInfo.professionalLecturer }}</span></li>
                <li class="clearfix fl"><span class="title fl">业务开始日期：</span><span class="info fl">{{ studentInfo.professionalStartDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">业务结束日期：</span><span class="info fl">{{ studentInfo.professionalEndDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">合同签约日期：</span><span class="info fl">{{ studentInfo.contractSignDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">上岗日期：</span><span class="info fl">{{ studentInfo.boardDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">首月结束日期：</span><span class="info fl">{{ studentInfo.firstMonthEndDate }}</span></li>
                <li class="clearfix fl"><span class="title fl">转岗日期：</span><span class="info fl">{{ studentInfo.transferPostDate }}</span></li>
                <li class="clearfix fl"><span class="title fl" style="width:130px;">未签合同离职日期：</span><span class="info fl" style="width: calc(100% - 130px);">{{ studentInfo.noSignLeaveDate }}</span></li>
                <li class="clearfix fl"><span class="title fl" style="width:130px;">未签合同离职原因：</span><span class="info fl" style="width: calc(100% - 130px);">{{ studentInfo.noSignLeaveReason }}</span></li>
            </ul>
        </div>
        <div class="back-button">
            <el-button type="primary" @click="$router.go(-1)" class="el-btn-min-100 " size="small">返回</el-button>
        </div>
    </div>
</template>
<script>
    import { axiosPost,getDictionariesNameData,getMapNameData,getOrgNameData } from "@/assets/js/api";

    export default {
        name: 'studentDetail',
        data(){
            return {
                dictionariesNameData: {}, // 获取基本类型字典项数据的某个值
                mapNameData: {}, // 获取知识体系字典项数据的某个值
                orgNameData: {}, // 获取机构字典项数据的某个值
                studentInfo:{

                }
            }
        },
        created(){
            getDictionariesNameData().then(res => { // 获取基本类型字典项数据的某个值
                this.dictionariesNameData = res;
            });
            getMapNameData().then(res => { // 获取知识体系字典项数据的某个值
                this.mapNameData = res;
            });
            getOrgNameData().then(res => { // 获取机构字典项数据的某个值
                this.orgNameData = res;
            });
            if(this.$route.query.userId){ // 详情
                this.getInfo(this.$route.query.userId);
            }
        },
        methods:{
            getInfo(userId){ // 详情
                axiosPost('/resourceMgr/student/info',{
                    userId: userId, // 用户id
                    loading: '.loading-table'
                }).then((res) => {
                    this.studentInfo = Object.assign({},res.data);
                    if(this.studentInfo.idNo){
                        this.studentInfo.gender = this.getGender(this.studentInfo.idNo);
                        this.studentInfo.birthDay = this.getDateBirth(this.studentInfo.idNo);
                        this.studentInfo.age = this.getAge(this.studentInfo.idNo);
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
            }
        }
    }
</script>
<style scoped>
    .detail-content .title{
        font-size:14px;
        color: #999;
    }
    .detail-content .info{
        font-size:14px;
        color: #333;
    }
    .detail-content ul{
        margin-top: 30px;
    }
    .detail-content ul li{
        width: 25%;
        line-height: 16px;
        margin-bottom: 30px;
    }
    .detail-content li span:first-child{
        width: 100px;
        text-align: right;
    }
    .detail-content li span:last-child{
        padding-left: 3px;
        width: calc(100% - 100px);
        word-wrap: break-word;
        word-break: normal;
    }
    .back-button{
        text-align: center;
        margin-top: 50px;
    }
</style>
