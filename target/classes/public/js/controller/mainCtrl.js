(function (angular) {
    'use strict';

angular.module('ohadApp')
    .controller('mainCtrl', function ($scope, uApi, $window) {

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

        $scope.init = function () {
            //const data = getMoviesAPI();
        }



        $scope.getMovies = async function () {
            getMoviesAPI();
        }

        function normalize (myArray, splitCount) {
            let result = [];
            for (let i = 0; i < (myArray.length / splitCount); i++) {
                result[i] = myArray.slice(i*splitCount, (i*splitCount) + splitCount);
            }
            return result;
        }

        $scope.GenerateTable = function () {

        }

        $scope.check = {};
        $scope.check1 = {};
        $scope.check2 = {};

        $scope.itemsByTitle = [];

        $scope.items = [
            { imdbID: "x" },
            { Poster: "y" }
        ];

    $scope.text = '';
    $scope.minlength = 1;
    $scope.selected = {};
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

    })(angular);
//
//
// const getSyncApi = async (resource) => {
//     const response = await fetch(resource);
//
//     if(response.status !== 200) {
//         throw new Error('cannot fetch the data');
//     }
//
//     const data = await response.json();
//     return data;
// }
//
// getSyncApi('json/adi.json').then(data => {
//     console.log('prmoise 1 resolved:', data);
//     return getSyncApi('json/amit.json');
// }).then(data => {
//     console.log('prmoise 2 resolved', data);
//     return getSyncApi('json/shlomi.json');
// })
//     .then(data => {
//         console.log('prmoise 3 resolved', data);
//     })
//     .catch(err =>
//         console.log('prmoise reject', err.message)
//     );
