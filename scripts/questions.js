let currQIndex = 0;
let score = 0;
let questionTimer;
let confirmTimer;
let answerSelected = false;
let timeLeft = 20;

function showQuestion(index) {
    const question = quizData.results[index];
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");

    questionElement.textContent = question.question;
    answersElement.innerHTML = "";

    const answers = [...question.incorrect_answers, question.correct_answer];

    answers.forEach(answer => {
        const answerButton = document.createElement("button");
        answerButton.textContent = answer;
        answerButton.classList.add("answer-button");
        answerButton.addEventListener("click", () => handleAnswer(answer, question.correct_answer));
        answersElement.appendChild(answerButton);
    });

    document.getElementById("next-question-button").style.display ="none";

    resetAnswerSelection();
    startTimer();
}

function handleAnswer(selectedAnswer, correctAnswer) {
    answerSelected = true;
    const isCorrect = selectedAnswer === correctAnswer;
    
    const confirmAnswer = confirm("Is this your final answer?");

    if(confirmAnswer) {
        document.getElementById("next-question-button").style.display = "block";
        finalizeAnswer(selectedAnswer, correctAnswer, isCorrect);
    }
    else {
        resetAnswerSelection();
    }
}

function finalizeAnswer(selectedAnswer, correctAnswer, isCorrect) {
    const answerButtons = document.querySelectorAll(".answer-button");
    
    answerButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add("correct-answer");
        } else if (button.textContent === selectedAnswer) {
            button.classList.add("wrong-answer");
        }
    });

    if (isCorrect) { score++; }

    document.getElementById("next-question-button").style.display = "block";
}

function resetAnswerSelection() {
    answerSelected = false;
    const answerButtons = document.querySelectorAll(".answer-button");
    answerButtons.forEach(button => {
        button.style.backgroundColor = ""; 
        button.classList.remove("correct-answer", "wrong-answer"); 
    });
}

document.getElementById("next-question-button").addEventListener("click", () => {
    currQIndex++;
    if (currQIndex < quizData.results.length) {
        showQuestion(currQIndex); 
    } else {
        endQuiz();
    }
});


function startTimer() {
    clearInterval(questionTimer);

    const timeDisplay = document.getElementById("time-left");
    timeLeft = 20;

    questionTimer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if(timeLeft <= 0) {
            clearInterval(questionTimer);
            handleAnswer("", "");
            document.getElementById("next-question-button").style.display = "block";
        }
    }, 1000);
}