var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../modules/user');
var Record = require('../modules/record');
/*
 * GET home page.
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: '科科香个人记账系统' });
});

/*
 * GET login page.
 */
router.get('/login', function(req, res, next) {
  res.render('login', {
      title: '用户登录',
      error: req.flash('error-info').toString()
  });
});

/*
 * GET record page.
 */
router.get('/record', function(req, res, next) {
  var username = req.session.user.name;

  Record.query(username, null, function(err, records) {
    if (err) {
      records = [];
    }
    res.render('record', {
      title: '记账',
      user: username,
      records: records,
      success: req.flash('success-info').toString()
    });
  });
});

/*
 * GET logout page.
 */
router.get('/logout', function(req, res, next) {
  res.render('logout', { title: '用户登出'})
});

/*
 * GET register page.
 */
router.get('/reg', function(req, res, next) {
  res.render('reg', {
    title: '注册',
    success: null,
    error: req.flash('error-info').toString()
  })
});

/*
 * GET list page.
 */
router.get('/list', function(req, res, next) {
  var records = [];
  res.render('list', {
    title: '记账详情',
    records: records
  })
});

/*
 * GET stat page.
 */
router.get('/stat', function(req, res, next) {
  var records = [];
  res.render('stat', {
    title: '记账详情',
    records: records
  })
});

/*
 * GET month page.
 */
router.get('/month', function(req, res, next) {
  var records = [];
  res.render('stat', {
    title: '记账详情',
    records: records
  })
});

/*
 * GET error page.
 */
router.get('/error', function(req, res, next) {
  res.render('error', {
    titile: '错误',
    error: req.flash('error-info').toString()
  });
});

/*
 * POST login page
 */
router.post('/login', function(req, res, next) {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('hex');
  var username = req.body.username;

  User.getUser(username, function(err, user) {
    if (!user) {
      req.flash('error-info', '用户不存在');
      return res.redirect('/login');
    }

    if (user.password != password) {
      req.flash('error-info', '密码输入错误');
      return res.redirect('/login');
    }

    req.session.user = user;
    console.log('User: ' + req.session.user.name + req.session.user.password);
    return res.redirect('/record');
  });
});

/*
 * POST register page.
 */
router.post('/reg', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var passwordRepeat = req.body['password-repeat'];
  if (password != passwordRepeat) {
    req.flash('error-info', '用户密码不一致')
    return res.redirect('/reg');
  }

  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');

  var newUser = new User({
    name: username,
    password: password
  });

  newUser.save(function(err, user) {
    if (err) {
      console.log(err);
      req.flash('error-info', err);

      return res.redirect('/reg');
    }

    req.session.user = newUser;
    res.redirect('/record');
  });
});

/*
 * POST record page
 */
// 检查用户是否登陆
router.post('/record', checkLogin);

router.post('/record', function(req, res) {
  var currentUser = req.session.user;
  var record = new Record(req.body);
  record.username = currentUser.name;
  record.save(function(err) {
    if (err) {
      console.log('error: ' + err);
    } else {
      req.flash('success-info', '保存成功');
      res.redirect('record');
    }
  })
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error-info', '用户未登陆, 无法操作');
    res.redirect('/error');
  }

  next();
}

module.exports = router;
