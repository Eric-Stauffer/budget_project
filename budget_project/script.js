let expenseTracker = new Model();

function loadExpenseTracker() {
    if (currentUser != undefined) {
        for (category of userData.categories) {
            expenseTracker.addCategory(category.color, category.name, category.budget)
            for (item of category.items) {
                expenseTracker.categorys[expenseTracker.categorys.length - 1].addItem(item.date, item.description, item.payment, item.amount)
            }
        }
        state = expenseTracker.categorys.length - 1;
    }
}
let state = expenseTracker.categorys.length - 1;
let newBackgroundColor = expenseTracker.categorys[state].color

// modifier functions
function changeState(newState) {
    state = newState;
    newBackgroundColor = expenseTracker.categorys[state].color
    updateBudget()
    createTable()
    document.getElementById("add-new-button").style.backgroundColor = newBackgroundColor;
}

// creationFunctions
function createTable() {
    const container = document.querySelector(".container")
    const itemToReplace = document.querySelector("#expense-tracker")
    let expenseTrackerTable = document.createElement("table")
    expenseTrackerTable.id = "expense-tracker";
    expenseTrackerTable.style.backgroundColor = newBackgroundColor;
    let expenseTrackerBody = document.createElement("tbody")
    expenseTrackerTable.appendChild(expenseTrackerBody)
    expenseTrackerTable.id = "expense-tracker";
    const date = document.createTextNode("Date");
    const description = document.createTextNode("Description");
    const amount = document.createTextNode("Amount");
    const payment = document.createTextNode("Payment Type");
    let textNode;
    let tableItem;
    let tableRow = document.createElement("tr")

    const tableHeaderText = [date, description, payment, amount];
    for (let i = 0; i < 4; i++) {
        tableItem = document.createElement("th")
        textNode = tableHeaderText[i];
        tableItem.appendChild(textNode)
        tableRow.appendChild(tableItem)
    }
    expenseTrackerBody.appendChild(tableRow)

    for (let i = 0; i < expenseTracker.categorys[state].items.length; i++) {
        tableRow = document.createElement("tr")
        for (let j = 0; j < 4; j++) {
            tableItem = document.createElement("td")

            let itemDate = document.createTextNode(expenseTracker.categorys[state].items[i].date)
            let itemDescription = document.createTextNode(expenseTracker.categorys[state].items[i].description)
            let itemAmount = document.createTextNode(expenseTracker.categorys[state].items[i].amount)
            let itemPayment = document.createTextNode(expenseTracker.categorys[state].items[i].payment)

            let itemDetails = [itemDate, itemDescription, itemPayment, itemAmount]

            tableItem.appendChild(itemDetails[j])

            tableRow.appendChild(tableItem);
        }
        expenseTrackerBody.appendChild(tableRow);
    }


    let newDate = document.createElement("input")
    let newDescription = document.createElement("input")
    let newPayment = document.createElement("select")
    let emptyValue = document.createElement("option")
    let card = document.createElement("option")
    let cash = document.createElement("option")
    card.value = "card"
    cash.value = "cash"
    emptyValue.innerHTML = "--Type--"
    card.innerHTML = "Card"
    cash.innerHTML = "Cash"
    newPayment.appendChild(emptyValue)
    newPayment.appendChild(card)
    newPayment.appendChild(cash)

    let newAmount = document.createElement("input")
    let formRow = document.createElement("tr")

    newDate.id = "new-date"
    newDescription.id = "new-description"
    newAmount.id = "new-amount"
    newPayment.id = "new-payment"
    formRow.id = "form-row"

    let formRowItems = [newDate, newDescription, newPayment, newAmount]

    for (let i = 0; i < formRowItems.length; i++) {
        formRowItems[i].placeholder = "Add Item"
        tableItem = document.createElement("td")
        tableItem.appendChild(formRowItems[i])
        formRow.appendChild(tableItem)
    }
    expenseTrackerBody.appendChild(formRow)
    container.replaceChild(expenseTrackerTable, itemToReplace);
}

function submitItem() {
    console.log('test')
    let newDate = document.getElementById("new-date")
    let newDescription = document.getElementById("new-description")
    let newAmount = document.getElementById("new-amount")
    let newPayment = document.getElementById("new-payment")
    expenseTracker.categorys[state].addItem(newDate.value, newDescription.value, newPayment.value, Number(newAmount.value))
    createTable();
    updateBudget();
}


// create tabs header
function createTabsHeader() {
    const container = document.querySelector(".container");
    const itemToReplace = document.getElementById("table-tabs")

    let tableTabs = document.createElement("ul");
    tableTabs.id = "table-tabs";

    for (category in expenseTracker.categorys) {
        tab = document.createElement("li");
        tab.style.backgroundColor = expenseTracker.categorys[category].color;
        tabText = document.createTextNode(expenseTracker.categorys[category].name);
        tab.appendChild(tabText);
        tableTabs.appendChild(tab)
    }
    container.replaceChild(tableTabs, itemToReplace)
    changeState(state)
    addTabButtons();
}

