// inside out project STEP-105

window.onload = init();

function init() {

  window.addEventListener('scroll', function(e) {
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 300,
      header = document.querySelector("header");
    if (distanceY > shrinkOn) {
      classie.add(header, "smaller");
    } else {
      if (classie.has(header, "smaller")) {
        classie.remove(header, "smaller");
      }
    }
  });

  $.ajax({
    method: 'GET',
    url: 'https://me.justinolanin.com/wp-json/wp-api-menus/v2/menus/2',
    dataType: 'json',
    success: function(data) {
      $('nav').hide();
      var menu = menuBuilder(data.items);
      $('nav').html(menu).slideDown();
      $('nav li a').click(function() {
        getPage($(this).data("pgid"));
      });
      getPage(91);
      $("#loaderDiv").fadeOut("slow");
    },
    error: function() {
      console.log('Menu error');
    }
  });

  $.ajax({
    method: 'GET',
    url: 'https://me.justinolanin.com/wp-json/wp-api-menus/v2/menus/3',
    dataType: 'json',
    success: function(data) {
      var menu = menuBuilder(data.items);
      $('#General_Links').html(menu);
      $('#General_Links li a').click(function() {
        console.log($(this));
        getPage($(this).data("pgid"), );
      });
    },
    error: function() {
      console.log('$(this).data("callkind"));');
    }
  });

  $.ajax({
    method: 'GET',
    url: 'https://me.justinolanin.com/wp-json/wp/v2/posts?orderby=date&per_page=5',
    dataType: 'json',
    success: function(data) {
      $("#mylatestPosts").html('<p id="myloadertocreatethedate"><i class="fa fa-cogs"></i> Loading Posts</p>');
      data.forEach(function(datefromwordpress) {

        var myDate = new Date(datefromwordpress.date);

        $("#mylatestPosts").prepend('<p><a href="#" data-pgid="' + datefromwordpress.id +
          '" data-callkind="posts">' + datefromwordpress.title.rendered + '<span>' + myDate.getMonth() +
          '-' + myDate.getDay() + '-' + myDate.getFullYear() + '</span></a></p>');

      });
      $('#mylatestPosts p a').click(function() {
        getPage($(this).data("pgid"), $(this).data("callkind"));
      });

      $("#myloadertocreatethedate").remove();
    },
    error: function() {
      console.log('Error in my latest posts');
    }
  });

}

function menuBuilder(obj) {
  var theMenu = '';
  if (obj.length > 0) {
    theMenu = theMenu + '<ul>';
    obj.forEach(function(item) {
      theMenu = theMenu + '<li><a href="#" data-pgid="' + item.object_id + '">' + item.title + '</a>';
      if (item.children) {
        theMenu = theMenu + menuBuilder(item.children);
      }
      theMenu = theMenu + '</li>';
    });
    theMenu = theMenu + '</ul>';
  } else {
    console.log('no data');
  }
  return theMenu;
}

function getPage(obj) {
  $("#loaderDiv").fadeIn("slow");
  $.ajax({
    method: 'GET',
    url: 'https://me.justinolanin.com/wp-json/wp/v2/pages/' + obj,
    dataType: 'json',
    success: function(data) {
      var pgbuild = '';
      pgbuild = '<section><div class="container">' + data.content.rendered + '</div></section>';
      $("#content").fadeOut(function() {
        $('html').animate({
          scrollTop: 0
        }, 'slow'); //IE, FF
        $('body').animate({
          scrollTop: 0
        }, 'slow'); //chrome, don't know if Safari works
        $(this).html(pgbuild).fadeIn();
        $("#loaderDiv").fadeOut("slow");
      });
    },
    error: function() {
      console.log('bad');
    }
  });
}
