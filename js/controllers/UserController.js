module.exports = function(app) {
    app.controller('UserController', ['UserService', '$scope', '$location', function(UserService, $scope, $location) {
        $scope.userInput = '';
        $scope.userPassword = '';

        $scope.UserPreferences = UserService.getPreferences();

        $scope.signIn = function(event) {
          event.preventDefault();
            console.log("clicked log in", $scope.UserPreferences);
            UserService.postExistingUser($scope.userInput, $scope.userPassword)
        }

        $scope.signUp = function(event) {
            event.preventDefault();
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
