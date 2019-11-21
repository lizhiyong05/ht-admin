<template><!--主入口-->
    <div class="index">
        <Sidebar></Sidebar>
        <div class="main-container" :class="{'content-collapse':collapse}">
            <Navbar></Navbar>
            <Tags></Tags>
            <div class="son-router">
                <transition name="fade-transform" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
    import Sidebar from '@/components/Sidebar'
    import Navbar from '@/components/Navbar'
    import Tags from '@/components/Tags'
    import bus from '@/assets/js/bus'
    export default {
        class:'index',
        components:{
            Sidebar,
            Navbar,
            Tags
        },
        data(){
            return {
                collapse: false
            }
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
<style scoped lang="scss">
    .index{
        height: 100%;
    }
    .main-container {
        height: 100%;
        position: absolute;
        left: 210px;
        right: 0;
        top: 0;
        bottom: 0;
        overflow-y: scroll;
        transition: left .3s ease-in-out;
        background: #edeff2;
    }
    .main-container::-webkit-scrollbar{width: 10px;height: 1px;}
    .main-container::-webkit-scrollbar-thumb{border-radius: 10px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #3b4963;}
    .main-container::-webkit-scrollbar-track{width: 10px;height: 1px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #576a8c;}
    .content-collapse{
        left: 65px;
    }
    .fade-transform-leave-active,
    .fade-transform-enter-active {
        transition: all .5s;
    }
    .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
    }
    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .son-router{
        background: #fff;
        margin: 10px;
        border-radius: 5px;
        padding: 15px 20px;
    }
</style>

