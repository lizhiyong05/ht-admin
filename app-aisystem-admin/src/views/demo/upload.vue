<template>
    <div class="upload-file">
        <el-upload
                action=""
                class="upload-demo"
                multiple
                :limit="3"
                :http-request="fileUploadFun"
                :on-exceed="handleExceed"
                :file-list="fileList">
            <p>点击上传</p>
        </el-upload>
    </div>
</template>

<script>
    import {fileUpload} from "@/assets/js/api";
    export default {
        name: "upload",
        data(){
            return {
                fileList:[]
            }
        },
        methods:{
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            fileUploadFun(item){
                fileUpload(item)
                    .then(res => {
                        console.log(res);
                    })

            }
        }
    }
</script>

<style scoped>

</style>