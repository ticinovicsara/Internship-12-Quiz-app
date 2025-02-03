document.getElementById("start-quiz").addEventListener("click", () => {
    let quizURL = generateURL();
    fetch(quizURL)
        .then(response => response.json())
        .then(data => console.log(data));
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

