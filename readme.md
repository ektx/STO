# S.T.O

SVG to Object

使 SVG 转换成可以使用的 JSON 格式代码

### 说明
目前支持属性有:
`path` `polygon` 对其进行整理输出

示例: 将以下代码复制到左侧的文本框
```html
<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>
```
点击 Go ,得到
```js
[
	{
		"x": 0,
		"y": 2,
		"width": 14,
		"height": 12,
		"type": "path",
		"d": "M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"
	}
]
```