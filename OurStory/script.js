
const questions = [
    {
        question: "1. Nama movie ponoma? Andha date enna? ❤️",
        options: [
            "08/08/2026",
            "14/02/2026",
            "01/01/2026",
            "25/12/2026"
        ],
        answer: 0,
        date: "08/08/2026",
        caption: "Our special movie day 🎬❤️",
        message: "Indha date namma marakka mudiyadha special day! 💕",
        photo: "assets/memory-1.jpeg"
    },
    {
        question: "2. kovil date epo ponom ? 📸",
        options: [
            "Birthday party",
            "Papa birthday",
            "College day",
            "Long travel"
        ],
        answer: 1,
        date: "Papa Birthday 🎂",
        caption: "A special memory together 💖",
        message: "Papa birthday-la edutha namma cute memory! 🥰",
        photo: "assets/memory-2.jpeg"
    },
    {
        question: "3. Ippo varaikum enna paathu shy aaveya, mateya? 🙈❤️",
        options: [
            "Yes 😳",
            "No 😎"
        ],
        answer: 0,
        date: "Our shy moments 🙈",
        caption: "Still making me blush 💗",
        message: "Awww! Un shy moments enakku romba cute-ah irukku! 😘",
        photo: "assets/memory-3.jpeg"
    },
    {
        question: "4. Namma long travel edhula ponom? 🚆",
        options: [
            "Bus 🚌",
            "Car 🚗",
            "Train 🚆",
            "Bike 🏍️"
        ],
        answer: 2,
        date: "Our Long Travel 🚆",
        caption: "Long journey, beautiful memories ❤️",
        message: "Train journey-la namma serndhu create panna memories! 💕",
        photo: "assets/memory-4.jpeg"
    },
    {
        question: "5. Neethaan en ________? ❤️",
        options: [
            "Happiness 😊",
            "Favourite person 🥰",
            "Everything to me 💖",
            "ponnvasantham 💍"
        ],
        answer: 2,
        date: "You are my everything 💖",
        caption: "My favourite person forever ❤️",
        message: "Neethaan en everything! En life-la romba special person nee dhaan! 🫶",
        photo: "assets/memory-5.jpeg"
    },
    {
        question: "6. Namma cute pic paatha enna nyabagam varum? 🥹",
        options: [
            "You ❤️",
            "Me 🙈",
            "US 💑",
            "Our memories 💕"
        ],
        answer: 3,
        date: "US 💑",
        caption: "Just you and me, forever ❤️",
        message: "Correct! It's US — namma rendu perum serndha azhagana story! 💋❤️",
        photo: "assets/memory-6.jpeg"
    }
];


let currentQuestion = 0;
let score = 0;
let selected = null;
let revealed = false;

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("startBtn").addEventListener("click", () => {
  showScreen("quiz");
  renderQuestion();
});

function renderQuestion() {
  const q = questions[currentQuestion];

  selected = null;
  revealed = false;

  $("question").textContent = q.question;
  $("questionNumber").textContent =
    `Memory ${currentQuestion + 1} of ${questions.length}`;

  $("feedback").textContent = "";
  $("submitBtn").disabled = true;
  $("submitBtn").textContent = "Unlock Memory ♡";

  $("memoryCard").classList.add("hidden");
  $("memoryPhoto").removeAttribute("src");
  $("options").innerHTML = "";
  $("typedAnswer").value = "";
  $("typedAnswer").disabled = false;

  $("typedAnswer").classList.toggle("hidden", q.type !== "text");
  $("options").classList.toggle("hidden", q.type === "text");

  if (q.type === "text") return;

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => {
      if (revealed) return;

      selected = index;

      document.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
      $("submitBtn").disabled = false;
      $("feedback").textContent = "";
    });

    $("options").appendChild(button);
  });
}

$("typedAnswer").addEventListener("input", () => {
  if (revealed) return;
  $("submitBtn").disabled = !$("typedAnswer").value.trim();
});

$("submitBtn").addEventListener("click", () => {
  if (revealed) {
    currentQuestion++;

    if (currentQuestion < questions.length) {
      renderQuestion();
    } else {
      showScreen("timeline");
    }
    return;
  }

  const q = questions[currentQuestion];

  if (q.type === "text" && !$("typedAnswer").value.trim()) return;
  if (q.type !== "text" && selected === null) return;

  let correct = false;

  if (q.type === "text") {
    const typed = $("typedAnswer").value.trim().toLowerCase();
    correct = (q.acceptedAnswers || []).some(
      answer => answer.toLowerCase() === typed
    );
  } else {
    correct = selected === q.answer;
  }

  if (correct) score++;

  revealed = true;

  if (q.type !== "text") {
    document.querySelectorAll(".option-btn").forEach((btn, index) => {
      btn.disabled = true;

      if (index === q.answer) btn.classList.add("correct");
      if (index === selected && !correct) btn.classList.add("wrong");
    });
  } else {
    $("typedAnswer").disabled = true;
  }

  $("feedback").textContent = correct
    ? `Correct, my love! ❤️ ${q.message}`
    : `That's okay, sweetheart. ❤️ ${q.message}`;

  // Reveal the memory even when the answer is incorrect.
  $("memoryCard").classList.remove("hidden");
  $("memoryDate").textContent = q.date;
  $("memoryCaption").textContent = q.caption;
  $("memoryMessage").textContent = q.message;

  const photo = $("memoryPhoto");
  photo.alt = q.caption;
  photo.onerror = () => {
    photo.alt = "Add your personal photo at " + q.photo;
    photo.removeAttribute("src");
    photo.style.display = "none";
    $("memoryMessage").textContent =
      q.message + " (Add your photo file: " + q.photo + ")";
  };
  photo.onload = () => {
    photo.style.display = "block";
  };
  photo.style.display = "block";
  photo.src = q.photo;

  $("submitBtn").disabled = false;
  $("submitBtn").textContent =
    currentQuestion === questions.length - 1
      ? "Continue Our Story ♡"
      : "Next Memory ♡";
});

$("finalBtn").addEventListener("click", () => {
  $("score").textContent = `${score} / ${questions.length}`;
  showScreen("final");
});

$("letterBtn").addEventListener("click", () => {
  $("letter").classList.toggle("hidden");
  $("letterBtn").textContent = $("letter").classList.contains("hidden")
    ? "Open Your Love Letter 💌"
    : "Close Your Love Letter ♥";
});

$("replayBtn").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  selected = null;
  revealed = false;
  $("letter").classList.add("hidden");
  $("letterBtn").textContent = "Open Your Love Letter 💌";
  showScreen("home");
});

// Optional background music.
// Add your music file at assets/romantic-music.mp3.
const music = $("bgMusic");

$("musicBtn").addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      $("musicBtn").textContent = "♫ Music On";
    } catch (error) {
      alert("Add assets/romantic-music.mp3 first, then try again.");
    }
  } else {
    music.pause();
    $("musicBtn").textContent = "♫ Music Off";
  }
});
