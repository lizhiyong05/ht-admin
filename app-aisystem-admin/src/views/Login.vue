<template><!--登录-->
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户手机号" onkeyup="this.value=this.value.replace(/\s+/g,'')">
                        <el-button slot="prepend" icon="el-icon-lzycaidan"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入用户密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')" onkeyup="this.value=this.value.replace(/\s+/g,'')">
                        <el-button slot="prepend" icon="el-icon-lzycaidan"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @keyup.enter.native="submitForm('ruleForm')" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>

    </div>
</template>

<script>
    import {axiosPost} from '@/assets/js/api'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '13611111111',
                    password: '111111'
                },
                rules: {
                    username: [
                        {required: true,message: '请输入用户手机号',trigger: 'blur' },
                        {pattern: /((1[3,5,8][0-9])|(14[5,7])|(17[0,5,6,7,8])|(19[7]))\d{8}$/, message: '请检查手机号格式是否正确', trigger: 'blur' }
                    ],
                    password: [
                        {required: true,message: '请输入用户密码',trigger: 'blur'},
                        {min: 6,max: 16,message: '请输入6到16位之间格式的密码',trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/account/verify',{
                            username: 'zhangsan',
                            password: "123qweASD#@!"
                        }).then(res => {
                            if(res.code == 1000){
                                localStorage.setItem('ht_accesstoken',res.data.accesstoken);
                                localStorage.setItem('ms_refreshtoken',res.data.refreshtoken);
                                // this.$router.push('/');
                            }
                        },err => {
                            console.log(err);
                        })

                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    form{
        width: auto!important;
    }
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: url(~@/assets/img/login-bg.gif);
        background-size: 100% 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>