let Map_Id = document.getElementById('theMap');
let zoom_Out = document.getElementById('zoomOut');
let zoom_In = document.getElementById('zoomIn');

zoom_Out.addEventListener("click", zoomOut);
zoom_In.addEventListener("click", zoomIn);

function zoomIn() {
    let fileName = Map_Id.src.substring(Map_Id.src.length - 14);
    if (fileName == "assets/001.png") {
        Map_Id.src = "assets/002.png";
    } else {
        Map_Id.src = "assets/003.png";
    }
}

function zoomOut() {
    let fileName = Map_Id.src.substring(Map_Id.src.length - 14);
    if (fileName == "assets/003.png") {
        Map_Id.src = "assets/002.png";
    } else {
        Map_Id.src = "assets/001.png";
    }
}

let latitudeData;
let longitudeData;
let timestampData;
let formattedDate;

window.addEventListener('load', () => {
    fetch('http://api.open-notify.org/iss-now.json')
        .then(response => response.json())
        .then(data => {
            latitudeData = data.iss_position.latitude;
            longitudeData = data.iss_position.longitude;
            timestampData = data.timestamp;
            runDate();
            updateTime();
        })
})

function runDate() {
    let date = new Date(timestampData * 1000);
    let weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    let monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    formattedDate = weekday[date.getUTCDay()] + ' ' + monthname[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() + ' (UTC)';
}

function updateTime() {
    let container1 = select('#latitudeISS');
    let container2 = select('#longitudeISS');
    let container3 = select('#timestampISS');
    container1.html(latitudeData);
    container2.html(longitudeData);
    container3.html(formattedDate);
    setTimeout(reFetchData, 3000);
}

function reFetchData() {
    fetch('http://api.open-notify.org/iss-now.json')
        .then(response => response.json())
        .then(data => {
            latitudeData = data.iss_position.latitude;
            longitudeData = data.iss_position.longitude;
            timestampData = data.timestamp;
            runDate();
            updateTime();
        })
}

let url = 'http://api.open-notify.org/iss-now.json';
let issX;
let issY;

function preload() {
    pic = loadImage("assets/iss.svg");
}

function setup() {
    let canvas = createCanvas(1135, 515);
    canvas.parent('canvasForHTML');
    setInterval(askISS, 3000)
    loadJSON(url, gotData, 'jsonp');
}

function askISS() {
    loadJSON(url, gotData, 'jsonp');
}

function gotData(data) {
    let lat = data.iss_position.latitude;
    let long = data.iss_position.longitude;
    issX = map(lat, -300, 300, 0, width);
    issY = map(long, -300, 300, 0, height);
};

function draw() {
    background(173, 194, 235);
    ellipse(issX, issY, 24, 24);
    line(mouseX, 0, mouseX, height);
    line(0, mouseY, width, mouseY);
    text("(" + mouseX + ", " + floor(mouseY) + ")", mouseX + 45, mouseY - 10)
    image(pic, mouseX - 37, mouseY - 38, pic.width / 2, pic.height / 2);
}

function windowResized() {
    let canvasDiv = document.getElementById('canvasForHTML');
    resizeCanvas(canvasDiv.clientWidth, canvasDiv.clientHeight);
}

let close_Nav = document.getElementById('closeNav');
let open_Nav = document.getElementById('openNav');

close_Nav.addEventListener("click", closeNav);
open_Nav.addEventListener("click", openNav);

function openNav() {
    if ($(window).width() < 600) {
        document.getElementById("myNav").style.width = "100%";
    } else {
        document.getElementById("myNav").style.width = "30%";
    }
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

$('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    let $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) {
                        return false;
                    } else {
                        $target.attr('tabindex', '-1');
                        $target.focus();
                    };
                });
            }
        }
    });