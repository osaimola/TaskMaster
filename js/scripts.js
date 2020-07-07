const inputField = document.getElementById("newtaskfield");
const submitButton = document.getElementById("submittask");
const activeToDoList = document.querySelector("body>.active-todo>ul");
const completedToDoList = document.querySelector("body>.completed-todo>ul");
const todos = {};

// APPENDING A CHILD THAT EXISTS UNDER ONE PARENT TO ANOTHER PARENT SHOULD MOVE IT TO THe NEW PARENT

submitButton.addEventListener("click", createToDo);

// Get user input from the new task form and create a new TO DO ITEM
function createToDo(event) {
  event.preventDefault();
  let userInput = inputField.value.trim();
  if (userInput === "") {
    return;
  }

  inputField.value = null;
  // TODO : use the input field value to update the to do list
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

  // add the checlist to the created item
  newItem.appendChild(newInput);
  newItem.appendChild(newLabel);

  newItem.addEventListener("click", () => {
    completeToDo(event, newItem);
  });

  // add child to the active to dos
  activeToDoList.appendChild(newItem);
}

function completeToDo(event, element) {
  event.preventDefault();
  completedToDoList.appendChild(element);
}
