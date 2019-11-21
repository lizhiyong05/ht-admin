<!--@menu 讲师管理详情 @author dongjie.zhu-->
<template>
    <div class="lecturerManagementDetail">
        <h2 class="title-h2">讲师详情</h2>
        <div class="search-container">
            <ul class="detail-list clearfix">
                <li>
                    <span class="left-tit">用户ID</span>
                    <span class="doc-context">{{infoData.userId}}</span>
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
                    <span class="left-tit">讲师编号</span>
                    <span class="doc-context">{{infoData.number}}</span>
                </li>
                <li>
                    <span class="left-tit">职级</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.userRank]}}</span>
                </li>
<!--                <li>-->
<!--                    <span class="left-tit">区域</span>-->
<!--                    <span class="doc-context">{{dictionariesNameData[infoData.area]}}</span>-->
<!--                </li>-->
                <li>
                    <span class="left-tit">擅长课程</span>
                    <span class="doc-context">{{infoData.skilled}}</span>
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
                    <span class="left-tit">讲师类别</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.workTime]}}</span>
                </li>
                <li v-show="fullTimeContentIsShow">
                    <span class="left-tit">入职日期</span>
                    <span class="doc-context">{{infoData.entryTime}}</span>
                </li>
                <li v-show="fullTimeContentIsShow">
                    <span class="left-tit">工龄</span>
                    <span class="doc-context">{{infoData.workAge}}</span>
                </li>
                <li v-show="partTimeContentIsShow">
                    <span class="left-tit">课时费</span>
                    <span class="doc-context">{{infoData.cost}}</span>
                </li>
                <li v-show="partTimeContentIsShow">
                    <span class="left-tit">任命期限</span>
                    <span class="doc-context">{{infoData.dateLine}}</span>
                </li>
                <li v-show="partTimeContentIsShow">
                    <span class="left-tit">认证状态</span>
                    <span class="doc-context">{{dictionariesNameData[infoData.authentication]}}</span>
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
        <div class="border-card">
            <el-tabs type="border-card">
                <el-tab-pane label="已授权课程">
                    <div class="permit-table">
                        <el-table :data="recordsPermit" size="mini" border style="width: 100%" >
                            <el-table-column prop="code" align="center" label="课程编号" width="150px"> </el-table-column>
                            <el-table-column prop="knowledgePath" align="center" label="课程分类" > </el-table-column>
                            <el-table-column prop="type" align="center" label="课程类型"  > </el-table-column>
                            <el-table-column prop="name" align="center" label="课程名称"> </el-table-column>
                            <el-table-column prop="enabled" align="center" label="课程状态" >
                                <template slot-scope="scope">
                                    <em v-if="scope.row.enabled === true">启用</em>
                                    <em v-else>停用</em>
                                </template>
                            </el-table-column>
                            <el-table-column prop="studyMode" align="center" label="学习方式" ></el-table-column>
                            <el-table-column prop="duration" align="center" label="课程时长" > </el-table-column>
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
                    <div class="permit-history-table">
                        <el-table :data="recordsPermitHistory" size="mini" border style="width: 100%" >
                            <el-table-column prop="code" align="center" label="课程编号" width="150px"> </el-table-column>
                            <el-table-column prop="knowledgePath" align="center" label="课程分类" > </el-table-column>
                            <el-table-column prop="type" align="center" label="课程类型" > </el-table-column>
                            <el-table-column prop="name" align="center" label="课程名称"> </el-table-column>
                            <el-table-column prop="enabled" align="center" label="课程状态" >
                                <template slot-scope="scope">
                                    <em v-if="scope.row.enabled === true">启用</em>
                                    <em v-else>停用</em>
                                </template>
                            </el-table-column>
                            <el-table-column prop="studyMode" align="center" label="学习方式" ></el-table-column>
                            <el-table-column prop="duration" align="center" label="课程时长" > </el-table-column>
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
        <div class="button-container">
            <el-button class="el-btn-min-100" type="primary" @click="back()" size="small">返回</el-button>
        </div>
    </div>
</template>

