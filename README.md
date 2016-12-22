Vertical Page Carousel for Marionette
=====================================

This is a simple LayoutView class that manages a list of individual page views and the scrolling animation between each of them. Heavily indebted to abiee's <a href="https://github.com/abiee/es6-marionette">ES6 Marionette scaffolding project</a> to scaffold the demonstration framework.

Relevant files
----------------
`VerticalPageCarousel.js`
`vertical-page-carousel.css`


Setup
-----
Base `es6-marionette` setup: https://github.com/abiee/es6-marionette#setup

For the demo, you can add individual views to the pages array in `scripts/app.js` 

Testing
---------
The other option to run tests is for Continuous Integration purposes, it will run all the tests against PanthomJS and output a jUnit format file for analysis.
    
    $ gulp test

You can get the results at `.tmp/test-results.xml`.

Contribution
---------------
If you have ideas or find an error feel free to submit a PR.

Licence
-------
Licensed under the MIT license.
