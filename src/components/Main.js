require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//獲取圖片相關數據
import imageDatas from '../data/imageDatas.json';

//將圖片訊息轉成URL
let imageDatasNew = (function genImageURL(imageDataArr) {
	imageDataArr.forEach(function(singleImageData) {
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
	});
	return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec"></section>
				<nav className="controller-nav"></nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;