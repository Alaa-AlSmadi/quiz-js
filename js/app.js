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

function startQuiz() {
    document.querySelector(".start-screen").classList.add('hidden');
    document.querySelector(".quiz-questions").classList.remove('hidden');
    showQustionsList();
}

function showQustionsList() {
    const quizQuestions = document.querySelector(".question-part");

    quizQuestions.innerHTML = `
        <div class="question-cards-container">
            ${questions.map((question, idx) => {
                let cardContent, disabled, showWrongIcon;
                if (question.userAnswer && question.userAnswer === question.correctAnswer) {
                    cardContent = question.question;
                    disabled = true;
                } else if (question.userAnswer && question.userAnswer !== question.correctAnswer && currentQuestion === idx) {
                    showWrongIcon = true;
                    disabled = true;
                    cardContent = idx+1;
                } else {
                    cardContent = idx+1;
                }
                return `
                    <div onclick="showQuestion(${idx})" class="card w3-animate-zoom ${disabled && 'disabled'}">
                        <div class="card-hover-state">
                            ${
                                showWrongIcon ?
                                '<img alt="wrong" src="https://static-00.iconduck.com/assets.00/false-icon-512x512-nu355k3j.png" />'
                                : ''
                            }
                            <span>${cardContent}</span>
                        </div>
                    </div>
                `
            }).join('')}
        </div>
    `;
}

function showQuestion(questionIndex) {
    currentQuestion = questionIndex;
    const currentQuestionObj = questions[currentQuestion];
    const quizQuestions = document.querySelector(".question-part");
    quizQuestions.innerHTML = `
        <h3 class="w3-animate-bottom question-title">${currentQuestionObj.question}</h3>
        <div class="btn-group-vertical">
            ${currentQuestionObj.options.map((option, idx) => {
                const animateType = idx%2===0 ? "w3-animate-zoom" : "w3-animate-zoom"
                return `<button class="btn btn-light btn-option w3-container w3-center ${animateType}" onclick="checkAnswer('${option}')">${option}</button>`;
            }).join('')}
        </div>
    `;
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
        // const correctBtn = Array.from(buttons).find(button => button.textContent.includes(currentQuestionObj.correctAnswer));
        // correctBtn.classList.add("correct-answer");
        playWrongSound();
    }

    setTimeout(() => {
        removeClassFromButtons("correct-answer");
        removeClassFromButtons("wrong-answer");

        let isExamFinished = false;
        let totalAnsweredQuestions = 0, totalWrongAnswers=0;
        questions.forEach(question => {
            if (question.userAnswer) totalAnsweredQuestions+=1;
            if (question.userAnswer && question.correctAnswer !== question.userAnswer) totalWrongAnswers+=1
        });

        if (totalAnsweredQuestions === questions.length && totalWrongAnswers === 0) {
            showFinishScreen();
        } else if(totalAnsweredQuestions === questions.length && totalWrongAnswers===1 && questions[currentQuestion].userAnswer !== questions[currentQuestion].correctAnswer) {
            showFinishScreen();
        } else {
            showQustionsList();
        }
    }, 1000);
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
        <div class="correction-screen">
            <h3>الاجابات الصحيحة:</h3>
            <ul>
                ${questions.map((q, index) => `<li><strong>${q.question}: ${q.correctAnswer}</strong></li>`).join('')}
            </ul>
        </div>
    `;
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
