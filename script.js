// the crossword's words
let words = [
    ['kuat', 0, 9, 'd', 'Santri yang rajin sholat shubuh di masjid disebut santri yang...', 1],
    ['artsical', 2, 3, 'a', 'Nama acara ini adalah...', 0],
    ['tenaga', 2, 5, 'd', 'Ketika kita makan di mahad, selain menggunakan sendok juga harus pakai...', 0],
    ['kemauan', 5, 0, 'a', 'Seorang santri yang keluar tanpa izin pasti ada...', 0],
    ['benar', 7, 2, 'a', 'Kegiatan santri setiap minggu ada,...', 1],
]

let max_height = 0;
let max_width = 0;

// find max height and max width
for (let i = 0; i < words.length; i++) {
    if (words[i][3] === 'a') max_width = Math.max(max_width, words[i][2] + words[i][0].length); 
    else max_height = Math.max(max_height, words[i][1] + words[i][0].length);
}

// create the parent board
let crosswordBoard = document.getElementById('crossword-board');
crosswordBoard.style.width = `${max_width * 4.25}vi`;
crosswordBoard.style.height = `${max_height * 5}vi`;

// generate arrays
let board = new Array(max_height).fill(null).map(() => new Array(max_width).fill('-'));
let isShown = new Array(max_height).fill(null).map(() => new Array(max_width).fill(0));
let isRevealed = new Array(words.length).fill(0);

// map the words to the board
for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words[i][0].length; j++) {
        let x = words[i][3] === 'a' ? words[i][1] : words[i][1] + j;
        let y = words[i][3] === 'a' ? words[i][2] + j : words[i][2];
        board[x][y] = words[i][0][j];
    }
}

// append child element to the main board
for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        
        let id = ['item', i + 1, '-', j + 1].join('');
        let char = board[i][j];
        
        if (char === '-') {
            let span = document.createElement('span');
            span.id = id;
            span.className = 'crossword-board__item--blank';
            var crossword_rows = document.getElementById('crossword-board');
            crossword_rows.appendChild(span);
        } 
        else {
            let box = document.createElement('div');
            box.id = id;
            box.className = 'crossword-board__item';
            box.setAttribute('role', 'presentation');

            var crossword_rows = document.getElementById('crossword-board');
            crossword_rows.appendChild(box);

            for (let k = 0; k < words.length; k++) {
                let curx = words[k][1];
                let cury = words[k][2];

                if (i === curx && j === cury) {
                    let num = document.createElement('div');
                    num.className = 'crossword-board-num';
                    num.textContent = k+1;
                    box.appendChild(num);
                }
            }
        }
    }
}

let onQuestion = false;
let onMainMenu = true;
let onEntrance = false;
let onGuestEntrance = false;
let onMainTheme = false;

function transition() {
    const curtain = document.getElementById('curtain-video');
    curtain.currentTime = 0;
    curtain.play();
}

function correct_sfx() {
    const sfx = document.getElementById("correct-answer-audio");
    sfx.currentTime = 0;
    sfx.play();
}

function wrong_sfx() {
    const sfx = document.getElementById("wrong-answer-audio");
    sfx.currentTime = 0;
    sfx.play();
}

