
  $(document).ready(function () {
    $('.slider-nav').slick({
      slidesToShow: 1,
      arrows: false,
      slidesToScroll: 1,
      focusOnSelect: true,
      infinite: false,
      centerMode: true,
      centerPadding: '15%',
      responsive: [
        {
          breakpoint: 991,
          settings: { centerPadding: '8%' }
        },
        {
          breakpoint: 767,
          settings: { centerPadding: '5%' }
        },
        {
          breakpoint: 557,
          settings: { centerPadding: '0%' }
        }
      ]
    });

    var currentSlide = $('.slider-nav').slick('slickCurrentSlide') + 1;
    $('.tab-link[data-slide="' + currentSlide + '"]').addClass('active');

    $('.tab-link').click(function () {
      var slideIndex = $(this).data('slide') - 1;
      $('.tab-link').removeClass('active');
      $(this).addClass('active');
      $('.slider-nav').slick('slickGoTo', slideIndex);
    });

    $('.slider-nav').on('afterChange', function(event, slick, currentSlide){
      $('.tab-link').removeClass('active');
      $('.tab-link[data-slide="' + (currentSlide + 1) + '"]').addClass('active');
    });
  });
