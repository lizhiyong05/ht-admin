<template>
    <div>
        <el-button class="el-btn-min-100" type="primary" @click="appointAdd">添加预约</el-button>
        <class-room-appointAdd ref="ClassRoomAppointAdd"></class-room-appointAdd>
    </div>
</template>

<script>
    import ClassRoomAppointAdd from "@/components/ClassRoomAppointAdd"

    export default {
        components: {ClassRoomAppointAdd},
        name: "ClassRoomAppoint",
        methods: {
            appointAdd() {
                this.$refs.ClassRoomAppointAdd.openDialog();
            }
        }
    }
</script>

<style scoped>

</style>