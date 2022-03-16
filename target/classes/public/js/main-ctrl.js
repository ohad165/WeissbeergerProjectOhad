(function (angular) {
    'use strict';


angular.module('ohadApp', ['ui.bootstrap'])
    .controller('mainCtrl', ['$scope' , '$window', '$interval', '$uibModal' ,
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
                        //console.log(item, index);
                        if(item.Poster && item.Poster != "N/A") {
                            $scope.itemsByTitle.push({label: item.Title, Poster: item.Poster});
                        }
                    });
                    $scope.filteredChoices = $scope.itemsByTitle;
                    $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
                    $scope.normalizedArray = normalize($scope.itemsByTitle, CONST.SPLIT_COUNT);
                    $scope.normalizedArrayTemp = $scope.normalizedArray;
                    return $scope.normalizedArray;
                }
            })
                .catch(err => {
                        $window.alert("ERROR GET MOVIES:" + err.message);
                        $scope.erros = err;
                    }
                );
            return;
        };

        function getMoviesDetailsAPI() {
            getSyncApi(CONST.GET_MOVIE_DETAILS_LINK).then(data => {
                $scope.movieDetailsDto = data.result;

            })
                .catch(err => {
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
        }

        function normalize (myArray, splitCount) {
            let result = [];
            for (let i = 0; i < (myArray.length / splitCount); i++) {
                result[i] = myArray.slice(i*splitCount, (i*splitCount) + splitCount);
            }
            return result;
        }


            $scope.openMovieModal = function(item) {
                $scope.movieModal = item;
                $uibModal.open({
                    templateUrl: 'movie-modal.html',
                    controller: 'movieModalCtrl',
                    windowClass: 'app-modal-window',
                    scope: $scope,
                    resolve: {
                        movieModal: function () {
                            return $scope.movieModal;
                        }
                    }
                });
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
            }
        };

        /**
         * Takes one based index to save selected choice object
         */
        $scope.selectItem = function (index) {
            $scope.selected = $scope.itemsByTitle[index - 1];
            $scope.enteredText = $scope.selected.label;
            $scope.isVisible.suggestions = false;
        };

        /**
         * Search for states... use $interval to simulate
         * remote dataservice call.
         */
        function querySearch (query) {
            // returns list of filtered items
            return  query ? $scope.itemsByTitle.filter( createFilterFor(query) ) : [];
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(item) {
                // Check if the given item matches for the given query
                var label = angular.lowercase(item.label);
                return (label.indexOf(lowercaseQuery) === 0);
            };
        }
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