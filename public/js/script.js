 $(document).ready(function(){
     $('.flexslider').flexslider({
         animation: "slide",
         controlNav: "thumbnails",
         slideshow: false,
         start: function(slider){
            $('.flexslider').resize();
        }
     });
});

