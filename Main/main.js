document.addEventListener("DOMContentLoaded", function() {

    const win_amount = new Map([
        ["Test_Playscreen_sym_01.png", 500],
        ["Test_Playscreen_sym_02.png", 400],
        ["Test_Playscreen_sym_03.png", 300],
        ["Test_Playscreen_sym_04.png", 200],
        ["Test_Playscreen_sym_05.png", 100],
    ]);
    const reels = document.querySelectorAll(".reel");
    const btn = document.querySelector('#btn-spin');

    let credits = document.querySelector("#credits");
    let bet = document.querySelector("#bet");
    let win = document.querySelector("#win");

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function init() {
        reels.forEach(reel => {
            for(let i = 0; i < 4; i++) {
                reel.innerHTML += `<img src="../Assets/Test_Playscreen_sym_0${Math.floor(Math.random() * 5) + 1}.png" class="img-test">`
                //reel.innerHTML += `<img src="../Assets/Test_Playscreen_sym_04.png" class="img-test">`
            }
            let imgs = reel.querySelectorAll(".img-test");
            imgs.forEach((img, index) => {
                img.style.top = `${250 * index}px`;
                // img.classList.add('transition-effect');
            });
        });
    };

    function checkWin() {

        console.log('Checking win');
        let middleImages = [];
        reels.forEach(reel => {
            let imgs = reel.querySelectorAll(".img-test");
            imgs.forEach((img) => {
                if (img.style.top === '500px') {
                    middleImages.push(img.src);
                }
            });
        });

        let element = middleImages[0];
        for(let i = 0; i < middleImages.length; i++) {
            if (element !== middleImages[i]) {
                win.innerHTML = 0;
                credits.innerHTML = parseInt(credits.innerHTML) - parseInt(bet.innerHTML);
                middleElements = [];
                console.log('lose')
                return;
            }
        }

        console.log('win');
        let img = element.toString().slice(32, 60);
        win.innerHTML = (win_amount.get(img)) * parseInt(bet.innerHTML);
        credits.innerHTML = parseInt(credits.innerHTML) + (win_amount.get(img)) * parseInt(bet.innerHTML);
        
        
        
        middleImages = [];
        
    }

    const preAnimate = (image) => {

        return new Promise((resolve, reject) => {

            image.classList.add('transition-effect');
            let currentTop = parseInt(image.style.top);
            image.style.top = `${currentTop + 250}px`;

            setTimeout(resolve, 400);

        });

        
    };

    async function scrollAll() {
        btn.style.filter = 'brightness(50%)';
        await reels.forEach((reel, index) => {
            let imgs = reel.querySelectorAll(".img-test");
            imgs.forEach(async (img) => {
                img.classList.remove('transition-effect'); // Remove the pre-animation class
                await scroll(img, index);
                finishScrolling(img, index);
                btn.style.filter = '';
            });
        });

        setTimeout(() => {
            checkWin();
            btn.style.filter = '';
        }, 3500);
    }

    function scroll(element, offset, random) {

        let duration = 3000;
        const startTime = performance.now();
        let delta = (offset + 2) * 7;
        let currentTop = parseInt(element.style.top);
        let lastLogTime = 0;

        //element.classList.add('transition-start');
        //setTimeout(() => {element.classList.remove('transition-effect')}, 1000);

        return new Promise((resolve, reject) => {

        function animate() {
            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;

            if(currentTop >= 1000) {
                const randomImageNumber = Math.floor(Math.random() * 5) + 1;
                //const randomImageNumber = 4;
                element.src = `../Assets/Test_Playscreen_sym_0${randomImageNumber}.png`;
                currentTop = 0;
            }
            else {
                currentTop += delta;
            }

            element.style.top = `${currentTop}px`;

            if (elapsedTime < duration) {
                requestAnimationFrame(animate);
            }
            else {
                resolve();
            }

        }
        animate();
    
        });
    }

    function finishScrolling(element, index) {

        let currentTop = parseInt(element.style.top);

        if(currentTop % 250 === 0) {
            return;
        }
        // else if (currentTop <= 125) {
        //     currentTop = 750;
        // }
        else {
            let nearestTop = Math.floor(currentTop / 250) * 250;
            if (nearestTop === 1000) {
                nearestTop = 0;
            }
            currentTop = nearestTop
        }

        element.style.top = `${currentTop}px`

    }

    init();

    document.querySelector("#btn-spin").addEventListener("click", scrollAll);
    document.querySelector("#plus").addEventListener("click", () => {
        bet.innerHTML = parseInt(bet.innerHTML) + 1;
    })
    document.querySelector("#minus").addEventListener("click", () => {
        if (parseInt(bet.innerHTML) > 0){
            bet.innerHTML = parseInt(bet.innerHTML) - 1;
        }
    })

});