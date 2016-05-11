var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var settings = require('../settings');
var recordSchema = new Schema({
  _id: ObjectId,          // ID
  username: String,           // 用户
  recordDate: Date,       // 记账日期
  recordType: String,     // 类型: 支出, 收入
  recordItem: String,     // 记账科目
  recordAmount: Number,   // 金额
  recordComment: String   // 备注
});

var RecordModel = mongoose.model('record', recordSchema);

var Record = function (record) {
  this._id = record._id;
  this.username = record.username;
  this.recordType = record.recordType;
  this.recordItem = record.recordItem;
  this.recordAmount = record.recordAmount;
  this.recordComment = record.recordComment;

  if (record.recordDate) {
    this.recordDate = record.recordDate;
  } else {
    this.recordDate = new Date();
  }
};

Record.prototype.save = function(callback) {
  var record = {
    _id: this._id,
    username: this.username,          // 用户
    recordDate: this.recordDate,      // 记账日期
    recordType: this.recordType,      // 类型: 支出, 收入
    recordItem: this.recordItem,      // 记账科目
    recordAmount: this.recordAmount,  // 金额
    recordComment: this.recordComment // 备注
  };

  mongoose.connect("mongodb://localhost/account-system", function(err) {
    if (err) {
      return callback(err);
    }

    if (record._id == null) {
      // 插入新纪录
      delete record._id;
      RecordModel.create(record, function (err) {
        closeConnect();
        return callback(err, record);
      });
    } else {
      // 更新记录
      RecordModel.findOneAndUpdate({_id: this._id}, record, function(err) {
        return callback(err, record);
      })
    }
  });
};

Record.query = function(username, options, callback) {
  //mongoose.connect("mongodb://localhost/account-system", function(err) {
  //  if (err) {
  //    return callback(err);
  //  }
  //
  //
  //});
};

function closeConnect() {
  mongoose.connection.close();
  console.log('Close mongodb connect');
};

module.exports = Record;