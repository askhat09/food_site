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
        closeBtn = document.querySelector('[data-close]'),
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

        closeBtn.addEventListener('click', closeFunction);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFunction();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.classList.contains('show')) {
                closeFunction();
            }
        })

        const modalTimer = setTimeout(showModal, 4000);

        function showModalByScroll() {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                showModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }

        window.addEventListener('scroll', showModalByScroll);

});