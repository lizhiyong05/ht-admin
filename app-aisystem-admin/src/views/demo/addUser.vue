<template>
    <div class="add-user">
        <el-button @click="addFun">新增</el-button>
        <br>
        {{name}}
        <Remodal :remodalIsShow="flag" @listenEvent="Receive"></Remodal>
    </div>
</template>

<script>
    import Remodal from '@/views/demo/Remodal'
    export default {
        name: "addUser",
        data(){
            return {
                flag: false,
                name: '***'
            }
        },
        components:{
            Remodal
        },
        methods:{
            addFun(){
                this.flag = true;
            },
            Receive(res){
                this.flag = false;
                this.name = res;
            }
        }
    }
</script>

<style scoped>

</style>