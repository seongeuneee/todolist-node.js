//Import modules
const express = require('express');
const app = express();
const router = express.Router();

// Controller 를 불러와서 exports 메소드 사용 (모듈처럼 사용)
const controller = require('../controllers/todo');

// Main
router.get('/', controller.get); // http://localhost:3000/todo/
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
// Write
router.post('/write', controller.write); // http://localhost:3000/todo/write

// Edit
router.get('/edit/:id', controller.edit);

// Update
router.post('/update/:id', controller.update);

// Remove
router.get('/remove/:id', controller.remove);

// DragAndDrop 순서 저장
router.post('/saveOrder/:id', async (req, res) => {
  const order = req.body.order;

  try {
    // 모든 항목에 대해 position 업데이트
    const updatePromises = order.map((item) => {
      return TodoTask.findByIdAndUpdate(item.id, {
        position: item.position,
      }).exec();
    });

    await Promise.all(updatePromises);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating positions:', err);
    res.json({ success: false });
  }
});
//라우터를 export해서 index.js에서 리팩터링해서 관리할 수 있음
module.exports = router;
