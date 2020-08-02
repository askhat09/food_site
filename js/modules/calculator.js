function calculator() {
    // Calc

    const result = document.querySelector('.calculating__result span');
    let sex, heigth, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        sex = localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        ratio = localStorage.setItem('ratio', 1.375);
    }

    function initLocalSetting(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSetting('.calculating__choose_big div', 'calculating__choose-item_active');
    initLocalSetting('#gender div', 'calculating__choose-item_active');

    function calculate() {
        if (!sex || !heigth || !weight || !age) {
            result.textContent = "________";
            return;
        }

        if ( sex == 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1* heigth) -(4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * heigth) - (5.7 * age)) * ratio);
        }
    }

    calculate();

    function getStaticValue(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                console.log(ratio, sex);

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calculate();
            });
        });

    }

    getStaticValue('.calculating__choose_big div', 'calculating__choose-item_active');
    getStaticValue('#gender div', 'calculating__choose-item_active');

    function getDynamicValue(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "";
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    heigth = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calculate();
        });
    }

    getDynamicValue('#height');
    getDynamicValue('#weight');
    getDynamicValue('#age');
}

module.exports = calculator;