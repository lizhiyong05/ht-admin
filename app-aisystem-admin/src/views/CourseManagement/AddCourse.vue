<template><!-- 课程管理新增  zhiyong.li  -->
    <div class="add-course">
        <h2 class="title-h2" v-if="id == undefined">新增课程</h2>
        <h2 class="title-h2" v-else>修改课程</h2>
        <div class="item item1">
            <el-form :inline="true" :model="addData" class="demo-form-inline course-input" label-width="80px" ref="addForm" :rules="rules">
                <el-form-item label="课程编号" size="small">
                    <el-input v-model="addData.code" :disabled="true" placeholder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="课程分类" prop="knowledgeId" size="small">
                    <treeselect   v-model="addData.knowledgeId"
                                  :options="knowAllData"
                                 :disabled="isFromPlan"
                                  placeholder="请选择课程分类"
                                  noResultsText="未找到，请重新输入"
                                  @input="chengeTreeSelect"
                                  :normalizer="normalizer">
                    </treeselect>
                </el-form-item>
                <el-form-item label="课程类型" prop="typeId" size="small">
                    <el-select v-model="addData.typeId" :disabled="isFromPlan" placeholder="请选择课程类型">
                        <el-option v-for="(item,ind) in dictionariesAllData['courseType']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程名称" prop="name" size="small">
                    <el-input v-model="addData.name" :disabled="isFromPlan" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="课程时长" prop="duration" size="small">
                    <el-input v-model="addData.duration" :disabled="isFromPlan" placeholder="请输入课程时长(分钟)"></el-input>
                </el-form-item>
                <el-form-item label="培训受众" size="small" prop="audience">
                    <el-input v-model="addData.audience" :disabled="isFromPlan" placeholder="请输入培训受众"></el-input>
                </el-form-item>
                <el-form-item label="课程星级" prop="starLevelId" size="small">
                    <el-select v-model="addData.starLevelId" :disabled="isFromPlan" placeholder="请选择课程星级">
                        <el-option v-for="(item,ind) in dictionariesAllData['level']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学习方式" prop="studyModeId" size="small">
                    <el-select v-model="addData.studyModeId" :disabled="isFromPlan" placeholder="请选择学习方式" @change="statusSelect">
                        <el-option v-for="(item,ind) in dictionariesAllData['studyWay']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学习目标" prop="studyPurpose" size="small">
                    <el-input type="textarea" :disabled="isFromPlan" v-model="addData.studyPurpose" placeholder="请输入学习目标"></el-input>
                </el-form-item>
                <el-form-item label="课程大纲" prop="syllabus" size="small">
                    <el-input type="textarea" :disabled="isFromPlan" v-model="addData.syllabus" placeholder="请输入课程大纲"></el-input>
                </el-form-item>
                <el-form-item label="课程介绍" prop="description" size="small">
                    <el-input type="textarea" :disabled="isFromPlan" v-model="addData.description" placeholder="请输入课程介绍"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="授权人员" class="clearfix" prop="lecturers" style="width: 100%;">
                    <el-input type="input" v-model="addData.lecturers.length" placeholder="" style="display: none;"></el-input>
                    <div class="people-list el-input__inner fl">
                        <p v-if="addData.lecturers.length == 0" style="color: #c0c4cc;line-height: 38px;">请选择授权人员</p>
                        <ul v-else class="clearfix">
                            <li class="fl" v-for="(item,ind) in addData.lecturers" :key="ind">{{item.lecturerName}}<i class="el-icon-circle-close" @click="isFromPlan ? null : deleteLecturers(ind)"></i></li>
                        </ul>
                    </div>
                    <el-button type="primary" :disabled="isFromPlan" class="fl" size="medium" @click="selectPeople" style="margin-left: 15px;">选择</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="item">
            <h3 class="add-title">相关课件</h3>
            <div v-for="(item,ind) in addData.catalogues" :key="ind" style="margin-top: 20px;">
                <div class="catalog clearfix" v-if="ind == 0">
                    <div class="fl">默认目录 <el-button size="mini" @click="addCatalog">添加目录</el-button></div>
                    <div class="fr">
                        <span class="upload-text">
                            <el-upload
                                    class="upload-demo" action="" :show-file-list="false"
                                    multiple
                                    :data="{frontId:ind}"
                                    :http-request="fileUploadFun"
                                    :before-upload="imgUploadBefore2"
                                    :disabled="item.loading"
                            >
                                <el-button type="text" :loading="item.loading">点击上传</el-button>
                            </el-upload>
                        </span>
                        <span @click="selectMultimediaResources(ind)" v-if="mediaButtonIsShow">选取多媒体资源</span>
                    </div>
                </div>
                <div class="catalog clearfix" v-else>
                    <div class="fl">
                        <em class="catalog-em" v-if="!item.isEditStatus">{{item.name}}</em>
                        <em class="catalog-em" v-else><el-input v-model="item.name" size="mini" maxLength="32" placeholder="请输入目录名称"></el-input></em>
                        <span @click="deleteCatalog(ind)">删除</span>
                        <span @click="editCatalog(ind)" v-if="!item.isEditStatus">编辑</span>
                        <span @click="completeCatalog(ind)" v-else>完成</span>
                    </div>
                    <div class="fr">
                        <span class="upload-text">
                            <el-upload
                                    class="upload-demo" action="" :show-file-list="false"
                                    multiple
                                    :data="{frontId:ind}"
                                    :http-request="fileUploadFun"
                                    :before-upload="imgUploadBefore2"
                                    :disabled="item.loading"
                            >
                                <el-button type="text" :loading="item.loading">点击上传</el-button>
                            </el-upload>
                        </span>
                        <span @click="selectMultimediaResources(ind)" v-if="mediaButtonIsShow">选取多媒体资源</span>
                    </div>
                </div>
                <ul class="catalog-list">
                    <li class="clearfix" v-for="(item2,ind2) in item.wares" :key="ind2">
                        <p>（{{ind2+1}}）</p>
                        <p>
                            <span v-if="!item2.isEditStatus" class="fl file-name">{{item2.name}}</span>
                            <el-input v-else v-model="item2.name" size="mini" maxLength="64" placeholder="请输入课件名称"></el-input>
                        </p>
                        <el-checkbox-group v-model="item2.flag">
                            <el-checkbox label="学员可见" :key="0">学员可见</el-checkbox>
                            <el-checkbox label="讲师可见" :key="1">讲师可见</el-checkbox>
                            <el-checkbox label="讲师下载" :key="2">讲师下载</el-checkbox>
                        </el-checkbox-group>
                        <p class="operation fr">
                            <span v-if="ind2 != 0" @click="moveUpward(ind,ind2)">上移</span>
                            <span v-if="ind2 != item.wares.length-1" @click="moveDown(ind,ind2)">下移</span>
                            <span @click="complete(ind,ind2)" v-if="item2.isEditStatus">完成</span>
                            <span @click="editLine(ind,ind2)" v-else>编辑</span>
                            <span @click="deleteCourseWare(ind,ind2)">删除</span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="item">
            <h3 class="add-title clearfix">相关试卷 <span class="fr title-right" @click="getPapers">试卷库获取</span></h3>
            <ul class="test-list">
                <li class="clearfix" v-for="(item,ind) in papers" :key="ind"><span class="fl">（{{ind+1}}）{{item.paperName}}</span><span class="fr del" @click="deletePapers(ind)">删除</span></li>
            </ul>
        </div>
        <div class="item">
            <h3 class="add-title clearfix">相关评估 <span class="fr title-right" @click="addResearchFun">添加评估</span></h3>
            <ul class="research-list">
                <li class="clearfix" v-for="(item,ind) in assesses" :key="ind"><span class="fl">（{{ind+1}}）{{item.assessName}}</span><span class="fr del" @click="deleteSurvey(ind)">删除</span></li>
            </ul>
        </div>
        <div class="item">
            <h3 class="add-title clearfix">封面
                <span class="fr title-right upload-text">
                    <el-upload
                            class="upload-demo" action="" :show-file-list="false"
                            multiple
                            :http-request="fileUploadCoversFun"
                            :before-upload="imgUploadBefore"
                            :disabled="coversLoading"
                    >
                        <el-button type="text" :loading="coversLoading">上传封面</el-button>
                    </el-upload>
                </span>
            </h3>
            <ul class="cover-list">
                <li class="clearfix" v-for="(item,ind) in covers" :key="ind" style="margin-top: 15px;">
                    <span class="fl">（{{ind+1}}）</span>
                    <img class="fl" :src="item.realCoverPath" alt="">
                    <span class="fr del" @click="deleteCovers(ind)">删除</span>
                </li>
            </ul>
        </div>
        <div class="button-container">
            <el-button type="primary" @click="addSubmit('addForm')" class="el-btn-min-100 no-repeat-click6" size="small">确定</el-button>
            <el-button @click="$router.go(-1)" class="el-btn-min-100" size="small">返回</el-button>
        </div>
        <!-- 选取多媒体资源 -->
        <el-dialog title="选取多媒体资源" :visible.sync="multimediaIsShow" customClass="width1200" :close-on-click-modal="false" class="need-header">
            <div class="dialog-container">
                <el-form :inline="true" :model="searchData" class="demo-form-inline course-input" label-width="100px">
                    <el-form-item label="资源类型" size="small">
                        <el-select v-model="searchData.mediaType" placeholder="请选择资源类型">
                            <el-option v-for="(item,ind) in dictionariesAllData['mediaType_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源名称" size="small">
                        <el-input v-model="searchData.mediaName" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人" size="small">
                        <el-input v-model="searchData.createUser" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" size="small">
                        <el-date-picker
                                v-model="searchData.createTime"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="button-container">
                    <el-button type="primary" @click="searchFun" class="chaxun el-btn-min-100 no-repeat-click2" size="small">查询</el-button>
                    <el-button @click="resetFun" class="el-btn-min-100" size="small">重置</el-button>
                </div>
                <div class="loading-table3">
                    <el-table border :data="multimediaRecords" tooltip-effect="dark" style="margin-top: 20px;width: 100%" @selection-change="multimediaChange" size="mini">
                        <el-table-column
                                type="selection" align="center"
                                width="40">
                        </el-table-column>
                        <el-table-column prop="mediaId" label="资源编号"></el-table-column>
                        <el-table-column prop="mediaName" label="资源名称"></el-table-column>
                        <el-table-column label="资源类型">
                            <template slot-scope="scope">
                                {{dictionariesNameData[scope.row.mediaType]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="mediaDesc" label="资源描述"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                {{dictionariesNameData[scope.row.mediaStatus]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createUser" label="创建人"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    </el-table>
                    <div class="pagination">
                        <span>一共 <span class="total">{{mediaTotal}}</span> 条数据</span>
                        <el-pagination
                                @size-change="mediaSizeChange"
                                @current-change="mediaCurrentChange"
                                :page-sizes="[5, 10, 15, 20,50]"
                                :page-size="5"
                                layout="sizes, prev, pager, next, jumper"
                                :total="mediaTotal"
                                :current-page.sync="mediaPageNo"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="multimediaIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="multimediaSubmit" class="el-btn-min-100" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 添加评估 -->
        <el-dialog title="添加评估" :visible.sync="researchIsShow" customClass="width1000" :close-on-click-modal="false" class="need-header">
            <div class="dialog-container assessment-dialog">
                <el-form ref="form" :model="researchData" label-width="100px">
                    <el-form-item label="评估名称：">
                        <el-input v-model.trim="researchData.name" placeholder="请输入评估名称" maxLength="32"></el-input>
                    </el-form-item>
                    <el-form-item label="评估描述：">
                        <el-input v-model.trim="researchData.content" type="textarea" placeholder="请输入评估描述" maxLength="128"></el-input>
                    </el-form-item>
                    <el-form-item label="被评估人：">
                        <el-input v-model.trim="researchData.assessedPerson" style="width: 200px;"  placeholder="请输入被评估人" maxLength="32"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="满分值：">-->
                        <!--<el-input v-model="researchData.score" style="width: 200px;"  placeholder="请输入满分值" @input="researchData.score= researchData.score.replace(/[^\d]/g,'').replace(/^0[0-9]/g,'0')"></el-input>-->
                    <!--</el-form-item>-->
                </el-form>
                <div class="research-item" v-for = "(item,ind) in researchData.questions" :key="ind" style="margin-top: 30px;">
                    <p>
                        <span style="width: 80px;display: inline-block;padding-left: 20px;"  class="red-must">问题 {{ind+1}}</span>
                        <el-input class="problem-title" v-model.trim="item.title" placeholder="在此输入标题" style="width: 500px;" maxLength="128"></el-input>
                        <el-radio-group v-model="item.type" style="margin-left: 20px;">
                            <el-radio label="单选">单选</el-radio>
                            <el-radio label="多选">多选</el-radio>
                            <el-radio label="主观">主观</el-radio>
                        </el-radio-group>
                        <span v-if="researchData.questions.length>=2" style="font-size: 14px;color: #409EFF; cursor: pointer;padding-left:50px;" @click="deleteProblem(ind)">删除问题</span>
                    </p>
                    <ul v-if="item.type != '主观'" style="margin: 10px 0 0 56px;">
                        <li v-for="(item2,ind2) in item.options" :key="ind2" style="line-height: 50px;">
                            <span class="red-must">{{ind2 | letter}}、</span>
                            <el-input type="text" v-model.trim="item2.optionContent" placeholder="在此输入选项内容" style="width: 600px;" maxLength="128"></el-input>
                            <span style="padding-left: 10px;" v-if="item.type === '单选'" class="red-must">分值：<el-input type="text" v-model="item2.score" style="width: 80px;" @input="item2.score= item2.score.replace(/[^\d]/g,'').replace(/^0[0-9]/g,'0')" maxLength="11"></el-input></span>
                            <span class="option-delete" style="padding-left: 15px;" @click="deleteOption(ind,ind2)">删除</span>
                            <i class="el-icon-circle-plus" style="font-size:24px;vertical-align:middle;margin-left: 15px;cursor: pointer;" v-if="ind2 == item.options.length-1" @click="addOption(ind,ind2)"></i>
                        </li>
                    </ul>
                    <p v-if="researchData.questions.length-1 == ind" style="font-size: 14px;color: #409EFF; cursor: pointer;padding: 20px 0 20px 50px;width: 700px;text-align: center;" @click="addProblem">新增一个问题</p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="researchIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="selectTemplate" size="small">模板选择</el-button>
                <el-button type="primary" @click="researchSubmit('普通')" class="el-btn-min-100 no-repeat-click4" size="small">保存</el-button>
                <el-button type="primary" @click="researchSubmit('模板')" class="no-repeat-click5" size="small">保存并另存为模板</el-button>
            </div>
        </el-dialog>
        <!-- 模板选择 -->
        <el-dialog title="评估模板" :visible.sync="templateIsShow" :close-on-click-modal="false" class="need-header">
            <div class="dialog-container">
                <el-form :model="searchtTemplate" label-width="80px" class="course-input">
                    <el-form-item label="模板名称" size="small">
                        <el-input v-model.trim="searchtTemplate.name" placeholder="请输入模板名称"></el-input>
                    </el-form-item>
                </el-form>
                 <div class="button-container">
                    <el-button type="primary" @click="searchTemplate" class="el-btn-min-100 no-repeat-click3" size="small">查询</el-button>
                    <el-button @click="resetTemplate" class="el-btn-min-100" size="small">重置</el-button>
                </div>
                <div class="loading-table">
                    <el-table border :data="templateRecords" tooltip-effect="dark" style="margin-top: 20px;width: 100%" size="mini">
                        <el-table-column align="center" label="模板编号">
                            <template slot-scope="scope">
                                <span @click="getTemplateDetail(scope.row.id)">{{scope.row.code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="模板名称"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span @click="useTemplate(scope.row.id)">使用</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <span>一共 <span class="total">{{templateTotal}}</span> 条数据</span>
                        <el-pagination
                                @size-change="templateChange"
                                @current-change="templatePageChange"
                                :page-sizes="[5, 10, 15, 20,50]"
                                :page-size="5"
                                layout="sizes, prev, pager, next, jumper"
                                :total="templateTotal"
                                :current-page.sync="templatepageNo"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="templateIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
            </div>
        </el-dialog>
        <!-- 模板详情 -->
        <el-dialog :show-close="false" :visible.sync="templateDetailIsShow" width="1000px" class="need-header">
            <p slot="title" class="module-title">模板详情</p>
            <div class="detail-box">
                <span class="detail-name">评估名称</span>
                <span>{{templateDetail.name}}</span>
            </div>
            <div class="detail-box">
                <span class="detail-name">评估描述</span>
                <span>{{templateDetail.content}}</span>
            </div>
            <div class="detail-box" style="width: 450px;display: inline-block;">
                <span class="detail-name">被评估人</span>
                <span>{{templateDetail.assessedPerson}}</span>
            </div>
            <div class="detail-box" style="width: 450px;display: inline-block;">
                <span class="detail-name">满分值</span>
                <span>{{templateDetail.score}}</span>
            </div>
            <div class="detail-box" v-for="(item, index) in templateDetail.questions" :key="index">
                <span class="detail-name">问题{{index + 1}}</span>
                <span>【{{item.type}}】{{item.title}}</span>
                <div class="detail-box" style="margin-top: 15px;" v-for="(item2, index2) in item.options" :key="index2">
                    <span class="detail-name">{{String.fromCharCode(index2 + 65)}} {{item.type == '单选' ? `[${item2.score}分]` : ''}}</span>
                    <span>{{item2.optionContent}}</span>
                </div>
            </div>
            <div class="btn-box">
                <el-button size="mini" @click="templateDetailIsShow = false;">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 试卷库获取 -->
        <el-dialog title="试卷库获取" :visible.sync="papersIsShow" :close-on-click-modal="false" customClass="width1200" class="need-header">
            <div class="dialog-container">
                <el-form :inline="true" :model="papersSearchData" class="demo-form-inline course-input" label-width="100px">
                    <el-form-item label="试卷分类" size="small">
                        <treeselect v-model="papersSearchData.knowledgeId"
                                    :options="knowAllData"
                                    placeholder="试卷分类"
                                    noResultsText="未找到，请重新输入"
                                    @open="opens"
                                    :normalizer="normalizer">
                        </treeselect>
                    </el-form-item>
                    <el-form-item label="试卷类型" size="small">
                        <el-select v-model="papersSearchData.paperType" placeholder="请选择试卷类型" ref="elSelect1">
                            <el-option v-for="(item,ind) in dictionariesAllData['paperType_all']" :key="ind" :label="item.dicName" :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试卷名称" size="small">
                        <el-input v-model="papersSearchData.paperName" placeholder="请输入试卷名称"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人" size="small">
                        <el-input v-model="papersSearchData.createUserName" placeholder="请输入创建人"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" size="small">
                        <el-date-picker
                                v-model="papersSearchData.createTime"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="button-container">
                    <el-button type="primary" @click="papersSearchFun" class="chaxun el-btn-min-100 no-repeat-click" size="small">查询</el-button>
                    <el-button @click="papersResetFun" class="el-btn-min-100" size="small">重置</el-button>
                </div>
                <div class="loading-table2">
                    <el-table border :data="papersRecords" tooltip-effect="dark" style="margin-top: 20px;width: 100%" @selection-change="papersChange" size="mini">
                        <el-table-column
                                type="selection" align="center"
                                width="40">
                        </el-table-column>
                        <el-table-column prop="paperNo" label="试卷编号"></el-table-column>
                        <el-table-column prop="paperName" label="试卷名称"></el-table-column>
                        <el-table-column label="试卷类型">
                            <template slot-scope="scope">
                                {{dictionariesNameData[scope.row.paperType]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="试卷分类">
                            <template slot-scope="scope">
                                {{scope.row.knowledgeId !== '' ? mapNameData[scope.row.knowledgeId]['knowName'] : ''}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="score" label="试卷总分"></el-table-column>
                        <el-table-column label="试卷状态">
                            <template slot-scope="scope">
                                <em v-if="scope.row.deleted == 0">停用</em>
                                <em v-else-if="scope.row.deleted == 1">启用</em>
                                <em v-else-if="scope.row.deleted == 2">删除</em>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createUserName" label="创建人"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    </el-table>
                    <div class="pagination">
                        <span>一共 <span class="total">{{papersTotal}}</span> 条数据</span>
                        <el-pagination
                                @size-change="papersSizeChange"
                                @current-change="papersCurrentChange"
                                :page-sizes="[5, 10, 15, 20,50]"
                                :page-size="5"
                                layout="sizes, prev, pager, next, jumper"
                                :total="papersTotal"
                                :current-page.sync="papersPageNo"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="papersIsShow=false" class="el-btn-min-100" size="small">取消</el-button>
                <el-button type="primary" @click="papersSubmit" class="el-btn-min-100" size="small">确定</el-button>
            </div>
        </el-dialog>
        <PersonnelSelection v-if="selectConfigIsShow" :selectConfigIsShow="selectConfigIsShow" :types="types" cascadeOrg="cascadeOrg" :existingData="existingData" @listenEventData="getDataFun" @listenEventClose="getCloseFun"></PersonnelSelection>
    </div>
</template>
<script>
    import {axiosPost,getDictionariesAllData,getKnowAllData,getMapNameData,getDictionariesNameData,fileUpload} from "@/assets/js/api";
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import PersonnelSelection from '@/components/PersonnelSelection'
    import{NumberValidate} from '@/assets/js/verification'
    export default {
        name: "addCourse",
        components:{
            Treeselect,
            PersonnelSelection
        },
        data(){
            return {
                isFromPlan: this.$route.query.planId ? true : false,
                selectConfigIsShow: false, // 选择人员弹窗
                types: [], // 获取用户类型
                cascadeOrg: 'true', // 按机构查询时是否级联子机构
                id: undefined, // 详情页id
                addData:{ // 添加数据
                    code: '', // 课程编号
                    knowledgeId: null, // 课程分类 ***
                    typeId: '', // 课程类型 ***
                    name: '', // 课程名称
                    duration: '', // 课程时长
                    audience: '', // 培训受众
                    starLevelId: '', // 课程星级 ***
                    studyModeId: '', //学习方式 ***
                    studyPurpose: '', // 学习目标
                    syllabus: '', // 课程大纲
                    description: '', // 课程介绍
                    lecturers: [], // 授权人员
                    catalogues:[ // 相关课件
                        {
                            name: '默认目录',
                            loading: false,
                            wares:[
                                // {
                                //     name: '信用卡基础知识',
                                //     path: '',
                                //     source: '本地库',
                                //     flag: [],
                                //     isEditStatus: false, // 是否在编辑状态
                                // }
                            ]
                        }
                    ]
                },
                rules: {
                    knowledgeId: [
                        { required: true, message: '请选择课程分类', trigger: 'input' }
                    ],
                    typeId: { required: true, message: '请选择课程类型', trigger: 'change' },
                    name: [
                        { required: true, message: '请输入课程名称', trigger: 'change' },
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ],
                    starLevelId: { required: true, message: '请选择课程星级', trigger: 'change' },
                    studyModeId: { required: true, message: '请选择学习方式', trigger: 'change' },
                    studyPurpose: [
                        { required: true, message: '请输入学习目标', trigger: 'change' },
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    syllabus: [
                        { required: true, message: '请输入课程大纲', trigger: 'change' },
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    lecturers: { required: true, message: '请选择授权人员', trigger: 'change' },
                    description: [
                        { required: true, message: '请输入课程介绍', trigger: 'change' },
                        { max: 512, message: '长度应小于等于512个字符', trigger: 'blur' }
                    ],
                    duration: [
                        {required: true, message: '请输入课程时长', trigger: 'change'},
                        { validator: NumberValidate, message: '请输入有效数字',trigger: 'blur'},
                        { max: 8, message: '长度应小于等于8个字符', trigger: 'blur' }
                    ],
                    audience:[
                        { max: 32, message: '长度应小于等于32个字符', trigger: 'blur' }
                    ]
                },
                dictionariesAllData: [], // 获取基本类型字典项数据
                knowAllData: [], // 获取知识体系字典项数据
                mapNameData: [], // 获取知识体系字典项数据的某个值
                dictionariesNameData: [], // 获取基本类型字典项数据的某个值
                researchIsShow: false, // 评估
                researchData: {
                    name: '',
                    content: '',
                    assessedPerson: '',
                    score: '',
                    questions:[
                        {
                            title: '',
                            type: '单选', // 单选 多选 主观
                            options:[
                                {
                                    optionContent: '',
                                    score: ''
                                },
                                {
                                    optionContent: '',
                                    score: ''
                                },
                                {
                                    optionContent: '',
                                    score: ''
                                },
                                {
                                    optionContent: '',
                                    score: ''
                                }
                            ]
                        }
                    ]
                },
                multimediaIsShow: false, // 选取多媒体资源
                multimediaRecords: [], // 多媒体资源数据
                multimediaData:[], // 选取后的多媒体资源数据
                mediaPageNo: 1, // 页数
                mediaPageSize: 5, // 条数
                mediaTotal: 0, // 总条数
                mediaInd: -1, // 选取多媒体资源
                mediaButtonIsShow: false, // 学习选择
                searchData: { // 搜索数据
                    mediaType: '',
                    mediaName: '',
                    createUser: '',
                    createTime: ['',''],
                    startTime: '',
                    endTime: '',
                },
                templateIsShow: false, // 模板选择
                templateRecords: [], // 模板数据
                templateTotal: 0, // 模板数据
                templatepageNo: 1, // 页数
                templatePageSize: 5, // 条数
                searchtTemplate:{
                    name: '', // 模板名称
                },
                templateDetailIsShow: false, // 模板详情
                templateDetail: {}, // 模板详情
                assesses: [], // 评估结果
                covers:[], // 封面结果
                papers: [],// 试卷结果
                papersRecords:[], // 试卷数据
                papersIsShow: false, // 试卷库
                papersSearchData:{ // 试卷库搜索
                    knowledgeId: null, // 试卷分类
                    paperType: '', // 试卷类型
                    paperName: '', // 试卷名称
                    createUserName: '', // 创建人
                    createTime: ['',''], // 试卷类型
                    startDate: '', // 试卷类型
                    endTime: '', // 试卷类型
                },
                papersPageNo: 1, // 页数
                papersPageSize: 5, // 条数
                papersTotal: 0, // 总条数
                papersTableData: [], // 选取后的试卷库数据
                existingData:[], //传递的数据
                coversLoading: false, // 上传封面loading
            }
        },
        created(){
            getDictionariesAllData().then(res => {
                // courseType_all：课程类型 studyWay_all：学习方式 status_all：课程状态
                this.dictionariesAllData = res;
            });
            getKnowAllData().then(res => {
                // 知识体系
                this.knowAllData = res;
            });
            getMapNameData().then(res => {
                this.mapNameData = res;
            });
            getDictionariesNameData().then(res => {
                this.dictionariesNameData = res;
            });
        },
        mounted(){
            this.id = this.$route.query.id;
            if(this.id != undefined){
                this.getInfo();
            }
        },
        methods:{
            getInfo(){ // 获取详情
                axiosPost('/educateMgr/course/info',{
                   id: this.id
                })
                    .then(res => {
                        this.addData.code = res.data.code;
                        this.addData.knowledgeId = res.data.knowledgeId;
                        this.addData.typeId = res.data.typeId;
                        this.addData.name = res.data.name;
                        this.addData.duration = res.data.duration;
                        this.addData.audience = res.data.audience;
                        this.addData.starLevelId = res.data.starLevelId;
                        this.addData.studyModeId = res.data.studyModeId;
                        this.addData.studyPurpose = res.data.studyPurpose;
                        this.addData.syllabus = res.data.syllabus;
                        this.addData.lecturers = res.data.lecturers;
                        this.addData.description = res.data.description;
                        this.covers = res.data.covers;
                        this.assesses = res.data.assesses;
                        this.papers = res.data.papers;
                        this.addData.catalogues = res.data.catalogues;
                        res.data.catalogues.forEach((item,ind) => {
                            this.$set(this.addData.catalogues,ind,Object.assign({loading: false},item))
                        });
                        if(this.dictionariesNameData[this.addData.studyModeId] == '直播'){
                            this.mediaButtonIsShow = false;
                        }else{
                            this.mediaButtonIsShow = true;
                        }
                    })
            },
            getmediaList(){ // 获取多媒体资源列表
                axiosPost('/materialMgr/media/list',{
                    mediaType: this.searchData.mediaType,
                    mediaName: this.searchData.mediaName,
                    createUser: this.searchData.createUser,
                    startTime: this.searchData.createTime ? this.searchData.createTime[0] : '',
                    endTime: this.searchData.createTime ? this.searchData.createTime[1] : '',
                    pageNo: this.mediaPageNo,
                    pageSize: this.mediaPageSize,
                    noRepeat: '.no-repeat-click2',
                    loading: '.loading-table3',
                    mediaStatus: 'd9a95689'
                })
                    .then(res => {
                        this.multimediaRecords = res.data.records;
                        this.mediaTotal = res.data.total;
                    })
            },
            getTemplateList(){ // 获取评估列表
                axiosPost('/educateMgr/assess/list',{
                    name: this.searchtTemplate.name,
                    pageNo: this.templatepageNo,
                    pageSize: this.templatePageSize,
                    loading: '.loading-table',
                    noRepeat: '.no-repeat-click3'
                })
                    .then(res => {
                        this.templateRecords = res.data.records;
                        this.templateTotal = res.data.total;
                    })
            },
            papersList(){ // 试卷库获取
                axiosPost('/examMgr/paper/paperList',{
                    knowledgeId: this.papersSearchData.knowledgeId, // 试卷分类
                    paperType: this.papersSearchData.paperType, // 试卷类型
                    paperName: this.papersSearchData.paperName, // 试卷名称
                    createUserName: this.papersSearchData.createUserName, // 创建人
                    startDate: this.papersSearchData.createTime ? this.papersSearchData.createTime[0] : '',
                    endDate: this.papersSearchData.createTime ? this.papersSearchData.createTime[1] : '',
                    pageNo: this.papersPageNo,
                    pageSize: this.papersPageSize,
                    noRepeat: '.no-repeat-click',
                    loading: '.loading-table2',
                })
                    .then(res => {
                        this.papersRecords = res.data.records;
                        this.papersTotal = res.data.total;
                    })
            },
            editLine(ind,ind2){ // 编辑某条数据
                this.addData.catalogues[ind].wares[ind2].isEditStatus = true;
                this.addData.catalogues[ind].wares.push(1);
                this.addData.catalogues[ind].wares.pop();
            },
            complete(ind,ind2){ // 编辑完成
                this.addData.catalogues[ind].wares[ind2].isEditStatus = false;
                this.addData.catalogues[ind].wares.push(1);
                this.addData.catalogues[ind].wares.pop();
            },
            normalizer(node) { // 知识体系树
                return {
                    id: node.id,
                    label: node.knowName,
                    children: node.children,
                }
            },
            selectPeople(){ // 新增 添加人员弹窗打开
                this.selectConfigIsShow = true;
                this.types = ["LECTURER"];
            },
            getCloseFun(res){ // 新增 添加人员弹窗关闭
                this.selectConfigIsShow = res;
            },
            getDataFun(res){  // 新增 添加人员弹窗获取
                this.addData.lecturers = res.map(item => {
                    return {lecturerId: item.userId,lecturerName: item.userName};
                });
            },
            fileUploadFun(item){ // 上传相关课件
                this.addData.catalogues[item.data.frontId].loading = true;
                fileUpload(item)
                    .then(res => {
                        this.addData.catalogues[item.data.frontId].loading = false;
                        this.addData.catalogues[res.data.frontId].wares.push({
                            name: res.data.oriName,
                            path: res.data.lastStoreLocation,
                            source: '本地库',
                            flag: [],
                            isEditStatus: false, // 是否在编辑状态
                        })
                    })
            },
            deleteCourseWare(ind,ind2){ // 删除课件里面附件
                this.addData.catalogues[ind].wares.splice(this.addData.catalogues[ind].wares.findIndex((item,ind3) => ind3 === ind2), 1);
            },
            addCatalog(){ // 添加目录
                this.addData.catalogues.push({
                    name: '自定义目录',
                    loading: false,
                    isEditStatus: false,
                    wares:[]
                })
            },
            deleteCatalog(ind){ // 删除目录
                this.addData.catalogues.splice(this.addData.catalogues.findIndex((item,ind2) => ind === ind2), 1);
            },
            editCatalog(ind){ // 编辑目录
                this.$set(this.addData.catalogues,ind,{
                    courseId: this.addData.catalogues[ind].courseId,
                    id: this.addData.catalogues[ind].id,
                    name: this.addData.catalogues[ind].name,
                    wares: this.addData.catalogues[ind].wares,
                    isEditStatus: true,
                    loading: false
                });
            },
            completeCatalog(ind){ // 编辑目录完成
                this.$set(this.addData.catalogues,ind,{
                    courseId: this.addData.catalogues[ind].courseId,
                    id: this.addData.catalogues[ind].id,
                    name: this.addData.catalogues[ind].name,
                    wares: this.addData.catalogues[ind].wares,
                    isEditStatus: false,
                    loading: false
                });
            },
            selectMultimediaResources(ind){ // 选择多媒体资源
                this.multimediaIsShow = true;
                this.mediaInd = ind;
                this.mediaPageNo = 1;
                this.getmediaList(); // 获取多媒体资源列表
            },
            multimediaChange(res){// 多媒体资源  表格选择更改
                this.multimediaData = res;
            },
            multimediaSubmit(){ // 选取多媒体资源 确定
                if(this.multimediaData.length != 0){
                    this.multimediaData.forEach(item => {
                        this.addData.catalogues[this.mediaInd].wares.push({
                            name: item.mediaName,
                            path: item.filePath,
                            sourceId: item.id,
                            source: '多媒体',
                            flag: [],
                            isEditStatus: false, // 是否在编辑状态
                        });
                    });
                    let testObj = {};
                    this.addData.catalogues[this.mediaInd].wares = this.addData.catalogues[this.mediaInd].wares.reduce((pre,cur) => {
                        testObj[cur.sourceId] ? '' : testObj[cur.sourceId] = pre.push(cur);
                        return pre;
                    },[]);
                    this.multimediaIsShow = false;
                }else{
                    this.$message({message: '请点击列表选择某一项数据',type: 'warning'});
                }
            },
            mediaSizeChange(res){ // 更改条数
                this.mediaPageNo = 1;
                this.mediaPageSize = res;
                this.getmediaList();
            },
            mediaCurrentChange(res){ // 更改页数
                this.mediaPageNo = res;
                this.getmediaList();
            },
            addResearchFun(){ // 添加评估
                this.researchIsShow = true;
            },
            moveUpward(ind,ind2){ // 上移
                [this.addData.catalogues[ind].wares[ind2-1],this.addData.catalogues[ind].wares[ind2]] = [this.addData.catalogues[ind].wares[ind2],this.addData.catalogues[ind].wares[ind2-1]];
                this.addData.catalogues[ind].wares.push('');
                this.addData.catalogues[ind].wares.pop();
            },
            moveDown(ind,ind2){ // 下移
                [this.addData.catalogues[ind].wares[ind2],this.addData.catalogues[ind].wares[ind2+1]] = [this.addData.catalogues[ind].wares[ind2+1],this.addData.catalogues[ind].wares[ind2]];
                this.addData.catalogues[ind].wares.push('');
                this.addData.catalogues[ind].wares.pop();
            },
            statusSelect(){ // 学习选择
                if(this.dictionariesNameData[this.addData.studyModeId] == '直播'){
                    this.mediaButtonIsShow = false;
                    this.addData.catalogues.forEach((item) => {
                        item.wares = item.wares.filter(item2 => item2.source === '本地库');
                    });
                }else{
                    this.mediaButtonIsShow = true;
                }
            },
            searchFun(){ //  多媒体管理 查询
                this.mediaPageNo = 1;
                this.getmediaList();
            },
            resetFun(){ // 多媒体管理 重置
                this.searchData = {createTime: ['','']};
            },
            deleteOption(ind,ind2){ // 删除某一项
                if(this.researchData.questions[ind].options.length == 4){
                    this.$message({message: '最少为4项，不能删除',type: 'warning'});
                }else{
                    this.researchData.questions[ind].options.splice(this.researchData.questions[ind].options.findIndex((item,ind3) => ind3 === ind2),1);
                }
            },
            addOption(ind){ // 新增某一项
                this.researchData.questions[ind].options.push({optionContent:''});
            },
            addProblem(){ // 新增一个问题
                this.researchData.questions.push({
                    title: '',
                    type: '单选', // 单选 多选 主观,
                    options:[
                        {
                            optionContent: '',
                            score: ''
                        },
                        {
                            optionContent: '',
                            score: ''
                        },
                        {
                            optionContent: '',
                            score: ''
                        },
                        {
                            optionContent: '',
                            score: ''
                        }
                    ]
                })
            },
            deleteProblem(ind){ // 删除问题
                this.researchData.questions.splice(this.researchData.questions.findIndex((item,ind2) => ind2 === ind),1);
            },
            researchSubmit(typeArg){ // 添加评估提交
                let flag = true;
                try{
                    if(!this.researchData.name || !this.researchData.content || !this.researchData.assessedPerson){
                        flag = false;
                        throw new Error();
                    }
                    this.researchData.questions.forEach((item) => {
                        if(item.title == ''){
                            flag = false;
                            throw new Error();
                        }
                        if(item.type != '主观'){
                            let isQualified = false;
                            if(item.type == '单选'){
                                isQualified = item.options.every((item2) => {
                                    return item2.optionContent.length.toString() > 0 && item2.score.toString().length > 0;
                                });
                            }else{
                                isQualified = item.options.every((item2) => {
                                    return item2.optionContent.length > 0
                                });
                            }
                            if(!isQualified){
                                flag = false;
                                throw new Error();
                            }
                        }
                    })
                } catch (e){
                    this.$message({message: '请输入完整后提交!!!',type: 'warning'});
                }
                if(flag){
                    this.researchIsShow = false;
                    axiosPost('/educateMgr/assess/save',{
                        name: this.researchData.name,
                        content: this.researchData.content,
                        assessedPerson: this.researchData.assessedPerson,
                        score: this.researchData.score,
                        questions: this.researchData.questions,
                        type: typeArg,
                        noRepeat: typeArg === '普通' ? '.no-repeat-click4' : '.no-repeat-click5'
                    })
                        .then(res => {
                            this.researchIsShow = false;
                            this.assesses.push({
                                assessId: res.data.id,
                                assessName: res.data.name
                            });
                            this.clearResearchData() // 清空数据
                        })
                }
            },
            clearResearchData(){ // 清空数据
                this.researchData = {
                    name: '',
                    content: '',
                    assessedPerson: '',
                    score: '',
                    questions:[
                        {
                            title: '',
                            type: '单选',
                            options:[
                                {
                                    optionContent: '',
                                    score: ''
                                },
                                {
                                    optionContent: '',
                                    score: ''
                                },
                                {
                                    optionContent: '',
                                    score: ''
                                },
                                {
                                    optionContent: '',
                                    score: ''
                                }
                            ]
                        }
                    ]
                }
            },
            selectTemplate(){
                this.templateIsShow = true;
                this.getTemplateList(); // 获取评估模板
            },
            useTemplate(id){ // 使用模板
                this.clearResearchData(); // 清空数据
                axiosPost('/educateMgr/assess/info',{
                    id: id
                }).then(res => {
                    this.researchData.name = res.data.name;
                    this.researchData.content = res.data.content;
                    this.researchData.assessedPerson = res.data.assessedPerson;
                    this.researchData.score = res.data.score;
                    res.data.questions.forEach((item,ind) => {
                        this.$set(this.researchData.questions,ind,{
                            title: item.title,
                            type: item.type,
                            options: [{optionContent: '',score: ''},{optionContent: '',score: ''},{optionContent: '',score: ''},{optionContent: '',score: ''}]
                        });
                        item.options.forEach((item2,ind2) => {
                            this.$set(this.researchData.questions[ind].options,ind2,{
                                optionContent: item2.optionContent,
                                score: item2.score
                            })
                        })
                    });
                    this.templateIsShow = false;
                })
            },
            templateChange(res){ // 更改条数
                this.templatepageNo = 1;
                this.templatePageSize = res;
                this.getTemplateList();
            },
            templatePageChange(res){ // 更改页数
                this.templatepageNo = res;
                this.getTemplateList();
            },
            searchTemplate(){ // 搜索模板
                this.templatepageNo = 1;
                this.getTemplateList();
            },
            resetTemplate(){ // 重置模板
                this.searchtTemplate.name = '';
            },
            getTemplateDetail(id){ // 获取详情
                axiosPost('/educateMgr/assess/info',{
                    id: id
                }).then(res => {
                    this.templateDetail = res.data;
                    this.templateDetailIsShow = true;
                })
            },
            deleteSurvey(ind){ // 删除评估
                this.assesses.splice(this.assesses.findIndex((item,ind2) => ind2 == ind),1);
            },
            deleteCovers(ind){ // 删除封面
                this.covers.splice(this.covers.findIndex((item,ind2) => ind2 == ind),1);
            },
            imgUploadBefore(file){ // 上传前
                let isImg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                if(!isImg){
                    this.$message.error('只能上传jpeg、jpg、png格式的图片!');
                }
                return isImg;
            },
            imgUploadBefore2(file){ // 上传前
                let isImg = file.type === 'video/mp4' || file.type=== 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf';
                if(!isImg){
                    this.$message.error('只能上传mp4、pdf、jpeg、jpg、png格式的文件!');
                }
                return isImg;
            },
            fileUploadCoversFun(item){ // 上传封面
                this.coversLoading = true;
                fileUpload(item)
                    .then(res => {
                        this.coversLoading = false;
                        this.covers.push({
                            coverPath: res.data.lastStoreLocation,
                            realCoverPath: res.data.readAbsoluteLocation
                        });
                    })
            },
            getPapers(){ // 试卷库获取
                this.papersIsShow = true;
                this.papersPageNo = 1;
                this.papersList(); // 试卷库获取
            },
            deleteLecturers(ind){ // 删除授权人员
                this.addData.lecturers.splice(this.addData.lecturers.findIndex((item,ind1) => ind1 === ind),1);
            },
            papersSizeChange(res){ // 更改条数
                this.papersPageNo = 1;
                this.papersPageSize = res;
                this.papersList();
            },
            papersCurrentChange(res){ // 更改页数
                this.papersPageNo = res;
                this.papersList();
            },
            papersChange(res){// 表格选择更改
                this.papersTableData = res;
            },
            papersSearchFun(){ // 查询
                this.papersPageNo = 1;
                this.papersList();
            },
            papersResetFun(){ //  重置
                this.papersSearchData = {createTime: ['','']};
            },
            papersSubmit(){ // 试卷 确定
                if(this.papersTableData.length != 0){
                    this.papersTableData.forEach(item => {
                        this.papers.push({
                            paperName: item.paperName,
                            paperId: item.id
                        });
                    });
                    let testObj = {};
                    this.papers = this.papers.reduce((pre,cur) => {
                        testObj[cur.paperId] ? '' : testObj[cur.paperId] = pre.push(cur);
                        return pre;
                    },[]);
                    this.papersIsShow = false;
                }else{
                    this.$message({message: '请选择数据',type: 'warning'});
                }
            },
            deletePapers(ind){ // 删除试卷
                this.papers.splice(this.papers.findIndex((item,ind2) => ind2 == ind),1);
            },
            addSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        axiosPost('/educateMgr/course/save',{
                            id: this.id,
                            knowledgeId: this.addData.knowledgeId,
                            knowledgePath: this.mapNameData[this.addData.knowledgeId].knowName,
                            typeId: this.addData.typeId,
                            type: this.dictionariesNameData[this.addData.typeId],
                            name: this.addData.name,
                            duration: this.addData.duration,
                            audience: this.addData.audience,
                            starLevelId: this.addData.starLevelId,
                            starLevel: this.dictionariesNameData[this.addData.starLevelId],
                            studyModeId: this.addData.studyModeId,
                            studyMode: this.dictionariesNameData[this.addData.studyModeId],
                            studyPurpose: this.addData.studyPurpose,
                            description: this.addData.description,
                            syllabus: this.addData.syllabus,
                            lecturers: this.addData.lecturers,
                            catalogues:this.addData.catalogues,
                            papers: this.papers,
                            assesses: this.assesses,
                            covers: this.covers,
                            noRepeat: '.no-repeat-click6'
                        }).then(() => {
                            this.$router.go(-1);
                        })
                    }
                })
            },
            opens(){ // vue-selectTree打开时隐藏el-select
                this.$refs.elSelect1.blur();
            },
            chengeTreeSelect(){ // 课程分类选择
                this.$refs['addForm'].validateField('knowledgeId')
            }
        },
        filters:{
            letter:function(ind){
                let letterArr = ['A','B','C','D','E','F','G','H','I','G','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                return letterArr[ind];
            }
        },
        watch: {
            'addData.lecturers': function(val){
                this.existingData = val.map(item => {
                    return {userId:item.lecturerId};
                })
            }
        }
    }
</script>

<style scoped>
    .item{
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 15px;
        margin-bottom: 15px;
        font-size: 14px;
    }
    .item1{
       margin-top: 30px;
    }
    .item:last-child{
        border-bottom: none;
    }
    .catalog{
        margin-top: 10px;
    }
    .catalog-list .el-select{
        width: 120px!important;
        margin-right: 20px;
    }
    .catalog>div:first-child{
        margin-left: 15px;
    }
    .catalog>div span{
        cursor: pointer;
        padding-left: 15px;
        color: #409EFF;
        font-size: 14px;
    }
    .catalog-list{
        padding-left: 30px;
    }
    .catalog-list li{
        padding: 15px 0;
        display: flex;
        align-items: center;
    }
    .catalog-list .class-name{
        width: 80px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    .catalog-list .file-name{
        padding-left: 20px;
        width: 220px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    .operation {
        flex: 1;
        text-align: right;
    }
    .operation span{
        cursor: pointer;
        color: #409EFF;
        padding-left: 15px;
        font-size: 14px;
    }
    .catalog-list .el-input{
        width: 130px;
        margin-right: 10px;
    }
    .test-list,.research-list,.cover-list{
        padding-left: 30px;
    }
    .test-list li,.research-list li{
        line-height: 30px;
    }
    .del{
        color: #409EFF;
        cursor: pointer;
    }
    .title-right{
        font-size: 14px;
        color: #409EFF;
        cursor: pointer;
        font-weight: normal;
    }
    .cover-list img{
        width: 500px;
    }
    .vue-treeselect{
        width: 160px;
        float: left;
    }
    .upload-text{
        display: inline-block;
        color: #409EFF;
        font-size: 14px;
    }
    .upload-text p{
        font-size: 14px;
    }
    .catalog-em{
        display: inline-block;
    }
    .option-delete{
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
    }
    .problem-title{
        width: 60%;
    }
    .detail-content p{
        line-height: 30px;
    }
    .detail-content p span:nth-child(1){
        font-size: 16px;
        font-weight: bold;
        padding-right: 10px;
    }
    .detail-content ul{
        padding-left: 20px;
    }
    .detail-content li{
        line-height: 30px;
    }
    .people-list{
        width: 615px;
        height: 40px;
        border:1px solid #ddd;
        border-radius: 3px;
        overflow-y: auto;
    }
    .people-list li{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 15px;
        border-radius: 3px;
        border: 1px solid #cae4ff;
        background: #edf6ff;
        margin: 4px 10px 4px 0;
        color: #50a6fd;
    }
    .people-list li i{
        font-size: 20px;
        color: #50a6fd;
        vertical-align: middle;
        cursor: pointer;
        padding-left: 6px;
    }
    .people-list::-webkit-scrollbar{width: 3px;height: 1px;}
    .people-list::-webkit-scrollbar-thumb{border-radius: 10px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #50a6fd;}
    .people-list::-webkit-scrollbar-track{width: 10px;height: 1px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #b6d2ee;}
    .module-title {
        border-left: 4px solid #409EFF;
        padding-left: 10px;
        font-size: 22px;
        line-height: 20px;
    }
    .detail-box{
        padding-left: 80px;
        position: relative;
        margin-bottom: 15px;
        line-height: 25px;
    }
    .detail-name{
        position: absolute;
        width: 80px;
        padding-right: 12px;
        text-align: right;
        left: 0;
        top: 0;
    }
    .btn-box {
        text-align: center;
    }
    .assessment-dialog >>> .el-form-item__label:before{
        content: "*";
        color: #F56C6C;
        margin-right: 4px;
    }
    .course-input .el-input, .course-input .el-select{
        width: 160px;
    }
    .course-input >>> .el-textarea textarea{
        width: 160px;
        padding: 6px 15px 0 15px;
        height: 32px;
    }
</style>