const inputField = document.getElementById("newtaskfield");
const estimateField = document.getElementById("estimatefield");
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
  let userEstimate = estimateField.value.trim();
  // TODO : check if input exists in todos and prevent duplicate items from being added
  if (userInput === "" || userInput in todos) {
    // TODO : provide visual feedback about bad input
    showError("Only unique names are allowed for tasks. Please try again.");
    return;
  }

  inputField.value = null;
  estimateField.value = null;
  todos[userInput] = [0, 0, formatEstimate(userEstimate)];

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

  // create a div for the checkDiv and timestamp
  let contentDiv = document.createElement("div");
  contentDiv.appendChild(newCheckDiv);
  contentDiv.appendChild(newTimeStamp);

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

  // make a div for the buttons
  let buttonDiv = document.createElement("div");
  buttonDiv.appendChild(newEditButton);
  buttonDiv.appendChild(newDeleteButton);

  // add the checlist to the created item
  newItem.appendChild(contentDiv);
  newItem.appendChild(buttonDiv);

  // add child to the active to dos
  activeToDoList.appendChild(newItem);
}

// Close Active tasks and Move To the Completed List
function completeToDo(event, element) {
  event.preventDefault();

  element.setAttribute("class", "completed-item");

  // add the todo completed time to timestamp
  let elementName = element.getAttribute("id");
  let toDoEnded = new Date();
  todos[elementName][1] = toDoEnded;

  let newEndTime = document.createElement("p");
  newEndTime.innerText = "End: " + toDoEnded.toLocaleString();

  // add the final timestamp evaluation
  let newTimeEvaluation = document.createElement("p");
  newTimeEvaluation.innerText = compareTime(todos[elementName]);

  // make a new checkdiv with no event listener
  // set the input.checked to true and prevent unchecking
  let replacementCheckDiv = createCheckDiv(elementName);
  let replacementInput = replacementCheckDiv.querySelector("div>input");
  replacementInput.checked = true;
  replacementInput.addEventListener("click", (event) => {
    event.preventDefault();
  });

  // replace the old CheckDiv with one that does not have an event listener
  element.children[0].replaceChild(
    replacementCheckDiv,
    element.children[0].children[0]
  );

  // remove the edit button
  let editButton = element.querySelector("div:last-of-type>.editbutton");
  editButton.parentNode.removeChild(editButton);

  completedToDoList.appendChild(element);

  // update timestamp information
  element.querySelector("div>.timestamp").appendChild(newEndTime);
  element.querySelector("div>.timestamp").appendChild(newTimeEvaluation);
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
    showError("Empty names are not allowed.");
  } else {
    newName = newName.trim();
    let oldName = element.getAttribute("id");
    // if name is not any different or already exists as another task or empty, ignore
    if (newName == "" || newName == oldName || newName in todos) {
      // display an error if bad vale allowed
      showError("Only new and unique names are allowed. Please try again.");
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
      element.children[0].replaceChild(
        newCheckDiv,
        element.children[0].children[0]
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
// return No estimare if entry is invalid
// return formatted entry  if entry is valid.
function formatEstimate(userEstimate) {
  // if invalid, return false
  if (isNaN(parseFloat(userEstimate))) {
    // TODO : not a valid entry. display warning that estimate not set.
    showWarning("No estimates were set for this Task.");
    return "No estimate";
  }
  // if valid return formatted estimate
  else {
    // round up to the nearest .25
    let userFloat = parseFloat(userEstimate);
    let userInt;

    // prevent parseInt(.[number]) = NaN errors
    if (userFloat < 1) {
      userInt = 0;
    } else {
      userInt = parseInt(userEstimate);
    }

    let roundingFactor; // we will use this to round up after the decimal

    if (userFloat % 1 < 0.25) {
      roundingFactor = 0.25;
    } else if (userFloat % 1 < 0.5) {
      roundingFactor = 0.5;
    } else if (userFloat % 1 < 0.75) {
      roundingFactor = 0.75;
    } else {
      roundingFactor = 1;
    }

    //return formatted user estimate
    return userInt + roundingFactor;
  }
}

// takes a timestamp and returns the comparison between estimated time and actual time taken
function compareTime(timestamp) {
  // caluclate time taken in milliseconds and then convert to .25, .5, .75, .0 hour scale
  let timeTaken = timestamp[1] - timestamp[0];
  let formattedTimeTaken = Math.ceil(timeTaken / 60000 / 15) * 0.25;

  return `Estimate: ${timestamp[2]}, Actual time: ${formattedTimeTaken}`;
}

// display a warning on the screen
function showWarning(warningMessage) {
  let warningDiv = document.createElement("div");
  warningDiv.classList.add("warning");

  warningDiv.innerHTML = `<strong>Warning:</strong> <p>${warningMessage}</p>`;

  let body = document.querySelector("body");

  body.appendChild(warningDiv);

  setTimeout(() => {
    body.removeChild(warningDiv);
  }, 2500);
}

// display an error on the screen
function showError(errorMessage) {
  let errorDiv = document.createElement("div");
  errorDiv.classList.add("error");

  errorDiv.innerHTML = `<strong>Error:</strong> <p>${errorMessage}</p>`;

  let body = document.querySelector("body");

  body.appendChild(errorDiv);

  setTimeout(() => {
    body.removeChild(errorDiv);
  }, 3500);
}
