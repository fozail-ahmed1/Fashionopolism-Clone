const apiKey = '9f963d91c27a0086e7c61435322d181a';
const searchInput = document.getElementById('searchInput');
const recommendedContainer = document.getElementById('recommended-container');
const favoritesList = document.getElementById('favoritesList');
const featuredMovieContainer = document.getElementById('featuredMovie');
const searchFeaturedContainer = document.getElementById('searchFeatured');
const searchResultsContainer = document.getElementById('searchResults');
let favoritesArray = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to display a single movie in the featured movie container
function displayFeaturedMovie(movie, container) {
  container.innerHTML = ''; // Clear the container

  const featuredMovieContent = document.createElement('div');
  featuredMovieContent.classList.add('featured-movie-card-content');

  const posterPath = movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder-image-url.jpg';

  featuredMovieContent.innerHTML = `
    <div class="featured-image">
      <img src="${posterPath}" alt="${movie.title}" class="movie-image"/>
    </div>
    <div class="featured-movie-content">
      <p class="featured-movie-title">${movie.title}</p>
      <p class="featured-movie-genre">Animation, Action, Adventure, Fantasy, Drama</p>
    </div>
  `;
  container.appendChild(featuredMovieContent);
}

// Function to fetch trending movies and display the featured movie
function fetchTrendingMoviesAndDisplayFeatured() {
  fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US`)
    .then(response => response.json())
    .then(data => {
      // Display the first trending movie as the featured movie
      if (data.results && data.results.length > 0) {
        displayFeaturedMovie(data.results[0], featuredMovieContainer);
      }
      displayTrendingMovies(data.results.slice(1)); // Display remaining movies in recommended container
    })
    .catch(error => console.error('Error fetching trending movies:', error));
}

// Function to display trending movies
function displayTrendingMovies(movies) {
  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    recommendedContainer.appendChild(movieCard);
  });
  initializeFlickity('#recommended-container'); // Initialize Flickity for recommended movies container
}

// Function to create a movie card
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');

  const posterPath = movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder-image-url.jpg';

  movieCard.innerHTML = `
    <div class="movie-card-content">
      <img src="${posterPath}" alt="${movie.title}" class="movie-image"/>
      <button onclick="toggleFavorites(${movie.id})">Add to Favorites</button>
    </div>
    <div class="movie-content">
      <p class="movie-title">${movie.title}</p>
      <p class="movie-genre">Animation, Action, Adventure, Fantasy, Drama</p>
    </div>
  `;
  return movieCard;
}

// Function to toggle favorites
function toggleFavorites(movieId) {
  if (favoritesArray.includes(movieId)) {
    favoritesArray = favoritesArray.filter(id => id !== movieId);
  } else {
    favoritesArray.push(movieId);
  }
  updateFavoritesList();
}

// Function to update and display favorites list
function updateFavoritesList() {
  favoritesArray.forEach(movieId => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then(response => response.json())
      .then(movie => {
        const favoriteMovie = createMovieCard(movie);
        favoriteMovie.querySelector('button').textContent = 'Remove';
        favoriteMovie.querySelector('button').setAttribute('onclick', `toggleFavorites(${movie.id})`);
        favoritesList.appendChild(favoriteMovie);
      })
      .catch(error => console.error('Error:', error));
  });

  // Wait for a short delay to ensure elements are rendered before initializing Flickity
  setTimeout(() => {
    initializeFlickity('#favoritesList'); // Initialize Flickity for favorites list container
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }, 1000); // Adjust the delay time if needed
}

// Function to display search results
function displaySearchResults(results) {
  const firstMovie = results[0]; // Retrieve the first movie from the search results
  featuredMovieContainer.style.display = 'none'; // Hide featured movie container
  searchFeaturedContainer.style.display = 'block'; // Display search featured container
  searchResultsContainer.style.display = 'block'; // Display search results container
  recommendedContainer.style.display = 'none'; // Hide recommended movies container
  searchResultsContainer.innerHTML = ''; // Clear search results container

  if (firstMovie) {
    displayFeaturedMovie(firstMovie, searchFeaturedContainer);
  } else {
    searchFeaturedContainer.innerHTML = '<p>No results found.</p>';
  }

  // Display the remaining search results in the search results container
  results.slice(1).forEach(movie => {
    const movieCard = createMovieCard(movie);
    searchResultsContainer.appendChild(movieCard);
  });

  initializeFlickity('#searchResults'); // Initialize Flickity for search results container
}

// Function to handle search based on user input
function handleSearch(event) {
  if (event.key === 'Enter') {
    const userInput = searchInput.value.trim();
    if (userInput !== '') {
      searchResultsContainer.style.display = 'none'; // Hide search results container
      recommendedContainer.style.display = 'block'; // Display recommended movies container
      searchMovies(userInput);
      searchInput.value = ''; // Clear the search input
    }
  }
}


// Function to perform movie search
function searchMovies(query) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}`)
    .then(response => response.json())
    .then(data => {
      displaySearchResults(data.results);
    })
    .catch(error => console.error('Error searching for movies:', error));
}

// Function to initialize Flickity carousel
function initializeFlickity(elementSelector) {
  const flickityCarousel = new Flickity(elementSelector, {
    cellAlign: 'left',
    contain: true,
    wrapAround: true,
    pageDots: false,
    groupCells: 4 // Display 4 movie cards in one shot
    // Add more options as needed
  });
}

// On page load, fetch trending movies and render them along with favorites
window.onload = function () {
  fetchTrendingMoviesAndDisplayFeatured(); // Fetch trending movies and display the featured movie
  updateFavoritesList(); // Update and display favorites list
};

// Event listener for handling search input
searchInput.addEventListener('keypress', handleSearch);
