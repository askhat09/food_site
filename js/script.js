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

        const modalTimer = setTimeout(showModal, 40000);

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
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total');

    let slideIndex = 1;  

    showSlides(slideIndex);

        if (slide.length < 10) {
            total.textContent = `0${slide.length}`;
        } else {
            total.textContent = slide.length;
        }  

    function showSlides(n) {

        if (n > slide.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slide.length;
        }

        slide.forEach(item => {
            item.style.display = 'none';
        });

        slide[slideIndex - 1].style.display = 'block';

        if (n < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }  
        
    }

    prev.addEventListener('click', () => {
        slideIndex += -1;
        showSlides(slideIndex);
    });

    next.addEventListener('click', () => {
        slideIndex += 1;
        showSlides(slideIndex);
    });

});
