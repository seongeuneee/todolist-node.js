//Model
const TodoTask = require('../models/todoTask');

//KST Setting
var moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 첫 페이지
exports.get = async function (req, res) {
  console.log('-------!!Todo!!-------');
  try {
    const tasks = await TodoTask.find({}).sort({ date: -1 }).exec();
    res.render('todo', { todoTasks: tasks, idTask: null }); // idTask를 null로 초기화
  } catch (err) {
    console.error('==== Fail!! Fetch TodoTasks ====');
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//작성
exports.write = async function (req, res) {
  try {
    const todoTask = new TodoTask({
      content: req.body.content,
      position: req.body.position || 0,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    await todoTask.save();
    console.log('==== Success!! Save New TodoTask ====');
    console.table([
      {
        id: todoTask._id,
        content: todoTask.content,
        date: todoTask.date,
        position: todoTask.position,
      },
    ]);
    res.redirect('/todo');
  } catch (err) {
    console.error('==== Fail!! Save TodoTask ====');
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 편집 //미사용?
exports.edit = async function (req, res) {
  const id = req.params.id;
  try {
    const tasks = await TodoTask.find({}).sort({ date: -1 }).exec();
    res.render('todo-edit', { todoTasks: tasks, idTask: id }); // idTask를 편집할 할 일의 ID로 설정
  } catch (err) {
    console.error('==== Fail!! Fetch TodoTasks for Edit ====');
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 수정
exports.update = async function (req, res) {
  const id = req.params.id;
  const newContent = req.body.content;

  try {
    // ID 유효성 검사
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send('Invalid ID format');
    }

    const todo = await TodoTask.findByIdAndUpdate(id, { content: newContent });

    if (!todo) {
      console.log('TodoTask not found, ID:', id);
      return res.status(404).send('TodoTask not found');
    }

    console.log('==== Success!! Update TodoTask ====');
    console.log('id: ' + id);
    res.redirect('/todo');
  } catch (err) {
    console.error('==== Fail!! Update TodoTask ====');
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//삭제
exports.remove = async function (req, res) {
  const id = req.params.id;
  console.log('Attempting to remove TodoTask with ID:', id);
  try {
    const todo = await TodoTask.findByIdAndDelete(id);
    if (!todo) {
      console.log('TodoTask not found for ID:', id);
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
