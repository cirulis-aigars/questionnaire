document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const questionCounter = document.getElementById("question-counter");
  let currentQuestionIndex = 0;
  let questions = [];
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        questions = data.results.map((question) => ({
          ...question,
          question: decodeHTMLEntities(question.question),
          correct_answer: decodeHTMLEntities(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map(decodeHTMLEntities),
        }));
        displayQuestion();
      });
  }

  function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showEndingScreen();
      return;
    }

    const question = questions[currentQuestionIndex];
    quizContainer.innerHTML = `
      <div class="question">${question.question}</div>
      <div class="answers">
        ${[...question.incorrect_answers, question.correct_answer]
          .sort(() => Math.random() - 0.5)
          .map((answer) => `<button class="answer divider">${answer}</button>`)
          .join("")}
      </div>
    `;

    document.querySelectorAll(".answer").forEach((button) => {
      button.addEventListener("click", handleAnswerClick);
    });

    questionCounter.textContent = `${currentQuestionIndex + 1} / ${
      questions.length
    }`;
  }

  function handleAnswerClick(event) {
    const selectedAnswer = event.target.textContent;
    const question = questions[currentQuestionIndex];

    if (selectedAnswer === question.correct_answer) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }

    currentQuestionIndex++;
    displayQuestion();
    changeBackgroundColourOnClick();
  }

  function showEndingScreen() {
    const totalQuestions = questions.length;
    quizContainer.innerHTML = `
      <h2 class="results">
        Congratulations! You answered ${correctAnswers}/${totalQuestions} questions right!
      </h2>
      <button id="retry-button">Retry</button>
    `;
    document.getElementById("retry-button").addEventListener("click", () => {
      currentQuestionIndex = 0;
      correctAnswers = 0;
      fetchQuestions();
    });
  }

  // Function to generate a random bright, pastel colour
  function getRandomBrightColour() {
    const r = Math.floor(Math.random() * 56 + 200);
    const g = Math.floor(Math.random() * 56 + 200);
    const b = Math.floor(Math.random() * 56 + 200);
    return `rgb(${r}, ${g}, ${b})`; // return the colour in RGB format
  }

  // function to change the background colour after each answer click
  function changeBackgroundColourOnClick() {
    const newColour = getRandomBrightColour();
    document.body.style.backgroundcolour = newcolour; // Set the new background colour

    // extracts RGB values from the new colour
    const rgb = newColour.match(/\d+/g).map(Number);
    // make the colour slightly brighter for the answer buttons just because it looks nice
    const brighterColour = rgb.map((value) => Math.min(value + 20, 255));
    const brighterColourString = `rgb(${brighterColour.join(", ")})`;

    // applies the brighter colour to all answer buttons
    document.querySelectorAll(".answer").forEach((button) => {
      button.style.backgroundColour = brighterColourString;
    });
  }

  // adding a transition for smooth colour change
  document.body.style.transition = "background-colour 0.5s ease";

  fetchQuestions();
});
