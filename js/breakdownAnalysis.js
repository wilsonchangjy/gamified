import { getAnswerFromChatGPT } from "./openAI.js";

// Variables
var labelColour = "#111111";
var graphColour = "";
var graphColourOpacity = "";
const octalysisChart = document.getElementsByClassName('octalysis');

Chart.register(ChartDeferred);
Chart.defaults.font.size = 12;
Chart.defaults.font.family = "synthese";

const breakdownChart = $(".breakdown-chart");
const check = $("html").css("background-color");

if (breakdownChart != null && check == "rgb(43, 48, 58)") {
    labelColour = "#ffffff";
}

var data = {
    labels: [
      'Epic Meaning',
      'Accomplishment',
      'Empowerment',
      'Ownership',
      'Social Influence',
      'Scarcity',
      'Unpredictability',
      'Avoidance'
    ],
    datasets: null
};

const options = {
    scale: {
        ticks: {
            min: 0,
            max: 100,
            display: false,
            maxTicksLimit: 2,
            font: {
                size: 0
            }
        }
    },
    scales: {
        r: {
            angleLines: {
                display: false
            },
            pointLabels: {
                color: labelColour,
                font: {
                    family: "synthese",
                    size: 20,
                    weight: 700
                }
            }
        }
    },
    animation: {
        duration: 1000,
        easing: 'easeOutQuart',
        loop: false

        // ,onComplete: function() {
        //     var a = document.createElement('a');
        //     a.href = this.toBase64Image();
        //     a.download = 'my_file_name.png';

        //     // Trigger the download
        //     a.click();
        // }
    },
    plugins: {
        deferred: {
            xOffset: "50%", yOffset: "50%", delay: 250
        },
        legend: {
            display: false
        }
    }
}

// Functions
export function setChartValues(dataName, dataArray) {
    data.datasets = [{
        label: dataName,
        data: dataArray,
        fill: true,
        backgroundColor: graphColourOpacity,
        borderColor: graphColour,
        pointBackgroundColor: graphColour,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: graphColour
    }];

    drawChart(data);
};

export async function setKarmaValue(verdict) {
    var karmaText = verdict.charAt(0).toUpperCase() + verdict.slice(1);
    var karmaColour;
    var prompt;

    if (verdict == "neutral") {
        karmaColour = "#E6AF2E";
        graphColour = "rgb(230, 175, 46)";
        graphColourOpacity = "rgb(230, 175, 46, 0.5)";
        prompt = "Tell me why a gamified product should lean more towards the White Hat core drives (Epic Meaning & Calling, Empowerment of Creativity & Feedback, and Development & Accomplishment), but ultimately needs a balance of other motivators and why that is important.";

    }
    else if (verdict == "bad") {
        karmaColour = "#DA3E52";
        graphColour = "rgb(218, 62, 82)";
        graphColourOpacity = "rgb(218, 62, 82, 0.5)";
        prompt = "Tell me why a gamified product with Black Hat core drives (Scarcity & Impatience, Loss & Avoidance, and Unpredictability & Curiosity) are not ideal, and how I can improve that.";
    }
    else if (verdict == "good") {
        karmaColour = "#02C39A";
        graphColour = "rgb(2, 195, 154)";
        graphColourOpacity = "rgb(2, 195, 154, 0.5)";
        prompt = "Tell me why a gamified product with White Hat core drives (Epic Meaning & Calling, Empowerment of Creativity & Feedback, and Development & Accomplishment) are ideal, and how I can maintain that.";
    }

    $("#karma").text(karmaText);
    $("#karma").css("color", karmaColour);
    $(".character-avatar").css("background-color", karmaColour);
    
    if (document.querySelector("#karma-description") != null) {
        const answerText = await getAnswerFromChatGPT(prompt + " Keep your responses within 100 words.");
        $("#karma-description").text(answerText);
    }
}

export async function setSuggestionPrompts(description, elements) {
    if (document.querySelector("#suggestion-description") != null) {
        const suggestion = $("#suggestion-description");

        $(".suggestion-field").click(async function() {
            if ($("#karma").text() == "Good") {
                suggestion.text("Generating suggestions...");
                $(".suggestion-field").toggleClass("active", true);
    
                const answerText = await getAnswerFromChatGPT("How do I gamify my project: " + '"' + description + '"' + "Using one or two of these gamification elements: " + elements + "." + " Keep your responses within 100 words.");
                suggestion.text(answerText);
            }
            else {
                $("#suggestion-title").text(":/");
                $("#suggestion-prompt").text("The 'Karma Rating' of your project is too low. Please reconsider trying again with different options, or review the Karma description to understand why the suggested framework might be considered unethical.");
            }
        })
    }
}

function drawChart(data) {
    new Chart(octalysisChart, {
        type: 'radar', data, options
    });
}

// Breakdown Dropdown
$("#analysis").click(function() {
    $("#analysis-display").toggleClass("click");
    $(".dropdown-button").toggleClass("click");
    $("#analysis-menu").toggleClass("show");
});

$('.analysis-option').click(function() {
    $('.analysis-option').toggleClass("click", false);
    $(this).toggleClass("click");
    $("#analysis-display").text($(this).text());
});