/**
 * 默认配置
 * @author HAKU
 */
module.exports = {
  redisConfig: {
    host: "localhost",
    port: "6379",
    password: "2339HAKU",
    db: 2,
  },
  // MySQL 配置
  dbConfig: {
    database: "HAKU",
    username: "root",
    password: "2339HAKU",
    host: "localhost",
    port: 3306,
  },
  // 百度翻译配置，自行申请免费版即可（https://fanyi-api.baidu.com/）
  baiduFanYiConfig: {
    appid: "",
    key: "",
  },
};
