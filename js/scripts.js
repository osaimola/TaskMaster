const inputField = document.getElementById("newtaskfield");
const submitButton = document.getElementById("submittask");
const pendingToDoList = document.querySelector(".pending-todo>ul");
const activeToDoList = document.querySelector("#activetodolist");
const completedToDoList = document.querySelector("#completedtodolist");
// dictionary will store {"todo item" : [start time, end time, estimated time]}
const todos = {};

// APPENDING A CHILD THAT EXISTS UNDER ONE PARENT TO ANOTHER PARENT SHOULD MOVE IT TO THe NEW PARENT

submitButton.addEventListener("click", addPendingToDo);

// GEt user input from the new task form and create a new Pending to do
function addPendingToDo(event) {
  event.preventDefault();

  let userInput = inputField.value.trim();
  // TODO : check if input exists in todos and prevent duplicate items from being added
  if (userInput === "" || userInput in todos) {
    // TODO : provide visual feedback about bad input
    return;
  }

  inputField.value = null;
  todos[userInput] = [0, 0, 0];

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
  todos[userInput][0] = new Date();

  // create a new wrapper div for this todo item
  let newItem = document.createElement("div");
  newItem.setAttribute("id", userInput);
  newItem.setAttribute("class", "active-item");

  // create a checkDiv with the createCheckDiv function
  let newCheckDiv = createCheckDiv(userInput);
  // Enable Task completions on Click
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
  let newEditButton = document.createElement("button");
  newEditButton.setAttribute("class", "editbutton");
  newEditButton.innerText = "Edit";
  newEditButton.addEventListener("click", () => {
    editTask(event, newItem);
  });

  // add the checlist to the created item
  newItem.appendChild(newCheckDiv);
  newItem.appendChild(newTimeStamp);
  newItem.appendChild(newDeleteButton);
  newItem.appendChild(newEditButton);

  // add child to the active to dos
  activeToDoList.appendChild(newItem);
}

// Close Active tasks and Move To the Completed List
function completeToDo(event, element) {
  event.preventDefault();

  element.setAttribute("class", "completed-item");

  // add the todo completed time to timestamp
  let elementName = element.getAttribute("id");
  let toDoStarted = todos[elementName][0];
  let toDoEnded = new Date();
  todos[elementName][1] = toDoEnded;

  let newEndTime = document.createElement("p");
  newEndTime.innerText = "End: " + toDoEnded.toLocaleString();

  // make a new checkdiv with no event listener
  // set the input.checked to true and prevent unchecking
  let replacementCheckDiv = createCheckDiv(elementName);
  let replacementInput = replacementCheckDiv.querySelector("div>input");
  replacementInput.checked = true;
  replacementInput.addEventListener("click", (event) => {
    event.preventDefault();
  });

  // replace the old CheckDiv with one that does not have an event listener
  element.replaceChild(
    replacementCheckDiv,
    element.querySelector("div:first-of-type")
  );

  // remove the edit button
  let editButton = element.querySelector(".editbutton");
  editButton.parentNode.removeChild(editButton);

  completedToDoList.appendChild(element);
  element.querySelector(".timestamp").appendChild(newEndTime);
}

// Delete tasks
function deleteToDo(event, element) {
  // delete the entry of this element in the todos dictionary
  delete todos[element.getAttribute("id")];
  // get the element's parent and delete the element
  let parentOfThis = element.parentNode;
  parentOfThis.removeChild(element);
}

// creates and returns a div with a label and checkbox
function createCheckDiv(userInput) {
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

  return newCheckDiv;
}

function editTask(event, element) {
  let newName = prompt("Please enter a new name for this task.");

  if (newName === null) {
    //ignore if a null value is entered
  } else {
    newName = newName.trim();
    let oldName = element.getAttribute("id");
    // if name is not any different or already exists as another task or empty, ignore
    if (newName == "" || newName == oldName || newName in todos) {
      // TODO : add an error and display
    } else {
      // rename the task entry in the todos dictionary
      todos[newName] = todos[oldName];
      delete todos[oldName];
      // replace all entries of the task name
      // element id
      element.setAttribute("id", newName);

      // checkdiv
      let newCheckDiv = createCheckDiv(newName);
      newCheckDiv.addEventListener("click", () => {
        completeToDo(event, element);
      });
      element.replaceChild(
        newCheckDiv,
        element.querySelector("div:first-of-type")
      );

      // add the last modified value
      let lastModifiedTime = document.createElement("p");
      lastModifiedTime.innerText =
        "Last Modified: " + new Date().toLocaleString();
      let timestamp = element.querySelector(".timestamp>p:last-of-type");
      // if previously modified, update last modified time
      if (timestamp.innerText.startsWith("Last Modified:")) {
        // see more about startsWith here: https://www.w3schools.com/jsref/jsref_startswith.asp
        timestamp.parentNode.replaceChild(lastModifiedTime, timestamp);
      }
      // if not previously modified add new last modified time
      else {
        timestamp.parentNode.appendChild(lastModifiedTime);
      }
    }
  }
}

// handle estimate entries.
// return false if entry is invalid
// return true and add formatted entry to todos dictionary if entry is valid.
function handleEstimates(userEstimate) {
  // if valid add to todos and return true
  // if invalid, return false
}
