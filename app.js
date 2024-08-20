// Import Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Server Setting - View, Static Files, Body Parser
app.set('view engine', 'ejs'); //express 서버에서 jsp처럼 쓰는 ejs파일을 뷰 엔진으로 설정
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router Setting
const router = require('./routes/index');
exports.remove = async function (req, res) {
  const id = req.params.id;
  try {
    // ID 유효성 검사
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      // MongoDB ObjectId 형식 검사
      return res.status(400).send('Invalid ID format');
    }

    const todo = await TodoTask.findByIdAndRemove(id);

    if (!todo) {
      console.log('TodoTask not found, ID:', id);
      return res.status(404).send('TodoTask not found');
    }

    console.log('==== Success!! Remove TodoTask ====');
    console.log('id: ' + id);
    res.redirect('/todo');
  } catch (err) {
    console.error('==== Fail!! Remove TodoTask ====');
    console.error(err);
    res.status(500).send('Server Error');
  }
};
app.use(router);

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/node');
    console.log('mongoDB Connected!');

    // Server Open
    app.listen(9000, () => {
      console.log('Server listening on port 9000!');
      console.log('http://localhost:9000/todo');
    });
  } catch (err) {
    console.error('mongoDB Connection Error!', err);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

connectDB();
