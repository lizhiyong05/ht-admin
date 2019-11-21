<template>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px" center :modal-append-to-body='false'
               class="login-dialog" @closed="handleClose">
        <template slot="title">
            <img class="dialog-logo" src="@/assets/img/logo.png" alt="">
            <div class="dialog-title">教务系统平台</div>
        </template>
        <div class="pwd-change-box" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="修改密码成功，即将跳转到登录页"
             element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="120px" label-position="right">
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="formData.mobile" readonly placeholder="请输入手机号码" @blur="mobileBlur"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="sms">
                    <div class="count-input">
                        <el-input v-model="formData.sms" placeholder="请输入验证码">
                        </el-input>
                        <count-down @getCode="getCode" :available="available" v-if="showCountDown"></count-down>
                    </div>
                </el-form-item>
                <el-form-item label="当前密码" prop="userPwd">
                    <el-input v-model="formData.userPwd" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="formData.newPwd" show-password placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPwd">
                    <el-input v-model="formData.confirmPwd" show-password placeholder="请输入新密码"></el-input>
                </el-form-item>
                <!--                <el-form-item>-->
                <!--                    <div class="form-footer">-->
                <!--                        <el-button type="primary" @click="submitForm('formData')">完成</el-button>-->
                <!--                    </div>-->
                <!--                </el-form-item>-->
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                 <el-button type="primary" @click="submitForm('formData')">完成</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import CountDown from "@/components/CountDown"
    import {API} from '@/assets/js/urls';
    import {axiosPost} from "@/assets/js/api";


    export default {
        components: {CountDown},
        name: "PwdChange",
        data() {
            var validatePass = (rule, value, callback) => {
                var reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{8,16}$/;
                if (!value) {
                    callback(new Error('请输入新密码'));
                } else if (value == this.formData.userPwd) {
                    callback(new Error('新密码不能与当前密码相同'))
                } else if (value.length > 16 || value.length < 8) {
                    callback(new Error('密码为8-16位，至少为数字+字母组合'))
                } else if (!reg.test(value)) {
                    callback(new Error('密码为8-16位，至少为数字+字母组合'))
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formData.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var validateSms = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请输入验证码'));
                } else {
                    axiosPost('/facadeEntry/sms/checkCode',
                        {
                            checkType: '1',
                            mobile: this.formData.mobile,
                            code: value,
                        }).then(res => {
                        if (res.code == "1000") {
                            callback();
                        } else {
                            callback(new Error('验证码输入错误，请重新输入'));
                        }
                    }, err => {
                        callback(new Error(err));
                    })
                }
            };

            return {
                dialogVisible: false,//显示弹窗
                showCountDown: true,//验证码组件刷新
                available: false,//是否可以点击
                fullscreenLoading: false,//修改成功后退出系统到登录页
                formData: {//更改密码数据
                    mobile: null,
                    sms: '',
                    userPwd: '',
                    newPwd: '',
                    confirmPwd: ''
                },
                rules: {
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'},
                    ],
                    sms: [
                        {required: true, validator: validateSms, trigger: 'blur'}
                    ],
                    userPwd: [
                        {required: true, message: '请输入当前密码', trigger: 'blur'},
                        // {min: 8, max: 16, message: '密码为8-16位，至少为数字+字母组合', trigger: 'blur'},
                        // {
                        //     pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{8,16}$/,
                        //     message: '密码为8-16位，至少为数字+字母组合', trigger: 'blur'
                        // },
                    ],
                    newPwd: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    confirmPwd: [
                        {required: true, validator: validatePass2, trigger: ['blur']}
                    ],
                }//校验规则
            }
        },
        updated() {
             this.available = true;
        },
        created(){
            axiosPost('/systemMgr/user/info',{}).then(res => {
                this.formData.mobile = res.data.mobile;
            });
        },
        methods: {
            mobileBlur() {
//                this.$refs.formData.validateField('mobile', (error) => {
//                    if (!error) {
//                        this.available = true;
//                    } else {
//                        this.available = false;
//                    }
//                })
            },
            getCode() {
                axiosPost('/facadeEntry/sms/captcha', {
                    smsType: 'mofigy',
                    mobile: this.formData.mobile
                }).then(res => {
                    if (res.code == "1000") {
                        // this.sms = res.data;
                    }
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axiosPost('/facadeEntry/platform/changePwd', {
                            mobile: this.formData.mobile,
                            userPwd: this.formData.userPwd,
                            newPwd: this.formData.newPwd,
                        }).then(res => {
                            if (res.code == "1000") {
//                                this.$emit("refInfo")
                                this.$message({
                                    type:'success',
                                    message:'修改密码成功！'
                                })
                                this.dialogVisible=false;
                                // this.fullscreenLoading = true;
                                // setTimeout(() => {
                                //     this.fullscreenLoading = false;
                                //     localStorage.clear();
                                //     window.location.href = ht.config.sso_host + '/login?logout=true';
                                // }, 2000)

                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            openDialog() {
                this.dialogVisible = true;
                this.showCountDown = true;
                this.available = false;
            },
            handleClose() {
                this.$refs.formData.resetFields();
                this.showCountDown = false;
                this.available = false;
            },

        }
    }
</script>

<style scoped>
    /*个人信息弹窗统一样式*/
    .el-dialog.el-dialog--center {
        border-radius: 10px;
    }

    .dialog-logo {
        height: 38px;
        width: 60px;
        display: inline-block;
        vertical-align: middle;

    }

    .dialog-title {
        height: 60px;
        line-height: 60px;
        display: inline-block;
        margin-left: 10px;
        font-size: 18px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        font-family: MicrosoftYaHei;
    }

    .el-dialog__headerbtn {
        top: 8px;
        right: 8px;
        font-size: 20px;
    }

    .login-dialog >>> .el-dialog .el-dialog__body {
        padding-right: 70px !important;
        padding-bottom: 0;
    }

    /*弹窗form样式*/
    .el-form-item__label {
        font-size: 14px;
        color: #666666;
    }

    .el-input__inner {
        border-radius: 0;
    }

    .login-dialog .el-dialog__footer .el-button {
        width: calc(100% - 200px);
        border-radius: 20px;
    }

    .el-input-group__append .el-button {
        padding: 12px 16px;
    }

    /*表单form*/
    .form-footer {
        text-align: center;
    }

    /*计时器*/
    .count-input {
        display: inline-table;
        width: 100%;
    }

    .count-input .el-input {
        display: table-cell;
    }

    .count-input .el-input >>> .el-input__inner {
        border-radius: 4px 0 0 4px !important;
    }
</style>