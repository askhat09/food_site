function forms() {
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
}

module.exports = forms;