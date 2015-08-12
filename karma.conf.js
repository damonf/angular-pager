module.exports = function ( karma ) {
  karma.set({
    basePath: './',
    files: [
      "bower_components/angular/angular.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "bower_components/jquery/dist/jquery.js",
      "angular-pager.js",
      "angular-pager.spec.js"
    ],
    frameworks: [ 'jasmine' ],
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
    ],
    reporters: 'dots',
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',
    autoWatch: false,
    browsers: [
      'PhantomJS'
      //'Chrome'
    ]
  });
};


