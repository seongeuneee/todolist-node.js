// Open the edit popup
function openEditPopup(id, content) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-content').value = content;
  document.getElementById('edit-form').action = '/todo/update/' + id;
  document.getElementById('editPopup').style.display = 'block';
}

// Close the edit popup
function closeEditPopup() {
  document.getElementById('editPopup').style.display = 'none';
}

// 검색 기능 구현
function searchTodo() {
  var input, filter, ul, li, todoItem, i, txtValue;
  input = document.getElementById('search-input');
  filter = input.value.toUpperCase();
  ul = document.getElementById('list-box');
  li = ul.getElementsByClassName('todo-item');
  dateItem = ul.getElementsByClassName('date');

  // 각 todo-item을 순회하며 검색어와 일치하는지 확인
  for (i = 0; i < li.length; i++) {
    todoItem = li[i].getElementsByClassName('todo-item-content')[0];
    txtValue = todoItem.textContent || todoItem.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  } //날짜 지우기
  for (i = 0; i < dateItem.length; i++) {
    dateItem[i].style.display = 'none';
  }
}

//드래그앤드롭
// 드래그 중인 요소를 저장할 변수
let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this; // 드래그 중인 요소 저장
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML); // 드래그 중인 요소의 HTML을 저장
  this.classList.add('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // 이 이벤트를 활성화하면 드롭이 가능
  }
  this.classList.add('over'); // 드래그 중인 요소 위에 있는 동안 CSS 적용
  e.dataTransfer.dropEffect = 'move'; // 드롭 효과
  return false;
}

function handleDragLeave(e) {
  this.classList.remove('over'); // 드래그 중인 요소가 떠나면 CSS 제거
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // 기본 동작 중지
  }

  // 드래그한 요소가 자기 자신이 아닐 경우에만 실행
  if (dragSrcEl != this) {
    // 현재 드롭된 요소의 HTML을 드래그한 요소의 위치로 바꿈
    this.parentNode.removeChild(dragSrcEl);
    const dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin', dropHTML);

    // 새로 삽입된 요소에 드래그 이벤트 리스너를 다시 연결
    const newItem = this.previousSibling;
    addDragAndDropHandlers(newItem);
  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('over');
  this.classList.remove('dragging');
}

function addDragAndDropHandlers(item) {
  item.addEventListener('dragstart', handleDragStart, false);
  item.addEventListener('dragover', handleDragOver, false);
  item.addEventListener('dragleave', handleDragLeave, false);
  item.addEventListener('drop', handleDrop, false);
  item.addEventListener('dragend', handleDragEnd, false);
}

// 페이지 로드 시 모든 todo-item에 드래그 앤 드롭 핸들러 추가
const items = document.querySelectorAll('.todo-item');
items.forEach(function (item) {
  addDragAndDropHandlers(item);
});

// 순서 저장 함수
function saveNewOrder() {
  const items = document.querySelectorAll('.todo-item');
  let order = [];

  items.forEach((item, index) => {
    order.push({
      id: item.getAttribute('data-id'),
      position: index + 1,
    });
  });

  fetch('/todo/saveOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order: order }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log('Order saved successfully');
      } else {
        console.error('Failed to save order');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//체크박스 클릭 이벤트
function complete(checkbox) {
  const todoItem = checkbox.closest('.todo-item');

  if (checkbox.checked) {
    todoItem.classList.add('completed');
  } else {
    todoItem.classList.remove('completed');
  }
}
