let currentQuestion = 0;
let score = 0;

const questions = [
    { question: "ما هو ناتج 11 - 6؟", options: ["3", "4", "5", "6"], correctAnswer: "5", userAnswer: "" },
    { question: "في اي بلد توجد مكة المكرمة؟", options: ["السعودية", "الاردن", "العراق", "مصر"], correctAnswer: "السعودية", userAnswer: "" },
    { question: "ما هو ناتج 7 + 3؟", options: ["5", "0", "10", "13"], correctAnswer: "10", userAnswer: "" },
    { question: "ما هي اكبر دولة خليجية؟", options: ["الاردن", "العراق", "مصر", "السعودية"], correctAnswer: "السعودية", userAnswer: "" }
];

const questionImages =  [
    "https://images.vexels.com/media/users/3/266301/isolated/preview/800b891433b7ca88bb1bb64dfc1fc0e1-raven-reading-animal-cartoon-character.png",
    "https://static.vecteezy.com/system/resources/previews/022/025/987/original/cute-watercolour-baby-lion-animal-kid-reading-book-back-to-school-cartoon-character-illustration-png.png",
    "https://png.pngtree.com/png-clipart/20230927/original/pngtree-cute-watercolour-safari-lion-animals-kid-back-to-school-reading-book-png-image_13148872.png",
]

function toggleSideMenu() {
    const sideMenu = document.querySelector('.side-menu');
    if(sideMenu.classList.contains('hidden')) {
        sideMenu.classList.remove('hidden');
    } else {
        sideMenu.classList.add('hidden');
    }
}

function startQuiz() {
    document.querySelector(".start-screen").style.display = 'none';
    document.querySelector(".quiz-questions").classList.remove('hidden');
    toggleSideMenu();
    showQuestion();
}

function showQuestion() {
    const random = Math.floor(Math.random() * 3);
    document.querySelector('.quistion-image').src = questionImages[random];

    const currentQuestionObj = questions[currentQuestion];
    const quizQuestions = document.querySelector(".question-part");
    quizQuestions.innerHTML = `
        <h3>${currentQuestionObj.question}</h3>
        <div class="btn-group-vertical">
            ${currentQuestionObj.options.map((option, idx) => {
                const animateType = idx%2===0 ? "w3-animate-zoom" : "w3-animate-zoom"
                return `<button class="btn btn-light btn-option w3-container w3-center ${animateType}" onclick="checkAnswer('${option}')">${option}</button>`;
            }).join('')}
        </div>
    `;
    updateQuestionList();
}

function checkAnswer(selectedAnswer) {
    questions[currentQuestion].userAnswer = selectedAnswer;
    const currentQuestionObj = questions[currentQuestion];
    const buttons = document.querySelectorAll('.btn-option');
    const btnOption = Array.from(buttons).find(button => button.textContent.includes(selectedAnswer));

    if (selectedAnswer === currentQuestionObj.correctAnswer) {
        score++;
        btnOption.classList.add("correct-answer");
        playCorrectSound();
    } else {
        btnOption.classList.add("wrong-answer");
        const correctBtn = Array.from(buttons).find(button => button.textContent.includes(currentQuestionObj.correctAnswer));
        correctBtn.classList.add("correct-answer");
        playWrongSound();
    }

    currentQuestion++;
    setTimeout(() => {
        removeClassFromButtons("correct-answer");
        removeClassFromButtons("wrong-answer");

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            document.querySelector('.image-part').classList.add('hidden');
            toggleSideMenu();
            showFinishScreen();
        }
        // for (let index = 0; index < questions.length; index++) {
        //     if (!questions[index].userAnswer) break;
        //     if (index === questions.length - 1) document.querySelector(".finish-btn").removeAttribute('disabled');
        // }
    }, 1000);
    updateQuestionList();
}

function showFinishScreen() {
    document.querySelector(".quiz-questions").classList.add('hidden');
    const finishScreen = document.querySelector(".finish-screen");
    finishScreen.style.display = 'block';
    document.getElementById("score").innerText = score;
    if(score >= questions.length/2){
        document.querySelector('.happy-pass').classList.remove('hidden');
    } else{
        document.querySelector('.sad-fail').classList.remove('hidden');
    }
    // document.querySelector(".btn-finish").disabled = false;
    showCorrections();
    playFinishSound();
}

function showCorrections() {
    document.querySelector(".quiz-questions").classList.remove('hidden');
    const quizQuestions = document.querySelector(".question-part");
    quizQuestions.innerHTML = `
        <h3>الاجابات الصحيحة:</h3>
        <ul>
            ${questions.map((q, index) => `<li><strong>سؤال رقم ${index + 1}:</strong> ${q.correctAnswer}</li>`).join('')}
        </ul>
    `;
}

function updateQuestionList() {
    const questionList = document.getElementById("question-list");
    questionList.innerHTML = '';

    questions.forEach((_, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `سؤال رقم ${index + 1} <b>${_.userAnswer}</b>`;
        // listItem.onclick = () => showSpecificQuestion(index);
        questionList.appendChild(listItem);
    });
}

function showSpecificQuestion(questionIndex) {
    currentQuestion = questionIndex;
    showQuestion();
}

function finishQuiz() {
    document.querySelector(".quiz-container").style.display = 'none';
    document.querySelector(".finish-screen").style.display = 'block';
}

function playCorrectSound() {
    const audio = new Audio('assets/answer-correct.mp3');
    audio.play();
}

function playWrongSound() {
    const audio = new Audio('assets/wrong-answer_L4HjrqG.mp3');
    audio.play();
}

function playFinishSound() {
    const audio = new Audio('finish.mp3');
    audio.play();
}

function removeClassFromButtons(className) {
    const buttons = document.querySelectorAll(`.btn-option.${className}`);
    buttons.forEach(button => button.classList.remove(className));
}
