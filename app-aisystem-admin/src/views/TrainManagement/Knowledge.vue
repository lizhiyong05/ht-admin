<template>
    <div class="">
        <h2 class="title-h2">知识库管理</h2>
        <div class="konwledge">
            <div class="nav">
                <ul class="tree-box" v-loading="loading">
                    <li v-for="(item, index) in data" :key="index">
                        <p :title="item.name" :class="nodeChecked.flag == item.flag && !nodeChecked.id ? 'on' : ''" class="node-name" @click="nodeClick(item)">{{item.name}}</p>
                        <i v-if="item.groupList.length > 0" @click="showHide(item)" :class="item.show ? 'el-icon-caret-bottom' :  'el-icon-caret-right'"></i>
                        <span class="el-icon-circle-plus-outline" @click="btnAdd(item)" v-if="(operationData.includes('2e2493a4')) && item.isEdit"></span>
                        <ul class="node-list" :style="{height: item.show ? item.groupList.length * 30 + 'px' : '0'}">
                            <li v-for="(item2, index2) in item.groupList" :key="index2">
                                <p :title="item2.name" @click="nodeClick(item2)" :class="nodeChecked.id == item2.id && nodeChecked.id ? 'on' : ''" v-if="!item2.isUpdate" class="node-name">{{item2.name}}</p>
                                <el-input :maxlength="64" placeholder="64字以内" :ref="'saveInput' + index2" v-else size="mini" @keyup.enter.native="inputBlur(item2, index2)" @blur="addEdit(item2, item)" v-model="item2.name" style="width: 140px;margin-left: 30px;"></el-input>
                                <span :class="item2.isUpdate ? 'on' : ''" v-if="(operationData.includes('b92acc5b'))" class="el-icon-delete" @click="remove(item2)"></span>
                                <span :class="item2.isUpdate ? 'on' : ''" v-if="(operationData.includes('3638b082'))" class="el-icon-edit" @click="btnEdit(item2, index2)"></span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="content">
                <know-point v-if="nodeChecked.flag == 1" :knowGroupId = "knowGroupId"></know-point>
                <know-question v-if="nodeChecked.flag == 2 || nodeChecked.flag == 3" :knowGroupId = "knowGroupId"></know-question>
                <know-oral v-if="nodeChecked.flag == 4 || nodeChecked.flag == 5" :knowGroupId = "knowGroupId"></know-oral>
            </div>
        </div>
    </div>
</template>

<script>
import {
    axiosPost,
    getDictionariesAllData,
    getKnowTraimData,
    getMapNameData,
    getOperationData
} from "@/assets/js/api";
import KnowPoint from './KnowPoint'
import KnowQuestion from './KnowQuestion'
import KnowOral from './KnowOral';
export default {
    name: 'knowledge',
    data() {
        return {
            loading: false,
            operationData: [],
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            knowGroupId: null,
            nodeChecked: {},
        }
    },
    components: {
        KnowPoint, KnowQuestion, KnowOral
    },
    created() {
        getOperationData().then(res => {
            this.operationData = res;
        });
        getMapNameData().then(res => {
            
        });
        this.getTreeList();
    },
    methods: {
        getTreeList() {
            this.loading = true;
            axiosPost('/trainMgr/knowMgr/group',{}).then(res => {
                if(res.code == 1000) {
                    res.data.forEach(item => {
                        item.show = true;
                        item.groupList.forEach(item2 => {
                            item2.isUpdate = false;
                        })
                    })
                    this.data = res.data;
                    if(this.nodeChecked.flag) {
                        this.nodeChecked = this.data[Number(this.nodeChecked.flag) - 1];
                        this.knowGroupId = this.nodeChecked.flag;
                    }else {
                        this.nodeChecked = this.data[0];
                        this.knowGroupId = this.data[0].flag;
                    }
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        showHide(item) {
            item.show = !item.show;
        },
        nodeClick(item) {
            item.show = !item.show;
            this.nodeChecked = item;
            this.knowGroupId = '' + this.nodeChecked.flag + (this.nodeChecked.id ? '@' + this.nodeChecked.id : '');
        },
        btnEdit(item, index2) {
            item.isUpdate = true;
            this.$nextTick(() => {
                this.$refs['saveInput' + index2][0].$refs.input.focus();
            });
        },
        inputBlur(item, index2) {
            this.$refs['saveInput' + index2][0].$refs.input.blur();
        },
        addEdit(item, list) {
            if(item.name) {
                this.loading = true;
                var URL = item.id ? '/trainMgr/knowMgr/alterGroup' : '/trainMgr/knowMgr/addGroup'
                axiosPost(URL,item).then(res => {
                    if(res.code == 1000) {
                        this.getTreeList();
                    }
                }).finally(() => {
                    item.isUpdate = false;
                })
            }else if(item.id) {
                this.remove(item);
            }else {
                list.groupList.splice(list.groupList.length - 1, 1);
            }
        },
        remove(item) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                axiosPost('/trainMgr/knowMgr/deleteGroup',{id: item.id}).then(res => {
                    if(res.code == 1000) {
                        this.getTreeList();
                    }
                })
            }).catch(() => {   

            });
        },
        btnAdd(item) {
            item.show = true;
            if(item.groupList.length == 0 || item.groupList[item.groupList.length - 1].name) {
                item.groupList.push({
                    flag: item.flag,
                    name: '',
                    isUpdate: true,
                })
            }
            this.$nextTick(() => {
                this.$refs['saveInput' + (item.groupList.length - 1)][0].$refs.input.focus();
            });
        }
    },
}
</script>

<style lang="scss" scoped>
    .konwledge {
        display: flex;
        margin-top: 10px;
    }
    .nav {
        width: 200px;
        flex-shrink: 0;
        border: 1px solid #EBEEF5;
        border-radius: 5px;
        padding: 10px 0;
    }
    .content{
        flex: 1;
        padding-left: 15px;
    }
    
    .tree-box {
        font-size: 14px;
        min-height: 100px;
    }
    .tree-box>li {
        position: relative;
        cursor: pointer;
        color: #333;
    }
    .tree-box>li i {
        position: absolute;
        top: 8px;
        left: 4px;
        font-size: 14px;
        color: #606266;
    }
    .node-name {
        position: relative;
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        padding-right: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .node-name.on {
        background: #f5f7fa;
    }
    .node-list .node-name {
        padding-left: 30px;
    }
    .node-list>li {
        position: relative;
    }
    .node-list {
        transition: height 0.3s ease;
        overflow: hidden;
    }
    .el-icon-circle-plus-outline {
        position: absolute;
        right: 6px;
        top: 8px;
        color: #409EFF;
    }
    .el-icon-delete {
        position: absolute;
        right: 6px;
        top: 8px;
        color: #409EFF;
        display: none;
    }
    .el-icon-edit {
        position: absolute;
        right: 25px;
        top: 8px;
        color: #409EFF;
        display: none;
    }
    .node-name:hover,
    .node-list>li:hover .node-name {
        background: #f5f7fa;
    }
    .node-list>li:hover span {
        display: block;
    }
    .node-list>li:hover span.on {
        display: none;
    }
</style>
