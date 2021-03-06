Dandelion.controller('listPluginCtrl', function($scope, ngTableParams, Data, $cookieStore, $dialogs, $modal, $rootScope) {
    getData();
    /**
     * Comment
     */
    function getData() {
        Data.get('plugin').then(function(response) {
            $scope.data = response;
            var data = response;
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 20          // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    }

    $scope.install = function(data) {
        Data.get('installPlugin?id=' + data).then(function(results) {
            var data = results;
        });
    };
    $scope.remove = function(item) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/comfirm.html',
            controller: 'comfirmCtrl',
            resolve: {
                deleteItem: function() {
                    return item;
                }
            }
        });
        modalInstance.result.then(function() {
            reallyDelete(item);
        });
    };
    var reallyDelete = function(item) {
        Data.get('removePlugin?id=' + item + '&token=' + $cookieStore.get('token'), function(response) {
            if (response.success == 'true')
                $('.theme_' + response.id).remove();
        });

    };


    $scope.detail = function(id) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/themes/viewdetail.html',
            controller: 'detailPluginCtrl',
            resolve: {
                listItem: function() {
                    return Data.get('detailPlugin?id=' + id + '&token=' + $cookieStore.get('token'));
                }
            }
        });
    }

});


Dandelion.controller('detailPluginCtrl', function($scope, $rootScope, ngTableParams, Data, $cookieStore, $modalInstance, $routeParams, listItem) {
    $rootScope.listItem = listItem;
    $scope.cancel = function() {
        $modalInstance.dismiss('canceled');
    }; // end cancel
});
Dandelion.controller('downloadPluginCtrl', function($scope, ngTableParams, Data, $cookieStore) {
    Data.get('themes').then(function(response) {
        $scope.data = response;
        var data = response;
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 20          // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
    $scope.buynow = function(item) {
        Data.get('buynowPlugin?id=' + item + '&token=' + $cookieStore.get('token'), function(response) {
            if (response == 'true')
                $('.theme_' + item).remove();
        });
    }
});
