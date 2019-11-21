

// 服务名
const temServiceMetBXW = '/materialMgr';
const temServicesSysDJB = '/systemMgr';
const temServicesResDJB = '/resourceMgr';
const temServicesEduBXW = '/educateMgr';
const temServicesExamHF = '/examMgr';
const temServicesAcctMNG = '/facadeEntry';


let API = {

    // 多媒体资源
    MEDIA_LIST: temServiceMetBXW + '/media/list',
    MEDIA_ADD: temServiceMetBXW + '/media/create',
    MEDIA_EDIT: temServiceMetBXW + '/media/alter',
    MEDIA_ENABLE: temServiceMetBXW + '/media/start',
    MEDIA_DISABLE: temServiceMetBXW + '/media/stop',
    MEDIA_DETAIL: temServiceMetBXW + '/media/info',
    MEDIA_DELETE: temServiceMetBXW + '/media/delete',


    // 学员
    STUDENT_LIST: temServicesResDJB + '/student/list',
    STUDENT_ADD: temServicesResDJB + '/student/create',
    STUDENT_EDIT: temServicesResDJB + '/student/alter',
    STUDENT_ENTRY: temServicesResDJB + '/student/entry',
    STUDENT_FIRE: temServicesResDJB + '/student/leave',
    STUDENT_DETAIL: temServicesResDJB + '/student/info',
    STUDENT_DELETE: temServicesResDJB + '/student/delete',

    // 教室
    ROOM_LIST: temServicesResDJB + '/room/list',
    ROOM_ADD: temServicesResDJB + '/room/create',
    ROOM_EDIT: temServicesResDJB + '/room/alter',
    ROOM_ENABLE: temServicesResDJB + '/room/permit',
    ROOM_DISABLE: temServicesResDJB + '/room/forbid',
    ROOM_DETAIL: temServicesResDJB + '/room/info',
    ROOM_DELETE: temServicesResDJB + '/room/delete', //无删除

    //教室预约
    APPOINT_INFO: temServicesResDJB + '/room/getRoomUsed',
    APPOINT_ADD: temServicesResDJB + '/room/createRoomUsed',

    // 教学地图管理
    // 调试临时用
    // MAP_LIST:  '/emap/list',
    // MAP_ADD:  '/emap/create',
    // MAP_EDIT:  '/emap/alter',
    // MAP_RELEASE:  '/emap/submit',
    // MAP_DETAIL:  '/emap/info',
    // MAP_DELETE:  '/emap/delete', //无删除

    // 教学地图管理
    MAP_LIST: temServicesEduBXW + '/emap/list',
    MAP_ADD: temServicesEduBXW + '/emap/create',
    MAP_EDIT: temServicesEduBXW + '/emap/alter',
    MAP_RELEASE: temServicesEduBXW + '/emap/submit',
    MAP_DETAIL: temServicesEduBXW + '/emap/info',
    MAP_DELETE: temServicesEduBXW + '/emap/del', //无删除


    // 课程
    COURSE_LIST: temServicesEduBXW + '/course/list',
    COURSE_ADD: temServicesEduBXW + '/course/create',
    COURSE_EDIT: temServicesEduBXW + '/course/alter',
    COURSE_ENABLE: temServicesEduBXW + '/course/permit',
    COURSE_DISABLE: temServicesEduBXW + '/course/forbid',
    COURSE_DETAIL: temServicesEduBXW + '/course/info',
    COURSE_DELETE: temServicesEduBXW + '/course/delete',

    // 题库
    QUESTION_LIST: temServicesExamHF + '/question/list',
    QUESTION_ADD: temServicesExamHF + '/question/create',
    QUESTION_EDIT: temServicesExamHF + '/question/update',
    QUESTION_IMPORT: temServicesExamHF + '/question/import',
    QUESTION_EXPORT: temServicesExamHF + '/question/export',
    QUESTION_DETAIL: temServicesExamHF + '/question/info',
    QUESTION_DELETE: temServicesExamHF + '/question/delete', // 启用、禁用、删除为一个接口
    QUESTION_CHECK: temServicesExamHF + '/question/updateRight',

    // 试卷
    PAPER_LIST: temServicesExamHF + '/paper/list',
    PAPER_ADD: temServicesExamHF + '/paper/create',
    PAPER_EDIT: temServicesExamHF + '/paper/update',
    PAPER_RELEASE: temServicesExamHF + '/paper/updateState', // 启用、停用是一个接口
    PAPER_Q_INFO: temServicesExamHF + '/paper/questionInfo',
    PAPER_Q_LIST: temServicesExamHF + '/paper/questionList',
    PAPER_DETAIL: temServicesExamHF + '/paper/info',
    PAPER_DELETE: temServicesExamHF + '/paper/delete',
    PAPER_CHECK: temServicesExamHF + '/paper/updateRight',

    // 知识体系
    KNOW_LIST: temServicesSysDJB + '/know/list',

    //账号相关（验证码、注册、登陆等）
    SEND_CODE: temServicesAcctMNG + 'facadeEntry/sms/captcha'


};


module.exports = {
    API: API
};