<script>
    import {axiosPost,getDictionariesNameData,getOrgNameData} from "@/assets/js/api";

    export default {
        name: "LecturerManagementDetail",
        data() { // 存储数据
            return {
                infoDataAll:[],  //全部返回数据
                infoData:{ // 详情Info数据
                    // id: '',         //主键id
                    userId: '',     //用户ID
                    userName: '',   //用户姓名（讲师姓名）
                    idNo: '',       //身份证号
                    mobile: '',     //手机号码
                    email: '',      //邮箱地址
                    userAccount: '',      //登录帐号
                    orgId: '',    //所属机构
                    orgName: '',    //所属机构名
                    status: '',     //用户状态
                    number: '',  //讲师编号
                    // area: '',  //区域
                    userRank: '',       //职级
                    skilled: '',    //擅长课程
                    level: '',      //星级
                    honor:'',       //奖励荣誉
                    workTime: '',   //专职，兼职
                    entryTime: '',  //入职日期
                    workAge:'',     //工龄
                    cost:'',        //课时费
                    dateLine: '',    //任命期限
                    authentication:'',//认证状态
                    onJob:'',       //讲师状态
                    userDesc:'',//备注多行文本
                },
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                orgNameData:[],//获取全部机构名称

                //课程授权内容course
                recordsPermit: [],//已授权课程数据
                recordsTotalPermit: 0, // 表格数据的条数
                pageNoPermit: 1, // 第几页
                pageSizePermit: 5, // 每页几条

                //授课历史内容courseHistory
                recordsPermitHistory: [],//授课历史数据
                recordsTotalPermitHistory: 0, // 授课历史表格数据的条数
                pageNoPermitHistory: 1, // 第几页
                pageSizePermitHistory: 5, // 每页几条

                partTimeContentIsShow: false,//兼职内容
                fullTimeContentIsShow: false,//专职内容
                userId: '', // 用户id
            }
        },
        created(){  //创建生命周期

            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            getOrgNameData().then(res =>{   //获取全部机构名称
                this.orgNameData = res;
            });
            this.userId = this.$route.query.userId
            axiosPost('/resourceMgr/lecturer/info', {  //讲师详情接口
                userId: this.userId,  //主键id
            }).then( res => {
                this.infoDataAll = res.data;
                if(this.infoDataAll !== null || this.infoDataAll !== ''){
                    this.infoData.userId = res.data.userId;        //用户ID
                    this.infoData.userName = res.data.userName;    //用户姓名（讲师姓名）
                    this.infoData.idNo = res.data.idNo;            //身份证号
                    this.infoData.mobile = res.data.mobile;        //手机号码
                    this.infoData.email = res.data.email;          //邮箱地址
                    this.infoData.userAccount = res.data.userAccount;          //登录帐号
                    this.infoData.orgId = res.data.orgId;          //所属机构
                    this.infoData.status = res.data.status;        //用户状态
                    this.infoData.number = res.data.number;         //讲师编号
                    // this.infoData.area = res.data.area;             //区域
                    this.infoData.userRank = res.data.userRank;            //职级
                    this.infoData.skilled = res.data.skilled;       //擅长课程
                    this.infoData.level = res.data.level;           //星级
                    this.infoData.honor = res.data.honor;           //奖励荣誉
                    this.infoData.workTime = res.data.workTime;     //兼职，专职
                    if(this.infoData.workTime !== '' && this.infoData.workTime !== null){
                        if(this.dictionariesNameData[this.infoData.workTime] === '兼职'){
                            this.partTimeContentIsShow = true;
                            this.fullTimeContentIsShow = false;
                        }
                        if(this.dictionariesNameData[this.infoData.workTime] === '专职'){
                            this.partTimeContentIsShow = false;
                            this.fullTimeContentIsShow = true;
                        }
                    }

                    this.infoData.entryTime = res.data.entryTime;     //入职日期
                    this.infoData.workAge = res.data.workAge;       //工龄
                    this.infoData.cost = res.data.cost;             //课时费
                    if((res.data.startLine !== '' && res.data.startLine !== null) && (res.data.endLine !== '' && res.data.endLine !== null)){
                        this.infoData.dateLine = res.data.startLine.substring(0,10) + ' 至 ' + res.data.endLine.substring(0,10);       //任命期限
                    }else{
                        this.infoData.dateLine = '';       //任命期限
                    }
                    this.infoData.authentication = res.data.authentication;//认证状态


                    this.infoData.onJob = res.data.onJob;           //讲师状态
                    this.infoData.userDesc = res.data.userDesc;   //备注
                    this.infoData.orgName = (this.infoData.orgId !== '' && this.infoData.orgId !== null) ? this.orgNameData[this.infoData.orgId].orgName:''; //机构名称

                    this.queryListPermit();   // 已授权课程查询接口入参
                    this.queryListPermitHistory()   // 授课历史查询接口入参
                }
            });
        },
        methods:{
            back() {
                this.$router.back();
            },
            //已授权课程部分
            queryListPermit(){ // 已授权课程接口查询
                this.pageNoPermit = 1;
                this.getListPermit(this.pageNoPermit,this.pageSizePermit,);
            },
            handleSizeChangePermit(res) { //每页多少条
                this.pageSizePermit = res;
                this.pageNoPermit = 1;
                this.getListPermit(this.pageNoPermit,this.pageSizePermit);
            },
            handleCurrentChangePermit(res) { //第几页
                this.pageNoPermit = res;
                this.getListPermit(this.pageNoPermit,this.pageSizePermit);
            },
            getListPermit(pageNo,pageSize){ // 获取已授权课程列表
                axiosPost('/educateMgr/lecturer/course/list',{
                    lecturerId: this.userId,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.recordsPermit = res.data.records;
                    this.recordsTotalPermit = res.data.total;
                });
            },

            //授课历史部分
            queryListPermitHistory(){ // 授课历史接口查询
                this.pageNoPermitHistory = 1;
                this.getListPermitHistory(this.pageNoPermitHistory,this.pageSizePermitHistory,);
            },
            handleSizeChangePermitHistory(res) { //每页多少条
                this.pageSizePermitHistory = res;
                this.pageNoPermitHistory = 1;
                this.getListPermitHistory(this.pageNoPermitHistory,this.pageSizePermitHistory);
            },
            handleCurrentChangePermitHistory(res) { //第几页
                this.pageNoPermitHistory = res;
                this.getListPermitHistory(this.pageNoPermitHistory,this.pageSizePermitHistory);
            },
            getListPermitHistory(pageNo,pageSize,lecturerId){ // 获取授课历史列表
                axiosPost('/educateMgr/lecturer/course/history',{
                    lecturerId: this.userId,
                    pageNo: pageNo, // 第几页
                    pageSize: pageSize // 每页的数量
                }).then(res => {
                    this.recordsPermitHistory = res.data.records;
                    this.recordsTotalPermitHistory = res.data.total;
                });
            },
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
    .border-card{
        margin-top: 30px;
    }
</style>