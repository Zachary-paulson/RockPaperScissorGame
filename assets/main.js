$(document).ready(function () {
    //firebase
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyBk_mX8JY8rY2Z5YbQe-hqDkJbJJP_KoFE",
        authDomain: "rpsbattlearenazjp.firebaseapp.com",
        databaseURL: "https://rpsbattlearenazjp.firebaseio.com",
        projectId: "rpsbattlearenazjp",
        storageBucket: "",
        messagingSenderId: "685148480823"
    };
    firebase.initializeApp(config);
    // game object
    let players = {
        playerOne: null,
        playerTwo: null,
        yourPlayerName: "",
        playerOneName: "",
        playerTwoName: "",
        playerOneAtk: "",
        playerTwoAtk: "",
        playerOneScore: {
            win: 0,
            lose: 0,
            draw: 0
        },
        playerTwoScore: {
            win: 0,
            lose: 0,
            draw: 0
        }

    };

    let game = {
        gamePiece: ["assets/images/rock.png", "assets/images/paper.png", "assets/images/scissor.png"],
        turn: 0
    };

    //my database
    const database = firebase.database();

    //lister for when a player exists
    database.ref("/players/").on("value", function (snapeshot) {
        if (snapeshot.child("playerOne").exists()) {
            players.playerOne = snapeshot.val().playerOne;
            players.playerOneName = players.playerOne.name;
            $("#playerOnePanel").text(players.playerOneName + " is ready to battle!");
        }
        else {
            players.playerOne = null;
            players.playerOneName = "";
            database.ref("/chat/").remove();
            database.ref("/turn.").remove();
        }

        if (snapeshot.child("playerTwo").exists()) {
            players.playerTwo = snapeshot.val().playerTwo;
            players.playerTwoName = players.playerTwo.name;
            $("#playerTwoPanel").text(players.playerTwoName + " is ready to battle!");
        }
        else {
            players.playerTwo = null;
            players.playerTwoName = "";
            database.ref("/chat/").remove();
            database.ref("/turn.").remove();
        }

        if (players.playerOne && players.playerTwo) {
            console.log("a");
            $("#gmMsg").text("Waiting on " + players.playerOneName + " to choose...");
        }

        if (!players.playerOne && !players.playerTwo) {

        }
    });

    $(".usernameInputBtn").on("click", function (event) {
        event.preventDefault();

        // First, make sure that the name field is non-empty and we are still waiting for a player
        if (($(".usernameInput").val().trim() !== "")) {

            // Adding players.playerOne
            if (players.playerOne === null) {
                console.log("Adding Player 1");

                players.yourPlayerName = $(".usernameInput").val().trim();

                $(".lead").text("Welcome to the battle " + players.yourPlayerName + "!");

                players.playerOne = {
                    name: players.yourPlayerName,
                    win: 0,
                    loss: 0,
                    draw: 0,
                    atk: ""
                };

                // Add players.playerOne to the database
                database.ref().child("/players/playerOne").set(players.playerOne);

                // Set the turn value to 1, as players.playerOne goes first
                database.ref().child("/turn").set(1);

                // If this user disconnects by closing or refreshing the browser, remove the user from the database
                database.ref("/players/playerOne").onDisconnect().remove();

            } else if ((players.playerOne !== null) && (players.playerTwo === null)) {
                // Adding players.playerTwo
                console.log("Adding Player 2");

                players.yourPlayerName = $(".usernameInput").val().trim();

                $(".lead").text("Welcome to the battle " + players.yourPlayerName + "!");

                players.playerTwo = {
                    name: players.yourPlayerName,
                    win: 0,
                    loss: 0,
                    draw: 0,
                    atk: ""
                };
                // Add players.playerTwo to the database
                database.ref().child("/players/playerTwo").set(players.playerTwo);

                // If this user disconnects by closing or refreshing the browser, remove the user from the database
                database.ref("/players/playerTwo").onDisconnect().remove();
            }

            // Add a user joining message to the chat
            var msg = players.yourPlayerName + " has joined!";
            // Reset the name input box
            $(".usernameInput").val("");
        }
    });

    database.ref("/turn/").on("value", function (snapshot) {
        // Check if it's player1's turn
        if (snapshot.val() === 1) {
            console.log("TURN 1");
            game.turn = 1;

            // Update the display if both players are in the game
            if (players.playerOne && players.playerTwo) {
                $("#gmMsg").text("Waiting on " + players.playerOneName + " to choose...");
            }
        } else if (snapshot.val() === 2) {
            console.log("TURN 2");
            game.turn = 2;

            // Update the display if both players are in the game
            if (players.playerOne && players.playerTwo) {
                console.log(players.playerTwoName);
                $("#gmMsg").text("Waiting on " + players.playerTwoName + " to choose...");
            }
        }
    });

    // button listener RPS buttons
    $(".plyrOneAtkBtn").on("click", function () {
        if (players.playerOne && players.playerTwo) {
            if (game.turn === 1) {
                console.log($(this).val());
                database.ref().child("/players/playerOne/atk").set($(this).val());
                $("#playerOnePanel").text(players.playerOneName + " is ready to attack");
                game.turn = 2;
                database.ref().child("/turn").set(2);
            }
        }
    });

    $(".plyrTwoAtkBtn").on("click", function () {
        if (players.playerOne && players.playerTwo) {
            if (game.turn === 2) {
                console.log($(this).val());
                database.ref().child("/players/playerTwo/atk").set($(this).val());
                $("#playerTwoPanel").text(players.playerTwoName + " is ready to attack");
                //game.turn = 1;
                database.ref().child("/turn").set(1);
            }
        }
    });

    database.ref("/players/playerOne/atk").on("value", function (snapshot) {

        if (players.playerOne && players.playerTwo) {
            if (snapshot.val() != "") {
                players.playerOneAtk = snapshot.val();
            }

        }
    });

    database.ref("/players/playerTwo/atk").on("value", function (snapshot) {

        if (players.playerOne && players.playerTwo) {
            if (snapshot.val() != "") {
                players.playerTwoAtk = snapshot.val();

                //after Player one chooses and atk we need to check who one.
                checkMatchWinner(players);
            }

        }
    });

    //chat
    $(".chatInputBtn").on("click", function (event) {
        event.preventDefault();

        // First, make sure that the player exists and the message box is non-empty
        if ((players.yourPlayerName !== "") && ($(".chatInputDisplay").val().trim() !== "")) {
            // Grab the message from the input box and subsequently reset the input box
            var msg = players.yourPlayerName + ": " + $(".chatInputDisplay").val().trim();
            $(".chatInputDisplay").val("");

            // Get a key for the new chat entry
            var chatKey = database.ref().child("/chat/").push().key;

            // Save the new chat entry
            database.ref("/chat/" + chatKey).set(msg);
        }
    });

    // Attach a listener to the database /chat/ node to listen for any new chat messages
    database.ref("/chat/").on("child_added", function (snapshot) {
        var chatMsg = snapshot.val();
        var chatEntry = $("<p>").html(chatMsg);

        $(".chatDisplay").append(chatEntry);
    });



    function checkMatchWinner(players) {
        if (players.playerOneAtk != "" && players.playerTwoAtk != "") {
            $("#playerOnePanel").text(players.playerOneName + " choose " + players.playerOneAtk);
            $("#playerTwoPanel").text(players.playerTwoName + " choose " + players.playerTwoAtk);

            removeAtkImg();

            $(".playerOne").append(setRpsImg(players.playerOneAtk));
            $(".playerTwo").append(setRpsImg(players.playerTwoAtk));

            if (players.playerOneAtk === "rock" && players.playerTwoAtk === "scissors" || players.playerOneAtk === "paper" && players.playerTwoAtk === "rock" || players.playerOneAtk === "scissors" && players.playerTwoAtk === "paper") {
                database.ref().child("/players/playerOne/win").set(++players.playerOneScore.win);
                database.ref().child("/players/playerTwo/loss").set(++players.playerTwoScore.lose);
            }
            else if (players.playerOneAtk === "rock" && players.playerTwoAtk === "paper" || players.playerOneAtk === "paper" && players.playerTwoAtk === "scissors" || players.playerOneAtk === "scissors" && players.playerTwoAtk === "rock") {
                database.ref().child("/players/playerOne/loss").set(++players.playerOneScore.lose);
                database.ref().child("/players/playerTwo/win").set(++players.playerTwoScore.win);
            }
            else if (players.playerOneAtk === "rock" && players.playerTwoAtk === "rock" || players.playerOneAtk === "paper" && players.playerTwoAtk === "paper" || players.playerOneAtk === "scissors" && players.playerTwoAtk === "scissors"){
                database.ref().child("/players/playerOne/draw").set(++players.playerOneScore.draw);
                database.ref().child("/players/playerTwo/draw").set(++players.playerTwoScore.draw);
            }

            updateScoreBoard(players.playerOneScore, players.playerTwoScore);
        }
    };


    function setRpsImg(atk) {
        let newImg = $("<img>");

        switch (atk) {
            case "rock":
                newImg.attr("src", game.gamePiece[0]);
                break;
            case "paper":
                newImg.attr("src", game.gamePiece[1]);
                break;
            case "scissors":
                newImg.attr("src", game.gamePiece[2]);
                break;
            default:
                break;
        }
        return newImg;
    }

    function removeAtkImg() {
        $(".playerOne").children("img").remove();
        $(".playerTwo").children("img").remove();
    }

    function updateScoreBoard(plyrOneScore, plyrTwoScore) {
        $("#plyOnewin").text("Wins: " + plyrOneScore.win);
        $("#plyOneLose").text("Losses: " + plyrOneScore.lose);
        $("#plyOneDraw").text("Draw: " + plyrOneScore.draw);

        $("#plyTwoWin").text("Wins: " + plyrTwoScore.win);
        $("#plyTwoLose").text("Losses: " + plyrTwoScore.lose);
        $("#plyTwoDraw").text("Draw: " + plyrTwoScore.draw);
    }

});



