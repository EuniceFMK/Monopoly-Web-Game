let p1pos = 0;
let squares;
let token1;
let token2;
let currentPlayer = 1;
let p2pos = 0;
const takeAChanceText = ["Second Place in Beauty Contest: $10", "Bank Pays You Dividend of  $50", "Repair your Properties. You owe $250", "Speeding Fine: $15", "Holiday Fund Matures:Receive $100", "Pay Hospital Fees: $100"];
const takeAChanceMoney = [10, 50, -250, -15, 100, -100];
let propertiesP1 = [];
let propertiesP2 = [];
let movePlayerId = "";
let moveSteps = 0;
let moveRand1 = 0;
let moveRand2 = 0;
let moveCount = 0;
let propArray = [];
let rand1 = 0;
let rand2 = 0;

$(() => {
    $("#RollDice").prop("disabled", true);
    alert("Welcome to Game of Monopoly. Make sure to load property purchased prices first by clicking Load property prices when games load")
    positionElements();
    let propButton = $("<br><button id='prop'>Load properties purchased price</button>")
    $("h2").append(propButton)
    $("#prop").on('click', function () {
        let properties = $("section")
        AjaxProcessCall("https://thor.cnt.sast.ca/~aulakhha/filesAssLab/lab3.php", { action: "propertyPrices" }, "json", "POST", success, error)
        console.log(propArray);

        $("#RollDice").prop("disabled", false);
        $("#prop").prop("disabled", true);
    })
    function success(data) {
        console.log("Server response:", data);
        data.forEach((val, i) => {
            $(squares[i]).attr("val", val);
        });
        alert("Property prices loaded successfully!");
        //console.log(squares)
    }
    function error() {
        alert("Property prices not loaded successfully!");
    }
    $("#RollDice").click(function () {
        AjaxProcessCall("https://thor.cnt.sast.ca/~aulakhha/filesAssLab/lab3.php", { action: "diceroll" }, "json", "POST", getsuccess, error)

    });

    function getsuccess(data) {
        console.log("Server response:", data);
        rand1 = data.dice1;
        rand2 = data.dice2;
        rollDice()
    }

    squares = $("section");
    //let playerDiv = document.createElement("img")

    token1 = $("<img>", { src: "images/player1.png" });
    //token1.prop("src","images/player1.png");
    token1.addClass("token");

    $(squares[p1pos]).append(token1);

    token2 = $("<img>", { src: "images/player2.png" });
    token2.addClass("token");

    $(squares[p2pos]).append(token2);

})
function AjaxProcessCall(url, data, dataType, type, success, error) {
    let options = {}
    options['url'] = url;
    options['data'] = data;
    options['dataType'] = dataType;
    options['type'] = type;
    options['success'] = success;
    options['error'] = error;

    return $.ajax(options);
}
//Set the border colors by adding a new class to the sections
$("#boardwalk").addClass("left")
$("#mediterranean").addClass("top")
$("#baltic").addClass("top")
$("#oriental").addClass("top")
$("#connecticut").addClass("top")
$("#vermont").addClass("top")
$("#stcharles").addClass("right")
$("#states").addClass("right")
$("#virginia").addClass("right")
$("#stjames").addClass("right")
$("#tennessee").addClass("right")
$("#newyork").addClass("right")
$("#kentucky").addClass("bottom")
$("#indiana").addClass("bottom")
$("#illinois").addClass("bottom")
$("#atlantic").addClass("bottom")
$("#ventnor").addClass("bottom")
$("#marvin").addClass("bottom")
$("#pacific").addClass("left")
$("#northcarolina").addClass("left")
$("#pennsylvania").addClass("left")
$("#parkplace").addClass("left")

