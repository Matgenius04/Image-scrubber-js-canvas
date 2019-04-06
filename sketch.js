// Setup canvas
const c = document.querySelector('canvas');
const ctx = c.getContext('2d');

// Creating class Brush
class Brush {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    changeX(xPixels) {
        this.x += xPixels;
    }
    changeY(yPixels) {
        this.y += yPixels;
    }
    changeSize(size) {
        this.size += size;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
const thisBrush = new Brush(document.body.clientWidth, document.body.clientHeight, 50);
let img = document.querySelector('img');
let clippath = new Path2D(); // the path that supposed to be shown
setup();

function work() {
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight;
    ctx.translate(c.width / 2, c.height / 2); // center origin at the middle of canvas
    ctx.scale(1, -1); // flip canvas over x-axis
}

function setup() {
    // more canvas setup
    infoBox();
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight;
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2); // center origin at the middle of canvas
    ctx.scale(1, -1); // flip canvas over x-axis
    window.addEventListener('resize', ev => {
        c.width = document.body.clientWidth;
        c.height = document.body.clientHeight;
        ctx.restore();
        ctx.translate(c.width / 2, c.height / 2); // center origin at the middle of canvas
        ctx.scale(1, -1); // flip canvas over x-axis
    });
    // moving brush with mouse
    function mousemove(ev) {
        // if user presses presses and moves mouse, send brush to that point
        let x = ev.clientX - (c.width / 2);
        let y = -ev.clientY + (c.height / 2);
        thisBrush.moveTo(x, y);
        let circlepath = new Path2D();
        circlepath.arc(thisBrush.x, thisBrush.y, thisBrush.size, 0, 2 * Math.PI);
        clippath.addPath(circlepath);
    }
    window.addEventListener('keydown', (ev) => {
        switch (ev.key) {
            case '+':
                thisBrush.changeSize(10);
                break;
            case '_':
                thisBrush.changeSize(-10);
                break;
            case '=':
                thisBrush.changeSize(10);
                break;
            case '-':
                thisBrush.changeSize(-10);
                break;
            case 'r':
                getRandomImage();
                break;
            case 'Enter':
                (document.getElementById('infobox').hidden == false) ? document.getElementById('infobox').hidden = true: document.getElementById('infobox').hidden = false;
                break;
        }
    });
    c.addEventListener('mousedown', () => {
        c.addEventListener('mousemove', ev => mousemove(ev), false);
    });
    c.addEventListener('mouseup', () => {
        c.removeEventListener('mousemove', ev => mousemove(ev), false);
    });
    getRandomImage();
    draw();
}

function draw() {
    // clear canvas
    work();
    ctx.fillStyle = "rgb(30,30,30)";
    ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
    thisBrush.draw();
    let imgwidth;
    imgwidth = img.naturalWidth / img.naturalHeight * c.width;
    ctx.fillStyle = "white";
    ctx.fillRect(-imgwidth / 2, -c.height / 2, imgwidth, c.height);
    ctx.clip(clippath);
    ctx.scale(1, -1);
    ctx.drawImage(img, -imgwidth / 2, -c.height / 2, imgwidth, c.height);
    ctx.scale(1, -1);
    requestAnimationFrame(draw);
}

function getRandomImage() {
    clippath = new Path2D();
    fetch("https://source.unsplash.com/random", {
        cors: "no-cors"
    }).then(async (res) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            img.src = reader.result;
        };
        reader.readAsDataURL(await res.blob());
    });
}

function infoBox() {
    const infobox = document.getElementById('infobox');
    const exit = document.createElement('div');
    exit.innerHTML = 'x';
    exit.style.font = "20px Code Source Pro,sans-serif";
    exit.style.cssFloat = "right";
    exit.style.border = "3px solid;";
    exit.style.borderStyle = "25px";
    exit.onclick = () => {
        infobox.hidden = true;
    };
    infobox.appendChild(exit);
    infobox.id = 'infobox';
    infobox.style.position = 'absolute';
    infobox.style.backgroundColor = "white";
    infobox.style.height = 'min-content';
    infobox.style.width = '20%';
    infobox.style.right = "20px";
    infobox.style.top = "20px";
    infobox.style.border = '3px solid';
    infobox.style.color = 'black';
    infobox.style.zIndex = 100;
    let unordered = document.createElement('ul');
    let text1 = document.createElement('li');
    text1.innerHTML = "Clicking or pressing the screen will start uncovering the image.";
    let text2 = document.createElement('li');
    text2.innerHTML = "You can bring up this menu by pressing enter.";
    let text3 = document.createElement('li');
    text3.innerHTML = "Pressing R will change the image and pressing + and minus will change the brush size";
    let text4 = document.createElement('li');
    text4.innerHTML = "Have Fun!";
    unordered.appendChild(text1);
    unordered.appendChild(text2);
    unordered.appendChild(text3);
    unordered.appendChild(text4);
    infobox.appendChild(unordered);
}

