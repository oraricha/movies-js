var MovieService = (function() {
    var api =  'http://api.tvmaze.com/';
    var searchApi = 'search/shows?q=';
    var castApiPrefix = 'shows/';
    var castApiSuffix = '/cast';

    var handleResponse = function(promise, apiName) {
        return promise
            .then(function(response){
                return response.json().then(function(data) {
                    console.log(data);
                    return data;
                });
            })
            .catch(function(error){ console.error(apiName + ' Error: ', error); });
    };

    return {
        getMovieData: function(query) {
            if (typeof query === 'undefined' || !query) {
                return Promise.reject();
            } else {
                var encodedQuery = encodeURIComponent(query);
                return handleResponse(fetch(api + searchApi + encodedQuery), 'getMovieData');
            }
        },
        getCastData: function(movieId) {
            return handleResponse(fetch(api + castApiPrefix + movieId + castApiSuffix), 'getMovieData');
            // return fetch(api + castApiPrefix + movieId + castApiSuffix)
            //     .then(function(response){
            //         return response.json().then(function(data) {
            //             console.log(data);
            //             return data;
            //         });
            //     })
            //     .catch(function(error){ console.error('getCastData Error: ', error); });
        }
    }
})();

var DomService = (function() {
    var api;
    var elements = {};
    var NO_IMAGE_PLACEHOLDER = 'http://static.tvmaze.com/images/no-img/no-img-portrait-text.png';

    var attachListeners = function(){
        elements.modalCloseBtn.addEventListener('click', function() {
            api.hideModal();
        });
    };

    var init = function(){
        elements.boxList = document.querySelector('.boxes');
        elements.modalWrapper = document.querySelector('.modal-wrapper');
        elements.modalContent = document.querySelector('.modal-content');
        elements.modalCloseBtn = document.querySelector('.modal-close-btn');
        elements.castList = elements.modalContent.querySelector('.cast-list');
        elements.movieScore = elements.modalContent.querySelector('.score');
        elements.movieGeners = elements.modalContent.querySelector('.genres');

        attachListeners();
    };

    init();

    api = {
        /**
         * empties the results box and inserts new search results items
         * @param data {Array} - the results data from server
         */
        appendSearchResults: function(data) {
            var movieItems = data.map(function(movie) {
                var listItem = document.createElement('li');
                listItem.className = 'box';
                var img = document.createElement('img');
                img.src = movie.show.image !== null ? movie.show.image.medium : NO_IMAGE_PLACEHOLDER;
                var movieName = document.createElement('div');
                movieName.className = 'movie-name';
                movieName.innerHTML = movie.show.name;

                listItem.appendChild(img);
                listItem.appendChild(movieName);

                listItem.addEventListener('click', function() {
                    api.showModal(movie);
                });

                return listItem;
            });

            elements.boxList.innerHTML = '';
            movieItems.forEach(function(listItem) {
                elements.boxList.appendChild(listItem);
            });
        },
        showModal: function(movieData) {
            MovieService.getCastData(movieData.show.id).then(function(castData) {
                var animationTimeout;
                console.log(castData);

                var movieName = elements.modalContent.querySelector('h3');
                movieName.innerHTML = movieData.show.name;

                var castItems = castData.map(function(castPerson) {
                    var listItem = document.createElement('li');
                    listItem.innerHTML = castPerson.person.name;
                    return listItem;
                });

                elements.castList.innerHTML = '';
                castItems.forEach(function(castPerson) {
                    elements.castList.appendChild(castPerson);
                });

                elements.movieScore.innerHTML = 'Score: ' + movieData.score;
                elements.movieGeners.innerHTML = movieData.show.genres.join(', ');

                elements.modalWrapper.classList.add('shown');
                animationTimeout = setTimeout(function() {
                    elements.modalWrapper.classList.add('visible');
                    clearTimeout(animationTimeout);
                }, .3);

            });
        },
        hideModal: function() {
            elements.modalWrapper.classList.remove('visible');
            animationTimeout = setTimeout(function() {
                elements.modalWrapper.classList.remove('shown');
                clearTimeout(animationTimeout);
            }, .3);
        }
    };

    return api;

})();

var app = (function() {
    var elements = {};

    var searchCallback = function() {
        var searchQuery = elements.searchBox.value.trim();

        if (searchQuery.length > 0) {
            MovieService.getMovieData(searchQuery)
                .then(function(data) {
                    DomService.appendSearchResults(data);
                })
                .catch(function(error) { console.error('Error getting movies data.'); });
        }
    };

    var attachListeners = function(){
        // enable search on enter
        elements.searchBox.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                searchCallback();
            }
        });

        elements.searchBtn.addEventListener("click", function(event) {
            searchCallback();
        });
    };

    var init = function(){
        elements.searchBox = document.querySelector('.search-input');
        elements.searchBtn = document.querySelector('.search-btn');
        elements.searchBox.focus();
        attachListeners();
    };

    init();
})();