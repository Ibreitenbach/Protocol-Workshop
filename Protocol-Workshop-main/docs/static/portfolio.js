document.addEventListener('DOMContentLoaded', () => {
    const portfolioListContainer = document.getElementById('portfolioListContainer');
    const emptyPortfolioMessage = document.getElementById('emptyPortfolioMessage');

    function loadPortfolioItems() {
        const personas = JSON.parse(localStorage.getItem('personas')) || [];

        if (personas.length === 0) {
            emptyPortfolioMessage.style.display = 'block';
            portfolioListContainer.style.display = 'none';
            return;
        } else {
            emptyPortfolioMessage.style.display = 'none';
            // Ensure container is visible, could be 'flex' or 'grid' depending on CSS
            portfolioListContainer.style.display = 'flex'; // Matches CSS for flex-direction: column
            portfolioListContainer.innerHTML = ''; // Clear existing items
        }

        // Display up to 3 personas as per MVP, but code will display all found.
        // The saving logic in workshop.js is expected to handle the limit if strict.
        personas.forEach(persona => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'portfolio-item';
            itemDiv.setAttribute('data-id', persona.id);

            const nameP = document.createElement('p');
            nameP.className = 'portfolio-item-name'; // Added class for styling
            nameP.textContent = persona.name;

            const actionsDiv = document.createElement('div'); // Container for buttons
            actionsDiv.className = 'portfolio-item-actions';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn'; // General button styling + specific edit
            editButton.addEventListener('click', () => handleEdit(persona.id));

            const generateButton = document.createElement('button');
            generateButton.textContent = 'Generate Prompt';
            generateButton.className = 'primary-action'; // General button styling + primary
            generateButton.addEventListener('click', () => handleGenerate(persona.id));

            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(generateButton);

            itemDiv.appendChild(nameP);
            itemDiv.appendChild(actionsDiv);

            portfolioListContainer.appendChild(itemDiv);
        });
    }

    function handleEdit(personaId) {
        window.location.href = `workshop.html?editPersonaId=${personaId}`;
    }

    function handleGenerate(personaId) {
        const personas = JSON.parse(localStorage.getItem('personas')) || [];
        const personaToGenerate = personas.find(p => p.id === personaId);

        if (personaToGenerate) {
            const params = new URLSearchParams();
            // Use personaToGenerate.name for 'customName' as this is the user-defined name
            params.append('customName', personaToGenerate.name);
            // Use personaToGenerate.originalName for 'basePersona'
            // Based on workshop.js, it saves originalName: originalBaseName || customName
            // and also has a 'name' field for the custom name.
            // The prompt generation needs the *original* base template name.
            // Let's assume workshop.js saves 'basePersonaName' as the base template name.
            params.append('basePersona', personaToGenerate.basePersonaName || 'General'); // Fallback if basePersonaName is missing
            params.append('tone', personaToGenerate.tone);
            params.append('creativity', personaToGenerate.creativity);
            params.append('socratic', personaToGenerate.socratic);
            params.append('devilsAdvocate', personaToGenerate.devilsAdvocate);

            window.location.href = `output.html?${params.toString()}`;
        } else {
            alert('Could not find persona details to generate prompt.');
        }
    }

    // Initial load
    loadPortfolioItems();
});
