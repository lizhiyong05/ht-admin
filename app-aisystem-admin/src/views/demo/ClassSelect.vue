<template><!-- 教室选择 zhiyong.li -->
    <div class="class-select">
        <el-button @click="selectClass">点击</el-button>
        <ClassAppointment v-if="selectConfigIsShow" :selectConfigIsShow='selectConfigIsShow' :selectRoom="selectRoom"  :planId="planId" :defaultTimeSlot="defaultTimeSlot" @listenEventClose="closeRemodal" @listenEventData="getData"></ClassAppointment>
    </div>
</template>
<script>
import ClassAppointment from '@/components/ClassAppointment'
export default {
    name: 'ClassSelect',
    components:{
        ClassAppointment
    },
    data(){
        return {
            selectConfigIsShow: false, // 弹窗是否打开
            selectRoom:{ // 选择后的时间段 或者 修改已预约的默认时间段
                roomId: '123',
                data: [
                    {
                        date: '2019-05-01',
                        selectTime: [
                            {
                                startTime: '08:00:00',
                                endTime: '09:00:00'
                            }
                        ]
                    }
                ]
            },
            defaultTimeSlot: ['2019-05-01','2019-05-02'], // 默认开始时间和结束时间
            planId: '' // 计划id
        }
    },
    methods:{
        selectClass(){
            this.selectConfigIsShow = true;
        },
        closeRemodal(){ // 关闭弹窗
             this.selectConfigIsShow = false;
        },
        getData(res){  // 接收数据
            this.selectRoom = res;
            this.selectConfigIsShow = false;
        }
    }
}
</script>
<style scoped>

</style>


