let quizData = {};

document.getElementById("start-quiz").addEventListener("click", () => {
    let quizURL = generateURL();
    fetch(quizURL)
        .then(response => response.json())
        .then(data => {
            quizData = data;
            console.log(quizData);
        });
});

function generateURL() {
    const baseURL = "https://opentdb.com/api.php";

    let params = new URLSearchParams({
        amount : 5,
        difficulty : document.getElementById("difficulty").value,
        type : document.getElementById("type").value
    });

    const category = document.getElementById("category").value;
    if(category) {
        params.append("category", category);
    }

    let finalURL = `${baseURL}?${params.toString()}`;

    console.log(finalURL);
    return finalURL;
}



function endQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-end").style.display ="block";
    document.getElementById("final-score").textContent = `Your score: ${score} / 5`;

    let feedback = getFeedback(score);
    document.getElementById("final-score").insertAdjacentHTML('beforeend', `<p>${feedback}</p>`);
}

function getFeedback(score) {
    if(score <= 1) {
        return "Do better";
    }
    else if(score <= 3) {
        return "Good, but you can do better";
    }
    else {
        return "Good job, keep it up!";
    }
}