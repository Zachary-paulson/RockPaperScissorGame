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
        youPlayerName: "",
        playerOneName: "",
        playerTwoName: "",
        playerOneAtk: "",
        playerTwoAtk: "",
    };

    let game = {
        gameState: ["win", "lose", "draw"],
        gamePiece: ["assets/images/rock.png", "assets/images/paper.png", "assets/images/scissor.png"],
        scoreBoard: {
            wins: 0,
            losses: 0,
            draws: 0
        },
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
        }

        if (snapeshot.child("playerTwo").exists()) {
            players.playerTwo = snapeshot.val().playerTwo;
            players.playerTwoName = players.playerTwo.name;
            $("#playerTwoPanel").text(players.playerTwoName + " is ready to battle!");

        }
        else {
            players.playerTwo = null;
            players.playerTwoName = "";
        }

        if (players.playerOne && players.playerTwo) {
            $("#playerOnePanel").text("Waiting on " + players.playerOneName + " to choose...");
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
                players.playerTwo = {
                    name: players.yourPlayerName,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    atk: ""
                };

                // Add players.playerTwo to the database
                database.ref().child("/players/playerTwo").set(players.playerTwo);

                // If this user disconnects by closing or refreshing the browser, remove the user from the database
                database.ref("/players/playerTwo").onDisconnect().remove();


            }

            // Add a user joining message to the chat
            var msg = players.yourPlayerName + " has joined!";
            console.log(msg);



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
                $("#playerOnePanel").text("Waiting on " + players.playerOneName + " to choose...");
            }
        } else if (snapshot.val() === 2) {
            console.log("TURN 2");
            game.turn = 2;

            // Update the display if both players are in the game
            if (players.playerOne && players.playerTwo) {
                console.log(players.playerTwoName);
                $("#playerTwoPanel").text("Waiting on " + players.playerTwoName + " to choose...");
            }
        }
    });

    // button listener RPS buttons
    $(".btn.plyrAtkBtn").on("click", function () {
        if (players.playerOne && players.playerTwo) {
            if (game.turn === 1) {
                database.ref().child("/players/playerOne/atk").set($(this).val());
                $("#playerOnePanel").text(players.playerOneName + " is ready to attack");
                game.turn = 2;
                database.ref().child("/turn").set(2);
            }
            else if (game.turn === 2) {
                database.ref().child("/players/playerTwo/atk").set($(this).val());
                $("#playerTwoPanel").text(players.playerTwoName + " is ready to attack");
                game.turn = 1;
                database.ref().child("/turn").set(1);
                
            }
        }
    });

    database.ref("/players/playerOne/atk").on("value", function(snapshot){
        
        if (players.playerOne && players.playerTwo){
            if(snapshot.val() != ""){
                players.playerOneAtk = snapshot.val();
            }
            
        }
    });

    database.ref("/players/playerTwo/atk").on("value", function(snapshot){
        
        if (players.playerOne && players.playerTwo){
            if(snapshot.val() != ""){
            players.playerTwoAtk = snapshot.val();

            //after Player one chooses and atk we need to check who one.
            checkMatchWinner(players)
            }
            
        }
    });



    function checkMatchWinner(players) {
        $("#playerOnePanel").text(players.playerOneName + " choose" + players.playerOneAtk);
        $("#playerTwoPanel").text(players.playerTwoName + " choose" + players.playerTwoAtk);
    
        if (players.playerOneAtk === "rock" && players.playerTwoAtk === "scissors" || players.playerOneAtk === "paper" && players.playerTwoAtk === "rock" || players.playerOneAtk === "scissors" && players.playerTwoAtk === "paper") {
            console.log("Player 2 wins");
        }
        else if (players.playerOneAtk === "rock" && players.playerTwoAtk === "paper" || players.playerOneAtk === "paper" && players.playerTwoAtk === "scissors" || players.playerOneAtk === "scissors" && players.playerTwoAtk === "rock") {
            console.log("Player 2 wins");
        }
        else {
            console.log("Draw!");
        }
    
    };

});



