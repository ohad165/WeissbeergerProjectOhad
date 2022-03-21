(function (angular) {
    'use strict';


angular.module('ohadApp', ['ui.bootstrap'])
    .controller('mainCtrl', ['$scope' , '$window', '$interval', '$uibModal',
        function ($scope, $window, $interval, $uibModal) {
        const CONST = {
            GET_MOVIES_LINK:'http://localhost:8080/get_movies/',
            GET_MOVIE_DETAILS_LINK:'http://localhost:8080/get_movies_details/',
            SPLIT_COUNT: 6
        };

        const getSyncApi = async (resource) => {
            const response = await fetch(resource);
            if(response.status !== 200) {
                throw new Error('cannot fetch the data');
            }
            const data = await response.json();
            return data;
        }

        function getMoviesAPI() {
            getSyncApi(CONST.GET_MOVIES_LINK + $scope.enteredText).then(data => {
                if(data.result) {
                    $scope.items = data.result;
                    $scope.itemsByTitle = [];
                    angular.forEach($scope.items, function(item, index) {
                        if(item.Poster && item.Poster != "N/A") {
                            $scope.itemsByTitle.push({label: item.Title, Poster: item.Poster, imdbID: item.imdbID, year: item.Year});
                        }
                    });
                    $scope.filteredChoices = $scope.itemsByTitle;
                    $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
                    $scope.normalizedArray = getNormalizeWithWishList();
                    return $scope.normalizedArray;
                } else {
                    //$window.alert("No movie found for this input"); bring back when finish
                }
            })
                .catch(err => {
                        $window.alert("ERROR GET MOVIES:" + err.message);
                        $scope.erros = err;
                    }
                );
            return;
        };

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

        function getMoviesDetailsAPI(imdbID) {
            getSyncApi(CONST.GET_MOVIE_DETAILS_LINK + imdbID).then(data => {
                $scope.movieDetailsDto = data.result;
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
                })
            }).catch(err => {
                        $window.alert("ERROR GET MOVIES:" + err.message);
                        $scope.erros = err;
                    }
                );
            return;
        };

        $scope.init = async function () {
            $scope.itemsByTitle = [];
            $scope.text = '';
            $scope.minlength = 1;
            $scope.selected = {};
            $scope.filteredChoices = [];
            $scope.normalizedArray = [];
            $scope.isVisible = {
                suggestions: false
            };
            $scope.normalizedArray = normalizeLocalStorage();
        }

        function normalize(myArray, splitCount) {
            let result = [];
            for (let i = 0; i < (myArray.length / splitCount); i++) {
                result[i] = myArray.slice(i*splitCount, (i*splitCount) + splitCount);
            }
            return result;
        }

        $scope.openMovieModal = async function(item) {
            $scope.movieModal = await getMoviesDetailsAPI(item.imdbID);
        }

        $scope.testValue = 0;

        $interval(function() {
            console.log($scope.testValue++);
        }, 500);


        $scope.filterItems = async function () {
            if($scope.minlength <= $scope.enteredText.length) {
                $scope.normalizedArray = await getMoviesAPI();
            }
            else {
                $scope.isVisible.suggestions = false;
                $scope.normalizedArray = normalizeLocalStorage();
            }
        };

        $scope.getTooltipMovieMessage = function (item) {
            return ($scope.isVisible.suggestions === true) ?
                        item.label +  '\n' + item.year :
                            item.Title +  '\n' + item.Year;
        };


        function normalizeLocalStorage() {
            $scope.itemsByTitle = readLocalStorage();
            return normalize($scope.itemsByTitle, CONST.SPLIT_COUNT);
        }

        function readLocalStorage() {
            let values = [],
                keys = Object.keys(localStorage),
                i = keys.length;
            const array = [];
            while ( i-- ) {
                array.push( JSON.parse(localStorage.getItem(keys[i])) );
            }

            return array;
        }

        $scope.redirectToMovie = function (choice) {
            $scope.itemsByTitle = [choice];
            $scope.normalizedArray = normalize($scope.itemsByTitle, CONST.SPLIT_COUNT);
        };

}]);

    angular.module('ohadApp')
        .filter('bytesToGB', ['uConstants', function(uConstants) {
            return function(input, total) {
                total = parseInt(total);

                for (let i=0; i<total; i++) {
                    input.push(i);
                }

                return input;
            }
        }]);

})(angular);