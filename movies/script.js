const apiKey = '495e317befe505baa56cb7ecabeaea9a';
const searchBar = document.getElementById('search-bar');
const popularMovieGrid = document.getElementById('popular-movie-grid');
const topRatedGrid = document.getElementById('top-rated-grid');
const movieDetailsDiv = document.getElementById('movie-details');
const movieInfoDiv = document.getElementById('movie-info');
const closeDetailsButton = document.getElementById('close-details');
const watchlistModal = document.getElementById('watchlist-modal');
const closeWatchlistButton = document.getElementById('close-watchlist');
const watchlistUl = document.getElementById('watchlist');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

closeDetailsButton.addEventListener('click', () => {
    movieDetailsDiv.style.display = 'none';
});

closeWatchlistButton.addEventListener('click', () => {
    watchlistModal.style.display = 'none';
});

async function loadMovies(type, grid) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    displayMovies(data.results, grid);
}

function displayMovies(movies, grid) {
    grid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="info-overlay">
                <h3>${movie.title}</h3>
                <p>Release: ${movie.release_date}</p>
                <button onclick="showMovieDetails(${movie.id})">View Details</button>
            </div>
        `;
        grid.appendChild(movieCard);
    });
}

function showMovieDetails(movieId) {
    fetchMovieDetails(movieId);
}

async function fetchMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`);
    const movie = await response.json();
    displayMovieDetails(movie);
}

function displayMovieDetails(movie) {
    movieInfoDiv.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
    `;
    movieDetailsDiv.style.display = 'flex';
}

searchBar.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length > 2) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        displayMovies(data.results, popularMovieGrid);
    }
});

loadMovies('popular', popularMovieGrid);
loadMovies('top_rated', topRatedGrid);
