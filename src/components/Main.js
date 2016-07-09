require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//獲取圖片相關數據
import imageDatas from '../data/imageDatas.json';

//將圖片訊息轉成URL
const imageDataArr = (function genImageURL(imageDatas) {
	imageDatas.forEach((singleImageData) => {
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
	});
	return imageDatas;
})(imageDatas);

/*
 * 獲取區間內的一個隨機值
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * get a random integer between 0 ~ 30 degree
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		/*
		 * imgFigure的點擊處理函數
		 */
		this.handleClick = function(e) {
			if (props.arrange.isCenter) {
				props.inverse();
			} else {
				props.center();
			}

			e.stopPropagation();
			e.preventDefault();
		}


	}

	render() {
		let styleObj = {};
		//if props assign this image's position, then use it.
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		//if the rotation angle of images exists and don't equal 0, add it.
		if (this.props.arrange.rotate) {
			(['']).forEach(function(value) {
				styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}



class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}*/
			]
		};
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: { //水平方向取值範圍
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { //垂直方向取值範圍
				x: [0, 0],
				topY: [0, 0]
			}
		}

		/*
		 * inverse image
		 * @param index 輸入當前被執行inverse操作的圖片對應的圖片訊息數組的index值
		 * @return {Function} 這是一個閉包函數，其內return一個真正待被執行的函數
		 */
		this.inverse = function(index) {
			return function() {
				var imgsArrangeArr = this.state.imgsArrangeArr;
				imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				});
			}.bind(this);
		}

		/*
		 * 重新佈局所有圖片
		 * @param centerIndex 指定居中圖片
		 */
		this.rearrange = (centerIndex) => {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			let Constant = this.Constant;
			let centerPos = Constant.centerPos;
			let hPosRange = Constant.hPosRange;
			let vPosRange = Constant.vPosRange;
			let hPosRangeLeftSecX = hPosRange.leftSecX;
			let hPosRangeRightSecX = hPosRange.rightSecX;
			let hPosRangeY = hPosRange.y;
			let vPosRangeTopY = vPosRange.topY;
			let vPosRangeX = vPosRange.x;
			let imgsArrangeTopArr = [];
			let topImgNum = Math.ceil(Math.random() * 2) - 1; // 0,1
			let topImgSpliceIndex = 0;
			let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			//首先居中centerIndex的圖片 居中的圖片不需要旋轉
			imgsArrangeCenterArr[0].pos = centerPos;
			imgsArrangeCenterArr[0].rotate = 0;
			imgsArrangeCenterArr[0].isCenter = true;


			//取出要佈局上側圖片的狀態資訊
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//佈局位於上側的圖片
			imgsArrangeTopArr.forEach((value) => {
				value.pos = {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				};
				value.rotate = get30DegRandom();
				value.isCenter = false;
			});

			//佈局左右兩側的圖片
			for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				let hPosRangeLeftOrRightX = null;
				//前半部分佈局左邊 右半部分佈局右邊
				if (i < k) {
					hPosRangeLeftOrRightX = hPosRangeLeftSecX;
				} else {
					hPosRangeLeftOrRightX = hPosRangeRightSecX;
				}
				imgsArrangeArr[i].pos = {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLeftOrRightX[0], hPosRangeLeftOrRightX[1])
				};
				imgsArrangeArr[i].rotate = get30DegRandom();
				imgsArrangeArr[i].isCenter = false;
			}

			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}

		/*
		 * 利用rearrange，居中對應index圖片
		 * @param index, 需要被居中的圖片的index值
		 * @return {function}
		 */
		this.center = function(index) {
			return function() {
				this.rearrange(index);
			}.bind(this);
		}
	}

	//元件加載以後，為每張圖片計算其位置的範圍
	componentDidMount() {
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
		let stageW = stageDOM.scrollWidth;
		let stageH = stageDOM.scrollHeight;
		let halfStageW = Math.ceil(stageW / 2);
		let halfStageH = Math.ceil(stageH / 2);
		//拿到一個imgFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
		let imgW = imgFigureDOM.scrollWidth;
		let imgH = imgFigureDOM.scrollHeight;
		let halfImgW = Math.ceil(imgW / 2);
		let halfImgH = Math.ceil(imgH / 2);

		//計算中心圖片的位置點
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		//計算左側右側區域圖片位置取值範圍
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		//計算上策區域圖片位置取值範圍
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);

	}

	render() {
		const controllerUnits = [];
		const imgFigures = [];
		imageDataArr.forEach(function(value, index) {
			if (!this.state.imgsArrangeArr[index]) {
				alert(index);
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}

			imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;