var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

angular.module('Controller', [])

// inject the Todo service factory into our controller
.controller('mainController', ['$scope','$http','Photos', '$timeout', function($scope, $http, Photos, $timeout) {
    Photos.get(0, 0)
        .success(function(data) {
        window.scrollTo(0, 0);
        $('#loader').attr('data-loading', 20);
        var photos = [];
        for(var i = 0; i<20; i++){
            var photo = Math.floor(Math.random() * data.length - 1);
            photos.push(data[photo]);
            data.splice(photo, 1);
        }
        $scope.photos = photos;
    });
    
    $scope.about = function(){
        $('#about').slideDown(300);
        disableScroll();
    }
     $scope.close = function(){
        $('#about').slideUp(300);
        enableScroll();
    }
    
    $scope.load = function(from, to){
        $('#scroll').hide();
        $('.photo').hide();
        $('#loader').fadeIn();
        Photos.get(from, to)
            .success(function(data) {
            window.scrollTo(0, 0);
            $('#loader').attr('data-loading',data.length);
            $scope.photos = data;
        });
    }
    
    $scope.rand = function(){
        $('#scroll').hide();
        $('.photo').hide();
        $('#loader').fadeIn();
        Photos.get(0, 0)
            .success(function(data) {
             window.scrollTo(0, 0);
            $('#loader').attr('data-loading', 20);
            var photos = [];
            for(var i = 0; i<20; i++){
                var photo = Math.floor(Math.random() * data.length - 1);
                photos.push(data[photo]);
                data.splice(photo, 1);
            }
            
            $scope.photos = photos;
        });
    }
    
    
    $scope.onEnd = function(){
        $timeout(function(){
            $('#loader').fadeOut(function(){
                $('#loading').css('width',0);
            });
            $('.photo').fadeIn();
            setTimeout(function(){
                $('#scroll').fadeIn();
            },500);
            function sizeInit(){
                var w = $(window).width();
                var h = $(window).height();

                if(w > 1000){
                    var width = 400;
                }
                else{
                    var width = w * 0.45;
                }
                $(".photo").css({
                    width: width
                });

                return width;
            }
            function randPos(w, h, width){
                var rotate = Math.floor(Math.random() * 50) - 25;
                var left = Math.floor(Math.random() * (w * 0.85 - width)) + (0.05*w);
                var top = Math.floor(Math.random() * (h - width)) + 20;

                left = left / w * 100 + '%';
                top = top / h * 100 + '%';

                return [rotate, left, top];
            }

            var photos = $('.photo').toArray();
            var scroll = 150;
            var width = sizeInit();

            var scrollMagicController = new ScrollMagic.Controller();

            var w = $(window).width();
            var h = $(window).height();

            photos.map(function(x,i){
                $('#scene' + i).css('top', i * scroll + 'vh');
                if(i%2 == 0){
                    var left = 0-width+width*0.2;
                }
                else{
                    var left = w - width*0.2;

                }
                var posInit = randPos(w, h, width);
                var posFinal = randPos(w, h, width);

                var tween = TweenMax.fromTo('#target' + i, 1, {css: { 
                    rotation : posInit[0],
                    left: left,
                    top: posInit[2]
                }}, {css:{
                    rotation : 0,
                    left: posFinal[1],
                    top: posFinal[2]
                }});
                var scene = new ScrollMagic.Scene({
                    triggerElement: '#scene' + i,
                    triggerHook: 0,
                    duration: scroll + '%'
                })
                .setTween(tween)
                .on("start", function (event) {
                    $('#scene'+i).css('z-index', i +10);
                })
                .addTo(scrollMagicController);

                //.addIndicators();

                if(i == photos.length - 1)
                    $('#scene'+i).css('margin-bottom',scroll+'vh');
            });
        }, 1000);
    };
        
}]);
