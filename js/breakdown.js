import { readProjectData, getReference, getMotivations, writeAffinityData } from "./firebase.js";
import { setChartValues, setKarmaValue, setSuggestionPrompts } from "./breakdownAnalysis.js";

var name;
var description;
var tags;
var goal;
var player;
var motivations;
var tagArray = { ecommerce: "E-Commerce", education: "Education", entertainment: "Entertainment", foodbeverage: "Food & Beverage", finance: "Finance", healthcare: "Healthcare", lifestyle: "Lifestyle", nonprofit: "Non-profit", personal: "Personal", productivity: "Productivity", service: "Service", socialnetworking: "Social Networking", technology: "Technology", transport: "Transport", utility: "Utility" };
var elements;
var elementArray = [];
var keyElementArray = [];
var secondaryElementArray = [];
var supportingElementArray = [];
var tempElementArray = [];
var dataArray = [];
var concensus;

async function initaliseBreakdown() {
    window.scrollTo(0, 0);

    var projectID = await getReference();
    var firebaseData = await readProjectData(projectID);
    elements = await getMotivations();

    console.log("Reading data from: " + projectID);
    setProjectData(firebaseData);

    //$("#character").attr("url", "https://prod.spline.design/i0NSEl-Xcqr5wsB7/scene.splinecode");
}

const feedback = document.querySelector(".breakdown-feedback");

if (feedback != null) {
    const noButton = document.querySelector(".no-button");
    const yesButton = document.querySelector(".yes-button");

    noButton.addEventListener('click', () => {
        $(".feedback-intro").toggleClass("inactive", true);
        $(".feedback-options").toggleClass("active", true);
        const text = "Select the elements that you feel are not helpful to your project.";

        cloneElements(text);
        concensus = false;
    });

    yesButton.addEventListener('click', () => {
        $(".feedback-intro").toggleClass("inactive", true);
        $(".feedback-options").toggleClass("active", true);
        const text = "Select the elements that you feel will be beneficial to your project.";

        cloneElements(text);
        concensus = true;
    });
}

function populatePage() {
    const replaceName = document.querySelectorAll(".project-name");
    const replaceDescription = document.querySelectorAll(".project-description");
    const replaceTags = document.querySelectorAll(".project-tags");

    replaceName.forEach(replaceItem => {
        replaceItem.textContent = name;
    });
    replaceDescription.forEach(replaceItem => {
        replaceItem.textContent = description;
    });
    replaceTags.forEach(replaceItem => {
        var formatTags = tags.trim().split(" ");
        var newTags = "";

        for (var i = 0; i < formatTags.length; i++) {
            const reference = formatTags[i];
            newTags += tagArray[reference] + ", ";
        }

        replaceItem.textContent = newTags.slice(0, -2);
    });
}

async function assignElements() {

    const motivationArray = motivations.trim().split(" ");

    for (var i = 0; i < motivationArray.length; i++) {
        const requirement = motivationArray[i];
        const requirementScore = ((i + 1) * 100 / motivationArray.length);

        const priorityLimit = motivationArray.length - i;

        for (var child in elements) {
            const grandChild = elements[child];

            if (grandChild[requirement] >= requirementScore && grandChild[player.trim()] >= 100 && grandChild[goal.trim()] >= 100) {
                createElement(grandChild, "key");
                elementArray.push(grandChild);
                keyElementArray.push(grandChild);
                delete elements[child];
            }
            else if (grandChild[requirement] >= requirementScore && grandChild[player.trim()] >= 100) {
                createElement(grandChild, "secondary");
                elementArray.push(grandChild);
                secondaryElementArray.push(grandChild);
                delete elements[child];
            }
            else if (grandChild[requirement] >= requirementScore) {
                tempElementArray.push(grandChild);
                delete elements[child];
            }
        }

        let sortedArray = tempElementArray.sort(
            (a, b) => (a[requirement] < b[requirement]) ? 1 : (a[requirement] > b[requirement]) ? -1 : 0
        );

        for (var j = 0; j < priorityLimit; j++) {
            const child = sortedArray[j];

            if (child != null) {
                createElement(child, "supporting");
                elementArray.push(child);
                supportingElementArray.push(child);
            }
        }
    }

    var mainElements = "";
    var mainElementArray = [];

    mainElementArray = mainElementArray.concat(keyElementArray, secondaryElementArray);

    for (var i = 0; i < mainElementArray.length; i++) {
        const element = mainElementArray[i].name;
        mainElements += element + ", ";
    }

    setSuggestionPrompts(description, mainElements.slice(0, -2));
}

