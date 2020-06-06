
const express = require('express');
const app = express();
const vm = require('vm');
const bodyParser = require('body-parser');
app.use(bodyParser());
app.get('/code/getContent', (req, res) => {
    try {
        const path = require('path');
        const basepath = path.resolve();
        let pwd1 = `${basepath}\\scripts\\${req.query.id}.js`;
        let pwd2 = `${basepath}/scripts/${req.query.id}.js`;
        delete require.cache[pwd1];
        delete require.cache[pwd2];
        global.fun =  require(`./scripts/${req.query.id}`);
    }
    catch (ex) {
        console.log(ex);
        res.send({ "code": -2, "msg": "指定id不存在" });
    }
    try {
        global.obj = JSON.parse(req.query.data);
        global.res = res;
        let vmResult;
        try {
            vmResult = vm.runInThisContext(`res.send({ "code": 0, "msg": "成功", "data": fun.createContent(obj) });`, { timeout: 6000});
        } catch (e) {
            console.log(e);
            res.send({ "code": -4, "msg": "执行失败", "data": e.stack });
            return;
        }
    }
    catch (ex) {
        console.log(ex);
        res.send({ "code": -3, "msg": ex.stack });
    }

});
app.post('/code/getContent', (req, res) => {
    let params = req.body;
    try {
        const path = require('path');
        const basepath = path.resolve();
        let pwd1 = `${basepath}\\scripts\\${params.id}.js`;
        let pwd2 = `${basepath}/scripts/${params.id}.js`;
        delete require.cache[pwd1];
        delete require.cache[pwd2];
        global.fun =  require(`./scripts/${params.id}`);
    }
    catch (ex) {
        console.log(ex);
        res.send({ "code": -2, "msg": "指定id不存在" });
    }
    try {
        global.obj = JSON.parse(params.data);
        global.res = res;
        let vmResult;
        try {
            vmResult = vm.runInThisContext(`res.send({ "code": 0, "msg": "成功", "data": fun.createContent(obj) });`, { timeout: 6000});
        } catch (e) {
            console.log(e);
            res.send({ "code": -4, "msg": "执行失败", "data": e.stack });
            return;
        }
    }
    catch (ex) {
        console.log(ex);
        res.send({ "code": -3, "msg": ex.stack });
    }

});
app.listen(8888);