function updateBudget() {
    let amountPerWeek = document.getElementById("amount-per-week");
    amountPerWeek.addEventListener('change', () => {
            expenseTracker.categorys[state].changeBudget(amountPerWeek.value)
            updateBudget();
        }

    )
    let spent = document.getElementById("spent")
    let bottomLine = document.getElementById("bottom-line")

    amountPerWeek.value = expenseTracker.categorys[state].budget;
    spent.innerHTML = expenseTracker.categorys[state].spent;
    bottomLine.innerHTML = expenseTracker.categorys[state].bottomLine()
    document.getElementById("budget-tracker-header").style.backgroundColor = newBackgroundColor;

}

function createCategoryPopup() {
    document.querySelector(".popup").classList.add("active")
    document.querySelector(".overlay").classList.add("active")
}

function removeCategoryPopup() {
    document.querySelector(".popup").classList.remove("active")
    document.querySelector(".overlay").classList.remove("active")
}

function submitCategory() {

    let categoryName = document.getElementById("set-cat-name").value
    let categoryColor = document.getElementById("set-cat-color").value
    let categoryBudget = document.getElementById("set-cat-budget").value

    expenseTracker.addCategory(categoryColor, categoryName, categoryBudget)

    categoryName.value, categoryColor.value, categoryBudget.value = ''
    changeState(expenseTracker.categorys.length - 1)
    removeCategoryPopup()
    createTabsHeader();
}

function addTabButtons() {
    let tabsList = document.getElementById("table-tabs")
    let tabs = tabsList.getElementsByTagName("li")
    for (let i = 0; i < tabs.length; i++) {
        if (i === 0) {
            tabs[i].onclick = function() { createCategoryPopup() }
        } else {
            tabs[i].onclick = function() {
                if (i != state) {
                    changeState(i);
                    moveTabsDown(i);
                } else {
                    removeCategory(i);
                }

            }
        }

    }
}

function removeCategory(category) {
    if (confirm("Are you sure you want to delete this Category?")) {
        expenseTracker.categorys.splice(category, 1)
        state = expenseTracker.categorys.length - 1
        createExpenseTracker()
    }
}

function moveTabsDown(selectedTab) {
    let tabsList = document.getElementById("table-tabs")
    let tabs = tabsList.getElementsByTagName("li")

    for (let i = 0; i < tabs.length; i++) {
        if (i == selectedTab) {
            tabs[i].setAttribute('style', 'top:2px;background-color:' + expenseTracker.categorys[state].color + ";")
        } else {
            tabs[i].setAttribute('style', 'background-color:' + expenseTracker.categorys[i].color + ';')
        }
    }
}
// function makeCellsClickable() {
//     let expenseTrackerTable = document.getElementById("expense-tracker")
//     let tdTags = expenseTrackerTable.getElementsByTagName('td')
//     let thTags = expenseTrackerTable.getElementsByTagName('th')
//     let cells = [...thTags, ...tdTags]

//     for (let i = 0; i < cells.length - 4; i++) {
//         cells[i].onclick = function() {
//             let col = this.cellIndex;
//             let row = this.parentNode.rowIndex;

//             document.getElementById("cordinates").innerHTML = "Cordinates of Cell = (" + row + ',' + col + ")"

//             this.innerHTML = "(" + row + "," + col + ")"
//             this.setAttribute('style', "color:red;")
//         }
//     }
// }

// function animation() {
//     let rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', 'black']
//     let colorIndex = 0;
//     let rotations = 0;
//     var circleAnimation = setInterval(function() {
//         const circle = document.getElementById('circle')
//         circle.style.transform += "rotate(1deg)"
//         rotations += 1;
//         if (rotations % 360 === 0) {
//             circle.setAttribute("style", 'border-color:' + rainbowColors[colorIndex] + ";")
//             if (colorIndex === 7) {
//                 colorIndex = 0;
//             } else { colorIndex++ }
//         }
//         if (rotations > 2520) {
//             clearInterval(circleAnimation)
//             circle.setAttribute('style', "display:none;")
//             document.getElementsByClassName('container')[0].setAttribute('style', 'display:flex;')
//             document.body.setAttribute('style', 'display:block;')
//         }
//     }, 5)


// }



// animation()


createExpenseTracker()


function createExpenseTracker() {
    loadExpenseTracker();
    createTable();
    createTabsHeader();
    moveTabsDown(state);
    updateBudget();
}