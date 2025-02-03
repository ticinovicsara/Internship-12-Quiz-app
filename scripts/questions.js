let currQIndex = 0;
let score = 0;

function showQuestion(index) {
    const question = quizData.results[index];
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");

    questionElement.textContent = question.question;

    answersElement.innerHTML = "";
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);

    answers.forEach(answer => {
        const answerButton = document.createElement("button");
        answerButton.textContent = answer;
        answerButton.classList.add("answer-button");
        answerButton.addEventListener("click", () => handleAnswer(answer, question.correct_answer));
        answersElement.appendChild(answerButton);
    });

    document.getElementById("next-question-nutton").style.display ="none";
}

function handleAnswer(selectedAnswer, correctAnswer) {
    const isCorrect = selectedAnswer === correctAnswer;
    if(isCorrect) {
        score++;
    }

    const answerButtons = document.querySelectorAll(".answer-button");
    answerButtons.forEach(button => {
        button.disabled = true;
        if(button.textContent === correctAnswer) {
            button.style.backroundcolor = "green";
        }
        else if(button.textContent === selectedAnswer) {
            button.style.backroundcolor = "red";
        }
    });

    document.getElementById("next-question-button").style.display = "block";
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
    let timeLeft = 20;
    const timeDisplay = document.getElementById("time-left");

    const timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswer("", "");
        }
    }, 1000);
}