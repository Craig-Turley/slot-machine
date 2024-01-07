document.addEventListener("DOMContentLoaded", function(){

    const win_amount_map = new Map([
        ["Test_Playscreen_sym_01.png", 500],
        ["Test_Playscreen_sym_02.png", 400],
        ["Test_Playscreen_sym_03.png", 300],
        ["Test_Playscreen_sym_04.png", 200],
        ["Test_Playscreen_sym_05.png", 100],
    ]);
    
    const reels = document.querySelectorAll(".reel");
    const credits = document.querySelector("#credits");
    const spin_btn = document.querySelector("#btn-spin");
    const bet = document.querySelector("#bet");
    const win_amount = document.querySelector("#win"); 
    document.querySelector("#plus").addEventListener("click", () => {
        bet.innerHTML = parseInt(bet.innerHTML) + 1;
    })
    document.querySelector("#minus").addEventListener("click", () => {
        if (parseInt(bet.innerHTML) > 0){
            bet.innerHTML = parseInt(bet.innerHTML) - 1;
        }
    })

    const darkenButton = () => {
        spin_btn.removeEventListener('click', rollAll);
        spin_btn.style.opacity = '0.5';
    };
    
    
    const resetButton = () => {
        spin_btn.addEventListener('click', rollAll);
        spin_btn.style.opacity = ''; 
    };
    
    const icon_height = 250;
    const num_icons = 10;
    const time_per_icon = 100;

    const firstRoll = (reel, delta, offset) => {

        return new Promise((resolve, reject) => {
            const iconHeight = delta * icon_height

            setTimeout(() => {
                reel.style.transition = `transform ${4 + delta * time_per_icon}ms cubic-bezier(.41, -0.01, .63, 1.09)`;
                reel.style.transform = `translateY(${iconHeight - 750}px)`;
            }, offset * 150);

            setTimeout(() => {
                reel.style.transition = '';
                first_spin = false;
                resolve()
            }, 5500);
        })
    }

    const roll = (reel, offset) => {

        const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
    
        reel.style.transform = '';
        reel.style.transition = '';
    
        return new Promise((resolve,reject) => {
            renderIcons(reel, delta)
            .then(() => {
                const iconHeight = delta * icon_height;
            
                setTimeout(() => {
                    reel.style.transition = `transform ${4 + delta * time_per_icon}ms cubic-bezier(.41, -0.01,.63,1.09)`;
                    reel.style.transform = `translateY(${iconHeight - 750}px)`;
                }, offset * 150)
            }); 
    
            setTimeout(() => {
                resolve()
            }, 5500)
        });

    }

    function renderIcons(reel, delta) {
        let reelContents = [...reel.querySelectorAll('.img-test')];
        
        return new Promise((resolve, reject) => {
            
            let currentSymbols = reelContents.slice(0, 3);
        
            for (let i = reelContents.length - 3, j = 0; i < reelContents.length; i++, j++) {
                reelContents[i] = currentSymbols[j].cloneNode(true);
            }
        
            reel.innerHTML = ''; 
        
            for (let j = 0; j < delta - 3; j++){
                reel.innerHTML += `<img src="./Assets/Test_Playscreen_sym_0${Math.floor(Math.random() * 5) + 1}.png" class="img-test">`
            }
            currentSymbols.forEach(img => {
                reel.appendChild(img);
            });    

            reel.style.height = `${(delta) * 250}px`;
            reel.style.top = `-${delta*250 - 750}px`;

            resolve();
        });
    }
    
    let first_spin = true;
    let init_delta = [];
    function rollAll() {
        darkenButton()
        if (first_spin === true) {
            Promise.all([...reels].map((reel, i) => firstRoll(reel, init_delta[i], i)))
                .then(() => {
                    console.log('Finished first role');
                    checkWin(reels);
                    resetButton();
                });
            return;
        }
        Promise
        .all([...reels].map( (reel, i) => roll(reel,i)))
        .then(() => {
            console.log("Finished Role");
            checkWin(reels);
            resetButton();
        });
    }

    const checkWin = (reels) => {
        let middle = [];
        reels.forEach((reel) => {
            middle.push(reel.querySelectorAll(".img-test")[1]);
        });
    
        let win = middle[0].src === middle[1].src && middle[1].src === middle[2].src;

        if (win) {
            let amountWon = bet.innerHTML * win_amount_map.get(getImageName(middle[0].src)) || 0;
        
            credits.innerHTML = parseInt(credits.innerHTML) + amountWon;
            win_amount.innerHTML = amountWon;
        
            
            let blinkInterval = setInterval(() => {
                win_amount.style.visibility = win_amount.style.visibility === 'hidden' ? 'visible' : 'hidden';
            }, 500); 
        
            setTimeout(() => {
                clearInterval(blinkInterval); 
                win_amount.style.visibility = 'visible'; 
            }, 3000);
            return;
        }

        credits.innerHTML = parseInt(credits.innerHTML) - parseInt(bet.innerHTML);
    
    }

    const getImageName = (src) => {
        return src.substring(src.lastIndexOf('/') + 1);
    }

    function init() {
        reels.forEach((reel, i) => {
            const delta = (i + 2) * num_icons + Math.round(Math.random() * num_icons);
    
            for(let j = 0; j < delta; j++) {
                reel.innerHTML += `<img src="./Assets/Test_Playscreen_sym_0${Math.floor(Math.random() * 5) + 1}.png" class="img-test">`
            }
    
            reel.style.height = `${(delta) * 250}px`;
            reel.style.top = `${-delta * 250 + 750}px`;

            init_delta.push(delta);
        });
    }
    
    init()
    spin_btn.addEventListener('click', rollAll)
    
});