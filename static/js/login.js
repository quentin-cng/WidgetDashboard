const form = document.querySelector("form");
const submitButton = document.querySelector(".auth-submit");
const errorMessage = document.querySelector("#login-error");


form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    errorMessage.textContent = ""; 
    
    submitButton.textContent = "Signing in...";
    submitButton.disabled = true;

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value; 

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email, password: password })
    })

    const data = await response.json();

    if (response.ok) {
        sessionStorage.setItem("access_token", data.access_token);
        window.location.href = "/dashboard-page";
    } else {
        errorMessage.textContent = data.detail || "Login failed. Please try again.";
        submitButton.textContent = "SIGN IN";
        submitButton.disabled = false;
    }
});