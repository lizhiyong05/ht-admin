<template>
    <div class="login" :class="{'enter': enterFlag,'output': outputFlag}" :style="{backgroundImage: 'url('+ loginBgList[loginBgNo] + ')',backgroundSize: '100% 100%',backgroundPosition: 'left center',backgroundRepeat: 'no-repeat'}">
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
                enterFlag: false, // 是否进入
                outputFlag: false, // 是否离开
            }
        },
        mounted(){
            setInterval(() => {
                this.outputFlag = true;
                this.enterFlag = false;
                setTimeout(() => {
                    this.loginBgNo ++;
                    if(this.loginBgNo === this.loginBgList.length){
                        this.loginBgNo = 0;
                    }
                    this.outputFlag = false;
                    this.enterFlag = true;
                },500)
            },5000)
        }
    }
</script>

<style scoped>
    .login{
        width: 100%;
        height: 100%;
    }
    .enter{
        animation: enterFrames 0.5s linear;
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
    .output{
        animation: outputFrames 0.5s linear;
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
</style>