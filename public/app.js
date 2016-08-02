(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(app) {
    app.controller('ListViewController', ['NewsService', 'UserService','$sce', '$routeParams',
        '$scope', '$location',
        function(NewsService, UserService, $sce, $routeParams,$scope, $location) {
            $scope.pageNumber = 1;
            $scope.itemsPerPage = 5;

            $scope.specificPref = UserService.getPreferences();

            let articleId = parseInt($routeParams.articleId);

            if (articleId) {
              console.log("in articleId", articleId);
                NewsService.getArticeById(articleId).then(function(result) {
                  console.log("in articleId then", result);
                  $scope.currentArticle = result.data;
                });
            }

            $scope.makeArticleSafe = function(article) {
                return $sce.trustAsHtml(article);
            }

            var getArts = function() {
              console.log("in get arts!");
                NewsService.async($scope.pageNumber, $scope.itemsPerPage).then(function(newsArray) {
                  console.log("all done", newsArray);
                    $scope.newsArray = newsArray;
                });
            }

            getArts();


            $scope.goback = function() {

                $scope.pageNumber -= 1;
                $scope.itemsPerPage = 25;

                NewsService.async($scope.pageNumber, $scope.itemsPerPage).then(function(newsArray) {
                    $scope.newsArray = newsArray;
                });

            }
            $scope.goforward = function() {

                $scope.pageNumber += 1;
                $scope.itemsPerPage = 25;

                NewsService.async($scope.pageNumber, $scope.itemsPerPage).then(function(newsArray) {
                    $scope.newsArray = newsArray;
                });

            }

            $scope.signOut = function() {
                NewsService.signOutUser();
            };

        }
    ]);
}

},{}],2:[function(require,module,exports){
module.exports = function(app) {
    app.controller('NewsController', ['NewsService', 'UserService', '$scope', '$sce', '$location', function(NewsService, UserService, $scope, $sce, $location) {
        $scope.pageNumber = 1;
        $scope.itemsPerPage = 1;
        let prefArray = {};



        let getCats = function() {
            NewsService.async().then(function(categoryArray) {
                $scope.articleArray = categoryArray;
            })
        }
        getCats();


        $scope.makeArticleSafe = function(article) {
            return $sce.trustAsHtml(article);
        }

        $scope.specificPref = UserService.getPreferences();

        var getArts = function() {
            NewsService.async($scope.pageNumber, $scope.itemsPerPage).then(function(newsArray) {
                $scope.newsArray = newsArray;
            });
        }

        getArts();


        $scope.goback = function() {

            $scope.pageNumber -= 1;
            $scope.itemsPerPage = 1;

            NewsService.async($scope.pageNumber, $scope.itemsPerPage).then(function(newsArray) {
                $scope.newsArray = newsArray;
            });

        }
        $scope.goforward = function(category) {

            $scope.pageNumber += 1;
            $scope.itemsPerPage = 1;


            NewsService.async($scope.pageNumber, $scope.itemsPerPage).then(function(newsArray) {
                $scope.newsArray = newsArray;
            });

        }

        $scope.signOut = function() {
            NewsService.signOutUser();
        };



    }]);
}

},{}],3:[function(require,module,exports){
module.exports = function(app) {
    app.controller('UserController', ['UserService', '$scope', '$location', function(UserService, $scope, $location) {
        $scope.userInput = '';
        $scope.userPassword = '';

        $scope.UserPreferences = UserService.getPreferences();

        $scope.signIn = function() {
            console.log("clicked log in", $scope.UserPreferences);
            UserService.postExistingUser($scope.userInput, $scope.userPassword)
        }

        $scope.signUp = function() {
            // console.log("clicked sign up");
            UserService.postUserInfo($scope.userInput, $scope.userPassword)

        }

        // SPANISH LANGUAGE DIFFICULTY
        $scope.toggleSpanishEasyLevel = function() {
          $scope.UserPreferences.langLevel = 'span1';
          $scope.UserPreferences.language = "spanish";
          console.log('spanish is:', $scope.UserPreferences.langLevel);
          console.log('Your lengua es Espanol');
        };
        $scope.toggleSpanishMediumLevel = function() {
          $scope.UserPreferences.langLevel = 'span2';
          $scope.UserPreferences.language = "spanish";
          console.log('spanish is:', $scope.UserPreferences.langLevel);
          console.log('Your lengua es Espanol');
        };
        $scope.toggleSpanishHardLevel = function() {
          $scope.UserPreferences.langLevel = 'span3';
          $scope.UserPreferences.language = "spanish";
          console.log('spanish is:', $scope.UserPreferences.langLevel);
          console.log('Your lengua es Espanol');
        };

        // FRENCH LANGUAGE DIFFICULTY
        $scope.toggleFrenchEasyLevel = function() {
          $scope.UserPreferences.langLevel = 'french1';
          $scope.UserPreferences.language = "french"
          console.log('french is:', $scope.UserPreferences.langLevel);
          console.log("Wee wee!!!!");
        };
        $scope.toggleFrenchMediumLevel = function() {
          $scope.UserPreferences.language = "french"
          $scope.UserPreferences.langLevel = 'french2';
          console.log('french is:', $scope.UserPreferences.langLevel);
          console.log("Wee wee!!!!");
        };
        $scope.toggleFrenchHardLevel = function() {
          $scope.UserPreferences.language = "french"
          $scope.UserPreferences.langLevel = 'french3';
          console.log('french is:', $scope.UserPreferences.langLevel);
          console.log("Wee wee!!!!");
        };

        // TOGGLE ON AND OFF TECHNOLOGY PREFERENCE
        $scope.toggleTechnology = function(value) {
            console.log("Tech is: ", value);
            $scope.UserPreferences.technology = value;
        };
        // TOGGLE ON AND OFF BUSINESS PREFERENCE
        $scope.toggleBusiness = function(value) {
            console.log("Busy-ness is: ", value);
            $scope.UserPreferences.business = value;
        };
        // TOGGLE ON AND OFF POLITICS PREFERENCE
        $scope.togglePolitics = function(value) {
            console.log("Politics is: ", value);
            $scope.UserPreferences.politics = value;
        };
        // TOGGLE ON AND OFF ARTS PREFERENCE
        $scope.toggleArts = function(value) {
            console.log("Arts is: ", value);
            $scope.UserPreferences.arts = value;
        };
        // TOGGLE ON AND OFF SPORTS PREFERENCE
        $scope.toggleSports = function(value) {
            console.log("Sports is: ", value);
            $scope.UserPreferences.sports = value;
        };
        //when controller loads, we get our user Preference object from the server;
        //this saves our object to the server with our current values that changed on our model
        $scope.savePref = function() {
            // console.log('saving saving saving Technology is: ', $scope.UserPreferences.technology);
            UserService.updatePreferences($scope.UserPreferences).then(function(result) {
                // console.log("result > updatePreferences", result);
                $scope.UserPreferences = UserService.getPreferences();
                // console.log('saved saved saved Technology is: ', $scope.UserPreferences.technology);
            });
            //console.log('saving preferencesss:', $scope.UserPreferences);
        };
    }]);
}

},{}],4:[function(require,module,exports){
let app = angular.module('lingo', ['ngRoute', 'ngSanitize']);

require('./controllers/UserController')(app);
require('./controllers/NewsController')(app);
require('./controllers/ListViewController')(app);
require('./services/NewsService')(app);
require('./services/UserService')(app);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/home',
        })
        .when('/home', {
            templateUrl: 'templates/homePage.html',
        })
        .when('/login', {
            controller: 'UserController',
            templateUrl: 'templates/login.html',
        })
        .when('/preferences', {
            controller: 'UserController',
            templateUrl: 'templates/preferences.html',
        })
        .when('/team', {
            controller: 'UserController',
            templateUrl: 'templates/teamBios.html',
        })
        .when('/news', {
            controller: 'NewsController',
            templateUrl: 'templates/articles.html',
        })
        .when('/news/list', {
            controller: 'ListViewController',
            templateUrl: 'templates/listview.html',
        })
        .when('/article/:articleId', {
            controller: 'ListViewController',
            templateUrl: 'templates/listviewclicked.html',
        })


}]);

},{"./controllers/ListViewController":1,"./controllers/NewsController":2,"./controllers/UserController":3,"./services/NewsService":5,"./services/UserService":6}],5:[function(require,module,exports){
module.exports = function(app) {

    app.factory('NewsService', ['UserService', '$http', '$location', function(UserService, $http, $location) {

        let personLoggedIn = UserService.getPreferences();

        var newsArray = {
            async: function(pageNum, perPage) {

                var promise = $http({
                    method: 'GET',
                    url: '/articles',
                }).then(function(response) {

                    console.log("/articles reponse", response);

                    let start = (pageNum + 1) * perPage;

                    return response.data.slice(start, start + perPage);

                });
                return promise;
            },

            getArticeById: function(id){

              var promise = $http({
                  method: 'GET',
                  url: '/article/' + id,
              }).then(function(response) {

                return response;

              });
              return promise;

            },

            //////SIGN OUT FUNCTION//////
            signOutUser: function() {

                    $http({
                            url: '/logout',
                            method: 'POST',
                            data: {
                                username: 'Winnie'
                            }
                        })
                        .then(function(results) {
                            // $location('#/home')
                        });
                }
                //////SIGN OUT FUNCTION/////////


        };
        return newsArray;

    }]);
};

},{}],6:[function(require,module,exports){
module.exports = function(app) {

    app.factory('UserService', ['$http', '$location', function($http, $location) {
        var userPref = {};

        var updatedStuff = {};
        ////signIn() click event to post username and password to server//////
        return {
            postUserInfo: function(name, pw) {
                $http({
                    url: '/registerUser',
                    method: 'POST',

                    data: {
                        username: name,
                        password: pw,
                    },
                }).then(function(results) {
                    // console.log("these are the results", results.data);
                    // console.log("posted new user")
                    if (results.data === false) {
                        alert("This Username is taken. If you already have an account, please sign in, if not, please choose another Username")
                    } else {
                        $location.path('/preferences');
                    }

                });
            },

            postExistingUser: function(username, password) {
                $http({
                    url: '/login',
                    method: 'POST',

                    data: {
                        username: username,
                        password: password,
                    },
                }).then(function(results) {
                    // console.log("these are the results", results.data);
                    // console.log("posted existing user")
                    if (results.data === true) {
                        $location.path('/news');
                    } else {
                        alert("Password Incorrect")
                    }
                    // if(response.data.business === true || response.data.technology === true || response.data.business === true ){
                    //   $location.path('/artist');
                    //   angular.copy(response.data, currentUser )
                    //   console.log(currentUser);
                    // }

                    // angular.copy(response.data, currentUser);
                    // console.log(currentUser);

                });
            },
            // UPDATE user preferences
            updatePreferences: function(userPref) {
              // console.log('this is user pref', userPref);
                var promise = $http({
                    method: 'POST',
                    url: '/preferences',
                    data: userPref
                }).then(function(response) {
                    console.log("posted preferences", response);
                    if (response.data.langLevel === null) {
                      alert('Please select your preferences.');
                    } else {
                      $location.path('/news');
                    };
                    return response;
                });
                return promise;

            },
            // GET user preferences
            getPreferences: function(updatedStuff){
                  $http({
                    method: 'GET',
                    url:'/preferences',
                    data: updatedStuff,
                  }).then(function(response){
                    console.log("response", response);
                    // console.log("this is the response from getPreferences", response);
                    //copies the response object from the data base to our userPref object/model
                    angular.copy(response.data, userPref);
                    console.log('getting user preferences:', userPref);
                  })
                  return userPref
                }
        };

    }]);
}

},{}]},{},[4])