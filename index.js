$(document).ready(function(){
	init();
});

function init() {
	var log = console.log;
	log('init');

	var Utils = {};
	var Game = {};
	var Sounds = {};
	var Sprites = {};
	var Text = {};

	var t = TweenMax;

	var tlIntro 	= new TimelineMax({paused:true});
	var tlOutro 	= new TimelineMax({paused:true});
	var tlEndOut 	= new TimelineMax({paused:true});
	var tlGameOver 	= new TimelineMax({paused:true});

	Text = (function() {
		var interfaceTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontFamily: 'uniform_roundedbold, Arial',
			fontSize: '28px',
			letterSpacing: -1,
			fill: '0xFFFFFF',
		});

		var ctaTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontFamily: 'uniform_roundedbold, Arial',
			fontSize: '28px',
			letterSpacing: -2,
			fill: '0xFFFFFF',
		});

		var subHeadTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontSize: '36px',
			fontFamily:'uniform_roundedblack, Arial',
			fill: '0xFFFFFF',
			letterSpacing:1
		});
		var yourScoreTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontSize: '100px',
			fontFamily:'uniform_roundedultra, Arial',
			fill: '0xFFFFFF',
			letterSpacing: -4
		});

		return {
			interfaceTextStyle 	: interfaceTextStyle,
			ctaTextStyle 		: ctaTextStyle,
			subHeadTextStyle 	: subHeadTextStyle,
			yourScoreTextStyle 	: yourScoreTextStyle,
		}

	}());

	//Interface

	var loadingText, scoreText, timerText, scoreIcon, timerIcon, timerBg;
	var interfaceHolder, heartHolder, timerHolder, scoreHolder;
	var timerSectors, timerSectorLength, beginAngle;
	var heart1, heart2, heart3;

	// INTRO
	var ctaBg, ctaText, ctaHolder, overlay, ahLogo, logoTextures, instructionText, cabLogo, cabCatch, cabA, cabBite, cabBg, cabCandy1, cabCandy2, cabCandy3, cabCandy4, intro;

	//MAIN
	var main, bgHolder, candyHolder, fgHolder, airheadHolder, hitRect;
	var sky_bg;
	var candy0, candy1, candy2, candy3, candy4, candy5, candy6;
	var candyBlur0, candyBlur1, candyBlur2, candyBlur3, candyBlur4, candyBlur5, candyBlur6;
	var candyBrightness;
	var airHead, airBody, lowerLeftArm, lowerRightArm, upperLeftArm, upperRightArm, lowerLeftLeg, lowerRightLeg, upperLeftLeg, upperRightLeg, torso, head, pelvis, headTextures;
	var candyTextures;
	var candies = [];
	var candyBlur;
	var candyFilters = [];

	//ENDFRAME
	var endFrame, overlayEnd, endCtaBg1, endCtaBg2, endCtaHolder1, endCtaHolder2, endCtaText1, endCtaText2, ahLogoEnd, yourScoreText, endSubhead;
	var cabLogoEnd, cabCatchEnd, cabAEnd, cabBiteEnd, cabBgEnd, cabCandy1End, cabCandy2End, cabCandy3End, cabCandy4End;

	//Sounds
	var bgSound, flapSound, buttonSound, eatSound, loseSound, winSound, overSound;

	//GAME
	var Application = PIXI.Application,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	Sprite 			= PIXI.Sprite,
	gameTime 		= 30,
	elapsedTime 	= 0,
	timerSectors 	= 30,
	timerSectorLength = Math.PI * 2 / timerSectors,
	beginAngle 		= 0 / timerSectors * Math.PI * 2,
	lives 			= 3,
	mainBlurAmount 	= 10,
	topHits 		= 0,
	bottomHits 		= 0,
	score 			= 0,
	flapBoost 		= 0.0,
	sinkRate 		= 4.0,
	candySpeed 		= 3,

	skyScrollRate 		= 0.3,
	buildingScrollRate 	= 0.6,
	treesScrollRate 	= 0.7,
	hedgesScrollRate 	= 0.8,
	streetScrollRate 	= 1.0,
	fgScrollRate 		= 1.5,

	bgSpeedMod 			= 0.0,
	candySpeedMod 		= 0.0,
	clickCount			= 0,

	won, lost,

	playing 		= false,
	introPlaying 	= false,
	_width 			= window.innerWidth,
	_height 		= window.innerHeight;

	var stageW, stageH;
	var game, closeBtn;

	var screenSize;

	var ticker 			= new PIXI.ticker.Ticker({ autoStart : false});
	var introTicker 	= new PIXI.ticker.Ticker({ autoStart : false})

	ticker.autoStart = false;
	introTicker.autoStart = false;

	ticker.stop();
	introTicker.stop();

	Utils = (function(){
		var getMousePosition = function() {
			return app.renderer.plugins.interaction.mouse.global;
		}
		var random = function(min, max) {
			if (max == null) { max = min; min = 0; }
			return Math.round(Math.random() * (max - min) + min);
		}

		// hitRect.toGlobal(app.stage.position).x
		// hitRect.toGlobal(app.stage.position).y

		var hitTest = function(r1, r2) {
			var hit, combinedHalfWidths ,combinedHalfHeights, vx, vy;
			hit = false;

			//r1.centerX = r1.x;
			//r1.centerY = r1.y;

			//r2.centerX = r2.x;
			//r2.centerY = r2.y;

			r1.centerX = r1.toGlobal(app.stage.position).x + r1.width / 2;
			r1.centerY = r1.toGlobal(app.stage.position).y + r1.height / 2;

			r2.centerX = r2.toGlobal(app.stage.position).x + r2.width / 6 + 100;
			//r2.centerY = r2.toGlobal(app.stage.position).y + r2.height / 20 + 110;
			r2.centerY = r2.toGlobal(app.stage.position).y + 130;

			r1.halfWidth = r1.width / 2;
			r1.halfHeight = r1.height / 2;

			r2.halfWidth = r2.width / 4;
			r2.halfHeight = r2.height / 8;

			vx = r1.centerX - r2.centerX;
			vy = r1.centerY - r2.centerY;

			combinedHalfWidths = r1.halfWidth + r2.halfWidth;
			combinedHalfHeights = r1.halfHeight + r2.halfHeight;

			if (Math.abs(vx) < combinedHalfWidths) {
				//Collision X
				if (Math.abs(vy) < combinedHalfHeights) {
					//There's definitely a collision happening
					hit = true;
	    		} else {
					//no collision on the y axis
					hit = false;
	    		}
			} else {
				//There's no collision on the x axis
				hit = false;
			}
			return hit;
			}

			return {
				random : random,
				hitTest : hitTest,
				getMousePosition : getMousePosition
		}
	}());

	function initAudio() {
		bgSound = new Howl({
			src : ['sounds/bg-sound.mp3'],
			volume: 0.5,
			loop: true,
		});
		flapSound = new Howl({
			src : ['sounds/jump-sound.mp3'],
			volume: 0.5
		});
		buttonSound = new Howl({
			src : ['sounds/button-sound.mp3'],
			volume: 0.5
		});
		eatSound = new Howl({
			src : ['sounds/eat-sound.mp3'],
			volume: 0.5
		});
		loseSound = new Howl({
			src : ['sounds/lose-sound.mp3'],
			volume: 0.5
		});
		winSound = new Howl({
			src : ['sounds/win-sound.mp3'],
			volume: 0.5
		});
		overSound = new Howl({
			src : ['sounds/over-sound.mp3'],
			volume: 0.5
		});

		var audioCount = 0;
		function updateAudioProgress() {
			audioCount += 1;
			//log(audioCount);
			if (audioCount === 7) {
				//setTimeout( function() { bgSound.play(); }, 500);

				//setTimeout( function() { bgSound.play(); ticker.start(); playing = true;}, 500);
				//intro.alpha = 0.0;
				//intro.destroy();

			}
		}


		bgSound.once('load', updateAudioProgress());
		flapSound.once('load', updateAudioProgress());
		buttonSound.once('load', updateAudioProgress());
		eatSound.once('load', updateAudioProgress());
		loseSound.once('load', updateAudioProgress());
		winSound.once('load', updateAudioProgress());
		overSound.once('load', updateAudioProgress());
	}

	function initStage() {

		game = $('<div>', {id:'game'}).appendTo('body');
		closeBtn = $('<div>', {id : 'closeBtn'}).appendTo(game);

		if (_width >= 1280 ) {
			screenSize = 'desktop';
			//log(screenSize);
			$(game).css({width:1280, height:500});
			app = new Application({width : 1280, height : 500, legacy : true});
		} else if (_width < 1280 && _width >= 728 ) {
	      	screenSize = 'tablet';
	      	if (_height > 500) {
				//log(screenSize);
				$(game).css({width:'100%', height:500});
	          	app = new Application({width : _width, height : 500, forceCanvas : true});
	        } else {
	          $(game).css({width:'100%', height:'100%'});
	          app = new Application({width : _width, height : _height, forceCanvas : true});
	        }
		} else if ( _width < 728 ) {

	      	if(Math.abs(window.orientation) === 90) {
	          	screenSize = 'tablet';
	          	$(game).css({width:'100%', height:'100%'});
	        	app = new Application({width : _width, height : _height, forceCanvas : true});
	        } else {
	          	screenSize = 'mobile';
				//log(screenSize);
				$(game).css({width:'100%', height:'100%'});
				app = new Application({width : _width, height : _height, forceCanvas : true});
	        }
		}

		app.renderer.backgroundColor = 0x0040A3;
		$(app.view).appendTo(game);

		stageW = app.renderer.view.width;
		stageH = app.renderer.view.height;

		loadingText = new PIXI.Text('LOADING      ');
		loadingText.style = {fill: 'WHITE', font:'20px uniform_roundedbold, Arial'};
		loadingText.position.set(stageW / 2 - loadingText.width / 2, stageH / 2);
		app.stage.addChild(loadingText);

	}



	function handleScore() {
		head.play();
		eatSound.play();

		score += 1;
		scoreText.setText(score);

		head.onComplete = function() {
			head.gotoAndStop(1);
		}
	}


	var cx0, cy0, cx1, cy1, blurAmount, cnt = 0;
	var vpX, vpY, fl = 250, xPos, yPos, zPos, scale;

	var cbcm0 = 0.5;

	function handleCandy(delta) {

		log(candy0.x);

		cy0 = stageH / 2 - candy0.y;
		cx0 = stageW / 2 - candy0.x;

		cy1 = stageH / 2 - candy1.y;
		cx1 = stageW / 2 - candy1.x;

		candyBlur0.blur = candy0.scale.x * 3;

		candyBlur1.blur = candy1.scale.x * 3;

		cbcm0 = Math.cos(candy0.scale.x / 2.0)
		candyBrightness0.brightness(cbcm0);

		cbcm1 = Math.cos(candy1.scale.x / 2.5)
		candyBrightness1.brightness(cbcm1);

		if (candy0.scale.x < 0.50 && candy0.scale.x > 0.45 ) {
			if (Utils.hitTest(candy0, hitRect)) {
				log('CANDY COLLISION');
				t.set(candy0, {pixi:{x:Utils.random(-400, stageW + 400), y:Utils.random(-4000, -200) }} );
				candy0.scale.x = candy0.scale.y = Utils.random(2, 4);
				candyBlur0.blur = 10;
				//candyHolder.swapChildren(candy0, airHead);
				candy0.gotoAndStop(Utils.random(0, 6));
				handleScore();
			}
		}

		if (candy1.scale.x < 0.50 && candy1.scale.x > 0.45 ) {
			if (Utils.hitTest(candy1, hitRect)) {
				log('CANDY COLLISION');
				t.set(candy1, {pixi:{x:Utils.random(-400, stageW + 400), y:Utils.random(600, 4000)     }} );
				candy1.scale.x = candy1.scale.y = Utils.random(2, 4);
				candyBlur1.blur = 10;
				//candyHolder.swapChildren(candy0, airHead);
				candy1.gotoAndStop(Utils.random(0, 6));
				handleScore();
			}
		}

		if (candy0.scale.x > 0) {
			candy0.y += cy0 * 0.04;
			candy0.x += cx0 * 0.005;
			candy0.scale.x = candy0.scale.y -= 0.032;
			if (candy0.currentFrame === 4 || candy0.currentFrame === 5) {
				candy0.rotation += 0.025;
			} else {
				candy0.rotation = 0;
			}
		} else {
			t.set(candy0, {pixi:{x:Utils.random(-400, stageW + 400), y:Utils.random(-4000, -200)}} );
			candy0.scale.x = candy0.scale.y = Utils.random(2, 4);
			candyBlur0.blur = 10;
			candy0.gotoAndStop(Utils.random(0, 6));
			candyHolder.swapChildren(candy0, airHead);
			//head.gotoAndStop(0);

		}

		if (candy1.scale.x > 0) {
			candy1.y += cy1 * 0.04;
			candy1.x += cx1 * 0.005;
			candy1.scale.x = candy1.scale.y -= 0.040;
			//candy1.rotation += 0.025;
			if (candy1.currentFrame === 4 || candy1.currentFrame === 5) {
				candy1.rotation += 0.025;
			} else {
				candy1.rotation = 0;
			}
		} else {
			t.set(candy1, {pixi:{x:Utils.random(-200, stageW + 200), y:Utils.random(500, 2000)}} );
			candy1.scale.x = candy1.scale.y = Utils.random(2, 4);
			candyBlur1.blur = 10;
			candy1.gotoAndStop(Utils.random(0, 6));
			candyHolder.swapChildren(candy1, airHead);
			//head.gotoAndStop(0);
		}

		if (candy0.scale.x < 0.45) {
			candyHolder.setChildIndex(candy0, 0);
			candyBlur0.blur += 1.5;
		}

		if (candy1.scale.x < 0.45) {
			candyHolder.setChildIndex(candy1, 0);
			candyBlur1.blur += 1.5;
		}

		if (candy0.scale.x < 0.35) {
			//candyBlur0.blur += 1.0;
		}

	}




	var bx, by;

	function handleBg() {
		mousePos = Utils.getMousePosition();
		//log('MOUSE X = ' + mousePos.x);
		//log('MOUSE Y = ' + mousePos.y);

		//bx = -(mousePos.x / 1.328);
		//by = -(mousePos.y / 1.6);

		//bgHolder.x = bx * 0.15;
		//bgHolder.y = by * 0.15;

		//bgHolder.scale.x = bgHolder.scale.y -= 0.0005;
		//bgHolder.x += 0.005;
		//bgHolder.y += 0.005;


		if (sky_bg.scale.x > 0.8) {
			sky_bg.scale.x = sky_bg.scale.y -= 0.0004;
		}

	}

	function handleTimer(delta) {
		gameTime -= (1 / Math.round(ticker.FPS));
		timerText.setText( Math.ceil(gameTime) );
		elapsedTime += (1 / Math.round(ticker.FPS));

		timerSectorLength = ((Math.PI / 180) * 360 / timerSectors) * elapsedTime;
		interfaceHolder.removeChild(timerIcon);
		timerIcon = new PIXI.Graphics();
		timerIcon.lineStyle(6, 0xFF3300, 1);
		timerIcon.arc(stageW - 80, stageH - 40, 10, 0 , timerSectorLength, false);
		interfaceHolder.addChild(timerIcon);

		if (Math.ceil(gameTime)  <= 0 ) {
			//ticker.stop();
			//handleGameOver(true);
		}
	}

	var speed = 20;
	var angle = 45;
	var dx, dy, ax, ay;
	var vx = 0;
	var vy = 0;
	var zx = 0, zy = 0;
	var easing = 1.0;
	var spring = 0.04;
	var friction = 0.85;
	var gravity = 2;
	var bodySpring = 2;
	var bodyFriction = 0.95;
	var flopRate =  4.5;  //4.625;
	var bodyFlopRate = 1.5;

	function handleAirHead() {
		mousePos = Utils.getMousePosition();
		//dx = (mousePos.x - airHead.x) * easing;

		if (mousePos.y > 0 && mousePos.y < stageH ) {
			dy = ((mousePos.y - 120 ) - (airHead.y)) * easing
		} else {
			if (mousePos.y < 0) {
				dy = ((0 - 120 ) - (airHead.y)) * easing;
			} else if( mousePos.y > stageH + 30 ) {
				dy = ((stageH - 120 ) - (airHead.y)) * easing;
			}
		}

		if (mousePos.x > 0 && mousePos.x < stageW ) {
			dx = (mousePos.x - airHead.x) * easing;
		} else {
			if (mousePos.x < 0) {
				dx = (0 - airHead.x) * easing;;
			} else if( mousePos.x > stageW ) {
				dx = (stageW - airHead.x) * easing;
			}
		}

		ax = dx * spring;
		ay = dy * spring;
		vx += ax;
		vy += ay;
		vx *= friction;
		vy *= friction;

		airHead.y += vy + 30;
		airHead.x += vx;

		head.rotation = (-dx / flopRate * (Math.PI / 180));
		airBody.rotation = (dx / 8.5 * (Math.PI / 180));

		rightLeg.rotation = (dx / 10.5 * (Math.PI / 180));

		//upperRightLeg.rotation = (dy / 10.5 * (Math.PI / 180));

		lowerRightLeg.rotation = (dx / 4.5 * (Math.PI / 180));

		leftLeg.rotation = (dx / 10.5 * (Math.PI / 180)) + 0.25;
		//upperLeftLeg.rotation = (dx / 8.5 * (Math.PI / 180));
		lowerLeftLeg.rotation = (dx / 4.5 * (Math.PI / 180));
		upperLeftArm.rotation = (dx / 10 * (Math.PI / 180));
		lowerLeftArm.rotation = (dx / 1.5 * (Math.PI / 180));
		upperRightArm.rotation = (dx / 10 * (Math.PI / 180));
		lowerRightArm.rotation = (dx / 2.5 * (Math.PI / 180));

		//log('HIT RECT WIDTH = ' + hitRect.width)


		//log('HIT RECT X: ' + hitRect.toGlobal(app.stage.position).x );
		//log('HIT RECT Y: ' + hitRect.toGlobal(app.stage.position).y );

	}

	function setUpGame() {

		initAudio();
		Howler.volume(0.02);

		airHead.on('pointerup', function() {
			head.play();
		});


		head.onComplete = function() {
			head.gotoAndStop(0);
		}

		ticker.start();
	}

	function buildStage() {

		app.stage.addChild(main);

		setUpGame();
	}

	function setPosition() {



		// -----------
		//  INTRO
		// -----------


		// -----------
		//  MAIN
		// -----------


			//bgHolder.pivot.set(stageW / 2 - bgHolder.width / 2, stageH / 2 - bgHolder.height / 2);

			sky_bg.anchor.set(0.5);
			sky_bg.scale.x = sky_bg.scale.y = 1.5;
			bgHolder.addChild(sky_bg);
			sky_bg.position.set(sky_bg.width / 2, sky_bg.height / 2)

			bgHolder.position.set(stageW / 2 - bgHolder.width / 2, stageH / 2 - bgHolder.height / 2);


			head.pivot.set(142, 368);
			head.position.set(0, 0);

			torso.pivot.set(32, 12);
			torso.position.set(0, 12);

			upperRightArm.pivot.set(30, 60);
			upperRightArm.position.set(-22, 70);

			upperLeftArm.pivot.set(5, 5);
			upperLeftArm.position.set(30, 14);

			lowerRightArm.pivot.set(40, 5);
			lowerRightArm.position.set(-44, 36);

			lowerRightArm.rotation = (0.0);

			lowerLeftArm.pivot.set(4, 2);
			lowerLeftArm.position.set(50, 32);

			pelvis.pivot.set(32, 1);
			pelvis.position.set(6, 75);

			upperRightLeg.pivot.set(14, 1);
			upperRightLeg.position.set(0, -9);

			upperLeftLeg.pivot.set(2, 6);
			upperLeftLeg.position.set(2, 1);

			lowerRightLeg.pivot.set(20, 5);
			lowerRightLeg.position.set(1, 22);

			lowerLeftLeg.pivot.set(14, 3);
			lowerLeftLeg.position.set(32, 26);

			leftArm.addChild(upperLeftArm);
			leftArm.addChild(lowerLeftArm);

			rightArm.addChild(upperRightArm);
			rightArm.addChild(lowerRightArm);

			leftLeg.addChild(upperLeftLeg);
			leftLeg.addChild(lowerLeftLeg);

			rightLeg.addChild(upperRightLeg);
			rightLeg.addChild(lowerRightLeg);

			//airBody.addChild(upperLeftArm);
			//airBody.addChild(lowerLeftArm);

			airBody.addChild(leftArm);

			airBody.addChild(pelvis)

			airBody.addChild(rightLeg);
			airBody.addChild(leftLeg);

			rightLeg.pivot.set(14, -10);
			rightLeg.position.set(0, 77);

			//leftLeg.pivot.set(2, 6);
			leftLeg.pivot.set(0, 10);
			leftLeg.position.set(8, 74);

			leftLeg.rotation = 0.5;

			//airBody.addChild(upperRightArm);
			//airBody.addChild(lowerRightArm);
			airBody.addChild(rightArm);
			airBody.addChild(torso);

			airHead.addChild(airBody);
			airHead.addChild(head);
			airHead.addChild(hitRect);

			hitRect.position.set(-100, -150);

			airHead.scale.set(0.75);
			airHead.position.set(stageW / 2, stageH / 2);

			airHead.interactive = true;
			airHead.buttonMode = true;

			candyHolder.addChild(airHead);

			candy0.anchor.set(0.5);
			candy1.anchor.set(0.5);
			candy2.anchor.set(0.5);
			candy3.anchor.set(0.5);
			candy4.anchor.set(0.5);
			candy5.anchor.set(0.5);
			candy6.anchor.set(0.5);

			candy0.filters = [candyBlur0, candyBrightness0];
			candy1.filters = [candyBlur1, candyBrightness1];
			candy2.filters = [candyBlur2];
			candy3.filters = [candyBlur3];
			candy4.filters = [candyBlur4];
			candy5.filters = [candyBlur5];
			candy6.filters = [candyBlur6];


			candyHolder.addChild(candy0);
			candyHolder.addChild(candy1);
			candyHolder.addChild(candy2);
			candyHolder.addChild(candy3);
			candyHolder.addChild(candy4);
			candyHolder.addChild(candy5);
			candyHolder.addChild(candy6);

			candies = [candy0, candy1, candy2, candy3, candy4, candy5, candy6];



			//candies = [candy0, candy1];

			for ( var i = 0; i < candies.length; i++ ) {
				candies[i].scale.x = candies[i].scale.y = Utils.random(2, 3);
				t.set(candies[i], {pixi:{x:Utils.random(0, stageW), y:Utils.random(-2000, -200)}} );
				//log( candies[i].filters );
				candyFilters.push(candies[i].filters);

			}


			scoreText.position.set(76, stageH - scoreText.height - 26);
			scoreIcon.anchor.set(0.5);
			scoreIcon.scale.set(0.8);
			scoreIcon.position.set(42, stageH - ((scoreIcon.height / 2) + 20));

			timerText.position.set(stageW - timerText.width - 20, stageH - timerText.height - 26);

			heart1.position.set(0, 0);
			heart2.position.set(40, 0);
			heart3.position.set(80, 0);

			heartHolder.addChild(heart1);
			heartHolder.addChild(heart2);
			heartHolder.addChild(heart3);
			heartHolder.position.set(30, 20);

			interfaceHolder.addChild(heartHolder);
			interfaceHolder.addChild(timerBg);
			interfaceHolder.addChild(timerIcon);
			interfaceHolder.addChild(timerText);
			interfaceHolder.addChild(scoreIcon);
			interfaceHolder.addChild(scoreText);


			main.addChild(bgHolder);
			//main.addChild(airHead);

			main.addChild(candyHolder);
			main.addChild(interfaceHolder);


		// -----------
		//  END FRAME
		// -----------


		buildStage();
	}


	function setUp() {
		log('setUp');

		// -----------
		//  INTRO
		// -----------


		// -----------
		//  MAIN
		// -----------

			candyBlur0 = new PIXI.filters.BlurFilter();
			candyBlur1 = new PIXI.filters.BlurFilter();
			candyBlur2 = new PIXI.filters.BlurFilter();
			candyBlur3 = new PIXI.filters.BlurFilter();
			candyBlur4 = new PIXI.filters.BlurFilter();
			candyBlur5 = new PIXI.filters.BlurFilter();
			candyBlur6 = new PIXI.filters.BlurFilter();
			candyBlur7 = new PIXI.filters.BlurFilter();

			candyBrightness0 = new PIXI.filters.ColorMatrixFilter();
			candyBrightness0.brightness(0.5);

			candyBrightness1 = new PIXI.filters.ColorMatrixFilter();
			candyBrightness1.brightness(0.5);

			candyBlur0.blur = candyBlur1.blur = candyBlur2.blur = candyBlur3.blur = candyBlur4.blur = candyBlur5.blur = candyBlur6.blur = candyBlur7.blur = 10;


			main = new PIXI.Container();
			bgHolder = new PIXI.Container();
			interfaceHolder = new PIXI.Container();

			bgHolder.width = 1700;
			bgHolder.height = 800;

			sky_bg = new PIXI.Sprite(resources['sky_bg_test.jpg'].texture);

			// - interface
			// -- score
			scoreText 	= new PIXI.Text('0');
			scoreIcon 	= new PIXI.Sprite(resources['candy_00.png'].texture);
			scoreText.style = Text.interfaceTextStyle;

			// -- Timer
			timerSectors 	= 30;
			timerSectorLength = ((Math.PI / 180) * 360/ timerSectors) * 15;
			beginAngle 	= 0 / timerSectors * Math.PI * 2;

			timerText			= new PIXI.Text('00');
			timerBg 			= new PIXI.Graphics();
			timerIcon 			= new PIXI.Graphics();
			timerText.style 	= Text.interfaceTextStyle;

			timerBg.lineStyle(6, 0xFFFFFF, 1);
			timerIcon.lineStyle(6, 0xFF3300, 1);

			timerBg.arc(stageW - 80, stageH - 40, 10, (Math.PI / 180) * 0 , (Math.PI / 180) * 360, false);
			timerIcon.arc(stageW - 80, stageH - 40, 10, (Math.PI / 180) * 0 , (Math.PI / 180) * 180, false);

			// -- Hearts
			heartHolder = new PIXI.Container();
			heart1 		= new PIXI.Sprite(resources['heart.png'].texture);
			heart2 		= new PIXI.Sprite(resources['heart.png'].texture);
			heart3 		= new PIXI.Sprite(resources['heart.png'].texture);

			// - AIRHEAD
			airHead = new PIXI.Container();

			headTextures = [resources['ah_head_00.png'].texture, resources['ah_head_01.png'].texture, resources['ah_head_01.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_02.png'].texture, resources['ah_head_01.png'].texture, resources['ah_head_01.png'].texture, resources['ah_head_01.png'].texture];

			// -- Head
			head = new PIXI.extras.AnimatedSprite(headTextures);
			head.loop = false;
			head.animationSpeed = 0.7;

			hitRect = new PIXI.Graphics();
			hitRect.beginFill(0xFF3300);
			hitRect.drawRect(0, 0, 200, 100);
			hitRect.endFill();
			hitRect.alpha = 0.0;
			hitRect.interactive = true;
			hitRect.buttonMode = true;
			hitRect.hitArea = new PIXI.Rectangle(0, 0, 200, 100);

			// -- Body
			airBody = new PIXI.Container();

			leftLeg = new PIXI.Container();
			rightLeg = new PIXI.Container();
			leftArm = new PIXI.Container();
			rightArm = new PIXI.Container();

			torso = new PIXI.Sprite(resources['ah_torso.png'].texture);
			pelvis = new PIXI.Sprite(resources['ah_pelvis.png'].texture);

			lowerLeftLeg = new PIXI.Sprite(resources['ah_lowerLeftLeg.png'].texture);
			lowerRightLeg = new PIXI.Sprite(resources['ah_lowerRightLeg.png'].texture);

			upperLeftLeg = new PIXI.Sprite(resources['ah_upperLeftLeg.png'].texture);
			upperRightLeg = new PIXI.Sprite(resources['ah_upperRightLeg.png'].texture);

			lowerRightArm = new PIXI.Sprite(resources['ah_lowerRightArm.png'].texture);
			lowerLeftArm = new PIXI.Sprite(resources['ah_lowerLeftArm.png'].texture);

			upperRightArm = new PIXI.Sprite(resources['ah_upperRightArm.png'].texture);
			upperLeftArm = new PIXI.Sprite(resources['ah_upperLeftArm.png'].texture);

			// - Candy
			candyHolder 	= new PIXI.Container();

			candyTextures = [resources['candy_01.png'].texture, resources['candy_02.png'].texture, resources['candy_03.png'].texture, resources['candy_04.png'].texture, resources['candy_05.png'].texture, resources['candy_06.png'].texture];


			candy0 = new PIXI.extras.AnimatedSprite(candyTextures);
			candy1 = new PIXI.extras.AnimatedSprite(candyTextures);
			candy0.gotoAndStop(Utils.random(0, 6));
			candy1.gotoAndStop(Utils.random(0, 6));


			//candy0 			= new PIXI.Sprite(resources['candy_01.png'].texture);
			//candy1 			= new PIXI.Sprite(resources['candy_06.png'].texture);
			candy2 			= new PIXI.Sprite(resources['candy_02.png'].texture);
			candy3 			= new PIXI.Sprite(resources['candy_03.png'].texture);
			candy4 			= new PIXI.Sprite(resources['candy_04.png'].texture);
			candy5 			= new PIXI.Sprite(resources['candy_05.png'].texture);
			candy6 			= new PIXI.Sprite(resources['candy_06.png'].texture);


		// -----------
		//  END FRAME
		// -----------

		setPosition();
	}


	function loadProgressHandler() {
		loadingText.setText( 'LOADING ' + Math.round(loader.progress) + '%');
	}

	loader.add([
		'sky_bg_test.jpg',
		'sky_bg.jpg',
		'heart.png',

		'candy_00.png',
		'candy_01.png',
		'candy_02.png',
		'candy_03.png',
		'candy_04.png',
		'candy_05.png',
		'candy_06.png',

		'ah_head_00.png',
		'ah_head_01.png',
		'ah_head_02.png',
		'ah_lowerLeftArm.png',
		'ah_lowerLeftLeg.png',
		'ah_lowerRightArm.png',
		'ah_lowerRightLeg.png',
		'ah_pelvis.png',
		'ah_torso.png',
		'ah_upperLeftArm.png',
		'ah_upperLeftLeg.png',
		'ah_upperRightArm.png',
		'ah_upperRightLeg.png',




	]).on('progress', loadProgressHandler).load(setUp);


	ticker.add( function(delta){
		handleBg(delta);
		handleAirHead(delta);
		handleCandy(delta);
		handleTimer(delta);
	});



	initStage();


}


































//