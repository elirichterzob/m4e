document.addEventListener('DOMContentLoaded', () => {
    const schemeButtons = document.querySelectorAll('.scheme-button');
    const resetButton = document.getElementById('resetButton');
    const undoButton = document.createElement('button'); // Créer le bouton "Annuler"
    undoButton.id = 'undoButton';
    undoButton.className = 'reset-button'; // Réutiliser le style du bouton de réinitialisation
    undoButton.textContent = 'Annuler le dernier clic';
    resetButton.parentNode.insertBefore(undoButton, resetButton.nextSibling); // Insérer après le bouton de réinitialisation

    let selectedSchemes = new Set();
    let history = []; // Pile pour stocker les états précédents

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

    // Fonction pour désactiver tous les boutons non actifs
    function deactivateAllNonActiveButtons() {
        schemeButtons.forEach(button => {
            if (!button.classList.contains('active')) {
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.5';
            }
        });
    }

    // Fonction pour activer un bouton spécifique
    function activateButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        }
    }

    // Fonction pour mettre à jour l'état visuel de tous les boutons
    function updateButtonStates() {
        schemeButtons.forEach(button => {
            const schemeId = button.dataset.scheme;
            if (selectedSchemes.has(schemeId)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        // Mettre à jour l'état du bouton Annuler
        undoButton.disabled = history.length === 0;
        undoButton.style.opacity = history.length === 0 ? '0.5' : '1';
        undoButton.style.cursor = history.length === 0 ? 'not-allowed' : 'pointer';
    }

    // Fonction pour réinitialiser la page à son état initial
    function resetPage() {
        selectedSchemes.clear();
        history = []; // Vider l'historique lors de la réinitialisation
        schemeButtons.forEach(button => {
            button.classList.remove('active');
            button.classList.remove('selected');
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });
        updateButtonStates(); // Mettre à jour l'état du bouton Annuler
    }

    // Fonction pour restaurer un état précédent
    function restoreState(state) {
        selectedSchemes = new Set(state.selectedSchemes);
        schemeButtons.forEach(button => {
            button.classList.remove('active'); // Nettoyer l'état actif précédent
            button.style.pointerEvents = 'none'; // Désactiver tous les boutons initialement
            button.style.opacity = '0.5';
        });

        // Appliquer l'état actif sauvegardé
        if (state.activeScheme) {
            const activeButton = document.getElementById(state.activeScheme);
            if (activeButton) {
                activeButton.classList.add('active');
                activateButton(state.activeScheme);
            }
            // Réactiver les dépendances de l'état actif
            const nextSchemes = nextAvailableSchemes[state.activeScheme];
            if (nextSchemes) {
                nextSchemes.forEach(nextSchemeId => {
                    activateButton(nextSchemeId);
                });
            }
        } else {
            // Si pas d'état actif (début ou après annulation complète)
            schemeButtons.forEach(button => {
                button.style.pointerEvents = 'auto';
                button.style.opacity = '1';
            });
        }
        updateButtonStates();
    }

    // Initialisation : Tous les boutons sont cliquables et visibles au départ
    resetPage();

    schemeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Sauvegarder l'état actuel avant de le modifier
            history.push({
                selectedSchemes: new Set(selectedSchemes), // Copie du Set
                activeScheme: document.querySelector('.scheme-button.active')?.dataset.scheme // Sauvegarder le bouton actuellement actif
            });

            const selectedScheme = button.dataset.scheme;

            if (selectedSchemes.has(selectedScheme)) {
                selectedSchemes.delete(selectedScheme);
            } else {
                selectedSchemes.add(selectedScheme);
            }

            // Réinitialiser les classes 'active' de tous les boutons
            schemeButtons.forEach(btn => btn.classList.remove('active'));

            // Activer le bouton qui vient d'être cliqué
            button.classList.add('active');

            // Mettre à jour l'état visuel et les interactions
            updateButtonStates();
            deactivateAllNonActiveButtons(); // Désactiver tous les boutons qui ne sont pas 'active'
            activateButton(selectedScheme); // S'assurer que le bouton cliqué reste actif et interactif

            const nextSchemes = nextAvailableSchemes[selectedScheme];
            if (nextSchemes) {
                nextSchemes.forEach(nextSchemeId => {
                    activateButton(nextSchemeId);
                });
            }
        });
    });

    // Écouteur d'événement pour le bouton de réinitialisation
    resetButton.addEventListener('click', resetPage);

    // Écouteur d'événement pour le bouton "Annuler"
    undoButton.addEventListener('click', () => {
        if (history.length > 0) {
            const previousState = history.pop(); // Récupérer le dernier état
            restoreState(previousState);
        }
    });
});