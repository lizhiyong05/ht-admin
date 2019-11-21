<template><!-- 人员选择树 zhiyong.li -->
    <div class="personnel-selection">
        <el-dialog title="人员选择" :visible.sync="selectConfigIsShowCopy" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeRemodal">
            <div class="dialog-container clearfix">
                <div class="tree-left fl">
                    <ul class="tab-list clearfix">
                        <li v-for="(item,ind) in topTab" :key="ind" :class="topTabInd == item.id ? 'tab-select' : ''" @click='topTabChange(item.id)'>{{item.label}}</li>
                    </ul>
                    <div class="tree-left-bottom clearfix">
                        <div class="tree-container fl">
                            <p class="tree-title">请选择机构：</p>
                            <treeselect :options="orgData" placeholder="请选择所属机构" v-model="orgValue" :normalizer="normalizer"  :async="false" @input="orgChange"
                                        noResultsText="未找到，请重新输入"/>
                        </div>
                        <div class="people-container fl">
                            <p class="tree-title">机构所对应的人员：</p>
                            <div class="search-containers">
                                <ul class="clearfix search-list">
                                    <el-checkbox-group v-model="resultData">
                                        <li class="fl" v-for="(item,ind) in searchData" :key="ind" >
                                            <el-checkbox :label="JSON.stringify({userId: item.userId,userName: item.userName})">{{item.userName}}</el-checkbox>
                                        </li>
                                    </el-checkbox-group>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tree-right fl">
                    <p class="tree-title">已选择人员：</p>
                    <ul class="result-list">
                        <li v-for="(item,ind) in resultData" :key="ind">{{JSON.parse(item).userName}} <span class="delete-btn" @click="deleteData(JSON.parse(item))">删除</span></li>
                    </ul>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectConfigIsShowCopy=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="sendDataFun" class="el-btn-min-100" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    // 组件使用方法 子组件已经封装完毕 请注意父组件的调用
    // 1、selectConfigIsShow：弹窗是否显示，,cascadeOrg：按机构查询时是否级联子机构  不传不级联 传值就级联, dataLength:能选择几条数据，不传默认不限制,types:用户类型,值为数组  ["STUDENT","TEACHER","LECTURER","USER"]
    //  withOut : 反向逻辑。 1、如选择除了学生的所有用户：{type: ["STUDENT"],withOut:'withOut'}；2、如选择学生的所有用户：{type: ["STUDENT"]}；使用方法：正向逻辑不需要传withOut,反向逻辑需要传withOut,值为任意值。
    //  existingData 默认回显的数据
    // 2、子组件不能更改父组件传过来的值，需要用到另一个变量selectConfigIsShowCopy
    // 3、子组件作为弹窗时，父组件需用v-if来控制子组件的渲染
    // 4、子组件需要发送两个事件，父组件用来接收，一个是选择完数据后，另一个是弹窗关闭时
    // 5、子组件复选框：选择某一人员后，来回切换子机构，若在子机构人员遇到选择过的人员后，默认为选中状态，需要把选中的item转为json串，否则elementui没有把《对象》做处理
    // 6、删除选择后的数据时，需要先把json串转为对象，删除后再转为json串，用于第5条作铺垫
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {axiosPost,getOrgAllData } from '@/assets/js/api'
export default {
    name: 'PersonnelSelection',
    components:{
        Treeselect
    },
    props: { // ['selectConfigIsShow','types','cascadeOrg','dataLength'],
        selectConfigIsShow: {
            type: Boolean
        },
        types: {
            type: Array
        },
        cascadeOrg: {
            type: String
        },
        dataLength: {
            default: 9999
        },
        withOut:{
            default: ''
        },
        existingData:{ // 传递过来的数据
            type: Array,
            default: () => []
        }
    },
    data(){
        return {
            selectConfigIsShowCopy: this.selectConfigIsShow, // 复制props 里面的数据
            topTab:[
                {
                    label: '机构1',
                    id: 1
                }
            ],
            topTabInd: 1,
            orgValue: null,
            orgData:[], // 机构数据
            searchData: [], // 搜索出来的数据
            resultData: [] // 选中的数据
        }
    },
    created(){
        let userId = this.existingData.map(item => {
            return item.userId;
        });
        this.getUserInfo(userId);
        getOrgAllData().then(res => {
            this.orgData = res;
        });
    },
    methods:{
        getUserInfo(userId){ // 获取用户信息
            axiosPost('/systemMgr/user/list2',{
                userIds: userId.length > 0 ? userId : ['not-found-id']
            })
                .then(res => {
                    this.resultData = res.data.map(item => {
                       return JSON.stringify({userId: item.userId,userName: item.userName});
                    });
                })
        },
        normalizer(res){ // 更改插件默认属性
            return {
                id: res.id,
                label: res.orgName,
                children: res.children
            }
        },
        topTabChange(res){ // 搜索类型更改
            this.topTabInd = res
        },
        orgChange(){ // 选择机构
            this.searchData = '';
            axiosPost("/resourceMgr/user/check",{
                orgId: this.orgValue,
                cascadeOrg: this.cascadeOrg,
                types: this.types,
                withOut: this.withOut
            })
            .then(res => {
                this.searchData = res.data;
            })
        },
        deleteData(item){ // 删除数据
            this.resultData.forEach((items,ind) => {
                this.resultData[ind] = JSON.parse(items);
            });
            this.resultData.splice(this.resultData.findIndex(v => v.userId == item.userId),1);
            this.resultData.forEach((items,ind) => {
                this.resultData[ind] = JSON.stringify(items);
            })
        },
        sendDataFun(){ // 返回数据
            let result = [];
            this.resultData.forEach((items,ind) => {
                result[ind] = JSON.parse(items);
            });
            if(result.length === 0){
                this.$message({message: '请选择数据',type: 'warning'});
            }else if(result.length > this.dataLength){
                this.$message({message: `您只能选择${this.dataLength}条数据`,type: 'warning'});
            }else{
                this.selectConfigIsShowCopy=false;
                this.$emit('listenEventData',result);
                this.$emit('listenEventClose',this.selectConfigIsShowCopy);
            }
        },
        closeRemodal(){
            this.$emit('listenEventClose',this.selectConfigIsShowCopy);
        }
    }
}
</script>
<style scoped>
    .dialog-container{
        height: 300px;
    }
    .tree-left{
        width: 80%;
        border: 1px solid #ccc;
        height: 100%;
    }
    .tree-left .tab-list{
        overflow: hidden;
    }
    .tree-left .tab-list li{
        float: left;
        padding: 0 20px;
        font-size: 16px;
        height: 46px;
        line-height: 46px;
        cursor: pointer;

    }
    .tree-left .tree-left-bottom{
        height: 254px;
        border-top: 1px solid #ccc;
    }
    .tab-select{
        border-bottom: 2px solid #409EFF;
        color: #409EFF;
    }
    .tree-right{
        width: 18%;
        height: 100%;
        border: 1px solid #ccc;
        margin-left: 2%;
    }
    .tree-right .result-list{
        height: 268px;
        overflow-y:auto;
        padding: 0 10px;
    }
    .tree-title{
        color: #409EFF;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
    }
    .tree-right ul::-webkit-scrollbar,.search-list::-webkit-scrollbar{width: 5px;height: 1px;}
    .tree-right ul::-webkit-scrollbar-thumb,.search-list::-webkit-scrollbar-thumb{border-radius: 10px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #d4d2d2cc;}
    .tree-right ul::-webkit-scrollbar-track,.search-list::-webkit-scrollbar-track{width: 10px;height: 1px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #fff;}
    .tree-right li{
        line-height: 30px;
        font-size: 14px;
    }
    .tree-container{
        height: 100%;
        width: 30%;
        border-right: 1px solid #ccc;
    }
    .people-container{
        height: 100%;
        width: 70%;
    }
    .search-containers .search-list{
        height: 222px;
        overflow-y: auto;
        padding: 10px 20px;
    }
    .search-list li{
        width: 94px;
        line-height: 30px;
    }
    .delete-btn{
        padding-left: 8px;
        cursor: pointer;
        color: #409EFF;
    }
</style>