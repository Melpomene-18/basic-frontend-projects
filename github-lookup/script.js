const userInformation = document.querySelector(".user-information");
const linksSegment = document.querySelector(".links-segment");

const lookupForm = document.getElementById("lookup-form");
const username = document.getElementById("username-input");
const lookupBtn = document.getElementById("lookup-btn");
const errorText = document.getElementById("error");

const nameEl = document.getElementById("name");
const avatarURL = document.getElementById("avatar-url");
const locationEl = document.getElementById("location");
const companyEl = document.getElementById("company");
const profileLink = document.getElementById("user-profile-link");
const bioEl = document.getElementById("bio");
const reposEl = document.getElementById("repos");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");

/*
Function Name: fetchUser
Description: Fetches the user associated with the provided username using GitHub's API.
Params: 
    username (string): The provided username that the user wishes to look up.
returns: 
    Usable data from our response. My be resolved, or fail, in which case it is caught.
*/
async function fetchUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        throw err;
    }
    return response.json();
}

/* 
Function Name: showError
Description: Displays a visual error for the user.
Params: 
    message (string): A string that determines what the error message entails.
Returns:
    Nothing.
*/
function showError(message) {
    errorText.textContent = message;
    errorText.classList.remove('hidden');
    userInformation.classList.add("hidden");
    linksSegment.classList.add("hidden");
}

/*
Function Name: clearError
Description: Clears any currently displayed errors.
Params:
    None
Returns:
    Nothing.
*/
function clearError() {
    errorText.classList.add('hidden');
    userInformation.classList.remove("hidden");
    linksSegment.classList.remove("hidden");
}

/*
Function Name: displayUser
Description: Displays the user information.
Params:
    Object: A destructured object containing all relevant fields to display.
Returns:
    Nothing.
*/
function displayUser({ name, bio, avatar_url, login, location, company, public_repos, followers, following, html_url }) {
    clearError();

    nameEl.textContent = name || 'Unknown Name';
    bioEl.textContent = bio || 'No bio.';
    avatarURL.src = avatar_url || '';
    avatarURL.alt = login ? `${login}'s Avatar` : 'User Avatar';
    locationEl.textContent = location || 'Location Not Provided';
    companyEl.textContent = company || 'Company Not Provided';
    reposEl.textContent = public_repos ?? 0;
    followersEl.textContent = followers ?? 0;
    followingEl.textContent = following ?? 0;
    profileLink.href = html_url || '#';
}

/*
Function Name: loadUser
Description: A function that organizes and runs the main logic of our application.
Params:
    username (string): The provided username that the user wishes to look up.
Returns:
    Nothing.
*/
async function loadUser(username) {
    lookupBtn.textContent = "Loading…";
    lookupBtn.disabled = true;

    try {
        const user = await fetchUser(username);
        displayUser(user);
    } finally {
        lookupBtn.disabled = false;
        lookupBtn.textContent = "Lookup User";
    }
}

lookupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const trimmed = username.value.trim();
        if (trimmed) {
            await loadUser(trimmed);
        } else {
            showError("Please enter a username.");
        }
    } catch (err) {
        console.error(err);
        if (err.status === 404) {
            showError("User does not exist.");
        } else if (err.status === 403) {
            showError("Rate limit exceeded. Try again later.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    }
});