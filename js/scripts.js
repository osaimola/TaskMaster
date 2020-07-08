const inputField = document.getElementById("newtaskfield");
const submitButton = document.getElementById("submittask");
const pendingToDoList = document.querySelector(".pending-todo>ul");
const activeToDoList = document.querySelector(".active-todo>ul");
const completedToDoList = document.querySelector(".completed-todo>ul");
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
  startTaskButton.innerText = "Start Task";

  let newPendingItem = document.createElement("li");
  newPendingItem.appendChild(pendingTaskContent);
  newPendingItem.appendChild(startTaskButton);

  startTaskButton.addEventListener("click", () => {
    startToDo(event, newPendingItem);
  });

  pendingToDoList.appendChild(newPendingItem);
}

// Get user input from the new task form and create a new TO DO ITEM
function startToDo(event, element) {
  let userInput = element.querySelector("p").innerText;
  pendingToDoList.removeChild(element);
  todos[userInput] = [new Date()];

  // create a new wrapper div for this todo item
  let newItem = document.createElement("div");
  newItem.setAttribute("id", userInput);
  newItem.setAttribute("class", "active-item");

  // create an inner div for the checkbox
  let newCheckDiv = document.createElement("div");

  // create a checklist for this item
  let newInput = document.createElement("input");
  newInput.setAttribute("type", "checkbox");
  newInput.setAttribute("name", userInput);
  newInput.setAttribute("value", userInput);
  let newLabel = document.createElement("label");
  newLabel.setAttribute("for", userInput);
  newLabel.innerHTML = userInput;

  // insert the checklist into the checkbox div and enable completions on Click
  newCheckDiv.appendChild(newInput);
  newCheckDiv.appendChild(newLabel);
  newCheckDiv.addEventListener("click", () => {
    completeToDo(event, newItem);
  });

  // create timestamp div for this todo item and insert the starttime
  let newTimeStamp = document.createElement("div");
  newTimeStamp.setAttribute("class", "timestamp");
  let newStartTime = document.createElement("p");
  newStartTime.innerText = "Start: " + todos[userInput][0].toLocaleString();
  newTimeStamp.appendChild(newStartTime);

  // make a delete button
  let newDeleteButton = document.createElement("button");
  newDeleteButton.setAttribute("class", "deletebutton");
  newDeleteButton.innerText = "X";
  newDeleteButton.addEventListener("click", () => {
    deleteToDo(event, newItem);
  });

  // make an edit button. Change the input text and add a last edited timestamp
  //

  // add the checlist to the created item
  newItem.appendChild(newCheckDiv);
  newItem.appendChild(newTimeStamp);
  newItem.appendChild(newDeleteButton);

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

function deleteToDo(event, element) {
  // delete the entry of this element in the todos dictionary and delete element from page
  delete todos[element.getAttribute("id")];
  let parentOfThis = element.parentNode;
  parentOfThis.removeChild(element);
}
