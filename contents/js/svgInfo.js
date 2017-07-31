
function createIframe() {
	let oldSVG = document.getElementById('svgbox');
	let svgBox = document.createElement('div');
	let inner  = document.getElementById('input-svg-box');
	let svgVal = inner.value;

	if ( svgVal === '输入你的SVG代码' ) {
		inner.focus();
		return;
	}

	if (oldSVG) oldSVG.remove();

	svgBox.id = 'svgbox';
	svgBox.innerHTML = inner.value;

	document.body.appendChild( svgBox );

	document.getElementById('output-svg-box').value = JSON.stringify( SvgInfo(), '', '\t' )
}

function SvgInfo(evt) {

	let svg = document.querySelector('svg');
	let result = [];

	let clearData = function( data ) {
		return data.replace(/\n|\t/g, '')
	}

	let getTypeVal = function( json ) {

		let _result = [];

		for (var i = 0, l = json.length; i < l; i++ ) {

			// 过滤 title 标签
			// if ( ['path','polygon'].includes(json[i].tagName) ) {

			// 	

			let _data = {};
			let _ = json[i];

			_data.tagName = _.tagName;

			if ( _.id ) _data.id = _.id;

			switch ( _.tagName ) {
				case 'path':
					let childInfo = json[i].getBBox();
					_data.d = clearData( json[i].getAttribute('d') );
					_data.x = childInfo.x;
					_data.y = childInfo.y;
					_data.width  = childInfo.width;
					_data.height = childInfo.height;
					break;

				case 'polygon':
					_data.points = clearData( json[i].getAttribute('points') );
					break;
			}

			if ( json[i].children.length ) {
				_data.children = getTypeVal( json[i].children )
			}

			// 保存数据
			_result.push( _data )

		}

		return _result
	}

	if (!svg) return result;

	let bBox = svg.getBBox();
	let svgChild = svg.children;

	result = getTypeVal( svgChild );

	return result;
}