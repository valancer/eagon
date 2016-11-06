// console 객체가 없을 경우
if (!window.console) {
	window.console = {
		log : function(){},
		dir : function(){}
	};
} else if (!window.console.dir){
	window.console.dir = function(){};
}


(function(){
	$(document).ready(function(){
		var agents = [/(opr|opera)/gim,/(chrome)/gim,/(firefox)/gim,/(safari)/gim,/(msie[\s]+[\d]+)/gim,/(trident).*rv:(\d+)/gim];
		var agent = navigator.userAgent.toLocaleLowerCase();
		for(var ag in agents){
			if(agent.match(agents[ag])){
				$(document.body).addClass(String(RegExp.$1+RegExp.$2).replace(/opr/,'opera').replace(/trident/,'msie').replace(/\s+/,''));
				break;
			}
		}
	});
})();

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null){
		return null;
	}
	else{
		return results[1] || 0;
	}
}

$(document).ready(function(e) {
	$.ajax({
		type: 'GET',
		url: '/assets/scripts/data.json',
		dataType: 'json',
		timeout: 3000,
		cache: true,
		success: function(result, status, xhr) {
			GNB.init(result);
			main(result);
		},
		error: function(xhr, stauts, err) {
			console.log(err);
		}
	});
});

var GNB = (function($) {
	var scope,
		$container,
		$listMenus,
		$btnMenus,
		_data,
		init = function(data) {
			$container = $('.layout-header');
			$listMenus = $container.find('.list-menus');
			$btnMenus = $container.find('.btn-menus');
			_data = data

			initLayout();
			initEvent();
		};

	function initLayout() {
		var htmlListMenus = '<li><a href="/index.html">Product all</a></li>';
		for( var i=0; i < _data.length; i++ ) {
			var item = _data[i];
			htmlListMenus += '<li><a href="/product_view.html?uid=' + item.uid + '">' + item.title + '</a></li>';
		}
		$listMenus.html(htmlListMenus);
	}

	function initEvent() {
		$btnMenus.on('click', function(e) {
			var state = $('body').attr('data-state');
			if( state == '' || state == undefined ) {
				$('body').attr('data-state', 'open');
			} else {
				$('body').attr('data-state', '');
			}
		});
	}

	return {
		init: function(data) {
			init(data);
		}
	};
}(jQuery));


var ProductList = (function($) {
	var scope,
		$container,
		_data,
		init = function(data) {
			$container = $('.list-product');
			_data = data

			initLayout();
			initEvent();
		};

	function initLayout() {
		var htmlProductList = "";
		for( var i=0; i < _data.length; i++ ) {
			var item = _data[i];
			htmlProductList += '<li>';
			htmlProductList += '	<a href="./product_view.html?uid=' + item.uid + '">';
			htmlProductList += '		<figure>';
			htmlProductList += '			<div class="thumb">';
			htmlProductList += '				<img src="/assets/images/products/' + item.base + '/list.jpg" alt="' + item.title + '">';
			htmlProductList += '			</div>';
			htmlProductList += '			<figcaption>' + item.title + '</figcaption>';
			htmlProductList += '		</figure>';
			htmlProductList += '	</a>';
			htmlProductList += '</li>';
		}
		$container.html(htmlProductList);
	}

	function initEvent() {
	}

	return {
		init: function(data) {
			init(data);
		}
	};
}(jQuery));



