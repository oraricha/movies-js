// var app = (function() {
//
// })();

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
                return false;
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
    var elements = {};

    var attachListeners = function(){
        // elements.searchBox.addEventListener("keyup", function(event) {
        //     event.preventDefault();
        //     if (event.keyCode === 13) {
        //         console.log('enter');
        //         searchCallback();
        //     }
        // });
        //
        // elements.searchBtn.addEventListener("click", function(event) {
        //     searchCallback();
        //     console.log('clicked');
        // });
    };

    var init = function(){
        elements.castList = document.querySelector('.boxes');
        // elements.searchBtn = document.querySelector('.search-btn');
        console.log(elements);

        attachListeners();
    };

    init();

    return {
        appendSearchResults: function(data) {
            var NO_IMAGE_PLACEHOLDER = 'http://static.tvmaze.com/images/no-img/no-img-portrait-text.png';
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

                return listItem;
            });

            elements.castList.innerHTML = '';
            movieItems.forEach(function(listItem) {
                elements.castList.appendChild(listItem);
            });
        }
    };

})();

var app = (function() {
    var elements = {};

    var searchCallback = function() {
        var searchQuery = elements.searchBox.value.trim();

        if (searchQuery.length > 0) {
            MovieService.getMovieData(searchQuery)
                .then(function(data) {
                    DomService.appendSearchResults(data);
                });
        }
    };

    var attachListeners = function(){
        elements.searchBox.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                console.log('enter');
                searchCallback();
            }
        });

        elements.searchBtn.addEventListener("click", function(event) {
            searchCallback();
            console.log('clicked');
        });
    };

    var init = function(){
        elements.searchBox = document.querySelector('.search-input');
        elements.searchBtn = document.querySelector('.search-btn');
        console.log(elements);

        elements.searchBox.focus();

        attachListeners();
    };

    init();



})();





































