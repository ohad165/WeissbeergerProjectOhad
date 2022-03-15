
/*** API Service, communicate with backend */

angular.module('ohadApp')
    .service('uApi', ['$window',
    function factory($window) {
//binding for items.
        function ApiFactory() {

        }
        return new ApiFactory();
    }]);