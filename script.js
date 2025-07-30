document.addEventListener('DOMContentLoaded', () => {
    const schemeButtons = document.querySelectorAll('.scheme-button');
    const resetButton = document.getElementById('resetButton'); // Récupérer le bouton de réinitialisation

    // Mappe les schémas aux schémas suivants disponibles, basés sur les informations du PDF.
    const nextAvailableSchemes = {
        "BREAKTHROUGH": ["ASSASSINATE", "PUBLIC DEMONSTRATION", "FRAME JOB"],
        "FRAME JOB": ["PUBLIC DEMONSTRATION", "HARNESS THE LEYLINE", "SCOUT THE ROOFTOPS"],
        "ASSASSINATE": ["SCOUT THE ROOFTOPS", "DETONATE CHARGES", "RUNIC BINDING"],
        "SCOUT THE ROOFTOPS": ["DETONATE CHARGES", "GRAVE ROBBING", "LEAVE YOUR MARK"],
        "DETONATE CHARGES": ["GRAVE ROBBING", "RUNIC BINDING", "TAKE THE HIGHGROUND"],
        "ENSNARE": ["RESHAPE THE LAND", "SEARCH THE AREA", "FRAME JOB"],
        "MAKE IT LOOK LIKE AN ACCIDENT": ["ENSNARE", "RESHAPE THE LAND", "BREAKTHROUGH"],
        "HARNESS THE LEYLINE": ["ASSASSINATE", "SCOUT THE ROOFTOPS", "GRAVE ROBBING"],
        "SEARCH THE AREA": ["BREAKTHROUGH", "FRAME JOB", "HARNESS THE LEYLINE"],
        "TAKE THE HIGHGROUND": ["MAKE IT LOOK LIKE AN ACCIDENT", "ENSNARE", "SEARCH THE AREA"],
        "GRAVE ROBBING": ["RUNIC BINDING", "LEAVE YOUR MARK", "MAKE IT LOOK LIKE AN ACCIDENT"],
        "RUNIC BINDING": ["LEAVE YOUR MARK", "TAKE THE HIGHGROUND", "ENSNARE"],
        "RESHAPE THE LAND": ["SEARCH THE AREA", "BREAKTHROUGH", "PUBLIC DEMONSTRATION"],
        "PUBLIC DEMONSTRATION": ["HARNESS THE LEYLINE", "ASSASSINATE", "DETONATE CHARGES"],
        "LEAVE YOUR MARK": ["TAKE THE HIGHGROUND", "MAKE IT LOOK LIKE AN ACCIDENT", "RESHAPE THE LAND"]
    };

    // Fonction pour désactiver tous les boutons et retirer la classe 'active'
    function deactivateAllButtons() {
        schemeButtons.forEach(button => {
            button.classList.remove('active');
            button.style.pointerEvents = 'none'; // Rendre le bouton non cliquable
            button.style.opacity = '0.5'; // Rendre le bouton légèrement transparent pour montrer qu'il est désactivé
        });
    }

    // Fonction pour activer un bouton spécifique
    function activateButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.pointerEvents = 'auto'; // Rendre le bouton cliquable
            button.style.opacity = '1'; // Rendre le bouton opaque
        }
    }

    // Fonction pour réinitialiser la page à son état initial
    function resetPage() {
        schemeButtons.forEach(button => {
            button.classList.remove('active'); // Retirer l'état actif de tous les boutons
            button.style.pointerEvents = 'auto'; // Rendre tous les boutons cliquables
            button.style.opacity = '1'; // Rendre tous les boutons entièrement visibles
        });
    }

    // Initialisation : Tous les boutons sont cliquables et visibles au départ
    resetPage();

    schemeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedScheme = button.dataset.scheme;

            // Désactiver tous les boutons
            deactivateAllButtons();

            // Activer le bouton qui vient d'être cliqué
            button.classList.add('active');
            activateButton(selectedScheme); // S'assurer qu'il est cliquable et visible

            // Récupérer les schémas disponibles suivants pour le schéma sélectionné
            const nextSchemes = nextAvailableSchemes[selectedScheme];

            // Activer uniquement les schémas dépendants
            if (nextSchemes) {
                nextSchemes.forEach(nextSchemeId => {
                    activateButton(nextSchemeId);
                });
            }
        });
    });

    // Ajouter l'écouteur d'événement pour le bouton de réinitialisation
    resetButton.addEventListener('click', resetPage);
});