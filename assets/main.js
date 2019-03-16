$(document).ready(function () {

    let game = {
        playerOneAtk: "",
        playerTwoAtk: "",
        gameState: ["win", "lose", "draw"],
        scoreBoard: {
            wins: 0,
            losses: 0,
            draws: 0
        }
    };



    // button listener
    $(document).on("click", "button", function () {

        game.playerOneAtk = $(this).val();
        game.playerTwoAtk = "scissors";
        checkMatchWinner(game.playerOneAtk, game.playerTwoAtk);
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