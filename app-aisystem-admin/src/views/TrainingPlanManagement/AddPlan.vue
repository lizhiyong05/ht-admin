<template><!-- 新增计划  zhiyong.li  -->
    <div class="add-plan">
        <el-button size="mini" class="back" @click="back">返回列表</el-button>
        <p class="module-title" v-if="!id || (id && copy)">新增培训计划</p>
        <p class="module-title" v-if="id && !copy">编辑培训计划</p>
        <div class="content">
            <ul class='nav'>
                <li @click="urlJump(0)" :class="{'router-link-active' : pathName == 'essential-information'}">
                    <i class="el-icon-tickets"></i>
                    <span>基本信息</span>
                </li>
                <li @click="urlJump(1)" :class="{'router-link-active' : pathName == 'participants'}">
                    <i class="el-icon-tickets"></i>
                    <span>参加人员</span>
                </li>
                <li :class="{'router-link-active' : pathName !== 'essential-information' && pathName !== 'participants'}">
                    <div class="menu-sub" @click="isShow = !isShow">
                        <i class="el-icon-tickets"></i>
                        <span>计划活动</span>
                        <i class="el-icon-arrow-down"></i>
                    </div>
                    <ul class="menu-subMenu" :style="{height: isShow ? '400px' : '0'}">
                        <li @click="urlJump(2)" :class="['active', pathName == 'planActCourse' ? 'on' : '']">授课</li>
                        <li @click="urlJump(3)" :class="['active', pathName == 'planActServey' ? 'on' : '']">调研</li>
                        <li @click="urlJump(4)" :class="['active', pathName == 'planActNotice' ? 'on' : '']">通知</li>
                        <li @click="urlJump(5)" :class="['active', pathName == 'planActSign' ? 'on' : '']">签到</li>
                        <li @click="urlJump(6)" :class="['active', pathName == 'planActTrain' ? 'on' : '']">对练</li>
                        <li @click="urlJump(7)" :class="['active', pathName == 'planActExam' ? 'on' : '']">考试</li>
                        <li @click="urlJump(8)" :class="['active', pathName == 'planActAssess' ? 'on' : '']">评估</li>
                        <li @click="urlJump(9)" :class="['active', pathName == 'planActCard' ? 'on' : '']">名牌</li>
                    </ul>
                    
                </li>
            </ul>
            <div class='plan-container'>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import {axiosPost} from "@/assets/js/api";
