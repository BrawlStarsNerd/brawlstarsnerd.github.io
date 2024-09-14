const API_URL = "https://api.edenai.run/v1/completion";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMzIxZWU0ZDktNmEyYi00MzdiLWJiMmQtNGNiNzg4N2Y0MGU3IiwidHlwZSI6ImFwaV90b2tlbiJ9.0O7oCzxVNwap4uAG9-rFUo919VkHQ94R4h2ednJ-g_w";

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
                elementDiv.classList.remove('selected');
            } else if (selectedElements.length < 2) {
                selectedElements.push(element.name);
                elementDiv.classList.add('selected');
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
            alert('Please select two elements to combine!');
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
    const newElementsContainer = document.getElementById('new-elements');
    newElementsContainer.textContent = result;
}

// Reset element selection
function resetSelection() {
    document.querySelectorAll('.element').forEach(el => {
        el.classList.remove('selected');
    });
}
