import { getGallery } from "./firebase.js";

// Variables
var tagArray = { ecommerce: "E-Commerce", education: "Education", entertainment: "Entertainment", foodbeverage: "Food & Beverage", finance: "Finance", healthcare: "Healthcare", lifestyle: "Lifestyle", nonprofit: "Non-profit", personal: "Personal", productivity: "Productivity", service: "Service", socialnetworking: "Social Networking", technology: "Technology", transport: "Transport", utility: "Utility" };

// Initialise
const gallery = document.querySelector(".gallery-content");

if (gallery != null) {
    gallery.addEventListener("load", initialiseGallery());
}

// Gallery 
async function initialiseGallery() {
    // populate gallery from database
    const galleryContent = await getGallery();

    for (var child in galleryContent) {
        const grandChild = galleryContent[child];
        const name = grandChild.projectName;
        const description = grandChild.projectDescription;

        var tags = grandChild.projectTags.trim().split(" ");
        var newTags = "";

        for (var i = 0; i < tags.length; i++) {
            const reference = tags[i];
            newTags += tagArray[reference] + ", ";
        }

        const listItem = document.createElement("a");
        listItem.className = "gallery-card";
        listItem.setAttribute("id", child);
        listItem.setAttribute("href", "gallery-single.html");
        listItem.innerHTML = `
        <img src="/images/default.jpg">
        <h4>${name}</h4>
        <p class="card-text">${description}</p>
        <h5>${newTags.slice(0, -2)}</h5>
        `;

        listItem.addEventListener("click", () => {
            localStorage.view = listItem.id;
        });

        gallery.appendChild(listItem);
    }

    constructGallery();
}

function constructGallery() {
    var numberOfItems = $(".gallery-content .gallery-card").length;
    var limitPerPage = 12; //number of cards per page
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5; //number of pagination elements visible
    var currentPage;

    function showPage(whichPage){
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".gallery-content .gallery-card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagination li").slice(0, totalPages).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("active", item === currentPage).append($("<a>").addClass("page-link").attr({href: "#scroll-target"}).text(item || "...")).insertBefore("#pagination-target");
        });

        $(".back-button").toggleClass("inactive", currentPage === 1);
        $(".next-button").toggleClass("inactive", currentPage === totalPages);
        return true;
    }

    $(".nav-buttons").append(
        $("<li>").addClass("back-button").append($("<a>").attr({href: "#scroll-target"}).text("Back")),
        $("<li>").addClass("next-button").append($("<a>").attr({href: "#scroll-target"}).text("Next"))
    );

    $(".gallery-content").show();
    showPage(1);

    $(document).on("click", ".pagination li.current-page:not(.active)", function(){
        return showPage(+$(this).text());
    });

    $(".next-button").on("click", function(){
        return showPage(currentPage + 1);
    });

    $(".back-button").on("click", function(){
        return showPage(currentPage - 1);
    });
}

function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3 ) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3 ) >> 1;

    if (totalPages <= maxLength) {
        return range(1, totalPages);
    }

    if(page <= maxLength - sideWidth - 1  - rightWidth) {
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}