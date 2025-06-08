/* The following line defines global variables defined elsewhere. */
/*globals require*/


if (require === undefined) {
  require = function (reqs, torun) {
    'use strict';
    return torun(window.jQuery);
  };
}

require([
  'jquery',
  'mockup-patterns-select2',
  'select2'
], function ($, Select2) {
  'use strict';

  var $loader = $('.plone-loader');
  if ($loader.size() === 0) {
    $loader = $('<div class="plone-loader"><div class="loader"/></div>');
    $('body').append($loader);
  }

  var $filter = $('#search-filter');
  var $sortingContainer = $('#sorting-options');

  /* handle history */
  if (window.history && window.history.pushState) {
    $(window).bind('popstate', function () {
      /* we're just going to cheat and reload the page so
         we aren't keep moving around state here..
         Here, I'm lazy, we're not using react here... */
      window.location = window.location.href;
    });
  }

  var pushHistory = function () {
    if (window.history && window.history.pushState) {
      var url = window.location.origin + window.location.pathname + '?' + $('#searchForm').serialize();
      window.history.pushState(null, null, url);
    }
  };

  var timeout = 0;

  var apply_search = function ($html) {
    if (window.location.pathname.includes('library')) {
      $('#sorting-options a').each(function(index, el){
        el.setAttribute('class', $('#sorting-options a', $html)[index].getAttribute('class'));
      });
    }
    $('#search-results').replaceWith($('#search-results', $html));
    $('#search-term').replaceWith($('#search-term', $html));
    $('#results-count').replaceWith($('#results-count', $html));
    $('#portal-searchfacets').replaceWith($('#portal-searchfacets', $html));
    $('#portal-searchfacets select.pat-select2').patternSelect2();
  }

  var search = function () {
    $loader.show();
    pushHistory();
    $.ajax({
      url: window.location.origin + window.location.pathname + '?ajax_load=1',
      data: $('#searchForm').serialize()
    }).done(function (html) {
      var $html = $(html);
      apply_search($html);
      $loader.hide();
    });
  };
  var facet_search = function (url) {
    $loader.show();
    if (window.history && window.history.pushState) {
      window.history.pushState(null, null, url);
    }
    var url_splitted = url.split('?');
    var querystring = url_splitted.length > 1 ? url_splitted[1] : '';
    querystring = querystring.replace(/\+/g, ' ').replace(/\%3A/g, ':');
    $.ajax({
      url: window.location.origin + window.location.pathname + '?ajax_load=1',
      data: querystring
    }).done(function (html) {
      var $html = $(html);
      apply_search($html);
      $loader.hide();
    });
  };
  var searchDelayed = function () {
    clearTimeout(timeout);
    timeout = setTimeout(search, 200);
  };

  // for sorme reason the backend always flag with active class the sorting options
  var updateSortingState = function ($el) {
    $('a', $sortingContainer).removeClass('active');
    $el.addClass('active');
  };
  var default_sort = $('#search-results').attr('data-default-sort');
  updateSortingState($('a[data-sort=' + default_sort + ']'));

  /* sorting */
  $('a', $sortingContainer).on('click', function (e) {
    e.preventDefault();
    updateSortingState($(this));
    var sort = $(this).attr('data-sort');
    var order = $(this).attr('data-order');
    if (sort) {
      $('[name="sort_on"]').attr('value', sort);
      if (order && order == 'reverse') {
        $('[name="sort_order"]').attr('value', 'reverse');
      } else {
        $('[name="sort_order"]').attr('value', '');
      }
    } else {
      $('[name="sort_on"]').attr('value', '');
      $('[name="sort_order"]').attr('value', '');
    }
    search();
  });

  /* facet */
  $(document).on('click', '#portal-searchfacets a', function (e) {
    e.preventDefault();
    facet_search($(this).attr('href'));
  });

  $(document).on('change', '#portal-searchfacets select.pat-select2', function (e) {
    e.preventDefault();
    facet_search($(this).val());
  });

  /* form submission */
  $('.searchPage').submit(function (e) {
    e.preventDefault();
    search();
  });

  $(document).on('click', '#resetForm', function (e) {
    e.preventDefault();
    facet_search($(this).attr('href'));
    $('input[name="SearchableText"]').val('');
  });

  $(document).on('change', '#portal-searchfacets .search-date-options input', function (e) {
    e.preventDefault();
    searchDelayed();
  });

  $(document).on('change', '#portal-searchfacets .search-getSolrPubDateYear-options input', function (e) {
    e.preventDefault();
    searchDelayed();
  });


  /* filters */
  $(document).on('click', '#search-filter fieldset.collapsible legend', function (e) {
    $(this).toggleClass('open');
    $(this).closest('.collapsible').toggleClass('open');
    /* if ($filter_menu.hasClass('activated')) {
      $advSearchInput.attr('value', 'True');
    } else {
      $advSearchInput.attr('value', 'False');
    } */
  });

});
