document.addEventListener('DOMContentLoaded', function () {
  console.log('Hi and welcome to Jugend hackt. I will be your guide!');

  document.querySelector('body').classList.add('js');

  let toc = document.querySelector('.c-toc');
  if (toc) {
    new Toc().init(toc);
  }

  new Sticky().init('.js-sticky', '.js-sticky-container');

  new IsoManagement().init('.js-isotope',
                         '.js-isotope > li',
                         '.c-filter select',
                         '.js-filter-parent');
});

function IsoManagement() {
  this.init = function (isoParent, isoChildren, selects, cats) {
    this.selects = document.querySelectorAll(selects);
    this.cats = document.querySelectorAll(cats);
    this.filterValues = {};
    var elem = document.querySelector(isoParent);
    if (elem && this.selects && this.cats) {
      this.iso = new Isotope( elem, {
        itemSelector: isoChildren,
        layoutMode: 'fitRows'
      });

      this.selects.forEach((v, i) => {
        v.addEventListener('change', this.selectEventWrapper.bind(this));
      });

      this.cats.forEach((v, i) => {
        v.addEventListener('click', this.topicEventWrapper.bind(this));
      });
    }
  };

  this.addToFilterValuesAndFilter = function (key, value) {
    if (value !== '' && value !== undefined) {
      this.filterValues[key] = '.'+ value;
    } else {
      this.filterValues[key] = undefined;
    }
    let filterString = Object.values(this.filterValues).join("");
    this.iso.arrange({filter: filterString});
  };

  this.selectEventWrapper = function (e) {
    this.addToFilterValuesAndFilter(e.target.id, e.target.value);
  };

  this.topicEventWrapper = function (e) {
    e.preventDefault();
    let topicFilter = document.getElementById('filter-topics');
    let value = e.target.dataset.filter;
    if (value) {
      topicFilter.value = value;
      this.addToFilterValuesAndFilter('filter-topics', value);
      //window.scrollTo(0, 300);
    }
  };
}

function Sticky() {
  this.init = function (elemSelector, parentSelector) {
    let elem = document.querySelector(elemSelector);
    let parent = document.querySelector(parentSelector);
    if (elem && parent) {
      this.sticky = elem;
      this.parent = parent;
      document.addEventListener('scroll', this.startScrollSpy.bind(this));
    }
  };
  this.startScrollSpy = function (ev) {
    let pC = this.parent.getBoundingClientRect();
    let sC = this.sticky.getBoundingClientRect();
    if (pC.top < 0) {
      let w = sC.width;
      this.sticky.style.position = 'fixed';
      this.sticky.style.top = '0';
      this.sticky.style.width = w + 'px';

      let endingSpace =  pC.top + pC.height - sC.height;
      if (endingSpace < 0) {
        this.sticky.style.top =  endingSpace +'px';
      }
    } else {
      this.sticky.style.position = 'static';
      this.sticky.style.width = '100%';

    }
  };
}

function Toc(selector) {
  this.init = function (obj) {
    this.el = obj;
    this.nav = this.el.querySelector('.c-toc-nav');

    if (this.el) {
      this.nav.querySelectorAll('a')
        .forEach(x => x.addEventListener('click', this.toggleEvent.bind(this)));
      let firstElementId = this.nav.querySelector('li:first-of-type a')
          .attributes['href']['nodeValue'];
      this.activateSingle(firstElementId);
    }
  };

  this.toggleEvent = function (ev) {
    ev.preventDefault();
    this.deactivateAll();
    let activeId = ev.target.attributes['href']['nodeValue'];
    this.activateSingle(activeId);
  };

  this.deactivateAll = function () {
    [].concat(...this.el.querySelectorAll('.c-toc-nav a'))
      .concat(...this.el.querySelectorAll('.c-toc-content section'))
      .forEach(x => x.classList.remove('is-active'));
  };

  this.activateSingle = function (id) {
    let navItem = this.el.querySelector(`[href="${id}"]`);
    let contentItem = this.el.querySelector(id);

    [navItem, contentItem]
      .forEach(x => x.classList.add('is-active'));
  };
}