document.addEventListener('DOMContentLoaded', () => {
    const schemeButtons = document.querySelectorAll('.scheme-button');
    const resetButton = document.getElementById('resetButton');
    const undoButton = document.createElement('button');
    undoButton.id = 'undoButton';
    undoButton.className = 'reset-button';
    undoButton.textContent = 'Annuler le dernier clic';
    resetButton.parentNode.insertBefore(undoButton, resetButton.nextSibling);

    const schemeDetailsContent = document.getElementById('schemeDetailsContent');

    let selectedSchemes = new Set();
    let history = [];

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

    const schemeDescriptions = {
        "BREAKTHROUGH": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme when an enemy model ends its activation.",
            "SCORING": "When this scheme is revealed, remove one friendly Scheme marker in the enemy deployment zone that does not have an enemy model within 2\" of it to gain 1 VP.",
            "ADDITIONAL VP": "When this scheme is revealed you may also remove one friendly Scheme marker from the centerline and one friendly Scheme marker from your deployment zone to gain 1 additional VP."
        },
        "FRAME JOB": {
            "SCORED VP": "1/2",
            "ON SELECTION": "When this scheme is selected, secretly choose a friendly model.",
            "REVEAL": "You may reveal this scheme after the chosen model suffers damage from an enemy attack action targeting it while it is on the enemy table half.",
            "SCORING": "When this scheme is revealed, gain 1 VP.",
            "ADDITIONAL VP": "When this scheme is revealed, you may remove one friendly Scheme marker from within 2\" of the chosen model to gain 1 additional VP."
        },
        "ASSASSINATE": {
            "SCORED VP": "1/2",
            "ON SELECTION": "When this scheme is selected, secretly choose a unique enemy model that has half or more of its maximum health remaining.",
            "REVEAL": "You may reveal this scheme after the chosen model is reduced to below half of its maximum health.",
            "SCORING": "When this scheme is revealed, gain 1 VP.",
            "ADDITIONAL VP": "At the end of the turn on which this scheme was revealed, if the chosen model has been killed, gain 1 additional VP."
        },
        "SCOUT THE ROOFTOPS": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "Scheme markers are qualifying for this scheme if they: Are not within 6\" of your deployment zone. Do not have an enemy model at the same elevation within 2\". Are at elevation 2 or higher. When this scheme is revealed, remove one qualifying Scheme marker from two different terrain pieces to gain 1 VP (two Scheme markers total).",
            "ADDITIONAL VP": "When this scheme is revealed, select one additional qualifying Scheme marker that is completely on the enemy table half and remove it to gain 1 VP."
        },
        "DETONATE CHARGES": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "When this scheme is revealed, remove two friendly Scheme markers that are within 2\" of enemy model(s) to gain 1 VP.",
            "ADDITIONAL VP": "When this scheme is revealed you may remove one additional qualifying Scheme marker to gain 1 additional VP."
        },
        "ENSNARE": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme when an enemy model ends its activation.",
            "SCORING": "When this scheme is revealed, remove two friendly Scheme markers from within 2\" a single unique enemy model to gain 1 VP.",
            "ADDITIONAL VP": "When this scheme is revealed, if the enemy unique model is engaged by a model of lower cost, gain 1 additional VP."
        },
        "MAKE IT LOOK LIKE AN ACCIDENT": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme when an enemy model suffers damage due to falling.",
            "SCORING": "When this scheme is revealed, gain 1 VP.",
            "ADDITIONAL VP": "If at the end of the turn on which this scheme was revealed the enemy model that fell has been killed or has less than half of its maximum health, gain 1 additional VP."
        },
        "HARNESS THE LEYLINE": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "When this scheme is revealed, remove two friendly Scheme markers on the centerline not within 6” of another marker used to score this scheme and that do not have any enemy models within 2\" to gain 1 VP.",
            "ADDITIONAL VP": "Remove one additional qualifying marker to gain 1 additional VP."
        },
        "SEARCH THE AREA": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme at the end of any enemy activation.",
            "SCORING": "When this scheme is revealed, select a piece of terrain completely on the enemy table half. Remove three friendly Scheme markers from within 1\" of the selected terrain that do not have enemy models within 2\" of them to gain 1 VP.",
            "ADDITIONAL VP": "At the end of the turn on which this scheme was revealed, you may remove one friendly Scheme marker from within 1\" of the selected terrain to gain 1 VP."
        },
        "TAKE THE HIGHGROUND": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "When you reveal this scheme, if you control at least two Ht 2 or greater terrain pieces gain 1 VP.",
            "ADDITIONAL VP": "If you control at least three qualifying terrain pieces gain 1 additional VP."
        },
        "GRAVE ROBBING": {
            "SCORED VP": "1/2",
            "ON SELECTION": "When this scheme is selected, secretly choose a type of non-Scheme marker.",
            "REVEAL": "After killing an enemy model within 2\" of both one or more friendly Scheme marker(s) and one or more of the chosen marker, reveal this scheme.",
            "SCORING": "When this scheme is revealed, remove one friendly Scheme marker within 2\" of the killed model to gain 1 VP.",
            "ADDITIONAL VP": "Until the end of the turn, friendly models may target enemy Remains markers with the Interact action to remove them and place them on your crew card. At the end of the turn remove all Remains markers from your crew card that were placed this way. If two or more are removed, gain 1 additional VP."
        },
        "RUNIC BINDING": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme when an enemy model ends its activation.",
            "SCORING": "When this scheme is revealed, choose three friendly Scheme markers in play. Each chosen marker must be within 14\" of at least one of the other chosen markers. If there is at least one enemy model within the area formed between the chosen markers, gain 1 VP. Remove the chosen markers.",
            "ADDITIONAL VP": "When this scheme is revealed, if the combined cost of the enemy models in that area is 15 or greater, gain 1 additional VP."
        },
        "RESHAPE THE LAND": {
            "SCORED VP": "1/2",
            "ON SELECTION": "When this scheme is selected, secretly choose a marker type.",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "If there are four friendly markers of the chosen type completely on the enemy table half, gain 1 VP. Then, if the chosen marker type was Scheme, remove all markers used to score this scheme.",
            "ADDITIONAL VP": "When this scheme is revealed, if there are five friendly markers of the chosen type completely on the enemy table half, gain 1 additional VP."
        },
        "PUBLIC DEMONSTRATION": {
            "SCORED VP": "1/2",
            "ON SELECTION": "When this scheme is selected, secretly choose a unique enemy model.",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "When this scheme is revealed, if there are two or more friendly minions within 2” of the chosen model, gain 1 VP.",
            "ADDITIONAL VP": "When this scheme is revealed, remove a friendly Scheme marker from within 1” of the chosen model to gain 1 additional VP."
        },
        "LEAVE YOUR MARK": {
            "SCORED VP": "1/2",
            "REVEAL": "You may reveal this scheme at the end of any turn.",
            "SCORING": "When this scheme is revealed, if there are more friendly Scheme markers within 1\" of the centerpoint than enemy Scheme markers within 1\" of the centerpoint, gain 1 VP. Then, remove all friendly Scheme markers within 1\" of the centerpoint.",
            "ADDITIONAL VP": "When this scheme is revealed, if there are at least two more friendly Scheme markers within 1\" of the centerpoint than enemy Scheme markers within 1\" of the centerpoint, gain 1 additional VP."
        }
    };


    // Fonction pour afficher les détails du schéma avec la mise en page du PDF
    function displaySchemeDetails(schemeName) {
        const details = schemeDescriptions[schemeName];
        if (details) {
            let htmlContent = `<h3>${schemeName}</h3>`;
            for (const key in details) {
                if (details.hasOwnProperty(key) && key !== "SCORED VP") { // Ignorer la clé "SCORED VP"
                    htmlContent += `<div class="scheme-detail-section">`;
                    htmlContent += `<p class="scheme-detail-label"><strong>${key}:</strong></p>`;
                    htmlContent += `<p class="scheme-detail-text">${details[key]}</p>`;
                    htmlContent += `</div>`;
                }
            }
            schemeDetailsContent.innerHTML = htmlContent;
        } else {
            schemeDetailsContent.innerHTML = `<p class="info-message">Aucun détail disponible pour "${schemeName}".</p>`;
        }
    }

    // Fonctions existantes
    function deactivateAllNonActiveButtons() {
        schemeButtons.forEach(button => {
            if (!button.classList.contains('active')) {
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.5';
            }
        });
    }

    function activateButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        }
    }

    function updateButtonStates() {
        schemeButtons.forEach(button => {
            const schemeId = button.dataset.scheme;
            if (selectedSchemes.has(schemeId)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        undoButton.disabled = history.length === 0;
        undoButton.style.opacity = history.length === 0 ? '0.5' : '1';
        undoButton.style.cursor = history.length === 0 ? 'not-allowed' : 'pointer';
    }

    function resetPage() {
        selectedSchemes.clear();
        history = [];
        schemeButtons.forEach(button => {
            button.classList.remove('active');
            button.classList.remove('selected');
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });
        schemeDetailsContent.innerHTML = `<p class="info-message">Cliquez sur un schéma pour voir ses détails ici.</p>`;
        updateButtonStates();
    }

    function restoreState(state) {
        selectedSchemes = new Set(state.selectedSchemes);
        schemeButtons.forEach(button => {
            button.classList.remove('active');
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.5';
        });

        if (state.activeScheme) {
            const activeButton = document.getElementById(state.activeScheme);
            if (activeButton) {
                activeButton.classList.add('active');
                activateButton(state.activeScheme);
                displaySchemeDetails(state.activeScheme);
            }
            const nextSchemes = nextAvailableSchemes[state.activeScheme];
            if (nextSchemes) {
                nextSchemes.forEach(nextSchemeId => {
                    activateButton(nextSchemeId);
                });
            }
        } else {
            schemeButtons.forEach(button => {
                button.style.pointerEvents = 'auto';
                button.style.opacity = '1';
            });
            schemeDetailsContent.innerHTML = `<p class="info-message">Cliquez sur un schéma pour voir ses détails ici.</p>`;
        }
        updateButtonStates();
    }

    // Initialisation
    resetPage();

    schemeButtons.forEach(button => {
        button.addEventListener('click', () => {
            history.push({
                selectedSchemes: new Set(selectedSchemes),
                activeScheme: document.querySelector('.scheme-button.active')?.dataset.scheme
            });

            const selectedScheme = button.dataset.scheme;

            if (selectedSchemes.has(selectedScheme)) {
                selectedSchemes.delete(selectedScheme);
            } else {
                selectedSchemes.add(selectedScheme);
            }

            schemeButtons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');

            updateButtonStates();
            deactivateAllNonActiveButtons();
            activateButton(selectedScheme);
            displaySchemeDetails(selectedScheme);

            const nextSchemes = nextAvailableSchemes[selectedScheme];
            if (nextSchemes) {
                nextSchemes.forEach(nextSchemeId => {
                    activateButton(nextSchemeId);
                });
            }
        });
    });

    resetButton.addEventListener('click', resetPage);

    undoButton.addEventListener('click', () => {
        if (history.length > 0) {
            const previousState = history.pop();
            restoreState(previousState);
        }
    });
});