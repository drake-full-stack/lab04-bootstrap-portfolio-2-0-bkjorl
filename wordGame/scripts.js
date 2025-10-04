// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

// TODO: Add keyboard event listener
document.addEventListener("keydown", (event) => {

    if (gameOver === true) {
        logDebug("Game is finished. No more guesses can be made", 'info')

    } else if (gameOver === false) {
        const key = event.key.toUpperCase();

        if (key.length === 1 && key >= 'A' && key <= 'Z') {
            logDebug("Valid letter!", 'info');
            addLetter(key)
        } else if (key === "BACKSPACE") {
            logDebug("backspace pressed", 'info');
            deleteLetter()

        } else if (key === "ENTER") {
            logDebug("enter pressed", 'info');
            submitGuess()
        } else {
            logDebug("please enter a letter, backspace, or enter", 'error');
        } 
        logDebug("A key was pressed:", event.key);
    }
});   

// TODO: Implement addLetter function
function addLetter(letter) {
    logDebug(`🎯 addLetter("${letter}") called`, 'info');
    if (currentTile >= 5) {
        logDebug("no more letters can be added to this guess", 'error');
        return;
    } else {
        const rowElement = rows[currentRow];
        const tiles = rowElement.querySelectorAll('.tile');
        const specificTile = tiles[currentTile];
        specificTile.textContent = letter;
        specificTile.classList.add('filled');
        logDebug(` ${letter}  added to position ${currentTile}`, 'success')
        logDebug(`current word: ${getCurrentWord()}`, 'info')
        currentTile ++;
        return;
    }
}

// TODO: Implement deleteLetter function  
function deleteLetter() {
    logDebug(`🗑️ deleteLetter() called`, 'info');
    if (currentTile <= 0) {
        logDebug('nothing to delete', 'error');
        return;
    } else {
        currentTile--
        const currentRowElement = rows[currentRow];
        const tiles = currentRowElement.querySelectorAll('.tile');
        const tileToDelete = tiles[currentTile];
        const letterBeingDeleted = tileToDelete.textContent;
        tileToDelete.textContent = ''; 
        tileToDelete.classList.remove('filled', 'info');
        logDebug(`Success: ${letterBeingDeleted}  was deleted from position ${currentTile}`, 'success')
        logDebug(`current word: ${getCurrentWord()}`, 'info') 
        return;   
    }   
}


// TODO: Implement submitGuess function
function submitGuess() {
    logDebug(`📝 submitGuess() called`, 'info');

    if (currentTile !== 5) {
        alert("Please enter 5 letters!");
        return;
    } else {
        const currentRowElement = rows[currentRow];
        const tiles = currentRowElement.querySelectorAll('.tile');
        let guess = ''; 
        tiles.forEach(tile => {
            guess += tile.textContent;
        });

        logDebug(`target word is: ${TARGET_WORD}`, 'info')
        logDebug(`word guessed: ${guess}`, 'info')

        checkGuess(guess, TARGET_WORD);
        
        currentRow++;
        currentTile = 0;

        if (guess === TARGET_WORD) {
            setTimeout(() => alert("Congratulations! You won!"), 500);
            logDebug('game has been won', 'info')
            gameOver = true;
             
            
        } else if (currentRow >= 6) {
            setTimeout(() => alert("You are out of guesses. Better luck next time."), 500);
            gameOver = true;
            logDebug('game has been lost', 'info')
        }
        return;
    }
}

function checkGuess(guess, tiles) {
    logDebug(`🔍 Starting analysis for "${guess}"`, 'info');
    
    // TODO: Split TARGET_WORD and guess into arrays
    const target = tiles.split("")
    const guessArray = guess.split("")
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    
    // STEP 1: Find exact matches
    for (let i = 0; i < 5; i++) {
        logDebug('step 2: checking for correctness', 'info')
        if (target[i] === guessArray[i]) {
            result[i] = 'correct';
            logDebug(`${guessArray[i]} at position ${i} is correct`, 'info')
            target[i] = null;
            guessArray[i] = null;            
            
        }
    }
    
    // STEP 2: Find wrong position matches  
    for (let i = 0; i < 5; i++) {
        logDebug('step 2: checking for presence', 'info')
        if (guessArray[i] !== null) { // only check unused letters
            for(let j = 0; j < 5; j++) {
                if (target[j] === guessArray[i] && guessArray[i] !== null) {
                    logDebug(`${guessArray[i]} is present`, 'info')
                    result[i] = 'present';
                    target[j] = null;
                    guessArray[i] = null;
                    
                }
                    
            }
        }
    }

    logDebug(`Final result: ${guess[0]}: ${result[0]} | ${guess[1]}: ${result[1]} | ${guess[2]}: ${result[2]} | ${guess[3]}: ${result[3]} | ${guess[4]}: ${result[4]} `)

    const currentRowElement = rows[currentRow];
    const currentTiles = currentRowElement.querySelectorAll('.tile');

    for (let i = 0; i < 5; i++) {
        currentTiles[i].classList.remove('filled', 'info');
        if (result[i] === 'correct') {
            currentTiles[i].classList.add('correct');
        } else if (result[i] === 'present') {
            currentTiles[i].classList.add('present');
        } else if (result[i] === 'absent') {
            currentTiles[i].classList.add('absent');
        }
    }
    return result;
}