angular.module('wikiApp', ['ngSanitize'])

// CONTROLLER TO MAKE AJAX CALLS 
.factory("wikiService", ["$http", ($http) => {

    let wikiService = {

        get: (query) => {
          let newQuery = `http://en.wikipedia.org/w/api.php?titles=${query}&rawcontinue=true&action=query&format=json&prop=extracts&callback=JSON_CALLBACK`
          
          return (/generator\=random/.test(query)) ? $http.jsonp(query) : $http.jsonp(newQuery)
        },

        getList: (query) => {
            let newQuery = `http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${query}&callback=JSON_CALLBACK`
            
            return $http.jsonp(newQuery)    
        }
    }
    return wikiService
}])


.controller("wikiCtrl", ["$scope", "wikiService", ($scope, wikiService) => {
    $scope.query;
    $scope.wikiResponse;
    $scope.dataReceived = false
    $scope.badQuery = false
    $scope.content
    $scope.list
    $scope.random

    $('#queryInput').bind('keypress', (e) => e.keyCode == 13 ? $scope.wikiSearch() : null );

    $('#contentToggle').change(() => {
        $scope.content = !$scope.content
        $scope.$apply()
    });

    $scope.wikiSearch = () => {

        if (!$scope.query) {
            $scope.query = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&callback=JSON_CALLBACK'
            $scope.list = ""
            $scope.random = true
        } else {
            $scope.query = $scope.query
            $scope.random = false
        }

        wikiService.get($scope.query)
            .then((data) => {
                    
                    // RESET ALL VARIABLES; CLEAR FORM //
                    $scope.query = ''
                    $scope.wikiResponse = ''
                    $scope.dataReceived = false
                    $scope.badQuery = false
                    $scope.moreReading = ''
                    let responseObject = data.data.query.pages
                    // BIND RETURNED DATA TO SCOPE //
                    $.each(responseObject, (index, value) => {

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
                  
                // ERROR HANDLING //
                (error) => {
                    $scope.badQuery = true;
                    $scope.wikiResponse = error.data
                    $scope.query = ''
                    $scope.moreReading = ''
                    $scope.dataReceived = false

                })

        wikiService.getList($scope.query)
            .success((data) => {
                    let results = data.query.pages;
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
        off: 'Reader View'
    })
}

setTimeout(() => showInput(), 2000)