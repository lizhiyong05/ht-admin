<template><!-- error zhiyong.li-->
    <div class="error">
        <img src="@/assets/img/error.jpg" alt="错误">
        <p class="btn" @click="$router.go(-1)">返回上一页</p>
    </div>
</template>

<script>
    export default {
        name: 'error'
    }
</script>

<style scoped>
    .error{
        width: 100%;
        position: relative;
    }
    .error img{
        width: 100%;
    }
    .error .btn{
        position: absolute;
        left: 6%;
        top: 65%;
        font-size: 24px;
        color: #409EFF;
        text-decoration: underline;
        cursor: pointer;
    }
</style>