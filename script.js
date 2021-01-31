const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Array Names
const arrayNames = ['backlog', 'progress','complete','onHold'];


function initializedKanban() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray =  JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
  updateKanban(); 
}

function resetKanban(){
  backlogList.textContent = '';
  progressList.textContent = '';
  completeList.textContent = '';
  onHoldList.textContent = '';

  //Remove Empty Inputs
  backlogListArray = backlogListArray.filter(item => item !== null);
  progressListArray = progressListArray.filter(item => item !== null);
  completeListArray = completeListArray.filter(item => item !== null);
  onHoldListArray = onHoldListArray.filter(item => item !== null);
}

function updateLocalStorage() {
  listArrays = [backlogListArray,progressListArray,completeListArray,onHoldListArray];
  arrayNames.forEach((arrayName,index) => {
    localStorage.setItem(`${arrayName}Items`,JSON.stringify(listArrays[index]));
  });
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateTasks(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

function updateKanban() {
  resetKanban();
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList,0,backlogItem,index);
  });
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList,1,progressItem,index);
  });
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList,2,completeItem,index);
  });
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList,3,onHoldItem,index);
  });
  updateLocalStorage();
}

function updateTasks(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateKanban();
  }
}

function addTask(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateKanban();
}

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addTask(column);
}

function rebuildKanban(){
  backlogListArray =  Array.from(backlogList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);
  updateKanban();
}

// When items starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for the Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// When item Enters column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping Item in Column
function drop(e){
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((columns) => {
    columns.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildKanban();
}

// On Load
initializedKanban();

