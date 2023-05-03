import { packageMessage, toggleSystemRole } from "./openAI.js";

const chatName = document.querySelector("#chatbot-name");
var colorArray = ["#49B6FF", "#DA3E52", "#645DD7", "#02C39A", "#E6AF2E"];
var responseClass = "response-message";

// Iniialise
const chatbot = document.querySelector(".chatbot");
const checkbox = document.getElementById("chat-checkbox");

if (chatbot != null) {
    chatbot.addEventListener("load", initaliseChatbot());
}

function initaliseChatbot() {
    iconCircle();
    checkbox.checked = false;
}

// Functions
const askQuestion = async () => {
    if (!$("#chat-input").val()) {
        return;
    }
    
    // Gets input from user and adds it into the chat history
    const input = $("#chat-input").val();
    $("#chat-input").val("");
    $("#chat-input").attr("placeholder", "Jeepity is typing...");
    $("#chat-input").blur();
    $(".chat-field").append($("<div>").addClass("user-message").text(input));
    $(".chat-field").scrollTop($('.chat-field')[0].scrollHeight);
    
    const response = await packageMessage(input);
    $(".chat-field").append($("<div>").addClass(responseClass).text(response));
    $(".chat-field").scrollTop($('.chat-field')[0].scrollHeight);
    $("#chat-input").attr("placeholder", "Ask me about gamification!");
    $("#chat-input").focus();
}

function iconCircle() {
    const circle = document.querySelector(".chat-circle");
    circle.innerHTML = circle.textContent.replace(/\S/g, "<span>$&</span>");

    const element = circle.querySelectorAll("span");
    for (var i = 0; i < element.length; i++) {
        element[i].style.transform = "rotate(" + i*11.15 +  "deg)";
    };

    window.onscroll = function () {
        circle.style.transform = "rotate(" + window.pageYOffset/6 + "deg)";    
    };
}

$(".chat-icon").click(function() {
    $(".chat-interface").toggleClass("active", true);
    $(".chat-close").toggleClass("active", true);
    $("#chat-input").focus();
});

$(".chat-close").click(function() {
    $(".chat-interface").toggleClass("active", false);
    $(".chat-close").toggleClass("active", false);
    $("#chat-input").blur();
});

// Closes chat interface is a click is detected outside
document.addEventListener("click", function(event) {
    const chatInterface = document.querySelector(".chat-interface");
    const chatIcon = document.querySelector(".chat-icon");
    const promptElement = document.querySelectorAll(".chat-prompt");
    const tooltipPrompt = document.querySelector(".tooltip-prompt");

    if($(".chat-interface").hasClass("active")) {
        if (!chatInterface.contains(event.target) && !chatIcon.contains(event.target)) {
            $(".chat-interface").toggleClass("active", false);
            $(".chat-close").toggleClass("active", false);
            $("#chat-input").blur();
        }
    }
    
    promptElement.forEach(prompt => {
        if (prompt.contains(event.target)) {
            $(".chat-interface").toggleClass("active", true);
            $(".chat-close").toggleClass("active", true);
            $("#chat-input").focus();

            $("#chat-input").val("Tell me about " + '"' + prompt.textContent.trim() + '"');
        }
    });

    if (tooltipPrompt != null && tooltipPrompt.contains(event.target)) {
        const prompt = document.querySelector(".tooltip-name");

        $(".chat-interface").toggleClass("active", true);
        $(".chat-close").toggleClass("active", true);
        $("#chat-input").focus();

        $("#chat-input").val("Tell me about " + '"' + prompt.textContent.trim() + '"');
    }
});

checkbox.addEventListener("change", () => {
    var newName;
    var chatToggle;
    const chatIcon = $("#chat-icon");

    if (!checkbox.checked) {
        responseClass = "response-message";
        newName = chatName.textContent.replace("Grandwizard GPT", "Jeepity");
        chatName.textContent = newName;
        chatIcon.text("🤖");
        chatToggle = false;
    }
    else {
        responseClass = "response-message alt";
        newName = chatName.textContent.replace("Jeepity", "Grandwizard GPT");
        chatName.textContent = newName;
        chatIcon.text("🧙");
        chatToggle = true;
    }

    toggleSystemRole(chatToggle);
});

// Sends user input to the askQuestion function by clicking or hitting enter
$(".chat-send").click(askQuestion);
$("#chat-input").keypress(function(event) {
    if (event.key === "Enter") {
        askQuestion();
    }
});