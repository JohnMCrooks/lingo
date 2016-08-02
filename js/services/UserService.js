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
                    if (results.data === false || results.data === '') {
                        alert("If you already have an account, please sign in, if not, please choose another Username.")
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
                    if (results.data === false) {
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
