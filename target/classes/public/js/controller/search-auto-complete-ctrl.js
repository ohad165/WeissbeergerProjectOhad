(function (angular) {
    'use strict';

angular.module('ohadApp')
    .controller('searchAutoCompleteCtrl', function($scope) {

    $scope.filteredChoices = [];
    $scope.normalizedArray = [];
    $scope.isVisible = {
        suggestions: false
    };

    $scope.filterItems = function () {
        if($scope.minlength <= $scope.enteredtext.length) {
            $scope.filteredChoices = querySearch($scope.enteredtext);
            $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
            $scope.normalizedArray = normalize($scope.filteredChoices, 5);
        }
        else {
            $scope.isVisible.suggestions = false;
        }
    };

        function normalize (myArray, splitCount) {
            let result = [];
            for (let i = 0; i < (myArray.length / splitCount); i++) {
                result[i] = myArray.slice(i*splitCount, (i*splitCount) + splitCount);
            }
            return result;
        }


    /**
     * Takes one based index to save selected choice object
     */
    $scope.selectItem = function (index) {
        $scope.selected = $scope.choices[index - 1];
        $scope.enteredtext = $scope.selected.label;
        $scope.isVisible.suggestions = false;
    };

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
        // returns list of filtered items
        return  query ? $scope.choices.filter( createFilterFor(query) ) : [];
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

})(angular);
