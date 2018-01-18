var n = 0;

angular.module('Directive', [])
    
.directive("repeatEnd", function(){
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
})
.directive("photo", function(){
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            var x = Number($('#loader').attr('data-loading'));
            n++;
            var width = n / x * 100 + '%';
            if(n == x)
                n = 0;
            $('#loading').css('width', width);
        }
    };
});
