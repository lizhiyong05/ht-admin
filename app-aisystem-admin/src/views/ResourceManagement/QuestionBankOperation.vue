<!--试题操作-->
<!--周硕梁-->
<template>
    <div class="clearfix">
        <h2 class="title-h2">{{viewTitle}}试题</h2>
        <div class="preservation-container">
            <el-form size="small" :inline="true" :model="formData" class="demo-form-inline" label-width="100px" :rules="formRules"
                     ref="operationForm">
                <p class="child-title">基本信息</p>
                <el-form-item label="试题编号" v-if="operationFlag !== 'add'">
                    <el-input v-model="formData.qNumber" placeholder="自动生成" :disabled="true"></el-input>
                </el-form-item>

                <!--原型中的不明所以字段【试题名称】，疑问2019-06-04 20:14:19已提交给需求（刘介豪已读），待需求回复后添加-->
                <!--2019-06-05 09:24:12需求（刘介豪）反馈需要该字段，列表页也由【题目名称】改为【试题名称】-->
                <!--2019-06-11 15:55:52 赵立强 小鱼视频会议 要求去掉该字段-->
                <!--<el-form-item label="试题名称" prop="qTitle">-->
                <!--<el-input v-model="formData.qTitle" placeholder="请输入"></el-input>-->
                <!--</el-form-item>-->


                <!--TODO 待后端接口明确后开发（原型中拆为所属产线、所属项目）-->
                <el-form-item label="试题分类" prop="qKnowPath">
                    <treeselect v-model="formData.qKnowPath"
                                :options="knowPathOptions"
                                placeholder="请选择所属知识体系"
                                @input="chengeTreeSelect"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                    />
                </el-form-item>

                <!--TODO ⭐原型中列表页叫【难度系数】，新增页叫【试题难度】，原型本身冲突，先按照【难度系数命名】-->
                <el-form-item label="难度系数" prop="qDegree">
                    <el-select v-model="formData.qDegree" placeholder="请选择">
                        <el-option
                                v-for="item in qDegreeOptions"
                                :key="item.dicCode"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--TODO ⭐原型中列表页有【课程名称】【课程类型】字段，新增页【关联课程】原型未说明，老系统【关联课程】为手输且后端接口为字符串字段-->
                <el-form-item label="课程名称" prop="qCourseName">
                    <el-input v-model="formData.qCourseName" placeholder="请输入名称"></el-input>
                </el-form-item>

                <el-form-item label="有效时间" prop="qValidTime">
                    <el-date-picker
                            v-model="formData.qValidTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"

                    >
                    </el-date-picker>

                </el-form-item>

                <!--TODO ⭐原系统【考点】字段指考核要点，现原型里改为【考试地点】，明显不是题目该有的属性，但需求（刘介豪）2019-06-03 17:48:17要求就叫这个，先按照需求要求来-->
                <!--TODO ⭐需求（刘介豪）2019-06-18 19:40:27邮件通知，SVN最新版原型要求改回考点-->
                <el-form-item label="考点" prop="qPoint">
                    <el-input v-model="formData.qPoint" placeholder="请输入"></el-input>
                </el-form-item>


                <p class="child-title">试题配置</p>

                <!--与舒海林约定该字段传dicCode，对应关系：-->
                <!--1、单选题-->
                <!--2、多选题-->
                <!--3、判断题-->
                <!--4、填空题-->
                <!--5、简答题-->
                <!--6、语音题-->
                <el-form-item label="试题类型" prop="qType">
                    <el-select v-model="formData.qType"
                               placeholder="请选择"
                               @change="qTypeChange"
                    >
                        <el-option
                                v-for="item in qTypeOptions"
                                :key="item.dicCode"
                                :label="item.dicName" :disabled="item.disabled"
                                :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="答题指导" prop="qGuide">
                    <el-input
                            class="form-800item"
                            type="textarea"
                            v-model="formData.qGuide"
                            placeholder="最大可输入256个字符"
                            :autosize="{ minRows: 3}"
                    ></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="试题内容" prop="qContent">
                    <el-input
                            v-if="!['4'].includes(formData.qType)"
                            class="form-800item"
                            type="textarea"
                            :maxlength="3000"
                            v-model="formData.qContent"
                            placeholder="最大可输入3000个字符"
                            :autosize="{ minRows: 3}"
                    ></el-input>
                    <!--:data='{oID: element.oID}'-->

                    <el-upload

                               ref="desPic"
                               list-type="picture-card"
                               :show-file-list="true"
                               action=""
                               class="upload-demo upload-des-pic"
                               :limit="MAX_DES_PIC"
                               :http-request="(item) => fileUploadFun(item,  'desPic')"
                               :on-exceed="(files, fileList) => handleExceed(files, fileList,'desPic')"
                               :on-preview="previewPic"
                               accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                               :on-remove="(files, fileList) => handleRemove(files, fileList, 0, 'desPic')"
                               :file-list="formData.qPic"

                    >
                        <i class="el-icon-upload"></i>
                        <!--<el-button size="small" type="primary">点击上传</el-button>-->
                        <!--&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;-->
                        <!--<div slot="tip" class="el-upload__tip">只能上传指定格式的音频、视频文件</div>-->
                    </el-upload>
                    <div v-if="['4'].includes(formData.qType)"
                         class="form-800item"
                    >
                        <p v-if="GLOBAL.TIPS_DISPLAY" class="tips">tips：输入完整的题目后，选中需要填空的文字单击“设为空格</p>
                        <quill-editor
                                ref='quill'
                                v-model="formData.qContent"
                                :options="editorOption"
                                @change="onEditorChange"
                                @focus="onEditorFocus"

                        >
                            <div id="toolbar" slot="toolbar">
                                 <span class="table-operation"
                                       @click="blankSpace(true)"
                                       style="width: 60px; margin-left: 0px;margin-top: 1px; color: #409EFF;cursor: pointer;">设为空格
                                                                </span>
                                <span class="table-operation"
                                      @click="blankSpace(false)"
                                      style="width: 60px; margin-left: 0px;margin-top: 1px; color: #409EFF;cursor: pointer;">取消空格
                                                                </span>
                                <!--<button class="ql-underline" id="ql-underline" style="display: none">-->
                                <!--</button>-->
                                <!--<span class="table-operation" @click="customClick"-->
                                      <!--style="width: 60px; margin-left: 0px;margin-top: 1px; color: #409EFF;cursor: pointer;">设为空格-->
                                <!--</span>-->


                            </div>
                        </quill-editor>
                    </div>

                </el-form-item>

                <br/>
                <!--<el-form-item-->
                <!--v-if="['4',].includes(formData.qType)"-->
                <!--label="x" prop="qAnswer">-->
                <!--<el-input-->
                <!--class="form-800item"-->
                <!--type="textarea"-->
                <!--:maxlength=3000-->
                <!--v-model="formData.qAnswer"-->
                <!--placeholder="请输入"-->
                <!--:autosize="{ minRows: 3}"-->
                <!--&gt;</el-input>-->
                <!--&lt;!&ndash;:data='{oID: element.oID}'&ndash;&gt;-->

                <!--&lt;!&ndash;<el-upload v-if="['1', '2', '3', '5', '6'].includes(formData.qType)"&ndash;&gt;-->

                <!--&lt;!&ndash;list-type="picture-card"&ndash;&gt;-->
                <!--&lt;!&ndash;action=""&ndash;&gt;-->
                <!--&lt;!&ndash;class="upload-demo upload-des-pic"&ndash;&gt;-->
                <!--&lt;!&ndash;:limit="MAX_DES_PIC"&ndash;&gt;-->
                <!--&lt;!&ndash;:http-request="(item) => fileUploadFun(item,  'desPic')"&ndash;&gt;-->
                <!--&lt;!&ndash;:on-exceed="(files, fileList) => handleExceed(files, fileList,'desPic')"&ndash;&gt;-->
                <!--&lt;!&ndash;:on-preview="previewPic"&ndash;&gt;-->
                <!--&lt;!&ndash;accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"&ndash;&gt;-->
                <!--&lt;!&ndash;:on-remove="(files, fileList) => handleRemove(files, fileList, 0, 'desPic')"&ndash;&gt;-->
                <!--&lt;!&ndash;:file-list="qDesc.pic"&ndash;&gt;-->

                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;<i class="el-icon-upload"></i>&ndash;&gt;-->
                <!--&lt;!&ndash;&lt;!&ndash;<el-button size="small" type="primary">点击上传</el-button>&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;&lt;!&ndash;&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;&lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传指定格式的音频、视频文件</div>&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;</el-upload>&ndash;&gt;-->
                <!--</el-form-item>-->
                <el-form-item
                        v-if="['4', '5'].includes(formData.qType)"
                        label="答案" prop="qAnswer">
                    <el-input
                            v-if="['5', ].includes(formData.qType)"
                            class="form-800item"
                            type="textarea"
                            :maxlength="3000"
                            v-model="formData.qAnswer"
                            placeholder="最大可输入3000个字符"
                            :autosize="{ minRows: 3}"
                            @input="$forceUpdate()"
                    ></el-input>

                    <div class="form-800item" style="margin-top: 10px">
                        <el-switch
                                v-if="['4', ].includes(formData.qType)"
                                v-model="formData.qAlternative"
                                active-text="有备选项"
                                inactive-text="无备选项"
                                class="fl"
                                @change="qAlternativeChange"


                        >
                        </el-switch>
                        <el-switch
                                v-if="['4', ].includes(formData.qType)"
                                v-model="formData.qOrdered"
                                active-text="有序阅卷"
                                inactive-text="无序阅卷"
                                class="fr"


                        >


                        </el-switch>
                    </div>

                    <br>

                    <p v-if="['4', ].includes(formData.qType) && formData.qAlternative && GLOBAL.TIPS_DISPLAY"
                       class="tips"
                    >
                        tips：重新设置空格时会清空备选数据
                    </p>
                    <p v-if="['4', ].includes(formData.qType) && !formData.qOrdered && GLOBAL.TIPS_DISPLAY"
                       class="tips"
                    >
                        tips：无序阅卷时,不要求考生填写的答案与设置答案的顺序一一对应
                    </p>
                    <el-tabs
                            type="card"
                            v-if="['4', ].includes(formData.qType)"
                            v-model="formData.blankSelect"
                            @tab-click="tabClick"
                    >
                        <el-tab-pane v-for="(item, index) in formData.blankData"
                                     :key="index.toString()"
                                     :label="'空格' + (index+1)"
                                     :name="index.toString()"


                        >
                            <el-table :data="item" size="mini" border class="form-800item">
                                <el-table-column align="center" prop="aNumber"
                                                 label="序号" width="49">
                                    <template v-if="item.length === 1 || scope.$index !== item.length - 1" slot-scope="scope">
                                        {{scope.$index + 1}}
                                    </template>

                                </el-table-column>
                                <el-table-column align="center" prop="aContent"
                                                 label="类型" width="100" show-overflow-tooltip>
                                    <template v-if="item.length === 1 || scope.$index !== item.length - 1" slot-scope="scope">
                                        <el-tag :type="scope.$index === 0 ? 'success' : 'info'">{{scope.$index === 0 ? '默认答案' :
                                            '备选答案'}}
                                        </el-tag>

                                    </template>

                                </el-table-column>
                                <el-table-column align="center" prop="aContent"
                                                 label="答案" min-width="150" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-input style="width: 100%" v-model="scope.row.content"
                                                  :disabled="scope.$index === 0"></el-input>
                                    </template>

                                </el-table-column>

                                <el-table-column align="center"
                                                 label="操作" width="65">
                                    <template slot-scope="scope">

                                        <span v-if="scope.$index !== 0 && scope.$index !== item.length - 1"
                                              class="table-operation red"
                                              @click="removeAlternative([scope.$index, ])">移除</span>

                                        <span v-if="scope.$index !== 0 && scope.$index === item.length - 1"
                                              class="table-operation"
                                              @click="addAlternative(scope.row.content, item)">添加</span>

                                    </template>

                                </el-table-column>
                            </el-table>
                            <!--{{item[0].content}}-->
                            <!--<template slot-scope="scope"></template>-->
                            <!--&lt;!&ndash;{{scope.item[0][0].content}}&ndash;&gt;-->
                            <!--{{scope}}-->

                        </el-tab-pane>
                    </el-tabs>


                </el-form-item>
                <el-form-item v-if="['6',].includes(formData.qType)" label="语音附件" prop="qDescVoice">

                    <!--TODO 文件格式按照测试用例来-->
                    <el-upload
                            ref="desVoice"
                            action=""
                            class="upload-demo"
                            :limit="MAX_DES_VOICE"
                            :http-request="(item) => fileUploadFun(item,  'desVoice')"
                            :on-exceed="(files, fileList) => handleExceed(files, fileList,'desVoice')"
                            :on-preview="downloadFile"
                            accept=".mp3,.wav,.MP3,.WAV"
                            :on-remove="(files, fileList) => handleRemove(files, fileList, 0, 'desVoice')"
                            :file-list="formData.qVoice"

                    >
                        <i class="el-icon-upload table-operation">上传语音</i>

                    </el-upload>
                </el-form-item>

                <el-dialog :visible.sync="previewIsShow" size="tiny" @cancel="previewIsShow=false">
                    <img width="100%" :src="previewViewURL" alt="">
                </el-dialog>
                <br/>
                <!--TODO所有附件上传大小、格式限制待需求明确后完善-->

                <!--TODO 根据试题类型选择显示不同-->
                <el-form-item label="选项" v-if="['1', '2', '3', '6'].includes(formData.qType)">
                    <div class="table-view" v-if="['1', '3', '6'].includes(formData.qType)">
                        <!--单选 判断 语音-->
                        <!--TODO 此时formData.optionSelect是单字符串，非数组-->
                        <el-radio-group

                                v-model="formData.optionSelect"
                                @change="selectOptionChange"


                        >
                            <!--判断题不可拖拽-->
                            <draggable
                                    class="list-group"
                                    tag="ol"
                                    v-model="formData.optionsData"
                                    v-bind="dragOptions"
                                    @start="drag = ['1', '6'].includes(formData.qType)"
                                    @end="endDrag"
                                    :options="{sort: ['1', '6'].includes(formData.qType)}"
                            >
                                <transition-group v-if="['1', '3', '6'].includes(formData.qType)" type="transition" :name="!drag ? 'flip-list' : null">


                                    <li
                                            class="list-group-item"
                                            v-for="(element, index) in formData.optionsData"
                                            :key="element.oID"
                                    >


                                        <i
                                                :class="
                        element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                        "
                                                @click="element.fixed = !element.fixed"
                                                aria-hidden="true"
                                        >

                                            <el-radio
                                                    :key="element.oID"
                                                    :label="element.oID"
                                            >
                                                <template class="table-view">
                                                    <span class="item-index"> &nbsp;&nbsp;&nbsp;{{optionsMap[index]}}、</span>
                                                    <el-input
                                                            v-if="['1', '6'].includes(formData.qType)"
                                                            type="textarea" :maxlength="1000" autosize :rows='1'
                                                                placeholder="最大可输入1000个字符"
                                                            class="form-800item-input"
                                                            v-model="element.oLabel"></el-input>
                                                    <span
                                                            v-if="['3',].includes(formData.qType)"
                                                    > {{element.oLabel}}</span>
                                                    <i class="el-icon-remove-outline  table-operation-remove-radio fr "
                                                       v-if="['1', '2', '6'].includes(formData.qType)"

                                                       @click="removeOption([element, ])"
                                                    ></i>
                                                </template>
                                            </el-radio>


                                            <el-upload
                                                    ref="optionPic"
                                                    v-if="['1', '6'].includes(formData.qType)"
                                                    :data='{oID: element.oID}'
                                                    list-type="picture-card"
                                                    action=""
                                                    class="upload-demo upload-des-pic"
                                                    :limit="MAX_OPTION_PIC"
                                                    :http-request="(item) => fileUploadFun(item,  'optionPic')"
                                                    :on-exceed="(files, fileList) => handleExceed(files, fileList,'optionPic')"
                                                    :on-preview="previewPic"
                                                    accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                                    :on-remove="(files, fileList) => handleRemove(files, fileList, index, 'optionPic')"
                                                    :file-list="element.oPic"

                                            >
                                                <i class="el-icon-upload"></i>

                                                <!--&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;-->

                                            </el-upload>


                                        </i>


                                    </li>


                                </transition-group>
                            </draggable>
                        </el-radio-group>
                    </div>
                    <div class="table-view" v-if="['2', ].includes(formData.qType)">

                        <!--多选-->
                        <el-checkbox-group

                                v-model="formData.optionSelect"
                                @change="selectOptionChange"


                        >
                            <draggable
                                    class="list-group"
                                    tag="ol"
                                    v-model="formData.optionsData"
                                    v-bind="dragOptions"
                                    @start="drag = true"
                                    @end="endDrag"
                            >


                                <transition-group type="transition" :name="!drag ? 'flip-list' : null">


                                    <li
                                            class="list-group-item"
                                            v-for="(element, index) in formData.optionsData"
                                            :key="element.oID"
                                    >


                                        <i
                                                :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
                                                @click="element.fixed = !element.fixed"
                                                aria-hidden="true"
                                        >


                                            <el-checkbox

                                                    :key="element.oID"
                                                    :label="element.oID"
                                            >
                                                <template class="table-view">
                                                    <span class="item-index"> &nbsp;&nbsp;&nbsp;{{optionsMap[index]}}、</span>
                                                    <el-input type="textarea" :maxlength="1000" autosize :rows='1'
                                                                placeholder="最大可输入1000个字符"
                                                              class="form-800item-input"
                                                              v-model="element.oLabel"></el-input>
                                                    <!--<span style="white-space: normal;word-break: break-all;">{{element.oLabel}}</span>-->
                                                    <!--<i class="el-icon-remove-outline  table-operation-remove fr " v-if="['1', '2', '6'].includes(formData.qType)"-->

                                                    <!--@click="removeOption([element, ])"-->
                                                    <!--&gt;123123</i>-->
                                                    <!--<span v-if="['1', '2', '6'].includes(formData.qType)"-->
                                                    <!--class="table-operation-remove-text fr "-->
                                                    <!--@click="removeOption([element, ])">移除</span>-->
                                                    <i class="el-icon-remove-outline  table-operation-remove fr "
                                                       v-if="['1', '2', '6'].includes(formData.qType)"

                                                       @click="removeOption([element, ])"
                                                    ></i>


                                                </template>

                                            </el-checkbox>


                                            <span v-if="['1', '2', '6'].includes(formData.qType)"
                                                  class="table-operation fr "
                                                  @click="removeOption([element, ])">移除</span>
                                            <el-upload
                                                    ref="optionPic"
                                                    list-type="picture-card"
                                                    :data='{oID: element.oID}'
                                                    :show-file-list="true"
                                                    action=""
                                                    class="upload-demo"
                                                    :limit="MAX_OPTION_PIC"
                                                    :http-request="(item) => fileUploadFun(item,  'optionPic')"
                                                    :on-exceed="(files, fileList) => handleExceed(files, fileList,'optionPic')"
                                                    :on-preview="previewPic"
                                                    accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                                    :on-remove="(files, fileList) => handleRemove(files, fileList, index, 'optionPic')"
                                                    :file-list="element.oPic"

                                            >
                                                <i class="el-icon-upload"></i>

                                                <!--&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;-->

                                            </el-upload>


                                        </i>


                                    </li>


                                </transition-group>

                            </draggable>
                        </el-checkbox-group>
                    </div>
                    <el-button class="addOption el-btn-min-100" v-if="['1', '2', '6'].includes(formData.qType)"
                               size="small" type="primary" @click="addOption">
                        <i class="el-icon-circle-plus-outline"></i>添加选项
                    </el-button>

                    <el-dialog class="need-header" title="添加选项" :visible.sync="addIsShow">
                        <el-form size="small" :model="customOptionData" class="demo-form-inline " label-width="100px">
                            <el-form-item label="选项内容">
                                <el-input type='textarea' :maxlength="1000" :rows="3"
                                            placeholder="最大可输入1000个字符"
                                          style="margin-left: -80px;width: 530px" v-model="customOptionData.oLabel"
                                          auto-complete="off"></el-input>
                            </el-form-item>

                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button size="small" class="el-btn-min-100" @click="addIsShow = false">取消</el-button>
                            <el-button size="small" class="addOptionSave el-btn-min-100" type="primary" @click="addOptionSave">确定</el-button>
                        </div>
                    </el-dialog>
                </el-form-item>

            </el-form>


        </div>
        <div class="button-container">
            <el-button size="small" class="formSubmit el-btn-min-100" type="primary" @click="formSubmit('save')">保存</el-button>
            <!--<el-button size="small" type="primary" @click="formSubmit('fire')">发布</el-button>-->
            <el-button size="small" class="el-btn-min-100" @click="$router.back()">取消</el-button>
        </div>


    </div>
