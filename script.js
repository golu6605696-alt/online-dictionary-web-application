const searchBtn = document.getElementById('searchBtn');
const wordInput = document.getElementById('wordInput');
const resultDiv = document.getElementById('result');
const messageDiv = document.getElementById('message');

const fetchDefinition = async () => {
    const word = wordInput.value.trim();

    if (!word) {
        alert("Please enter a word!");
        return;
    }

    try {
        const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/${word}');
        
        if (!response.ok) {
            showError("Word not found. Please try another word.");
            return;
        }

        const data = await response.json();
        renderUI(data[0]);

    } catch (err) {
        showError("Something went wrong. Try again.");
    }
};

function renderUI(data) {
    messageDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');

    document.getElementById('wordTitle').innerText = data.word;
    document.getElementById('phonetic').innerText = data.phonetic || "";
    
    const meaningData = data.meanings[0];
    document.getElementById('pos').innerText = meaningData.partOfSpeech;
    document.getElementById('meaning').innerText = meaningData.definitions[0].definition;

    const exampleText = meaningData.definitions[0].example;
    document.getElementById('example').innerText = exampleText ? "${exampleText}" : "Example not available";

    const audioBtn = document.getElementById('audioBtn');
    const audioObj = data.phonetics.find(p => p.audio !== "");

    if (audioObj) {
        audioBtn.classList.remove('hidden');
        audioBtn.onclick = () => {
            new Audio(audioObj.audio).play();
        };
    } else {
        audioBtn.classList.add('hidden');
    }
}

function showError(msg) {
    resultDiv.classList.add('hidden');
    messageDiv.classList.remove('hidden');
    messageDiv.innerHTML =`<p style="color: red; font-weight:bold;">${msg}</p>`;
}

searchBtn.addEventListener('click', fetchDefinition);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchDefinition();
});