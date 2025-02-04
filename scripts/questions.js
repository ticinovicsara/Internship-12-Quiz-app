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

    questionElement.textContent = decodeHTML(question.question);
    answersElement.innerHTML = "";

    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);

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

function handleAnswer(answer, correctAnswer) {
    answerSelected = true;
    selectedAnswer = answer;
    this.correctAnswer = correctAnswer;

    resetConfirmTimer();
}

function finalizeAnswer(selectedAnswer, correctAnswer) {
    clearInterval(questionTimer);

    const answerButtons = document.querySelectorAll(".answer-button");
    const isCorrect = selectedAnswer === correctAnswer;

    console.log("Selected Answer:", selectedAnswer);
    console.log("Correct Answer:", correctAnswer);
    
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
    clearTimeout(confirmTimer);
}

function resetConfirmTimer() {
    clearTimeout(confirmTimer); 

    confirmTimer = setTimeout(() => {
        const confirmAnswer = confirm("Is this your final answer?");
        if (confirmAnswer) {
            finalizeAnswer(selectedAnswer, correctAnswer);
        } else {
            resetAnswerSelection();
        }
    }, 2000);
}

document.getElementById("next-question-button").addEventListener("click", () => {
    currQIndex++;
    if (currQIndex < quizData.results.length) {
        showQuestion(currQIndex); 
    } else {
        clearInterval(questionTimer);
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
