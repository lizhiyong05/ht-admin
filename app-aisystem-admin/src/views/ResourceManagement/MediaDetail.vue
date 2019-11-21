<template><!-- 资源详情  zhiyong.li  -->
    <div class="media-detail">
        <h2 class="title-h2">资源详情</h2>
        <div class="detail-content">
            <ul class="clearfix loading-table">
                <li class="clearfix fl"><span class="title fl">资源编号：</span><span class="info fl">{{ mediaInfo.mediaId }}</span></li>
                <li class="clearfix fl"><span class="title fl">资源名称：</span><span class="info fl">{{ mediaInfo.mediaName }}</span></li>
                <li class="clearfix fl"><span class="title fl">资源类型：</span><span class="info fl">{{ dictionariesNameData[mediaInfo.mediaType] }}</span></li>
                <li class="clearfix fl"><span class="title fl">知识体系：</span><span class="info fl">{{(mediaInfo.knowledgeId && Object.keys(mapNameData).length>0) && mediaInfo.knowledgeId ? mapNameData[mediaInfo.knowledgeId].knowName : '' }}</span></li>
                <li class="clearfix fl"><span class="title fl">资源来源：</span><span class="info fl">{{ dictionariesNameData[mediaInfo.mediaResource] }}</span></li>
                <li class="clearfix fl"><span class="title fl">创建人：</span><span class="info fl">{{ mediaInfo.createUser }}</span></li>
                <li class="clearfix fl"><span class="title fl">创建时间：</span><span class="info fl">{{ mediaInfo.createTime }}</span></li>
                <li class="clearfix fl"><span class="title fl">资源描述：</span><span class="info fl">{{ mediaInfo.mediaDesc }}</span></li>
                <li class="clearfix fl" style="width: 100%;"><span class="title fl">附件：</span><span class="info fl">{{ mediaInfo.fileName }}</span><em class="look" @click="lookFun()" v-if="mediaInfo.filePath">查看</em></li>
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
        name: 'mediaDetail',
        data(){
            return {
                dictionariesNameData: {}, // 获取基本类型字典项数据的某个值
                mapNameData: {}, // 获取知识体系字典项数据的某个值
                mediaInfo:{

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
            if(this.$route.query.id){ // 详情
                this.getInfo(this.$route.query.id);
            }
        },
        methods:{
            getInfo(id){ // 详情
                axiosPost('/materialMgr/media/info',{
                    id: id, // 用户id
                    loading: '.loading-table'
                }).then((res) => {
                    this.mediaInfo = Object.assign({},res.data);
                });
            },
            lookFun(){
                window.open(this.mediaInfo.readAbsoluteLocation);
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
    .look{
        color: #66b1ff;
        font-size: 14px;
        cursor: pointer;
        padding-left: 5px;
        font-style: normal;
    }
</style>
