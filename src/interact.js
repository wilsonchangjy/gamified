// Running Text
const runningText = document.querySelector(".running-text");
var style = document.createElement("style");
var position = "right";

if (runningText != null) {
    style.innerHTML = `
    @keyframes text-run {
        0%{${position}: -${runningText.offsetWidth + 8}px;}
        100%{${position}: 100%;}
    }`;
    
    document.head.append(style);
}

// Tooltip
const tooltip = $(".tooltip-container");
const tooltipIcon = $(".tooltip-icon");
const tooltipPrompt = $(".tooltip-prompt");

if (tooltip != null) {

    tooltipIcon.click(function() {
        if (tooltip.hasClass("active")) {
            tooltip.toggleClass("active", false);
            tooltipIcon.toggleClass("active", false);
            tooltipPrompt.toggleClass("active", false);

            $(".tooltip-name").text("Tooltips");
            $(".tooltip-text").text("Mouseover an option for a brief description of the element.");
        }
        else {
            tooltip.toggleClass("active", true);
            tooltipIcon.toggleClass("active", true);
        }
    });
}