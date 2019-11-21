import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'// nprogress样式文件

import store from './store'
import {getMenuList,checkToken,getToken} from "@/assets/js/api";
Vue.use(Router);
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: {
                name: 'welcome'
            },
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('./views/Error.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/Login.vue'),
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('./components/Index.vue'),
            redirect: {
                name: 'welcome'
            },
            children:[
                {
                    path: '/welcome',
                    name: 'welcome',
                    meta:{
                        isNeedPermissions: false
                    },
                    component: () => import('./views/Welcome.vue'),
                },
                {
                    path: '/user-management',
                    name: 'user',
                    meta:{
                        name: '用户管理'
                    },
                    component: () => import('./views/SystemManagement/UserManagement.vue')
                },
                {
                    path: '/role-management',
                    name: 'role',
                    meta:{
                        name: '角色管理'
                    },
                    component: () => import('./views/SystemManagement/RoleManagement.vue')
                },
                {
                    path: '/menu-management',
                    name: 'menu',
                    meta:{
                        name: '菜单管理'
                    },
                    component: () => import('./views/SystemManagement/MenuManagement.vue')
                },
                {
                    path: '/role-authorization',
                    name: 'role-authorization',
                    meta:{
                        name: '角色授权'
                    },
                    component: () => import('./views/SystemManagement/RoleAuthorization.vue')
                },
                {
                    path: '/know-management',
                    name: 'know',
                    meta:{
                        name: '知识体系管理'
                    },
                    component: () => import('./views/SystemManagement/KnowManagement.vue')
                },
                {
                    path: '/mechanism-management',
                    name: 'mechanism-management',
                    meta:{
                        name: '机构管理'
                    },
                    component: () => import('./views/SystemManagement/MechanismManagement.vue')
                },
                {
                    path: '/parameter-management',
                    name: 'parameter-management',
                    meta:{
                        name: '参数管理'
                    },
                    component: () => import('./views/SystemManagement/ParameterManagement.vue')
                },
                {
                    path: '/lecturer-management',
                    name: 'lecturer-management',
                    meta: {
                        name: '讲师管理'
                    },
                    component: () => import('./views/ResourceManagement/LecturerManagement.vue')
                },
                {
                    path: '/lecturer-management-detail',
                    name: 'lecturer-management-detail',
                    // meta: {
                    //     name: '讲师详情'
                    // },
                    component: () => import('./views/ResourceManagement/LecturerManagementDetail.vue'),
                },
                {
                    path: '/teacher-management',
                    name: 'teacher-management',
                    meta: {
                        name: '班主任管理'
                    },
                    component: () => import('./views/ResourceManagement/TeacherManagement.vue')
                },
                {
                    path: '/teacher-management-detail',
                    name: 'teacher-management-detail',
                    // meta: {
                    //     name: '班主任详情'
                    // },
                    component: () => import('./views/ResourceManagement/TeacherManagementDetail.vue'),
                },
                {
                    path: '/demo',
                    name: 'demo',
                    meta:{
                        name: 'demo'
                    },
                    component: () => import('./views/demo/Demo.vue'),
                },
                {
                    path: '/upload',
                    name: 'upload',
                    meta:{
                        name: 'upload'
                    },
                    component: () => import('./views/demo/upload.vue'),
                },
                {
                    path: '/student',
                    name: 'student',
                    meta:{
                        name: '学员信息管理'
                    },
                    component: () => import('./views/StudentManagement/StudentManagement.vue'),
                },
                {
                    path: '/add-student',
                    name: 'add-student',
                    component: () => import('./views/StudentManagement/AddStudent.vue'),
                },
                {
                    path: '/edit-student',
                    name: 'edit-student',
                    component: () => import('./views/StudentManagement/AddStudent.vue'),
                },
                {
                    path: '/student-detail',
                    name: 'student-detail',

                    component: () => import('./views/StudentManagement/StudentDetail.vue'),
                },
                {
                    path: '/classroom',
                    name: 'classroom',
                    meta:{
                        name: '教室管理'
                    },
                    component: () => import('./views/ResourceManagement/ClassRoomManagement.vue'),
                },
                {
                    path: '/classroom-detail',
                    name: 'classroom-detail',

                    component: () => import('./views/ResourceManagement/ClassRoomDetail.vue'),
                },
                {
                    path: '/media',
                    name: 'media',
                    meta:{
                        name: '多媒体资源管理'
                    },
                    component: () => import('./views/ResourceManagement/MediaManagement.vue'),
                },
                {
                    path: '/media-detail',
                    name: 'media-detail',
                    component: () => import('./views/ResourceManagement/MediaDetail.vue'),
                },

                {
                    path: '/class-open-plan',
                    name: 'class-open-plan',
                    meta:{
                        name: '开班计划管理'
                    },
                    component: () => import('./views/ClassOpenPlan/ClassOpenPlan.vue'),
                },
                {
                    path: '/class-open-plan-detail',
                    name: 'class-open-plan-detail',
                    component: () => import('./views/ClassOpenPlan/ClassOpenPlanDetail.vue'),
                },
                {
                    path: '/map-statistics',
                    name: 'map-statistics',
                    meta:{
                        name: '教学地图统计'
                    },
                    component: () => import('./views/MapStatistics/MapStatistics.vue'),
                },
                {
                    path: '/map-management',
                    name: 'map-management',
                    meta:{
                        name: '教学地图管理'
                    },
                    component: () => import('./views/MapManagement/MapManagement.vue'),
                },
                {
                    path: '/map-detail',
                    name: 'map-detail',

                    component: () => import('./views/MapManagement/MapDetail.vue'),
                },
                {
                    path: '/add-map',
                    name: 'add-map',

                    component: () => import('./views/MapManagement/AddMap.vue'),
                },
                {
                    path: '/question-management',
                    name: 'question-management',
                    meta:{
                        name: '题库管理'
                    },
                    component: () => import('./views/ResourceManagement/QuestionBankManagement.vue'),
                },
                {
                    path: '/question-detail',
                    name: 'question-detail',

                    component: () => import('./views/ResourceManagement/QuestionBankDetail.vue'),
                },
                {
                    path: '/question-operation',
                    name: 'question-operation',

                    component: () => import('./views/ResourceManagement/QuestionBankOperation.vue'),
                },
                {
                    path: '/paper-management',
                    name: 'paper-management',
                    meta:{
                        name: '试卷管理'
                    },
                    component: () => import('./views/ResourceManagement/PaperManagement.vue'),
                },
                {
                    path: '/paper-detail',
                    name: 'paper-detail',

                    component: () => import('./views/ResourceManagement/PaperDetail.vue'),
                },
                {
                    path: '/paper-operation',
                    name: 'paper-operation',

                    component: () => import('./views/ResourceManagement/PaperOperation.vue'),
                },
                {
                    path: '/map-statistics-detail',
                    name: 'map-statistics-detail',
                    component: () => import('./views/MapStatistics/MapStatisticsDetail.vue'),
                },
                {
                    path: '/test-stat',
                    name: 'test-stat',
                    component: () => import('./views/MapStatistics/TestStat.vue'),
                },
                {
                    path: '/test-stat-detail',
                    name: 'test-stat-detail',
                    component: () => import('./views/MapStatistics/TestStatDetail.vue'),
                },
                {
                    path: '/assessment-stat',
                    name: 'assessment-stat',
                    component: () => import('./views/MapStatistics/AssessmentStat.vue'),
                },
                {
                    path: '/assessment-stat-detail',
                    name: 'assessment-stat-detail',
                    component: () => import('./views/MapStatistics/AssessmentStatDetail.vue'),
                },
                {
                    path: '/library-management',
                    name: 'library-management',
                    meta:{
                        name: '文库管理'
                    },
                    component: () => import('./views/LibraryManagement/LibraryManagement.vue'),
                },
                {
                    path: '/library-management-detail',
                    name: 'library-management-detail',
                    component: () => import('./views/LibraryManagement/LibraryManagementDetail.vue'),
                },
                {
                    path: '/examination-control',
                    name: 'examination-control',
                    meta:{
                        name: '考试监控'
                    },
                    component: () => import('./views/OnlineExamination/ExaminationControl.vue'),
                },
                {
                    path: '/examination-control-info',
                    name: 'examination-control-info',
                    // meta:{
                    //     name: '考试监控'
                    // },
                    component: () => import('./views/OnlineExamination/ExaminationControlInfo.vue'),
                },
                {
                    path: '/examination-monitor-detail',
                    name: 'examination-monitor-detail',
                    // meta:{
                    //     name: '监控查看'
                    // },
                    component: () => import('./views/OnlineExamination/ExaminationMonitorDetail.vue'),
                },
                {
                    path: '/examination-paper-detail',
                    name: 'examination-paper-detail',
                    // meta:{
                    //     name: '试卷查看'
                    // },
                    component: () => import('./views/OnlineExamination/ExaminationPaperDetail.vue'),
                },
                {
                    path: '/examination-paper-marking',
                    name: 'examination-paper-marking',
                    meta:{
                        name: '试卷阅卷'
                    },
                    component: () => import('./views/OnlineExamination/ExaminationPaperMarking.vue'),
                },
                {
                    path: '/marking-by-item',
                    name: 'marking-by-item',
                    component: () => import('./views/OnlineExamination/MarkingByItem.vue'),
                },
                {
                    path: '/marking-by-people',
                    name: 'marking-by-people',
                    component: () => import('./views/OnlineExamination/MarkingByPeople.vue'),
                },
                {
                    path: '/marking-item',
                    name: 'marking-item',
                    component: () => import('./views/OnlineExamination/MarkingItem.vue'),
                },
                {
                    path: '/marking-people',
                    name: 'marking-people',
                    component: () => import('./views/OnlineExamination/MarkingPeople.vue'),
                },
                {
                    path: '/course-management',
                    name: 'course-management',
                    meta:{
                        name: '课程管理'
                    },
                    component: () => import('./views/CourseManagement/CourseManagement.vue'),
                },
                {
                    path: '/add-course',
                    name: 'add-course',
                    component: () => import('./views/CourseManagement/AddCourse.vue'),
                },
                {
                    path: '/detail-course',
                    name: 'detail-course',
                    component: () => import('./views/CourseManagement/DetailCourse.vue'),
                },
                {
                    path: '/add-user',
                    name: 'add-user',
                    meta:{
                        name: '添加用户'
                    },
                    component: () => import('./views/demo/addUser.vue'),
                },
                {
                    path: '/training-plan-management',
                    name: 'training-plan-management',
                    meta:{
                        name: '培训计划管理'
                    },
                    component: () => import('./views/TrainingPlanManagement/TrainingPlanManagement.vue')
                },
                {
                    path: '/add-plan',
                    name: 'add-plan',
                    meta:{
                        name: '新增计划'
                    },
                    redirect: {
                        name: 'essential-information'
                    },
                    component: () => import('./views/TrainingPlanManagement/AddPlan.vue'),
                    children:[
                        {
                            path: '/essential-information',
                            name: 'essential-information',
                            component: () => import('./views/TrainingPlanManagement/EssentialInformation.vue'),
                        },
                        {
                            path: '/participants',
                            name: 'participants',
                            component: () => import('./views/TrainingPlanManagement/Participants.vue'),
                        },
                        {
                            path: '/planning-activities-course',
                            name: 'planActCourse',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Course.vue')
                        },{
                            path: '/planning-activities-assess',
                            name: 'planActAssess',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Assess.vue')
                        },{
                            path: '/planning-activities-exam',
                            name: 'planActExam',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Exam.vue')
                        },{
                            path: '/planning-activities-notice',
                            name: 'planActNotice',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Notice.vue')
                        },{
                            path: '/planning-activities-servey',
                            name: 'planActServey',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Servey.vue')
                        },{
                            path: '/planning-activities-sign',
                            name: 'planActSign',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Sign.vue')
                        },{
                            path: '/planning-activities-train',
                            name: 'planActTrain',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Train.vue')
                        },{
                            path: '/planning-activities-card',
                            name: 'planActCard',
                            component: () => import('./views/TrainingPlanManagement/planActivity/Card.vue')
                        },
                    ]
                },
                {
                    path: '/train-step',
                    name: 'train-step',
                    meta:{
                        name: '环节管理'
                    },
                    component: () => import('./views/TrainManagement/Step')
                },
                {
                    path: '/train-dialogue',
                    name: 'train-dialogue',
                    meta:{
                        name: '对话管理'
                    },
                    component: () => import('./views/TrainManagement/Dialogue')
                },
                {
                    path: '/train-knowledge',
                    name: 'train-knowledge',
                    meta:{
                        name: '知识库管理'
                    },
                    component: () => import('./views/TrainManagement/Knowledge')
                },
                {
                    path: '/train-scene',
                    name: 'train-scene',
                    meta:{
                        name: '场景管理'
                    },
                    component: () => import('./views/TrainManagement/Scene')
                },
                {
                    path: '/train-param',
                    name: 'train-param',
                    meta:{
                        name: '参数管理'
                    },
                    component: () => import('./views/TrainManagement/Param')
                },
                {
                    path: '/editor',
                    name: 'editor',
                    component: () => import('./views/demo/Editor.vue')
                },
                {
                    path: '/editor-show',
                    name: 'editor-show',
                    component: () => import('./views/demo/EditorShow.vue')
                },
                {
                    path: '/to-pdf',
                    name: 'to-pdf',
                    component: () => import('./views/demo/toPdf.vue')
                },
                {
                    path: '/class-select',
                    name: 'class-select',
                    component: () => import('./views/demo/ClassSelect.vue')
                },
                {
                    path: '/classappoint',
                    name: 'classappoint',
                    meta:{
                        name: '教室预约'
                    },
                    component: () => import('./views/ResourceManagement/ClassRoomAppoint.vue'),
                },
            ],
        },
        {
            path: '/flowchart',
            name: 'flowchart',
            meta:{
                name: '查看流程图'
            },
            component: () => import('./views/TrainManagement/FlowChart'),
        },
        {
            path: '*',
            component: () => import('./views/Error.vue')
        }
    ]
});
//当路由开始跳转时
router.beforeEach((to, from , next) => {
    NProgress.start();// 开启进度条
    if (getToken()){
        getMenuList().then(() => {
            next();
        });
    }else {
        checkToken().then(()=>{
            next();
        })
    }
});
//当路由跳转结束后
router.afterEach((to) => {
    NProgress.done();// 关闭进度条
    let tags = store.state.tags,
        paths = to.path,
        names = to.meta.name,
        flag = false;
    tags.forEach(function(el){
        if(el.title == names){
            flag = true;
        }
    });
    if(!flag && names && paths){
        tags.push({
            title: names, // 名称
            index: paths // 路由地址
        })
    }
    store.commit('changeTags',tags);
});
export default router
