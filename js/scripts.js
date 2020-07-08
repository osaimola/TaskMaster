const inputField = document.getElementById("newtaskfield");
const submitButton = document.getElementById("submittask");
const pendingToDoList = document.querySelector("body>.pending-todo>ul");
const activeToDoList = document.querySelector("body>.active-todo>ul");
const completedToDoList = document.querySelector("body>.completed-todo>ul");
// dictionary will store {"todo item" : [start time, end time, last edited time]}
const todos = {};

// APPENDING A CHILD THAT EXISTS UNDER ONE PARENT TO ANOTHER PARENT SHOULD MOVE IT TO THe NEW PARENT

submitButton.addEventListener("click", addPendingToDo);

// GEt user input from the new task form and create a new Pending to do
function addPendingToDo(event) {
  event.preventDefault();

  let userInput = inputField.value.trim();
  // TODO : check if input exists in todos and prevent duplicate items from being added
  if (userInput === "") {
    // TODO : provide visual feedback about bad input
    return;
  }

  inputField.value = null;

  let pendingTaskContent = document.createElement("p");
  pendingTaskContent.innerText = userInput;

  let startTaskButton = document.createElement("button");
  startTaskButton.addEventListener("click", () => {
    createToDo(event, userInput);
  });
  startTaskButton.innerText = "Start Task";

  let newPendingItem = document.createElement("li");
  newPendingItem.appendChild(pendingTaskContent);
  newPendingItem.appendChild(startTaskButton);

  pendingToDoList.appendChild(newPendingItem);
}

// Get user input from the new task form and create a new TO DO ITEM
function createToDo(event, userInput) {
  todos[userInput] = [new Date()];

  // create a new list item
  let newItem = document.createElement("li");
  newItem.setAttribute("id", userInput);

  // create a checklist for this item
  let newInput = document.createElement("input");
  newInput.setAttribute("type", "checkbox");
  newInput.setAttribute("name", userInput);
  newInput.setAttribute("value", userInput);
  let newLabel = document.createElement("label");
  newLabel.setAttribute("for", userInput);
  newLabel.innerHTML = userInput;

  // create additional info elements
  let newStartTime = document.createElement("p");
  newStartTime.innerText = todos[userInput][0].toLocaleString();
  let lineBreak = document.createElement("br");

  // add the checlist to the created item
  newItem.appendChild(newInput);
  newItem.appendChild(newLabel);
  newItem.appendChild(lineBreak);
  newItem.appendChild(newStartTime);

  newItem.addEventListener("click", () => {
    completeToDo(event, newItem);
  });

  // add child to the active to dos
  activeToDoList.appendChild(newItem);
}

function completeToDo(event, element) {
  event.preventDefault();

  // add the todo completed time.
  let toDoStarted = todos[element.getAttribute("id")][0];
  let toDoEnded = new Date();
  todos[element.getAttribute("id")][1] = toDoEnded;

  let newEndTime = document.createElement("p");
  newEndTime.innerText = toDoEnded.toLocaleString();

  completedToDoList.appendChild(element);
  element.appendChild(newEndTime);
}
