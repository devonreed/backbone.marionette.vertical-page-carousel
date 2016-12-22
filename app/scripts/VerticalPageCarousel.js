import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import tpl from './templates/vertical-page-carousel.hbs';

export default Marionette.LayoutView.extend({
    /**
     * Must be overridden. The pages array requires the following data per entry:
     *   - key: a unique string index for the page
     *   - view: a Marionette view class which will be rendered in the carousel
     */
    pages: [],

    /**
     * Accepts an options array with support for the following indices:
     *   - step: the numeric index of the step on which to start the carousel
     */
    initialize(options) {
        if (this.pages.length == 0) {
            console.error('VerticalPageCarousel requires a pages array.');
            return;
        }

        if (!this.getPageDefByKey(options.step)) { // don't know what they're doing
            options.step = this.pages[0].key;
        }
        this.currentDef = this.getPageDefByKey(options.step);

        // A counter for distinguishing unique region ids
        this.regionIndex = 0;

        // A variable for keeping track of the new region "in play" and being animated into existence
        this.newRegion = null;
    },

    template: tpl,

    className: 'vertical-page-carousel',

    ui: {
        container: '.vertical-page-carousel__content'
    },

    onShow() {
        this.currentRegion = this.createNewRegion('current');

        this.showChildView(this.currentRegion, new this.currentDef.view(this.data));

        this.ui.container.find('.vertical-page-carousel__page').addClass(`vertical-page-carousel-${this.currentDef.key}-page`);
    },

    goUpTo(key) {
        this.sliding = true;

        this.newRegion = this.createNewRegion('next');
        this.addNewPanel(this.newRegion, key, 'next');
    },

    goDownTo(key) {
        this.sliding = true;

        this.newRegion = this.createNewRegion('previous');
        this.addNewPanel(this.newRegion, key, 'previous');
    },

    addNewPanel(region, key, direction) {
        const childViewClass = this.getPageDefByKey(key).view;
        const childView = new childViewClass(this.data);
        childView.on('attach', () => {
            _.delay(() => {
                const newCurrentItemClass = direction == 'next' ? 'previous' : 'next';
                this.getRegion(this.currentRegion).$el.removeClass('vertical-page-carousel-current-page').addClass(`vertical-page-carousel-${newCurrentItemClass}-page`);
                this.getRegion(this.newRegion).$el.removeClass(`vertical-page-carousel-${direction}-page`).addClass('vertical-page-carousel-current-page');
                setTimeout(() => {
                    this.finishAnimation();
                }, 500); // css3 animation time
            }, 100); // hack
        });
        this.showChildView(this.newRegion, childView);
    },

    finishAnimation() {
        const oldRegion = this.getRegion(this.currentRegion);

        this.removeRegion(this.currentRegion);
        this.currentRegion = this.newRegion;
        this.newRegion = null;

        this.getRegion(this.currentRegion).$el
            .removeClass('vertical-page-carousel-next-page')
            .removeClass('vertical-page-carousel-previous-page')
            .addClass('vertical-page-carousel-current-page');

        this.sliding = false;

        oldRegion.$el.remove();
    },

    createNewRegion(type) {
        this.ui.container.append(`<div class="vertical-page-carousel__page vertical-page-carousel-${type}-page">`);
        this.regionIndex++;
        const newIndex = `page${this.regionIndex}`;
        this.addRegion(newIndex, `.vertical-page-carousel-${type}-page`);

        return newIndex;
    },

    getPageIndexByKey(key) {
        return this.pages.findIndex((page) => page.key === key);
    },

    getPageDefByKey(key) {
        return this.pages.find((page) => page.key === key);
    },

    navigateToPage(key) {
        if (this.sliding) { // we're in the middle of an animation already
            return;
        }

        const def = this.getPageDefByKey(key);
        if (!def) {
            console.error('Unknown page definition');
            return;
        }

        const currentIndex = this.getPageIndexByKey(this.currentDef.key);
        const newIndex = this.getPageIndexByKey(key);

        if (newIndex > currentIndex) {
            this.goUpTo(key);
        } else if (newIndex < currentIndex) {
            this.goDownTo(key);
        } else {
            return;
        }

        const prevDef = this.currentDef.key;
        this.ui.container.find('.vertical-page-carousel__page').removeClass(`vertical-page-carousel-${this.currentDef.key}-page`);
        this.currentDef = this.getPageDefByKey(key);
        this.ui.container.find('.vertical-page-carousel__page').addClass(`vertical-page-carousel-${this.currentDef.key}-page`);

        this.onNavigate(prevDef);
    },

    onNavigate(key) {
        // abstract
    },

    continue() {
        if (this.sliding) { // we're in the middle of an animation already
            return;
        }

        const currentIndex = this.getPageIndexByKey(this.currentDef.key);
        const newIndex = currentIndex + 1;
        const newDef = this.pages[newIndex];

        this.goUpTo(newDef.key);

        this.currentDef = newDef;
    }
});
