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
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let floorhtml = ``;
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
        lifthtml += `<div class="liftcontainer__item" id="liftcontainer__item--${j + 1}"></div>`;
    }
    firstfloorliftcontainer.innerHTML += lifthtml;
    maxfloors = parseInt(floorsinput.value)+1
    form.reset()
});
function moveUp(position) {
    console.log({ position });
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
    requestAnimationFrame(animatemoveup)
}
function moveDown(position) {
    console.log({ position })
    upperliftposition = position + 1;
    positiontomove = position
    let upperfloor;
    while (upperliftposition < maxfloors) {
        upperfloor = document.querySelector(`#floorcontainer__liftcontainer--${upperliftposition}`);
        if (!upperfloor.childElementCount) {
            upperliftposition++;
        }else{
            upperlift=upperfloor.children[0];
            break;
        }
    }
    console.log(upperlift);
    requestAnimationFrame(animatedown)
}
function animatemoveup(timestamp) {
    if (!start) start = timestamp;

    progress = timestamp - start;
    const distance = (positiontomove - liftpostion) * 135;
    const duration = distance * 10; // Adjust this value to change animation speed

    if (progress < duration) {
        const newPosition = (progress / duration) * distance;
        lowerlift.style.transform = `translateY(-${newPosition}px)`;
        stopId = requestAnimationFrame(animatemoveup);
    } else {
        cancelAnimationFrame(stopId);
        lowerlift.id = `liftcontainer__item--${positiontomove}`;
        lowerlift.style.transform = `none`;
        document.querySelector(`#floorcontainer__liftcontainer--${positiontomove}`).appendChild(lowerlift);
        start = null;
        progress = 0;
    }
}
function animatedown(timestamp) {
    if (!start) start = timestamp;

    progress = timestamp - start;
    const distance = (upperliftposition - positiontomove) * 130;
    const duration = distance * 10; // Adjust this value to change animation speed

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
    }
}