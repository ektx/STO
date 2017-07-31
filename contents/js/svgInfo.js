/*
	获取 SVG 内部元素的信息并以 json 的格式输出
	-----------------------------------------

*/


/*
	@ele 指定的svg元素
*/
function SvgInfo(ele) {

	let svg = document.querySelector(ele);
	let result = [];

	let clearData = function( data ) {
		return data.replace(/\n|\t/g, '')
	}

	let getTypeVal = function( json ) {

		let _result = [];

		for (var i = 0, l = json.length; i < l; i++ ) {

			let _data = {};
			let _ = json[i];
			let childInfo = '';

			_data.tagName = _.tagName;

			if ( _.id ) _data.id = _.id;

			if (json[i].getBBox) {
				childInfo = json[i].getBBox();
			}

			if (!childInfo) {
				childInfo = _.getBoundingClientRect();
			}


			switch ( _.tagName ) {
				case 'path':

					_data.d = clearData( json[i].getAttribute('d') );
					_data.x = childInfo.x;
					_data.y = childInfo.y;
					_data.width  = childInfo.width;
					_data.height = childInfo.height;
					break;

				case 'polygon':
					_data.points = clearData( json[i].getAttribute('points') );
					break;

				case 'g':
					_data.x = childInfo.left;
					_data.y = childInfo.top;
					_data.width = childInfo.width;
					_data.height = childInfo.height;

					break;

				default:
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

	let svgChild = svg.children;

	result = getTypeVal( svgChild );

	return result;
}