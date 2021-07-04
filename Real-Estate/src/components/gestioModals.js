export const closeModal = (modal) => {
    const backdrop = document.querySelector('.modal-backdrop.fade.show');
    modal.setAttribute('aria-hidden', 'true');
    //backdrop.classList.remove('show');
    setTimeout(() => {
        modal.classList.remove('show');
    });
    setTimeout(() => {
        modal.style.display = 'none';
        backdrop.remove();
        document.body.className = document.body.className.replace("modal-open", "");
    }, 500);
}

export const openModal = (modal) => {
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade');
    document.body.classList.add('modal-open');
    document.body.appendChild(backdrop);
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false', 'show');
    setTimeout(() => {
        modal.classList.add('show');
        backdrop.classList.add('show');
    });
    document.querySelectorAll('[data-dismiss=modal]').forEach((element) => {
        element.addEventListener('click', () => {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    // document.querySelectorAll('.modal').forEach((modal) => {
    //     modal.addEventListener('click', (event) => {
    //         if (event.target === modal) {
    //             closeModal(modal);
    //         }
    //     });
    // });
}