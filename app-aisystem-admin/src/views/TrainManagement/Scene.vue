<template>
    <div>
        <h2 class="title-h2">场景管理</h2>
        <div class="search-container">
            <el-form :inline="true" size="small" :model="formSearch" class="demo-form-inline" label-width="100px">
                <el-form-item label="知识体系：">
                    <treeselect 
                        v-model="formSearch.knowledgePath"
                        :options="knowAllData"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="场景名称：">
                    <el-input v-model="formSearch.sceneName" placeholder="请输入场景名称"></el-input>
                </el-form-item>
                <el-form-item label="场景状态：">
                    <el-select v-model="formSearch.status" placeholder="请选择场景状态">
                        <el-option label="正常" :value="true"></el-option>
                        <el-option label="停用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset" class="el-btn-min-100">重置</el-button>
            </div>
        </div>
        <div class="curriculum-button">
            <el-button size="small" @click="btnCopy" v-if="operationData.includes('0e31b411')">复制</el-button>
            <el-button size="small" @click="dialogVisible = true" v-if="operationData.includes('8d29e2cb')">新增</el-button>
            <el-button size="small" @click="remove" v-if="operationData.includes('a058285c')">删除</el-button>
        </div>
        <div class="loading-table">
            <el-table 
                size="mini"
                border
                :data="dataList.records" 
                tooltip-effect="dark" 
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection" 
                    align="center"
                    width="40">
                </el-table-column>
                <el-table-column
                    :formatter="getKnowName"
                    align="center"
                    label="知识体系">
                </el-table-column>
                <el-table-column
                    prop="sceneName"
                    align="center"
                    label="场景名称">
                </el-table-column>
                <el-table-column
                    prop="createUser"
                    align="center"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" v-if="operationData.includes('06c2251d')" @click="btnEdit(scope.row.id)">编辑</el-button>
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="状态">
                        <template slot-scope="scope">
                            <el-switch 
                                @change="(flag) => enable(flag, scope.row)" 
                                :disabled="!operationData.includes('37283463')" 
                                v-model="scope.row.status">
                            </el-switch>
                        </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <span>一共 <span class="total">{{dataList.total}}</span> 条数据</span>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10, 15, 20,50]"
                    :page-size="formSearch.pageSize"
                    layout="sizes, prev, pager, next, jumper"
                    :total="dataList.total"
                    :current-page.sync="formSearch.pageNo">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            @close="resetForm('ruleForm')"
            :visible.sync="dialogVisible"
            width="1000px">
            <h2 slot="title" class="title-h2">{{formData.id ? '编辑' : '新增'}}</h2>
            <el-tabs class="tab-box" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="1">
                    <el-form 
                        size="small"
                        :model="formData"
                        :rules="rules" 
                        label-width="120px" 
                        inline 
                        ref="ruleForm">
                        <el-form-item label="知识体系：" prop="knowledgePath" style="width: 100%;">
                            <treeselect 
                                v-model="formData.knowledgePath"
                                :options="knowAllData"
                                :disable-branch-nodes="true"
                                placeholder="请选择知识体系"
                                noResultsText="未找到，请重新输入"
                                @input="chengeTreeSelect"
                                :normalizer="normalizer">
                            </treeselect>
                        </el-form-item>
                        <el-form-item label="场景名称：" prop="sceneName">
                            <el-input v-model="formData.sceneName" placeholder="请输入场景名称"></el-input>
                        </el-form-item>
                        <el-form-item label="场景状态：" prop="status">
                            <el-select v-model="formData.status" placeholder="请选择场景状态">
                                <el-option label="正常" :value="true"></el-option>
                                <el-option label="停用" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="场景描述：" prop="sceneDesc">
                            <el-input style="width: 750px;" v-model="formData.sceneDesc" :autosize="{minRows: 2}" type="textarea" placeholder="请输入场景描述"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="button-container">
                        <el-button size="small" @click="dialogVisible = false" class="el-btn-min-100">取消</el-button>
                        <el-button size="small" type="primary" @click="submitForm('ruleForm')" class="no-repeat-1 el-btn-min-100">保存</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane v-loading="nodeLoading" label="场景配置" :disabled="formData.id ? false : true" name="2">
                    <div class="btn-title">
                        <el-button size="small" @click="seeChart">查看流程图</el-button>
                        <el-button size="small" @click="stepShowHide(true)">展开环节</el-button>
                        <el-button size="small" @click="stepShowHide(false)">折叠环节</el-button>
                        <el-button size="small" @click="talkShowHide(true)">展开对话</el-button>
                        <el-button size="small" @click="talkShowHide(false)">折叠对话</el-button>
                    </div>
                    <draggable 
                        v-model="nodeList"
                        group="node"
                        animation=200 
                        @end="nodeEnd">
                        <div class="node-box" v-for="(item, index) in nodeList" :key="index">
                            <p class="node-title">
                                <span @click="showHide(item)">{{String.fromCharCode(index + 97)}}.{{item.nodeName}}
                                    <i :class="item.show ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
                                </span>
                                <i @click="removeNode(item.id)" class="el-icon-delete"></i>
                            </p>
                            <div :style="{display: item.show ? 'block' : 'none'}" class="node-content">
                                <draggable 
                                    :id="'talk' + index"
                                    v-model="item.talkList" 
                                    group="talk"
                                    animation=200
                                    @end="talkEnd">
                                    <div class="talk-list" v-for="(item2, index2) in item.talkList" :key="index2">
                                        <div class="talk-title">
                                            <span @click="showHide(item2)">
                                                ({{String.fromCharCode(index + 97)}}{{index2 + 1}}) {{item2.talkName}}
                                                <i :class="item2.show ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
                                            </span>
                                            <i @click="removeTalk(item2.id)" class="el-icon-delete"></i>
                                            <div class="talk-tag">
                                                意图分支：
                                                <span v-show="index3 != 0" v-for="(item3, index3) in item2.contentList" :key="index3">
                                                    <span class="tag-font">{{index3}}.{{item3.talkPurpose}}</span> -> <span class="tag-back" @click="openNextDia(item3.id, item2.id, index, index2)">{{item2.nextTalkMap && purposeObj[item2.nextTalkMap[item3.id]]}}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div :style="{display: item2.show ? 'block' : 'none'}" class="talk-content">
                                            <p class="item-list" :class="index4 > 1 ? 'on' : ''" v-for="(item4, index4) in  item2.contentList" :key="index4">
                                                <span v-if="index4 == 0">
                                                    学员：{{item4.talkContent}}
                                                    <span class="item-list-span">（关键内容：{{item4.talkPoint}}）</span>
                                                </span>
                                                <span v-else>
                                                    <span v-show="index4 == 1">机器人：</span>
                                                    <span>{{index4}}. {{item4.talkContent}}</span>
                                                    <span>（{{item4.talkWeight}}）</span>
                                                    <span> -【{{item4.talkPurpose}}】</span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </draggable>
                                <el-button size="small" @click="openSelectTalk(item)">选择对话</el-button>
                                <el-button size="small" @click="openAddTalk(item)">新增对话</el-button>
                            </div>
                        </div>
                    </draggable>
                    <el-button size="small" @click="openNextStep">选择环节</el-button>
                </el-tab-pane>
                <el-tab-pane label="难度配置" :disabled="nodeList.length > 0 ? false : true" name="3">
                    <div class="diff-wrap" :class="konwGroup.length > 2 ? 'on' : ''">
                        <div class="diff-wbox">
                            <table class="diff-box" :style="{width: (90 * konwGroup.length * 3 + 180) + 'px'}">
                                <tbody>
                                    <tr>
                                        <td rowspan="3">难度参数</td>
                                        <td>难易程度</td>
                                        <td :colspan="konwGroup.length">简单</td>
                                        <td :colspan="konwGroup.length">一般</td>
                                        <td :colspan="konwGroup.length">困难</td>
                                    </tr>
                                    <tr>
                                        <td>随机总数</td>
                                        <td :colspan="konwGroup.length || 1">{{difficulty.easy_b}}</td>
                                        <td :colspan="konwGroup.length || 1">{{difficulty.normal_b}}</td>
                                        <td :colspan="konwGroup.length || 1">{{difficulty.hard_b}}</td>
                                    </tr>
                                    <tr>
                                        <td>定向总数</td>
                                        <td :colspan="konwGroup.length || 1">{{difficulty.easy_a}}</td>
                                        <td :colspan="konwGroup.length || 1">{{difficulty.normal_a}}</td>
                                        <td :colspan="konwGroup.length || 1">{{difficulty.hard_a}}</td>
                                    </tr>
                                    <tr v-if="konwGroup.length > 0">
                                        <td></td>
                                        <td>定向问题库</td>
                                        <td v-for="(item, index) in konwGroup" :key="index + '0'">{{item.name}}</td>
                                        <td v-for="(item, index) in konwGroup" :key="index + '1'">{{item.name}}</td>
                                        <td v-for="(item, index) in konwGroup" :key="index + '2'">{{item.name}}</td>
                                    </tr>
                                    <tr v-for="(item, index) in nodeList" :key="index" v-show="konwGroup.length > 0">
                                        <td :rowspan="nodeList.length" v-if="index == 0">场景环节</td>
                                        <td>{{item.nodeName}}</td>
                                        <td v-for="(item2, index2) in konwGroup" :key="index2 + '0'">
                                            <el-input size="mini" @input="$forceUpdate()" style="width: 100%" v-model="nodeParamConf[item.id + '&easy&' + item2.id]"></el-input>
                                        </td>
                                        <td v-for="(item2, index2) in konwGroup" :key="index2 + '1'">
                                            <el-input size="mini" @input="$forceUpdate()" style="width: 100%" v-model="nodeParamConf[item.id + '&normal&' + item2.id]"></el-input>
                                        </td>
                                        <td v-for="(item2, index2) in konwGroup" :key="index2 + '2'">
                                            <el-input size="mini" @input="$forceUpdate()" style="width: 100%" v-model="nodeParamConf[item.id + '&hard&' + item2.id]"></el-input>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <span class="tip">tips：每个文本框应输入正整数、非必填；定向总数应等于各环节配置之和</span>
                    <div class="button-container" style="margin-top: 20px;">
                        <el-button size="small" @click="dialogVisible = false" class="el-btn-min-100">取消</el-button>
                        <el-button size="small" type="primary" :disabled="isParamSave" @click="paramConfSave" class="el-btn-min-100">保存</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <el-dialog
            :visible.sync="selectDiaVisiable"
            width="500px">
            <h2 slot="title" class="title-h2">请选择下一个对话</h2>
            <ul class="tree-box">
                <li v-for="(item, index) in data" :key="index">
                    <p class="node-name" :title="item.nodeName" @click="showHide(item)">{{String.fromCharCode(index + 97)}}.{{item.nodeName}}</p>
                    <i v-if="item.talkList.length > 0" @click="showHide(item)" :class="item.show ? 'el-icon-caret-bottom' :  'el-icon-caret-right'"></i>
                    <ul class="node-list" :style="{height: item.show ? item.talkList.length * 30 + 'px' : '0'}">
                        <li v-for="(item2, index2) in item.talkList" :key="index2">
                            <p @click="nodeClick(item2)" :title="item2.talkName" :class="nodeChecked.id == item2.id ? 'on' : ''" class="node-name">({{String.fromCharCode(index + 97)}}{{index2 + 1}}) {{item2.talkName}}</p>
                        </li>
                    </ul>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="selectDiaVisiable = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="selectNextDia" class="no-repeat-5 el-btn-min-100">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            class="talkAdd"
            @close="resetForm2('talkForm')"
            :visible.sync="talkVisible"
            width="900px">
            <h2 slot="title" class="title-h2">新增对话</h2>
            <el-form 
                size="small"
                :model="talkData"
                :rules="talkRules" 
                label-width="120px" 
                inline 
                ref="talkForm">
                <p class="title">
                    <span class="sub-title">基本信息</span>
                </p>
                <el-form-item label="知识体系：" prop="knowledgePath">
                    <treeselect 
                        v-model="talkData.knowledgePath"
                        :options="knowAllData"
                        :disable-branch-nodes="true"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        @open="$refs.select3.blur();$refs.select4.blur()"
                        @input="chengeTreeSelect"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="关联环节：">
                    <el-select ref="select3" v-model="talkData.relaNode" placeholder="请选择关联环节">
                        <el-option
                            v-for="item in stepList2"
                            :key="item.nodeId"
                            :label="item.nodeName"
                            :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对话名称：" prop="talkName">
                    <el-input v-model="talkData.talkName" placeholder="请输入对话名称"></el-input>
                </el-form-item>
                <el-form-item label="对话状态：" prop="talkStatus">
                    <el-select :disabled="true" ref="select4" v-model="talkData.talkStatus" placeholder="请选择对话状态">
                        <el-option label="正常" :value="true"></el-option>
                        <el-option label="停用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对话描述：" prop="talkDesc">
                    <el-input style="width: 650px;" v-model="talkData.talkDesc" :autosize="{minRows: 2}" type="textarea" placeholder="请输入对话描述"></el-input>
                </el-form-item>
                <el-form-item label="对话讲解：" prop="talkExplain">
                    <el-input style="width: 650px;" v-model="talkData.talkExplain" :autosize="{minRows: 2}" type="textarea" placeholder="请输入对话讲解"></el-input>
                </el-form-item>
                <p class="title">
                    <span class="sub-title">对话内容</span>
                </p>
                <div v-for="(item, index) in talkData.listContent" :key="index">
                    <div v-if="index == 0">
                        <p class="dia-title">1.学员说话内容：</p>
                        <div class="dia-box">
                            <el-form-item 
                                label="参考话术：" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkContent'">
                                <el-input style="width: 600px;" :maxlength="2000" v-model="item.talkContent" placeholder="2000字以内"></el-input>
                            </el-form-item>
                            <i @click="getAudio(item)" v-if="item.talkId && item.id" class="iconfont htfg-customerservice_fill"></i>
                            <el-form-item 
                                label="关键内容：" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkPoint'">
                                <el-input style="width: 300px;" :maxlength="1000" v-model="item.talkPoint" placeholder="1000字以内"></el-input>
                                <span class="tip-title">（检测是否全部覆盖和顺序是否正确？）</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-else>
                        <p class="dia-title" v-if="index == 1">2.机器人回答内容：
                            <el-button @click="itemAdd('listContent')" type="primary" icon="el-icon-plus" size="mini" class="el-btn-min-100">添加回答</el-button>
                        </p>
                        <div class="dia-box">
                            <el-form-item 
                                :label="'回答'+ index +'：'" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkContent'">
                                <el-input style="width: 600px;" :maxlength="2000" v-model="item.talkContent" placeholder="2000字以内"></el-input>
                            </el-form-item>
                            <i @click="getAudio(item)" v-if="item.talkId && item.id" class="iconfont htfg-customerservice_fill"></i>
                            <i @click="itemDelete('listContent', index)" v-if="talkData.listContent.length > 2" class="el-icon-delete"></i>
                            <el-form-item 
                                :label="'意图'+ index +'：'" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkPurpose'">
                                <el-input v-model="item.talkPurpose" :maxlength="15" placeholder="15字以内"></el-input>
                            </el-form-item>
                            <el-form-item 
                                label="概率权重：" 
                                required
                                :show-message="false"
                                :prop="'listContent.'+ index +'.talkWeight'">
                                <el-input-number controls-position="right" style="width: 140px;" v-model="item.talkWeight" :min="1"></el-input-number>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="talkVisible = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="submitTalk('talkForm')" class="el-btn-min-100 no-repeat-2">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            @close="reset2()"
            :visible.sync="talkSearchVisible"
            width="1000px">
            <h2 slot="title" class="title-h2">选择对话</h2>
            <el-form :inline="true" :model="talkSearch" size="small" class="demo-form-inline" label-width="100px">
                <el-form-item label="知识体系：">
                    <treeselect 
                        v-model="talkSearch.knowledgePath"
                        :options="knowAllData"
                        placeholder="请选择知识体系"
                        noResultsText="未找到，请重新输入"
                        @open="$refs.select1.blur()"
                        :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="关联环节：">
                    <el-select ref="select1" v-model="talkSearch.relaNode" placeholder="请选择关联环节">
                        <el-option
                            v-for="item in stepList"
                            :key="item.nodeId"
                            :label="item.nodeName"
                            :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对话名称：">
                    <el-input v-model="talkSearch.talkName" placeholder="请输入对话名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-container">
                <el-button size="small" type="primary" @click="search2" class="el-btn-min-100 no-repeat-click1">查询</el-button>
                <el-button size="small" @click="reset2" class="el-btn-min-100">重置</el-button>
            </div>
            <div style="margin-top: 20px;" v-loading="talkLoading">
                <el-table 
                    size="mini"
                    border
                    :data="talkList.records" 
                    tooltip-effect="dark" 
                    @selection-change="handleSelectionChange2">
                    <el-table-column
                        type="selection" 
                        align="center"
                        width="40">
                    </el-table-column>
                    <el-table-column
                        :formatter="getKnowName"
                        align="center"
                        label="知识体系">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="对话名称">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="getDetail(scope.row.id)">{{scope.row.talkName}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="relaNode"
                        align="center"
                        label="关联环节">
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <span>一共 <span class="total">{{talkList.total}}</span> 条数据</span>
                    <el-pagination
                        @size-change="handleSizeChange2"
                        @current-change="handleCurrentChange2"
                        :page-sizes="[5, 10, 15, 20,50]"
                        :page-size="talkSearch.pageSize"
                        layout="sizes, prev, pager, next, jumper"
                        :total="talkList.total"
                        :current-page.sync="talkSearch.pageNo">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="talkSearchVisible = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="saveTalk" class="el-btn-min-100 no-repeat-3">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            class="talkDetail"
            :visible.sync="talkDetailVisible"
            width="800px">
            <h2 slot="title" class="title-h2">对话详情</h2>
            <p class="item-list" :class="index > 1 ? 'on' : ''" v-for="(item, index) in talkDetail.listContent" :key="index">
                <span v-if="index == 0">
                    学员：{{item.talkContent}}
                    <span class="item-list-span">（关键内容：{{item.talkPoint}}）</span>
                </span>
                <span v-else>
                    <span v-show="index == 1">机器人：</span>
                    <span>{{index}}. {{item.talkContent}}</span>
                    <span>（{{item.talkWeight}}）</span>
                    <span> -【{{item.talkPurpose}}】</span>
                </span>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="talkDetailVisible = false" class="el-btn-min-100">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="stepVisiable"
            width="500px">
            <h2 slot="title" class="title-h2">选择环节</h2>
            <el-checkbox-group v-model="stepCheckList">
                <div style="margin-bottom: 8px;" v-for="(item, index) in stepList3" :key="index">
                    <el-checkbox :label="item">{{item.nodeName}}</el-checkbox>
                </div>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="stepVisiable = false" class="el-btn-min-100">取消</el-button>
                <el-button size="small" type="primary" @click="selectNextStep" class="el-btn-min-100">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    axiosPost,
    getMapNameData,
    getKnowTraimData,
    getOperationData
} from "@/assets/js/api";
import{
    NumberValidate
} from '@/assets/js/verification'
import Treeselect from '@riophae/vue-treeselect'
import draggable from 'vuedraggable' 
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'scene',
    components:{
        Treeselect, draggable
    },
    data() {
        return {
            mapNameData: [],
            knowAllData: [], // 获取知识体系字典项数据
            operationData: [],
            formSearch: {
                pageNo: 1,
                pageSize: 5
            },
            talkSearch: {
                pageNo: 1,
                pageSize: 5,
                talkStatus: true,
                knowledgePath: null,
            },
            stepList: [],
            stepList2: [],
            stepList3: [],
            dataList: {},
            talkList: {},
            dataListChecked: [],
            talkListChecked: [],
            dialogVisible: false,
            talkSearchVisible: false,
            selectDiaVisiable: false,
            talkLoading: false,
            talkDetailVisible: false,
            stepVisiable: false,
            stepCheckList: [],
            talkDetail: {},
            knowledgeId: null,
            formData: {},
            rules: {
                sceneName: [
                    { required: true, message: '请输入场景名称', trigger: 'blur' },
                    { max: 64, message: '长度应小于等于64个字符', trigger: 'blur' }
                ],
                knowledgePath: [
                    { required: true, message: '请选择知识体系', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择场景状态', trigger: 'change' }
                ],
                sceneDesc: [
                    { max: 5000, message: '长度应小于等于5000个字符', trigger: 'blur' }
                ],
            },
            activeName: '1',
            nodeChecked: {},
            data: [],
            talkVisible: false,
            talkData: {
                knowledgePath: null,
                listContent: [
                    {talkType: 1},
                    {talkType: 2},
                ]
            },
            talkRules: {
                knowledgePath: [
                    { required: true, message: '请选择知识体系', trigger: 'blur' }
                ],
                talkName: [
                    { required: true, message: '请输入对话名称', trigger: 'blur' },
                    { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                ],
                talkStatus: [
                    { required: true, message: '请选择对话状态', trigger: 'change' }
                ],
                talkDesc: [
                    { max: 1000, message: '长度应小于等于1000个字符', trigger: 'blur' }
                ],
                talkExplain: [
                    { max: 1000, message: '长度应小于等于1000个字符', trigger: 'blur' }
                ],
            },
            nodeList: [],
            nodeLoading: false,
            nodeId: '',
            purposeId: '',
            talkId: '',
            purposeObj: {},
            konwGroup: [],
            difficulty: {},
            optIndex: 0,
            optIndex2: 0,
            nodeParamConf: {},
            isParamSave: true,
        }
    },
    watch: {
        'talkSearch.knowledgePath' (val, old) {
            if(old !== null) {
                delete this.talkSearch.relaNode
            }
            this.stepList = [];
            if(val) {
                this.getStepList(val.split('/').reverse()[0], 1);
            }
        },
        'talkData.knowledgePath' (val, old) {
            if(old !== null) {
                delete this.talkData.relaNode
            }
            this.stepList2 = [];
            if(val) {
                this.getStepList(val.split('/').reverse()[0], 2);
            }
        }
    },
    created() {
        getMapNameData().then(res => {
            this.mapNameData = res;
        });
        getKnowTraimData('scene').then(res => { // 知识体系
            this.knowAllData = res;
        });
        getOperationData().then(res => {
            this.operationData = res;
        });
        this.search();
        this.getKonwGroup();
    },
    methods: {
        getKonwGroup() {
            axiosPost('/trainMgr/sceneMgr/knowProblemGroup',{}).then(res => {
                if(res.code == 1000) {
                    this.konwGroup = res.data || [];
                }
            })
        },
        getDifficulty(knowledgeId) {
            axiosPost('/trainMgr/paramMgr/difficultyQuery',{knowledgeId: knowledgeId}).then(res => {
                if(res.code == 1000) {
                    this.difficulty = res.data || {};
                }
            })
        },
        chengeTreeSelect(){ // tree change
            if(this.dialogVisible) {
                this.$refs['ruleForm'].validateField('knowledgePath');
            }
            if(this.talkVisible) {
                this.$refs['talkForm'].validateField('knowledgePath');
            }
        },
        normalizer(node) { // 知识体系树
            return {
                id: node.path,
                label: node.knowName,
                children: node.children,
            }
        },
        getStepList(id, type) {
            axiosPost('/trainMgr/paramMgr/queryNodeByKowId',{knowledgeId: id}).then(res => {
                if(res.code == 1000) {
                    if(type == 1) {
                        this.stepList = res.data;
                    }else if(type == 2){
                        this.stepList2 = res.data;
                    }
                }
            })
        },
        search() {
            this.formSearch.pageNo = 1;
            this.getList();
        },
        reset() {
            var obj = this.formSearch;
            this.formSearch = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
            }
        },
        getList() {
            this.formSearch.loading = '.loading-table';
            axiosPost('/trainMgr/sceneMgr/list',this.formSearch).then(res => {
                if(res.code == 1000) {
                    this.dataList = res.data;
                }
            })
        },
        handleSelectionChange(res) {
            this.dataListChecked = res;
        },
        handleSizeChange(res){ // 更改条数
            this.formSearch.pageNo = 1;
            this.formSearch.pageSize = res;
            this.getList();
        },
        handleCurrentChange(res){ // 更改页数
            this.formSearch.pageNo = res;
            this.getList();
        },
        search2() {
            this.talkSearch.pageNo = 1;
            this.getList2();
        },
        reset2() {
            var obj = this.talkSearch;
            this.talkSearch = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
                talkStatus: true,
                knowledgePath: null,
            }
        },
        getList2() {
            this.talkLoading = true;
            axiosPost('/trainMgr/talkMgr/list',this.talkSearch).then(res => {
                if(res.code == 1000) {
                    this.talkList = res.data;
                }
            }).finally(() => {
                this.talkLoading = false;
            })
        },
        handleSelectionChange2(res) {
            this.talkListChecked = res;
        },
        handleSizeChange2(res){ // 更改条数
            this.talkSearch.pageNo = 1;
            this.talkSearch.pageSize = res;
            this.getList2();
        },
        handleCurrentChange2(res){ // 更改页数
            this.talkSearch.pageNo = res;
            this.getList2();
        },
        getDetail(id) {
            axiosPost('/trainMgr/talkMgr/detail',{id: id}).then(res => {
                if(res.code == 1000) {
                    this.talkDetail = res.data;
                    this.talkDetailVisible = true;
                }
            })
        },
        btnCopy() {
            if(this.dataListChecked.length != 1) {
                this.$message({message:'请选择一条数据',type: 'warning'});
                return;
            }
            this.$confirm('确定复制?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({message:'正在复制中，请耐心等待~',type: 'info'});
                axiosPost('/trainMgr/sceneMgr/copy',{id: this.dataListChecked[0].id}).then(res => {
                    if(res.code == 1000) {
                        this.$message({message: '复制成功',type: 'success'});
                        this.search();
                    }
                })
            }).catch(() => {   

            });
        },
        btnEdit(id) {
            this.nodeLoading = true;
            axiosPost('/trainMgr/sceneMgr/detail',{id: id}).then(res => {
                if(res.code == 1000) {
                    this.purposeObj = {},
                    this.knowledgeId = res.data.knowledgeId;
                    this.nodeList = res.data.nodeList;
                    this.nodeList.forEach((item, index) => {
                        item.show = true;
                        item.talkList.forEach((item2, index2) => {
                            item2.show = true;
                            this.purposeObj[item2.id] = String.fromCharCode(index + 97) + (index2 + 1);
                        })
                    })
                    this.formData = res.data;
                    delete this.formData.nodeList;
                    if(!this.dialogVisible) {
                        this.dialogVisible = true;
                        this.activeName = '1';
                        this.getDifficulty(this.knowledgeId);
                        this.getParamConf();
                    }
                }
            }).finally(() => {
                setTimeout(() => {
                    this.nodeLoading = false;
                }, 500);
            })
        },
        remove() {
            if(this.dataListChecked.length < 1) {
                this.$message({message:'请至少选择一条数据',type: 'warning'});
                return;
            }
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var ids = [];
                this.dataListChecked.forEach(item => {
                    ids.push(item.id);
                })
                axiosPost('/trainMgr/sceneMgr/delete',{ids: ids.join(',')}).then(res => {
                    if(res.code == 1000) {
                        this.search();
                    }
                })
            }).catch(() => {   

            });
        },
        enable(flag, row) {
            this.$confirm(`确定${flag ? '启用' : '禁用'}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var URL = flag ? '/trainMgr/sceneMgr/permit' : '/trainMgr/sceneMgr/forbid'
                axiosPost(URL,{id: row.id}).then(res => {
                    if(res.code == 1000) {
                        this.search();
                    }
                }).catch(() => {
                    row.talkStatus = !flag;
                })
            }).catch(() => {   
                row.status = !flag;
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.formData = {};
            this.nodeList = [];
            this.activeName = '1';
        },
        resetForm2(formName) {
            this.$refs[formName].resetFields();
            this.talkData = {
                knowledgePath: null,
                listContent: [
                    {talkType: 1},
                    {talkType: 2},
                ]
            }
            this.stepList2 = [];
        },
        submitTalk(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.talkData.noRepeat = '.no-repeat-2'
                    this.talkData.knowledgeId = this.talkData.knowledgePath.split('/').reverse()[0];
                    axiosPost('/trainMgr/talkMgr/create',this.talkData).then(res => {
                        if(res.code == 1000) {
                            this.talkVisible = false;
                            this.selectTalk({
                                sceneId: this.formData.id,
                                nodeId: this.nodeId,
                                talkList: [
                                    {talkId: res.data}
                                ]
                            })
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        itemDelete(list, index) {
            this.talkData[list].splice(index, 1);
        },
        itemAdd(list) {
            this.talkData[list].push({talkType: 2})
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addEdit();
                } else {
                    return false;
                }
            });
        },
        addEdit() {
            this.formData.noRepeat = '.no-repeat-1'
            this.formData.knowledgeId = this.formData.knowledgePath.split('/').reverse()[0];
            var URL = this.formData.id ? '/trainMgr/sceneMgr/alter' : '/trainMgr/sceneMgr/create';
            axiosPost(URL,this.formData).then(res => {
                if(res.code == 1000) {
                    this.dialogVisible = false;
                    this.search();
                }
            })
        },
        getKnowName(row) {
            return this.mapNameData[row.knowledgeId] ? this.mapNameData[row.knowledgeId].knowName : '';
        },
 
        handleClick() {
            if(this.activeName == 3) {
                this.isParamSave = true;
                if(JSON.stringify(this.difficulty) == '{}') {
                    this.$message({message:'该知识体系未配置难度参数',type: 'warning'});
                    return;
                }
                if(this.konwGroup.length == 0) {
                    this.$message({message:'知识库管理未配置定向问题库',type: 'warning'});
                    return;
                }
                if(this.nodeList.length == 0) {
                    this.$message({message:'该场景未配置环节',type: 'warning'});
                    return;
                }
                this.isParamSave = false;
            }
        },
        openNextDia(purposeId, talkId, index, index2) {
            this.purposeId = purposeId;
            this.talkId = talkId;
            this.optIndex = index;
            this.optIndex2 = index2;
            this.nodeChecked = {};
            axiosPost('/trainMgr/sceneMgr/selNextTalk', {sceneId: this.formData.id}).then(res => {
                if(res.code == 1000) {
                    res.data.forEach(item => {
                        item.show = true;
                    })
                    this.data = res.data;
                    this.selectDiaVisiable = true;
                }
            })
        },
        selectNextDia() {
            if(!this.nodeChecked.id) {
                this.$message({message:'请选择至少一条数据',type: 'warning'});
                return;
            }
            var params = {
                purposeId: this.purposeId,
                talkId: this.talkId,
                nextTalkId: this.nodeChecked.id,
                noRepeat: '.no-repeat-5'
            }
            axiosPost('/trainMgr/sceneMgr/alterNextTalk', params).then(res => {
                if(res.code == 1000) {
                    if(this.nodeList[this.optIndex].talkList[this.optIndex2].nextTalkMap === null) {
                        this.nodeList[this.optIndex].talkList[this.optIndex2].nextTalkMap = {};
                        this.nodeList[this.optIndex].talkList[this.optIndex2].nextTalkMap[this.purposeId] = this.nodeChecked.id;
                    }
                    this.nodeList[this.optIndex].talkList[this.optIndex2].nextTalkMap[this.purposeId] = this.nodeChecked.id;
                    this.selectDiaVisiable = false;
                }
            })
        },
        showHide(item) {
            item.show = !item.show;
            this.$forceUpdate();
        },
        stepShowHide(flag) {
            this.nodeList.forEach(item => {
                item.show = flag
            })
            this.$forceUpdate();
        },
        talkShowHide(flag) {
            this.nodeList.forEach(item => {
                flag ? item.show = flag : null
                item.talkList.forEach(item2 => {
                    item2.show = flag;
                })
            })
            this.$forceUpdate();
        },
        nodeClick(item) {
            this.nodeChecked = item;
        },
        openNextStep() {
            axiosPost('/trainMgr/paramMgr/queryNodeByKowId',{knowledgeId: this.knowledgeId}).then(res => {
                if(res.code == 1000) {
                    this.stepList3 = res.data.filter(item => {
                        return this.nodeList.findIndex(i => i.relaNode == item.nodeId) == -1;
                    });
                    this.stepCheckList = [];
                    this.stepVisiable = true;
                }
            })
        },
        selectNextStep() {
            if(this.stepCheckList.length == 0) {
                this.$message({message:'请选择至少一条数据',type: 'warning'});
                return;
            }
            if((this.stepCheckList.length + this.nodeList.length) > 26) {
                this.$message({message:'至多选择26个环节',type: 'warning'});
                return;
            }
            var params = {
                sceneId: this.formData.id,
                nodeList: [],
            }
            this.stepCheckList.forEach(item => {
                params.nodeList.push({
                    relaNode: item.nodeId,
                    nodeName: item.nodeName
                })
            })
            axiosPost('/trainMgr/sceneMgr/createNode', params).then(res => {
                if(res.code == 1000) {
                    this.btnEdit(this.formData.id);
                    this.stepVisiable = false;
                }
            })
        },
        removeNode(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    sceneId: this.formData.id,
                    id: id
                }
                this.nodeLoading = true;
                axiosPost('/trainMgr/sceneMgr/deleteNode', params).then(res => {
                    if(res.code == 1000) {
                        this.btnEdit(this.formData.id);
                    }
                }).catch(() => {
                    this.nodeLoading = false;
                })
            }).catch(() => {   

            });
        },
        removeTalk(id) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    id: id
                }
                this.nodeLoading = true;
                axiosPost('/trainMgr/sceneMgr/deleteTalk', params).then(res => {
                    if(res.code == 1000) {
                        this.btnEdit(this.formData.id);
                    }
                }).catch(() => {
                    this.nodeLoading = false;
                })
            }).catch(() => {   

            });
        },
        openSelectTalk(item) {
            this.talkSearch.knowledgePath = null;
            this.nodeId = item.id;
            setTimeout(() => {
                this.talkSearch = {
                    pageNo: 1,
                    pageSize: 5,
                    talkStatus: true,
                    knowledgePath: this.formData.knowledgePath,
                    relaNode: item.relaNode
                }
                this.search2();
                this.talkSearchVisible = true;
                this.talkListChecked = [];
            }, 500);
        },
        saveTalk() {
            if(this.talkListChecked.length == 0) {
                this.$message({message:'请选择至少一条数据',type: 'warning'});
                return;
            }
            var params = {
                sceneId: this.formData.id,
                nodeId: this.nodeId,
                talkList: []
            }
            this.talkListChecked.forEach(item => {
                params.talkList.push({
                    talkId: item.id
                })
            })
            params.noRepeat = '.no-repeat-3';
            axiosPost('/trainMgr/sceneMgr/createTalk', params).then(res => {
                if(res.code == 1000) {
                    this.btnEdit(this.formData.id);
                    this.talkSearchVisible = false;
                }
            })
        },
        selectTalk(params) {
            this.nodeLoading = true;
            axiosPost('/trainMgr/sceneMgr/createTalk', params).then(res => {
                if(res.code == 1000) {
                    this.btnEdit(this.formData.id);
                    this.talkSearchVisible = false;
                }
            }).catch(() => {
                this.nodeLoading = false;
            })
        },
        openAddTalk(item) {
            this.talkData.knowledgePath = null;
            this.nodeId = item.id;
            setTimeout(() => {
                this.talkData = {
                    knowledgePath: this.formData.knowledgePath,
                    relaNode: item.relaNode,
                    listContent: [
                        {talkType: 1},
                        {talkType: 2},
                    ],
                    talkStatus: true
                }
                this.talkVisible = true;
            }, 500);
        },
        nodeEnd() {
            var listNodeId = [];
            this.nodeList.forEach(item => {
                listNodeId.push(item.id)
            })
            this.nodeLoading = true;
            axiosPost('/trainMgr/sceneMgr/saveNodeSort', {listNodeId: listNodeId}).then(res => {
                if(res.code == 1000) {
                    this.btnEdit(this.formData.id);
                }
            }).catch(() => {
                this.nodeLoading = false;
            })
        },
        talkEnd(node) {
            var fromIndex = node.from.id.replace('talk', ''),
                toIndex = node.to.id.replace('talk', '');
            if(node.oldIndex == node.newIndex && fromIndex == toIndex) {
                return;
            }
            this.nodeLoading = true;
            if(fromIndex == toIndex) {
                var listTalkId = [];
                this.nodeList[toIndex].talkList.forEach(item => {
                    listTalkId.push(item.id)
                })
                axiosPost('/trainMgr/sceneMgr/saveTalkSort', {listTalkId: listTalkId}).then(res => {
                    if(res.code == 1000) {
                        this.btnEdit(this.formData.id);
                    }
                }).catch(() => {
                    this.nodeLoading = false;
                })
            }else {
                var params = {
                    id: this.nodeList[toIndex].talkList[node.newIndex].id,
                    nodeId: this.nodeList[toIndex].id
                }
                axiosPost('/trainMgr/sceneMgr/moveTalk', params).then(res => {
                    if(res.code == 1000) {
                        var listTalkId = [];
                        this.nodeList[toIndex].talkList.forEach(item => {
                            listTalkId.push(item.id)
                        })
                        axiosPost('/trainMgr/sceneMgr/saveTalkSort', {listTalkId: listTalkId}).then(res => {
                            if(res.code == 1000) {
                                this.btnEdit(this.formData.id);
                            }
                        }).catch(() => {
                            this.nodeLoading = false;
                        })
                    }
                }).catch(() => {
                    this.nodeLoading = false;
                })
            }
        },
        seeChart() {
            let routeUrl = this.$router.resolve({
                path: "/flowchart",
                query: {id: this.formData.id}
            });
            window.open(routeUrl.href, '_blank');
        },
        getParamConf() {
            this.nodeParamConf = {};
            axiosPost('/trainMgr/sceneMgr/nodeParamQuery', {sceneId: this.formData.id}).then(res => {
                if(res.code == 1000) {
                    res.data.nodeConfig.forEach(item => {
                        for(let key in item.easy) {
                            if(this.konwGroup.findIndex(val => key == val.id) > -1) {
                                this.nodeParamConf[item.nodeId + '&easy&' + key] = item.easy[key] || ''
                            }
                        }
                        for(let key in item.normal) {
                            if(this.konwGroup.findIndex(val => key == val.id) > -1) {
                                this.nodeParamConf[item.nodeId + '&normal&' + key] = item.normal[key] || ''
                            }
                        }
                        for(let key in item.hard) {
                            if(this.konwGroup.findIndex(val => key == val.id) > -1) {
                                this.nodeParamConf[item.nodeId + '&hard&' + key] = item.hard[key] || ''
                            }
                        }
                    })
                }
            })
        },
        paramConfSave() {
            var easyNum = 0,
                normalNum = 0,
                hardNum = 0,
                tempId = [],
                nodeList = [];
            for(var key in this.nodeParamConf) {
                var conf = key.split('&'),
                    nodeParamVal = Number(this.nodeParamConf[key]),
                    index = tempId.indexOf(conf[0]);
                if(nodeParamVal != parseInt(nodeParamVal)) {
                    this.$message({message:'请输入正整数',type: 'warning'});
                    return
                }
                if(index > -1) {
                    if(!nodeList[index].difficultyMap[conf[1]]) {
                        nodeList[index].difficultyMap[conf[1]] = {};
                    }
                    nodeList[index].difficultyMap[conf[1]][conf[2]] = nodeParamVal;
                }else {
                    tempId.push(conf[0]);
                    var params = {
                        id: conf[0],
                        difficultyMap: {}
                    }
                    params.difficultyMap[conf[1]] = {};
                    params.difficultyMap[conf[1]][conf[2]] = nodeParamVal;
                    nodeList.push(params);
                }
                if(conf[1] == 'easy') {
                    easyNum += nodeParamVal
                }
                if(conf[1] == 'normal') {
                    normalNum += nodeParamVal
                }
                if(conf[1] == 'hard') {
                    hardNum += nodeParamVal
                }
            }
            if(easyNum != this.difficulty.easy_a || normalNum != this.difficulty.normal_a || hardNum != this.difficulty.hard_a) {
                this.$message({message:'定向总数应等于各环节配置之和',type: 'warning'});
                return
            }
            this.isParamSave = true;
            axiosPost('/trainMgr/sceneMgr/nodeParamConf', {nodeList: nodeList}).then(res => {
                if(res.code == 1000) {
                    this.$message({message:'保存成功',type: 'success'});
                    this.dialogVisible = false;
                }
            }).finally(() => {
                this.isParamSave = false;
            })
        }
    },
}
</script>

<style scoped>
    .tip {
        font-size: 12px;
        color: #999;
        display: inline-block;
        margin-top: 5px;
    }
    .vue-treeselect{
        width: 200px;
        float: left;
    }
    .tab-box {
        position: relative;
        top: -30px;
    }
    .btn-title {
        margin-bottom: 20px;
        border-bottom: 1px dashed #eee;
        height: 45px;
        text-align: right;
    }
    .node-box {
        border-bottom: 1px dashed #eee;
        margin-bottom: 20px;
    }
    .node-title {
        margin-bottom: 10px;
    }
    .node-title>span {
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
    }
    .el-icon-caret-top {
        font-size: 18px;
        margin-left: 5px;
    }
    .el-icon-caret-bottom {
        font-size: 18px;
        margin-left: 5px;
    }
    .el-icon-delete {
        font-size: 18px;
        margin-left: 10px;
        color: #409EFF;
        cursor: pointer;
    }
    .tab-box >>> .el-tabs__content {
        overflow: inherit;
    }
    .node-content {
        padding-left: 20px;
        padding-bottom: 20px;
    }
    .talk-list {
        margin-bottom: 15px;
    }
    .talk-title {
        line-height: 30px;
        margin-bottom: 10px;
    }
    .talk-title>span {
        font-size: 14px;
        cursor: pointer;
    }
    .talk-tag {
        display: inline-block;
        margin-left: 10px;
    }
    .tag-font {
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        height: 25px;
        line-height: 25px;
        padding: 0 5px;
        vertical-align: middle;
    }
    .tag-back {
        display: inline-block;
        background: #409EFF;
        color: #fff;
        border-radius: 4px;
        height: 25px;
        line-height: 25px;
        padding: 0 5px;
        min-width: 30px;
        text-align: center;
        cursor: pointer;
        vertical-align: middle;
        margin-right: 10px;
    }
    .talk-content {
        padding-left: 20px;
    }
    .item-list {
        font-size: 14px;
        line-height: 22px;
    }
    .item-list.on {
        padding-left: 58px;
    }
    .talkDetail .item-list {
        line-height: 30px;
    }
    .item-list-span {
        color: #409EFF;
        margin-left: 10px;
    }
    /* 选择下一对话 */
    .tree-box {
        font-size: 14px;
        position: relative;
        top: -20px;
    }
    .tree-box>li {
        position: relative;
        cursor: pointer;
        color: #333;
    }
    .tree-box>li i {
        position: absolute;
        top: 8px;
        left: 0;
        font-size: 14px;
        color: #606266;
    }
    .node-name {
        position: relative;
        height: 30px;
        line-height: 30px;
        padding-left: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .node-name:hover,
    .node-name.on {
        background: #f5f7fa;
    }
    .node-list .node-name {
        padding-left: 25px;
    }
    .node-list>li {
        position: relative;
    }
    .node-list {
        transition: height 0.3s ease;
        overflow: hidden;
    }
    .tree-box .el-icon-caret-bottom {
        margin-left: 0;
    }
    .tree-box .el-icon-caret-top {
        margin-left: 0;
    }
    /* 新增对话 */
    .talkAdd .el-icon-delete {
        margin-left: 15px;
        margin-top: 11px;
        font-size: 20px;
        color: #409EFF;
        vertical-align: middle;
        cursor: pointer;
    }
    .title {
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
    }
    .sub-title {
        display: inline-block;
        border: 1px solid #ccc;
        background: #eee;
        color: #333;
        padding: 5px 8px;
    }
    .tip-title {
        margin-left: 30px;
        font-size: 12px;
        color: #999;
    }
    .dia-box {
        border-bottom: 1px dashed #eee;
        margin-bottom: 20px;
    }
    .dia-title {
        margin-bottom: 20px;
        font-size: 14px;
    }
    /* 难度配置 */
    .diff-wrap {
        overflow: auto;
        position: relative;
    }
    .diff-wbox {
        overflow: hidden;
        overflow-x: auto;
    }
    .diff-wrap.on:before {
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #ddd;
        z-index: 1;
    }
    .diff-wrap.on:after {
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background-color: #ddd;
        z-index: 1;
    }
    .diff-box {
        border-collapse: collapse;
        border-spacing: 0;
    }
    .diff-box td {
        border-collapse: collapse;
        border: 1px solid #ddd;
        min-height: 35px;
        padding: 8px 5px;
        line-height: 1.4;
        width: 80px;
        text-align: center;
        font-size: 12px;
    }
</style>
