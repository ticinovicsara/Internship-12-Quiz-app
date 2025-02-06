import { fetchQuizData } from "./api.js";
import { showQuestion, setQuizData, displayPreviousResults, clearQuizHistory } from "./quiz.js";
import { startTimer } from "./timer.js";

document.addEventListener("DOMContentLoaded", () => {
    displayPreviousResults();

    document.getElementById("clear-history").addEventListener("click", () => {
        clearQuizHistory();
        alert("Please refresh the page to clear history data!");
    });
});

document.getElementById("start-quiz").addEventListener("click", async () => {
    document.getElementById("previous-quizzes").style.display = "none";

    let quizURL = generateURL();
    let quizData = await fetchQuizData(quizURL);
    console.log(quizData);

    if (quizData.results && quizData.results.length > 0) {
        setQuizData(quizData);

        document.querySelector(".setup-container").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";

        showQuestion(0);
        startTimer();
    } else {
        alert("No questions found.");
    }
});

function generateURL() {
    const baseURL = "https://opentdb.com/api.php";

    let params = new URLSearchParams({
        amount : 5,
        difficulty : document.getElementById("difficulty").value,
        type : document.getElementById("type").value
    });

    const category = document.getElementById("category").value;
    console.log("Selected category:", category);
    if(category !== "") {
        params.append("category", category);
    }

    let finalURL = `${baseURL}?${params.toString()}`;

    console.log("Generated URL:", finalURL);
    return finalURL;
}
