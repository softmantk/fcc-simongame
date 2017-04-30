/**
 * Created by SOFTMAN on 05-04-2017.
 */
$(document).ready(function () {
    var moves;
    var repeater;
    var swithon = false;
    var equalise = false;
    var strict = false;
    var game = {
        currentGame : [],
        gameCount : 0,
        userClick : []
    };
    $("#reset").click(function () {

        if(swithon) {

            newGame();
            play();
        }

    });

    $('#strict').click(function () {

        if(strict === false) {

            $("#strict").css("background-color", "red");

            strict = true;
        } else {
            $("#strict").css("background-color", "#c6c333");
            strict = false;

        }

        
    });

        $("#s-blue").click(function () {

            if(swithon) {
                var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
                $("#s-blue").css({"background-color" : " rgb(33, 74, 213)"});
                setTimeout(function () {
                    $("#s-blue").css({"background-color" : "rgb(24, 50, 140)"});
                },200);
                game.userClick.push(1);
                compare();
                audio.play();
            }

        });

        $("#s-green").click(function () {

            if(swithon) {
                var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
                game.userClick.push(2);
                $("#s-green").css({"background-color" : "rgb(0, 230, 93)"});
                setTimeout(function () {
                    $("#s-green").css({"background-color" : "rgb(0, 167, 74)"});
                },200);
                compare();
                audio.play();
            }


        });
        $("#s-yellow").click(function () {
            if(swithon) {
                var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
                game.userClick.push(3) ;
                $("#s-yellow").css({"background-color" : "rgb(243, 244, 73)"});
                setTimeout(function () {
                    $("#s-yellow").css({"background-color" : "rgb(216, 217, 67)"});
                },200);
                compare();
                audio.play();
            }

        });
        $("#s-red").click(function () {

            if(swithon) {

                var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
                game.userClick.push(4);
                compare();
                $("#s-red").css({"background-color" : "rgb(209, 46, 56)"});
                setTimeout(function () {
                    $("#s-red").css({"background-color" : "rgb(151, 38, 41)"});
                },200);
                audio.play();

            }

        });





    $('input:checkbox').change( function () {

            if ($(this).is(':checked')) {
                $("#counter").text(parseInt("000"));
                swithon = true;
                start();

            } else  {
                swithon = false;
                $("#counter").text("");
                clearTimeout(repeater);
                clearInterval(moves);

            }
    });

    function start() {
        console.log("switch :"+swithon)
            newGame();
            play();


    }


    function play() {
            var i =0 ;
            if(!equalise)
                game.currentGame.push(randomNum());
            equalise = false;
            console.log("game : "+ game.currentGame);

             moves = setInterval(function () {

                 repeater = setTimeout(function () {

                    switch (game.currentGame[i]) {

                        case 1 :

                            var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
                            audio.play();
                            $("#s-blue").css({"background-color" : " rgb(33, 74, 213)"});
                            setTimeout(function () {
                                $("#s-blue").css({"background-color" : "rgb(24, 50, 140)"});
                            },200);
                            break;
                        case 2 :

                            var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
                            audio.play();
                            $("#s-green").css({"background-color" : "rgb(0, 230, 93)"});
                            setTimeout(function () {
                                $("#s-green").css({"background-color" : "rgb(0, 167, 74)"});
                            },200);
                            break;
                        case 3:

                            var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
                            audio.play();
                            $("#s-yellow").css({"background-color" : "rgb(243, 244, 73)"});
                            setTimeout(function () {
                                $("#s-yellow").css({"background-color" : "rgb(216, 217, 67)"});
                            },200);
                            break;
                        case 4:

                            var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
                            audio.play();
                            $("#s-red").css({"background-color" : "rgb(209, 46, 56)"});
                            setTimeout(function () {
                                $("#s-red").css({"background-color" : "rgb(151, 38, 41)"});
                            },200);
                            break;
                    }

                    i++;
                }, 500);
                //  console.log("i :"+i);

                if(i == (game.currentGame.length - 1)) {

                    clearTimeout(moves);
                }
            }, 1000);

    }


    function compare() {

        if(game.currentGame.length === game.userClick.length) {

            console.log("length equal");

            if(game.currentGame[game.currentGame.length - 1] === game.userClick[game.userClick.length-1]) {
                // length equal and last user input  matched with last user entry
               // console.log("correct, move to next stage");
                $("#counter").text( parseInt($("#counter").text()) + 1 ) ;
                game.userClick = [];
                play();
            } else {

                if(strict) {

                    console.log("wrong");
                    var element = $("#counter");
                    var shown = true;

                    var bi =  setInterval(toggle, 100);
                    var bc = 0;
                    function toggle() {
                        bc++;
                        if(bc>4) {
                            element.text("000");
                            clearInterval(bi);
                        }else if(shown) {
                            element.text("---" );
                            shown = false;
                        } else {
                            element.text("   " );
                            shown = true;
                        }
                    }

                    setTimeout(function () {

                        clearTimeout(repeater);
                        clearInterval(moves);
                        newGame();
                        play();

                    }, 500)

                } else  {
                    console.log("show moves");
                    game.userClick = [];
                    equalise = true;

                 //   console.log("wrong");
                    var element = $("#counter");
                    var shown = true;

                    var bi =  setInterval(toggle, 100);
                    var bc = 0;
                    function toggle() {
                        bc++;
                        if(bc>4) {
                            element.text(game.currentGame.length - 1);
                            clearInterval(bi);
                        }else if(shown) {
                            element.text("---" );
                            shown = false;
                        } else {
                            element.text("   " );
                            shown = true;
                        }
                    }

                    setTimeout(function () {

                        clearInterval(moves);
                       // newGame();
                        play();

                    }, 500)


                }

            }
        } else {

            // user action remains
           // console.log("remaining user action: "+ (game.currentGame.length - game.userClick.length));
            if(game.currentGame[game.userClick.length - 1] == game.userClick[game.userClick.length-1] ) {
                console.log("input equal")
            } else {
              //  console.log("wrong input");
                if(strict) {

                    console.log("wrong");
                    var element = $("#counter");
                    var shown = true;
                    var bi =  setInterval(toggle, 100);
                    var bc = 0;
                    function toggle() {
                        bc++;
                        if(bc>4) {
                            element.text("000");
                            clearInterval(bi);
                        }else if(shown) {
                            element.text("---" );
                            shown = false;
                        } else {
                            element.text("   " );
                            shown = true;
                        }

                    }

                    setTimeout(function () {

                        clearTimeout(repeater);
                        clearInterval(moves);

                        newGame();
                        play();

                    }, 500)

                } else  {
                    console.log("show moves");

                    game.userClick = [];

                    equalise = true ;


                  //  console.log("wrong");
                    var element = $("#counter");
                    var shown = true;

                    var bi =  setInterval(toggle, 100);
                    var bc = 0;
                    function toggle() {
                        bc++;
                        if(bc>4) {
                            element.text(game.currentGame.length - 1);
                            clearInterval(bi);
                        }else if(shown) {
                            element.text("---" );
                            shown = false;
                        } else {
                            element.text("   " );
                            shown = true;
                        }
                    }

                    setTimeout(function () {

                        clearInterval(moves);
                       // newGame();
                        play();

                    }, 500)

                }
            }

        }

    }

    function randomNum() {
        return Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    }

    function newGame() {
        game.count = 0 ;
        game.currentGame = [];
        game.userClick = [];
        $("#counter").text(parseInt("000"))
    }

});
