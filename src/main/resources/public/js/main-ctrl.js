(function (angular) {
    'use strict';

angular.module('ohadApp', ['ui.bootstrap'])
    .controller('mainCtrl', ['$scope' , '$window', '$interval', '$uibModal', 'uApi',
        function ($scope, $window, $interval, $uibModal, uApi) {

        const CONST = {
            EMPTY_API_VALUE:"N/A",
            API_ERROR_MSG: "ERROR GET MOVIES:",
            SPLIT_COUNT: 6,
            BREAK_LINE:'\n',
            NO_POSTER_FOUND: "No poster found for this input!!",
            NO_MOVIE_FOUND: "No movie found for this input"
        };

        $scope.init = function () {
            $scope.text = '';
            $scope.minlength = 1;
            $scope.testValue = 0;
            $scope.isVisible = { suggestions: false };
            $scope.normalizedArray = normalizeLocalStorage();
        }

        $interval(function() {
            console.log($scope.testValue++);
        }, 500);

        $scope.getMovies = function () {
            if($scope.minlength <= $scope.enteredText.length) {
                uApi.getMoviesAPI($scope.enteredText).then(function (resp) {
                    if (resp.data.errors && resp.data.errors.length > 0) {
                        $window.alert(CONST.EMPTY_API_VALUE + resp.data.errors);
                    } else if (resp.data.result && resp.data.result.length > 0) {
                        setMoviesFromApi(resp.data.result);
                    } else {
                        $window.alert(CONST.NO_MOVIE_FOUND);
                    }
                });
            } else {
                $scope.isVisible.suggestions = false;
                $scope.normalizedArray = normalizeLocalStorage();
            }
        };

        function setMoviesFromApi(data) {
            $scope.filteredChoices = getFilteredChoices(data);
            $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
            $scope.normalizedArray = getNormalizeWithWishList();
        }

        function getFilteredChoices(data) {
            const filteredChoices = [];
            angular.forEach(data, function(item) {
                if(item.Poster && item.Poster != CONST.EMPTY_API_VALUE) {
                    filteredChoices.push(
                        {label: item.Title, Poster: item.Poster, imdbID: item.imdbID, year: item.Year});
                }
            });
            if(filteredChoices.length === 0) {
                $window.alert(CONST.NO_MOVIE_FOUND);
            }
            return filteredChoices
        }

        function getNormalizeWithWishList() {
            const wishListArray = readLocalStorage();
            let index = 0;
            angular.forEach($scope.filteredChoices, function(apiDataItem) {
                angular.forEach(wishListArray, function(wishListItem) {
                    if(apiDataItem.imdbID == wishListItem.imdbID) {
                        $scope.filteredChoices[index].isWishListMovie = true;
                    }
                });
                index++;
            });
            return normalize($scope.filteredChoices, CONST.SPLIT_COUNT);
        }

        $scope.getMovieDetails = function(item) {
            uApi.getMovieDetailsAPI(item.imdbID).then(function (resp) {
                if (resp.data.errors && resp.data.errors.length > 0) {
                    $window.alert(CONST.API_ERROR_MSG + resp.data.errors);
                } else if (resp.data.result) {
                    $scope.movieDetailsDto = resp.data.result;
                    openMovieModal();
                }
            });
        }

        function openMovieModal() {
            $uibModal.open({
                templateUrl: 'movie-modal.html',
                controller: 'movieModalCtrl',
                windowClass: 'app-modal-window',
                scope: $scope,
                resolve: {
                    movieModal: function () {
                        return $scope.movieDetailsDto;
                    }
                }
            }).result.then(function (movieModal) {
                $scope.movieDetailsDto = movieModal;
            }).then(null, function (reason) { //event when exit the modal
                $scope.filteredChoices.forEach((item, index) => {
                    if(item.imdbID == $scope.movieDetailsDto.imdbID) {
                        $scope.filteredChoices[index].isWishListMovie = $scope.movieDetailsDto.isWishListMovie;
                    }
                })
                normalize($scope.filteredChoices, CONST.SPLIT_COUNT);
            });
        }

        function normalize(myArray, splitCount) {
            let result = [];
            myArray.forEach((item, index) => {
                result[index] = myArray.slice(index * splitCount, (index * splitCount) + splitCount);
            })
            return result;
        }

        $scope.getTooltipMovieMessage = function (item) {
            let res = item.Title +  CONST.BREAK_LINE + item.Year;
            if ($scope.isVisible.suggestions === true)  {
                res = item.label +  CONST.BREAK_LINE + item.year;
            }
            return res;
        };

        function normalizeLocalStorage() {
            $scope.filteredChoices = readLocalStorage();
            return normalize($scope.filteredChoices, CONST.SPLIT_COUNT);
        }

        function readLocalStorage() {
            let values = [], keys = Object.keys(localStorage), i = keys.length;
            const array = [];
            while (i--) {
                array.push(JSON.parse(localStorage.getItem(keys[i])));
            }
            return array;
        }

        $scope.redirectToMovie = function (choice) {
            $scope.filteredChoices = [choice];
            $scope.normalizedArray = normalize($scope.filteredChoices, CONST.SPLIT_COUNT);
        };

}]);

})(angular);