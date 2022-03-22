(function (angular) {
    'use strict';

angular.module('ohadApp')
    .controller('movieModalCtrl',
                function ($scope, movieModal) {

        $scope.init = function() {
            $scope.movieModal = movieModal;
            const wishListMovie = JSON.parse(window.localStorage.getItem($scope.movieModal.imdbID));
            if(wishListMovie) {
                $scope.movieDetailsDto.isWishListMovie = true;
            }
        }

        $scope.wishListCheckBoxPressed = function() {
            if($scope.movieDetailsDto.isWishListMovie === true) {
                window.localStorage.setItem($scope.movieDetailsDto.imdbID, JSON.stringify($scope.movieDetailsDto));
            } else {
                window.localStorage.removeItem($scope.movieDetailsDto.imdbID);
            }
        }
    })

})(angular);