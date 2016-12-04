// Code goes here

(function() {
  var createworker = function() {

    var workCount = 0;

    var task1 = function() {
      workCount += 1;
      console.log("task 1 " + workCount);
    };

    var task2 = function() {
      workCount += 1;
      console.log("task 2 " + workCount);
    };

    return {
      job1: task1,
      job2: task2
    };
  };

  var worker = createworker();

  worker.job1();
  worker.job2();
  worker.job2();
  worker.job2();
}());

(function() {
  
  var app = angular.module("githubViewer", []);
  
  var MainController = function(
    $scope, github, $interval, $log, $anchorScroll, $location) {
    
    var onUserComplete = function(data) {
      $scope.user = data;
      github.getRepos($scope.user).then(onRepos, onError)
    };
    
    var onRepos = function(data){
      $scope.repos = data;  
      $location.hash("userDetails");
      $anchorScroll();
    };
    
    var onError = function(reason) {
      $scope.error = "Could not fetch the data.";
    };
    
    var decrementCountdown = function() {
      
      $scope.countdown -= 1;
      
      if ($scope.countdown < 1) {
        $scope.search($scope.username);
      }
    };

    var countdownInterval = null;
    var startCountdown = function() {
      countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);  
    };
    
    $scope.search = function(username){
      $log.info("Searching for " + username)
      github.getUser(username).then(onUserComplete, onError);
           
      if (countdownInterval) {
        $interval.cancel(countdownInterval);
      }
    }
    
    $scope.username = "angular";
    $scope.message = "GitHub Viewer";
    $scope.repoSortOrder = "-stargazers_count";
    $scope.countdown = 5;
    startCountdown();
  }
  
  app.controller("MainController", ["$scope", "github", "$interval", 
                                    "$log", "$anchorScroll", "$location", MainController]);
  
}());