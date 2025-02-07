import { finalizeAnswer } from "./quiz.js";
import { state } from "./state.js";

export let questionTimer;
let confirmTimer;
let timeLeft;

export function startTimer() {
    clearInterval(questionTimer);

    timeLeft = 20;
    const timeDisplay = document.getElementById("time-left");

    questionTimer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if(timeLeft <= 0) {
            state.answerSelected = false;
            state.selectedAnswer = null;
            clearInterval(questionTimer);
            const confirmBox = document.querySelector(".confirm-overlay");
            if (confirmBox) {
                document.body.removeChild(confirmBox);
            }
            finalizeAnswer(false);
            document.getElementById("next-question-button").style.display = "block";
        }
    }, 1000);
}

export function resetAnswerSelection() {
    state.answerSelected = false;
    const answerButtons = document.querySelectorAll(".answer-button");
    answerButtons.forEach(button => {
        button.style.backgroundColor = ""; 
        button.classList.remove("correct-answer", "wrong-answer"); 
    });
    clearTimeout(confirmTimer);
}

export function resetConfirmTimer() {
    if(state.quizFinished || timeLeft <= 0 || state.confirmBoxVisible) {
        state.confirmBoxVisible = false;
        clearInterval(questionTimer); 
        clearTimeout(confirmTimer); 
        return;
    }

    clearTimeout(confirmTimer);

    confirmTimer = setTimeout(() => {
        if (!state.answerSelected || state.confirmBoxVisible) return;

        if (document.getElementById("next-question-button").style.display === "block") return;

        askFinalConfirmation();
    }, 2000);
}

function askFinalConfirmation() {
    if (state.confirmBoxVisible) return;

    state.confirmBoxVisible = true;

    const confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm-overlay");

    confirmBox.innerHTML = `
        <div class = "confirm-box">
            <p id="confirm-box-text">Is this your final answer?</p>
            <button id="confirm-yes">Yes</button>
            <button id="confirm-no">No</button>
        </div>
    `;

    document.body.appendChild(confirmBox);

    document.getElementById("confirm-yes").addEventListener("click", () => {
        state.confirmBoxVisible = false;
        finalizeAnswer();
        document.body.removeChild(confirmBox);
    });


    document.getElementById("confirm-no").addEventListener("click", () => {
        state.selectedAnswer = null;
        confirmTimer = null;
        resetAnswerSelection();
        state.confirmBoxVisible = false;
        document.body.removeChild(confirmBox);
    });
}