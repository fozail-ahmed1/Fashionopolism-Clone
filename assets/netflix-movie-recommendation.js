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

// Function to handle search on pressing Enter key
function handleSearch(event) {
  if (event.key === 'Enter') {
    const userInput = searchInput.value.trim();
    if (userInput !== '') {
      if (isFirstSearch) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${userInput}`)
          .then(response => response.json())
          .then(data => {
            displayFirstSearchResult(data.results);
          })
          .catch(error => console.error('Error searching for movies:', error));
      } else {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${userInput}`)
          .then(response => response.json())
          .then(data => {
            displaySearchResults(data.results);
          })
          .catch(error => console.error('Error searching for movies:', error));
      }
    }
    searchInput.value = ''; // Clear the search input
  }
}

// Function to display first search result
function displayFirstSearchResult(results) {
  if (results.length > 0) {
    const firstMovie = results[0];
    const movieCard = createMovieCard(firstMovie);
    featuredMovieContainer.innerHTML = '';
    featuredMovieContainer.appendChild(movieCard);
    isFirstSearch = false;
  } else {
    featuredMovieContainer.innerHTML = '<p>No results found.</p>';
  }
}

// Function to display search results
function displaySearchResults(results) {
  recommendedContainer.innerHTML = '<h2>Search Results</h2>';
  results.forEach(movie => {
    const movieCard = createMovieCard(movie);
    recommendedContainer.appendChild(movieCard);
  });
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

// Function to display trending movies inside the Flickity carousel
function displayTrendingMovies(movies) {
  const trendingMovies = movies.map(movie => createMovieCard(movie));
  appendToCarousel(recommendedContainer, trendingMovies);
}

// Function to display search results inside the Flickity carousel
function displaySearchResults(results) {
  const searchResults = results.map(movie => createMovieCard(movie));
  appendToCarousel(recommendedContainer, searchResults);
}

// Function to display favorites list inside the Flickity carousel
function displayFavorites() {
  const favoriteMovies = favoritesArray.map(movieId => {
    return fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then(response => response.json());
  });

  Promise.all(favoriteMovies)
    .then(movies => {
      const favoriteMovieCards = movies.map(movie => createMovieCard(movie));
      appendToCarousel(favoritesList, favoriteMovieCards);
    })
    .catch(error => console.error('Error fetching favorite movies:', error));
}

// Function to append movie cards to the respective carousel
function appendToCarousel(container, movies) {
  const flickityCarousel = new Flickity(container, {
    cellAlign: 'left',
    contain: true,
    wrapAround: true,
    pageDots: false,
    groupCells: 4 // Display 4 movie cards in one shot
    // Add more options as needed
  });

  flickityCarousel.append(movies);
}

// On page load, fetch trending movies and render them
window.onload = function () {
  fetchTrendingMovies();
};
