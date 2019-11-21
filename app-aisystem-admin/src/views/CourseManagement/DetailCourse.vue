<template>
    <div class="detail-course">
        <h2 class="title-h2 clearfix">课程详情 <el-button class="fr" size="mini" @click="$router.go(-1)">返回</el-button></h2>
        <div class="item">
            <el-form :inline="true" :model="detailData" class="demo-form-inline" label-width="120px">
                <el-form-item label="课程编号：">
                    <p>{{detailData.code}}</p>
                </el-form-item>
                <el-form-item label="课程分类：">
                    <p>{{detailData.knowledgePath}}</p>
                </el-form-item>
                <el-form-item label="课程类型：">
                    <p>{{detailData.type}}</p>
                </el-form-item>
                <el-form-item label="课程名称：">
                    <p>{{detailData.name}}</p>
                </el-form-item>
                <el-form-item label="课程时长：" >
                    <p>{{detailData.duration}}</p>
                </el-form-item>
                <el-form-item label="培训受众：">
                    <p>{{detailData.audience}}</p>
                </el-form-item>
                <el-form-item label="课程星级：" >
                    <p>{{detailData.starLevel}}</p>
                </el-form-item>
                <el-form-item label="学习方式：">
                    <p>{{detailData.studyMode}}</p>
                </el-form-item>
                <el-form-item label="学习目标：">
                    <p>{{detailData.studyPurpose}}</p>
                </el-form-item>
                <el-form-item label="课程大纲：">
                    <p>{{detailData.syllabus}}</p>
                </el-form-item>
                <el-form-item label="课程介绍：">
                    <p>{{detailData.description}}</p>
                </el-form-item>
                <el-form-item label="授权人员：">
                    <p>
                        <span v-for="(item,ind) in detailData.lecturers" :key="ind">{{item.lecturerName}}<em v-if="detailData.lecturers.length - 1 !== ind">、</em> </span>
                    </p>
                </el-form-item>
            </el-form>
        </div>
        <div class="item">
            <h3 class="add-title">相关课件</h3>
            <div v-for="(item,ind) in detailData.catalogues" :key="ind" style="margin-top: 20px;">
                <div class="catalog clearfix" v-if="ind == 0">
                    <div class="fl">默认目录</div>
                </div>
                <div class="catalog clearfix" v-else>
                    <div class="fl">
                        <em class="catalog-em">{{item.name}}</em>
                    </div>
                </div>
                <ul class="catalog-list">
                    <li v-show="false">{{ count = 0 }}</li>
                    <li class="clearfix" v-for="(item2,ind2) in item.wares" :key="ind2" v-if="item2.flag.includes('讲师可见')">
                        <p><span class="file-name">（{{count+=1}}）{{item2.name}}</span><el-button class="download-text" type="text" v-if="item2.flag.includes('讲师下载') && /\.(pdf)$/.test(item2.realPath)" @click="downloadFile(item2.realPath)">查看</el-button></p>
                        <div style="margin: 10px;" v-if="item2.flag.includes('讲师可见') && /\.mp4$/.test(item2.realPath)">
                            <video width="320" controls="controls" :controlsList="item2.flag.includes('讲师下载') ? '' : 'nodownload'">
                                <source :src="item2.realPath" type="video/mp4">
                                您的浏览器不支持视频。
                            </video>
                        </div>
                        <div v-if="item2.flag.includes('讲师可见') && /\.(png|jpg|jpeg)$/.test(item2.realPath)">
                            <img :src="item2.realPath" alt="" style="width: 320px;margin: 10px;">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="item">
            <h3 class="add-title clearfix">相关试卷</h3>
            <ul class="test-list">
                <li class="clearfix" v-for="(item,ind) in papers" :key="ind"><span class="fl file-name">（{{ind+1}}）{{item.paperName}}</span></li>
            </ul>
        </div>
        <div class="item">
            <h3 class="add-title clearfix">相关评估</h3>
            <ul class="research-list">
                <li class="clearfix" v-for="(item,ind) in assesses" :key="ind"><span class="fl file-name">（{{ind+1}}）{{item.assessName}}</span></li>
            </ul>
        </div>
        <div class="item">
            <h3 class="add-title clearfix">封面</h3>
            <ul class="cover-list">
                <li class="clearfix" v-for="(item,ind) in covers" :key="ind" style="margin-top: 15px;">
                    <span class="fl">（{{ind+1}}）</span>
                    <img class="fl" :src="item.realCoverPath" alt="">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {axiosPost} from "@/assets/js/api";

    export default {
        name: "detail-course",
        data(){
            return {
                detailData:{ // 详情
                    code: '',
                    knowledgePath: '',
                    type: '',
                    name: '',
                    duration: '',
                    audience: '',
                    starLevel: '',
                    studyMode: '',
                    studyPurpose: '',
                    syllabus: '',
                    lecturers: '',
                    description: '',
                    catalogues: '',
                },
                covers: '',
                assesses: '',
                papers: '',
                exams: '',
            }
        },
        created(){
            this.id = this.$route.query.id;
            if(this.id != undefined){
                this.getInfo();
            }else{
                this.$message({message: '课程管理详情无id！',type: 'warning'});
            }
        },
        methods:{
            getInfo(){ // 获取详情
                axiosPost('/educateMgr/course/info',{
                    id: this.id
                })
                    .then(res => {
                        this.detailData.code = res.data.code;
                        this.detailData.knowledgePath = res.data.knowledgePath;
                        this.detailData.type = res.data.type;
                        this.detailData.name = res.data.name;
                        this.detailData.duration = res.data.duration;
                        this.detailData.audience = res.data.audience;
                        this.detailData.starLevel = res.data.starLevel;
                        this.detailData.studyMode = res.data.studyMode;
                        this.detailData.studyPurpose = res.data.studyPurpose;
                        this.detailData.syllabus = res.data.syllabus;
                        this.detailData.lecturers = res.data.lecturers;
                        this.detailData.description = res.data.description;
                        this.covers = res.data.covers;
                        this.assesses = res.data.assesses;
                        this.papers = res.data.papers;
                        this.exams = res.data.exams;
                        this.detailData.catalogues = res.data.catalogues;
                    })
            },
            downloadFile(url){
                window.open(url);
            }
        }
    }
</script>

<style scoped>
    .item{
        margin-top: 30px;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 15px;
        margin-bottom: 15px;
    }
    .item >>> .el-form-item__label{
        font-size: 16px;
        line-height: 20px;
    }
    .demo-form-inline p{
        max-width: 200px;
        font-size: 14px;
        line-height: 20px;
        color: #949494;
    }
    .catalog>div:first-child{
        margin-left: 15px;
    }
    .catalog>div span{
        cursor: pointer;
        padding-left: 15px;
        color: #409EFF;
        font-size: 14px;
    }
    .catalog-list{
        padding-left: 30px;
    }
    .catalog-list li{
        padding: 15px 0;
        /*display: flex;*/
        /*align-items: center;*/
    }
    .cover-list img{
        width: 500px;
    }
    .test-list,.research-list,.cover-list{
        padding-left: 30px;
    }
    .test-list li,.research-list li{
        line-height: 30px;
    }
    .add-title{
        font-size: 16px;
    }
    .file-name{
        font-size: 14px;
    }
    .title-h2{
        line-height: 28px;
    }
    .teacher-download{
        color: #409EFF;font-size: 14px;margin-left: 10px;
        cursor: pointer;
    }
    .download-text{
        margin-left: 15px;
    }
</style>