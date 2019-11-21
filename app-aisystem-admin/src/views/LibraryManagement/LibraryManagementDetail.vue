<template><!-- 文库管理详情 shuling.xiang-->
    <div class="library-management-detail">
        <h2 class="title-h2">文库管理详情</h2>
        <div class="search-container">
            <ul class="detail-list clearfix">
                <li>
                    <span class="left-tit">文档编号：</span>
                    <span class="doc-context">{{docId}}</span>
                </li>
                <li>
                    <span class="left-tit">文档类型：</span>
<!--                    <span class="doc-context">{{dictionariesNameData[docType]}}</span>-->
                    <span class="doc-context">{{fieldTranslate(docType, docTypeOptions)}}</span>
                </li>
                <li class="wid100">
                    <span class="left-tit">文档标题：</span>
                    <span class="doc-context">{{docTitle}}</span>
                </li>
                <li class="wid100">
                    <span class="left-tit">正文：</span>
                    <quill-editor class="Context-content"
                                  v-model="docContext"
                                  ref="myQuillEditor"
                                  disabled
                    >
                    </quill-editor>
                </li>
                <li class="wid100">
                    <span class="left-tit">相关附件：</span>
                    <span class="doc-context">
<!--                        <el-upload-->
<!--                                class="upload-demo" action="" :show-file-list="false"-->
<!--                                multiple-->
<!--                                :http-request="fileUploadCoversFun"-->
<!--                                :before-upload="imgUploadBefore"-->
<!--                        >-->
<!--                        <p>上传封面</p>-->
<!--                    </el-upload>-->
                        <a v-for="(item, index) in docFiles" :key="index" :href="item.readAbsoluteLocation" target="_blank">{{item.fileName}}</a>
                    </span>
                </li>
            </ul>
        </div>
        <div class="map-list">
            <div class="button-container">
                <el-button class="el-btn-min-100" type="primary" @click="back" size="small">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
    } from "@/assets/js/api"
    import ElUploadList from "element-ui/packages/upload/src/upload-list";
    // import GLOBAL from '@/assets/js/globalVariable.js';

    export default {
        name: "LibraryManagementDetail",
        components:{
            ElUploadList,
        },
        data() { // 存储数据
            return {
                // GLOBAL: GLOBAL,
                dictionariesAllData: [], //获取全部数据字典
                dictionariesNameData:[],// 获取基本类型字典项数据的某个值
                docId: '', //文档编号
                docTitle: '', //文档标题
                docStatus: '', //文档状态
                docContext: '', //文档正文
                docFiles: [{ //附件
                    fileName: '',
                    filePath: '',
                    readAbsoluteLocation: '',
                    }
                ],
                filePath:'',
                fileList:[], //附件上传
                createUser: '', //创建人
                docTypeOptions: [], //文档类型
                docType: '', //文档类型'
                // 字典项
                dictData: {},
            }
        },
        created() { //创建完成 生命周期 详情页跳转
            this.loadPreData();
            axiosPost('/materialMgr/materDoc/info',{
                id: this.$route.query.id
            })
                .then((res)=> {
                    this.docId = res.data.docId,
                    this.docTitle = res.data.docTitle,
                    this.docType = res.data.docType,
                    this.docContext = res.data.docContext,
                    this.docFiles = res.data.docFiles
                })
        },
        methods: {
            loadPreData() {

                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {
                        this.dictData = res;
                        this.docTypeOptions = res.docTypeOptions;
                    });
                getDictionariesNameData().then(res => { //获取全部数据字典名称
                    this.dictionariesNameData = res;

                });
            },
            // 字段翻译
            fieldTranslate(value, dicMap=false, key='id', label='dicName') {
                if (dicMap && dicMap.constructor === Array && dicMap.length > 0 ) {
                    const re = dicMap.find(i => i[key] === value);
                    return re ? re[label] : ''
                }
                return ''
            },

            back() {
                this.$router.go(-1);//返回
            },
        }
    }
</script>

<style scoped>

    .search-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .el-input {
        width: 200px;
    }

    .button-container {
        text-align: center;
        margin-top: 20px;
    }
    .wid100 {
        width:100%;
    }
    .detail-list li {
        float:left;
        width:33%;
        padding:10px 0 0 0;
    }
    .detail-list li.wid100 {
        width:100%;
        padding:10px 0 0 0;
    }
    .detail-list .left-tit {
        display:inline-block;
        width:100px;
        font-size:16px;
        font-weight: bold;
        vertical-align: top;
    }
    .detail-list .doc-context {
        display:inline-block;
        font-size:14px;
    }
    .detail-list .doc-context a {display: block;}

    .Context-content {
        margin:-35px 0 0 9%;
    }
    .library-management-detail >>> em {font-style: italic!important;}
</style>