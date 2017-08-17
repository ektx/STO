// 创建一个svg用于取数据
function createIframe() {
	let oldSVG = document.getElementById('svgbox');
	let svgBox = document.createElement('div');
	let inner  = document.getElementById('input-svg-box');
	let usePathToPolygon = document.getElementById('use-checkbox').checked;
	let forCMap = document.getElementById('for-cmap').checked;
	let svgVal = inner.value;

	if ( svgVal === '输入你的SVG代码' ) {
		inner.focus();
		return;
	}

	if (oldSVG) oldSVG.remove();

	svgBox.id = 'svgbox';
	svgBox.innerHTML = inner.value;

	// 保存目前使用的数据
	localStorage.svg = svgVal;

	document.getElementById('display-box').appendChild( svgBox );

	let clearSVGJSON = SvgInfo('svg', usePathToPolygon);

	if (forCMap)
		forCMapFun( clearSVGJSON )

	document.getElementById('output-svg-box').value = JSON.stringify(clearSVGJSON, '', '\t' )
}

// 点击事件
document.getElementById('gen-info').addEventListener('click', createIframe, false);

// 本地存储 SVG
if (localStorage.svg) {
	document.getElementById('input-svg-box').value = localStorage.svg
}


function forCMapFun ( json ) {

	for (let val of json) {

		if (typeof val === 'object' && val.children) {
			forCMapFun(val.children)
		}

		val.name = val.id;
		val.w = val.width;
		val.h = val.height;

		delete val.height;
		delete val.width;
		delete val.id;

		if (val.points) {

			if (typeof val.points === 'string') {
				let arr = val.points.replace(/\s/g, ',').split(',');

				arr.forEach( (_v, i) => {
					arr[i] =  Number(_v)
				})
				
				val.points = arr;
			}
			val.map = [ val.points ];

			delete val.points
		}
	}
}