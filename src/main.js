// Using "Tileset ver.3 [Free]" by Magiscarf
// https://magiscarf.deviantart.com/art/Tileset-ver-3-Free-690477146

let _zoom = 2;

let _windowWidth;
let _windowHeight;
let _windowScale;
let _windowMax;

let canvas = null;
let ctx = null;

let _body = null;
let _layers = [];

let _cursor = { x: 0, y: 0, clicked: false };
let _speed = { x: 0, y: 0 };
let _pos = { x: 0, y: 0 };

let _frameCount = 0;
let _fps = 0;
let _startTime;
let t = 0;

let _asset = null;
let _assetLoaded = false;

var _raf = window.requestAnimationFrame;

function _scale(x)
{
	return x * _windowScale;
}

function _x(x)
{
	return _windowWidth / 2 + _scale(x);
}

function _y(y)
{
	return _windowHeight / 2 + _scale(y);
}

function _rscale(x)
{
	return x / _windowScale;
}

function _rx(x)
{
	return _rscale(x / _zoom) - _rscale(_windowWidth / 2);
}

function _ry(y)
{
	return _rscale(y / _zoom) - _rscale(_windowHeight / 2);
}

function fixCanvasContextSmoothing(ctx)
{
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
}

//// event handling
function eventMouseDown(e)
{
	let exception;
	
/*
	if (_firstUserInteraction)
	{
		// do not throw an error when music is still loading
		try
		{
			musicStart();
			_firstUserInteraction = false;
		}
		catch (exception)
		{
		}
	}
*/
	
	eventMouseMove(e);
	_cursor.clicked = true;
}

function eventMouseMove(e)
{
	e.preventDefault();
	if (e.touches)
	{
		_cursor.x = _rx(e.touches[0].clientX * window.devicePixelRatio);
		_cursor.y = _ry(e.touches[0].clientY * window.devicePixelRatio);
	}
	else
	{
		_cursor.x = _rx(e.clientX * window.devicePixelRatio);
		_cursor.y = _ry(e.clientY * window.devicePixelRatio);
	}
}
function eventResize()
{
	let i, a;
	
	
	_windowWidth = window.innerWidth * window.devicePixelRatio * (1 / _zoom);
	_windowHeight = window.innerHeight * window.devicePixelRatio * (1 / _zoom);
	_windowScale = Math.min(_windowWidth, _windowHeight) / 400;
	_windowMax = Math.max(_windowWidth, _windowHeight);
	
	for (i=0; i<_layers.length; i++)
	{
		_layers[i].canvas.width = _windowWidth;
		_layers[i].canvas.height = _windowHeight;
		_layers[i].canvas.style.width = (_windowWidth / window.devicePixelRatio  * _zoom) + 'px';
		_layers[i].canvas.style.height = (_windowHeight / window.devicePixelRatio * _zoom) + 'px';
/*
		_layers[i].ctx.imageSmoothingEnabled = false;
		_layers[i].ctx.mozImageSmoothingEnabled = false;
		_layers[i].ctx.webkitImageSmoothingEnabled = false;
		_layers[i].ctx.msImageSmoothingEnabled = false;
*/
		fixCanvasContextSmoothing(_layers[i].ctx);
	}
}

function layerCreate(drawFunction)
{
	let a;
	
	a = { visible: false, canvas: document.createElement("canvas"), draw: drawFunction };
	
	a.ctx = a.canvas.getContext("2d");
	
	_body.appendChild(a.canvas);
	
	_layers.push(a);
	
	// OR, to return index:
	// return _layers.push(a) - 1;
}

function drawFirstLayer()
{
	let i, a, b;
	
	drawSecondLayer();
	ctx.fillStyle = "#ff00ff";
	// ctx.clearRect(0, 0, _windowWidth, _windowHeight);
	ctx.fillRect(_x(_pos.x - 25), _y(_pos.y - 25), _scale(50), _scale(50));
	
	ctx.fillStyle = "#ffffff";
	ctx.font = _scale(20) + "px Arial";
	
	ctx.drawImage(_asset, 0, 0, 400, 400, _x(-50), _y(-50), _scale(200), _scale(200));
	
	for (i=0; i<100; i++)
	{
		a = _x(Math.cos(t * 0.001 + i * 0.35) * 100 - 64/2);
		b = _y(Math.sin(t * 0.0015 + i * 0.1) * 100 - 128/2);
		ctx.drawImage(_asset, 0, 0, 64, 128, a, b, _scale(64), _scale(128));
	}
	
	ctx.fillText((_pos.x | 0) + ", " + (_pos.y | 0) + ", " + _fps + " FPS", _x(0), _y(0));
	ctx.fillText((_windowWidth | 0) + ", " + (_windowHeight), _x(0), _y(20));
}

function drawSecondLayer()
{
	let i;
	
	ctx.clearRect(0, 0, _windowWidth, _windowHeight);
	// ctx.fillStyle = "#222";
	// ctx.fillRect(0, 0, _windowWidth, _windowHeight);
	
	ctx.fillStyle = "#101010";
	ctx.lineStyle = "#181818";
	ctx.lineWidth = _scale(4);
	
	ctx.moveTo(_x(0), _y(0));
	
	ctx.beginPath();
	for (i=0; i<30; i++)
	{
		ctx.lineTo(_x(Math.cos(i * 0.03 + t * 0.001) * 200), _y(Math.cos(i * 0.0121 + t * 0.003) * 200));
	}
	
	ctx.fill();
	ctx.stroke();
}

function draw()
{
	let i, u, a;
	
	_frameCount++;
	
	t = ((new Date()).getTime() - _startTime);
	// dt for delta time?
	
	_raf(draw);
	// window.setTimeout(draw, 1);
	
	_speed.x *= 0.85;
	_speed.y *= 0.85;
	_speed.x += (_cursor.x - _pos.x) * 0.05;
	_speed.y += (_cursor.y - _pos.y) * 0.05;
	_pos.x += _speed.x;
	_pos.y += _speed.y;
	
	if (!_assetLoaded)
	{
		return;
	}
	
	for (i=0; i<_layers.length; i++)
	{
		_layers[i].canvas.style.display = _layers[i].visible ? "block" : "none";
		if (_layers[i].visible)
		{
			canvas = _layers[i].canvas;
			ctx = _layers[i].ctx;
			
			// reset to some default values
			ctx.globalCompositeOperation = "source-over";
			ctx.lineCap = "butt";
			ctx.miterLimit = 1;
			ctx.lineJoin = "round";
			ctx.fillStyle = "#000";
			
			_layers[i].draw.call();
		}
	}
}

function resetFrameCount()
{
	_fps = _frameCount;
	_frameCount = 0;
}

function assetLoadFinished()
{
	_assetLoaded = true;
}

function init()
{
	_body = document.body;
	_body.addEventListener("touchstart", eventMouseDown);
	_body.addEventListener("touchmove", eventMouseMove);
	_body.addEventListener("mousedown", eventMouseDown);
	_body.addEventListener("mousemove", eventMouseMove);
	window.addEventListener("orientationchange", eventResize);
	window.addEventListener("resize", eventResize);
	
	// layerCreate(drawSecondLayer);
	layerCreate(drawFirstLayer);
	
	_layers[0].visible = true;
	// _layers[1].visible = true;
	
	_asset = new Image();
	_asset.addEventListener('load', assetLoadFinished);
	_asset.src = "./tileset-ver-3-free-690477146_by_magiscarf.png";
	
	eventResize();
	
	_startTime = (new Date()).getTime();
	draw();
	
	window.setInterval(resetFrameCount, 1000);
}

window.onload = init;
