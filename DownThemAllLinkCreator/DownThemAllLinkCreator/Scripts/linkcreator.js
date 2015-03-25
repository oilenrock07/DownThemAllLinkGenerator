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
                        processMangaPark(result);
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

$("#ddlPages").change(function() {
    setPage();
});

$("#ddlPages").click(function () {
    setPage();
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
function setPage() {
    var page = $("#ddlPages").val();
    $("#pages").val(page);
}

function selectMangaSite() {
    var site = $("#MangaSite").val();

    switch (site) {
        case "MangaPanda":
            $(".js-mangaPanda").show();
            $("#increment").val(2);

            $(".js-mangaPark").hide();
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

    var lastNumber = parseInt(number) + ((parseInt(pages) * parseInt(increment)));
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

function processMangaPark(result) {
    var pages = $("#pages").val();
    var image = $(result).find("a.img-link").children();
    var imageSrc = $(image).attr("src");
    var increment = $(image).attr("i");

    

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

    switch (site) {
        case "MangaPanda":
            var splittedUrl = currentUrl.split('/');
            currentChapter = splittedUrl[splittedUrl.length - 1];
            var url = "";
            for (var a = 0; a < splittedUrl.length - 1; a++) {
                url = url + splittedUrl[a] + "/";
            }

            $("#url").val(url + (parseInt(currentChapter) + 1));
            break;
    }

    $("#firstImage").val("");
    $("#formattedLink").val("");
}