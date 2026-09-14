const token = sessionStorage.getItem("access_token");

if (!token) {
    window.location.href = "/login";
}

async function authenticatedFetch(url, options = {}) {
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
    };
    const response = await fetch(url, options);
    if (response.status === 401) {
        sessionStorage.removeItem("access_token");
        window.location.href = "/login";
        return null;
    }
    return response;
}



async function loadUser(){

    const response = await authenticatedFetch("/auth/me");
    if (!response) {
        return;
    }

    const data = await response.json();
    document.querySelector("#welcome").textContent = `Welcome, ${data.username}!`;
}

async function loadWeather(){
    const response = await authenticatedFetch("/dashboard/weather");
    if (!response) {
        return;
    }
    const data = await response.json();
    document.querySelector("#weather").innerHTML = `
        <div class="weather-card-container">
            <div class="weather-card">
                <button class="weather-settings" id="weather-settings">⚙️</button>

                <p class="weather-city">${data.city}</p>
                <p class="weather-condition">${data.condition}</p>
                <p class="weather-temp">${data.temperature}°</p>
                
            </div>
        </div>`
    ;
    document.querySelector("#weather-settings").addEventListener("click", () => {
        showWeatherSettings(data.city);
    });
}

function showWeatherSettings(currentCity){
    document.querySelector("#weather").innerHTML = `
        <div class="weather-card-container">
            <div class="weather-card weather-edit-card">
                <p class="weather-edit-title">Weather City</p>
                <input
                    id="weather-city-input"
                    class="weather-city-input"
                    type="text"
                    value="${currentCity}"
                    placeholder="Enter city">
                
                <p id="weather-error" class="settings-error"></p>
                
                <button
                    id="weather-save"
                    class="weather-save">

                SAVE
                </button>
            </div>
        </div>
    `;

    document.querySelector("#weather-save").addEventListener("click", saveWeatherSettings);
    
}


async function saveWeatherSettings(){
    const city = document.querySelector("#weather-city-input").value.trim();
    if (!city){return;}
    const saveButton = document.querySelector("#weather-save");
    saveButton.textContent = "Saving...";
    saveButton.disabled = true;
    const response = await authenticatedFetch("/dashboard/preferences/weather", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            config: {
                city: city
            }
        })
    });
    if (response.ok) {
        await loadWeather();
    } else {
        const data = await response.json();
        document.querySelector("#weather-error").textContent = data.detail || "Failed to update weather settings.";

        saveButton.textContent = "SAVE";
        saveButton.disabled = false;
    }
}

async function loadGithub(){
    const response = await authenticatedFetch("/dashboard/github");
    if (!response) {
        return;
    }
    if (response.status == 400){
        showGithubSettings("");
        return;
    }
    const data = await response.json();

    document.querySelector("#github").innerHTML = `

        <div class="github-card">

            <button class="github-settings" id="github-settings">⚙️</button>

            <div class="github-avatar-container">
                <img class="github-avatar" src="${data.avatar_url}" alt="${data.username} GitHub avatar">
            </div>

            <p class="github-username">${data.username}</p>

            <p class="github-role">DEVELOPER</p>
            <div class="github-divider"></div>
            <div class="github-stats">
                <div class="github-stat">
                    <p class="github-stat-label">REPOSITORIES</p>
                    <p class="github-stat-value">${data.public_repos}</p>

                </div>
                <div class="github-stat github-stat-followers">
                    <p class="github-stat-label">FOLLOWERS</p>
                    <p class="github-stat-value">${data.followers}</p>
                </div>
            </div>

            <a class="github-button" href="${data.profile_url}" target="_blank">
                VIEW ON GITHUB →
            </a>
        </div>
    `;
    document.querySelector("#github-settings").addEventListener("click", () => {
        showGithubSettings(data.username);
    });
}

function showGithubSettings(currentUsername){
    document.querySelector("#github").innerHTML = `
        <div class="github-card-container">
            <div class="github-card github-edit-card">
                <p class="github-edit-title">GitHub Username</p>
                <input
                    id="github-username-input"
                    class="github-username-input"
                    type="text"
                    value="${currentUsername}"
                    placeholder="Enter username">


                <p id="github-error" class="settings-error"></p>


                <button
                    id="github-save"
                    class="github-save">

                SAVE
                </button>
            </div>
        </div>
    `;

    document.querySelector("#github-save").addEventListener("click", saveGithubSettings);
    
}


async function saveGithubSettings(){
    const username = document.querySelector("#github-username-input").value.trim();
    if (!username){return;}
    const saveButton = document.querySelector("#github-save");
    saveButton.textContent = "Saving...";
    saveButton.disabled = true;
    const response = await authenticatedFetch("/dashboard/preferences/github", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            config: {
                username: username
            }
        })
    });
    if (response.ok) {
        await loadGithub();
    } else {
        const data = await response.json();
        document.querySelector("#github-error").textContent = data.detail || "Failed to update GitHub settings.";

        saveButton.textContent = "SAVE";
        saveButton.disabled = false;
    }
}


document.querySelector("#logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("access_token");
    window.location.href = "/login";
});

loadUser();
loadWeather();
loadGithub();