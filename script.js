const API_URL = "https://api.edenai.run/v1/completion";
const API_KEY = process.env.AI_KEY;  // GitHub Secret for AI Key

const startingElements = [
    { name: 'Water', emoji: '💧' },
    { name: 'Fire', emoji: '🔥' },
    { name: 'Earth', emoji: '🌍' },
    { name: 'Air', emoji: '🌬️' }
];

let selectedElements = [];

document.addEventListener('DOMContentLoaded', () => {
    const elementsContainer = document.getElementById('elements-container');
    
    // Display starting elements
    startingElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element');
        elementDiv.textContent = element.emoji;
        elementDiv.dataset.name = element.name;
        elementsContainer.appendChild(elementDiv);

        // Select element on click
        elementDiv.addEventListener('click', () => {
            if (selectedElements.includes(element.name)) {
                selectedElements = selectedElements.filter(el => el !== element.name);
                elementDiv.style.border = 'none';
            } else {
                selectedElements.push(element.name);
                elementDiv.style.border = '2px solid blue';
            }
        });
    });

    // Handle combine button
    document.getElementById('combine').addEventListener('click', async () => {
        if (selectedElements.length === 2) {
            const combination = selectedElements.join(' + ');
            const result = await getAICombination(combination);

            displayResult(result);
            selectedElements = [];
            resetSelection();
        } else {
            alert('Select two elements to combine!');
        }
    });
});

// Function to call Eden AI API
async function getAICombination(combination) {
    const data = {
        model: "text-davinci-003",
        prompt: `Create a new element for the combination: ${combination}`,
        max_tokens: 60
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    return result.choices[0].text.trim();
}

// Display the result on UI
function displayResult(result) {
    const resultContainer = document.getElementById('results-container');
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-item');
    resultDiv.textContent = result;
    resultContainer.appendChild(resultDiv);
}

// Reset element selection
function resetSelection() {
    document.querySelectorAll('.element').forEach(el => {
        el.style.border = 'none';
    });
}