export default {
    name: 'AddPlan',
    data(){
        return {
            isShow: false,
            isShare: false,
        }
    },
    computed: {
        id() {
            return this.$route.query.id
        },
        copy() {
            return this.$route.query.copy
        },
        pathName() {
            return this.$route.name
        }
    },
    created() {
        if(this.pathName !== 'essential-information' && this.pathName !== 'participants') {
            this.isShow = true;
        }
        if(this.$route.query.isShare){
            this.isShare = this.$route.query.isShare;
        }
    },
    methods: {
        urlJump(ind){
            if(ind == 0){
                this.$router.push({path: '/essential-information',query:{id: this.id,isShare: this.isShare}})
                this.isShow = false;
            }else{
                if(this.id === undefined){
                    this.$message({message:'请填写基本信息后再操作',type: 'warning'});
                    return false;
                }
                if(this.copy === 'copy'){
                    this.$message({message:'请填写基本信息后再操作',type: 'warning'});
                    return false;
                }
                if(ind == 1){
                    this.$router.push({path: '/participants',query:{id: this.id,isShare: this.isShare}});
                    this.isShow = false;
                }else if(ind == 2){
                    this.$router.push({path: '/planning-activities-course',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 3){
                    this.$router.push({path: '/planning-activities-servey',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 4){
                    this.$router.push({path: '/planning-activities-notice',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 5){
                    this.$router.push({path: '/planning-activities-sign',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 6){
                    this.$router.push({path: '/planning-activities-train',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 7){
                    this.$router.push({path: '/planning-activities-exam',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 8){
                    this.$router.push({path: '/planning-activities-assess',query:{id: this.id,isShare: this.isShare}});
                }else if(ind == 9){
                    this.$router.push({path: '/planning-activities-card',query:{id: this.id,isShare: this.isShare}});
                }
            }
        },
        back() {
            this.$router.push('/training-plan-management')
        }
    }
}
</script>
<style scoped>
    .add-plan {
        position: relative;
    }
    .back {
        position: absolute;
        top: -5px;
        right: 20px;
    }
    .module-title {
        border-left: 4px solid #409EFF;
        padding-left: 10px;
        font-size: 22px;
        line-height: 20px;
        margin: 10px 0;
    }
    .content {
        margin-top: 20px;
        display: flex;
    }
    .nav {
        width: 160px;
        flex-shrink: 0;
    }
    .nav>li {
        font-size: 16px;
        line-height: 50px;
        cursor: pointer;
        color: #2c3e50;
        padding-left: 20px;
        margin-bottom: 20px;
        background: #F1F8FE;
        transition: all 0.3s;
        position: relative;
        left: 1px;
        border: 1px solid #F1F8FE;
        border-right-color: #BDE1FF;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .menu-sub {
        position: relative;
    }
    .nav>li i {
        margin-right: 10px;
    }
    .el-icon-arrow-down {
        position: absolute;
        top: 50%;
        margin-top: -7px;
        font-size: 12px;
        right: 10px;
    }
    .nav>li.router-link-active{
        background: #FFF;
        color: #409EFF;
        border-color: #BDE1FF;
        border-right-color: #fff;
    }
    .plan-container{
        flex: 1;
        padding: 15px;
        border: 1px solid #BDE1FF;
    }
    .menu-subMenu {
        transition: all 0.3s;
        overflow: hidden;
    }
    .active {
        font-size: 16px;
        line-height: 50px;
        color: #2c3e50;
        margin-left: 40px;
        transition: all 0.3s;
    }
    .active.on {
        color: #409EFF;
        list-style-type: disc;
    }
</style>
<style lang="scss">
    .activityPlan-box {
        em{font-style: italic!important;}
        .cellName {
            border: none;
        }
        .headerCellName {
            font-weight: normal;
            border: none !important;
            background: #f5f5f5;
            color: #666;
        }
        .el-table__row--striped .cellName {
            background: #F8FCFF !important;
        }
        .el-table::before {
            height: 0;
        }
        .el-table {
            box-shadow: 0 5px 8px 0 rgba(0,0,0,.05);
            margin: 20px 0;
        }
        .el-table span {
            padding-right: 0;
        }
        .el-pagination {
            margin-bottom: 20px;
        }
        .el-date-editor.el-input {
            width: 202px;
        }
        .module-title {
            border-left: 4px solid #409EFF;
            padding-left: 10px;
            font-size: 22px;
            line-height: 20px;
        }
        .btn-box {
            text-align: center;
        }
        textarea {
            font-family: inherit;
        }

        .tab-title {
            margin-bottom: 20px;
            padding-left: 30px;
            border-bottom: 1px solid #DCDFE6;
            height: 37px;
        }
        .tab-title>li {
            padding: 0 20px;
            float: left;
            line-height: 35px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            border-left: 1px solid #DCDFE6;
            border-top: 1px solid #DCDFE6;
        }
        .tab-title>li:last-child {
            border-right: 1px solid #DCDFE6;
            border-top-right-radius: 3px;
        }
        .tab-title>li:first-child {
            border-top-left-radius: 3px;
        }
        .tab-title>li.on {
            color: #409EFF;
            border-bottom: 1px solid #fff;
        }

        .tab-title-sub {
            margin-bottom: 20px;
        }
        .tab-title-sub>li {
            padding: 0 20px;
            float: left;
            line-height: 30px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
        }
        .tab-title-sub>li.on {
            color: #409EFF;
        }

        .input-box {
            background: #fff;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            padding: 0 10px;
            display: inline-block;
            height: 32px;
            line-height: 29px;
            width: 530px;
            margin-right: 15px;
            vertical-align: middle;
        }
        .vue-treeselect{
            width: 200px;
        }
        .tree-container .vue-treeselect {
            width: 180px;
        }
    }
</style>