//function to place the elements in the correct places
function positionElements() {
    let nodeList = $("section");


    for (let count = 0; count < nodeList.length; count++) {
        let posnStr = $(nodeList[count]).attr("suite");
        let rowNo = parseInt(posnStr.substring(0, 2));
        let colNo = parseInt(posnStr.substring(2, 4));
        $(nodeList[count]).css("grid-row", `${rowNo}/${rowNo + 1}`);
        $(nodeList[count]).css("grid-column", `${colNo}/${colNo + 1}`);

    }

    //Place the player text
    $("#player1").html("<p style='font-weight: bold;'>Player1</p>")
    $("#player2").html("<p style='font-weight: bold;'>Player2</p>")

    //Place the player image 
    let player1 = $("<img>", { src: "./images/player1.png" })

    let player2 = $("<img>", { src: "./images/player2.png" })

    $("#player1").append("<img id='p1img' src='./images/player1.png'>")
    $("#player2").append("<img id='p2img' src='./images/player2.png'>")

    //Place the amount of each cases 
    $("section").each(function () {
        let val = parseInt($(this).attr("val"));
        if (val < 0 || isNaN(val)) {

        }
        else {
            $(this).append(`<p>$${val}</p>`)
        }
    }
    )
}


function ChestChanceRule(playerId) {
    let balanceidv = $(`#${playerId}amt`);
    let balance = parseInt(balanceidv.text().replace("$", ""));
    let rand = Math.floor(Math.random() * takeAChanceText.length);
    alert(takeAChanceText[rand]);
    balance += takeAChanceMoney[rand];
    balanceidv.text(`$${balance}`);
}

function GoRule(playerId) {
    let balanceidv = $(`#${playerId}amt`);
    let balance = parseInt(balanceidv.text().replace("$", ""));
    balance += 200;
    balanceidv.text(`$${balance}`)
    console.log(playerId + " gained " + 200 + "$ for passing on go")
}

function TaxRule(playerId, squareId) {
    let balanceidv = $(`#${playerId}amt`);
    let balance = parseInt(balanceidv.text().replace("$", ""));
    let tax = $(`#${squareId}`).attr("val");
    balance -= tax;
    balanceidv.text(`$${balance}`)
    console.log(playerId + " paid " + tax + " for tax")
    $("#RollDice").prop("disabled", false)
    if (balance < 0) {
        console.log(`${playerId} loses`);
    }

}

function gotojail(playerId) {
    //let playerImg = playerId === "player1" ? token1 : token2;

    // Supprime le pion de sa case actuelle
    if (playerId == "player1") {
        if ($(squares[p1pos]).has(token1)) {
            $(squares[p1pos]).detach(token1);
        }
        // Cherche la position de la case prison 
        p1pos = $("section#jail").index();

        $(squares[p1pos]).append(token1);
    } else {
        if ($(squares[p2pos]).has(token2)) {
            $(squares[p2pos]).detach(token2);
        }

        p2pos = $("section#jail").index();

        $(squares[p2pos]).append(token2);
    }
    console.log(playerId + " goes to jail")
    $("#RollDice").prop("disabled", true)
}

function Jail(playerId) {
    let balanceidv = $(`#${playerId}amt`);
    let balance = parseInt($(balanceidv).text().replace("$", ""));
    balance -= 50;
    $(balanceidv).text(`$${balance}`)
    console.log(playerId + " paid " + 50 + " for jail")

    if (balance < 0) {
        console.log(`${playerId} loses`);
    }
}

function rollDice() {
    $("#RollDice").prop("disabled", true)

    let dice1 = $("<img>", { src: `./images/dice${rand1}.png` })
    let dice2 = $("<img>", { src: `./images/dice${rand2}.png` })

    $("#p1img").css("border", "none")
    $("#p2img").css("border", "none")
    $("#die1").html("")
    $("#die1").append(dice1);
    $("#die2").html("")
    $("#die2").append(dice2);
    let steps = rand1 + rand2;
    if (currentPlayer == 1) {
        startMove("player1", steps, rand1, rand2);
        $("#p1img").css("border", "dashed red 2px")
    }
    if (currentPlayer == 2) {
        startMove("player2", steps, rand1, rand2);
        $("#p2img").css("border", "dashed red 2px")
    }
    if (rand1 != rand2) {
        currentPlayer = currentPlayer == 1 ? 2 : 1;
    }
}

function startMove(playerId, steps, rand1, rand2) {
    movePlayerId = playerId;
    moveSteps = steps;
    moveRand1 = rand1;
    moveRand2 = rand2;
    moveCount = 0;
    moveStep(); // démarre le mouvement
}

