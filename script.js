let inputUsername = document.getElementById("username");
let radioEasy = document.getElementById("easy");
let radioMedium = document.getElementById("medium");
let radioHard = document.getElementById("hard");
let radioExpert = document.getElementById("expert");
let btnStart = document.getElementById("start");
let divCards = document.getElementById("cards");
let radioBtns = document.querySelectorAll('input[type="radio"]');
let divClock = document.getElementById("clock");
let divTable = document.getElementById("table");
let btnEasy = document.getElementById("btnEasy");
let btnMedium = document.getElementById("btnMedium");
let btnHard = document.getElementById("btnHard");
let btnExpert = document.getElementById("btnExpert");
let resultBtns = document.querySelectorAll(".result");

let cards = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png", "24.png", "25.png", "26.png", "27.png", "28.png", "29.png", "30.png", "31.png", "32.png", "33.png", "34.png", "35.png", "36.png", "37.png", "38.png", "39.png", "40.png", "41.png", "42.png", "43.png", "44.png", "45.png", "46.png", "47.png", "48.png", "49.png", "50.png",];

let pairs = 0;
let newCards = [];
let pushCards = () => {
    if (radioEasy.checked) {
        for(let i=0; i<8; i++) {
            newCards.push(cards[i]);
            newCards.push(cards[i]);
        }
    } else if (radioMedium.checked) {
        for(let i=0; i<18; i++) {
            newCards.push(cards[i]);
            newCards.push(cards[i]);
        }
    } else if (radioHard.checked) {
        for(let i=0; i<32; i++) {
            newCards.push(cards[i]);
            newCards.push(cards[i]);
        }
    } else if (radioExpert.checked) {
        for(let i=0; i<50; i++) {
            newCards.push(cards[i]);
            newCards.push(cards[i]);
        }
    }
    return newCards;
}

let getLevel = () => {
    let level;
    if (radioEasy.checked) {
        level = radioEasy.id;
    } else if (radioMedium.checked) {
        level = radioMedium.id;
    } else if (radioHard.checked) {
        level = radioHard.id;
    } else if (radioExpert.checked) {
        level = radioExpert.id;
    }
    return level;
}

let shuffleArray = array => {
    for (let i=array.length-1; i>0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

let shuffledCards = [];
let displayCards = (arr) => {
    let display = '';
    shuffledCards = shuffleArray(arr);
    let cardSize = '10%'; 
    if (shuffledCards.length == 100) {
        cardSize = '8%';
    }
    shuffledCards.forEach((c, i) => {
        display += `<img src="images/card.png" id="${i}" style="width: ${cardSize}"; "transition: transform 0.5s ease">`;
        if (shuffledCards.length == 16 && (i+1) % 4 == 0) {
            display += `<br>`;
        } else if (shuffledCards.length == 36 && (i+1) % 6 == 0) {
            display += `<br>`;
        } else if (shuffledCards.length == 64 && (i+1) % 8 == 0) {
            display += `<br>`;
        } else if (shuffledCards.length == 100 && (i+1) % 10 == 0) {
            display += `<br>`;
        }
    });
    divCards.innerHTML = display;
}

let level;
let users = [];
let startGame = () => {
    if (inputUsername.value == '' || inputUsername.value == null) {
        alert("Enter valid username");
        inputUsername.style.borderBottomColor = "red";
    } else {
        inputUsername.style.borderBottomColor = "black";
        resetGame();
        pairs = 0;
        radioBtns.forEach(r => {
            r.addEventListener("click", (e) => {
                divCards.innerHTML = '';
                resetGame();
            });
        });
    }
}

let resetGame = () => {
    displayCards(pushCards());
    clearInterval(clock);
    clock = undefined;
    startClock();
    newCards = [];
    level = getLevel();
}

let clock;
let counter;
let startClock = () => {
    divClock.style.animation = "pulse 0.5s infinite alternate";
    counter = 0;
    if (clock === undefined) {
        clock = setInterval(() => {
        divClock.innerHTML = `${counter}`;
        counter++;
        }, 1000);
    }
}

let flippedCards = [];
divCards.addEventListener("click", (e) => {
    if (e.target.tagName == "IMG" && !flippedCards.includes(e.target.id)) {
        let clickedCard = e.target;
        let cardIndex = parseInt(clickedCard.id);
        clickedCard.classList.add('flipped');

        clickedCard.src = clickedCard.src.includes('images/card.png') ? `images/${shuffledCards[cardIndex]}` : clickedCard.src;

        flippedCards.push(clickedCard.id);
        if (flippedCards.length === 2) {
            let firstCardIndex = parseInt(flippedCards[0]);
            let secondCardIndex = parseInt(flippedCards[1]);

            if (shuffledCards[firstCardIndex] === shuffledCards[secondCardIndex]) {
                // Cards are a match
                pairs++;
                if (pairs === shuffledCards.length/2) {
                    clearInterval(clock);
                    users.push({username: inputUsername.value, time: counter-1, level: level});
                    localStorage.setItem("users", JSON.stringify(users));
                    setTimeout(() => {
                        if (confirm("Game over! Play again?")) {
                            clock = undefined;
                            startGame();
                        }
                    }, 500) 
                }
                flippedCards = [];
            } else {
                // Cards are not a match
                setTimeout(() => {
                    flippedCards.forEach(id => {
                        document.getElementById(id).src = "images/card.png";
                        document.getElementById(id).classList.remove('flipped');
                    });
                    flippedCards = [];
                }, 500);
            }
        }
    }
});

btnStart.addEventListener("click", startGame);

//Creating table
users = JSON.parse(localStorage.getItem("users"));
let createTable = (level) => {
    let filteredUsers = users.filter(user => user.level === level); //filtering based on level
    filteredUsers.sort((a,b) => a.time - b.time);  //sorting from lowest to highest time
    let topFive = filteredUsers.slice(0, 5);
    let table = `<table class="col-12">
        <tr>
            <th>Place</th>
            <th>Username</th>
            <th>Time</th>
        </tr>`;
    for(let i=0; i<topFive.length; i++) {
        table += `
        <tr>
            <td>${i+1}.</td>
            <td>${topFive[i].username}</td>
            <td>${topFive[i].time}</td>
        </tr>`
    }
    table += `</table>`;
    return table;
}
//Displaying table
resultBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        resultBtns.forEach(btn => {
            btn.classList.remove("clicked");
        });
        btn.classList.add("clicked");
        if (btn.id == "btnEasy") {
            divTable.innerHTML = '';
            divTable.innerHTML = createTable("easy");
        } else if (btn.id == "btnMedium") {
            divTable.innerHTML = '';
            divTable.innerHTML = createTable("medium");
        } else if (btn.id == "btnHard") {
            divTable.innerHTML = '';
            divTable.innerHTML = createTable("hard");
        } else {
            divTable.innerHTML = '';
            divTable.innerHTML = createTable("expert");
        }
    });
});