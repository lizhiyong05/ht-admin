<template>
    <div class="to-pdf">
        <el-button @click="getPdf()">将id为pdfDom的元素转为pdf</el-button>
        <div id="pdfDom">
            111
        </div>
    </div>
</template>

<script>
    export default {
        name: "toPdf",
        data(){
            return {
                htmlTitle: 'result'
            }
        }
    }
</script>

<style scoped>

</style>