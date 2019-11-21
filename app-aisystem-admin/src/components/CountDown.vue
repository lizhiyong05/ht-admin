<!--验证码组件-->
<template>
    <el-button slot="append" type="danger" @click="getCode" :disabled="!tempLogin.canGet">
        <span v-show="!login.canGet">{{login.waitTime+"s后重新获取"}}</span>
        <span v-show="login.canGet">点击获取</span>
    </el-button>
</template>

<script>
    function timeCountdown(obj,count) { //obj包括timer、waitTime 、canGet
        const TIME_COUNT = count; //默认倒计时秒数

        if (!obj.timer) {
            obj.waitTime = TIME_COUNT;
            obj.canGet = false;
            obj.timer = setInterval(() => {
                if (obj.waitTime > 0 && obj.waitTime <= TIME_COUNT) {
                    obj.waitTime--;
                } else {
                    obj.canGet = true;
                    clearInterval(obj.timer); //清空定时器
                    obj.timer = null;
                }
            }, 1000)
        }
        return {
            timer: obj.timer,
            canGet: obj.canGet,
            waitTime: obj.waitTime
        }
    }

    export default {
        name: "CountDown",
        props: {
            available: {
                default: true,
                type: Boolean
            }
        },
        watch: {
            available(value) {
                if (value)
                    this.canClick = true;
                else
                    this.canClick = false;
            }
        },
        data() {
            return {
                canClick: false,
                time: 60,//间隔时常
                tempLogin: { //定义一个临时对象
                    canGet: true,
                    timer: null,
                    waitTime: 60
                }
            }
        },
        computed: {
            login() { //最终对象
                if (!this.tempLogin.canGet) {
                    return timeCountdown(this.tempLogin);
                } else {
                    return this.tempLogin;
                }
            }
        },
        created() {
        },
        methods: {
            getCode() {
                if (this.canClick) {
                    //倒计时开始
                    timeCountdown(this.login,60);  //参数为最终对象
                    this.$emit("getCode")
                }
            }
        }
    }
</script>

<style scoped>
    .el-button {
        width: 96px !important;
        padding: 0;
        height: 40px;
        border-radius: 0;
    }
</style>