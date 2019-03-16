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
    let player = {
        playerAtk: "",
             
    };

    let game = {
        gameState: ["win", "lose", "draw"],
        scoreBoard: {
            wins: 0,
            losses: 0,
            draws: 0
        }

    };
   //my database
    const database = firebase.database();

    // button listener RPS buttons
    $(".btn.plyrAtkBtn").on("click", function () {
        player.playerAtk = $(this).val();
        database.ref().push(player);
        game.playerTwoAtk = "scissors";

        //checkMatchWinner(game.playerOneAtk, game.playerTwoAtk);
    });

    database.ref().on("child_added", function(childsnapshot){
        let newEle = $("<h2>");
        newEle.text("Player Attacked with " + childsnapshot.val().playerAtk);
        $(".playerOne").append(newEle);
    });




});

function checkMatchWinner(plyrOneAtk, plyrTwoAtk) {
    if (plyrOneAtk === "rock" && plyrTwoAtk === "scissors" || plyrOneAtk === "paper" && plyrTwoAtk === "rock" || plyrOneAtk === "scissors" && plyrTwoAtk === "paper") {
        console.log("Winner!");
    }
    else if (plyrOneAtk === "rock" && plyrTwoAtk === "paper" || plyrOneAtk === "paper" && plyrTwoAtk === "scissors" || plyrOneAtk === "scissors" && plyrTwoAtk === "rock") {
        console.log("Loser!");
    }
    else {
        console.log("Draw!");
    }

};