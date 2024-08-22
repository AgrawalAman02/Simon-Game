const h2 = document.querySelector("h4");
const body = document.querySelector("body");
const record = document.querySelector(".record");
const btns = document.querySelectorAll(".btn");
const restartBtn = document.querySelector(".restart-btn");
let level = 0;
let gstatus = false;
let hScore = 0;
const colseq = ["red", "green", "blue", "orange"];
let seqs = [];
let userseq = [];
let currTime = new Date().toLocaleTimeString();
let hcurrTime = "00:00:00";


function getMemory (){
    return JSON.parse(localStorage.getItem("scores"));
}

let memory = getMemory() || [];
function showMemory(){
    record.innerHTML = ""; // Clear existing content
    memory.forEach((score)=>{
        let divElem = document.createElement("div");
        divElem.className = "recordDiv";
        divElem.innerHTML= ` <br><li> ${score} </li>`;
        record.append(divElem);
    });
}
showMemory();

const highScore = (level) => {
    if (level > hScore) {
        hScore = level;
        hcurrTime = new Date().toLocaleTimeString();
    }
    currTime = new Date().toLocaleTimeString();
    return hScore;
}

const btnFlash = (btn) => {
    btn.classList.add("flash");

    setTimeout(() => {
        btn.classList.remove("flash");
    }, 300);
}

const userFlash = (btn) => {
    btn.classList.add("userflash");

    setTimeout(() => {
        btn.classList.remove("userflash");
    }, 300);
}

const handleLevel = () => {
    userseq = [];
    level++;
    if (level == 1) {
        h2.innerText = `Level ${level} , Have A Good Game...`;
    } else if (level > 1 && level <= 4) {
        h2.innerText = `Level ${level} , Good Start👏🏻`;
    } else if (level <= 10) {
        h2.innerText = `Level ${level}, Hmm! great going, keep it up...`;
    } else {
        h2.innerText = `Level ${level} , Acknowledged your memory! 🍾`;
    }

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = colseq[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);

    btnFlash(randBtn)

    seqs.push(randColor);
}

document.addEventListener("keypress", () => {
    if (gstatus == false) {
        gstatus = true;
        restartBtn.style.display = "none"; // Hide the restart button
        handleLevel();
    }
});

function checkAns(idx) {
    if (userseq[idx] === seqs[idx]) {
        if (userseq.length == seqs.length) {
            setTimeout(handleLevel, 500);
        }
    } else {
        h2.innerHTML = `Game Over ! Nice Try! <b>Your Score is ${level}.</b> <br> <hr> Your Highest Score : ${highScore(level)} at ${hcurrTime}.  <br><hr><i>Press any key or restart button to start again!</i>`;
        document.querySelector("body").style.backgroundColor = "red";
        document.querySelector("body").style.color = "white";
        btns.forEach(btn => btn.style.borderColor = "white");
        memory.push(`Score : ${level} at ${currTime}`);
        localStorage.setItem("scores", JSON.stringify(memory));
        showMemory();

        setTimeout(() => {
            document.querySelector("body").style.backgroundColor = "#e3ce6d40";
            document.querySelector("body").style.color = "black";
            btns.forEach(btn => btn.style.borderColor = "black");
        }, 200);

        restartBtn.style.display = "block"; // Show the restart button after game over
        reset();
    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userseq.push(userColor);

    checkAns(userseq.length - 1);
}

for (let btn of btns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    gstatus = false;
    seqs = [];
    userseq = [];
    level = 0;
}

// Clear Records Functionality
const clearBtn = document.querySelector(".clear-btn");

clearBtn.addEventListener("click", () => {
    // Clear local storage
    localStorage.removeItem("scores");

    // Clear the memory array and update the display
    memory = [];
    showMemory();

    // Optionally provide feedback to the user
    h2.innerText = "Records cleared! Press any key to start a new game.";
});

// Restart Button Functionality
restartBtn.addEventListener("click", () => {
    reset();
    restartBtn.style.display = "none"; // Hide the restart button when the game starts
    handleLevel();
});
