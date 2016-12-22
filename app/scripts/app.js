import Marionette from 'backbone.marionette';
import AppLayout from './AppLayout';
import VerticalPageCarousel from './VerticalPageCarousel.js';

var App = new Marionette.Application();

App.on('start', function() {
  'use strict';

  App.rootLayout = new AppLayout({el: '#demo', regions: {carouselDemo: '#carousel-demo'}});
  App.rootLayout.render();

  const CarouselPage1 = Marionette.ItemView.extend({
    template: '<div><div style="padding: 20px; width: 100%;">Hello</div></div>'
  });
  const CarouselPage2 = Marionette.ItemView.extend({
    template: '<div><div style="padding: 20px; width: 100%;">Hi again</div></div>'
  });

  var CarouselDemo = VerticalPageCarousel.extend({
    pages: [{
      key: 'page1',
      view: CarouselPage1
    },
    {
      key: 'page2',
      view: CarouselPage2
    }]
  });
  App.rootLayout.showChildView('carouselDemo', new CarouselDemo({}));

  setInterval(() => {
    const childView = App.rootLayout.getChildView('carouselDemo');
    const nextPage = childView.currentDef.key === 'page1' ? 'page2' : 'page1';
    childView.navigateToPage(nextPage);
  }, 3000)
});

App.start();
