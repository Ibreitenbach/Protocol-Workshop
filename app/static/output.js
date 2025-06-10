document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const promptTextarea = document.getElementById('generatedPromptTextarea');
    const copyBtn = document.getElementById('copyPromptBtn');
    const backBtn = document.getElementById('backBtn');

    // Retrieve URL Parameters
    const params = new URLSearchParams(window.location.search);
    const customName = params.get('customName') || 'Unnamed Persona';
    const basePersona = params.get('basePersona') || 'Default Persona'; // From workshop.js or portfolio.js
    const tone = params.get('tone') || '50';
    const creativity = params.get('creativity') || '50';
    const socratic = params.get('socratic') === 'true'; // Converts "true" string to boolean true
    const devilsAdvocate = params.get('devilsAdvocate') === 'true'; // Converts "true" string to boolean true

    // Construct the "Master Prompt" (Placeholder Logic)
    const masterPrompt = `
Persona Profile:
  Name: ${customName}
  Original Template: ${basePersona}

Configuration:
  Tone (Formal <-> Casual): ${tone}/100
  Creativity (Grounded <-> Speculative): ${creativity}/100
  Socratic Questioning: ${socratic ? 'Enabled' : 'Disabled'}
  Devil's Advocate Mode: ${devilsAdvocate ? 'Enabled' : 'Disabled'}

--- Generated Master Prompt ---
(This is a placeholder. In a real system, AI would generate a detailed and nuanced prompt based on these settings, likely involving more sophisticated templating and logic beyond simple parameter injection.)

You are an AI assistant configured as "${customName}".
Your foundational characteristics are based on the "${basePersona}" template.
Your responses should reflect a tone level of approximately ${tone} on a scale of 0 (very formal) to 100 (very casual).
Your creativity level is set to ${creativity} on a scale of 0 (very grounded, factual) to 100 (highly speculative, imaginative).
${socratic ? "You should actively use Socratic questioning techniques to encourage deeper thought and explore assumptions." : "Socratic questioning is not a required mode of interaction for you."}
${devilsAdvocate ? "You are encouraged to play the role of a devil's advocate, critically examining ideas and presenting counterarguments to foster robust discussion." : "You should generally avoid taking a devil's advocate stance unless specifically appropriate for the user's query."}

Please begin your interaction based on this configuration.
    `.trim();

    // Set the textarea value
    promptTextarea.value = masterPrompt;

    // "Copy to Clipboard" Logic
    copyBtn.addEventListener('click', () => {
        if (!navigator.clipboard) {
            // Clipboard API not available (e.g., insecure context)
            promptTextarea.select();
            try {
                document.execCommand('copy');
                copyBtn.textContent = 'Copied (fallback)!';
            } catch (err) {
                alert('Failed to copy. Please try manually.');
                console.error('Fallback copy failed: ', err);
                copyBtn.textContent = 'Copy Failed';
            }
            setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
            return;
        }

        navigator.clipboard.writeText(promptTextarea.value)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy. Please try manually.');
                copyBtn.textContent = 'Copy Failed';
                setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
            });
    });

    // "Back" Button Logic
    backBtn.addEventListener('click', () => {
        // Go to the previous page in history if available, otherwise fallback.
        // This is generally a better UX than a fixed target like 'workshop.html'.
        if (document.referrer) {
            window.history.back();
        } else {
            // Fallback if no referrer (e.g., page was opened directly)
            // 'workshop.html' might be a sensible default if most generation flows from there.
            // Or 'portfolio.html' if that's another common entry point.
            window.location.href = 'workshop.html';
        }
    });
});