function moveStep() {
    if (movePlayerId == "player1") {
        if ($(squares[p1pos]).find(token1)) {
            $(squares[p1pos]).detach(token1);
        }
        p1pos = (p1pos + 1) % squares.length;
        $(squares[p1pos]).append(token1);
    }
    if (movePlayerId == "player2") {
        if ($(squares[p2pos]).find(token2)) {
            $(squares[p2pos]).detach(token2);
        }
        p2pos = (p2pos + 1) % squares.length;
        $(squares[p2pos]).append(token2);
    }

    moveCount++;

    if (moveCount < moveSteps) {
        setTimeout(moveStep, 500); // continue au prochain pas
    } else {
        // arrivé à la dernière case
        handleSquare(movePlayerId, squares[movePlayerId === "player1" ? p1pos : p2pos].id, moveRand1, moveRand2);
    }
}

function handleSquare(playerId, squareId, rand1, rand2) {
    // Go
    if (squareId == "go") {
        GoRule(playerId);
    }

    // Tax
    else if (squareId == "incometax" || squareId == "luxurytax") {
        TaxRule(playerId, squareId);

    }

    // Chance / Community Chest
    else if (squareId.startsWith("chance") || squareId.startsWith("cc")) {
        ChestChanceRule(playerId);
    }

    // Go to Jail
    else if (squareId == "gotojail") {
        gotojail(playerId);
        return;
    }
    else if (squareId == "jail") {
        Jail(playerId);
    }
    else
        handleProperty(playerId, squareId, rand1, rand2)

    $("#RollDice").prop("disabled", false)

}

function handleProperty(playerId, squareId, rand1, rand2) {

    let balance1elem = $("#player1amt");
    let balance2elem = $("#player2amt");
    let balance1 = Number(balance1elem.text().replace("$", ""));
    let balance2 = Number(balance2elem.text().replace("$", ""));
    let propdiv = $(`#${squareId}`);
    let cost = Number(propdiv.attr("val"));
    let percentage = 0.1

    //case player1
    if (playerId == "player1") {
        //purchase the square
        if (!propertiesP1.includes(squareId) && !propertiesP2.includes(squareId)) {
            balance1 -= cost;
            propertiesP1.push(squareId);
            propdiv.css("backgroundColor", "#90ee90")
            console.log("Player 1 purchased " + getPropertyName(squareId))
        }
        //Pay rent
        if (propertiesP2.includes(squareId)) {

            //Utilities fees
            if (squareId == "water" || squareId == "electric") {
                let dicesum = rand1 + rand2;
                balance1 -= dicesum * 5;
                balance2 += dicesum * 5;
                console.log("Player 1 paid " + dicesum + "* 5= " + dicesum * 5 + " $ for utlities ")
            }

            //railroads rent
            if (squareId == "readingrr" || squareId == "shortlinerr" || squareId == "pennsylvaniarr" || squareId == "borr") {
                let rrcount = 0;
                const railroads = ["readingrr", "shortlinerr", "pennsylvaniarr", "borr"];
                propertiesP2.forEach(elem => {
                    if (railroads.includes(elem)) rrcount++;
                })

                balance1 -= Number(25 * rrcount);
                balance2 += Number(25 * rrcount);
                console.log("Player1 paid " + Number(25 * rrcount) + " $ for railroads rent ")
            }

            if (propdiv.hasClass("yellow") || propdiv.hasClass("brown") || propdiv.hasClass("lightblue") || propdiv.hasClass("purple") || propdiv.hasClass("orange") || propdiv.hasClass("red") || propdiv.hasClass("green") || propdiv.hasClass("blue")) {
                balance1 -= + Number(parseInt(cost * percentage))
                balance2 += + Number(parseInt(cost * percentage))
                console.log("Player 1 paid " + Number(parseInt(cost * percentage)) + " $ for rent ")
                percentage += 0.2
            }
        }

    }
    if (playerId == "player2") {
        if (!propertiesP1.includes(squareId) && !propertiesP2.includes(squareId)) {
            balance2 -= cost;
            propertiesP2.push(squareId);
            propdiv.css("backgroundColor", "#ff9999")
            console.log("Player 2 purchased " + getPropertyName(squareId))
        }
        //Pay rent
        if (propertiesP1.includes(squareId)) {
            //Utilities fees
            if (squareId == "water" || squareId == "electric") {
                let dicesum = rand1 + rand2;
                balance2 -= dicesum * 5;
                balance1 += dicesum * 5;
                console.log("Player 2 paid " + dicesum * 5 + " $ for railroads rent ")
            }

            //railroads rent
            if (squareId == "readingrr" || squareId == "shortlinerr" || squareId == "pennsylvaniarr" || squareId == "borr") {
                let rrcount = 0;
                propertiesP1.forEach((elem) => {
                    if (elem == "readingrr")
                        rrcount++;
                    if (elem == "shortlinerr")
                        rrcount++;
                    if (elem == "pennsylvaniarr")
                        rrcount++;
                    if (elem == "borr")
                        rrcount++;
                })
                balance2 -= Number(25 * rrcount);
                balance1 += Number(25 * rrcount);
                console.log("Player 2 paid " + Number(25 * rrcount) + " $ for railroads rent ")
            }

            if (propdiv.hasClass("yellow") || propdiv.hasClass("brown") || propdiv.hasClass("lightblue") || propdiv.hasClass("purple") || propdiv.hasClass("orange") || propdiv.hasClass("red") || propdiv.hasClass("green") || propdiv.hasClass("blue")) {
                balance2 -= Number(parseInt(cost * percentage))
                balance1 += Number(parseInt(cost * percentage))
                console.log("Player 2 paid " + Number(parseInt(cost * percentage)) + " $ for rent ")
                percentage += 0.2
            }
        }
    }
    balance1elem.text(`$${balance1}`)
    balance2elem.text(`$${balance2}`)
    $("#RollDice").prop("disabled", false)

    if (balance1 < 0) {
        endGame("Player1");
    }
    if (balance2 < 0) {
        endGame("Player2");
    }

}

