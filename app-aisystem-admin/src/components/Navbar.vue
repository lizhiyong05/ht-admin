<template><!--头部-->
    <div class="Navbar">
        <el-header class="header">
            <div class="menu fl">
                <i class="htfg-back iconfont" @click="menuChange"></i>
            </div>
            <div class="logo fl">
                <img src="@/assets/img/logo.png" alt="">
            </div>
            <div class="system-name fl">
                教务管理系统
            </div>
            <div class="account fr">
                <div class="account-head">
                    <img src="@/assets/img/header.png" alt="">
                </div>
                <el-dropdown class="user-name" trigger="click">
                        <span class="el-dropdown-link">
                            <span>{{userName}}</span> <i class="el-icon-caret-bottom"></i>
                        </span>
                    <el-dropdown-menu slot="dropdown" class="menu-list">
                        <a href="javascript:void(0)" @click="pwdChange">
                            <el-dropdown-item>修改密码</el-dropdown-item>
                        </a>
                        <a href="javascript:;" @click="loginOut">
                            <el-dropdown-item divided >退出登录</el-dropdown-item>
                        </a>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <pwd-change ref="pwdChange"></pwd-change>
    </div>
</template>

<script>
    import bus from '@/assets/js/bus'
    import {axiosPost} from "@/assets/js/api";
    import PwdChange from "@/views/PwdChange"

    export default {
        name: 'Navbar',
        components:{PwdChange},
        data(){
            return {
                collapse: false,
                userName: '' // 用户名
            }
        },
        created(){
            axiosPost('/systemMgr/user/info',{}).then(res => {
                this.userName = res.data.userName;
            });
        },
        methods:{
            menuChange(){
                this.collapse = !this.collapse;
                bus.$emit('collapse',this.collapse);
            },
            loginOut(){
                window.location.href = ht.config.sso_host+ '/login?logout=true&url=' + encodeURIComponent(window.location);
            },
            pwdChange(){
                this.$refs.pwdChange.openDialog();
            }
        }
    }
</script>

<style scoped lang="scss">
    .header{
        background: #fff;
        position: relative;
        width: 100%;
        height: 50px!important;
        font-size: 22px;
        color: #000;
        padding: 0;
        -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        overflow: hidden;
        .menu{
            width: 64px;
            padding: 0 21px;
            height: 100%;
            line-height: 50px;
        }
        .logo{
            width: 40px;
            margin: 12px 10px 0 0;
        }
        .system-name{
            line-height: 50px;
            font-size: 18px;
        }
        .account{
            display: flex;
            align-items: center;
            height: 50px;
            .full-screen{
                transform: rotate(45deg);
                margin-right: 20px;
            }
            .new{
                margin-right: 20px;
            }
            .account-head{
                width: 34px;
                height: 34px;
                border-radius: 100%;
                overflow: hidden;
                margin-right: 20px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .user-name{
                margin-right: 30px;
                color: #000;
                cursor: pointer;
            }
        }
    }
    .menu-list{
        overflow: visible;
    }
</style>
