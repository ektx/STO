/*
	获取 SVG 内部元素的信息并以 json 的格式输出
	-----------------------------------------

	@ele 指定的 svg 元素
	@pathToPolygon 是否使用 path 转换成 polygon
*/
function SvgInfo(ele, pathToPolygon) {
	let svg = document.querySelector(ele);
	let result = [];

	let clearData = function( data ) {
		let result;

		if (typeof data === 'string') {
			data = data.replace(/\n|\t/g, '')
		}

		return data
	}

	let getTypeVal = function( json ) {
		let _result = []
		let _l = json.length

		for (let i = 0; i < _l; i++) {
			let _ = json[i]
			let _data = {
				tagName: _.tagName
			}

			if ( _.id ) _data.id = _.id

			let childInfo = _.getBBox ? _.getBBox() : _.getBoundingClientRect()


			switch ( _.tagName ) {
				case 'path':
					if (pathToPolygon) {
						_data.points = clearData( pathToPoints( _.pathSegList ) )

						_data.tagName = 'polygon'
					} else {
						_data.d = clearData( _.getAttribute('d') )
						_data.x = childInfo.x;
						_data.y = childInfo.y;
						_data.width  = childInfo.width;
						_data.height = childInfo.height;
					}
					break;

				case 'polygon':
					_data.points = clearData( _.getAttribute('points') )
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

			if ( _.children.length ) {
				_data.children = getTypeVal( _.children )
			}

			if ( _.hasAttribute('transform') ) {
				let { x, y } = getTranslate(_)
				_data.points = _data.points.map((val, i) => {
					return (i%2 ? val + y : val + x)
				})
			}

			// 保存数据
			_result.push( _data )

		}

		return _result
	}

	if (!svg) return result

	return getTypeVal( svg.children )

}


/*
	path 转换成 point
	---------------------------------

*/
function pathToPoints(segments) {
    
    let result = [], segment, x, y;

    for (let i = 0, l = segments.numberOfItems; i < l; i++) {
        segment = segments.getItem(i);
        switch(segment.pathSegType) {
            case SVGPathSeg.PATHSEG_MOVETO_ABS:
            case SVGPathSeg.PATHSEG_LINETO_ABS:
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
            case SVGPathSeg.PATHSEG_ARC_ABS:
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
                x = segment.x;
                y = segment.y;
                break;
            
            case SVGPathSeg.PATHSEG_MOVETO_REL:                
            case SVGPathSeg.PATHSEG_LINETO_REL:
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
            case SVGPathSeg.PATHSEG_ARC_REL:
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
                x = segment.x;
                y = segment.y;
                if (result.length > 0) {
                    x += result[result.length - 2];
                    y += result[result.length - 1];
                }
                break;
            
            case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
                x = segment.x;
                y = result[result.length - 1];
                break;
            case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
                x = result[result.length - 2] + segment.x;
                y = result[result.length - 1];
                break;

            case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
                x = result[result.length - 2];
                y = segment.y;
                break;
            case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
                x = result[result.length - 2];
                y = segment.y + result[result.length - 1];
                break;
            case SVGPathSeg.PATHSEG_CLOSEPATH:
                return result;
            default:
                console.log('unknown path command: ', segment.pathSegTypeAsLetter);
        }
        result.push(x, y);
    }
    return result;
}

function getTranslate (ele) {
	let style = window.getComputedStyle(ele)
	let martrix = new WebKitCSSMatrix(style.transform)

	return {
		x: martrix.m41,
		y: martrix.m42
	}
}