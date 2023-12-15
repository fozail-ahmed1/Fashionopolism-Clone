const apiKey = '9f963d91c27a0086e7c61435322d181a';
const searchInput = document.getElementById('searchInput');
const movieDetails = document.getElementById('movieDetails');
const recommendedContainer = document.getElementById('recommendedContainer');
const favoritesList = document.getElementById('favoritesList');
let favoritesArray = [];

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
  recommendedContainer.innerHTML = '<h2>Trending Movies</h2>';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <h3>${movie.title}</h3>
      <button onclick="addToFavorites(${movie.id})">Add to Favorites</button>
    `;
    recommendedContainer.appendChild(movieCard);
  });
}

// Function to fetch recommended movies based on a selected movie
function getRecommendedMovies(movieId, genreIds) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds[0]}`)
    .then(response => response.json())
    .then(data => {
      const recommendedMovies = data.results.filter(movie => movie.id !== movieId);
      displayRecommendedMovies(recommendedMovies);
    })
    .catch(error => console.error('Error:', error));
}

// Function to display recommended movies
function displayRecommendedMovies(movies) {
  recommendedContainer.innerHTML = '<h2>Recommended Movies</h2>';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <h3>${movie.title}</h3>
      <button onclick="addToFavorites(${movie.id})">Add to Favorites</button>
    `;
    recommendedContainer.appendChild(movieCard);
  });
}

// Function to add movie to favorites list
function addToFavorites(movieId) {
  if (!favoritesArray.includes(movieId)) {
    favoritesArray.push(movieId);
    updateFavoritesList();
  } else {
    alert('Movie already in favorites.');
  }
}

// Function to update and display favorites list
function updateFavoritesList() {
  favoritesList.innerHTML = '<h2>Favorites</h2>';
  favoritesArray.forEach(movieId => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then(response => response.json())
      .then(movie => {
        const favoriteMovie = document.createElement('div');
        favoriteMovie.classList.add('favorite-movie');
        favoriteMovie.innerHTML = `
          <h3>${movie.title}</h3>
          <button onclick="removeFromFavorites(${movie.id})">Remove</button>
        `;
        favoritesList.appendChild(favoriteMovie);
      })
      .catch(error => console.error('Error:', error));
  });
  // Save favorites to localStorage for persistence
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}

// Function to remove movie from favorites list
function removeFromFavorites(movieId) {
  favoritesArray = favoritesArray.filter(id => id !== movieId);
  updateFavoritesList();
}

// On page load, check for stored favorites in localStorage
window.onload = function () {
  const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (storedFavorites) {
    favoritesArray = storedFavorites;
    updateFavoritesList();
  }
};
