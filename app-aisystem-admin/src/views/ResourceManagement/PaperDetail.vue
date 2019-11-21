<template>
    <div class="clearfix">
        <h2 class="title-h2">试卷详情</h2>

        <div class="preservation-container"  >
            <el-form size="small" :inline="true" :model="formData" class="demo-form-inline" label-width="100px" :rules="formRules"
                     ref="operationForm" :disabled="disableflag">
                <p class="child-title">基本信息</p>
                <el-form-item label="试题编号" v-if="operationFlag !== 'add'">
                    <el-input v-model="formData.pNumber" placeholder="" :disabled="disableflag"></el-input>
                </el-form-item>


                <el-form-item label="试卷名称" prop="pName">
                    <el-input v-model="formData.pName" placeholder="请输入"></el-input>
                </el-form-item>


                <!--TODO 原型里没有-->
                <el-form-item label="试卷分类" prop="pKnowPath">
                    <treeselect v-model="formData.pKnowPath"
                                :options="knowPathOptions"
                                placeholder="请选择所属知识体系"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer"
                                :disabled="disableflag"
                    />
                </el-form-item>

                <el-form-item label="测评类型" prop="pType">
                    <el-select v-model="formData.pType" placeholder="请选择">
                        <el-option
                                v-for="item in pTypeOptions"
                                :key="item.id"
                                :label="item.dicName" :disabled="disableflag"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="试题统计" prop="pTotal">
                    <div class="form-800item">
                        <span class="statistics-item fl">题目数：{{formData.pCountTotal}}</span>
                        <span class="statistics-item fl">总分：{{formData.pScoreTotal}}</span>
                        <!--TODO 是否插入开关、试卷状态开关-->
                        <span class="statistics-item2 fl">插入题库：
                        <el-switch
                                class="custom-switch"
                                v-model="formData.pInsert"

                        >

                        </el-switch>

                        </span>



                    </div>


                </el-form-item>

                <p class="child-title">试题配置</p>
                <el-form-item label="添加试题" prop="pAdd">
                    <div class="form-800item">
                        <el-badge :value="formData.pCount['1']" :hidden="formData.pCount['1'] <= 0" class="add-btn">
                            <el-button size="small" @click="customAddQuestion('1')">单选题</el-button>
                        </el-badge>
                        <el-badge :value="formData.pCount['2']" :hidden="formData.pCount['2'] <= 0" class="add-btn">
                            <el-button size="small" @click="customAddQuestion('2')">多选题</el-button>
                        </el-badge>
                        <el-badge :value="formData.pCount['3']" :hidden="formData.pCount['3'] <= 0" class="add-btn">
                            <el-button size="small" @click="customAddQuestion('3')">判断题</el-button>
                        </el-badge>
                        <el-badge :value="formData.pCount['4']" :hidden="formData.pCount['4'] <= 0" class="add-btn">
                            <el-button size="small" @click="customAddQuestion('4')">填空题</el-button>
                        </el-badge>
                        <el-badge :value="formData.pCount['5']" :hidden="formData.pCount['5'] <= 0" class="add-btn">
                            <el-button size="small" @click="customAddQuestion('5')">简答题</el-button>
                        </el-badge>
                        <el-badge :value="formData.pCount['6']" :hidden="formData.pCount['6'] <= 0" class="add-btn">
                            <el-button size="small" @click="customAddQuestion('6')">语音题</el-button>
                        </el-badge>
                        <!--<el-button class="questions-btn fr" size="small" type="primary" @click="questionsViewShow">-->
                            <!--<i class="el-icon-circle-plus-outline"></i>从题库选题-->
                        <!--</el-button>-->
                    </div>

                    <div class="form-800item-input">
                        <span class="add-statistics fl">{{formData.pScore['1'] + '分'}}</span>
                        <span class="add-statistics fl">{{formData.pScore['2'] + '分'}}</span>
                        <span class="add-statistics fl">{{formData.pScore['3'] + '分'}}</span>
                        <span class="add-statistics fl">{{formData.pScore['4'] + '分'}}</span>
                        <span class="add-statistics fl">{{formData.pScore['5'] + '分'}}</span>
                        <span class="add-statistics fl">{{formData.pScore['6'] + '分'}}</span>
                    </div>
                </el-form-item>
                <br>
                <br>

                <!--与舒海林约定该字段传dicCode，对应关系：-->
                <!--1、单选题-->
                <!--2、多选题-->
                <!--3、判断题-->
                <!--4、填空题-->
                <!--5、简答题-->
                <!--6、语音题-->
                <el-form-item label="试题列表" prop="pQuestions">

                    <el-collapse class="form-800item" v-model="activeNames" @change="collapseChange">
                        <draggable
                                class="list-group"
                                tag="ol"
                                v-model="questions"
                                v-bind="dragOptions"

                                :options="{sort: false}"

                        >
                            <transition-group type="transition" :name="!outDrag ? 'flip-list' : null">


                                <li
                                        class="list-group-item"
                                        v-for="(question, index) in questions"
                                        :key="question.qID"
                                >


                                    <i
                                            :class="
                        question.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                        "
                                            @click="question.fixed = !question.fixed"
                                            aria-hidden="true"
                                    >
                                        <!--开始-->


                                        <el-collapse-item :name="question.qID">
                                            <template slot="title">
                                                {{`第${index + 1}题`}} &nbsp;&nbsp;分数：
                                                <div @click.stop>
                                                    <el-input-number style="width: 110px" size="mini"
                                                                     v-model="question.qScore" :min="MIN_QUESTION_SCORE"
                                                                     :max="MAX_QUESTION_SCORE"
                                                                     @change="recomputeQuestion"
                                                    ></el-input-number>
                                                </div>

                                                &nbsp;&nbsp;&nbsp;<el-tag
                                                    :type="{'1': '', '2': 'success','3': 'info','4': 'warning','6': 'danger','5': '',}[question.qType]"
                                                    :color="question.qType === '5'? 'white': '' ">
                                                {{fieldTranslate(question.qType, qTypeOptions, 'dicCode')}}
                                            </el-tag>
                                                <span class="qcontent">{{question.qType === '4' ? tagClean(question.qContent): question.qContent }}</span>
                                            </template>
                                            <div class="search-container2"  :disabled='disableflag'>

                                                <!--TODO 校验规则后期需定义-->
                                                <el-form :inline="true" size="small" :model="question" class="demo-form-inline"
                                                         label-width="100px" :rules="formRules"
                                                         :ref="question.qID"
                                                         :disabled="disableflag"


                                                >
                                                    <!--<p class="child-title">基本信息</p>-->
                                                    <!--<el-form-item label="试题编号" v-if="operationFlag !== 'add'">-->
                                                    <!--<el-input v-model="question.qNumber" placeholder="自动生成"-->
                                                    <!--:disabled="true"></el-input>-->
                                                    <!--</el-form-item>-->

                                                    <!--原型中拆为所属产线、所属项目-->
                                                    <el-form-item label="试题分类" prop="qKnowPath"
                                                    >
                                                        <treeselect v-model="question.qKnowPath"
                                                                    :options="knowPathOptions"
                                                                    placeholder="请选择所属知识体系"
                                                                    noResultsText="未找到，请重新输入"
                                                                    :normalizer="normalizer"
                                                                    :disabled="disableflag"
                                                        />
                                                    </el-form-item>

                                                    <!--TODO ⭐原型中列表页叫【难度系数】，新增页叫【试题难度】，原型本身冲突，先按照【难度系数】命名-->
                                                    <el-form-item label="难度系数" prop="qDegree">
                                                        <el-select v-model="question.qDegree" placeholder="请选择" :disabled='disableflag'>
                                                            <el-option
                                                                    v-for="item in qDegreeOptions"
                                                                    :key="item.dicCode"
                                                                    :label="item.dicName" :disabled='disableflag'
                                                                    :value="item.dicCode">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <br>
                                                    <br>
                                                    <!--TODO ⭐原型中列表页有【课程名称】【课程类型】字段，新增页【关联课程】原型未说明，老系统【关联课程】为手输且后端接口为字符串字段-->
                                                    <el-form-item label="课程名称" prop="qCourseName">
                                                        <el-input v-model="question.qCourse[0].courseName"
                                                                  placeholder="请输入名称"
                                                                  :disabled='disableflag'></el-input>
                                                    </el-form-item>

                                                    <!--TODO ⭐原系统【考点】字段指考核要点，现原型里改为【考试地点】，明显不是题目该有的属性，但需求（刘介豪）2019-06-03 17:48:17要求就叫这个，先按照需求要求来-->
                                                    <!--TODO ⭐需求（刘介豪）2019-06-18 19:40:27邮件通知，SVN最新版原型要求改回考点-->
                                                    <el-form-item label="考点" prop="qPoint">
                                                        <el-input v-model="question.qPoint"
                                                                  placeholder="请输入"
                                                                  :disabled='disableflag'></el-input>
                                                    </el-form-item>
                                                    <br>
                                                    <br>
                                                    <el-form-item label="有效时间" prop="qValidTime">
                                                        <el-date-picker
                                                                v-model="question.qValidTime"
                                                                type="datetimerange"
                                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                                range-separator="至"
                                                                start-placeholder="开始时间"
                                                                end-placeholder="结束时间"
                                                                :disabled='disableflag'
                                                        >
                                                        </el-date-picker>

                                                    </el-form-item>
                                                    <br/>
                                                    <br/>
                                                    <!--<p class="child-title">试题配置</p>-->
                                                    <el-form-item label="答题指导" prop="qGuide">
                                                        <el-input
                                                                class="form-650item"
                                                                type="textarea"
                                                                v-model="question.qGuide"
                                                                placeholder="请输入"
                                                                :autosize="{ minRows: 3}"
                                                                :disabled='disableflag'
                                                        ></el-input>
                                                    </el-form-item>
                                                    <br/>
                                                    <br/>
                                                    <el-form-item label="试题内容" prop="qDesc">
                                                        <el-input
                                                                v-if="!['4'].includes(question.qType)"
                                                                class="form-650item"
                                                                type="textarea"
                                                                v-model="question.qContent"
                                                                placeholder="请输入"
                                                                :autosize="{ minRows: 3}"
                                                                :disabled='disableflag'
                                                        ></el-input>
                                                        <!--:data='{oID: element.oID}'-->


                                                        <div v-if="['4'].includes(question.qType)"
                                                             class="form-650item"
                                                        >


                                                            <quill-editor
                                                                    :id="'quill' + index"
                                                                    :ref="'quill' + index"
                                                                    v-model="question.qContent"
                                                                    :options="editorOption"

                                                                    :disabled='disableflag'

                                                            >
                                                                <div :id="'toolbar'" slot="toolbar">
                                                                    <!--<button class="ql-underline" :id="'ql-underline' + index" style="display: none">-->
                                                                    <!--</button>-->
                                                                    <!--<span class="table-operation"-->
                                                                          <!--@click="blankSpace(index, true)"-->
                                                                          <!--style="width: 60px; margin-left: 0px;margin-top: 1px; color: #409EFF;cursor: pointer;">设为空格-->
                                                                <!--</span>-->
                                                                    <!--<span class="table-operation"-->
                                                                          <!--@click="blankSpace(index, false)"-->
                                                                          <!--style="width: 60px; margin-left: 0px;margin-top: 1px; color: #409EFF;cursor: pointer;">取消空格-->
                                                                <!--</span>-->
                                                                    <!--class="table-operation"-->

                                                                </div>
                                                            </quill-editor>

                                                        </div>

                                                        <el-upload
                                                                :disabled="disableflag"

                                                                ref="desPic"
                                                                list-type="picture-card"
                                                                :show-file-list="true"
                                                                action=""
                                                                class="upload-demo upload-des-pic"
                                                                :limit="MAX_DES_PIC"
                                                                :http-request="(item) => fileUploadFun(item,  'desPic', index)"
                                                                :on-exceed="(files, fileList) => handleExceed(files, fileList,'desPic')"
                                                                :on-preview="previewPic"
                                                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                                                :on-remove="(files, fileList) => handleRemove(files, fileList, 0, 'desPic', index)"
                                                                :file-list="question.qPic"

                                                        >
                                                            <i class="el-icon-upload"></i>
                                                            <!--<el-button size="small" type="primary">点击上传</el-button>-->
                                                            <!--&lt;!&ndash;TODO 需求未定具体格式及大小限制&ndash;&gt;-->
                                                            <!--<div slot="tip" class="el-upload__tip">只能上传指定格式的音频、视频文件</div>-->
                                                        </el-upload>

                                                    </el-form-item>

                                                    <br v-if="['4', '5'].includes(question.qType)"><br
                                                        v-if="['4', '5'].includes(question.qType)">

                                                    <el-form-item
                                                            v-if="['4', '5'].includes(question.qType)"
                                                            label="答案" prop="qAnswer">
                                                        <el-input
                                                                v-if="['5', ].includes(question.qType)"
                                                                class="form-650item"
                                                                type="textarea"
                                                                :maxlength=3000
                                                                v-model="question.qAnswer"
                                                                placeholder="请输入"
                                                                :autosize="{ minRows: 3}"
                                                                @input="$forceUpdate()"
                                                        ></el-input>

                                                        <div class="form-650item" style="margin-top: 10px">
                                                            <el-switch
                                                                    v-if="['4', ].includes(question.qType)"
                                                                    v-model="question.qAlternative"
                                                                    active-text="有备选项"
                                                                    inactive-text="无备选项"
                                                                    class="fl"
                                                                    @change="(val) => qAlternativeChange(val,  index)"


                                                            >
                                                            </el-switch>
                                                            <el-switch
                                                                    v-if="['4', ].includes(question.qType)"
                                                                    v-model="question.qOrdered"
                                                                    active-text="有序阅卷"
                                                                    inactive-text="无序阅卷"
                                                                    class="fr"


                                                            >


                                                            </el-switch>
                                                        </div>

                                                        <br>


                                                        <el-tabs
                                                                type="card"
                                                                v-if="['4', ].includes(question.qType)"
                                                                v-model="question.blankSelect"
                                                                @tab-click="tabClick"
                                                        >
                                                            <el-tab-pane v-for="(it, ii) in question.blankData"
                                                                         :key="ii.toString()"
                                                                         :label="'空格' + (ii+1)"
                                                                         :name="ii.toString()"


                                                            >
                                                                <el-table :data="it" size="mini" border class="form-650item">
                                                                    <el-table-column align="center" prop="aNumber"
                                                                                     label="序号" width="49" >
                                                                        <template
                                                                                v-if="it.length === 1 || scope.$index !== it.length - 1"
                                                                                slot-scope="scope">
                                                                            {{scope.$index + 1}}
                                                                        </template>

                                                                    </el-table-column>
                                                                    <el-table-column align="center" prop="aContent"
                                                                                     label="类型" width="100"
                                                                                     show-overflow-tooltip>
                                                                        <template
                                                                                v-if="it.length === 1 || scope.$index !== it.length - 1"
                                                                                slot-scope="scope">
                                                                            <el-tag :type="scope.$index === 0 ? 'success' : 'info'">
                                                                                {{scope.$index === 0 ? '默认答案' :
                                                                                '备选答案'}}
                                                                            </el-tag>

                                                                        </template>

                                                                    </el-table-column>
                                                                    <el-table-column align="center" prop="aContent"
                                                                                     label="答案" min-width="150"
                                                                                     show-overflow-tooltip>
                                                                        <template slot-scope="scope">
                                                                            <el-input style="width: 100%"
                                                                                      v-model="scope.row.content"
                                                                                      :disabled='disableflag'></el-input>
                                                                        </template>

                                                                    </el-table-column>

                                                                    <el-table-column align="center"
                                                                                     label="操作" width="65">
                                                                        <template slot-scope="scope">

                                        <span v-if="scope.$index !== 0 && scope.$index !== it.length - 1"
                                              class="table-operation red"
                                              @click="removeAlternative([scope.$index, ], index)">移除</span>

                                                                            <span v-if="scope.$index !== 0 && scope.$index === it.length - 1"
                                                                                  class="table-operation"
                                                                                  @click="addAlternative(scope.row.content, it ,index)">添加</span>

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


                                                    <el-form-item v-if="['6',].includes(question.qType)" label="语音附件"
                                                                  prop="qDescVoice">

                                                        <!--TODO 文件格式按照测试用例来-->
                                                        <el-upload
                                                                ref="desVoice"
                                                                action=""
                                                                style="margin-top: -42px"
                                                                :limit="MAX_DES_VOICE"
                                                                :http-request="(item) => fileUploadFun(item,  'desVoice', index)"
                                                                :on-exceed="(files, fileList) => handleExceed(files, fileList,'desVoice')"
                                                                :on-preview="downloadFile"
                                                                accept=".mp3,.wav,.MP3,.WAV"
                                                                :on-remove="(files, fileList) => handleRemove(files, fileList, 0, 'desVoice', index)"
                                                                :file-list="question.qVoice"

                                                        >


                                                        </el-upload>
                                                    </el-form-item>


                                                    <el-dialog :visible.sync="previewIsShow" size="tiny"
                                                               @cancel="previewIsShow=false">
                                                        <img width="100%" :src="previewViewURL" alt="">
                                                    </el-dialog>
                                                    <br/>
                                                    <el-form-item label="选项"
                                                                  v-if="['1', '2', '3', '6'].includes(question.qType)">
                                                        <div class="table-view-item"
                                                             v-if="['1', '3', '6'].includes(question.qType)">
                                                            <!--单选 判断 语音-->
                                                            <!--TODO 此时question.optionSelect是单字符串，非数组-->
                                                            <el-radio-group
                                                                    v-model="question.optionSelect"
                                                                    @change="selectOptionChange">
                                                                <!--判断题不可拖拽-->
                                                                <draggable
                                                                        class="list-group"
                                                                        tag="ol"
                                                                        v-model="question.optionsData"
                                                                        v-bind="dragOptions1"

                                                                        :options="{sort: false}"
                                                                >
                                                                    <transition-group
                                                                            v-if="['1', '3', '6'].includes(question.qType)"
                                                                            type="transition"
                                                                            :name="!drag ? 'flip-list' : null">


                                <li class="list-group-item"
                                    v-for="(element, iii) in question.optionsData"
                                    :key="element.oID">

                                    <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                                       @click="element.fixed = !element.fixed"
                                       aria-hidden="true">


                                        <el-radio
                                                :key="element.oID"
                                                :label="element.oID"
                                        >
                                            <template class="table-view-item">
                                                <span class="item-index"> &nbsp;&nbsp;&nbsp;{{optionsMap[iii]}}、</span>
                                                <el-input
                                                        v-if="['1', '6'].includes(question.qType)"
                                                        type="textarea" :maxlength=100 autosize :rows='1'
                                                        class="form-450item"
                                                        v-model="element.oLabel"></el-input>
                                                <span
                                                        v-if="['3',].includes(question.qType)"
                                                > {{element.oLabel}}</span>

                                            </template>
                                        </el-radio>


                                        <el-upload
                                                ref="optionPic"
                                                v-if="['1', '6'].includes(question.qType)"
                                                :data='{oID: element.oID}'
                                                list-type="picture-card"
                                                action=""
                                                class="upload-option"
                                                :limit="MAX_OPTION_PIC"
                                                :http-request="(item) => fileUploadFun(item,  'optionPic', index)"
                                                :on-exceed="(files, fileList) => handleExceed(files, fileList,'optionPic')"
                                                :on-preview="previewPic"
                                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                                :on-remove="(files, fileList) => handleRemove(files, fileList, iii, 'optionPic', index)"
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


        <div class="table-view-item" v-if="['2', ].includes(question.qType)">

            <!--多选-->
            <el-checkbox-group

                    v-model="question.optionSelect"
                    @change="selectOptionChange"


            >
                <draggable
                        class="list-group"
                        tag="ol"
                        v-model="question.optionsData"
                        v-bind="dragOptions2"

                        :options="{sort: false}"
                >


                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">


                        <li
                                class="list-group-item"
                                v-for="(element, iii) in question.optionsData"
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
                                        v-if="['2', ].includes(question.qType)"
                                        :key="element.oID"
                                        :label="element.oID"
                                >
                                    <template class="table-view-item">
                                        <span class="item-index"> &nbsp;&nbsp;&nbsp;{{optionsMap[iii]}}、</span>
                                        <el-input type="textarea" :maxlength=100 autosize :rows='1'
                                                  class="form-450item"
                                                  v-model="element.oLabel"></el-input>



                                    </template>

                                </el-checkbox>


                                <span v-if="['1', '2', '6'].includes(question.qType)"
                                      class="table-operation fr "
                                      @click="removeOption([element, ], index)">移除</span>
                                <el-upload
                                        ref="optionPic"
                                        list-type="picture-card"
                                        :data='{oID: element.oID}'
                                        :show-file-list="true"
                                        action=""
                                        class="upload-option"
                                        :limit="MAX_OPTION_PIC"
                                        :http-request="(item) => fileUploadFun(item,  'optionPic', index)"
                                        :on-exceed="(files, fileList) => handleExceed(files, fileList,'optionPic')"
                                        :on-preview="previewPic"
                                        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                        :on-remove="(files, fileList) => handleRemove(files, fileList, iii, 'optionPic', index)"
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



        </el-form-item>


        </el-form>


    </div>


    </el-collapse-item>


    <!--结束-->
    </i>
    </li>
    </transition-group>
    </draggable>

    </el-collapse>


    </el-form-item>
    <br>


    </el-form>


    </div>
    <el-dialog class="need-header" title="添加选项" :visible.sync="addIsShow">
        <el-form :model="customOptionData" size="small" class="demo-form-inline " label-width="100px">
            <el-form-item label="选项内容">

                <el-input type='textarea' :maxlength=100 :rows="3"
                          style="margin-left: 10px;width: 550px" v-model="customOptionData.oLabel"
                          auto-complete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" class="el-btn-min-100" @click="addIsShow = false">取消</el-button>
            <el-button size="small" class="el-btn-min-100" type="primary" @click="addOptionSave">确定</el-button>
        </div>
    </el-dialog>

    <!--TODO 从题库选题-->
    <el-dialog class="need-header" width='85%' title="从题库选题" :visible.sync="questionsViewIsShow" v-if="questionsViewIsShow">
        <div class="preservation-container">
            <el-form :inline="true" size="small" :model="searchData" class="demo-form-inline" label-width="100px"
                     ref="searchForm">
                <el-form-item label="试题类型" prop="qType">
                    <el-select v-model="searchData.qType" placeholder="请选择">
                        <el-option
                                v-for="item in qTypeAllOptions"
                                :key="item.dicCode"
                                :label="item.dicName" :disabled='disableflag'
                                :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="试题分类" prop="qClassify">
                    <treeselect v-model="searchData.qClassify"
                                :options="knowPathOptions"
                                placeholder="请选择"
                                noResultsText="未找到，请重新输入"
                                :normalizer="normalizer2"
                    />
                </el-form-item>
                <!--<el-form-item label="试题状态" prop="qState">-->
                <!--<el-select v-model="searchData.qState" placeholder="请选择">-->
                <!--<el-option-->
                <!--v-for="item in qStateAllOptions"-->
                <!--:key="item.dicCode"-->
                <!--:label="item.dicName"-->
                <!--:value="item.dicCode">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="试题内容" prop="qContent">
                    <el-input v-model="searchData.qContent" placeholder="请输入 "></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="qCourseName">
                    <el-input v-model="searchData.qCourseName" placeholder="请输入 "></el-input>
                </el-form-item>

                <!--<el-form-item label="创建人" prop="qCreateUser">-->
                <!--<el-input v-model="searchData.qCreateUser" placeholder="请输入 "></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="创建时间" prop="qCreateTime">-->
                <!--<el-date-picker-->
                <!--v-model="searchData.qCreateTime"-->
                <!--type="datetimerange"-->
                <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--range-separator="至"-->
                <!--start-placeholder="开始时间"-->
                <!--end-placeholder="结束时间"-->
                <!--&gt;-->
                <!--</el-date-picker>-->

                <!--</el-form-item>-->
            </el-form>
            <div class="button-container">
                <el-button size="small" class="reloadTable el-btn-min-100" type="primary" @click="reloadTable(1)">查询</el-button>
                <el-button size="small" class="el-btn-min-100" @click="searchReset">重置</el-button>

            </div>

            <div class="map-list">
                <div class="map-button">


                    <el-button class="selectQuestion el-btn-min-100" size="small" @click="selectQuestion((val=multipleSelection.map(i => i.qID)))">选择退出</el-button>
                    <el-button class="selectQuestion el-btn-min-100" size="small" @click="selectQuestion((val=multipleSelection.map(i => i.qID)), true)">选择继续</el-button>


                </div>

                <div class="map-table">
                    <el-table ref='multipleTable' size="mini" :data="tableData" border style="width: 100%"
                              @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection" align="center"
                                width="40" fixed="left">
                        </el-table-column>
                        <el-table-column align="center" prop="qNumber"
                                         label="试题编号" min-width="150" fixed="left" show-overflow-tooltip>
                            <!--<template slot-scope="scope">-->
                            <!--<span class="table-operation" @click="pushDetail(scope.row.qID)">{{scope.row.qNumber}}</span>-->
                            <!--</template>-->
                        </el-table-column>
                        <el-table-column
                                prop="qType" align="center" width="80" show-overflow-tooltip
                                label="试题类型" :formatter="(row, column) => fieldTranslate(row.qType, qTypeAllOptions, 'dicCode')">
                        </el-table-column>
                        <el-table-column
                                prop="qDegree" align="center" width="80" show-overflow-tooltip
                                label="难度系数" :formatter="(row, column) => fieldTranslate(row.qDegree, qDegreeAllOptions, 'dicCode')">
                        </el-table-column>
                        <el-table-column
                                prop="qPoint" align="center" width="80" show-overflow-tooltip
                                label="考点" >
                        </el-table-column>
                        <el-table-column
                                prop="qCourseName" align="center" min-width="140" show-overflow-tooltip
                                label="课程名称">
                        </el-table-column>

                        <el-table-column
                                prop="qContent" align="center" min-width="300" show-overflow-tooltip
                                label="试题内容">
                        </el-table-column>

                        <!--<el-table-column-->
                        <!--prop="qCourseType" align="center" min-width="120" show-overflow-tooltip-->
                        <!--label="课程类别">-->
                        <!--</el-table-column>-->



                        <!--<el-table-column-->
                        <!--prop="qType" align="center" width="80" show-overflow-tooltip-->
                        <!--label="试题类型" :formatter="(row, column) => fieldTranslate(row.qType, qTypeAllOptions, 'dicCode')">-->
                        <!--</el-table-column>-->

                        <!--<el-table-column-->
                        <!--prop="qLine" align="center" width="100" show-overflow-tooltip-->
                        <!--label="适用产线">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                        <!--prop="qProject" align="center" width="100" show-overflow-tooltip-->
                        <!--label="适用项目">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                        <!--prop="qState" align="center" width="100" show-overflow-tooltip-->
                        <!--label="试题状态" :formatter="(row, column) => fieldTranslate(row.qState, qStateAllOptions, 'dicCode')">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                        <!--prop="cCreateUser" align="center" min-width="120" show-overflow-tooltip-->
                        <!--label="创建人">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column-->
                        <!--prop="cCreateTime" align="center" width="165" show-overflow-tooltip-->
                        <!--label="创建时间">-->
                        <!--</el-table-column>-->

                        <!--<el-table-column label="操作" fixed="right"  width="105" align="center">-->
                        <!--<template slot-scope="scope">-->

                        <!--<span class="table-operation" @click="pushOperationPage(flag='edit', id=scope.row.qID)">修改</span>-->
                        <!--<span class="table-operation" @click="operationAffirm(flag='delete', val=[scope.row.qID, ])">删除</span>-->
                        <!--</template>-->
                        <!--</el-table-column>-->


                    </el-table>
                    <div class="pagination">
                        <span>一共 <span class="total">{{total}}</span> 条数据</span>
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="[5, 10, 15, 20, 50]"
                                :page-size="searchData.pageSize"
                                :current-page.sync="searchData.pageNo"
                                layout="sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>






        </div>


        <!--</div>-->
    </el-dialog>
    <div class="button-container">
         <span class="statistics-item2 ">启用试卷：
                        <el-switch
                                class="custom-switch"
                                v-model="formData.pEnable"
                                :disabled='disableflag'
                        >

                        </el-switch>

                        </span>


        <el-button size="small" class="el-btn-min-100" @click="routeBack">返回</el-button>

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
    import {API} from '@/assets/js/urls';
    import GLOBAL from '@/assets/js/globalVariable.js';
    import {getRandomKey, string2XML, debugLog} from '@/assets/js/tool';
    import draggable from 'vuedraggable'
    import {VueQuillEditor} from 'vue-quill-editor'
    export default {
        name: "PaperDetail",
        components: {
            draggable,
            Treeselect,
        },
        computed: {
            tagClean() {
                return (content) => {
                    return content.replace(/<u>[^(<u>)]*<\/u>/g, '____').replace(/<p>|<\/p>/g, '');
                }
            },

            dragOptions() {
                return {
                    animation: 200,
                    group: {
                        name: "description",

                    },
                    disabled: true,
                    ghostClass: "ghost"
                };
            },
            dragOptions1() {
                return {
                    animation: 200,
                    group: {
                        name: "description1",

                    },
                    disabled: true,
                    ghostClass: "ghost"
                };
            },
            dragOptions2() {
                return {
                    animation: 200,
                    group: {
                        name: "description2",

                    },
                    disabled: true,
                    ghostClass: "ghost"
                };
            }
        },
        data() {
            return {
                disableflag: true,
                GLOBAL: GLOBAL,

                ids: this.$route.params.ids || [],

                editorSelect: {
                    blankLength: 0,
                    blankCount: 0,
                },


                editorOption: {
                    placeholder: '',
                    theme: 'snow',
                    modules: {
                        toolbar: ''
                    }
                },

                // 标题
                viewTitle: '',
                multipleSelection: [], // 多选状态保存


                // 标识
                operationFlag: 'add',

                questionIndex: 0,

                questions: [],

                formData: {
                    pID: -1,
                    pKnowPath: null,
                    pType: null,
                    pName: '',
                    pInsert: false,
                    pEnable: false,

                    // 题目数量 与字典码对应
                    pCount: {
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4': 0,
                        '5': 0,
                        '6': 0,
                    },

                    // 题目分数 与字典码对应
                    pScore: {
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4': 0,
                        '5': 0,
                        '6': 0,
                    },

                    // 总计
                    pCountTotal: 0,
                    pScoreTotal: 0,





                },
                formRules: {

                    // mName: [{required: true, message: '请输入名称', trigger: 'change'}],
                    // mPositionID: [{required: true, message: '请选择岗位', trigger: 'change'}],
                    // mRankID: [{required: true, message: '请选择职级', trigger: 'change'}],
                },

                // 常量
                MAX_OPTION: 10,
                MAX_OPTION_PIC: 3,
                MAX_DES_PIC: 5,
                MAX_DES_VOICE: 1, // TODO ⭐原型及测试用例里均未有个数限制，先设为1(下方fileUploadFun代码写死）
                MAX_BLANK_COUNT: 5, // TODO ⭐每题最多五个空格
                MAX_BLANK_LENGTH: 20, // TODO ⭐每个空格最多20个字符

                MIN_QUESTION_SCORE: 0,
                MAX_QUESTION_SCORE: 100, // TODO ⭐每道题最多分数

                MAX_BLANK_ALTERNATIVE_COUNT: 3, // 填空题每个空最多选项数目

                minSelect: 0,
                maxSelect: 1,

                // 选项字典，原则上最多至多十个（2019-06-05 原型）
                optionsMap: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '正确', '错误', '#'],


                // 字典项
                dictMap: {},
                knowMap: {},
                dictData: {},
                pTypeOptions: [], // 测评类型
                qDegreeOptions: [], // 难度系数
                qTypeOptions: [], // 题目类型
                knowPathOptions: [], // 试题分类

                qTypeAllOptions:[],
                qStateAllOptions: [],



                // 题库选题弹框
                questionsViewIsShow: false,




                drag: false,
                outDrag: false,
                addIsShow: false,
                previewIsShow: false,
                previewViewURL: '',

                customOptionData: {},


                //从题库选题
                searchData: {
                    qType: null,
                    qState: null,
                    qContent: '',
                    qCreateTime: [],
                    qCreateUser: '',
                    qClassify: null,
                    qCourseName: '',
                    pageNo: 1,
                    pageSize: 10,

                },
                total: 0,
                bankData: [],
                tableData: [],

                activeNames: [],

                statistics: {
                    questionCount: 0,

                }


            }
        },
        created() {

            this.loadPreData();
            this.operationModel();

        },
        methods: {

            loadPreData() {

                // 页面字典等数据预加载
                getDictionariesAllData()
                    .then(res => {

                        this.dictData = res;

                        this.pTypeOptions = res.paperType;
                        this.qTypeOptions = res.questionType;
                        this.qDegreeOptions = res.subjectDifficult;
                        this.qDegreeAllOptions = res.subjectDifficult_all;
                        this.qTypeAllOptions = res.questionType_all;


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
            normalizer2(node) {
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },

            operationModel() {



                if (!this.$route.query.id) {
                    this.$message({message:'请返回列表确认该条数据是否已被删除',type: 'warning'});
                    return;

                }
                this.formData.pID = this.$route.query.id;
                axiosPost(API.PAPER_DETAIL, {
                    id: this.formData.pID
                }).then(res => {
                    res = res.data;
                    this.formData = {

                        pID: res.id,
                        pNumber: res.paperNo,
                        pName: res.paperName,
                        pType: res.paperType,
                        pScoreTotal: res.score,
                        pCountTotal: res.singleChoiceNum + res.multipleChoiceNum + res.judgeNum + res.completionNum + res.shortQuestionNum + res.voiceNum,
                        pKnowID: res.knowledgeId,
                        pKnowPath: res.knowledgePath,
                        pCount: {
                            '1': res.singleChoiceNum,
                            '2': res.multipleChoiceNum,
                            '3': res.judgeNum,
                            '4': res.completionNum,
                            '5': res.shortQuestionNum,
                            '6': res.voiceNum,
                        },
                        pScore: {
                            '1': res.singleChoiceScore,
                            '2': res.multipleChoiceScore,
                            '3': res.judgeScore,
                            '4': res.completionScore,
                            '5': res.shortQuestionScore,
                            '6': res.voiceScore,
                        },
                        pInsert: res.insertFlag === '1',
                        pEnable: res.deleted === '1',





                    };
                    this.questions = res.questionList.map( question => {
                        question.qID = question.id;
                        question.qKnowPath = question.knowledgePath;
                        question.qType = question.questionType;
                        question.qCourse = [
                            {
                                courseName:question.courseName,
                                // courseID:question.courseId,
                            }
                        ];

                        question.qDegree = question.questionDegree;
                        question.qGuide = question.questionGuide;
                        question.qPoint = question.questionPoint;
                        question.qValidTime = [question.questionTimeBegin, question.questionTimeEnd];



                        question.qVoice = question.qType === '6' && question.voicePath ? [
                            {
                                url:  question.voicePath,
                                name: question.voiceName ? question.voiceName : '',
                                fileName: question.voiceName ? question.voiceName : '',
                                filePath: question.voicePath,
                            }
                        ] : [];

                        question.qOrdered = question.isOrder === '1';
                        question.qAlternative = question.isAlternative === '1';
                        // console.log(question.file)
                        question.file.map(i => {
                            i.url = i.filePath;
                            i.name = i.fileName;
                            return i ;

                        });
                        question.qPic = question.file;

                        // console.log(question.file);
                        // console.log(question.qPic);
                        question.qScore = question.score;
                        question.qContent = question.questionName;
                        question.qAnswer = question.questionAnswer;
                        question.optionSelect = [];
                        question.blankData = [];
                        question.blankSelect = '0';
                        question.qSource = question.questionAddType;
                        question.qCanOpeation = question.paperAddType;


                        if (['1', '2', '3', '6',].includes(question.qType)) {
                            const selectIndex = question.qAnswer ? question.qAnswer.split('|').map(i => this.optionsMap.indexOf(i) > 9 ? this.optionsMap.indexOf(i) - 10 : this.optionsMap.indexOf(i)) : '';
                            question.optionsData = question.choices.map(c => {
                                c.oLabel = c.optionContent;
                                c.oID = c.id;
                                c.oPic = c.file.map( i => {
                                    i.url =  i.filePath;
                                    i.name =  i.fileName;
                                    return i;

                                });
                                return c;
                            });

                            if (['2',].includes(question.qType)) {
                                if (selectIndex.length > 0 ){
                                    selectIndex.map( i => {
                                        question.optionSelect.push(question.optionsData[i].oID);
                                    })

                                }
                            }else {
                                if (selectIndex.length > 0 ){

                                    question.optionSelect = question.optionsData[selectIndex[0]].oID;
                                }else {
                                    question.optionSelect = ''
                                }
                            }
                        }


                        if (['4',].includes(question.qType)) {
                            question.editorSelect =  {
                                blankLength: 0,
                                blankCount: 0,
                            };


                            question.choices.map( c => {
                                let aBlank = c.optionContent.split('|').map( i => {
                                    return {
                                        content: i
                                    }
                                });
                                question.qAlternative ? aBlank.push({content: ''}) : ''; // 最后一个是添加空位
                                question.blankData.push(aBlank);


                            })
                        }

                        return question;

                    });

                    // console.log(res.questionList)
                    // console.log(this)










                });


                this.recomputeQuestion();
            },
            blankSpace(index, flag) {
                // let format = this.$refs['quill' + index][0].quill.getFormat();
                // // console.log(format)

                if (flag && (this.questions[index].editorSelect.blankLength > this.MAX_BLANK_LENGTH || this.questions[index].editorSelect.blankLength <= 0)) {
                    this.$message({message:`选中长度有误,最多${this.MAX_BLANK_LENGTH}`,type: 'warning'});
                    return;
                }
                this.questions[index].blankTap = true;
                this.$refs['quill' + index][0].quill.format('underline', flag)


            },

            // questions数据变化时，刷新题目统计数据
            recomputeQuestion(){

                let tempCount =  {
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                };

                let tempScore =  {
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                };

                let tempCountTotal =  0;
                let tempScoreTotal =  0;

                this.questions.map( i => {
                    tempCount[i.qType] ++;
                    tempCountTotal ++;

                    tempScore[i.qType] += i.qScore;
                    tempScoreTotal += i.qScore;

                });


                this.formData.pCount = tempCount;
                this.formData.pCountTotal = tempCountTotal;
                this.formData.pScore = tempScore;
                this.formData.pScoreTotal = tempScoreTotal;


                // questions变化时 刷新bankData
                this.bankData = [];
                this.questions.map( question => {
                    if (question.qCanOpeation === '1') {
                        this.bankData.push(question.qID)
                    }
                });




            },


            collapseChange(val) {
                // 折叠面板
            },

            // 移除试题
            removeQuestion(index) {
                // console.log(index);
                this.questions.splice(index,  1);
                this.recomputeQuestion();
            },


            // 添加自定义试题
            customAddQuestion(val) {
                // TODO 题目数量没限制

                if (!['1', '2', '3', '4', '5', '6'].includes(val)) {
                    this.$message({message:'题目类型有误',type: 'warning'});
                    return;
                }
                let aQuestion = {

                    qID: parseInt(getRandomKey()) * -1,
                    qNumber: '',
                    qKnowPath: null,
                    qDegree: null,
                    qCourse: [
                        {
                            courseName: '',
                            courseID: ''
                        }
                    ],
                    qValidTime: [],
                    qPoint: '',
                    qScore: 0,
                    qContent: '',
                    qType: val,
                    editorSelect: {
                        blankLength: 0,
                        blankCount: 0,
                    },
                    blankTap: false,
                    optionsData: [],

                    blankSelect: '0',
                    blankData: [],
                    qSource: '3', // 试题来源 1题库管理中添加 2批量导入 3手动添加 字符串
                    qAlternative: false,
                    qOrdered: true,
                    qAnswer: '',
                    optionSelect: '',
                    qPic: [],
                    qCanOpeation: '0',


                };

                switch (val) {
                    case '1'://单选题

                        break;

                    case '2'://多选题
                        aQuestion.optionSelect = [];

                        break;

                    case '3'://判断题
                        aQuestion.optionsData = [
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

                this.questions.push(aQuestion);
                this.recomputeQuestion();
            },


            fileUploadFun(item, flag, index) {
                /*
                flag:
                    optionPic 选项图片上传
                    desPic 内容图片上传
                    desVoice 内容语音上传

                 */
                // console.log(item);
                fileUpload(item)
                    .then(res => {

                        switch (flag) {
                            case 'optionPic':
                                this.questions[index].optionsData[this.questions[index].optionsData.findIndex(i => i.oID === item.data.oID)].oPic.push({
                                    name: res.data.oriName,
                                    url: res.data.readAbsoluteLocation,
                                    fileName: res.data.oriName,
                                    filePath: res.data.lastStoreLocation
                                });
                                break;
                            case 'desPic':
                                this.questions[index].qPic.push({
                                    name: res.data.oriName,
                                    url: res.data.readAbsoluteLocation,
                                    fileName: res.data.oriName,
                                    filePath: res.data.lastStoreLocation
                                });
                                break;
                            case 'desVoice':
                                // this.questions[index].qVoice.push({
                                //
                                //     name: res.data.oriName,
                                //     url: GLOBAL.SERVE_FILE_ADDRESS + res.data.lastStoreLocation,
                                //     fileName: res.data.oriName,
                                //     filePath: res.data.lastStoreLocation
                                //
                                // });
                                this.questions[index].qVoice[0] = {

                                    name: res.data.oriName,
                                    url: res.data.readAbsoluteLocation,
                                    fileName: res.data.oriName,
                                    filePath: res.data.lastStoreLocation

                                };



                            default:
                                // console.log(`未定义的上传组件${flag}`);
                                break;
                        }

                        this.$forceUpdate();


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

            handleRemove(files, fileList, index, flag, index2) {
                /*
                flag:
                    optionPic 选项图片上传
                    desPic 内容图片上传
                    desVoice 内容语音上传

                 */
                // console.log(fileList);
                switch (flag) {
                    case 'optionPic':
                        this.questions[index2].optionsData[index].oPic = fileList;
                        break;
                    case 'desPic':
                        this.questions[index2].qPic = fileList;

                        break;
                    case 'desVoice':
                        this.questions[index2].qVoice = fileList;

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
            addOption(index) {
                if (this.questions[index].optionsData.length >= this.MAX_OPTION) {
                    this.$message({message: `最多只能有${this.MAX_OPTION}个选项`,type: 'warning'});
                    return;
                }
                this.questionIndex = index;
                this.addIsShow = true;
            },

            addOptionSave() {
                this.questions[this.questionIndex].optionsData.push({
                    oID: parseInt(getRandomKey()) * -1,
                    oLabel: this.customOptionData.oLabel,
                    oPic: [],


                });
                this.customOptionData = {};
                this.addIsShow = false;
            },

            removeOption(val, index) {
                if (val.length === 0) {
                    this.$message({message: '需选择后方可执行操作',type: 'warning'});
                    return;
                }

                val.map(i => {

                    let score = this.questions[index].optionsData.findIndex(item => i.oID === item.oID);
                    this.questions[index].optionsData.splice(score, 1);


                })

            },
            selectOptionChange(val) {
                // console.log(val)
                this.$forceUpdate()
            },

            // 停止拖动
            endDrag() {
                this.drag = false;
            },

            endOutDrag() {
                this.outDrag = false;
            },







            //填空题答案选项卡点击
            tabClick(val) {
                // console.log(val)
            },











            // 取消 回退
            routeBack() {
                if(this.$route.params.planId) {
                    this.$router.replace({
                        name: 'planActExam',
                        query: {
                            id: this.$route.params.planId
                        },
                        params: {
                            ids: this.ids
                        }
                    })
                }else{
                    this.$router.back();
                }
            }


        },



    }
</script>

<style scoped>
    .search-container ul li {
        /*margin: 20px 20px 0 0;*/
        /*float: left;*/
    }

    .search-container2 el-form-item {
        margin: 0 0 0 0;
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

    .table-view-item {

        width: 600px;
        margin-top: 5px;
        margin-left: 8px;
        line-height: 0px;
    }

    .upload-des-pic {
        /*margin-top: 10px;*/
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
        margin: 1px 0 0 0;
        display: block;
    }

    .list-group-item i {
        cursor: pointer;
        /*width: 100%;*/


    }

    .table-row-remove {
        margin-top: 16px;
        color: red;
        margin-right: -32px;
        cursor: pointer;
    }


    .table-operation-remove {
        margin-top: 9px;
        color: red;
        margin-right: -25px;
        cursor: pointer;
    }

    .table-operation-remove-radio {
        margin-top: -20px;
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
        /*margin: 0 0 10px 0;*/
    }

    .upload-option {
        /*margin-top: 10px;*/
        margin: 5px 0 10px 0;
    }

    .statistics-item {

        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
        width: 120px;
        height: 26px;
        display: block;

    }

    .statistics-item2 {

        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
        width: 150px;
        /*height: 26px;*/
        display: block;

    }

    .add-btn {
        margin-right: 40px;
    }

    .add-statistics {
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
        width: 68px;
        height: 26px;
        margin-right: 40px;
        display: block;
        text-align: center;
        margin-top: -8px;
    }

    .questions-btn {
        margin-top: 4px;
    }

    .form-650item {
        width: 650px;
    }

    .form-450item {
        width: 550px;
    }

    .qcontent {
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
        width: 400px;
        margin-left: 20px;
        display: block;
        text-align: left;

    }

    .addOptionBtn {
        margin-top: -200px;
    }

    .custom-switch {
        padding-bottom: 2px;
    }

</style>
