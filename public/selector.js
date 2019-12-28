"use strict"

var options = {
    language: "en-US",
    inline: true,
    container: $("#selectorContainer"),
    format: "yyyy/mm/dd",
    weekStart: 1, // weeks start on monday
    startView: 0, // display days by default
    startDate: new Date(),
};

$(document).ready(function () {
    $("#selector").datepicker(options);
});

$("#selector").on("pick.datepicker", function () {
    var dateLink = $("#selector").datepicker("getDate", true);

    $("#selectorLink").removeClass("disabled");
    $("#selectorLink").attr("href", "/" + dateLink);
});
