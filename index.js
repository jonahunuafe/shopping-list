const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
    const itemFromStorage = getItemsFromStorage();
    itemFromStorage.forEach(item => addItemToDOM(item));
    CheckUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;

    //Validate Input
    if(newItem === "") {
        alert("Please add an item");
        return;
    }

    //Check for edit mode
    if(isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkIfItemExist(newItem)) {
            alert("This item already exists!");
            return;
        }
    }

    //create item DOM element
    addItemToDOM(newItem);

    //Add to local storage
    addItemToStorage(newItem);

    CheckUI();

    itemInput.value = "";
}

function addItemToDOM(item) {
    //create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);
    
    //Add li to the DOM
    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemFromStorage = getItemsFromStorage();
    
    //Add new Item to array
    itemFromStorage.push(item);

    //convert to JSON string and set to local storage
    localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function getItemsFromStorage() {
    let itemFromStorage;
    if(localStorage.getItem("items") === null) {
        itemFromStorage = [];
    } else {
        itemFromStorage = JSON.parse(localStorage.getItem("items"));
    }
    return itemFromStorage;
}

function onClickItem(e) {
    if (e.target.id === "item-list") {
        return;
    }

    if(e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item) {
    const itemList = document.getElementById("item-list");
    isEditMode = true;

    itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));
    item.classList.add("edit-mode");
    formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
    formBtn.style.backgroundColor = "#228B22";
    itemInput.value = item.innerText;
}

function removeItem(item) {
    if(confirm("Are you sure?")) {
        //Remove item from DOM
        item.remove();

        //Remove item from storage
        removeItemFromStorage(item.textContent);

        CheckUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Re-set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //Clear from local storage
    localStorage.removeItem("items");

    CheckUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll("li");
    const text = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1) {
            item.style.display ="flex"
        } else {
            item.style.display = "none";
        }
    });
}

function CheckUI() {
    itemInput.value = "";

    const items = itemList.querySelectorAll("li");
    if(items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }

    formBtn.innerHTML =  "<i class='fa-solid fa-plus'></i> Add Item";
    formBtn.style.backgroundColor = "#333";

    isEditMode = false;
}

//Initialize app
function init() {
    //Event Listeners
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    clearBtn.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    CheckUI();
}

init();