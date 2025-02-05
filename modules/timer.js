import { finalizeAnswer } from "./quiz.js";
import { state } from "./state.js";

export let questionTimer;
let confirmTimer;
let timeLeft;

export function startTimer() {
    clearInterval(questionTimer);

    timeLeft = 5;
    const timeDisplay = document.getElementById("time-left");

    questionTimer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if(timeLeft <= 0) {
            clearInterval(questionTimer);
            finalizeAnswer();
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
    if(state.quizFinished || timeLeft <= 0) {
        clearInterval(questionTimer); 
        clearTimeout(confirmTimer); 
    return;
    }

    clearInterval(confirmTimer);

    confirmTimer = setTimeout(() => {
        if (!state.answerSelected) return;

        const confirmAnswer = confirm("Is this your final answer?");
        if (confirmAnswer) {
            finalizeAnswer();
        } else {
            state.selectedAnswer = null;
            confirmTimer = null;
            resetAnswerSelection();
        }
    }, 2000);
}