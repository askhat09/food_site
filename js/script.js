window.addEventListener('DOMContentLoaded', () => {

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

});