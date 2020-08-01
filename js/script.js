window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    let tabContent = document.querySelectorAll('.tabcontent'),
        tabHeaderItems = document.querySelector('.tabheader__items'),
        tabHeaderItem = tabHeaderItems.querySelectorAll('.tabheader__item');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.style.display = 'none';
        });

        tabHeaderItem.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabContent[i].style.display = 'block';
        tabHeaderItem[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabHeaderItems.addEventListener('click', (event) => {
        let target = event.target;
        if ( target && target.classList.contains('tabheader__item')) {
            tabHeaderItem.forEach((item, i) => {
                if ( target == item ) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        } 
    });

    // Timer

    const deadline = '2020-08-09';

    function getTime (endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000*60*60*24)),
            hours = Math.floor(t / (1000*60*60) % 24),
            minutes = Math.floor(t / (1000*60) % 60),
            seconds = Math.floor(t / 1000 % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }; 
    }

    function pasteZero(num) {
        if( num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setLock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock() {
            const t = getTime(endtime);
            days.innerHTML = pasteZero(t.days);
            hours.innerHTML = pasteZero(t.hours);
            minutes.innerHTML = pasteZero(t.minutes);
            seconds.innerHTML = pasteZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setLock('.timer', deadline);

    // Modal

    let modalBtn = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

        function showModal() {
            modal.classList.add('show');
                modal.classList.remove('hide');
                document.body.style.overflow = 'hidden';
                clearInterval(modalTimer);
        }
    
        modalBtn.forEach(btn => {
            btn.addEventListener('click', showModal);
        });

        function closeFunction() {
            modal.classList.remove('show');
            modal.classList.add('hide');
            document.body.style.overflow = '';
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                closeFunction();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.classList.contains('show')) {
                closeFunction();
            }
        })

        const modalTimer = setTimeout(showModal, 140000);

        function showModalByScroll() {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                showModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }

        window.addEventListener('scroll', showModalByScroll);

        // Use class for card


        class MenuCard {
            constructor(src, alt, subtitle, descr, price, parentSelector, ...classes) {
                this.src = src;
                this.alt = alt;
                this.subtitle = subtitle;
                this.descr = descr;
                this.price = price;
                this.transfer = 27;
                this.parentSelector = document.querySelector(parentSelector);
                this.classes = classes;
                this.changeMoney();
            }

            changeMoney() {
                this.price = this.price * this.transfer;
            }

            render() {
                const div = document.createElement('div');
                if (this.classes.length === 0 ) {
                    this.div = 'menu__item';
                    div.classList.add(this.div);
                } else {
                    this.classes.forEach(className => div.classList.add(this.classes));
                }       
                div.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
                this.parentSelector.append(div);
            }          
        }

        const getResource = async (url) => {    
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status ${res.status}`);
            }
            return await res.json();
        };

        getResource('http://localhost:3000/menu')
            .then(data => {
                data.forEach(({img, altimg, title, descr, price}) => {
                    new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                });
            });


        // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.appendChild(statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showModalMessage(message.success);
                statusMessage.remove();
            }).catch(() => {
                showModalMessage(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showModalMessage(message) {
        const modalContent = document.querySelector('.modal__dialog');
        modalContent.classList.add('hide');
        showModal();

        let modalMessage = document.createElement('div');
        modalMessage.classList.add('modal__dialog');
        modalMessage.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(modalMessage);
        setTimeout(() => {
            modalMessage.remove();
            modalContent.classList.add('show');
            modalContent.classList.remove('hide');
            closeFunction();
        }, 4000)
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res))


    // Slider
    
    const slide = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesInner = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0;

    slider.style.position = "relative";

    const indicators = document.createElement('ol'),
          dots = [];

        indicators.classList.add('carousel-indicators');
        slider.append(indicators);

    for (let i = 0; i < slide.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-layout-n', i + 1);
        dot.classList.add('dot');
        indicators.append(dot);

        if ( i == 0) {
            dot.style.opacity = "1";
        }
        dots.push(dot);
    }

    if (slide.length < 10) {
        total.textContent = `0${slide.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slide.length;
        current.textContent = slideIndex;
    }  

    slidesInner.style.width = 100 * slide.length + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    slide.forEach(item => {
        item.style.width = width;
    });

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slide.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
    if (slideIndex == slide.length) {
        slideIndex = 1;
    } else {
        slideIndex++;
    }

    if (slide.length < 10) {
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    } 

        slidesInner.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => {dot.style.opacity = '.5';});
        dots[slideIndex - 1].style.opacity = '1';
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slide.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        if (slideIndex == 1) {
            slideIndex = slide.length;
        } else {
            slideIndex--;
        }

        if (slide.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        } 

        slidesInner.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => {dot.style.opacity = '.5';});
        dots[slideIndex - 1].style.opacity = '1';
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-layout-n');
            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesInner.style.transform = `translateX(-${offset}px)`;

            if (slide.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            } 

            dots.forEach(dot => {dot.style.opacity = '.5';});
            dots[slideIndex - 1].style.opacity = '1';
        });
    });

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

});
