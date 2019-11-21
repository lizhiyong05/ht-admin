<template>
    <div class="editor">
        {{content}}
        <quill-editor
                v-model="content"
                @blur="onEditorBlur"
                @paste.native="textInit"
                ref="myQuillEditor"
        >
        </quill-editor>
        <el-button @click="editSubmit">点击</el-button>
    </div>
</template>

<script>
    import {axiosPost} from "@/assets/js/api";

    export default {
        name: "Editor",
        data(){
            return {
                content: ''
            }
        },
        mounted(){
            console.log('<p>111</p>'.replace(/<\/?[^>]+\/?>/g,''));
            // /<[^>]+>/g
        },
        methods: {
            editSubmit() {
                axiosPost('/materDoc/create', {
                    docContext: this.content
                })
            },
            onEditorBlur(e){
                this.content = this.content.replace(/<\/?.+?\/?>/g,'');
                console.log(this.content)
                let a = (/<\/?[^u].?\/?$>/g,'');
            },
            textInit(e) {
                var e = window.event;
                e.preventDefault();
                var text = null;
                //得到剪贴板中的文本
                if (window.clipboardData && clipboardData.setData) {
                    // IE
                    text = window.clipboardData.getData('text');
                } else {
                    try {
                        text = (e.originalEvent || e).clipboardData.getData('text/plain');
                    } catch (e) {
                        return;
                    }
                };
                if (document.body.createTextRange) {
                    if (document.selection) {
                        textRange = document.selection.createRange();
                    } else if (window.getSelection) {
                        sel = window.getSelection();
                        var range = sel.getRangeAt(0);
                        // 创建临时元素，使得TextRange可以移动到正确的位置
                        var tempEl = document.createElement("span");
                        tempEl.innerHTML = "&#FEFF;";
                        range.deleteContents();
                        range.insertNode(tempEl);
                        textRange = document.body.createTextRange();
                        textRange.moveToElementText(tempEl);
                        tempEl.parentNode.removeChild(tempEl);
                    };
                    textRange.text = text;
                    textRange.collapse(false);
                    textRange.select();
                } else {
                    // Chrome之类浏览器
                    document.execCommand("insertText", false, text);
                };
            }
        }
    }
</script>

<style scoped>

</style>