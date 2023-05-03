// Add in form navigation at the end of each form step
$(".form-nav").append(
    $("<div>").addClass("progress-bar").append($("<ul>")
    .append($("<li>").append($("<div>").addClass("progress-item").attr({id:"progress-one"})).append($("<p>").text("Details")))
    .append($("<li>").append($("<div>").addClass("progress-item").attr({id:"progress-two"})).append($("<p>").text("Goals")))
    .append($("<li>").append($("<div>").addClass("progress-item").attr({id:"progress-three"})).append($("<p>").text("Players")))
    .append($("<li>").append($("<div>").addClass("progress-item").attr({id:"progress-four"})).append($("<p>").text("Motivations")))
    .append($("<li>").append($("<div>").addClass("progress-item").attr({id:"progress-five"})).append($("<p>").text("Priority")))),
    $("<div>").addClass("form-buttons")
    .append($("<a>").addClass("back-button").attr({id:"form-back"}).text("Back"))
    .append($("<a>").addClass("next-button").attr({id:"form-next"}).text("Next"))
);

const progressArray = ["#progress-one", "#progress-two", "#progress-three", "#progress-four", "#progress-five"];

function toggleButton(button, toggle) {
    if (button == "back") {
        $('[id="form-back"]').toggleClass("inactive", toggle);
    
    }
    else if (button == "next") {
        $('[id="form-next"]').toggleClass("inactive", toggle);
    }
}

function toggleProgress(progressIndex, toggle) {
    clearProgress();

    for (var i = 0; i < progressIndex - 2; i++) {

        const progressTarget = document.querySelectorAll(progressArray[i]);

        progressTarget.forEach(progressItem => {
            $(progressItem).toggleClass("active", toggle);
            $(progressItem).next().toggleClass("active", toggle);
        })
    }
}

function clearProgress() {
    const allProgress = document.querySelectorAll(progressArray.join());
    
    allProgress.forEach(progressItem => {
        $(progressItem).toggleClass("active", false);
        $(progressItem).toggleClass("current", false);
        $(progressItem).next().toggleClass("active", false);
    });
}