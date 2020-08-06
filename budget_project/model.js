class Model {
    constructor() {
        this.categorys = [];
        this.addCategory("#DEEAEE", "+")
    }

    addCategory(color, name, budget) {
        let category = new Category(color, name, budget);
        this.categorys.push(category);
    }
    removeCategory(index) {
        this.categorys.splice(index, 1)
    }


}
class List_Item {
    constructor(date, description, payment, amount) {
        this.date = date;
        this.description = description;
        this.payment = payment;
        this.amount = amount;
    }
}

class Category {
    constructor(color, name, budget) {
        this.color = (color === '') ? "#DEEAEE" : color;;
        this.name = (name === '') ? "Default" : name;
        this.items = [];
        this.budget = (budget === undefined || budget === '') ? 0 : budget;
        this.spent = 0;
    }

    addItem(date, description, payment, amount) {
        let item = new List_Item(date, description, payment, amount);
        this.spent += item.amount;
        this.items.push(item);
    }
    removeItem(index) {
        this.spent -= items[index].amount;
        this.items.splice(index, 1)
    }
    changeBudget(newBudget) {
        this.budget = newBudget;
    }
    bottomLine() {
        return this.budget - this.spent;
    }
}