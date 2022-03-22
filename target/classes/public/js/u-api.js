(function (angular) {
    'use strict';

angular.module('ohadApp')
    .service('uApi', ['$rootScope', '$http', '$window',
        function factory($rootScope, $http, $window) {

            function ApiFactory() {

                const CONST = {
                    GET_MOVIES_LINK:'http://localhost:8080/get_movies/',
                    GET_MOVIE_DETAILS_LINK:'http://localhost:8080/get_movies_details/',
                    CANNOT_FETCH_DATA_MSG:'cannot fetch the data'
                };

                this.getMovieDetailsAPI = function (imdbID) {
                    const link = CONST.GET_MOVIE_DETAILS_LINK + imdbID;
                    return this.doGet(link);
                };

                this.getMoviesAPI = function (enteredText) {
                    const url = CONST.GET_MOVIES_LINK + enteredText;
                    return this.doGet(url);
                };

                this.doGet = function (url) {
                    return $http.get(url).then(function(resp) {
                        return resp;
                    }).catch(function() {
                        $window.alert(CONST.CANNOT_FETCH_DATA_MSG);
                    });
                };
            }

            return new ApiFactory();
    }]);

})(angular);