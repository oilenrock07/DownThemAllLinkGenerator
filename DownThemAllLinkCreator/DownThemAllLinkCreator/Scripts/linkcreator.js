$("#btnSubmit").click(function () {
    var url = $("#url").val();
    if (url.trim() != "") {
        $.ajax({
            url: '/Home/GetHTMLString',
            type: 'POST',
            data: { url: url },
            success: function (response) {

                var result = $(response);
                var site = $("#MangaSite").val();

                switch (site) {
                    case "MangaPanda":
                        processMangaPanda(result);
                        break;
                    case "MangaPark":
                        processMangaPark(result, response);
                        break;
                }
            }
        });
    }
});

$("#btnNextChapter").click(function() {
    nextChapter();
});

$("#MangaSite").change(function() {
    selectMangaSite();
});

$("#MangaSite").click(function () {
    selectMangaSite();
});


$("#btnClear").click(function() {
    $('input:text').val("");
});

$("#btnAddToQueue").click(function (e) {
    var link = $("#formattedLink").val();
    $("#queue").val(link + "\n" + $("#queue").val());
    e.preventDefault();
});

$(document).ajaxStart(function () {
    $('.loader').show();
  }).ajaxStop(function () {
      $('.loader').hide();
  }).ready(function() {
    selectMangaSite();
});




//private functions

function selectMangaSite() {
    var site = $("#MangaSite").val();

    switch (site) {
        case "MangaPanda":
            $(".js-mangaPark").hide();

            $(".js-mangaPanda").show();
            $("#increment").val(2);
            break;
        case "MangaPark":
            $(".js-mangaPanda").hide();
            $(".js-mangaPark").show();
            break;
    }
}

function processFormattedLink(pages, increment, imageSrc) {

    $("#firstImage").val(imageSrc);

    //get the filename
    var filenameArray = imageSrc.split("/");
    var lastItemindex = filenameArray.length - 1;
    var fileName = filenameArray[lastItemindex];
    var extraString = getExtraStringInNumber(fileName);
    var number = getNumber(fileName);

    var lastNumber = parseInt(number) + ((parseInt(pages) * parseInt(increment))) - 1;
    var formttedLink = filenameArray.splice(0, lastItemindex).join("/");

    $("#formattedLink").val(formttedLink + "/" + extraString + "[" + number + ":" + lastNumber + ":" + increment + "].jpg");
}

function getNumber(fileName) {
    var site = $("#MangaSite").val();

    switch (site) {
        case "MangaPanda":
            var filenameArray = fileName.split("-");
            var lastItemindex = filenameArray.length - 1;
            return filenameArray[lastItemindex].substring(0, filenameArray[lastItemindex].indexOf("."));
        case "MangaPark":
            return fileName.substring(0, fileName.indexOf("."));
        default :
            return 1;
    }
    
}

function getExtraStringInNumber(fileName) {
    var site = $("#MangaSite").val();

    switch (site) {
        case "MangaPanda":
            var extraString = "";
            var filenameArray = fileName.split("-");
            for (var a = 0; a < filenameArray.length - 1; a++) {
                extraString = extraString + filenameArray[a] +  "-";
            }
            return extraString;
        default:
            return "";
    }

}

function processMangaPark(result, response) {

    var pages = 0; 
    var image = $(result).find("a.img-link").children();
    var imageSrc = $(image).attr("src");
    var increment = $(image).attr("i");
    var title = $(result).find(".loc").html();

    $.each(response.split('\n'), function (index, value) {
        if (value.indexOf("_page_total") > 0) {
            pages = value.replace(/^\D+/g, '').replace(";", "");
            return;
        }
    });

    $(".js-MangaTitle").html(title);
    processFormattedLink(pages, increment, imageSrc);
}

function processMangaPanda(result) {
    var pages = $(result).find("#pageMenu option:last").text();
    var image = $(result).find("#imgholder a").find("img");
    var imageSrc = $(image).attr("src");
    var increment = $("#increment").val() == "" ? 1 : parseInt($("#increment").val());

    processFormattedLink(pages, increment, imageSrc);
}

function nextChapter() {
    var site = $("#MangaSite").val();
    var currentUrl = $("#url").val();
    var currentChapter = 0;
    var splittedUrl = "";
    var url = "";

    switch (site) {
        case "MangaPanda":
            splittedUrl = currentUrl.split('/');
            currentChapter = splittedUrl[splittedUrl.length - 1];
            for (var a = 0; a < splittedUrl.length - 1; a++) {
                url = url + splittedUrl[a] + "/";
            }

            $("#url").val(url + (parseInt(currentChapter) + 1));
            break;
        case "MangaPark":
            splittedUrl = currentUrl.split('/');
            currentChapter = splittedUrl[splittedUrl.length - 2];
            var newChapter = parseInt(currentChapter.replace("c", "")) + 1;
            
            url = currentUrl.replace(currentChapter, "/c" + newChapter);

            $("#url").val(url);
            break;
    }

    $("#firstImage").val("");
    $("#formattedLink").val("");
}