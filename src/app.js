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

var app = (function() {
    // var $ = document.querySelector;
    // var $$ = document.querySelectorAll;

    var elements = {};

    var searchCallback = function() {
        var searchQuery = elements.searchBox.value.trim();

        if (searchQuery.length > 0) {
            MovieService.getMovieData(searchQuery);
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

        attachListeners();
    };

    init();



})();





































