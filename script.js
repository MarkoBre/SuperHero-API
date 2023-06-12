const heroPowerStats = document.querySelector("#hero-power-stats");
const heroDetails = document.querySelector("#hero-details");
const heroImageContainer = document.querySelector("#hero-image");

// Make a GET request to fetch hero data from the API endpoint
const heroApiUrl = "https://superheroapi.com/api.php/775332364064991/";

const fetchHeroDataByName = async (userInput) => {
    let heroName = userInput.trim().replace(/[^a-zA-Z0-9]/g, "");

    // Check if the search input is empty or too short
    if (heroName === "" || heroName.length <= 1) {
        return;
    }

    // Fetch hero data from the API
    const response = await fetch(heroApiUrl + 'search/' + heroName);
    const heroData = await response.json();

    return heroData;
};

// Search for heroes and update the dropdown with the search results
const heroSearch = document.querySelector("#search-input");
const heroSearchDropdown = document.querySelector("#suggestions-container");

// Give a random hero
window.addEventListener("keydown", async (event) => {
    if (event.key === "r") {
        randomHero = Math.floor(Math.random() * 731) + 1;
        const heroData = await fetchHeroDataById(randomHero);
        showHeroDetails(heroData);
    }
});

const searchHeroesByName = (heroes) => {
    // If the search input is not empty and no heroes are found
    if (heroSearch.value !== "" && !heroes) {
        heroSearchDropdown.innerHTML = "No results :(";
        return;
    }

    let filteredHeroes = heroes;

    // Check the length of the search input for conditional filtering
    if (heroSearch.value.length <= 2) {
        // Filter heroes whose names start with the search input
        filteredHeroes = heroes
            .filter((hero) =>
                hero.name
                    .toLowerCase()
                    .startsWith(heroSearch.value.toLowerCase())
            )
    } else {
        // If the search input length is greater than 2, include all hero names
        filteredHeroes = heroes;
    }
    
    // Generate the HTML for the dropdown options
    let optionsHTML = filteredHeroes
        .map(({name, id}) => `<li><a href="#">${name}<span>${id}</span></a></li>`)
        .join("");

    heroSearchDropdown.innerHTML = optionsHTML;
};

/**
 * Attach Event Listeners to the search bar
 */
let timer = null;

heroSearch.addEventListener("keydown", () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        if (heroSearch.value === "") {
            return;
        }

        let heroData = await fetchHeroDataByName(heroSearch.value);
        // Call the searchHeroes function with the retrieved hero data
        searchHeroesByName(heroData.results);
        showHeroDetails(heroData.results[0]);
    }, 300);
});

heroSearch.addEventListener("input", () => {
    if (heroSearch.value === "") {
        // Clear the dropdown if the search input is empty
        heroSearchDropdown.innerHTML = "";
    }
});

const fetchHeroDataById = async (id) => {
    let response = await fetch(heroApiUrl + id);
    let results = response.json();

    return results;
};

// Select a hero with mouse
const suggestionsList = document.querySelector("#suggestions-container");

suggestionsList.addEventListener("click", async (event) => {
    if (event.target.tagName !== "A") {
        return;
    }

    let clickedHeroId = event.target.querySelector("span").textContent;
    let heroData = await fetchHeroDataById(clickedHeroId);

    showHeroDetails(heroData);
});

// desno power itd, a ispod biografija
const showHeroDetails = (hero) => {
    let powerstats = Object.entries(hero.powerstats)
        .map(([stat, value]) => `<h3>${stat}:</h3> <p>${value}</p>`)
        .join("");

    heroImageContainer.innerHTML = `
        <img src="${hero.image.url}" alt="Hero Image">
    `;

    heroDetails.innerHTML = `
        <div id="hero-name">
            <h2>Hero name</h2>
            <p>${hero.name}</p>
        </div>
        <div>
            <h2>Full name</h2>
            <p>${hero.biography['full-name']}</p>
        </div>
        <div>
            <h2>Gender</h2>
            <p>${hero.appearance.gender}</p>
        </div>
        <div>
            <h2>Relatives</h2>
            <p>${hero.connections.relatives}</p>
        </div>
    `;

    heroPowerStats.innerHTML = `${powerstats}`;
};
