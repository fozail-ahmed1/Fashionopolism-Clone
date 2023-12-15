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
    const movieCard = createMovieCard(movie);
    recommendedContainer.appendChild(movieCard);
  });
}

// Function to create a movie card
function createMovieCard(movie) {
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
  return movieCard;
}

// Function to search for a movie
function searchMovie() {
  const userInput = searchInput.value.trim();
  if (userInput !== '') {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${userInput}`)
      .then(response => response.json())
      .then(data => {
        recommendedContainer.innerHTML = '<h2>Search Results</h2>';
        if (data.results.length === 0) {
          recommendedContainer.innerHTML = '<p>No results found.</p>';
        } else {
          data.results.forEach(movie => {
            const movieCard = createMovieCard(movie);
            recommendedContainer.appendChild(movieCard);
          });
        }
      })
      .catch(error => console.error('Error searching for movies:', error));
  } else {
    fetchTrendingMovies(); // If the search input is empty, display trending movies
  }
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
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}

// On page load, fetch trending movies and render them
window.onload = function () {
  fetchTrendingMovies();
};
