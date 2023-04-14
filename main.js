import './style.css'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js"

const appSettings = { 
  databaseURL: "Add your Real-time database URL"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", () => {
  let inputValue = inputFieldEl.value

  push(shoppingListInDB, inputValue)

  clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val())

    clearShoppingListEl()

    for (let i=0; i < shoppingListArray.length; i++) {
      let currentItem = shoppingListArray[i]

      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]

      appendItemsToList(currentItem)
    }
  } else {
    shoppingListEl.innerHTML = `<h1>No items here...yet &#128533;</h1>`
  }
})

function clearInputFieldEl() {
  inputFieldEl.value = ""
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}

function appendItemsToList(item) {
  let itemID = item[0]
  let itemValue = item[1]

  let newListEl = document.createElement("li")
  newListEl.textContent = itemValue

  newListEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

    remove(exactLocationOfItemInDB)
  })
  
  shoppingListEl.append(newListEl)
}