var ProductDetail = (function($) {
	var scope,
		$container,
		$productHeader,
		$listFeatures,
		$infoSpec,
		$btnDownload,
		$sliderContainer,
		$popupContainer,
		$popupSlider,
		_data,
		init = function(data) {
			$container = $('.page-detail');
			$productHeader = $container.find('.product-header');
			$listFeatures = $container.find('.list-features');
			$infoSpec = $container.find('.info-spec tbody');
			$btnDownload = $container.find('.btn-download');
			$sliderContainer = $container.find('.product-slider');
			$popupContainer = $container.find('.layout-popup');
			$popupSlider = $popupContainer.find('.popup-slider');
			_data = data[0];

			initLayout();
			initEvent();
		};

	function initLayout() {
		// header
		var $phTitle = $productHeader.find('.product-title');
		var $phDescription = $productHeader.find('.description');
		$phTitle.html(_data.title);
		$phDescription.html(_data.description);

		// slider
		var htmlSlider = "";
		for( var i=0; i < _data.photos.length; i++ ) {
			var url = _data.photos[i];
			htmlSlider += '<div class="product-item">';
			htmlSlider += '	<a href="#photos" class="btn-photos"><img src="' + url.mobile + '" data-responsimg-mobile="' + url.mobile + '" data-responsimg-desktop="' + url.desktop + '" alt="' + _data.title + '" class="responsive-image"></a>';
			htmlSlider += '</div>';
		}
		$sliderContainer.html(htmlSlider);

		// feautures
		var htmlFeatureList = "";
		for( var i=0; i < _data.features.length; i++ ) {
			var item = _data.features[i];
			htmlFeatureList += '<li>';
			htmlFeatureList += '	<figure class="feature">';
			htmlFeatureList += '		<div class="photo">';
			if( item.url.length > 0 ) {
				htmlFeatureList += '	<img src="' + item.url  + '" alt="">';
			}
			htmlFeatureList += '		</div>';
			htmlFeatureList += '		<figcaption data-seq="' + (i+1) + '">';
			htmlFeatureList += '			<em class="title">' + item.title + '</em>';
			htmlFeatureList += '			<p>' + item.content + '</p>';
			htmlFeatureList += '		</figcaption>';
			htmlFeatureList += '	</figure>';
			htmlFeatureList += '</li>';
		}
		htmlFeatureList += '<li class="none-mobile"></li>';
		$listFeatures.html(htmlFeatureList);

		// specification
		var htmlSpec = "";
		for( var i=0; i < _data.specification.length; i++ ) {
			var item = _data.specification[i];
			htmlSpec += '<tr>';
			htmlSpec += '	<th class="r">' + (i+1) + '</th>';
			htmlSpec += '	<th>' + item.title + '</th>';
			htmlSpec += '	<td>' + item.content + '</td>';
			htmlSpec += '</tr>';
		}
		$infoSpec.html(htmlSpec);
		
		// download
		$btnDownload.attr('href', _data.download);

		// popup
		var $popupTitle = $popupContainer.find('.title');
		var $popupDescription = $popupContainer.find('.description');
		$popupTitle.html(_data.title);
		$popupDescription.html(_data.description);

		var htmlPopupSlider = "";
		for( var i=0; i < _data.photos.length; i++ ) {
			var url = _data.photos[i];
			htmlPopupSlider += '<div class="popup-item">';
			htmlPopupSlider += '	<img src="' + url.mobile + '" data-responsimg-mobile="' + url.mobile + '" data-responsimg-desktop="' + url.desktop + '" alt="' + _data.title + '" class="responsive-image">';
			htmlPopupSlider += '</div>';
		}
		$popupSlider.html(htmlPopupSlider);
	}

	function initEvent() {
		// slider & response images
		$('.responsive-image').responsImg({
			breakpoints: {
				mobile: 767,
				desktop: 768
			}
		});

		$sliderContainer.slick({
			arrows: true,
			dots: false,
			infinite: false,
			draggable: true,
			adaptiveHeight: true,
			autoplay: true,
  			autoplaySpeed: 5000,
			slidesToShow: 1,
			slidesToScroll: 1,
			slide: '.product-item',
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						arrows: false
					}
				}
			]
		});

		// popup
		$('.btn-photos').magnificPopup({
			type: 'inline',
			alignTop: true,
			overflowY: true,
			fixedContentPos: true,
			midClick: true,
			preloader: true,
			callbacks: {
				open: function() {
					$popupSlider.slick({
						arrows: true,
						dots: false,
						infinite: false,
						draggable: true,
						autoplay: false,
						slidesToShow: 1,
						slidesToScroll: 1,
						slide: '.popup-item',
						responsive: [
							{
								breakpoint: 1024,
								settings: {
									arrows: false,
									draggable: false
								}
							}
						]
					});
				},
			}
		});
	}

	return {
		init: function(data) {
			init(data);
		}
	};
}(jQuery));




