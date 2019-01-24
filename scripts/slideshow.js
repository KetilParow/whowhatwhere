$(function () {
    let projects = null;

    function getImageFile(name) {
        var names = name.split(' ');
        var filename = "";
        names.forEach(n => {
            filename = filename + n.toLowerCase()[0];
        });
        if (filename) {
            return filename + ".jpg";
        }
        return null;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href.toLowerCase();
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function processModel() {
        projects.forEach(p => {
            p.consultants.forEach(co => {
                co.imagefile = co.imagefile || getImageFile(co.name);
            });
        });
    }

    $.getJSON(window.location.origin + window.location.pathname + "projects.json", null,
        function (data, textStatus, jqXHR) {
            //alert('sdfsdf');(
            projects = data;
            if (projects.length) {
                processModel();
                let selectedId = 0;
                let idqry = getParameterByName("id");
                if (idqry) {
                    selectedId = parseInt(idqry);
                }
                projects.selectedProj = ko.observable(selectedId);
                projects.isDev = ko.observable(false);
                ko.applyBindings(projects, $("#project-prez")[0]);
            }
        }
    );

    $(".next").on("click", function (event) {
        event.stopPropagation();
        if (projects.selectedProj() < projects.length - 1) {
            projects.selectedProj(projects.selectedProj() + 1);
        }
    });

    $(".prev").on("click", function (event) {
        event.stopPropagation();
        if (projects.selectedProj() > 0) {
            projects.selectedProj(projects.selectedProj() - 1);
        }
    });
    $(".reload").on("click", function (event) {
        event.stopPropagation();
        window.location.replace(window.location.origin + window.location.pathname + (projects.selectedProj() > 0 ? ("?id=" + projects.selectedProj()) : ""));
    });

    $(".go-home").on("click", function () {
        if (!projects.isDev()) {
            return false;
        }
    });

    //$("A").on("click", function (event) { event.stopPropagation(); });
    //$(".slideshow").on("click", function (event) {
    //    if (event.button === 0) {                    
    //        let $btn = (event.clientX > ($(".slideshow").width() / 2)
    //            ? $(".next")
    //            : $(".prev"));
    //        $btn.click();
    //    }
    //});
    $(".go-home").attr("href", window.location.origin + window.location.pathname);
    
    $("#dev-toggle").on("change", function () {
        projects.isDev($(this).prop('checked'));

    });

});