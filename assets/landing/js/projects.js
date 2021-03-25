"use strict";
(function() {
  var data = [
    {
      dataFilter: 'knots',
      href: '/blog/ropework-gallery/',
      image: 'assets/landing/images/portfolio/knots-gallery.jpg',
      isLink: true,
      title: 'Knots Gallery',
      subtitle: 'blog gallery',
      description: 'A gallery of Kiril\'s decorative ropework'
    },
    {
      dataFilter: 'phys',
      href: '/flowfield/',
      image: 'assets/landing/images/portfolio/flowfield-screenshot.png',
      isLink: true,
      title: 'Flowfield',
      subtitle: 'simulation visualisation',
      description: 'A small visualisation of particles flowing through a force field in p5js. Check out Psychedelia mode!'
    },
    {
      dataFilter: 'phys',
      href: '/vicsek-model/',
      image: 'assets/landing/images/portfolio/vicsek.png',
      isLink: true,
      title: 'Vicsek Model in 3D',
      subtitle: 'simulation visualisation',
      description: 'A visualisation of the flocking and swarming behaviour simulation model named after Tamás Vicsek. A simple model describing collective behaviour of self-propelled particles.'
    }
  ]
  
  var div = document.getElementById('projects-div');

  for(var i = 0;i < data.length; i++)
  {
      div.innerHTML = div.innerHTML + 
      '<div class="col-12 col-md-6 col-lg-4 isotope-item" data-filter="'+data[i].dataFilter+'">'+
        '<a class="img-thumbnail-variant-3" href="'+data[i].href+'">'+
          '<img src="'+data[i].image+'" alt="" width="418" height="315"/>'+
          (data[i].isLink?'<span class="label-custom label-white">Link</span>':'')+
          '<div class="caption">'+
            '<span class="icon hover-top-element linearicons-folder-picture"></span>'+
            '<ul class="list-inline-tag hover-top-element">'+
              '<li>'+data[i].subtitle+'</li>'+
            '</ul>'+
            '<p class="heading-5 hover-top-element">'+data[i].title+'</p>'+
            '<div class="divider"></div>'+
            '<p class="small hover-bottom-element">'+data[i].description+'</p>'+
            '<span class="icon arrow-right linearicons-arrow-right"></span>'+
          '</div>'+
        '</a>'+
      '</div>';
  }

}());