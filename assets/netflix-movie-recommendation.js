const apiKey = '9f963d91c27a0086e7c61435322d181a';
const searchInput = document.getElementById('searchInput');
const recommendedContainer = document.getElementById('recommended-container');
const favoritesList = document.getElementById('favoritesList');
let favoritesArray = JSON.parse(localStorage.getItem('favorites')) || [];

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
    
    const posterPath = movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder-image-url.jpg';
    
    movieCard.innerHTML = `
      <div class="img-and-icon">
        <img src="${posterPath}" alt="${movie.title}" />
        <button onclick="toggleFavorites(${movie.id})">Add to Favorites</button>
      </div>
      <div class="movie-title">
        <p>${movie.title}</p>
        <ul>
          <li></li>
        </ul>
      </div>
    `;
    recommendedContainer.appendChild(movieCard);
  });
}

// Function to search for a movie
function searchMovie() {
  const userInput = searchInput.value.trim();
  // Perform a search using userInput (similar to previous examples)
  // Display movie details and recommendations
  // Update movieDetails and recommendedContainer as required
  // Use fetch and manipulate DOM accordingly
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
        const favoriteMovie = document.createElement('div');
        favoriteMovie.classList.add('favorite-movie');
        
        const posterPath = movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder-image-url.jpg';
        
        favoriteMovie.innerHTML = `
          <div class="img-and-icon">
            <img src="${posterPath}" alt="${movie.title}" />
            <button onclick="toggleFavorites(${movie.id})">Remove</button>
          </div>
          <div class="movie-title">
            <p>${movie.title}</p>
            <ul>
              <li></li>
            </ul>
          </div>
        `;
        favoritesList.appendChild(favoriteMovie);
      })
      .catch(error => console.error('Error:', error));
  });
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}

// On page load, fetch trending movies and render them
window.onload = function () {
  fetchTrendingMovies();
};
