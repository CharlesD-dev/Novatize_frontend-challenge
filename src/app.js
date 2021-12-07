const form = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const doggoName = document.getElementById("doggo-name");
const doggoBreed = document.getElementById("doggo-breed");
const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirm-email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const cookieBanner = document.getElementById("cookie-banner");
const successModal = document.getElementById("modal-success");
const failModal = document.getElementById("modal-fail");

initFormListeners(form);
initFormSubmit(form);
initModals(successModal);
initModalsFail(failModal);
initCookieBanner();
populateDoggoBreedSelect();

// TO DO : Idéalement scinder la fonction Submit ici
function initFormListeners(formToInit) {
  formToInit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateAllInputs()) {
      displaySuccessModal();
    }
  });
}

function initModals(successModalToInit) {
  let closeButtons = document.getElementsByClassName("modal__close");

  for (let el of closeButtons) {
    el.onclick = function () {
      successModalToInit.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == successModal) {
      successModalToInit.style.display = "none";
    }
  };
}

// TO DO : Utiliser une seule et même fonction "initModals" pour les deux modals
function initModalsFail(failModalToInit) {
  let closeButtons = document.getElementsByClassName("modal__close");

  for (let el of closeButtons) {
    el.onclick = function () {
      failModalToInit.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == failModal) {
      failModalToInit.style.display = "none";
    }
  };
}

/* COOKIES */
/* TO DO : Forcer que le check se fasse bien avant que la page load pour éviter que l'on voit brièvement
la bannière apparâitre lors du refresh quand les cookies ont déjà été acceptés */
function initCookieBanner() {
  if (window.localStorage.getItem("cookies-accepted") == "1") {
    cookieBanner.style.display = "none";
  } else {
    let acceptCookiesButton = cookieBanner.querySelector(".button__primary");
    acceptCookiesButton.onclick = function () {
      cookieBanner.style.display = "none";
      window.localStorage.setItem("cookies-accepted", "1");
    };

    //Reject cookies
    let rejectCookiesButton = cookieBanner.querySelector(".button__secondary");
    rejectCookiesButton.onclick = function () {
      let submitButton = form.querySelector("button");

      submitButton.disabled = true;
      cookieBanner.style.display = "none";
      window.localStorage.setItem("cookies-accepted", "0");
    };
  }
}

// Obtenir une liste de race de chien
function populateDoggoBreedSelect() {
  fetch("https://api.devnovatize.com/frontend-challenge")
    .then(function (response) {
      if (!response.ok) {
        console.log(
          "Error calling external API. Status Code: " + response.status
        );
        return;
      }

      response.json().then(function (data) {
        var selectElem = document.getElementById("doggo-breed");
        fillSelectElem(selectElem, data.sort());
      });
    })
    .catch(function (err) {
      console.log("Fetch Error : ", err);
    });
}

function fillSelectElem(selectElem, dataToFill) {
  dataToFill.forEach((element) => {
    var optionElem = document.createElement("option");
    optionElem.innerHTML = element;

    if (element.toLowerCase() === "labernese") {
      optionElem.setAttribute("selected", "selected");
    }
    selectElem.appendChild(optionElem);
  });
}

// Créer le profil

function initFormSubmit(form) {
  form.addEventListener("submit", function (e) {
    if (validateAllInputs()) {
      e.preventDefault();

      const formData = new FormData(this);
      const plainFormData = Object.fromEntries(formData.entries());

      fetch("https://api.devnovatize.com/frontend-challenge", {
        method: "POST",
        body: JSON.stringify(plainFormData),
      })
        .then(function (response) {
          console.log(response);
          if (!response.ok) {
            console.log(
              "Error calling external API. Status Code: " + response.status
            );
            return;
          }
        })
        .catch(function (err) {
          console.log("Fetch Error : ", err);
          const message = getElementsByClassName("err-msg").innertHTML;
          message = err;
        });
    }
    return;
  });
}

// Validation Form
function validateAllInputs() {
  let allInputValids =
    validateInput(firstName) &&
    validateInput(lastName) &&
    validateInput(doggoName) &&
    validateInput(doggoBreed) &&
    validateInput(email, validateEmail) &&
    validateInput(confirmEmail, function (value) {
      return value === email.value.trim();
    }) &&
    validateInput(password, validatePassword) &&
    validateInput(confirmPassword, function (value) {
      return value === password.value.trim();
    });
  return allInputValids;
}

function validateInput(element, validationFunction) {
  let inputValid = isInputValid(element, validationFunction);
  inputValid ? setSuccessInput(element) : setErrorInput(element);
  return inputValid;
}

function isInputValid(element, validationFunction) {
  let value = element.value.trim();
  return !(value === "" || (validationFunction && !validationFunction(value)));
}

function validateEmail(email) {
  let re =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; //reg exp from https://www.w3.org/TR/2012/WD-html-markup-20120329/input.email.html
  return re.test(String(email));
}

function validatePassword(password) {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // 8 chars, lower, upper and digits
  return re.test(String(password));
}

function setErrorInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.remove("success");
  formControl.classList.add("error");
}

function setSuccessInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.remove("error");
  formControl.classList.add("success");
}

function displaySuccessModal() {
  var modal = document.getElementById("modal-success");
  modal.style.display = "block";
}
function displayFailModal() {
  var modal = document.getElementById("modal-fail");
  modal.style.display = "block";
}

// Toggle Navigation
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

hamburger.addEventListener("click", toggleNav);

function toggleNav() {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
}

/* CLose nav when a link is clicked */
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  menu.classList.remove("active");
}
