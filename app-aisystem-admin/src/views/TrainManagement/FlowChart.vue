<template>
    <div class="flowChart-box">
        <div class="menu">
            <p class="step">环节信息</p>
            <ul class="node-list">
                <li v-for="(item, index) in step" :key="index" :class="[index != step.length - 1 ? 'on' : '', index === current ? 'current' : '']"><span @click="node(item, index)" class="text" :title="item.nodeName">{{item.nodeName}}</span></li>
            </ul>
        </div>
        <DagreGraph :nodes="nodes" :edges="edges" style="width: 100%; height: 100%;"></DagreGraph>
    </div>
</template>
<script>
/**
 * 流程图
 */
import {
    axiosPost,
} from "@/assets/js/api";
import DagreGraph from '@/components/DagreGraph'
export default {
    name: 'flowChart',
    data() {
        return {
           nodes: [],
           edges: [],
           sceneId: '',
           step: [],
           current: ''
        }
    },
    components: {
        DagreGraph
    },
    created() {
        this.sceneId = this.$route.query.id;
        if(!this.sceneId) {
            this.$message({message:'参数错误~',type: 'warning'});
            return
        }
        this.init()
    },
    methods: {
        init () {
            axiosPost('/trainMgr/sceneMgr/showSceneFlowMap',{sceneId: this.sceneId}).then(res => {
                if(res.code == 1000) {
                    this.nodes = res.data.nodes || [];
                    this.edges = res.data.edges || [];
                }
            })
            axiosPost('/trainMgr/sceneMgr/selNextTalk', {sceneId: this.sceneId}).then(res => {
                if(res.code == 1000) {
                    this.step = res.data || [];
                }
            })
        },
        node(item, index) {
            this.current = index;
            this.nodes = this.nodes.map(val => {
                val.state = '';
                if(val.nid == item.nid) {
                    val.state = 'failed';
                }
                return val
            })
        }
    },
}
</script>

<style scoped>
.flowChart-box {
    width: 100%;
    height: 100%;
    position: relative;
    padding-left: 200px;
}
.menu {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 200px;
    overflow: auto;
    background: #fff;
}
.step {
    margin: 30px 0;
    text-align: center;
    font-size: 16px;
}
.node-list {
    padding: 0 15px;
}
.node-list>li {
    text-align: center;
    cursor: pointer;
    margin-bottom: 30px;
    color: #fff;
    background: #61b2e4;
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
    border-radius: 8px;
    font-size: 14px;
    position: relative;
}
.node-list>li.current,
.node-list>li:hover {
    background: #f77d6b;
}
.text {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.node-list>li.on:after {
    content: '---->';
    position: absolute;
    bottom: -33px;
    color: #333;
    left: 70px;
    transform: rotateZ(90deg)
}
</style>