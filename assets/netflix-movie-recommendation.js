const apiKey = '9f963d91c27a0086e7c61435322d181a';
const searchInput = document.getElementById('searchInput');
const recommendedContainer = document.getElementById('recommended-container');
const favoritesList = document.getElementById('favoritesList');
const featuredMovieContainer = document.getElementById('featuredMovie');
let favoritesArray = JSON.parse(localStorage.getItem('favorites')) || [];
let isFirstSearch = true;

// Function to fetch trending movies
function fetchTrendingMovies() {
  fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US`)
    .then(response => response.json())
    .then(data => {
      displayTrendingMovies(data.results);
    })
    .catch(error => console.error('Error fetching trending movies:', error));
}

// Function to display trending movies
function displayTrendingMovies(movies) {
  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    recommendedContainer.appendChild(movieCard);
  });
  initializeFlickity('#recommended-container');
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
      <p class="movie-genre">${movie.genre}</p>
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
  favoritesList.innerHTML = '<h2>Favorites</h2>';
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
  initializeFlickity('#favoritesList');
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
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
  fetchTrendingMovies();
  updateFavoritesList();
};
