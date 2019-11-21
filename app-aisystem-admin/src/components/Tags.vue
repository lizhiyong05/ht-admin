<template><!--标签导航-->
    <div class="tags" v-if="tags.length > 0">
        <ul>
            <li v-for="(item,ind) in tags" :class="item.index == curPath ? 'active' : ''" @click.stop="jumpRouter(item.index)" :key="ind">
                {{item.title}}
                <i class="el-icon-close" @click.stop="closeCur(item.index)" v-if="tags.length>1"></i>
            </li>
        </ul>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'tags',
        data(){
            return {

            }
        },
        methods:{
            jumpRouter(path){
                let curPath = this.$route.path;
                if(path != curPath){
                   this.$router.push(path);
                }
            },
            closeCur(path){
                let tagsArr = this.tags,
                    curPath = this.$route.path;
                tagsArr.forEach(function(el,ind){
                    if(el.index == path){
                        tagsArr.splice(ind,1);
                    }
                });
                this.$store.commit('changeTags',tagsArr)
                if(path == curPath){
                    this.$router.push(tagsArr[tagsArr.length-1].index);
                }
            }
        },
        computed:{
            ...mapGetters(['tags']),
            curPath(){
                return this.$route.path;
            }
        }
    }
</script>
<style scoped>
    .tags{
        padding: 3px 0;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    }
    .tags ul{
        margin-left: 15px;
    }
    .tags ul li{
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
    }
    .tags ul li.active{
        background-color: #409EFF;
        color: #fff;
        border-color: #409EFF;
    }
    .tags ul li.active::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
    }
    .el-icon-close{
        padding: 3px;
        border-radius: 50%;
    }
    .el-icon-close:hover{
        background: #ccc;
        transition: background 0.3s;
    }
</style>