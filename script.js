// JavaScript for handling tab switching
var tablinks = document.getElementsByClassName("tab-links");
var tabscontent = document.getElementsByClassName("tabs-content");

function opentab(tabname) {
    for (let tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (let tabcontent of tabscontent) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// JavaScript for handling the menu
var sidemenu = document.getElementById("sidemenu");

function openmenu() {
    sidemenu.style.right = "0";
}

function closemenu() {
    sidemenu.style.right = "-200px";
}


/*********** ******/
(function () {
    "use strict";

    // Fetch all the forms we want to apply custom validation styles to
    const forms = document.querySelectorAll(".needs-validation");
    const result = document.getElementById("form-message");

    // Add event listeners to track user interaction with each form field
    forms.forEach(function (form) {
        const inputs = form.querySelectorAll("input, textarea");
        
        // For each input field, track when the user interacts with it
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                input.classList.add("user-interacted");
            });
        });

        form.addEventListener(
            "submit",
            function (event) {
                // Reset all error messages
                resetErrorMessages();

                // Validate the form
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Show error messages for invalid fields
                    showErrorMessages(form);

                    // Focus on the first invalid input
                    form.querySelectorAll(":invalid")[0].focus();
                } else {
                    event.preventDefault();
                    event.stopPropagation();

                    const formData = new FormData(form);
                    const object = Object.fromEntries(formData);
                    const json = JSON.stringify(object);
                    result.innerHTML = "Please wait...";
                    result.style.display = "block";

                    fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: json,
                    })
                        .then(async (response) => {
                            let json = await response.json();
                            if (response.status == 200) {
                                result.innerHTML = json.message;
                                result.classList.remove("text-gray-500");
                                result.classList.add("text-green-500");
                            } else {
                                result.innerHTML = json.message;
                                result.classList.remove("text-gray-500");
                                result.classList.add("text-red-500");
                            }
                        })
                        .catch((error) => {
                            result.innerHTML = "Something went wrong!";
                        })
                        .then(function () {
                            form.reset();
                            form.classList.remove("was-validated");
                            // Reset input borders
                            resetInputBorders(form);
                            setTimeout(() => {
                                result.style.display = "none";
                            }, 5000);
                        });
                }
                form.classList.add("was-validated");
            },
            false
        );
    });

    // Function to reset error messages
    function resetErrorMessages() {
        document.querySelectorAll('.error-message').forEach((error) => {
            error.style.display = 'none'; // Hide all error messages
        });
    }

    // Function to show error messages for invalid inputs
    function showErrorMessages(form) {
        if (!form.name.checkValidity()) {
            document.getElementById('nameError').style.display = 'block'; // Show name error
        }
        if (!form.email.checkValidity()) {
            document.getElementById('emailError').style.display = 'block'; // Show email error
        }
        if (!form.message.checkValidity()) {
            document.getElementById('messageError').style.display = 'block'; // Show message error
        }
    }

    // Function to reset the borders of all form inputs
    function resetInputBorders(form) {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach((input) => {
        input.style.borderColor = '#262626'; // Reset to default border color
      });
    }
})();
