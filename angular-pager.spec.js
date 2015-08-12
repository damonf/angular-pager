/*jshint jquery: true*/
/*globals angular: false,describe: false,beforeEach: false,expect: false,inject: false,it: false,jasmine: false*/

describe('testing pagination directive', function () {

  'use strict';

  var
    PAGER_SIZE = 9,
    $scope, $element,

    initiazePager = function ($compile, $q, $rootScope, params) {
      var
        linkingFunction = $compile([
          '<angular-pager num-pages="totalPages"', 
          '       on-change-page="changePageHandler(newPage)"', 
          '       reset="reset">',
          '</angular-pager>'].join('\n'));
  
      $scope            = $rootScope;
      $scope.totalPages = params.totalPages;
      $scope.reset      = params.reset;
      $scope.changePageHandler = jasmine.createSpy('changePageHandler');
      $element = $(linkingFunction($scope));
      $scope.$digest();
    };

  beforeEach(angular.mock.module('angular.pager'));

  beforeEach(inject(function($compile, $q, $rootScope) {
    initiazePager($compile, $q, $rootScope, {
      totalPages: PAGER_SIZE, reset: -1
    });
  }));

  it('creates pagination element', function() {
    expect($element.children().hasClass('pagination')).toBe(true);
  });

  it('creates the correct number of pages', function () { 
    expect($element.find('.pages > a').length).toEqual(PAGER_SIZE);
  });

  it('the number of the page appears in each page element', function () { 
    var pages = $element.find('.pages > a'); 

    angular.forEach(pages, function(elem, idx) {
      expect($(elem).text()).toEqual('' + (idx + 1));
    });
  });

  it('resets to the specified page',
     inject(function($compile, $q, $rootScope) {

    var pages;

    // go to page 5
    $rootScope.reset = 5;
    $rootScope.$digest(); 

    pages = $element.find('.pages > a'); 

    expect(pages.eq(4).text()).toEqual('5');
    expect(pages.eq(4).hasClass('active')).toEqual(true);
  }));

  it('page 1 and 2 always at the start',
     inject(function($compile, $q, $rootScope) {

    var pages;

    initiazePager($compile, $q, $rootScope, {
      totalPages: PAGER_SIZE * 3, reset: -1
    });

    // go to last page
    $rootScope.reset = PAGER_SIZE * 3;
    $rootScope.$digest(); 

    pages = $element.find('.pages > a'); 

    expect(pages.eq(0).text()).toEqual('1');
    expect(pages.eq(1).text()).toEqual('2');
  })); 

  it('last 2 pages always at the end',
     inject(function($compile, $q, $rootScope) {

    var
      totalPages = PAGER_SIZE * 3,
      pages;

    initiazePager($compile, $q, $rootScope, {
      totalPages: totalPages, reset: -1
    });

    // go to first page
    $rootScope.reset = 1;
    $rootScope.$digest(); 

    pages = $element.find('.pages > a'); 

    expect(pages.eq(-1).text()).toEqual('' + totalPages);
    expect(pages.eq(-2).text()).toEqual('' + (totalPages - 1));
  })); 

});

