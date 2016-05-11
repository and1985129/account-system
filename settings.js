module.exports = {
  appName: "记账管理系统",
  cookieSecret: "accountbyke",
  db: "account-system",
  host: "localhost",
  port: 3000,
  dbDevURL: "mongodb://localhost/" + this.db,
  mongodbProdURL: "" + this.db
};