// Variables
var cardArray = $(".card-item");
var currentIndex;
var colorArray = ["#49B6FF", "#DA3E52", "#645DD7", "#02C39A", "#E6AF2E"];
const backButton = document.querySelector("#cards-back");
const nextButton = document.querySelector("#cards-next");

// Functions
function initaliseButtons() {
    currentIndex = cardArray.index($(".active"));

    nextButton.addEventListener('click', () => {
        changeStep(currentIndex + 1);
        currentIndex += 1;
        cardManager();
    });

    backButton.addEventListener('click', () => {
        changeStep(currentIndex - 1);
        currentIndex -= 1;
        cardManager();
    });
}

function changeStep(newIndex) {
    // Next
    if (newIndex > currentIndex) {
        cardArray[newIndex].classList.remove("inactive");
        cardArray[newIndex].style.transform = "rotate(" + (Math.random() * (5 - -5) + -5) + "deg)";
        cardArray[newIndex].style.transform += "translateY(" + (Math.random() * (15 - -15) + -15) + "px)";
        cardArray[newIndex].style.transform += "translateX(" + (Math.random() * (15 - -15) + -15) + "px)";
        
        var tempIndex = Math.floor(Math.random() * colorArray.length);
        cardArray[newIndex].style.backgroundColor = colorArray[tempIndex];
        colorArray.splice(tempIndex, 1);
    }
    // Back
    else {
        cardArray[currentIndex].classList.remove("active")
        cardArray[currentIndex].classList.add("inactive");
        cardArray[currentIndex].style.transform = "translateX(150%)";
        colorArray.push(cardArray[currentIndex].style.backgroundColor);
    }

    cardArray[newIndex].classList.add("active");
}

function toggleButton(button, toggle) {
    if (button == "back") {
        $("#cards-back").toggleClass("inactive", toggle);
    
    }
    else if (button == "next") {
        $("#cards-next").toggleClass("inactive", toggle);
    }
}

function cardManager() {
    if (currentIndex == 0) {
        toggleButton("back", true);
    }
    else if (currentIndex == cardArray.length - 1) {
        toggleButton("next", true);
    }
    else {
        toggleButton("back", false);
        toggleButton("next", false);
    }
}

initaliseButtons();
cardManager();

cardArray[currentIndex].style.transform = "rotate(" + (Math.random() * (2.5 - -2.5) + -2.5) + "deg)";
var initialIndex = Math.floor(Math.random() * colorArray.length);
cardArray[currentIndex].style.backgroundColor = colorArray[initialIndex];
colorArray.splice(initialIndex, 1);