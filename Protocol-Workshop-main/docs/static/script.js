document.addEventListener('DOMContentLoaded', () => {
    const personaCards = document.querySelectorAll('.persona-card');

    personaCards.forEach(card => {
        card.addEventListener('click', () => {
            const personaName = card.querySelector('h2').textContent;
            const personaDescription = card.querySelector('p').textContent;

            // Construct the URL with query parameters
            const workshopUrl = `workshop.html?personaName=${encodeURIComponent(personaName)}&personaDescription=${encodeURIComponent(personaDescription)}`;

            // Navigate to the workshop page
            window.location.href = workshopUrl;
        });
    });
});
