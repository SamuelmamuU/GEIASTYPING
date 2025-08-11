const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const startBtn = document.getElementById("start-test");
const stopBtn = document.getElementById("stop-test");
const returnBtn = document.getElementById("return-test");
const resultBox = document.querySelector(".result");
const mistakesEl = document.getElementById("mistakes");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("accuracy");
const userDataForm = document.getElementById("user-data-form");
const saveDataBtn = document.getElementById("save-data-btn");
const btnTableAnchor = document.getElementById("btn-table");

let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;
let currentQuote = null; 


const quotes = [
  "Como ingeniero administrador de sistemas, eres el arquitecto invisible. Diseñas la estructura, optimizas los flujos y garantizas que la tecnología se convierta en una herramienta, no en un obstáculo. Tu ingenio crea el futuro, línea por línea, con cada sistema que construyes.",
  "La creatividad es la inteligencia divirtiéndose. A menudo, las ideas más innovadoras surgen de la experimentación y de atreverse a pensar de manera diferente. Fomentar la curiosidad es el primer paso para desbloquear un potencial ilimitado.",
  "El éxito no es el final, el fracaso no es fatal: es el coraje para continuar lo que cuenta. Cada error es una oportunidad de aprendizaje, cada caída es una lección de resiliencia. El camino hacia la excelencia está pavimentado con perseverancia.",
  "La tecnología avanza a pasos agigantados, transformando la manera en que vivimos y trabajamos. Adaptarse a estos cambios no solo es necesario, sino también una oportunidad para reinventarse y descubrir nuevas posibilidades en un mundo cada vez más conectado.",
  "En un equipo, la comunicación efectiva es el puente que conecta mentes y talentos, permitiendo que las ideas fluyan libremente y se conviertan en realidades. El respeto mutuo y la escucha activa son los pilares de una colaboración exitosa."
];

function renderNewQuote() {
  
  if (!currentQuote) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
  }
  
  quote = currentQuote;

 
  const arr = quote.split("").map(ch => {
    
    return `<span class="quote-chars">${ch}</span>`;
  });
  quoteSection.innerHTML = arr.join("");
  mistakes = 0;
  mistakesEl.innerText = 0;
  wpmEl.innerText = "0 wpm";
  accEl.innerText = "0 %";
}


userInput.addEventListener("input", () => {
  const quoteChars = Array.from(document.querySelectorAll(".quote-chars"));
  const userInputChars = userInput.value.split("");
  mistakes = 0;

 
  quoteChars.forEach((charSpan, index) => {
    const typed = userInputChars[index];
    charSpan.classList.remove("success", "fail");

    if (typed == null) {
      // aún no se escribió este carácter
      return;
    }
    if (typed === charSpan.textContent) {
      charSpan.classList.add("success");
    } else {
      charSpan.classList.add("fail");
      mistakes++;
    }
  });

 
  const extras = Math.max(0, userInputChars.length - quoteChars.length);
  if (extras > 0) mistakes += extras;

  mistakesEl.innerText = mistakes;

  
  const correctCharsCount = document.querySelectorAll(".quote-chars.success").length;
  if (correctCharsCount === quoteChars.length) {
    displayResult();
  }
});


function updateTimer() {
  if (time <= 0) {
    displayResult();
  } else {
    time--;
    document.getElementById("timer").innerText = time + "s";
  }
}
function timeReduce() {
  clearInterval(timer);
  time = 60;
  document.getElementById("timer").innerText = time + "s";
  timer = setInterval(updateTimer, 1000);
}


function displayResult() {
  
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }

  resultBox.style.display = "block";
  stopBtn.style.display = "none";
  userInput.disabled = true;

  const typed = userInput.value.length;
  const correctCharsCount = document.querySelectorAll(".quote-chars.success").length;

  
  const elapsedSeconds = Math.max(1, 60 - time);
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60);

  
  const wpm = (correctCharsCount / 5) / minutes;
  const wpmText = isFinite(wpm) ? wpm.toFixed(2) : "0";

  
  const accuracy = typed > 0 ? Math.round((correctCharsCount / typed) * 100) : 0;

  
  wpmEl.innerText = wpmText + " wpm";
  accEl.innerText = accuracy + " %";

  
  window.tempTestData = {
    wpm: wpmText,
    accuracy: accuracy,
    mistakes: mistakes,
    timeFinal: (time <= 0) ? "Se terminó tiempo" : elapsedSeconds + "s"
  };

  
  returnBtn.style.display = "inline-block";
  btnTableAnchor.style.display = "inline-block";
  userDataForm.style.display = "block";
}


function startTest() {
  mistakes = 0;
  userInput.disabled = false;
  userInput.value = "";
  startBtn.style.display = "none";
  stopBtn.style.display = "inline-block";
  resultBox.style.display = "none";
  returnBtn.style.display = "none";
  btnTableAnchor.style.display = "none";
  userDataForm.style.display = "none";
  renderNewQuote();
  timeReduce();
  
  userInput.focus();
}


function saveUserData() {
  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();

  if (!fullName || !phoneNumber) {
    alert("Por favor complete todos los campos.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("typingUsers")) || [];

  const newEntry = {
    name: fullName,
    phone: phoneNumber,
    wpm: window.tempTestData ? window.tempTestData.wpm : "0",
    accuracy: window.tempTestData ? window.tempTestData.accuracy : "0",
    mistakes: window.tempTestData ? window.tempTestData.mistakes : 0,
    time: window.tempTestData ? window.tempTestData.timeFinal : "0s",
    date: new Date().toISOString()
  };

 
  users.unshift(newEntry);
  localStorage.setItem("typingUsers", JSON.stringify(users));

  
  document.getElementById("fullName").value = "";
  document.getElementById("phoneNumber").value = "";

  alert("Datos guardados correctamente (puedes agregar otro).");
}


startBtn.addEventListener("click", startTest);
stopBtn.addEventListener("click", displayResult);
returnBtn.addEventListener("click", () => location.reload());
saveDataBtn.addEventListener("click", saveUserData);


window.addEventListener("load", () => {
  userInput.value = "";
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
});