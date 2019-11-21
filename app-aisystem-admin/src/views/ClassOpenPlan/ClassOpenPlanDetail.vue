<template><!-- 开班计划详情 shuling.xiang-->
    <div class="class-open-plan-detail">
        <h2 class="title-h2">开班计划详情</h2>
        <div class="search-container">
            <ul class="detail-list clearfix">
                <li>
                    <span class="left-tit">计划编号：</span>
                    <span class="doc-context">{{planId}}</span>
                </li>
                <li>
                    <span class="left-tit">计划名称：</span>
                    <span class="doc-context">{{planName}}</span>
                </li>
                <li>
                    <span class="left-tit">所属区域：</span>
                    <span class="doc-context">{{areaId ? dictionariesNameData[areaId] : ''}}</span>
                </li>
                <li class="wid30">
                    <span class="left-tit">创建人：</span>
                    <span class="doc-context">{{createUser}}</span>
                </li>
                <li class="wid50">
                    <span class="left-tit">创建时间：</span>
                    <span class="doc-context">{{createTime}}</span>
                </li>
                <li class="wid30">
                    <span class="left-tit">审核人：</span>
                    <span class="doc-context">{{auditPerson}}</span>
                </li>
                <li class="wid50">
                    <span class="left-tit">审核时间：</span>
                    <span class="doc-context">{{auditTime}}</span>
                </li>
                <li class="wid100">
                    <span class="left-tit">审核意见：</span>
                    <span class="doc-context">{{auditMessage}}</span>
                </li>
                <li class="wid30">
                    <span class="left-tit">最后修改人：</span>
                    <span class="doc-context">{{updateUser}}</span>
                </li>
                <li class="wid50">
                    <span class="left-tit">修改时间：</span>
                    <span class="doc-context">{{updateTime}}</span>
                </li>
                <li class="wid100">
                    <span class="left-tit">相关附件：</span>
                    <span class="doc-context">
                        <a v-for="(item, index) in opFiles" :key="index" :href="item.readAbsoluteLocation" target="_blank">{{item.fileName}}</a>
<!--                        <a v-for="item in opFiles" :href="item .filePath">{{item .fileName}}</a>-->
                    </span>
                </li>
            </ul>
        </div>
        <div class="map-list">
                <div class="button-container">
                    <el-button class="el-btn-min-100" type="primary" @click="back" size="small">返回</el-button>
                </div>
        </div>
    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
    } from "@/assets/js/api"
    import GLOBAL from '@/assets/js/globalVariable.js';


    export default {
        name: "ClassOpenPlanDetail",
        data() { // 存储数据
            return {
                GLOBAL: GLOBAL,
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                area: '', //所属区域
                areaId: '', //区域Id
                planId:'', //计划编号
                planName: '', //计划名称
                createUser: '', //创建人
                createTime: '', //创建时间
                auditPerson: '', //审核人
                auditMessage: '', //审核意见
                auditTime: '', //审核时间
                updateUser: '', //最后修改人
                updateTime: '', //修改时间
                opFiles: [{ //附件
                    fileName: '',
                    filePath: '',
                    readAbsoluteLocation: '',
                    }
                ],
                areaOptions:[],
                fileList:[], //附件上传
                // 字典项
                dictData: {},
            }
        },
        created() { //创建完成 生命周期
            this.loadPreData();
            axiosPost('/educateMgr/openPlan/info',{
                id: this.$route.query.id
            })
                .then((res)=> {
                    this.docId = res.data.docId,
                    this.planId = res.data.planId,
                    this.planName = res.data.planName,
                    this.areaId = res.data.areaId,
                    this.createUser = res.data.createUser,
                    this.reportPerson = res.data.reportPerson,
                    this.createTime = res.data.createTime,
                    this.auditPerson = res.data.auditPerson,
                    this.auditTime = res.data.auditTime,
                    this.auditMessage = res.data.auditMessage,
                    this.updateUser = res.data.updateUser,
                    this.updateTime = res.data.updateTime,
                    this.opFiles = res.data.opFiles
                })
        },
        methods: {
            loadPreData() {

                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                        this.areaOptions = res['area_all'];
                    });

                getDictionariesNameData().then(res => { //获取全部数据字典名称
                    this.dictionariesNameData = res;
                });

            },
            back() {
                this.$router.go(-1);//返回
            },
        }
    }
</script>

<style scoped>
    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .el-input {
        width: 200px;
    }

    .button-container {
        text-align: center;
        margin-top: 20px;
    }
    .wid100 {
        width:100%;
    }
    .file-upload {
        display:inline-block;
        padding-right:30px;
    }
    .detail-list li {
        float:left;
        width:30%;
        padding:10px 0 0 0;
    }
    .detail-list li.wid100 {
        width:100%;
        padding:10px 0 0 0;
    }
    .detail-list li.wid30 {
        width:30%;
        padding:10px 0 0 0;
    }
    .detail-list li.wid50 {
        width:50%;
        padding:10px 0 0 0;
    }
    .detail-list .left-tit {
        display:inline-block;
        width:100px;
        font-size:16px;
        font-weight: bold;
        vertical-align: top;
    }
    .detail-list .doc-context {
        display:inline-block;
        font-size:14px;
    }
    .detail-list .doc-context a {display: block;}
</style>
