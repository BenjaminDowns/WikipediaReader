angular.module('wikiApp', ['ngSanitize'])

.factory("wikiService", ["$http", function($http) {

    var wikiService = {


        get: function(query) {
            // var random = new RegExp('generator=random')
            if (/generator\=random/.test(query)) {
                return $http.jsonp(query)
            } else {
                return $http.jsonp('http://en.wikipedia.org/w/api.php?titles=' + query + '&rawcontinue=true&action=query&format=json&prop=extracts&callback=JSON_CALLBACK')
            }
        }
    }
    return wikiService
}])

.controller("wikiCtrl", ["$scope", "wikiService", function($scope, wikiService) {
    $scope.query;
    $scope.wikiResponse;
    $scope.dataReceived = false
    $scope.badQuery = false

    $('#queryInput').bind('keypress', function(e) {
        if (e.keyCode == 13) {
            return $scope.wikiSearch()
        }
    });

    $scope.wikiSearch = function() {

        if (!$scope.query) {
            $scope.query = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&callback=JSON_CALLBACK'
        } else {
            $scope.query = $scope.query
        }

        wikiService.get($scope.query)
            .then(function(data) {
                    //\\ reset all variables; clean form //\\
                    $scope.query = ''
                    $scope.wikiResponse = ''
                    $scope.dataReceived = false
                    $scope.badQuery = false
                    $scope.moreReading = ''

                    var responseObject = data.data.query.pages
                    $.each(responseObject, function(index, value) {

                        if (data.data.query.pages[-1]) {
                            return $scope.badQuery = true;
                        }

                        $scope.wikiResponse = value.extract
                        $scope.moreReading = value.title;
                        $scope.dataReceived = true;
                        $scope.query = ''

                    })
                },
                // error handling //
                function(error) {
                    $scope.badQuery = true;
                    $scope.wikiResponse = error.data
                    $scope.query = ''
                })
    }


}]);


$('.tooltipped').tooltip({
     placement: "top",
     trigger: "hover"
});


function showInput() {
    $('#wikiLogo').fadeOut('slow')
    $('#queryInput').show('slow')
}

setTimeout(function() {
    showInput()
}, 2000)

