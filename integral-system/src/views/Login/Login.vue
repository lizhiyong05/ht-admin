<template>
    <div class="login">
        <transition name = "loginBgTransition">
            <vue-particles
                    color="#fff"
                    :particleOpacity="0.7"
                    :particlesNumber="60"
                    shapeType="circle"
                    :particleSize="4"
                    linesColor="#fff"
                    :linesWidth="1"
                    :lineLinked="true"
                    :lineOpacity="0.4"
                    :linesDistance="150"
                    :moveSpeed="2"
                    :hoverEffect="true"
                    hoverMode="grab"
                    :clickEffect="true"
                    clickMode="push"
                    class="lizi login"
                    v-show="loginBgIsShow" :style="{backgroundImage: 'url('+ loginBgList[loginBgNo] + ')',backgroundSize: '100% 100%',backgroundPosition: 'left center',backgroundRepeat: 'no-repeat'}"
            >
            </vue-particles>
        </transition>
        <div class="login-container">
            <p class="login-title">金融系统</p>
            <el-form :model="loginForm" ref="loginFormRef" label-width="70px" class="login-form" :rules="loginRules">
                <el-form-item prop="userName" label="用户名">
                    <el-input v-model.trim="loginForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model.trim="loginForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-button type="primary" class="login-submit" @click="loginFun('loginFormRef')">登陆</el-button>
            </el-form>
        </div>
        <div class="login-time">
            <p class="date">{{ date }}</p>
            <p class="time">{{ time }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                loginBgList: [ // 图片路径列表
                    require( '../../assets/img/img1.jpg'),
                    require( '../../assets/img/img2.jpg'),
                    require( '../../assets/img/img3.jpg'),
                    require( '../../assets/img/img4.jpg'),
                    require( '../../assets/img/img5.jpg'),
                    require( '../../assets/img/img6.jpg'),
                    require( '../../assets/img/img7.jpg'),
                    require( '../../assets/img/img8.jpg'),
                    require( '../../assets/img/img9.jpg'),
                    require( '../../assets/img/img10.jpg'),
                    require( '../../assets/img/img11.jpg'),
                    require( '../../assets/img/img12.jpg')
                ],
                loginBgNo: 0, // 第几张图片
                loginBgIsShow: true,
                time: '', // 时间
                date: '', // 日期
                loginForm:{ // 登陆信息
                    userName: '',
                    password: ''
                },
                loginRules:{
                    userName: { required: true, message: '请输入用户名'},
                    password: { required: true, message: '请输入密码'},
                }
            }
        },
        mounted(){
            let timer1 = setInterval(timer1Fun,5000);
            let that = this;
            function timer1Fun(){ // 定时器方法
                that.loginBgIsShow = false;
                clearInterval(timer1);
                setTimeout(() => {
                    that.loginBgNo += 1;
                    if(that.loginBgNo === that.loginBgList.length){
                        that.loginBgNo = 0;
                    }
                    that.loginBgIsShow = true;
                    setTimeout(() => {
                        timer1 = setInterval(timer1Fun,5000);
                    },500)
                },500)
            }
            this.getTime();
        },
        methods:{
            getTime(){ // 获取当前时间
                let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期'];
                let that = this;
                setInterval(updateTime, 1000);
                updateTime();
                function updateTime() {
                    let cd = new Date();
                    that.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
                    that.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
                }
                function zeroPadding(num, digit) {
                    let zero = '';
                    for(let i = 0; i < digit; i++) {
                        zero += '0';
                    }
                    return (zero + num).slice(-digit);
                }
            },
            loginFun(formName){ // 登陆方法
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login{
        width: 100%;
        height: 100%;
        position: relative;
    }
    @keyframes enterFrames
    {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes outputFrames
    {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    .loginBgTransition-enter-active{
        animation: enterFrames 0.5s linear;
    }
    .loginBgTransition-leave-active{
        animation: outputFrames 0.5s linear;
    }
    .login-container{
        position: absolute;
        left:80%;
        top:50%;
        width:350px;
        height: 350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.8);
        box-shadow: 0px 0px 8px 8px rgba(70, 109, 140, 0.3);
    }
    .login-time{
        font-family: 'Share Tech Mono', monospace;
        text-align: center;
        position: absolute;
        left: 50px;
        top: 50px;
        color: #daf6ff;
        text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
        background: #0f3854;
        background: -webkit-radial-gradient(center ellipse, rgba(10,46,56,0.2) 0%, rgba(0,0,0,0.2) 70%);
        background: radial-gradient(ellipse at center, rgba(10,46,56,0.2) 0%, rgba(0,0,0,0.2) 70%);
        background-size: 100%;
    }
    .time {
        letter-spacing: 0.05em;
        font-size: 80px;
        padding: 5px 0;
    }
    .date {
        letter-spacing: 0.1em;
        font-size: 24px;
        line-height: 30px;
    }
    .login-title{
        font-size: 20px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #333333;
    }
    .login-form{
        width: 320px;
        margin: 30px auto 0 auto;
        font-size: 16px;
        color: #333333;
    }
    .login-submit{
        width: 320px;
        margin-top: 40px;
    }
</style>