

angular.module('ohadApp', [])
    .controller('mainCtrl', function ($scope, $window, $timeout) {
        const CONST = {
            GET_MOVIES_LINK:'http://localhost:8080/get_movies/',
            SPLIT_COUNT: 6
        };

        function getMoviesAPI() {
            const getSyncApi = async (resource) => {
                const response = await fetch(resource + "new york");
                if(response.status !== 200) {
                    throw new Error('cannot fetch the data');
                }
                const data = await response.json();
                return data;
            }

            getSyncApi(CONST.GET_MOVIES_LINK).then(data => {
                console.log('prmoise 1 resolved:', data);
                $scope.items = data.result;
                $scope.normalizedArray = normalize($scope.items, CONST.SPLIT_COUNT);
                $scope.normalizedArrayTemp = $scope.normalizedArray;
                $scope.itemsByTitle = [];
                angular.forEach($scope.items, function(item, index) {
                    //console.log(item, index);
                    $scope.itemsByTitle.push({label: item.Title, Poster: item.Poster});
                });
                $scope.filteredChoices = $scope.itemsByTitle;
            })
                .catch(err => {
                        console.log('prmoise reject', err.message);
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
            $scope.filteredChoices = await getMoviesAPI();
        }

        function normalize (myArray, splitCount) {
            let result = [];
            for (let i = 0; i < (myArray.length / splitCount); i++) {
                result[i] = myArray.slice(i*splitCount, (i*splitCount) + splitCount);
            }
            return result;
        }

        $scope.testValue = 0;

        $timeout(function() {
            console.log($scope.testValue++);
        }, 500);

        $scope.filterItems = function () {
            if($scope.minlength <= $scope.enteredtext.length) {
                $scope.filteredChoices = querySearch($scope.enteredtext);
                $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
                $scope.normalizedArray = normalize($scope.filteredChoices, 5);
            }
            else {
                $scope.isVisible.suggestions = false;
                $scope.normalizedArray = $scope.normalizedArrayTemp;
            }
        };

        /**
         * Takes one based index to save selected choice object
         */
        $scope.selectItem = function (index) {
            $scope.selected = $scope.itemsByTitle[index - 1];
            $scope.enteredtext = $scope.selected.label;
            $scope.isVisible.suggestions = false;
        };

        /**
         * Search for states... use $timeout to simulate
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
});

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

