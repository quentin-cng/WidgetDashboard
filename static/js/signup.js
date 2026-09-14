const form = document.querySelector("form");
const submitButton = document.querySelector(".auth-submit");
const errorMessage = document.querySelector("#signup-error");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMessage.textContent = "";
    submitButton.textContent = "CREATING ACCOUNT...";
    submitButton.disabled = true;

    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    const response = await fetch("/users/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    });

    const data = await response.json();
    if (response.ok) {
        window.location.href = "/login";
    } else {
        errorMessage.textContent =
            data.detail || "Unable to create account";

        submitButton.textContent = "SIGN UP";
        submitButton.disabled = false;
    }
});