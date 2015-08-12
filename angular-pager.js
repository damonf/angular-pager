/*jshint jquery: true*/
/*globals angular: false*/

(function () {

  'use strict';

  var
    PAGER_SIZE = 9, // number of visible page numbers
    COMPACT_PAGER_SIZE = 5,

    template   = [
        '<div class="pagination">',
        '  <a ng-if="!compact" class="left"',
        '     data-ng-show="canPageLeft()"',
        '     data-ng-click="pageLeft()">',
        '    <span>Previous</span>',
        '  </a>',
        '  <a ng-if="compact" class="c-left"',
        '     data-ng-show="canPageLeft()"',
        '     data-ng-click="pageLeft()">',
        '    <span>«</span>',
        '  </a>',
        '  <div class="pages">',
        '    <a data-ng-repeat="page in pagerData.startPages"',
        '       data-ng-class="{active: page == pagerData.currentPage}"',
        '       data-ng-click="changePage(page)">{{page}}</a>',
        '    <span ng-if="pagerData.startPages.length">...</span>',
        '    <a data-ng-repeat="page in pagerData.pages"',
        '       data-ng-class="{active: page == pagerData.currentPage}"',
        '       data-ng-click="changePage(page)">{{page}}</a>',
        '    <span ng-if="pagerData.endPages.length">...</span>',
        '    <a data-ng-repeat="page in pagerData.endPages"',
        '       data-ng-class="{active: page == pagerData.currentPage}"',
        '       data-ng-click="changePage(page)">{{page}}</a>',
        '  </div>',
        '  <a ng-if="!compact" class="right"',
        '     data-ng-show="canPageRight()"',
        '     data-ng-click="pageRight()">',
        '    <span>Next</span>',
        '  </a>',
        '  <a ng-if="compact" class="c-right"',
        '     data-ng-show="canPageRight()"',
        '     data-ng-click="pageRight()">',
        '    <span>»</span>',
        '  </a>',
        '</div>'
      ].join('\n');

  angular.module('angular.pager', [])

  .directive('angularPager', [
    function () {
  
      return {
        restrict : 'AE',
        scope    : {
          numPages     : '=', // total number of pages
          onChangePage : '&',
          reset        : '='  // 0 based index of page number.
                              // Setting this value to >= 0 will cause the
                              // pages to be regenerated and the current
                              // page will be set to the value provided.
                              // Set this value when the total number of
                              // of pages changes.
        },
        template   : template,
        link       : function (scope, elem, attr) {
          var
            compact = attr.compact,

            // create the array of visible page numbers
            // the current page is centered as far as possible
            // first 2 and last 2 page numbers are always included
            generatePages = function (compact) {
              var
                pagerSize  = compact ? COMPACT_PAGER_SIZE : PAGER_SIZE,
                start      = Math.max(scope.pagerData.currentPage - Math.floor(pagerSize / 2), 1),
                num        = Math.min(pagerSize, scope.numPages - start + 1),
                pages      = [],
                startPages = [],
                endPages   = [],
                lastPage, i;
  
              // ensure first 2 pages are in there (1 page if compact)
              if (!compact && start < 4) {
                start = 1;
              }
              else if (compact && start < 2) {
                start = 1;
              }
              else {
                if (compact) {
                  startPages.push(1);
                }
                else {
                  startPages.push(1, 2);
                }
              }
  
              for (i = start; i < start + num; i++) { pages.push(i); }
  
              // ensure last 2 pages are in there (1 page if compact)
              lastPage = pages[pages.length - 1]; 
  
              if (!compact && lastPage < scope.numPages - 2) {
                endPages.push(scope.numPages - 1, scope.numPages);
              }
              else if (compact && lastPage < scope.numPages - 1) {
                endPages.push(scope.numPages);
              }
              else if (lastPage < scope.numPages - 1) {
                pages.push(scope.numPages - 1, scope.numPages);
              } 
              else if (lastPage < scope.numPages) {
                pages.push(scope.numPages);
              }
  
              scope.pagerData.pages = pages;
              scope.pagerData.startPages = startPages;
              scope.pagerData.endPages = endPages;
            },

            clipRange = function (page, numPages) {
              if (page < 1) { return 1; }
              if (page > numPages) { return numPages; }
              return page;
            },

            changePage = function (newPage) {
              // newPage is the page number - not 0 based, starts at 1
              newPage = clipRange(newPage, scope.numPages);
              scope.pagerData.currentPage = newPage;
              generatePages(compact);

              scope.onChangePage({ newPage : newPage });
            };
  
          scope.pagerData = {
            currentPage : 1,
            pages       : [],
            startPages  : [],
            endPages    : []
          };
  
          scope.compact = !!compact;

          scope.pageLeft = function () {
            scope.changePage(scope.pagerData.currentPage - 1);
          };
  
          scope.canPageLeft = function () {
            return scope.pagerData.pages.length > 0 &&
                   scope.pagerData.currentPage > 1;
          };
  
          scope.pageRight = function () {
            scope.changePage(scope.pagerData.currentPage + 1);
          };
  
          scope.canPageRight = function () {
            return scope.pagerData.pages.length > 0 &&
                   scope.pagerData.currentPage < scope.numPages;
          };

          scope.changePage = function (newPage) {
            changePage(newPage);
          };
  
          generatePages(compact);

          scope.$watch('reset', function (newPage) {
            if (newPage >= 0) {
              changePage(newPage);
              scope.reset = -1;
            }
          });
        }
      };
    }
  ]);

}());
