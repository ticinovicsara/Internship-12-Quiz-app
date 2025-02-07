import { resetAnswerSelection, resetConfirmTimer, startTimer, questionTimer } from "./timer.js";
import { state } from "./state.js";

let quizData = {};

export function setQuizData(data) {
    quizData = data;
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

    state.alreadyScored = false;
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
    state.confirmBoxVisible = false;
    resetConfirmTimer();

    const answerButtons = document.querySelectorAll(".answer-button");
    const isCorrect = state.selectedAnswer === state.correctAnswer;
    const isTimeUp = !state.selectedAnswer;

    if (isTimeUp) {
        answerButtons.forEach(button => {
            button.disabled = true; 
            if (button.textContent === state.correctAnswer) {
                button.classList.add("correct-answer");
            }
        });
    }
    else {
        answerButtons.forEach(button => {
            button.disabled = true;
            if (button.textContent === state.correctAnswer) {
                button.classList.add("correct-answer");
            }
            else if (button.textContent === state.selectedAnswer) {
                button.classList.add("wrong-answer");
            }
        });
    }

    if (!isTimeUp && isCorrect && !state.alreadyScored) {  
        state.score++;  
        state.alreadyScored = true;  
    }    

    clearInterval(questionTimer);
    document.getElementById("next-question-button").style.display = "block";
}


document.getElementById("next-question-button").addEventListener("click", () => {
    state.currQIndex++;
    if (state.currQIndex < quizData.results.length) {
        showQuestion(state.currQIndex); 
    }
    else {
        state.quizFinished = true;
        resetConfirmTimer();
        endQuiz();
    }
});

export function endQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-end").style.display ="block";
    document.getElementById("final-score").textContent = `Your score: ${state.score} / 5`;

    let feedback = getFeedback(state.score);
    document.getElementById("final-score").insertAdjacentHTML('beforeend', `<p>${feedback}</p>`);

    document.getElementById("restart-quiz").addEventListener("click", () => {
        location.reload();
    });
    saveQuizResults();
}

function saveQuizResults() {
    let previousResults = JSON.parse(localStorage.getItem("quiz-results")) || [];

    let difficulty = document.getElementById("difficulty").value;
    let categorySelect = document.getElementById("category");
    let category = categorySelect.options[categorySelect.selectedIndex].text;

    let newResult = {
        score: state.score,
        difficulty: difficulty,
        category: category,
        date: new Date().toLocaleString()
    }

    previousResults.push(newResult);
    localStorage.setItem("quiz-results", JSON.stringify(previousResults));
}

export function displayPreviousResults() {
    let previousResults = JSON.parse(localStorage.getItem("quiz-results")) || [];
    let resultsContainer = document.getElementById("previous-quizzes-content");

    previousResults.forEach(result => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>Score:</strong> ${result.score}/5 <br>
            <strong>Difficulty:</strong> ${result.difficulty} <br>
            <strong>Category:</strong> ${result.category} <br>
            <strong>Date:</strong> ${result.date}
        `;
        resultsContainer.appendChild(li);
    })
}

export function clearQuizHistory() {
    localStorage.removeItem("quiz-results"); 
    displayPreviousResults(); 
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