function createElement(element, sort) {
    var elementList;

    if (sort == "key") {
        elementList = document.querySelector(".key-elements");
    }
    else if (sort == "secondary") {
        elementList = document.querySelector(".secondary-elements");
    }
    else if (sort == "supporting") {
        elementList = document.querySelector(".supporting-elements");
    }

    const elementItem = document.createElement("li");
    elementItem.innerHTML = `
    <div class="element-item chat-prompt">
        ${element.name}
    </div>
    `;

    elementList.appendChild(elementItem);
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

function cloneElements(text) {
    const feedbackOptions = document.querySelector(".feedback-options");
    const feedbackPrompt = document.querySelector("#feedback-prompt");
    const node = document.querySelector(".elements-field");
    const clone = node.cloneNode(true);

    feedbackPrompt.textContent = text;

    feedbackOptions.insertBefore(clone, document.querySelector(".submit-button"));

    const elementList = clone.getElementsByClassName("element-item");

    for (var i = 0; i < elementList.length; i++) {
        elementList[i].classList.remove("chat-prompt");
        elementList[i].classList.add("feedback-item");
    }

    const feedbackElement = document.querySelectorAll(".feedback-item");

    feedbackOptions.addEventListener("click", function(event) {
        feedbackElement.forEach(element => {
            if (element.contains(event.target)) {
                $(element).toggleClass("active");
            };
        });

        verifyFeedback();
    });

    const submitButton = document.querySelector(".submit-button");
    submitButton.addEventListener('click', updateAffinity);
}

function verifyFeedback() {
    const activeList = document.querySelector(".feedback-options").getElementsByClassName("element-item active");

    if (activeList.length != 0) {
        $(".submit-button").toggleClass("active", true);
    }
    else {
        $(".submit-button").toggleClass("active", false);
    }
}

function updateAffinity() {
    const activeList = document.querySelector(".feedback-options").getElementsByClassName("element-item active");
    const motivationArray = motivations.trim().split(" ").reverse();

    for (var i = 0; i < activeList.length; i++) {
        const activeElement = activeList[i].innerHTML.trim().replace("&amp;", "&");

        for (var j = 0; j < elementArray.length; j++) {
            const element = elementArray[j];

            if (element.name == activeElement) {
                for (var k = 0; k < motivationArray.length; k++) {
                    const motivation = motivationArray[k];
                    const increment = motivationArray.length / (k + 1);

                    //const requirementScore = ((k + 1) * 100 / motivationArray.length);

                    if (concensus && (element[motivation] >= 0 && element[motivation] <= 99)) {
                        const newValue = element[motivation] + increment;
                        const elementID = element.name.replace("/", "").replace(" & ", "").replace("-", "").replace(" (XP)", "").replace(/\s+/g, "").toLowerCase();

                        console.log(elementID + motivation + newValue);
                        writeAffinityData(elementID, motivation, newValue);
                    }
                    else if (!concensus && (element[motivation] >= 1 && element[motivation] <= 100)) {
                        const newValue = element[motivation] - increment;
                        const elementID = element.name.replace("/", "").replace(" & ", "").replace("-", "").replace(" (XP)", "").replace(/\s+/g, "").toLowerCase();

                        console.log(elementID + motivation + newValue);
                        writeAffinityData(elementID, motivation, newValue);
                    }
                }
            }
        }
    }

    $(".feedback-options").toggleClass("active", false);
    $(".feedback-thanks").toggleClass("active", true);
}

// Initialise
const breakdownBox = document.querySelector(".breakdown-box");

if (breakdownBox != null) {
    breakdownBox.addEventListener("load", initaliseBreakdown());
}

// Firebase Handlers
export function setProjectData(incoming) {
    const projectData = incoming;

    name = projectData.projectName;
    description = projectData.projectDescription;
    tags = projectData.projectTags;
    goal = projectData.projectGoal;
    player = projectData.playerType;
    motivations = projectData.playerMotivations;

    populatePage();
    assignElements();
    calculateOctalysis();
    calculateKarma();
}