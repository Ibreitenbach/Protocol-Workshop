document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const basePersonaNameDisplay = document.getElementById('basePersonaName');
    const toneSlider = document.getElementById('toneSlider');
    const creativitySlider = document.getElementById('creativitySlider');
    const socraticToggle = document.getElementById('socraticToggle');
    const devilsAdvocateToggle = document.getElementById('devilsAdvocateToggle');
    const customPersonaNameInput = document.getElementById('customPersonaName');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const generatePromptBtn = document.getElementById('generatePromptBtn');

    let currentEditPersonaId = null; // To store ID if editing

    // Function to load persona data from URL or localStorage
    function loadPersonaData() {
        const params = new URLSearchParams(window.location.search);
        const personaNameFromLibrary = params.get('personaName');
        const editPersonaId = params.get('editPersonaId');

        if (editPersonaId) {
            currentEditPersonaId = editPersonaId;
            const personas = JSON.parse(localStorage.getItem('personas')) || [];
            const personaToEdit = personas.find(p => p.id === editPersonaId);

            if (personaToEdit) {
                basePersonaNameDisplay.textContent = `Editing: ${personaToEdit.basePersonaName || personaToEdit.name}`; // Changed originalName to basePersonaName
                customPersonaNameInput.value = personaToEdit.name;
                toneSlider.value = personaToEdit.tone;
                creativitySlider.value = personaToEdit.creativity;
                socraticToggle.checked = personaToEdit.socratic;
                devilsAdvocateToggle.checked = personaToEdit.devilsAdvocate;
                // Store the original base name if it's part of the persona object, for prompt generation.
                // For now, assume personaToEdit.originalBaseName or similar if needed.
            } else {
                alert('Persona to edit not found!');
                basePersonaNameDisplay.textContent = 'Customize: New Persona';
                setDefaultValues();
            }
        } else if (personaNameFromLibrary) {
            basePersonaNameDisplay.textContent = `Customize: ${decodeURIComponent(personaNameFromLibrary)}`;
            // Store this base name for saving if this persona gets saved
            // Could use a data attribute on basePersonaNameDisplay or a global variable.
            basePersonaNameDisplay.dataset.originalName = decodeURIComponent(personaNameFromLibrary);
            setDefaultValues();
        } else {
            basePersonaNameDisplay.textContent = 'Customize: New Persona';
            setDefaultValues();
        }
    }

    function setDefaultValues() {
        toneSlider.value = 50;
        creativitySlider.value = 50;
        socraticToggle.checked = false;
        devilsAdvocateToggle.checked = false;
        customPersonaNameInput.value = '';
    }

    // "Save Configuration" Logic
    saveConfigBtn.addEventListener('click', () => {
        const customName = customPersonaNameInput.value.trim();
        if (!customName) {
            alert('Please enter a custom name for your persona.');
            return;
        }

        const tone = toneSlider.value;
        const creativity = creativitySlider.value;
        const socratic = socraticToggle.checked;
        const devilsAdvocate = devilsAdvocateToggle.checked;

        let personas = JSON.parse(localStorage.getItem('personas')) || [];
        // Get the original base persona name (from library or existing)
        let baseNameToSave = basePersonaNameDisplay.dataset.originalName; // This comes from the initial template name
        if (currentEditPersonaId) {
             const existingPersona = personas.find(p => p.id === currentEditPersonaId);
             // If editing, preserve the original basePersonaName from when it was first created
             if(existingPersona && existingPersona.basePersonaName) {
                baseNameToSave = existingPersona.basePersonaName;
             }
        }


        if (currentEditPersonaId) { // Editing existing persona
            personas = personas.map(p =>
                p.id === currentEditPersonaId
                ? { ...p, name: customName, tone, creativity, socratic, devilsAdvocate, basePersonaName: baseNameToSave || customName } // Changed originalName to basePersonaName
                : p
            );
        } else { // Adding new persona
            const newPersona = {
                id: Date.now().toString(),
                name: customName,
                basePersonaName: baseNameToSave || customName, // Changed originalName to basePersonaName
                tone,
                creativity,
                socratic,
                devilsAdvocate
            };
            personas.push(newPersona);
        }

        // MVP: No explicit limit of 3 enforced here, portfolio will just display up to 3.
        // If strict limit needed:
        // if (personas.length > 3 && !currentEditPersonaId) {
        //     alert("Portfolio can only hold 3 personas. Please remove one to add a new one.");
        //     return;
        // }

        localStorage.setItem('personas', JSON.stringify(personas));
        alert('Configuration saved!');
        if (!currentEditPersonaId) { // If it was a new save, set the edit ID for subsequent saves
            const savedPersona = personas.find(p=>p.name === customName && p.tone === tone); // simplistic find
            if(savedPersona) currentEditPersonaId = savedPersona.id;
             basePersonaNameDisplay.textContent = `Editing: ${customName}`; // Update header
        } else {
            basePersonaNameDisplay.textContent = `Editing: ${customName}`; // Update header
        }

    });

    // "Generate Prompt" Logic
    generatePromptBtn.addEventListener('click', () => {
        const customName = customPersonaNameInput.value.trim();
        const tone = toneSlider.value;
        const creativity = creativitySlider.value;
        const socratic = socraticToggle.checked;
        const devilsAdvocate = devilsAdvocateToggle.checked;

        // Get base persona name (the part after "Customize: " or "Editing: ")
        // This is a bit fragile, relies on the text content format.
        // A better way would be to store the original base name in a data attribute or variable.
        let baseName = basePersonaNameDisplay.dataset.originalName; // From loading if it's a new customization
        if (currentEditPersonaId) {
            const personas = JSON.parse(localStorage.getItem('personas')) || [];
            const editedPersona = personas.find(p => p.id === currentEditPersonaId);
            // When generating prompt, use the stored basePersonaName
            if (editedPersona && editedPersona.basePersonaName) {
                baseName = editedPersona.basePersonaName;
            } else if (editedPersona && editedPersona.name && !editedPersona.basePersonaName) {
                 // Fallback if basePersonaName wasn't stored for some reason, use custom name as last resort
                 baseName = editedPersona.name;
            }
        }
        // if (!baseName) { // Fallback if dataset.originalName wasn't set (e.g. direct navigation to workshop.html)
        //     const textContent = basePersonaNameDisplay.textContent;
        //     if (textContent.startsWith('Customize: ')) {
        //         baseName = textContent.substring('Customize: '.length);
        //     } else if (textContent.startsWith('Editing: ')) {
        //         baseName = textContent.substring('Editing: '.length); // This would be the custom name
        //     }
        // }


        const params = new URLSearchParams();
        params.append('customName', customName || (baseName ? `Customized ${baseName}` : 'Unnamed Persona'));
        params.append('basePersona', baseName || 'General'); // Add base persona name for context
        params.append('tone', tone);
        params.append('creativity', creativity);
        params.append('socratic', socratic);
        params.append('devilsAdvocate', devilsAdvocate);

        window.location.href = `output.html?${params.toString()}`;
    });

    // Initial load
    loadPersonaData();
});
