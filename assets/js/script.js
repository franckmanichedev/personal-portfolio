/*========== menu icon navbar ==========*/
// let menuIcon = document.querySelector('#menu-icon');
// let navbar = document.querySelector('.navbar');

// menuIcon.onclick = () => {
//     menuIcon.classList.toggle('bx-x');
//     navbar.classList.toggle('active');
// };


/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
// const typeProjet = document.querySelector('.type-projet');
const paragraphesProjet = document.querySelectorAll('.type-projet p');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
            });
            if(id){
                let activeLink = document.querySelector('header nav a[href*=' + id + ']');
                if(activeLink){
                    activeLink.classList.add('active');
                };
            };
        };
    });


    /*========== sticky navbar ==========*/
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);


    /*========== remove menu icon navbar when click navbar link (scroll) ==========*/
    // menuIcon.classList.remove('bx-x');
    // navbar.classList.remove('active');

    // };


    /*========== swiper ==========*/
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 50,
        loop: true,
        grabCursor: true,
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
        },
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
    });


    /*========== scroll reveal ==========*/
    ScrollReveal({
        // reset: true,
        distance: '80px',
        duration: 2000,
        delay: 200
    });

    ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
    ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
    ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' })
};

/*========== portfolio change ==========*/

function determinerPortfolio(classe){
    const elements = document.querySelectorAll('.portfolio-card');
    paragraphesProjet.forEach((p) => p.classList.remove('active-projet'));
    const item = event.target;
    
    item.classList.add('active-projet');
    elements.forEach((element)=>{
        if(classe === 'all'){
            element.style.display = 'block';
        }else if(element.classList.contains(classe)){
            element.style.display = 'block';
        }else{
            element.style.display = 'none';
        }
    });
}


/*========== dark light mode ==========*/
let darkModeIconDesktop = document.querySelector('#darkMode-icon');
let darkModeIconMobile = document.querySelector('#darkMode-icon-mobile');

// theme toggle variables
const themeBtn = document.querySelectorAll('.theme-btn');

// Fonction pour basculer entre les thèmes
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    themeBtn.forEach((btn) => {
        btn.classList.toggle('light');
        btn.classList.toggle('dark');
    });
    // Enregistrer le thème dans le stockage local
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Verifier si le mode sombre est active au chargement de la page
if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('dark-theme');
    themeBtn.forEach((btn) => {
        btn.classList.add('dark');
        btn.classList.remove('light');
    });
}

// Ajouter un écouteur d'événement pour le bouton de changement de thème
if(darkModeIconDesktop){
    darkModeIconDesktop.addEventListener('click', toggleTheme);
}
if(darkModeIconMobile){
    darkModeIconMobile.addEventListener('click', toggleTheme);
}

/*========== email-contact-verification ==========*/

const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('subject');
const commentInput = document.getElementById('comment');
const message = document.querySelector('.message');

// Fonction pour vérifier si l'email est valide
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour afficher un message d'erreur
function showError(errorMessage) {
    message.textContent = errorMessage;
    message.style.color = 'red';
    message.style.display = 'block';
    setInterval(() => {
        message.style.display = 'none';
    }, 5000);
}

// Fonction pour afficher un message de succès
function showSuccess(successMessage) {
    message.textContent = successMessage;
    message.style.color = 'green';
    message.style.display = 'block';
    setInterval(() => {
        message.style.display = 'none';
    }, 5000);
}

function checkEmailExists(email) {
    const apiKey = "01420130d22c46088e948d87b5633df3";
    fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`)
    .then(response => response.json())
    .then(data => {
        if (data.deliverability === "DELIVERABLE"){
            // showSuccess("L\'email est valide et existe.");
            console.log("L\'email est valide et existe.");
        } else {
            showError("L\'email n\'est pas valide ou n\'existe pas.");
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showError("Une erreur est survenue lors de la vérification de l\'email.");
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Vérifiez si emailInput est correctement sélectionné
    if (!emailInput) {
        console.error("L'élément avec l'ID 'email' est introuvable dans le DOM.");
        showError("Une erreur interne est survenue.");
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = submitButton.value.trim();
    const comment = commentInput.value.trim();

    if (name === '' || email === '' || subject === '' || comment === '') {
        showError("Veuillez remplir tous les champs.");
        return;
    }

    if (!isValidEmail(email)) {
        showError("Veuillez entrer une adresse email valide.");
        return;
    }

    checkEmailExists(email);

    // Envoyer l'email
    fetch('https://personal-portfolio-backend-kowj.onrender.com/send-mail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, comment })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            showSuccess(data.message);
            form.reset();
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showError("Une erreur est survenue lors de l'envoi de l'email.");
    });
});