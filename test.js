/**
 * Created by SOFTMAN on 18-04-2017.
 */
/**
 * Created by fazbat on 11/15/2015.
 */

(function() {
    'use strict';
    var sequence,
        count,
        soundObj = null,
        intervalLength = 600,
        winningScore = 20,
        upSpeedSteps = [5, 9, 13],
        intervals = {},
    /*store intervals & timeouts in case game is shut off during an animation*/
        timeouts = {},
        strictMode = false;

    $(document).ready(function() {
        document.getElementById("onoff").checked = false; //for firefox
        document.getElementById("onoff").addEventListener("change", onOff);
    });

    function onOff() {
        var on = document.getElementById("onoff").checked;
        if (on) {
            gameOn();
        } else {
            gameOff();
        }
    }

    function gameOn() {
        $(".count span").css("color", "#FF6464");
        blink($(".count span"), 4);
        strictMode = false;
        $(".strict").click(setStrictMode).css("cursor", "pointer");
        $(".start").click(initSimonGame).css("cursor", "pointer");

    }

    function gameOff() {
        /*stop  sound*/
        if (soundObj) {
            soundObj.pause();
            soundObj.currentTime = 0;
        }
        /*stop all intervals & timeouts*/
        for (var interval in intervals) {
            clearInterval(intervals[interval])
        }
        for (var timeout in timeouts) {
            clearTimeout(timeouts[timeout])
        }
        /*deactivate buttons*/
        $(".strict").off().css("cursor", "default");
        if (strictMode) {
            setStrictMode();
        }
        $(".start").off().css("cursor", "default");
        $(".btn-seq").off().css("cursor", "default");
        /*dim the count display*/
        $(".count span").html("--").css("color", "#a50000");

    }

    function blink(obj, reps) {
        var blinks = 0;
        intervals.blink = setInterval(function() {
            obj.css("visibility", obj.css("visibility") == "hidden" ? "visible" : "hidden");
            blinks++;
            if (blinks > reps) {
                clearInterval(intervals.blink);
                obj.css("visibility", "visible");
            }
        }, 250);
    }

    function initSimonGame() {
        if (soundObj) {
            soundObj.pause();
            soundObj.currentTime = 0;
        }
        /*stop all intervals & timeouts*/
        for (var interval in intervals) {
            clearInterval(intervals[interval])
        }
        for (var timeout in timeouts) {
            clearTimeout(timeouts[timeout])
        }

        sequence = [];
        count = 0;
        intervalLength = 600;
        newRound();
    }

    function setStrictMode() {
        strictMode = !strictMode;
        var color = strictMode ? "#FF0A0A" : "#8B0000";
        $(".lt").css("background-color", color);
    }

    function newRound() {
        $(".btn-seq").off().css("cursor", "default");
        ++count;
        displayCount();
        if (upSpeedSteps.indexOf(count) > -1) {
            intervalLength -= 125
        }
        sequence.push(Math.floor((Math.random() * 4) + 1));
        animateBoard();
    }

    function displayCount() {
        var countStr = "";

        countStr = count < 10 ? "0" + count : count;
        $(".count span").html(countStr);
    }

    function animateBoard() {
        var index = 0;

        intervals.animateBoard = setInterval(function() {
            lightSquare(document.getElementsByClassName("btn-" + sequence[index]));
            soundObj = document.getElementById("simon" + sequence[index]);
            playSound(soundObj);
            index++;
            if (index == sequence.length) {
                clearInterval(intervals.animateBoard);
                playerTurn();
            }
        }, intervalLength * 2)

    }

    function playerTurn() {
        var index = 0;
        /*start timer - player only has so long to press button*/
        timeouts.player = setTimeout(function() {
            endRound(false)
        }, intervalLength * 10);

        $(".btn-seq").mousedown(function() {
            /*player acted - stop timer*/
            clearTimeout(timeouts.player);

            /*play sound of this button*/
            soundObj = document.getElementById("simon" + this.getAttribute("data-index"));
            soundObj.play();
            /*brighten button*/
            $(this).animate({
                opacity: 1.0
            }, 100);

            /*start timer-player only has so long to hold button*/
            timeouts.player = setTimeout(function() {
                endRound(false)
            }, intervalLength * 10);

            /*if player press correct button - increment sequence*/
            if (this.getAttribute("data-index") == sequence[index]) {
                index++
            }

            /*end round if wrong button*/
            else {
                $(this).animate({
                    opacity: 0.8
                }, 300);
                document.getElementById("simon" + this.getAttribute("data-index")).pause();
                document.getElementById("simon" + this.getAttribute("data-index")).currentTime = 0;
                soundObj = null;
                endRound(false);
            }
        }).mouseup(function() {
            /*clear timer*/
            clearTimeout(timeouts.player);
            /*set timer */
            timeouts.player = setTimeout(function() {
                endRound(false)
            }, intervalLength * 10);

            /*dim button*/
            $(this).animate({
                opacity: 0.8
            }, 100);
            /*stop sound after .25sec - so we get some sound if player just taps button*/
            soundObj = document.getElementById("simon" + this.getAttribute("data-index"));
            timeouts.soundOut = setTimeout(function() {
                soundObj.pause();
                soundObj.currentTime = 0;
                soundObj = null;
            }, 100);
            /* end round if last sequence btn is pushed*/
            if (index == sequence.length) {
                endRound(true);
            }
        }).css("cursor", "pointer");

    }

    function endRound(completed) {
        /*clear away timer*/
        clearTimeout(timeouts.player);

        /*turn off seq buttons for player*/
        $(".btn-seq").off().css("cursor", "default");

        if (!completed) {
            /*play error sounds & msg*/
            document.getElementById("simon_buzz").play();
            $(".count span").html("Err");
            blink($(".count span"), 4);

            /*wait a little & start over if strictMOde  or repeat seq if not*/
            timeouts.endRound = setTimeout(function() {
                if (strictMode) {
                    initSimonGame();
                } else {
                    displayCount();
                    animateBoard();
                }
            }, 1500)

        } else if (count == winningScore) {
            timeouts.endRound = setTimeout(function() {
                winGame()
            }, 500);
        } else {
            timeouts.endRound = setTimeout(function() {
                newRound()
            }, 500);
        }
    }

    function winGame() {
        intervalLength = 200;
        var index = 0;
        /*random light show*/
        intervals.winGame = setInterval(function() {
            lightSquare(document.getElementsByClassName("btn-" + Math.floor((Math.random() * 4) + 1)));
            index++;
            if (index > 10) {
                clearInterval(intervals.winGame);
            }
        }, 400);
        $(".count span").html("win!");
        blink($(".count span"), 8);
        soundObj = document.getElementById("simon_win");
        soundObj.play();
        $(soundObj).on("ended", function() {
            soundObj = null;
        });
    }

    function lightSquare(obj) {
        $(obj).animate({
            opacity: 1.0
        }, 10);
        /**wait one second & turn down light*/
        setTimeout(function() {
            $(obj).animate({
                opacity: 0.8
            }, 50)
        }, intervalLength)
    }

    function playSound(obj) {
        obj.play();
        setTimeout(function() {
            obj.pause();
            obj.currentTime = 0;
        }, intervalLength);

    }

})();