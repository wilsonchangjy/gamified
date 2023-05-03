import { writeProjectData } from "./firebase.js";
import { initaliseFormConstructor, createList, getList } from "./formConstructor.js";

// Variables
var stepArray = $(".form-item");
var currentIndex;
var currentName = "Your Project";
var projectName;
var projectDescription;
var formInput = {tags: "", goal: "", player: "", motivations: ""};

const nextButtons = document.querySelectorAll("#form-next");
const backButtons = document.querySelectorAll("#form-back");

// Functions
function initaliseButtons() {
    currentIndex = stepArray.index($(".active"));

    nextButtons.forEach(nextButton => {
        nextButton.addEventListener('click', () => {
            changeStep(currentIndex + 1);
            currentIndex += 1;
            formManager();
        });
    });

    backButtons.forEach(backButton => {
        backButton.addEventListener('click', () => {
            changeStep(currentIndex - 1);
            currentIndex -= 1;
            formManager();
        });
    });
}

function formManager() {
    console.log("Current form step is: " + currentIndex);
    
    // Introduction
    if (currentIndex == 0) {
        toggleButton("back", true);
        toggleButton("next", false);
        $(".progress-bar").toggleClass("active", false);
    }
    // Project Details
    else if (currentIndex == 1) {
        verifyDetails();
        toggleButton("back", false);

        $(".progress-bar").toggleClass("active", false);

        const detailInputs = document.querySelectorAll("#name, #description");
        
        detailInputs.forEach(detailInput => {
            detailInput.addEventListener('input', () => {
                // name or description input has changed
                console.log("details updated");
                verifyDetails();
            });
        });

        currentName = projectName;
    }
    // Project Tags
    else if (currentIndex == 2) {
        toggleButton("back", false);
        $(".progress-bar").toggleClass("active", false);

        const tagInputs = document.querySelector("#tags");

        for (const child of tagInputs.children) {
            child.addEventListener('click', () => {
                console.log("tags updated");
                updateFormInputs("#tags");
            });
        }
    }
    // Disclaimer
    else if (currentIndex == 3) {
        toggleButton("back", false);
        toggleButton("next", false);
        $(".progress-bar").toggleClass("active", false);

        toggleProgress(currentIndex, false);
    }
    // Project Goals
    else if (currentIndex == 4) {      
        verifySelection(updateFormInputs("#goal"));
  
        toggleButton("back", false);
        $(".progress-bar").toggleClass("active", true);

        toggleProgress(currentIndex, true);

        const goalInputs = document.querySelector("#goal");

        for (const child of goalInputs.children) {
            child.addEventListener('click', () => {
                console.log("goal updated");
                verifySelection(updateFormInputs("#goal"));
            });
        }
    }
    // Player Types
    else if (currentIndex == 5) {
        verifySelection(updateFormInputs("#player"));

        toggleButton("back", false);
        $(".progress-bar").toggleClass("active", true);

        toggleProgress(currentIndex, true);

        const playerInputs = document.querySelector("#player");

        for (const child of playerInputs.children) {
            child.addEventListener('click', () => {
                console.log("player updated");
                verifySelection(updateFormInputs("#player"));
            });
        }
    }
    // Player Motivations
    else if (currentIndex == 6) {  
        verifySelection(updateFormInputs("#motivations"));

        toggleButton("back", false);
        $(".progress-bar").toggleClass("active", true);

        toggleProgress(currentIndex, true);

        const motivationsInput = document.querySelector("#motivations");

        for (const child of motivationsInput.children) {
            child.addEventListener('click', () => {
                console.log("motivations updated");
                verifySelection(updateFormInputs("#motivations"));
            });
        }
    }
    // Motivations Priority
    else if (currentIndex == 7) {
        toggleButton("back", false);
        $(".progress-bar").toggleClass("active", true);

        toggleProgress(currentIndex, true);

        const motivationsList = formInput.motivations.trim().split(" ");

        createList(motivationsList);
    }
    // Submit Form
    else if (currentIndex == 8) {
        formInput.motivations = getList();

        writeProjectData(projectName, projectDescription, formInput.tags, formInput.goal, formInput.player, formInput.motivations);
    }
}

function changeStep(newIndex) {
    // Form limit, will submit this form to the database
    if (newIndex == 8) {
        console.log("form submitting...");
        return;
    }

    // Next
    if (newIndex > currentIndex) {
        stepArray[currentIndex].classList.add("inactive");
        stepArray[newIndex].classList.remove("preload");
    }
    // Back
    else {
        stepArray[currentIndex].classList.add("preload");
        stepArray[newIndex].classList.remove("inactive");
    }

    stepArray[currentIndex].classList.remove("active");
    stepArray[newIndex].classList.add("active");
}

// Iniialise
const formBox = document.querySelector(".form-box");

if (formBox != null) {
    formBox.addEventListener("load", initaliseForm());
    formBox.addEventListener("load", initaliseFormConstructor());
}

function initaliseForm() {
    initaliseButtons();
    formManager();
}

// Form Inputs
function updateFormInputs(formID) {
    formInput[formID.replace('#', '')] = "";

    for (const child of $(formID).children(".active")) {        
        formInput[formID.replace('#', '')] += child.value + " ";
        console.log(projectName, projectDescription, formInput.tags, formInput.goal, formInput.player, formInput.motivations);
    }

    return $(formID).children(".active").length;
}

// Form Verification
function verifyDetails() {
    if (document.querySelector("#name").value.length < 1) {
        toggleButton("next", true);
    }
    else if (document.querySelector("#description").value.length < 1) {
        toggleButton("next", true);
    }
    else {
        toggleButton("next", false);

        projectName = document.querySelector("#name").value;
        projectDescription = document.querySelector("#description").value;
    
        const replaceName = document.querySelectorAll("#project-name");
    
        replaceName.forEach(replaceItem => {
            replaceItem.textContent = projectName;
        });
    }
}

function verifySelection(selectedCount) {
    if (selectedCount < 1) {
        toggleButton("next", true);
    }
    else {
        toggleButton("next", false);
    }
}