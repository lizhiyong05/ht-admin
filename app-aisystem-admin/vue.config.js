console.log('当前环境：'+process.env.VUE_APP_BRANCH_ENV);
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
    outputDir: 'dist',
    publicPath: './',
    productionSourceMap: false,
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({
                bypassOnDebug: true
            })
            .end()
    },
    configureWebpack: () => {
        if(process.env.NODE_ENV !== 'development'){
            // return {
            //     plugins: [
            //         new CompressionPlugin({
            //             test: /\.(js|css)(\?.*)?$/i,
            //             threshold: 10240,
            //             deleteOriginalAssets: false
            //         })
            //     ]
            // }
        }
    },
    devServer:{
        port: 8088,
        open: true,
        proxy:{
            '/materialMgr':{ // 小白
                target: 'http://10.3.20.235:8701',
                changeOrigin: true,
                ws: true,
            },
            '/case':{  // 上传
                target: 'http://172.18.3.47:8111',
                changeOrigin: true,
                ws: true
            },
            '/educateMgr':{ // 佳鑫
                // target: 'http://10.3.20.235:8203', // 小白
                target: 'http://10.3.20.115:8703', // 佳鑫
                changeOrigin: true,
                ws: true,
            },
            // '/systemMgr/user/menuTree':{
            //     target: 'http://10.66.254.172:2880/tntSrv',
            //     changeOrigin: true,
            //     ws: true,
            // },
            '/systemMgr':{ // 杰斌     http://10.3.20.207:8702/systemMgr/org/list
                target: 'http://10.3.20.207:8702',
                changeOrigin: true,
                ws: true,
            },
            '/resourceMgr':{ // 杰斌 晓伟
                target: 'http://10.3.20.207:8705',
                // target: 'http://10.3.20.235:8705',
                changeOrigin: true,
                ws: true,
            },
            '/examMgr':{ //
                target: 'http://10.3.20.115:8709',
                changeOrigin: true,
                ws: true,
            },
            '/facadeEntry': {//小白 登陆注册验证码等个人账户信息
                target: 'http://10.3.20.235:8704',
                ws: true,
                changeOrigin: true,
            },
            '/trainMgr': {//继军
                target: 'http://10.3.20.60:8710',
                ws: true,
                changeOrigin: true,
            },

        },
        before(app){
            app.get('/tntSrv/contextInit', (req,res) => {
                res.set('Content-Type', 'application/javascript');
                res.send('if (typeof ht == \'undefined\') ht = {};\n' +
                    'ht.config = ht.config || {};\n' +
                    'ht.config.sso_host = \'http://localhost:8088\';')
            });
            app.post('/checkToken', function(req, res) {
                var tokenObj = {
                    token:'r0worq098oirjqwoerpwjfsf',
                    userId:'518918c5c6164283'
                };
                var result = {
                    code: '1000',
                    data: JSON.stringify(tokenObj)
                };
                res.json(result);
            });
        }
    }
};
