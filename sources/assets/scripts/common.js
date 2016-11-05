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
			main(result);
		},
		error: function(xhr, stauts, err) {
			console.log(err);
		}
	});
});


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
			console.log(data);
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
		_data,
		init = function(data) {
			$container = $('.page-detail');
			$productHeader = $container.find('.product-header');
			$listFeatures = $container.find('.list-features');
			$infoSpec = $container.find('.info-spec tbody');
			$btnDownload = $container.find('.btn-download');
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
	}

	function initEvent() {
	}

	return {
		init: function(data) {
			console.log(data);
			init(data);
		}
	};
}(jQuery));




