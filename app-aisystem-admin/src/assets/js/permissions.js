export async function PERMISSION() {
    let permissions = JSON.parse(sessionStorage.getItem('permissions'));
    let PERMISSION_LIST = {

        // 试卷
        PAPER: {
            ADD: permissions.includes('2a59e2c7'),
            EDIT: permissions.includes('342ad6d9'),
            DELETE: permissions.includes('6bc601fc'),
            ENABLE: permissions.includes('dc8df804'),
            DISABLED: permissions.includes('f40d6e54'),

        },

        // 题库
        QUESTION: {
            ADD: permissions.includes('30ea85fa'),
            EDIT: permissions.includes('6a66c11d'),
            DELETE: permissions.includes('22811c20'),
            ENABLE: permissions.includes('65d30c0a'),
            DISABLED: permissions.includes('4eef5e58'),
            IMPORT: permissions.includes('37e91098'),
            EXPORT: permissions.includes('807b3cc2'),

        },

        // 学员
        STUDENT: {
            ADD: permissions.includes('0986fa72'),
            EDIT: permissions.includes('eb210868'),
            DELETE: permissions.includes('fb7f5e12'),
            ENABLE: permissions.includes('bfe59c64'),
            DISABLED: permissions.includes('25003465'),
            APPROVE: permissions.includes('0d76d715'),
            IMPORT : permissions.includes('1bb102dc'),
            TEMPLATE : permissions.includes('7dfbe76b'),

        },

        // 教室
        ROOM: {
            ADD: permissions.includes('bd6dd9ad'),
            EDIT: permissions.includes('13fc676e'),
            DELETE: permissions.includes('dbbe8fe5'),
            ENABLE: permissions.includes('9e007998'),
            DISABLED: permissions.includes('14c57b33'),

        },

        // 多媒体资源
        MEDIA: {
            ADD: permissions.includes('fbcb401d'),
            EDIT: permissions.includes('a35ae3ac'),
            DELETE: permissions.includes('b69f3541'),
            ENABLE: permissions.includes('66b17d3e'),
            DISABLED: permissions.includes('dba44373'),

        },

        // 教学地图管理
        MAP: {
            ADD: permissions.includes('24db9878'),
            EDIT: permissions.includes('d826caaf'),
            DELETE: permissions.includes('8f51b5d1'),
            RELEASE: permissions.includes('d3b53870'),


        },

        // 文库
        LIBRARY: {
            ADD: permissions.includes('c4f91177'),
            EDIT: permissions.includes('fa3a35f0'),
            DELETE: permissions.includes('94038e39'),

        },

        // 开班计划
        CLASSPLAN: {
            ADD: permissions.includes('21b54449'),
            EDIT: permissions.includes('87a7ae15'),
            DELETE: permissions.includes('536e8f32'),
            REPORT: permissions.includes('7450b3ff'),
            EXAMINE: permissions.includes('e151d954'),
        },

        // 试卷阅卷
        MARKING: {
            BYPEOPLE: permissions.includes('0064c80e'),
            BYITEM: permissions.includes('58111e4d'),
            MARKING: permissions.includes('fb529ba1'),
            SAVEEXIT: permissions.includes('e316fd6a'),
            SAVECONTINUE: permissions.includes('29feb034'),
            EXIT: permissions.includes('e28d52eb'),
        },

        // 讲师
        LECTURER: {
            ADD: permissions.includes('5708092d'),
            EDIT: permissions.includes('85978e6a'),
            DELETE: permissions.includes('2b95710f'),
            REVERT: permissions.includes('a3ab53c9'),
            LEAVE: permissions.includes('25a12014'),
            ENTRY: permissions.includes('21c53bd2'),
            AUTH: permissions.includes('2f4c1949'),
            UNAUTH: permissions.includes('2f55dd88'),
        },

        // 班主任
        TEACHER: {
            ADD: permissions.includes('c235785c'),
            EDIT: permissions.includes('db0acc40'),
            DELETE: permissions.includes('988d1497'),
            REVERT: permissions.includes('6b9248c7'),
            LEAVE: permissions.includes('c4132b17'),
            ENTRY: permissions.includes('ec5c7cb3'),
        },

        // 考试监控
        MONITOR: {
            KSJK: permissions.includes('9ef081e4'),
            QZJJ: permissions.includes('42f65d85'),
            JKCK: permissions.includes('da0b6825'),
            SJCK: permissions.includes('29af18af'),
        },

    };

    return PERMISSION_LIST;



}





