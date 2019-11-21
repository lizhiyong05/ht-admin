<template>
    <div class="editor-show ql-container ql-snow">
        <div v-html="content" class="ql-editor">

        </div>
    </div>
</template>

<script>
    import {axiosPost} from "@/assets/js/api";
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    export default {
        name: "EditorShow",
        data(){
            return {
                content: ''
            }
        },
        created() {
            axiosPost('/materDoc/info',{
                id: 25
            })
                .then(res => {
                    this.content = res.data.docContext;
                })
        }
    }
</script>

<style scoped>

</style>