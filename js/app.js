(function(){

    //source: https://css-tricks.com/snippets/jquery/smooth-scrolling/
    $(function() {
      $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
    });

    function setHeaderSize() {
        var displayHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var h1h = $('header article .container h1').innerHeight();
        var marginTop = (displayHeight-h1h)/2;
        
        $('header article').css('height', displayHeight);



        $('header article .container h1').css('margin-top', marginTop);

    }

    window.onresize = function(event) {
        setHeaderSize();
    };

    setHeaderSize();


})();