function testMove(playerId, steps) {
    if (playerId == "player1")
        startMove("player1", steps, 1, 1);
    else
        startMove("player2", steps, 1, 1);
}

function getPropertyName(squareId) {
    // Remplace les underscores ou les abréviations par un nom plus lisible
    const names = {
        // Propriétés
        "mediterranean": "Mediterranean Avenue",
        "baltic": "Baltic Avenue",
        "oriental": "Oriental Avenue",
        "vermont": "Vermont Avenue",
        "connecticut": "Connecticut Avenue",
        "stcharles": "St. Charles Place",
        "states": "States Avenue",
        "virginia": "Virginia Avenue",
        "stjames": "St. James Place",
        "tennessee": "Tennessee Avenue",
        "newyork": "New York Avenue",
        "kentucky": "Kentucky Avenue",
        "indiana": "Indiana Avenue",
        "illinois": "Illinois Avenue",
        "atlantic": "Atlantic Avenue",
        "ventnor": "Ventnor Avenue",
        "marvin": "Marvin Gardens",
        "pacific": "Pacific Avenue",
        "northcarolina": "North Carolina Avenue",
        "pennsylvania": "Pennsylvania Avenue",
        "parkplace": "Park Place",
        "boardwalk": "Boardwalk",

        // Railroads
        "readingrr": "Reading Railroad",
        "shortlinerr": "Short Line Railroad",
        "pennsylvaniarr": "Pennsylvania Railroad",
        "borr": "B&O Railroad",

        // Utilities
        "water": "Water Works",
        "electric": "Electric Company",

        // Special squares
        "go": "Go",
        "jail": "Jail",
        "gotojail": "Go to Jail",
        "incometax": "Income Tax",
        "luxurytax": "Luxury Tax",

        // Chance / Community Chest
        "chance1": "Chance",
        "chance2": "Chance",
        "chance3": "Chance",
        "cc1": "Community Chest",
        "cc2": "Community Chest",
        "cc3": "Community Chest"
    };


    return names[squareId]
}

function endGame(loser) {
    alert(`${loser} loses! Game over.`);
    $("#RollDice").prop("disabled", true); // block the bouton
}

