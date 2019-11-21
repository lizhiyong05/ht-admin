<template><!-- 计划活动  zhiyong.li  -->
    <div class='planning-activities'>
        <Course :common="common"></Course>
        <Servey :common="common"></Servey>
        <Notice :common="common"></Notice>
        <Sign :common="common"></Sign>
        <Train :common="common"></Train>
        <Exam :common="common"></Exam>
        <Assess :common="common"></Assess>
    </div>
</template>
<script>
import {axiosPost} from "@/assets/js/api";
import Course from './plan/Course'
import Exam from './plan/Exam'
import Notice from './plan/Notice'
import Sign from './plan/Sign'
import Train from './plan/Train'
import Servey from './plan/Servey'
import Assess from './plan/Assess'
export default {
    name: 'PlanningActivities',
    components: {
        Course, Assess, Servey, Train, Notice, Exam, Sign
    },
    data() {
        return {
            common: {
                planId: '1',
            }
        }
    },
    created() {
        axiosPost('/educateMgr/plan/course/list',{planId: this.common.planId}).then(res => {
            if(res.code == 1000) {
                this.common.course = res.data || [];
            }
        })
    }
}
</script>
<style lang="scss">
    .planning-activities {
        .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
            content: '';
        }
        .table-box {
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }
        .table-title {
            height: 40px;
            position: relative;
        }
        .cellName {
            border: none;
        }
        .headerCellName {
            font-weight: normal;
            border: none;
            background: #f5f5f5;
            color: #606266;
        }
        .title {
            display: inline-block;
            padding-left: 20px;
            color: #333;
            font-size: 16px;
            padding-top: 5px;
        }
        .btn {
            position: absolute;
            top: 0;
            right: 10px;
        }
        .btn-box {
            text-align: center;
            margin-top: 10px;
            button {
                width: 80px;
            }
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
        }
        .el-input {
            width: 220px;
            margin-right: 15px;
        }
        .pagination .el-pagination__editor.el-input {
            width: 50px;
            margin: 0;
        }
        .el-select {
            width: 235px;
        }
        .input-box {
            background: #fff;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            padding: 0 15px;
            display: inline-block;
            height: 36px;
            line-height: 32px;
            width: 530px;
            margin-right: 15px;
            vertical-align: middle;
        }
        .que-box {
            background: #fff;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            padding: 10px 15px;
            display: inline-block;
            min-height: 36px;
            line-height: 32px;
            width: 625px;
            margin-right: 15px;
            vertical-align: middle;
        }
        .info-box>div {
            width: 350px;
        }
        textarea {
            font-family: inherit;
        }
        .question-box {
            margin-bottom: 15px;
            line-height: 25px;
        }
        .opt {
            display: inline-block;
            margin-right: 10px;
        }
    }
</style>

