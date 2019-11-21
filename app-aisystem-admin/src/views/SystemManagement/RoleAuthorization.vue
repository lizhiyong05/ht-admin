<template><!-- 角色授权 zhiyong.li -->
    <div class="RoleAuthorization clearfix">
        <h2 class="title-h2">角色授权</h2>
            <div class="role-container loading-table1">
                <el-table :data="roleRecord" highlight-current-row border @current-change="handleCurrentChange" ref="roleTable" size="mini">
                    <el-table-column prop="roleCode" label="角色编号" align="center"></el-table-column>
                    <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                </el-table>
            </div>
            <el-table :data="jurisdictionRecord" row-key="id"  border style="margin-top: 20px;min-width: 700px;" class="role-table loading-table2" size="mini">
                <el-table-column prop="flag" label="是否拥有" width="100" >
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isHave" @change="handleCheckAllChange(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="cnName" label="菜单名称" ></el-table-column>
                <el-table-column label="菜单类型">
                    <template slot-scope="scope">
                        {{scope.row.isInvented ? dictionariesNameData[scope.row.isInvented] : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="操作权限" >
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="scope.row.frontOperationArr" @change="jurisdictionChange(scope.row)">
                            <el-checkbox v-for="(item,ind) in scope.row.operationRightList" :label="item.id" :key="ind">{{item.cnName}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column label="数据权限" width="450">
                    <template slot-scope="scope">
                        <treeselect v-model="scope.row.frontDataArr"  v-if="scope.row.dataRightType == 'KNOW'"
                                    :options="knowAllData"
                                    :multiple="true"
                                    placeholder="请选择权限"
                                    noResultsText="未找到，请重新输入"
                                    :normalizer="normalizer">
                        </treeselect>
                        <treeselect v-model="scope.row.frontDataArr"  v-if="scope.row.dataRightType == 'ORG'"
                                    :options="orgAllData"
                                    :multiple="true"
                                    placeholder="请选择权限"
                                    noResultsText="未找到，请重新输入"
                                    :normalizer="normalizer1">
                        </treeselect>
                    </template>
                </el-table-column>
            </el-table>
        <div class="btn-container">
           <el-button @click="preservationRoleJurisdiction" class="no-repeat-click">保存</el-button>
        </div>
    </div>
</template>

<script>
    import {axiosPost,getKnowAllData,getMapNameData,getOrgAllData,getOrgNameData,getDictionariesNameData} from "@/assets/js/api";
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'


    export default {
        name: 'RoleAuthorization',
        components:{
            Treeselect
        },
        data(){
            return {
                roleRecord: [], // 角色列表
                jurisdictionRecord: [], // 权限列表
                multipleSelection: [], // 表格已经选择的内容
                roleId: '', // 角色id
                knowAllData: [], // 知识体系
                mapNameData: [], // 知识体系
                orgAllData: [], // 组织机构
                orgNameData: [], // 组织机构
                dictionariesNameData: {}, // 获取字典
            }
        },
        created(){
            getKnowAllData().then(res => {
                this.knowAllData = res;
            });
            getMapNameData().then(res => {
                this.mapNameData = res;
            });
            getOrgAllData().then(res => {
                this.orgAllData = res;
            });
            getOrgNameData().then(res => {
                this.orgNameData = res;
            });
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
            this.getRoleList();
        },
        methods:{
            getRoleList(){ // 获取角色列表
                axiosPost('/systemMgr/role/list1',{
                    loading: '.loading-table1'
                })
                    .then(res => {
                        this.roleRecord = res.data;
                        this.roleId = this.roleRecord[0].roleId;
                        this.$refs.roleTable.setCurrentRow(this.roleRecord[0]);
                    })
            },
            getJurisdictionList(roleId){ // 获取权限列表
                axiosPost('/systemMgr/right/all',{
                    roleId: roleId,
                    loading: '.loading-table2'
                })
                    .then(res => {
                        this.jurisdictionRecord = res.data;
                    })
            },
            handleCurrentChange(row) { // 更改角色列表
                this.multipleSelection = row;
                this.roleId = row.roleId;
                this.getJurisdictionList(row.roleId);
            },
            handleCheckAllChange(row){ // 权限列表点击 是否拥有
                if(row.isHave === false){
                    row.frontOperationArr = [];
                    row.frontDataArr = [];
                }
            },
            jurisdictionChange(row){ // 操作权限数据修改
                if(row.frontOperationArr.length === 0 && row.frontDataArr.length === 0){
                    row.isHave = false;
                }else{
                    row.isHave = true;
                }
            },
            normalizer(node) { // 知识体系树
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },
            normalizer1(node) { // 组织机构树
                return {
                    id: node.id,
                    label: node.orgName,
                    children: node.children,
                }
            },
            eachRecord(data,menuList){ // 遍历数据
                data.forEach((item) => {
                    if(item.isHave === true){
                        menuList.push({
                            dataRightType: item.dataRightType,
                            menuId: item.id,
                            dataRight: JSON.stringify(item.frontDataArr),
                            operationRight: JSON.stringify(item.frontOperationArr),
                        });
                        if(item.children instanceof Array && item.children.length > 0){ // 有子元素
                            menuList = this.eachRecord(item.children,menuList);
                        }
                    }
                });
                return menuList;
            },
            preservationRoleJurisdiction(){ // 保存角色权限
                let menuList = this.eachRecord(this.jurisdictionRecord,[]);
                axiosPost('/systemMgr/role/assignRight',{
                    roleId: this.roleId,
                    menuList: menuList,
                    noRepeat: '.no-repeat-click'
                })
                    .then(() => {
                        this.$message({message:'保存成功',type:'success'});
                    });
            }
        }
    }
</script>
<style scoped>
    .role-container{
        margin-top: 30px;
        width: 400px;
    }
    .btn-container{
        margin-top: 30px;
    }
    .RoleAuthorization >>> .el-checkbox__label{
        display: inline;
    }
    .RoleAuthorization >>> .el-checkbox{
        white-space: normal;
        word-break: break-all;
    }
    .role-table{
        overflow: visible;
    }
    .role-table >>> .cell{
        overflow: visible;
    }
    .role-table >>> .el-table__body-wrapper{
        overflow: visible;
    }
    .role-table >>> .el-table__row td:first-child .cell label:first-child{
        padding-left: 23px;
    }
</style>
