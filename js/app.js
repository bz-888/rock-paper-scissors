/*----- constants -----*/
const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const RPS_LOOKUP = {
    r: {img: "imgs/rock.png",
        beats: "s"},
    p: {img: "imgs/paper.png",
        beats: "r"},
    s: {img: "imgs/scissors.png",
        beats: "p"},
};

/*----- app's state (variables) -----*/

let scores;
    // p for player score
    // t for tie score
    // c for computer score

let results;
    // property of p = player
    // property of c = computer
    // values of p for paper, s for scissors, r for rock

let winner;
    // p if player wins
    // t if tie
    // c if computer wins

/*----- cached element references -----*/

const pResultEl = document.getElementById("p-result");
const cResultEl = document.getElementById("c-result");
const countdownEl = document.getElementById("countdown");

/*----- event listeners -----*/

document.querySelector("main")
    .addEventListener("click", handleChoice);


/*----- functions -----*/

init();

// initialize all state, then call render()
function init() {
    scores = {
        p: 0,
        t: 0,
        c: 0,
    };

    results = {
        p: "r",
        c: "r",
    };

    winner = "t";

    render();
}

// in response to user interaction (player makes a move)
// we update all impacted state, then, finally, we call render()
function handleChoice(evt) {
    // Guard (do nothing unless one of the three buttons was clicked)
    if (evt.target.tagName !== "BUTTON") return;
    // player has made a choice
    results.p = evt.target.innerText.toLowerCase();
    // compute a random choice for the computer
    results.c = getRandomRPS();
    winner = getWinner();
    scores[winner] ++;
    render();
}

function getWinner() {
    if (results.p === results.c) return "t";
    return RPS_LOOKUP[results.p].beats === results.c ? "p" : "c";
}

function getRandomRPS() {
    const rps = Object.keys(RPS_LOOKUP);
    const rndIdx = Math.floor(Math.random() * rps.length);
    return rps[rndIdx];
}

function renderScores() {
    for (let key in scores) {
        const scoreEl = document.getElementById(`${key}-score`);
        scoreEl.innerText = scores[key];
    }
}

function renderResults() {
    pResultEl.src = RPS_LOOKUP[results.p].img;
    cResultEl.src = RPS_LOOKUP[results.c].img;
    pResultEl.style.borderColor = winner === "p" ? "gray" : "white";
    cResultEl.style.borderColor = winner === "c" ? "gray" : "white";
}

// visualize all state to the DOM
function render() {
    renderCountdown(function(){
        renderScores();
        renderResults();
    })
};

function renderCountdown(cb) {
    let count = 3;
    // resets the audio track
    AUDIO.currentTime = 0;
    AUDIO.play();
    // makes countdown visible
    countdownEl.style.visibility = "visible";
    countdownEl.innerText = count;
    countdownEl.innerText = count;
    // first argument of setInterval is the function and the second argument is time in milliseconds, 1000 ms = 1 sec
    const timerId = setInterval(function() {
        count--;
        if (count) {
            countdownEl.innerText = count;
        } else {
            // stops counter/timer from ticking
            clearInterval(timerId);
            // hides countdown at zero
            countdownEl.style.visibility = "hidden";
            cb();
        }
    }, 1000);
}