import { resetAnswerSelection, resetConfirmTimer, startTimer, questionTimer } from "./timer.js";
import { state } from "./state.js";

let quizData = {};

export function setQuizData(data) {
    quizData = data;
}

export function isQuizFinished() {
    return state.quizFinished;
}

export function showQuestion(index) {
    if (!quizData || !quizData.results || quizData.results.length === 0) {
        console.error("Quiz data is not available.");
        return;
    }

    const question = quizData.results[index];
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");

    questionElement.textContent = decodeHTML(question.question);
    answersElement.innerHTML = "";

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5); 

    answers.forEach(answer => {
        const answerButton = document.createElement("button");
        answerButton.textContent = decodeHTML(answer);
        answerButton.classList.add("answer-button");
        answerButton.addEventListener("click", () => handleAnswer(answer, question.correct_answer));
        answersElement.appendChild(answerButton);
    });

    document.getElementById("next-question-button").style.display ="none";

    resetAnswerSelection();
    startTimer();
}

export function handleAnswer(answer, correct_answer) {       
    if (state.answerSelected && state.selectedAnswer !== answer) {+
        resetAnswerSelection();
    }

    if (!state.answerSelected) {
        state.answerSelected = true;
        state.selectedAnswer = answer;
        state.correctAnswer = correct_answer;

        resetConfirmTimer();
    }
}

export function finalizeAnswer() {
    resetConfirmTimer();

    const answerButtons = document.querySelectorAll(".answer-button");
    const isCorrect = state.selectedAnswer === state.correctAnswer;

    answerButtons.forEach(button => {
        button.disabled = true;

        if (button.textContent === state.correctAnswer) {
            button.classList.add("correct-answer");
        } else if (button.textContent === state.selectedAnswer) {
            button.classList.add("wrong-answer");
        }
    });

    if (isCorrect) { state.score++; }

    clearInterval(questionTimer);
    document.getElementById("next-question-button").style.display = "block";
}


document.getElementById("next-question-button").addEventListener("click", () => {
    state.currQIndex++;
    if (state.currQIndex < quizData.results.length) {
        showQuestion(state.currQIndex); 
    } else {
        clearInterval(questionTimer);
        endQuiz();
    }
});

export function endQuiz() {
    state.quizFinished = true;

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-end").style.display ="block";
    document.getElementById("final-score").textContent = `Your score: ${state.score} / 5`;

    let feedback = getFeedback(state.score);
    document.getElementById("final-score").insertAdjacentHTML('beforeend', `<p>${feedback}</p>`);

    document.getElementById("restart-quiz").addEventListener("click", () => {
        location.reload();
    });
}

function getFeedback(score) {
    if(score <= 1) {
        return "Do better";
    }
    else if(score === 2) {
        return "Better luck next time!";
    }
    else if(score === 3) {
        return "Good, but you can do better";
    }
    else if(score === 4) {
        return "Very good, keep it up!"
    }
    else {
        return "Amazing, you are a master of trivia!";
    }
}


function decodeHTML(str) {
    let doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
}
