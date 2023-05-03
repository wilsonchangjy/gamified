// Multi Option Selection
class CustomSelect {
    constructor(originalSelect) {
        this.originalSelect = originalSelect;
        this.customSelect = document.createElement("div");
        this.customSelect.classList.add("select");
        this.customSelect.setAttribute("id", originalSelect.name);

        this.originalSelect.querySelectorAll("option").forEach(optionElement => {
            const itemElement = document.createElement("div");

            itemElement.classList.add("select-option");
            itemElement.textContent = optionElement.textContent;
            itemElement.value = optionElement.value;
            this.customSelect.appendChild(itemElement);

            if (optionElement.selected) {
                this._select(itemElement);
            }

            itemElement.addEventListener("click", () => {
                if (this.originalSelect.multiple && itemElement.classList.contains("active")) {
                    this._deselect(itemElement);
                }
                else {
                    this._select(itemElement);
                }
            });

            // Mouseover
            itemElement.addEventListener("mouseover", () => {
                const mouseoverItem = document.getElementById("tooltip-" + itemElement.value);
                const tooltip = $(".tooltip-container");
                const tooltipName = $(".tooltip-name");
                const tooltipText = $(".tooltip-text");
                const tooltipPrompt = $(".tooltip-prompt");

                if (mouseoverItem != null && tooltip.hasClass("active")) {
                    tooltipName.text(itemElement.textContent.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ""));
                    tooltipText.html(mouseoverItem.innerHTML);
                    tooltipPrompt.toggleClass("active", true);
                }
            });
        });

        this.originalSelect.insertAdjacentElement("afterend", this.customSelect);
        this.originalSelect.style.display = "none";

        // Deselect all options at start
        for (const child of this.customSelect.children) {
            this._deselect(child);
        }
    }

    _select(itemElement) {
        const index = Array.from(this.customSelect.children).indexOf(itemElement);

        if (!this.originalSelect.multiple) {
            this.customSelect.querySelectorAll(".select-option").forEach(el => {
                el.classList.remove("active");
            });
        }

        this.originalSelect.querySelectorAll("option")[index].selected = true;
        itemElement.classList.add("active");
    }

    _deselect(itemElement) {
        const index = Array.from(this.customSelect.children).indexOf(itemElement);

        this.originalSelect.querySelectorAll("option")[index].selected = false;
        itemElement.classList.remove("active");
    }
}

// Drag List Options
const dragList = document.querySelector(".drag-list");
const motivationNames = { meaning: "Epic Meaning & Calling", development: "Development & Accomplishment", creativity: "Empowerment of Creativity & Feedback", ownership: "Ownership & Posession", social: "Social Influence & Relatedness/Envy", scarcity: "Scarcity & Impatience", curiosity: "Unpredictability & Curiosity", loss: "Loss & Avoidance" };
var listItems = [];

let dragStartIndex;

function clearList() {
    dragList.innerHTML = "";
    listItems = [];
}

export function createList(motivationsList) {
    clearList();

    [...motivationsList].forEach((motivation, index) => {
        const listItem = document.createElement("li");
        listItem.setAttribute("data-index", index);
        listItem.innerHTML = `
        <span class="drag-number">${index + 1}</span>
        <div class="drag-item" draggable="true">
            <p class="motivation-name">${motivationNames[motivation]}</p>
        </div>
        `;

        listItems.push(listItem);
        dragList.appendChild(listItem);
    });

    addEventListeners();
}

export function getList() {
    var motivationString = "";

    listItems.forEach((listItem) => {
        const motivations = Object.keys(motivationNames).find(key => motivationNames[key] === listItem.querySelector(".drag-item").innerText.trim());
        motivationString += motivations + " ";
    });

    return motivationString;
}

function dragStart() {
    dragStartIndex = +this.closest("li").getAttribute("data-index");
}

function dragOver(e) {
    e.preventDefault();
    this.querySelector(".drag-item").classList.add("over");
}

function dragDrop() {
    const dragEndIndex = +this.getAttribute("data-index");
    moveItems(dragStartIndex, dragEndIndex);
}

function dragLeave() {
    this.querySelector(".drag-item").classList.remove("over");
}

function moveItems(fromIndex, toIndex) {
    const itemOne = listItems[fromIndex].querySelector(".drag-item");
    const itemTwo = listItems[toIndex].querySelector(".drag-item");

    // Moves the objects in between, if any
    var indexDifference = toIndex - fromIndex;
    
    for (var i = 0; i < Math.abs(indexDifference); i++) {
        if (Math.sign(indexDifference) != 1) {
            var newItem = listItems[toIndex + i].querySelector(".drag-item");
            listItems[toIndex + i + 1].appendChild(newItem);
        }
        else {
            var newItem = listItems[toIndex - i].querySelector(".drag-item");
            listItems[toIndex - i - 1].appendChild(newItem);
        }
    }

    // Moves the dragged object to the new spot
    listItems[toIndex].appendChild(itemOne);
    itemTwo.classList.remove("over");

    getList();
}

function addEventListeners() {
    const dragItems = document.querySelectorAll(".drag-item");
    const dragListItems = document.querySelectorAll(".drag-list li");

    dragItems.forEach(dragItem => {
        dragItem.addEventListener("dragstart", dragStart);
    });
    dragListItems.forEach(dragListItem => {
        dragListItem.addEventListener("dragover", dragOver);
        dragListItem.addEventListener("drop", dragDrop);
        dragListItem.addEventListener("dragleave", dragLeave);
    });
}

// Initialise
export function initaliseFormConstructor() {    
    document.querySelectorAll(".custom-select").forEach(selectElement => {
        new CustomSelect(selectElement);
    })
}