</template>

<script>
    import {
        axiosPost,
        getDictionariesNameData,
        getDictionariesAllData,
        getKnowAllData,
        getMapNameData,
        fileUpload,
    } from '@/assets/js/api';
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import '@/assets/js/dateFormat';
    import {API} from '@/assets/js/urls';
    import GLOBAL from '@/assets/js/globalVariable.js';
    import {getRandomKey, string2XML} from '@/assets/js/tool';
    import draggable from 'vuedraggable'

    export default {
        name: "QuestionBankOperation",
        components: {
            draggable,
            Treeselect,
        },
        computed: {

            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }
        },
        data() {
            return {
                GLOBAL: GLOBAL,
                blankTap: false,
                editorSelect: {
                    blankLength: 0,
                    blankCount: 0,
                },


                editorOption: {
                    placeholder: '',
                    theme: 'snow',
                    modules: {
                        toolbar: ''


                        //     {
                        //     container: [
                        //         ["underline" ],
                        //         // [{"underline": '设为空格'}, ],
                        //         // [{"clean": '设为空格'}, ],
                        //     ]
                        // }
                    }
                },
                // 标题
                viewTitle: '',
                multipleSelection: [], // 多选状态保存
                tableMultipleSelection: [], //已绑定课程

                // 标识
                operationFlag: 'add',


                addData: {
                    qType: '1',
                    qAlternative: false,
                    qGuide: '',
                    optionSelect: [],
                    optionsData: [
                        // {
                        //     oID: '1',
                        //     oLabel: '是一个选项',
                        //     oPic: [],
                        // },

                    ],
                    qContent: '',
                    qValidTime: [],
                    qOrdered: true,  // 有序阅卷为 # 无序阅卷为空
                    qPic:[],
                    qVoice: [],
                    // qDesc: {
                    //     pic: [],
                    //     voice: [],
                    // }, //试题内容
                    qCourse: [{ // 仅支持单选的情况下
                        courseName: '',
                        courseID: ''
                    }],


                    blankSelect: '0',
                    blankData: [
                    ],
                },

                formData: {
                    qType: '1',
                    qAlternative: false,
                    qGuide: '',
                    optionSelect: [],
                    optionsData: [
                        // {
                        //     oID: '1',
                        //     oLabel: '是一个选项',
                        //     oPic: [],
                        //     isSelected: true
                        // },

                    ],

                    qValidTime: [],
                    qContent: '',
                    qOrdered: true,  // 有序阅卷为 # 无序阅卷为空
                    qPic:[],
                    qVoice: [],
                    // qDesc: {
                    //     pic: [],
                    //     voice: [],
                    // }, //试题内容
                    qCourse: [{ // 仅支持单选的情况下
                        courseName: '',
                        courseID: ''
                    }],
                    blankSelect: '0',
                    blankData: [
                    ],
                },
                formRules: {
                    qKnowPath: [{required: true, message: '请选择所属知识体系', trigger: 'change'}],
                    qType: [{required: true, message: '请选择试题类型', trigger: 'change'}],
                    qDegree: [{required: true, message: '请选择难度系数', trigger: 'change'}],
                    qContent: [
                        {required: true, message: '请输入试题内容', trigger: 'blur'},
                        { max: 3000, message: '长度应小于等于3000个字符', trigger: 'blur' }
                    ],
                    qCourseName: [{ max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }],
                    qPoint: [{ max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }],
                    qGuide: [{ max: 256, message: '长度应小于等于256个字符', trigger: 'blur' }],
                    // mRankID: [{required: true, message: '请选择职级', trigger: 'change'}],
                },


                // 字典项
                dictMap: {},
                knowMap: {},
                qDegreeOptions: [], // 难度系数
                qTypeOptions: [], // 题目类型
                knowPathOptions: [], // 试题分类

                // 选项字典，原则上最多至多十个（2019-06-05 原型）
                optionsMap: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '正确', '错误', '#'],

                drag: false,

                addIsShow: false,
                previewIsShow: false,
                previewViewURL: '',

                customOptionData: {},

                minSelect: 0,
                maxSelect: 1,


                // 常量
                MAX_OPTION: 10,
                MAX_OPTION_PIC: 3,
                MAX_DES_PIC: 5,
                MAX_DES_VOICE: 1, // TODO ⭐原型及测试用例里均未有个数限制，先设为1(下方fileUploadFun代码写死）
                MAX_BLANK_COUNT: 5, // TODO ⭐每题最多五个空格
                MAX_BLANK_LENGTH: 20, // TODO ⭐每个空格最多20个字符
                MAX_BLANK_ALTERNATIVE_COUNT: 3, // 填空题每个空最多选项数目


            }
        },
        created() {
            this.loadPreData();
            this.operationModel();

        },
        methods: {
            chengeTreeSelect(){ // tree change
                this.$refs['operationForm'].validateField('qKnowPath');
            },

            operationModel() {
                this.operationFlag = this.$route.query.flag;

                switch (this.operationFlag) {
                    case 'add':
                        this.viewTitle = '新增';
                        this.formData = this.addData;
                        break;

                    case 'edit':
                        this.viewTitle = '修改';
                        if (!this.$route.query.id) {
                            this.$message({message:'请返回列表确认该条数据是否已被删除',type: 'warning'});
                            return;

                        }
                        this.formData.qID = this.$route.query.id;
                        axiosPost(API.QUESTION_DETAIL, {
                            id: this.formData.qID
                        }).then(res => {
                            res = res.data;
                            this.formData = {
                                qID: res.id,
                                qNumber: res.questionNo,
                                qContent: res.questionName,
                                // qContentText: res.questionName,
                                // qContent: res.questionNameTemp,
                                qKnowPath: res.knowledgePath,
                                qType: res.questionType,
                                qState: res.questionState,
                                qCourseName: res.courseName,
                                qCourse: [{
                                    courseID: res.courseId,
                                    courseName: res.courseName
                                }],  // TODO 现需求为单选，为防止需求变动，做成数组预留
                                qDegree: res.questionDegree,
                                qValidTime: [res.questionTimeBegin, res.questionTimeEnd],
                                qCreateUser: res.createUser,
                                qCreateUserName: res.createUserName,
                                qCreateTime: res.createTime,
                                qUpdateUser: res.updateUser,
                                qUpdateTime: res.updateTime,
                                qOrdered: res.isOrder === '1',
                                qAlternative: res.isAlternative === '1',
                                // optionSelect:
                                optionsData: res.choices.map(i => {
                                    i.oID = i.id;
                                    i.oLabel = i.optionContent;
                                    i.oPic = i.file.map(item => {
                                        item.name = item.fileName;
                                        item.url = item.filePath;
                                        return item;
                                    }); // TODO 命名问题待解决
                                    return i;
                                }),
                                optionSelect: [],
                                blankData: [],
                                blankSelect: '0',
                                qGuide: res.questionGuide, // 答题指导
                                qTips: res.questionAnswerTip, // 答题解析
                                qPoint: res.questionPoint,


                            };
                            const selectIndex = res.questionAnswer ? res.questionAnswer.split('|').map(i => this.optionsMap.indexOf(i) > 9 ? this.optionsMap.indexOf(i) - 10 : this.optionsMap.indexOf(i)) : '';
                            // console.log(res.questionAnswer)
                            // console.log(selectIndex)
                            if (['2',].includes(this.formData.qType)) {

                                if (selectIndex.length > 0) {
                                    selectIndex.map(i => {
                                        this.formData.optionSelect.push(this.formData.optionsData[i].oID)
                                    });
                                }

                            }

                            if (['1', '3', '6'].includes(this.formData.qType)) {
                                if (selectIndex.length > 0) {
                                    this.formData.optionSelect = this.formData.optionsData[selectIndex[0]].oID;
                                } else {
                                    this.formData.optionSelect = ''
                                }


                            }

                            if (['4',].includes(this.formData.qType)) {

                                // 接口要求填空题有序，答案字段要传#
                                this.formData.qAnswer = this.formData.qOrdered ? '#' : '';

                                res.choices.map(i => {
                                    let aBlankData = i.optionContent.split('|').map(item => {
                                        return {
                                            content: item
                                        }
                                    });
                                    this.formData.qAlternative ? aBlankData.push({content: ''}) : ''; // 最后一个是添加空位
                                    this.formData.blankData.push(aBlankData);
                                });


                            }
                            if (['5',].includes(this.formData.qType)) {

                                this.formData.qAnswer = res.questionAnswer;

                            }


                            this.formData.qPic = res.file.map(i => {
                                i.url = i.filePath;
                                i.name = i.fileName;
                                return i;
                            });


                            this.formData.qVoice = [{
                                fileName: res.voiceName ? res.voiceName : '',
                                filePath: res.voicePath,
                                name: res.voiceName ? res.voiceName : '',
                                url: res.voicePath,

                            }];
                            //     qVoice: [],
                            // this.formData.qDesc = {
                            //
                            //     // TODO 测试用例里要求试题内容最多可上传五个图片，接口里仅支持单个，待修复
                            //     pic: res.file.map(i => {
                            //         i.url = GLOBAL.SERVE_FILE_ADDRESS + i.filePath;
                            //         i.name = i.fileName;
                            //         return i;
                            //     }),
                            //     voice: [{
                            //         fileName: res.voiceName,
                            //         filePath: res.voicePath,
                            //         name: res.data.voiceName,
                            //         url: GLOBAL.SERVE_FILE_ADDRESS + res.voicePath,
                            //
                            //     }],
                            // }

                        });


                        break;

                    default:
                        // 未定义的flag
                        break;

                }
            },
            customClick() {
                if (this.editorSelect.blankLength > this.MAX_BLANK_LENGTH) {
                    this.$message({message:`选中长度有误,最多${this.MAX_BLANK_LENGTH}`,type: 'warning'});
                    return;
                }
                this.blankTap = true;

                document.getElementById('ql-underline').click();

            },
            loadPreData() {

                // 页面字典等数据预加载

                getDictionariesAllData()
                    .then(res => {

                        this.dictData = res;

                        this.qDegreeOptions = res.subjectDifficult;
                        this.qTypeOptions = res.questionType;


                    });
                getDictionariesNameData()
                    .then(res => {
                        this.dictMap = res;
                    });
                getKnowAllData()
                    .then(res => {
                        this.knowPathOptions = res;
                    });
                getMapNameData()
                    .then(res => {
                        this.knowMap = res;

                    })


            },


            qTypeChange(val) {
                // // console.log(val);
                // console.log(this.formData.qType);
                this.formData.optionSelect = [];
                this.formData.optionsData = [];
                this.formData.qContent = '';
                this.formData.qPic = [];
                this.formData.qVoice = [];

                switch (this.formData.qType) {
                    case '1'://单选题

                        break;

                    case '2'://多选题

                        break;

                    case '3'://判断题
                        this.formData.optionsData = [
                            {
                                oID: parseInt(getRandomKey()) * -1,
                                oLabel: '正确',
                                oPic: [],

                            },
                            {
                                oID: parseInt(getRandomKey()) * -1,
                                oLabel: '错误',
                                oPic: [],
                            }
                        ];

                        break;

                    case '4'://填空题

                        break;

                    case '5'://简答题

                        break;

                    case '6'://语音题

                        break;

                    default:
                        // console.log(`未定义的题目类型${this.formData.qType}`);
                        break;

                }
            },

            fileUploadFun(item, flag) {
                /*
                flag:
                    optionPic 选项图片上传
                    desPic 内容图片上传
                    desVoice 内容语音上传

                 */
                // console.log(item);
                fileUpload(item)
                    .then(res => {
                        // console.log(flag);
                        // console.log(res);
                        item.onSuccess('上传成功');


                        switch (flag) {
                            case 'optionPic':

                                this.formData.optionsData[this.formData.optionsData.findIndex(i => i.oID === item.data.oID)].oPic.push({
                                    name: res.data.oriName,
                                    url: res.data.readAbsoluteLocation,
                                    fileName: res.data.oriName,
                                    filePath: res.data.lastStoreLocation,
                                    status: "success",
                                });
                                // this.formData.optionsData[this.formData.optionsData.findIndex(i => i.oID === item.data.oID)].oPic.push(item);
                                break;
                            case 'desPic':

                               this.formData.qPic.push({
                                   name: res.data.oriName,
                                   url: res.data.readAbsoluteLocation,
                                   fileName: res.data.oriName,
                                   filePath: res.data.lastStoreLocation,
                                   status: "success",
                               })
                                break;
                            case 'desVoice':
                                // this.formData.qVoice.push({
                                //
                                //     name: res.data.storeFileName,
                                //     url: GLOBAL.SERVE_FILE_ADDRESS + res.data.lastStoreLocation,
                                //     fileName: res.data.storeFileName,
                                //     filePath: res.data.lastStoreLocation
                                //
                                // });

                                // 按需求 仅支持一个
                                this.formData.qVoice[0] = {

                                    name: res.data.oriName,
                                    url: res.data.readAbsoluteLocation,
                                    fileName: res.data.oriName,
                                    filePath: res.data.lastStoreLocation,
                                    status: "success",

                                };

                                break;

                            default:
                                // console.log(`未定义的上传组件${flag}`);
                                break;
                        }
                        this.$forceUpdate();

                        // this.$refs[flag].clearFiles();


                        // this.mFiles= [{
                        //     name:res.data.oriName,
                        //     url:res.data.lastStoreLocation,
                        // }]

                        // this.mFiles.push({
                        //     name:res.data.oriName,
                        //     url:res.data.lastStoreLocation,
                        // })

                    })

            },

            handleExceed(files, fileList, flag) { //附件上传

                /*
                flag:
                    optionPic 选项图片上传
                    desPic 内容图片上传
                    desVoice 内容语音上传

                 */
                let temMax = 0;
                switch (flag) {
                    case 'optionPic':
                        temMax = this.MAX_OPTION_PIC;
                        break;
                    case 'desPic':
                        temMax = this.MAX_DES_PIC;
                        break;
                    case 'desVoice':
                        temMax = this.MAX_DES_VOICE;
                        break;

                    default:
                        // console.log(`未定义的上传组件${flag}`)
                        break;
                }
                this.$message.warning(`当前限制上传 ${temMax} 个文件`);
            },

            handleRemove(files, fileList, index, flag) {
                /*
                flag:
                    optionPic 选项图片
                    desPic 内容图片
                    desVoice 内容语音

                 */
                // console.log(fileList);
                switch (flag) {
                    case 'optionPic':
                        this.formData.optionsData[index].oPic = fileList;
                        break;
                    case 'desPic':
                        this.formData.qPic = fileList;

                        break;
                    case 'desVoice':
                        this.formData.qVoice = fileList;

                        break;

                    default:
                        // console.log(`未定义的上传组件${flag}`);
                        break;
                }

                // console.log(files)
                // console.log(fileList)
                // console.log(index)

            },
            previewPic(item) {
                this.previewIsShow = true;
                this.previewViewURL = item.url;
            },
            downloadFile(item) {
                window.open(item.url);
            },

            // 添加选项
            addOption() {
                if (this.formData.optionsData.length >= this.MAX_OPTION) {
                    this.$message({message:`最多只能有${this.MAX_OPTION}个选项`,type: 'warning'});
                    return;
                }
                this.addIsShow = true;
            },

            addOptionSave() {
                this.formData.optionsData.push({
                    oID: parseInt(getRandomKey()) * -1 ,
                    oLabel: this.customOptionData.oLabel,
                    oPic: [],
                    isSelected: false,

                });
                this.customOptionData = {};
                this.addIsShow = false;
            },

            removeOption(val) {
                if (val.length === 0) {
                    this.$message({message:'需选择后方可执行操作',type: 'warning'});
                    return;
                }

                val.map(i => {

                    let score = this.formData.optionsData.findIndex(item => i.oID === item.oID);
                    this.formData.optionsData.splice(score, 1);


                })

            },
            selectOptionChange() {
                this.$forceUpdate()
            },

            // 停止拖动
            endDrag() {
                this.drag = false;
            },


            // 有序 无序 切换
            qAlternativeChange(val){
                this.formData.blankData = this.formData.blankData.map( i => val ? i.slice(0, 1).concat([{content: ''}]) : i.slice(0, 1));


            },

            // 富文本编辑器开始输入

            onEditorChange(event) {
                this.$refs['operationForm'].validateField('qContent');
                // console.log(event)
                // console.log(event.quill)
                let xml_str = event.html;
                let xml = string2XML(xml_str);
                let blanks = xml.getElementsByTagName('u');
                // console.log(blanks);

                this.formData.blankData = [];

                for (let aBlank of blanks) {
                    if (aBlank.textContent.length > this.MAX_BLANK_LENGTH) {
                        this.$message({message:`选中长度有误,最多${this.MAX_BLANK_LENGTH}`,type: 'warning'});
                        event.quill.history.undo();
                        return
                    }
                    if (aBlank.textContent.length > 0) {
                        this.formData.blankData.push(this.formData.qAlternative ? [{content: aBlank.textContent}, {content: ''}] : [{content: aBlank.textContent}])

                    }

                }


                // if (this.blankTap) {
                //     this.formData.blankData = [];
                //     for (let aBlank of blanks){
                //         this.formData.blankData.push(this.formData.qAlternative ? [{content: aBlank.textContent},{content: ''}] : [{content: aBlank.textContent}])
                //         // this.formData.blankData.push([{content: aBlank.textContent},{content: ''}]);
                //     }
                // }


                this.editorSelect.blankCount = blanks.length;
                if (this.editorSelect.blankCount > this.MAX_BLANK_COUNT) {
                    this.$message({message:`空格最多${this.MAX_BLANK_COUNT}个`,type: 'warning'});
                    this.editorSelect.blankCount = blanks.length;
                    event.quill.history.undo();

                    // TODO bug 粘贴数据不合法被撤销后再输入，再此粘贴数据不合法，输入的数据会被撤销。待解决


                }
                this.formData.blankSelect = '0';
                this.blankTap = false;


            },
            // 设为空格
            blankSpace(flag) {
                // let format = this.$refs['quill' + index][0].quill.getFormat();
                // console.log(format)

                if (flag && (this.editorSelect.blankLength > this.MAX_BLANK_LENGTH || this.editorSelect.blankLength <= 0)) {
                    this.$message({message:`选中长度有误,最多${this.MAX_BLANK_LENGTH}`,type: 'warning'});
                    return;
                }
                this.blankTap = true;
                this.$refs['quill'].quill.format('underline', flag)


            },

            //获得焦点、选取
            onEditorFocus(event) {
                // console.log(event);
                this.editorSelect.blankLength = event.selection.savedRange.length;
            },

            //填空题答案选项卡点击
            tabClick(val) {
                // console.log(val)
            },

            addAlternative(val, item){
                if (item.length > this.MAX_BLANK_ALTERNATIVE_COUNT) {
                    this.$message({message:`备选项最多${this.MAX_BLANK_ALTERNATIVE_COUNT - 1 }个`,type: 'warning'});
                    return;
                }
                if (!val) {
                    this.$message({message: '答案长度不能为0',type: 'warning'});
                    return;
                }

                this.formData.blankData[this.formData.blankSelect].push({content: ''})
            },

            //移除备选答案
            removeAlternative(val) {
                if (val.length === 0) {
                    this.$message({message: '需选择后方可执行操作',type: 'warning'});
                    return;
                }

                val.map(i => {
                    this.formData.blankData[this.formData.blankSelect].splice(i, 1);
                })
                this.$forceUpdate()

            },


            fieldTranslate(value, dicMap = false, key = 'id', label = 'dicName') {
                if (dicMap && dicMap.constructor === Array && dicMap.length > 0) {
                    const re = dicMap.find(i => i[key] === value);
                    return re ? re[label] : ''
                }
                return ''
            },


            normalizer(node) {
                return {
                    id: node.path,
                    label: node.knowName,
                    children: node.children,
                }
            },


            formSubmit(val) {
                //TODO 提交接口待调试
                this.$refs['operationForm'].validate((valid) => {
                    if (valid) {
                        if (['1', '2', '3', '6',].includes(this.formData.qType) && this.formData.optionsData.length == 0) {
                            this.$message({message:'选项至少有一个',type: 'warning'});
                            return;
                        }
                        try {

                            let choices = [];
                            let answer = this.formData.qAnswer;
                            let content = this.formData.qContent;
                            // TODO 根据题目类型进行数据再次封装
                            if (['1', '2', '3', '6',].includes(this.formData.qType)) {
                                choices = this.formData.optionsData.map(i => {
                                    i.optionContent = i.oLabel;
                                    i.file = i.oPic;
                                    i.id = i.oID;
                                    return i;
                                });
                                if (['2',].includes(this.formData.qType)) {
                                    answer = this.formData.optionSelect.reduce((a, b) => {
                                        return a + '|' + this.optionsMap[choices.findIndex(i => i.oID === b)]
                                    }, '').slice(1)
                                } else if (['3',].includes(this.formData.qType)) {
                                    answer = this.optionsMap[choices.findIndex(i => i.oID === this.formData.optionSelect) + 10]
                                    if(answer != '正确' && answer != '错误') {
                                        this.$message({message:'请选择试题答案',type: 'warning'});
                                        return;
                                    }
                                } else{
                                    answer = this.optionsMap[choices.findIndex(i => i.oID === this.formData.optionSelect)]
                                }
                            }

                            if (['4',].includes(this.formData.qType)) {
                                // 替换u标签 删除p标签
                                content = content.replace(/style\s*?=\s*?(['"])[\s\S]*?\1/g, '').replace(/\s+/g, '').replace(/<u>[^(<u>)]*<\/u>/g, '[blank]').replace(/<p>|<\/p>/g, '');
                                answer = this.formData.qOrdered ? '#' : '';
                                // 不再包含id等,仅有optionContent
                                choices = this.formData.blankData.map(i => {
                                    this.formData.qAlternative ? i.pop() : '';
                                    return {
                                        optionContent: i.reduce((a, b) => {
                                            return a + '|' + b.content
                                        }, '').slice(1)
                                    }
                                });
                                if (choices.length == 0) {
                                    this.$message({message:'请填写或选择试题答案',type: 'warning'});
                                    return;
                                }

                            }
                            if (['1', '2', '6',].includes(this.formData.qType) && !answer) {
                                this.$message({message:'请选择试题答案',type: 'warning'});
                                return;
                            }


                            switch (this.operationFlag) {
                                case 'add':
                                    axiosPost(API.QUESTION_ADD, {
                                        noRepeat:'.formSubmit',
                                        knowledgePath: this.formData.qKnowPath,
                                        knowledgeId: this.formData.qKnowPath ? this.formData.qKnowPath.split('/').pop() : '',
                                        questionName: content.replace(/<\/?[^>]+\/?>|&nbsp;/g, ''), //试题内容
                                        questionType: this.formData.qType,
                                        questionTypeName: this.fieldTranslate(this.formData.qType, this.qTypeOptions, 'dicCode'),
                                        courseName: this.formData.qCourseName, //现需求为单选，为防止需求变动，做成数组预留
                                        courseId: this.formData.qCourse.length > 0 ? this.formData.qCourse[0].courseID : '', //如不需要判重，就用不到
                                        questionDegree: this.formData.qDegree,
                                        questionAnswer: answer,
                                        questionGuide: this.formData.qGuide,
                                        questionPoint: this.formData.qPoint,
                                        questionTimeBegin: this.formData.qValidTime && this.formData.qValidTime.length === 2? this.formData.qValidTime[0]: '',
                                        questionTimeEnd: this.formData.qValidTime && this.formData.qValidTime.length === 2? this.formData.qValidTime[1]: '',
                                        voicePath: this.formData.qVoice.length > 0 ? this.formData.qVoice[0].filePath : '', //现需求为单选，为防止需求变动，做成数组预留
                                        voiceName: this.formData.qVoice.length > 0 ? this.formData.qVoice[0].fileName : '', //现需求为单选，为防止需求变动，做成数组预留
                                        isOrder: this.formData.qOrdered ? '1' : '0',
                                        isAlternative: this.formData.qAlternative ? '1' : '0',
                                        paperAddType: '1', // TODO ⭐是否插入题库，0531原型无此功能，与后端约定先传固定值
                                        choices: choices,
                                        file: this.formData.qPic,
                                        // questionAnswerTip: this.formData.qTips, //TODO ⭐答题解析，后端反馈有，原型里没有，已反馈给需求，未得到答复

                                        // questionState: this.formData.qState, TODO ⭐原型里没有配置的地方，已反馈给需求，未得到答复


                                    }).then(res => {
                                        // console.log(res)
                                        this.$message({message:'新增成功',type: 'success'});
                                        this.$router.back();
                                    });


                                    break;

                                case 'edit':

                                    axiosPost(API.QUESTION_EDIT, {
                                        noRepeat:'.formSubmit',
                                        id: this.formData.qID,
                                        knowledgePath: this.formData.qKnowPath,
                                        knowledgeId: this.formData.qKnowPath ? this.formData.qKnowPath.split('/').pop() : '',
                                        questionName: content.replace(/<\/?[^>]+\/?>|&nbsp;/g, ''), //试题内容
                                        questionType: this.formData.qType,
                                        questionTypeName: this.fieldTranslate(this.formData.qType, this.qTypeOptions, 'dicCode'),
                                        courseName: this.formData.qCourseName, //现需求为单选，为防止需求变动，做成数组预留
                                        courseId: this.formData.qCourse.length > 0 ? this.formData.qCourse[0].courseID : '', //如不需要判重，就用不到
                                        questionDegree: this.formData.qDegree,
                                        questionAnswer: answer,
                                        questionGuide: this.formData.qGuide,
                                        questionPoint: this.formData.qPoint,
                                        questionTimeBegin: this.formData.qValidTime && this.formData.qValidTime.length === 2? this.formData.qValidTime[0]: '',
                                        questionTimeEnd: this.formData.qValidTime && this.formData.qValidTime.length === 2? this.formData.qValidTime[1]: '',
                                        voicePath: this.formData.qVoice && this.formData.qVoice.length > 0 ? this.formData.qVoice[0].filePath : '', //现需求为单选，为防止需求变动，做成数组预留
                                        voiceName: this.formData.qVoice && this.formData.qVoice.length > 0 ? this.formData.qVoice[0].fileName : '', //现需求为单选，为防止需求变动，做成数组预留
                                        isOrder: this.formData.qOrdered ? '1' : '0',
                                        isAlternative: this.formData.qAlternative ? '1' : '0',
                                        paperAddType: '1', // TODO ⭐是否插入题库，0531原型无此功能，与后端约定先传固定值
                                        choices: choices,
                                        file: this.formData.qPic,
                                        // questionAnswerTip: this.formData.qTips, //TODO ⭐答题解析，后端反馈有，原型里没有，已反馈给需求，未得到答复

                                        // questionState: this.formData.qState, TODO ⭐原型里没有配置的地方，已反馈给需求，未得到答复


                                    }).then(res => {
                                        // console.log(res)
                                        this.$message({message:'修改成功',type: 'success'});
                                        this.$router.back();
                                    });

                                    break;
                                default:

                                    // console.log(`${this.operationFlag}未定义`)

                                    break;


                            }

                        } catch (e) {
                            // console.log(e);
                        }


                    }
                })


            },


        },
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

    .map-button {
        margin: 10px 0;
    }

    .table-operation {

        margin-top: 1px;
        color: #409EFF;
        margin-left: 5px;
        cursor: pointer;
    }

    .table-view {

        width: 900px;
        margin-top: -9px;
        margin-left: 8px;
    }

    .upload-des-pic {
        margin-top: 10px;
    }


    .tips {
        color: #909399;
        font-size: 13px;
        cursor: pointer;
        margin-bottom: 5px;
    }

    .table-operation-disable {
        color: #909399;
        margin-left: 5px;
        cursor: pointer;
    }
    .red {
        color: red;
    }

    .el-pagination {
        display: inline-block;
    }

    .pagination {
        font-size: 14px;
        line-height: 27px;
        margin-top: 20px;
    }

    .total {
        font-weight: bold;
    }

    .el-input {
        width: 200px;
    }

    .vue-treeselect {
        width: 200px;
        float: left;
    }

    .preservation-container ul li {
        margin: 20px 20px 0 0;
        float: left;
    }

    .demo-form-inline {
        margin: 20px 20px 0 0;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
    }

    .list-group-item {
        cursor: move;
        margin: 10px 0;
        display: block;
    }

    .list-group-item i {
        cursor: pointer;
        /*width: 100%;*/


    }

    .table-operation-remove {
        margin-top: 7px;
        color: red;
        margin-left: 10px;
        cursor: pointer;
    }

    .table-operation-remove-radio {
        margin-top: 10px;
        color: red;
        margin-left: 10px;
        cursor: pointer;
    }

    .table-operation-remove-text {
        margin-top: 1px;
        margin-left: 5px;
        color: red;
    }


    .course-des {
        width: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .child-title {
        margin-bottom: 20px;
    }

    .form-800item {

        width: 800px;
    }

    .item-index {
        font-weight: 900;

    }

    .form-800item-input {
        /*margin-top: 50px;*/
        width: 750px;
        /*height: 26px;*/
        /*padding-top: 0px;*/
    }

    .upload-demo {
        margin-top: 10px;
    }
</style>


<!--TODO 需求变更记录-->
<!--2019-06-04 20:14:19 钉钉群 刘介豪-->
<!--1、原型中的不明所以字段【试题名称】，疑问2019-06-04 20:14:19已提交给需求（刘介豪已读），待需求回复后添加-->

<!--2019-06-05 09:24:12 钉钉群 刘介豪-->
<!--1、2019-06-05 09:24:12需求（刘介豪）反馈需要该字段，列表页也由【题目名称】改为【试题名称】-->

<!--2019-06-11 15:55:52 赵立强 小鱼视频会议-->
<!--1、去掉试题名称（题目名称）字段-->
<!--2、关联课程改为点击后弹窗绑定,单选-->
<!--3、去掉课程类型字段-->