// event on keydown
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    let num = parseInt(event.key, 10) - 1;

    if (event.code === 'Space') {
        if (onMainMenu) {
            let delay = 1000;
            transition();
            setTimeout(() => {
                let startPage = document.getElementById('pre-game');
                startPage.classList.add('set-hidden');
            }, delay);
        }
        else {
            let delay = 1000;
            transition();
            setTimeout(() => {
                let startPage = document.getElementById('pre-game');
                startPage.classList.remove('set-hidden');
            }, delay);
        }
        onMainMenu = !onMainMenu;
    }

    // reveal answer
    if (event.ctrlKey && !event.altKey && Number.isInteger(num) && num < words.length && isRevealed[num] === 0) {
        correct_sfx();

        for (let j = 0; j < words[num][0].length; j++) {
            let delay = j * 100 ;
            
            setTimeout(() => {
                let id = words[num][3] === 'a' 
                        ? ['item', words[num][1] + 1, '-', words[num][2] + j + 1].join('')
                        : ['item', words[num][1] + j + 1, '-', words[num][2] + 1].join('');

                let box = document.getElementById(id);
                let text = document.createTextNode(words[num][0][j]);
                let element = document.createElement('div');

                element.appendChild(text);

                let x = words[num][3] === 'a' 
                        ? words[num][1]
                        : words[num][1] + j;
                        let y = words[num][3] === 'a'
                        ? words[num][2] + j
                        : words[num][2];
                
                if (isShown[x][y] === 0) {
                    element.classList.add('animate-entrance'); 
                    box.appendChild(element);
                    isShown[x][y] = 1;
                } else {
                    let removeIndex = box.children.length === 2 ? 1 : 0;
                    box.removeChild(box.children[removeIndex]);
                    element.classList.add('animate-entrance'); 
                    box.appendChild(element);
                }
            }, delay);
        }

        if (words[num][5] === 1) {
            setTimeout(() => {
                const gif = document.getElementById('cat-gif');
                gif.classList.remove('set-hidden');
                gif.currentTime = 0;
                gif.play();
                onMainTheme = false;
                let song = document.getElementById('game-song');
                song.pause();
                song.currentTime = 0;
            }, words[num][0].length * 200)

            setTimeout(() => {
                const gif = document.getElementById('cat-gif');
                gif.classList.add('set-hidden');
                let song = document.getElementById('game-song');
                song.play();
                song.volume = 0.2;
                song.loop = true;
                onMainTheme = true;
            }, words[num][0].length * 200 + 4000)
        }

        isRevealed[num] = 1;
    }

    // wrong answer
    if (event.altKey && event.key === 'w') {
        wrong_sfx();
        setTimeout(() => {
            const crossword = document.getElementById('crossword-board');
            crossword.classList.add('shake-animation');
            const overlay = document.getElementById('red-overlay');
            overlay.classList.remove('set-hidden');
        }, 250)
        setTimeout(() => {
            const crossword = document.getElementById('crossword-board');
            crossword.classList.remove('shake-animation');
            const overlay = document.getElementById('red-overlay');
            overlay.classList.add('set-hidden');
        }, 1250);
    }

    if (event.ctrlKey && event.key === 'i') {
        if (onEntrance) {
            onEntrance = false;
            let song = document.getElementById('intro-song');
            song.pause();
            song.currentTime = 0;
        }
        else {
            let song = document.getElementById('intro-song');
            song.play();
            onEntrance = true;
        }
    }

    if (event.ctrlKey && event.key === 'o') {
        if (onGuestEntrance) {
            onGuestEntrance = false;
            let song = document.getElementById('entrance-song');
            song.pause();
            song.currentTime = 0;
        }
        else {
            let song = document.getElementById('entrance-song');
            song.play();
            onGuestEntrance = true;
        }
    }

    if (event.ctrlKey && event.key === 'p') {
        if (onMainTheme) {
            onMainTheme = false;
            let song = document.getElementById('game-song');
            song.pause();
            song.currentTime = 0;
        }
        else {
            let song = document.getElementById('game-song');
            song.play();
            song.volume = 0.2;
            song.loop = true;
            onMainTheme = true;
        }
    }

    // end the game
    if (event.ctrlKey && event.key === 'e') {
        let end = document.getElementById('end-song');
        end.play();

        setTimeout(() => {
            transition();
            setTimeout(() => {
                let endscreen = document.getElementById("post-game-video");
                let startPage = document.getElementById('pre-game-video');
                startPage.classList.add('set-hidden');
                endscreen.classList.remove('set-hidden');
                endscreen.play();
                endscreen.loop = true;
            }, 1000);
        }, 12000)
    }

    // show question
    if (event.altKey && Number.isInteger(num) && num < words.length) {        
        transition();

        if (onQuestion) {
            onQuestion = false;
            setTimeout(() => {
                let questiondiv = document.getElementById('question-background');
                questiondiv.classList.add('set-hidden');
            } , 1000);
        }
        else {
            onQuestion = true;
            let question = document.getElementById('question');
            question.textContent = words[num][4];
            question.textContent = question.textContent.replace(/\n/g, " ");

            setTimeout(() => {
                let questiondiv = document.getElementById('question-background');
                questiondiv.classList.remove('set-hidden');
                let video = document.getElementById('question-background-video');
                video.play();
                video.loop = true;
            } , 1000);
        }
    }
});
