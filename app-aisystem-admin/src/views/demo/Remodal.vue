<template>
    <div class="remodal">
        <el-dialog
                title="提示"
                :visible.sync="remodalIsShow"
                width="30%"
                >
            <ul>
                <li v-for="(item,ind) in userList" :key="ind" @click="sendInfo(ind)">{{item.name}}</li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Remodal",
        props:['remodalIsShow'],
        data() {
            return {
                userList: [
                    {
                        name: '周硕梁',
                        address: '合肥'
                    },
                    {
                        name: '李志勇',
                        address: '吕梁'
                    }
                ]
            }
        },
        methods:{
            sendInfo(ind){
                this.$emit('listenEvent',this.userList[ind].name)
            }
        }
    }
</script>

<style scoped>
</style>