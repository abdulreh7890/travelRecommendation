// ========================================
// Travel Recommendation Application
// ========================================


// ========================================
// GET HTML ELEMENTS
// ========================================

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const resetButton = document.getElementById("resetButton");

const recommendationResults =
  document.getElementById("recommendationResults");

const heroContent =
  document.querySelector(".hero-content");


// ========================================
// FETCH TRAVEL DATA
// ========================================

let travelData = null;


fetch("travel_recommendation_api.json")

  .then(response => {

    if (!response.ok) {

      throw new Error(
        "Unable to load travel recommendation data."
      );

    }

    return response.json();

  })

  .then(data => {

    travelData = data;

    // Required for checking fetched JSON data
    console.log("Travel recommendation data:");

    console.log(data);

  })

  .catch(error => {

    console.error(
      "Error fetching travel data:",
      error
    );

  });


// ========================================
// DISPLAY RECOMMENDATIONS
// ========================================

function displayRecommendations(recommendations) {

  // Clear previous results
  recommendationResults.innerHTML = "";

  // Hide hero content when results are displayed
  heroContent.style.display = "none";


  // No results found
  if (recommendations.length === 0) {

    recommendationResults.innerHTML = `
      <div class="no-results">

        <h2>No recommendations found</h2>

        <p>
          Try searching for beach, beaches,
          temple, temples, country,
          countries, or a country name.
        </p>

      </div>
    `;

    return;
  }


  // Display recommendation cards
  recommendations.forEach(place => {

    const card =
      document.createElement("div");

    card.classList.add(
      "recommendation-card"
    );


    card.innerHTML = `

      <img
        src="${place.imageUrl}"
        alt="${place.name}"
      >

      <div class="recommendation-content">

        <h2>
          ${place.name}
        </h2>

        <p>
          ${place.description}
        </p>

        <button class="visit-button">
          Visit
        </button>

      </div>

    `;


    recommendationResults.appendChild(card);

  });

}


// ========================================
// SEARCH RECOMMENDATIONS
// ========================================

function searchRecommendations() {

  // Get search keyword
  // Convert it to lowercase for case-insensitive search

  const keyword =
    searchInput.value
      .toLowerCase()
      .trim();


  // Clear previous results
  recommendationResults.innerHTML = "";


  // ========================================
  // EMPTY SEARCH
  // ========================================

  if (!keyword) {

    // Keep hero visible
    heroContent.style.display = "";

    recommendationResults.innerHTML = `
      <div class="no-results">

        Please enter a search keyword.

      </div>
    `;

    return;
  }


  // ========================================
  // CHECK IF JSON DATA IS AVAILABLE
  // ========================================

  if (!travelData) {

    heroContent.style.display = "";

    recommendationResults.innerHTML = `
      <div class="no-results">

        Travel information is unavailable.

      </div>
    `;

    return;
  }


  let recommendations = [];


  // ========================================
  // BEACH / BEACHES
  // ========================================

  if (
    keyword === "beach" ||
    keyword === "beaches"
  ) {

    recommendations =
      travelData.beaches || [];

  }


  // ========================================
  // TEMPLE / TEMPLES
  // ========================================

  else if (
    keyword === "temple" ||
    keyword === "temples"
  ) {

    recommendations =
      travelData.temples || [];

  }


  // ========================================
  // COUNTRY / COUNTRIES
  // ========================================

  else if (
    keyword === "country" ||
    keyword === "countries"
  ) {

    if (travelData.countries) {

      travelData.countries.forEach(
        country => {

          if (country.cities) {

            recommendations.push(
              ...country.cities
            );

          }

        }
      );

    }

  }


  // ========================================
  // SEARCH SPECIFIC COUNTRY / CITY
  // ========================================

  else {

    // Search for a matching country
    const country =
      travelData.countries?.find(

        country =>
          country.name
            .toLowerCase()
            .includes(keyword)

      );


    // If country found, show its cities
    if (country) {

      recommendations =
        country.cities || [];

    }

    else {

      // Search individual city names
      travelData.countries?.forEach(
        countryItem => {

          countryItem.cities?.forEach(
            city => {

              if (
                city.name
                  .toLowerCase()
                  .includes(keyword)
              ) {

                recommendations.push(
                  city
                );

              }

            }
          );

        }
      );

    }

  }


  // Display final results
  displayRecommendations(
    recommendations
  );

}


// ========================================
// CLEAR / RESET RESULTS
// ========================================

function clearResults() {

  // Clear search input
  searchInput.value = "";

  // Clear recommendation results
  recommendationResults.innerHTML = "";

  // Show hero content again
  heroContent.style.display = "";

}


// ========================================
// EVENT LISTENERS
// ========================================


// Search button
searchButton.addEventListener(
  "click",
  searchRecommendations
);


// Reset button
resetButton.addEventListener(
  "click",
  clearResults
);


// ========================================
// PRESS ENTER TO SEARCH
// ========================================

searchInput.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Enter") {

      searchRecommendations();

    }

  }
);