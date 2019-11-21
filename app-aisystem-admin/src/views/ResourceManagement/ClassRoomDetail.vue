<template><!-- 教室详情 zhiyong.li -->
    <div class="student-detail">
        <h2 class="title-h2">教室详情</h2>
        <div class="detail-content">
            <ul class="clearfix loading-table">
                <li class="clearfix fl"><span class="title fl">教室编号</span><span class="info fl">{{ classRoomInfo.roomId }}</span></li>
                <li class="clearfix fl"><span class="title fl">教室名称</span><span class="info fl">{{ classRoomInfo.roomName }}</span></li>
                <li class="clearfix fl"><span class="title fl">所属区域</span><span class="info fl">{{ classRoomInfo.area && Object.keys(dictionariesNameData).length > 0 ? dictionariesNameData[classRoomInfo.area] : ''}}</span></li>
                <li class="clearfix fl"><span class="title fl">教室位置</span><span class="info fl">{{ classRoomInfo.location }}</span></li>
                <li class="clearfix fl"><span class="title fl">教室类型</span><span class="info fl">{{ classRoomInfo.roomType && Object.keys(dictionariesNameData).length > 0 ? dictionariesNameData[classRoomInfo.roomType] : ''}}</span></li>
                <li class="clearfix fl"><span class="title fl">教室容量</span><span class="info fl">{{ classRoomInfo.capacity }}</span></li>
                <li class="clearfix fl"><span class="title fl">教室状态</span><span class="info fl">{{ classRoomInfo.status && Object.keys(dictionariesNameData).length > 0 ? dictionariesNameData[classRoomInfo.status] : ''}}</span></li>
                <li class="clearfix fl"><span class="title fl">教室设备</span><span class="info fl">{{ classRoomInfo.equipmentsArr }}</span></li>
                <li class="clearfix fl"><span class="title fl">教室描述</span><span class="info fl">{{ classRoomInfo.roomDesc }}</span></li>
            </ul>
        </div>
        <div class="back-button">
            <el-button size="small" type="primary" @click="$router.go(-1)" class="el-btn-min-100 ">返回</el-button>
        </div>
    </div>
</template>
<script>
    import { axiosPost, getDictionariesNameData } from '@/assets/js/api';

    export default {
        name: "ClassRoomDetail",
        data() {
            return {
                dictionariesNameData: {}, // 获取基本类型字典项数据的某个值
                classRoomInfo: {
                    roomId: '', // 教室编号
                    roomName: '', // 教室名称
                    area: '', // 所属区域
                    location: '', // 教室位置
                    roomType: '', // 教室类型
                    capacity: '', // 教室容量
                    status: '', // 教室状态
                    equipmentsArr: '', // 教室设备
                    roomDesc: '', // 教室描述
                }
            }
        },
        created() {
            getDictionariesNameData().then(res => { // 获取基本类型字典项数据的某个值
                this.dictionariesNameData = res;
                this.getInfo();
            });
        },
        methods: {
            getInfo() {
                axiosPost('/resourceMgr/room/info', {
                    roomId: this.$route.query.id
                }).then(res => {
                    this.classRoomInfo = Object.assign({},res.data);
                    this.classRoomInfo.equipmentsArr = res.data.equipmentsArr.map(item => {
                        return this.dictionariesNameData[item];
                    }).join('|');
                })

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
        width: 130px;
        text-align: right;
        margin-right: 10px;
    }
    .detail-content li span:last-child{
        padding-left: 3px;
    }
    .back-button{
        text-align: center;
        margin-top: 50px;
    }
</style>