var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var settings = require('../settings');
var userSchema = new Schema({
  name: String,
  password: String
});

// User model
var UserModel = mongoose.model('user', userSchema);

var User = function(user) {
  this.name = user.name;
  this.password = user.password;
};

User.prototype.save = function(callback) {
  var user = {
    name: this.name,
    password: this.password
  };

  mongoose.connect('mongodb://localhost/account-system', function(err) {
    if (err) {
      return callback(err);
    }

    findUser(user.name, function(err, doc) {
      if (doc) {
        err = '该用户名已存在,请更换用户名';
        closeConnect();
        return callback(err);
      }
      //if (err) {
      //  closeConnect();
      //  return callback(err);
      //}

      UserModel.create(user, function (err) {
        closeConnect();
        console.log('Error: ' + err);
        return callback(err, user);
      });
    });
  });
};

function findUser(username, callback) {
  UserModel.findOne({ name: username}, function(err, doc) {
    if (doc) {
      var user = new User(doc);
      return callback(err, user);
    } else {
      return callback(err, null);
    }
  });
};

User.getUser = function (username, callback) {
  mongoose.connect('mongodb://localhost/account-system', function(err) {
    if (err) {
      return callback(err);
    }

    UserModel.findOne({ name: username}, function(err, doc) {
      closeConnect();

      if (doc) {
        var user = new User(doc);
        return callback(err, user);
      } else {
        return callback(err, null);
      }
    });
  });
};

function closeConnect() {
  mongoose.connection.close();
};

module.exports = User;