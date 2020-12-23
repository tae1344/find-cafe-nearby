// process.env.NODE_ENV => 환경변수
// local환경 or 배포 후 환경에 따라 값이 다름
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}