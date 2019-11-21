<template><!--左侧导航-->
    <div class="Sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in menuList">
                <template v-if="item.children">
                    <el-submenu :index="item.value" :key="item.value">
                        <template slot="title">
                            <i :class="item.icon" class="iconfont"></i><span slot="title" class="title-text">{{ item.cnName }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.value" :key="subItem.value">
                                <template slot="title">{{ subItem.cnName }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="i" :index="threeItem.value">
                                    {{ threeItem.cnName }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.value" :key="subItem.value">
                                {{ subItem.cnName }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.value" :key="item.value">
                        <i :class="item.icon" class="iconfont"></i><span slot="title" class="title-text">{{ item.cnName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '@/assets/js/bus';
    import {getMenuList} from "@/assets/js/api";

    export default {
        name: 'Sidebar',
        data() {
            return {
                collapse: false,
                menuList: [], // 菜单列表
            }
        },
        created(){
            getMenuList()
                .then(res => {
                    this.menuList = res;
                });
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped lang="scss">
    .Sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom:0;
        overflow-y: scroll;
    }
    .Sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 210px;
    }
    .Sidebar > ul {
        height:100%;
        border: none;
    }
    .title-text{
        padding-left: 5px;
    }
</style>
