const floorsinput = document.getElementById("liftform__input--floors");
const liftinput = document.getElementById("liftform__input--lifts");
const floorcontainer = document.querySelector(".floorcontainer");
const emptyfragment = document.createDocumentFragment();
const form = document.querySelector(".liftform")
let maxfloors;
floorcontainer.appendChild(emptyfragment)
let upperlift;
let lowerlift;
let positiontomove;
let start;
let progress;
let stopId;
let liftpostion;
let upperliftposition
let leftdoornode;
let rightdoornode;
let liftopenstart;
let liftclosestart;
let liftopenprogress;
let liftcloseprogress;
let liftopenstopId;
let liftclosestopId;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let floorhtml = ``;
    if (floorsinput.value && liftinput.value) {
        for (let i = parseInt(floorsinput.value) + 1; i > 1; i--) {
            floorhtml += `<div class="floorcontainer__floor">
                    <div class="floorcontainer__floorbtns">
                        <button class="btn" onclick="moveUp(${i - 1})">Up</button>
                        <button class="btn" onclick="moveDown(${i - 1})">Down</button>
                    </div>
                    <div class="floorcontainer__liftcontainer" data-position="${i - 1}" id="floorcontainer__liftcontainer--${i - 1}">
                    </div>
                    <p class="floorcontainer__floorno">Floor ${i - 1}</p>
                </div>`;
        }
        floorcontainer.insertAdjacentHTML("afterbegin", floorhtml);
        const firstfloorliftcontainer = document.querySelector(`#floorcontainer__liftcontainer--1`);
        let lifthtml = ``;
        for (let j = 0; j < parseInt(liftinput.value); j++) {
            lifthtml += `<div class="liftcontainer__item" id="liftcontainer__item--${j + 1}">
            <div class="liftcontainer__item--left-door"></div>
            <div class="liftcontainer__item--right-door"></div>
            </div>`;
        }
        firstfloorliftcontainer.innerHTML += lifthtml;
        maxfloors = parseInt(floorsinput.value) + 1
        form.reset()
    } else {
        alert("Plese fill the input values")
    }

},{once:true});
function moveUp(position) {
    liftpostion = position - 1;
    positiontomove = position;
    let lowerfloor;
    while (liftpostion) {
        lowerfloor = document.querySelector(`#floorcontainer__liftcontainer--${liftpostion}`)
        if (!lowerfloor.childElementCount) {
            liftpostion--;
        } else {
            lowerlift = lowerfloor.children[0];
            break;
        }
    }
    if (lowerlift) {
        requestAnimationFrame(animatemoveup)
    }else{
        alert("choose valid floor")
    }
    
}
function moveDown(position) {
    upperliftposition = position + 1;
    positiontomove = position
    let upperfloor;
    while (upperliftposition < maxfloors) {
        upperfloor = document.querySelector(`#floorcontainer__liftcontainer--${upperliftposition}`);
        if (!upperfloor.childElementCount) {
            upperliftposition++;
        } else {
            upperlift = upperfloor.children[0];
            break;
        }
    }
    if (upperlift) {
        requestAnimationFrame(animatedown)
    }else{
    alert("choose valid floor")
    }
    
}
function animatemoveup(timestamp) {
    if (!start) start = timestamp;

    progress = timestamp - start;
    const distance = (positiontomove - liftpostion) * 135;
    const duration = distance * 10; 

    if (progress < duration) {
        const newPosition = (progress / duration) * distance;
        lowerlift.style.transform = `translateY(-${newPosition}px)`;
        stopId = requestAnimationFrame(animatemoveup);
    } else {
        cancelAnimationFrame(stopId);
        lowerlift.id = `liftcontainer__item--${positiontomove}`;
        lowerlift.style.transform = `none`;
        const [leftdoor, rightdoor] = lowerlift.children;
        leftdoornode = leftdoor;
        rightdoornode = rightdoor;
        document.querySelector(`#floorcontainer__liftcontainer--${positiontomove}`).appendChild(lowerlift);
        start = null;
        progress = 0;
        requestAnimationFrame(liftopen);
    }
}
function animatedown(timestamp) {
    if (!start) start = timestamp;

    progress = timestamp - start;
    const distance = (upperliftposition - positiontomove) * 130;
    const duration = distance * 10; 

    if (progress < duration) {
        const newPosition = (progress / duration) * distance;
        upperlift.style.transform = `translateY(${newPosition}px)`;
        stopId = requestAnimationFrame(animatedown);
    } else {
        cancelAnimationFrame(stopId);
        upperlift.id = `liftcontainer__item--${positiontomove}`;
        upperlift.style.transform = `none`;
        document.querySelector(`#floorcontainer__liftcontainer--${positiontomove}`).appendChild(upperlift)
        start = null;
        progress = 0;
        requestAnimationFrame(liftopen);
    }
}
function liftopen(timestamp) {
    if (!liftopenstart) {
        liftopenstart = timestamp
    }
    liftopenprogress = timestamp - liftopenstart;
    const distance = 50;
    const duration = 2000;
    if (liftopenprogress < duration) {
        const newPosition = (liftopenprogress / duration) * distance;
        leftdoornode.style.transform = `translateX(-${newPosition}px)`;
        rightdoornode.style.transform = `translateX(${newPosition}px)`;
        liftopenstopId = requestAnimationFrame(liftopen)
    } else {
        cancelAnimationFrame(liftopenstopId);
        liftopenstart = null;
        liftopenprogress = 0;
        setTimeout(() => {
            const [leftdoor, rightdoor] = lowerlift.children;
            leftdoornode = leftdoor;
            rightdoornode = rightdoor;
            requestAnimationFrame(liftclose)
        }, 1000);
    }
}
function liftclose(timestamp) {
    if (!liftclosestart) {
        liftclosestart = timestamp
    }
    liftcloseprogress = timestamp - liftclosestart;
    const distance = 50;
    const duration = 2000;
    if (liftcloseprogress < duration) {
        const newPosition = (liftcloseprogress / duration) * distance-49;
        const newRightposition=(liftcloseprogress / duration) * distance===0?49:(liftcloseprogress / duration) * distance
        leftdoornode.style.transform = `translateX(${newPosition}px)`;
        rightdoornode.style.transform = `translateX(${49-newRightposition}px)`;
        liftclosestopId = requestAnimationFrame(liftclose)
    } else {
        leftdoornode.style.transform = `translateX(0px)`;
        rightdoornode.style.transform = `translateX(0px)`;
        cancelAnimationFrame(liftclosestopId);
        liftclosestart = null;
        liftcloseprogress = 0;
    }
}