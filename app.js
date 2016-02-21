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
        },

        getList: function(query) {
            var url = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + query + '&callback=JSON_CALLBACK'
            return $http.jsonp(url)
                
        }
    }
    return wikiService
}])


.controller("wikiCtrl", ["$scope", "wikiService", function($scope, wikiService) {
    $scope.query;
    $scope.wikiResponse;
    $scope.dataReceived = false
    $scope.badQuery = false
    $scope.content
    $scope.list
    $scope.random

    $('#queryInput').bind('keypress', function(e) {
        if (e.keyCode == 13) {
            return $scope.wikiSearch()
        }
    });

    $('#contentToggle').change(function() {
        $scope.content = !$scope.content
        $scope.$apply()
    });

    $scope.wikiSearch = function() {

        if (!$scope.query) {
            $scope.query = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&callback=JSON_CALLBACK'
            $scope.list = ""
            $scope.random = true
        } else {
            $scope.query = $scope.query
            $scope.random = false
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
                            $scope.list = ''
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
                    $scope.moreReading = ''
                    $scope.dataReceived = false

                })

        wikiService.getList($scope.query)
            .success(function(data) {
                    var results = data.query.pages;
                    $scope.list = results
                    $scope.badQuery = false;
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
    $('#toggleDiv').fadeIn().css('display', 'inline-block')
    $('#contentToggle').bootstrapToggle({
        on: 'List View',
        off: 'Content View'
    })
}

setTimeout(function() {
    showInput()
}, 2000)