document.getElementById('add-grade').addEventListener('click', addGradeInput);
document.getElementById('add-exam').addEventListener('click', addExamInput);

let examAdded = false;

function addGradeInput() {
    const gradesContainer = document.getElementById('grades-container');
    const newGradeInput = document.createElement('div');
    newGradeInput.className = 'grade-input';
    newGradeInput.innerHTML = `
        <label>Nota:</label>
        <input type="number" class="grade" placeholder="Nota" min="0" max="100" onchange="calculateAverage()">
        <input type="number" class="percentage" placeholder="%" min="0" max="100" onchange="calculateAverage()">
    `;
    gradesContainer.appendChild(newGradeInput);
}

function addExamInput() {
    if (examAdded) {
        alert('El campo del examen ya ha sido añadido.');
        return;
    }

    const gradesContainer = document.getElementById('grades-container');
    const examPercentage = prompt('Ingrese el porcentaje del examen:');

    if (examPercentage && !isNaN(examPercentage) && examPercentage > 0 && examPercentage <= 100) {
        adjustPercentages(examPercentage);

        const examGradeContainer = document.createElement('div');
        examGradeContainer.className = 'grade-input';
        examGradeContainer.innerHTML = `
            <label class="exam-label">Nota Examen:</label>
            <input type="number" class="grade" placeholder="Nota" min="0" max="100" onchange="calculateAverage()">
            <input type="number" class="percentage" value="${examPercentage}" readonly>
        `;
        gradesContainer.appendChild(examGradeContainer);
        examAdded = true;
    } else {
        alert('Porcentaje inválido.');
    }
}

function adjustPercentages(examPercentage) {
    const otherPercentageInputs = document.querySelectorAll('.percentage:not([readonly])');
    const totalCurrentPercentage = Array.from(otherPercentageInputs).reduce((acc, input) => acc + parseFloat(input.value || 0), 0);
    const remainingPercentage = 100 - examPercentage;

    if (remainingPercentage <= 100) {
        const adjustedPercentages = Array.from(otherPercentageInputs).map(input => {
            const currentValue = parseFloat(input.value || 0);
            return (currentValue * remainingPercentage) / totalCurrentPercentage;
        });

        otherPercentageInputs.forEach((input, index) => {
            input.dataset.adjustedValue = adjustedPercentages[index];
        });
        calculateAverage();
    }
}

function calculateAverage() {
    const gradeInputs = document.querySelectorAll('.grade');
    const percentageInputs = document.querySelectorAll('.percentage');
    let total = 0;
    let totalPercentage = 0;

    gradeInputs.forEach((gradeInput, index) => {
        const grade = parseFloat(gradeInput.value);
        const percentageInput = percentageInputs[index];
        const percentage = parseFloat(percentageInput.dataset.adjustedValue || percentageInput.value);

        if (!isNaN(grade) && !isNaN(percentage)) {
            total += (grade * percentage) / 100;
            totalPercentage += percentage;
        }
    });

    const average = totalPercentage > 0 ? total : 0;
    const finalAverage = totalPercentage === 100 ? total : 0;

    document.getElementById('average').textContent = average.toFixed(2);
    document.getElementById('final-average').textContent = finalAverage.toFixed(2);
}

