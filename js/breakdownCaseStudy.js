import { getMotivations } from "./firebase.js";
import { setChartValues, setKarmaValue } from "./breakdownAnalysis.js";

var name;
var motivations;
var tagArray = { ecommerce: "E-Commerce", education: "Education", entertainment: "Entertainment", foodbeverage: "Food & Beverage", finance: "Finance", healthcare: "Healthcare", lifestyle: "Lifestyle", nonprofit: "Non-profit", personal: "Personal", productivity: "Productivity", service: "Service", socialnetworking: "Social Networking", technology: "Technology", transport: "Transport", utility: "Utility" };
var elements;
var elementArray = [];
var keyElementArray = [];
var secondaryElementArray = [];
var supportingElementArray = [];
var dataArray = [];
var concensus;

async function initaliseBreakdown() {
    window.scrollTo(0, 0);

    name = document.querySelector(".project-name").textContent;
    elements = await getMotivations();

    getElements();
    calculateOctalysis();
    calculateKarma();
}

function getElements() {
    const elementItems = document.querySelectorAll(".element-item");
    const keyElements = document.querySelectorAll(".key-elements .element-item");
    const secondaryElements = document.querySelectorAll(".secondary-elements .element-item");
    const supportingElements = document.querySelectorAll(".supporting-elements .element-item");

    for (var child in elements) {
        const grandChild = elements[child];

        for (var i = 0; i < elementItems.length; i++) {
            if (grandChild.name == elementItems[i].textContent) {
                elementArray.push(grandChild);
            }
        }

        for (var i = 0; i < keyElements.length; i++) {
            if (grandChild.name == keyElements[i].textContent) {
                keyElementArray.push(grandChild);
            }
        }

        for (var i = 0; i < secondaryElements.length; i++) {
            if (grandChild.name == secondaryElements[i].textContent) {
                secondaryElementArray.push(grandChild);
            }
        }

        for (var i = 0; i < supportingElements.length; i++) {
            if (grandChild.name == supportingElements[i].textContent) {
                supportingElementArray.push(grandChild);
            }
        }
    }
}

function calculateOctalysis() {
    const octalysis = ["meaning", "development", "creativity", "ownership", "social", "scarcity", "curiosity", "loss"];

    for (var i = 0; i < octalysis.length; i++) {
        const child = octalysis[i];
        var count = 0;

        for (var j = 0; j < keyElementArray.length; j++) {
            const element = keyElementArray[j]
            count += element[child] * 3;
        }

        for (var j = 0; j < secondaryElementArray.length; j++) {
            const element = secondaryElementArray[j]
            count += element[child] * 2;
        }

        for (var j = 0; j < supportingElementArray.length; j++) {
            const element = supportingElementArray[j]
            count += element[child];
        }

        dataArray[i] = count / elementArray.length;
    }
}

function calculateKarma() {
    var whiteHat = 0;
    var blackHat = 0;

    for (var i = 0; i < 3; i++) {
        whiteHat += dataArray[i];
    }
    for (var i = 5; i < 8; i++) {
        blackHat += dataArray[i];
    }

    const karma = whiteHat - blackHat;
    var verdict;

    if (Math.abs(karma) < 20) {
        verdict = "neutral";
    }
    else if (Math.sign(karma) != 1) {
        verdict = "bad";
    }
    else {
        verdict = "good";
    }

    setKarmaValue(verdict);
    setChartValues(name, dataArray);
}

// Initialise
const breakdownBox = document.querySelector(".breakdown-box");

if (breakdownBox != null) {
    breakdownBox.addEventListener("load", initaliseBreakdown());
}