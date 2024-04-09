const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const userRouter = require('./routes/user')
const animeRouter = require('./routes/anime')
const episodeRouter = require('./routes/episode')
const uaRouter = require('./routes/ua')
const ueRouter = require('./routes/ue')
app.use('/user', userRouter)
app.use('/anime', animeRouter)
app.use('/episode', episodeRouter)
app.use('/ua', uaRouter)
app.use('/ue', ueRouter)
// 其他中间件和设置...

const host = '0.0.0.0';
const port = 8088;

// 其他的 Express 中间件和路由设置...

// 启动 Express 服务器...
const server = app.listen(8088,() => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server is running at http://${host}:${port}`);
});
