$(document).ready(function(){
	setTimeout( function() { init(); }, 500);
});
function init() {

	var log = console.log;
	//log('init');

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

	Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
	};

	Text = (function() {
		var interfaceTextStyle = new PIXI.TextStyle({
			align : 'center',
			fontFamily: 'uniform_roundedbold, Arial',
			fontSize: '28px',
			letterSpacing: 1,
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
	var ctaBg, ctaText, ctaHolder, overlay, ahLogo, logoTextures, instructionText, gaLogo, gaGet, gaAirheaded, gaBg, gaCandy1, gaCandy2, gaCandy3, gaCandy4, intro;
	//MAIN
	var main, bgHolder, candyHolder, fgHolder, airheadHolder, hitRect, stageHit;
	var sky_bg;
	var candy0, candy1, candy2, candy3, candy4, candy5, candy6;
	var candyBlur0, candyBlur1, candyBlur2, candyBlur3, candyBlur4, candyBlur5, candyBlur6;
	var candyBrightness1, candyBrightness2;
	var enemy, enemyTextures;
	var enemyBlur, enemyBrightness;
	var catBlur, catBrightness;
	var airHead, airBody, lowerLeftArm, lowerRightArm, upperLeftArm, upperRightArm, lowerLeftLeg, lowerRightLeg, upperLeftLeg, upperRightLeg, torso, head, pelvis, headTextures;
	var candyTextures;
	var candies = [];
	var candyBlur;
	var candyFilters = [];
	//ENDFRAME
	var endFrame, overlayEnd, endCtaBg1, endCtaBg2, endCtaHolder1, endCtaHolder2, endCtaText1, endCtaText2, ahLogoEnd, yourScoreText, endSubhead;
	var gaLogoEnd, gaGetEnd, gaAirheadedEnd, gaBgEnd, gaCandy1End, gaCandy2End, gaCandy3End, gaCandy4End;
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
	missRate 			= 0,
	minCandyScale = 2,
	maxCandyScale = 4,
	maxEnemyScale = 5,
	candyScaleRate = 0.040,
	enemyScaleRate = 0.035,
	enemyMoveRate = 0.04,
	enemyEmitRate = 2,
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
		var hitTest = function(r1, r2) {
			var hit, combinedHalfWidths ,combinedHalfHeights, vx, vy;
			hit = false;
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
		var enemyTest = function(r1, r2) {
			var hit, combinedHalfWidths ,combinedHalfHeights, vx, vy;
			hit = false;
			r1.centerX = r1.toGlobal(app.stage.position).x + r1.width / 2;
			r1.centerY = r1.toGlobal(app.stage.position).y + r1.height / 2;
			r2.centerX = (r2.toGlobal(app.stage.position).x - 75) + r2.width / 2;
			r2.centerY = (r2.toGlobal(app.stage.position).y ) + r2.width / 2;
			r1.halfWidth = r1.width / 2;
			r1.halfHeight = r1.height / 2;
			r2.halfWidth = r2.width / 4;
			r2.halfHeight = r2.height / 2;
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
				enemyTest : enemyTest,
				getMousePosition : getMousePosition
		}
	}());

	var isMobile = (function () {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	})();

	function initAudio() {
		bgSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/bg-sound.mp3'],
			volume: 0.5,
			loop: true,
		});
		flapSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/jump-sound.mp3'],
			volume: 0.5
		});
		buttonSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/button-sound.mp3'],
			volume: 0.5
		});
		eatSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/eat-sound.mp3'],
			volume: 0.5
		});
		loseSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/lose-sound.mp3'],
			volume: 0.5
		});
		winSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/win-sound.mp3'],
			volume: 0.5
		});
		overSound = new Howl({
			src : ['https://c1.undertonevideo.com/clients/Airheads/sounds/over-sound.mp3'],
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
			$(game).css({width:1280, height:500});
			app = new Application({width : 1280, height : 500, legacy : true});
		} else if (_width < 1280 && _width >= 768 ) {
			screenSize = 'tablet';
			$(game).css({width:'100%', height:500});
			app = new Application({width : _width, height : 500, forceCanvas : true});
		} else if ( _width < 768 ) {

			screenSize = 'mobile';
			$(game).css({width:'100%', height:'100%'});
			app = new Application({width : _width, height : _height, forceCanvas : true});
			minCandyScale = 2;
			maxCandyScale = 3;
			maxEnemyScale = 2.5;
			candyScaleRate = 0.035;
			enemyScaleRate = 0.020;
			enemyMoveRate = 0.045;
			enemyEmitRate = 6;
			if (_height < 500) {
				screenHeight = 'small';
			} else {
				screenHeight = 'normal';
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

	function setUpReplay() {
		//log('SET REPLAY');
		buttonSound.play();
		endCtaHolder1.off('pointerup');
		if (playing === false) {
			score = 0;
			scoreText.setText(score);
			lives = 3;
			ahLogoEnd.gotoAndStop(0);
			gameTime 			= 30;
			elapsedTime 		= 0;
			bottomHits 			= 0;
			clickCount			= 0;
			catTime				= 0;
			resetCandyPos0();
			resetCandyPos1();
			resetCandyPos2();
			resetCandyPos3();
			resetEnemy();
			t.set([heart1, heart2, heart3], {pixi:{alpha:1}});
			mainBlur.blur = 0.0;
			endFrame.position.set(0, stageH);
			setTimeout( function() { bgSound.play(); }, 500);
			t.to(bgSound, 0.5, {voluem:0.5});
			playing = true;
			ticker.start();
		}
	}

	function handleGameOver( won ) {

		playing = false;

		if (won === true ) {
			//log('you win');
			t.to(bgSound, 0.5, {voluem:0, onComplete:function() {
				setTimeout( function() { winSound.play(); }, 300);
				bgSound.stop();
			} });
			endSubhead.setText(' Great job! ' );
		} else {
			//log('You Lost');
			t.to(bgSound, 0.5, {voluem:0, onComplete:function() {
				setTimeout( function() { overSound.play(); }, 300);
				bgSound.stop();
			} });
			endSubhead.setText(' Nice Try! ' );
		}

		yourScoreText.setText(' Your score: ' + score + ' ');

		if (screenSize === 'desktop') {
			yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, 168);
		} else if ( screenSize === 'tablet' ) {
			yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height );
		} else if ( screenSize === 'mobile') {
			yourScoreText.position.set(stageW / 2 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height * 2 );
		}

		tlGameOver.add('begin')
		.to(main, 				0.3, {pixi:{blurX:10.0, blurY:10.0}}, '+=1.0')
		.from(overlayEnd, 		0.4, {pixi:{y:'-=400', alpha:0}, ease:Power3.easeOut})
		.from(gaGetEnd, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut})
		.from(gaAirheadedEnd, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(gaBgEnd, 		0.2, {pixi:{scale:0,   alpha:0}, ease:Power3.easeOut}, '-=0.7')
		.from(gaCandy4End, 	0.6, {pixi:{scale:0.5, alpha:0}, ease:Elastic.easeOut}, '-=0.6')
		.from(gaCandy1End, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(gaCandy2End, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(gaCandy3End, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(yourScoreText, 	0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(endSubhead, 		0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(ahLogoEnd, 		0.6, {pixi:{scale:0.7, alpha:0}, ease:Power3.easeOut}, '+=0.1')
		.addCallback(function() { ahLogoEnd.play(); }, '-=0.65')
		.from(endCtaHolder1, 	0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.from(endCtaHolder2, 	0.6, {pixi:{y:'+=40',  alpha:0}, ease:Elastic.easeOut}, '-=0.55')
		.addCallback(function() { setUpEndCta(); })
		.add('end');

		function setUpEndCta() {

			endCtaHolder1.on('mouseover', function(e){
				t.to(endCtaBg1, 0.6, {pixi:{scale:1.2}, ease:Elastic.easeOut});
				t.to(endCtaText1, 0.2, {pixi:{y:'+=10', alpha:0}, ease:Power3.easeOut});
				t.set(endCtaText1, {pixi:{y:'-=30'}, delay:0.2})
				t.to(endCtaText1, 0.6, {pixi:{y:'+=20', alpha:1, scale:1.1}, ease:Elastic.easeOut, delay:0.20});
			}).on('mouseout', function(e){
				t.to(endCtaBg1, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
				t.to(endCtaText1, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
			}).on('pointerup', setUpReplay);

			endCtaHolder2.on('mouseover', function(e){
				t.to(endCtaBg2, 0.6, {pixi:{scale:1.2}, ease:Elastic.easeOut});
				t.to(endCtaText2, 0.2, {pixi:{y:'+=10', alpha:0}, ease:Power3.easeOut});
				t.set(endCtaText2, {pixi:{y:'-=30'}, delay:0.2})
				t.to(endCtaText2, 0.6, {pixi:{y:'+=20', alpha:1, scale:1.1}, ease:Elastic.easeOut, delay:0.20});
			}).on('mouseout', function(e){
				t.to(endCtaBg2, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
				t.to(endCtaText2, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
			});
		}

		endFrame.position.set(0, 0);
		tlGameOver.play();

	}

	function handleDeath() {

		loseSound.play();
		ticker.stop();

		t.set(airHead, {pixi:{y:-200, x:stageW / 2 - airHead.width / 2}});
		t.to(airHead, {pixi:{y:stageH / 2 + 200, x:stageW / 2}});

		if (lives === 3 ) {
			t.to(heart1, 0.05, {pixi:{alpha:0}, ease:Power3.easeOut, yoyo:true, repeat:4});
			lives = 2;
			setTimeout( function() {
				ticker.start();
				t.to(airHead, 0.1, {pixi:{alpha:0.1}, ease:Power0.easeNone, yoyo:true, repeat:11, delay:0.0});
			}, 500);
		} else if ( lives === 2) {
			t.to(heart2, 0.05, {pixi:{alpha:0}, ease:Power3.easeOut, yoyo:true, repeat:4});
			lives = 1;
			setTimeout( function() {
				ticker.start();
				t.to(airHead, 0.1, {pixi:{alpha:0.1}, ease:Power0.easeNone, yoyo:true, repeat:11, delay:0.0});
				}, 500);
		} else if ( lives === 1 ) {
			t.to(heart3, 0.05, {pixi:{alpha:0}, ease:Power3.easeOut, yoyo:true, repeat:4});
			lives = 0;
			handleGameOver(false);
		}
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

	function resetEnemy() {
		t.set(enemy, {pixi:{x:Utils.random(-1200, stageW + 1200), y:Utils.random(stageH + 800, stageH + 3500)}} );
		enemy.scale.x = enemy.scale.y = maxEnemyScale;
		enemyBlur.blur = 10;
		candyHolder.setChildIndex(enemy, candyHolder.length - 1);
		enemyTime = 0;
		enemy.gotoAndStop(Utils.random(0, 4));
	}

	var enemyCm = 0.5, eyt, ext;
	var enemyTime = 0;
	function handleEnemy() {
		//log(elapsedTime);
		eyt = stageH / 2 - enemy.y;
		ext = stageW / 2 - enemy.x;
		enemyBlur.blur = enemy.scale.x * 1;
		enemyCm = Math.cos(enemy.scale.x / 2.5)
		enemyBrightness.brightness(enemyCm);
		enemyTime += (1 / Math.round(ticker.FPS));
		if (enemy.scale.x < 0.6) {
			candyHolder.setChildIndex(enemy, 0);
			enemyBlur.blur += 1.5;
		}
		if (enemy.scale.x < 0.50 && enemy.scale.x > 0.47 ) {
			if (Utils.enemyTest(enemy, airHead)) {
				//log('ENEMY COLLISION');
				handleDeath();
				resetEnemy();
				missRate = 5;
				enemyTime = 0;
				//missRate = 0;
				//handleScore();
			}
		}
		if (enemyTime > enemyEmitRate) {
			if (enemy.scale.x > 0) {
				//cat.y += cyt * 0.04;
				//cat.x += cxt * 0.005;
				enemy.y += eyt * enemyMoveRate;
				enemy.x += ext * enemyMoveRate;
				enemy.scale.x = enemy.scale.y -= enemyScaleRate;
				//cat.rotation -= 0.025;
			} else {
				// RESET ENEMY
				resetEnemy();
				//cat.scale.x = cat.scale.y = 0;
				//cat.y = cat.x = -3000;
			}
		}
	}

	var cx0, cy0, cx1, cy1, cx2, cy2, cx3, cy3, blurAmount, cnt = 0;
	var vpX, vpY, fl = 250, xPos, yPos, zPos, scale;
	var cbcm0 = 0.5, cbcm1 = 0.5, cbcm2 = 0.5, cbcm3 = 0.5;

	function resetCandyPos0() {
		//t.set(candy0, {pixi:{x:Utils.random(-200, stageW / 2), y:Utils.random(-100, -4000) }} );
		t.set(candy0, {pixi:{x:Utils.random(-200, stageW / 2), y:Utils.random(-100, -3000) }} );
		candy0.scale.x = candy0.scale.y = Utils.random(minCandyScale, maxCandyScale);
		candyBlur0.blur = 10;
		candy0.gotoAndStop(Utils.random(0, 6));
		//candyHolder.setChildIndex(candy0, candyHolder.length - 1);
	}

	function resetCandyPos1() {
		t.set(candy1, {pixi:{x:Utils.random(stageW / 2, -200), y:Utils.random(stageH + 100, stageH + 2500) }} );
		//t.set(candy1, {pixi:{x:Utils.random(-200, stageW / 2), y:Utils.random(stageH + 100, stageH + 3500) }} );
		candy1.scale.x = candy1.scale.y = Utils.random(minCandyScale, maxCandyScale);
		candyBlur1.blur = 10;
		candy1.gotoAndStop(Utils.random(0, 6));
		//candyHolder.setChildIndex(candy1, candyHolder.length - 1);
	}

	function resetCandyPos2() {
		//t.set(candy2, {pixi:{x:Utils.random(stageW / 2, stageW), y:Utils.random(-100,  -4000) }} );
		t.set(candy2, {pixi:{x:Utils.random(stageW / 2, stageW + 200), y:Utils.random(-100, -3000)}} );
		candy2.scale.x = candy2.scale.y = Utils.random(minCandyScale, maxCandyScale);
		candyBlur2.blur = 10;
		candy2.gotoAndStop(Utils.random(0, 6));
		//candyHolder.setChildIndex(candy2, candyHolder.length - 1);
	}

	function resetCandyPos3() {
		t.set(candy3, {pixi:{x:Utils.random(stageW / 2, stageW + 200), y:Utils.random(stageH + 100, stageH + 2500)}});
		//t.set(candy3, {pixi:{x:Utils.random(stageW / 2, stageW), y:Utils.random(stageH + 100, stageH + 3500) }} );
		candy3.scale.x = candy3.scale.y = Utils.random(minCandyScale, maxCandyScale);
		candyBlur3.blur = 10;
		candy3.gotoAndStop(Utils.random(0, 6));
		//candyHolder.setChildIndex(candy3, candyHolder.length - 1);
	}

	var candyTime = 0;
	function handleCandy(delta) {
		//log(candy0.scale.x);
		candyTime += (1 / Math.round(ticker.FPS));
		cy0 = stageH / 2 - candy0.y;
		cx0 = stageW / 2 - candy0.x;
		cy1 = stageH / 2 - candy1.y;
		cx1 = stageW / 2 - candy1.x;
		cy2 = stageH / 2 - candy2.y;
		cx2 = stageW / 2 - candy2.x;
		//cx2 = (stageW / 2 + stageW / 4) - candy2.x;
		cy3 = stageH / 2 - candy3.y;
		cx3 = stageW / 2 - candy3.x;
		//cx3 = (stageW / 2 + stageW / 4) - candy3.x;
		for (var i = 0; i < candies.length; i++) {
			//log( candies[i].scale.x );
		}
		candyBlur0.blur = candy0.scale.x * 1.5;
		candyBlur1.blur = candy1.scale.x * 1.5;
		candyBlur2.blur = candy2.scale.x * 1.5;
		candyBlur3.blur = candy3.scale.x * 1.5;
		cbcm0 = Math.cos(candy0.scale.x / 2.0)
		candyBrightness0.brightness(cbcm0);
		cbcm1 = Math.cos(candy1.scale.x / 2.5)
		candyBrightness1.brightness(cbcm1);
		if (candy0.scale.x < 0.60 && candy0.scale.x > 0.35 ) {
			if (Utils.hitTest(candy0, hitRect)) {
				//log('CANDY COLLISION');
				resetCandyPos0();
				missRate = 0;
				handleScore();
			}
		}
		if (candy1.scale.x < 0.60 && candy1.scale.x > 0.35 ) {
			if (Utils.hitTest(candy1, hitRect)) {
				//log('CANDY COLLISION');
				resetCandyPos1();
				missRate = 0;
				handleScore();
			}
		}
		if (candy2.scale.x < 0.60 && candy2.scale.x > 0.35 ) {
			if (Utils.hitTest(candy2, hitRect)) {
				//log('CANDY COLLISION');
				resetCandyPos2();
				missRate = 0;
				handleScore();
			}
		}
		if (candy3.scale.x < 0.60 && candy3.scale.x > 0.35 ) {
			if (Utils.hitTest(candy3, hitRect)) {
				//log('CANDY COLLISION');
				resetCandyPos3();
				missRate = 0;
				handleScore();
			}
		}
		if (candy0.scale.x > 0) {
			candy0.y += cy0 * 0.04;
			candy0.x += cx0 * 0.005;
			candy0.scale.x = candy0.scale.y -= candyScaleRate;
			if (candy0.currentFrame === 4 || candy0.currentFrame === 5) {
				candy0.rotation += 0.025;
			} else {
				candy0.rotation = 0;
			}
		} else {
			resetCandyPos0();
			candyHolder.swapChildren(candy0, airHead);
			missRate += 1;
		}
		if (candyTime > 2) {
			if (candy1.scale.x > 0) {
				candy1.y += cy1 * 0.04;
				candy1.x += cx1 * 0.005;
				candy1.scale.x = candy1.scale.y -= candyScaleRate;
				if (candy1.currentFrame === 4 || candy1.currentFrame === 5) {
					candy1.rotation += 0.025;
				} else {
					candy1.rotation = 0;
				}
			} else {
				resetCandyPos1();
				candyHolder.swapChildren(candy1, airHead);
				missRate += 1;
			}
		}
		if (candyTime > 6) {
			if (candy2.scale.x > 0) {
				candy2.y += cy2 * 0.04;
				candy2.x += cx2 * 0.005;
				candy2.scale.x = candy2.scale.y -= candyScaleRate;
				if (candy2.currentFrame === 4 || candy2.currentFrame === 5) {
					candy2.rotation += 0.025;
				} else {
					candy2.rotation = 0;
				}
			} else {
				resetCandyPos2();
				candyHolder.swapChildren(candy2, airHead);
				missRate += 1;
			}
		}
		if (candyTime > 4) {
			if (candy3.scale.x > 0) {
				candy3.y += cy3 * 0.04;
				candy3.x += cx3 * 0.005;
				candy3.scale.x = candy3.scale.y -= candyScaleRate;
				if (candy3.currentFrame === 4 || candy3.currentFrame === 5) {
					candy3.rotation += 0.025;
				} else {
					candy3.rotation = 0;
				}
			} else {
				resetCandyPos3();
				candyHolder.swapChildren(candy3, airHead);
				missRate += 1;
			}
		}
		if (candy0.scale.x < 0.45) {
			candyHolder.setChildIndex(candy0, 0);
			candyBlur0.blur += 1.5;
		}
		if (candy1.scale.x < 0.45) {
			candyHolder.setChildIndex(candy1, 0);
			candyBlur1.blur += 1.5;
		}
		if (candy2.scale.x < 0.45) {
			candyHolder.setChildIndex(candy2, 0);
			candyBlur2.blur += 1.5;
		}
		if (candy3.scale.x < 0.45) {
			candyHolder.setChildIndex(candy3, 0);
			candyBlur3.blur += 1.5;
		}
	}

	var bx, by;
	function handleBg() {
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
			ticker.stop();
			handleGameOver(true);
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
	var ex = 300, ey = 300;

	function handleAirHead() {
		if (missRate > 5) {
			head.gotoAndStop(0);
		}
		if(!isMobile) {
			mousePos = Utils.getMousePosition();
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
			lowerRightLeg.rotation = (dx / 4.5 * (Math.PI / 180));
			leftLeg.rotation = (dx / 10.5 * (Math.PI / 180)) + 0.25;
			lowerLeftLeg.rotation = (dx / 4.5 * (Math.PI / 180));
			upperLeftArm.rotation = (dx / 10 * (Math.PI / 180));
			lowerLeftArm.rotation = (dx / 1.5 * (Math.PI / 180));
			upperRightArm.rotation = (dx / 10 * (Math.PI / 180));
			lowerRightArm.rotation = (dx / 2.5 * (Math.PI / 180));
		} else {
			stageHit.on('pointermove', handleTouch);

			head.rotation = (-dx / 4 * (Math.PI / 180));
			airBody.rotation = (dx / 8 * (Math.PI / 180));
			rightLeg.rotation = (dx / 5.5 * (Math.PI / 180));
			lowerRightLeg.rotation = (dx / 2.5 * (Math.PI / 180));
			leftLeg.rotation = (dx / 5.5 * (Math.PI / 180)) + 0.25;
			lowerLeftLeg.rotation = (dx / 2.5 * (Math.PI / 180));
			upperLeftArm.rotation = (dx / 5 * (Math.PI / 180));
			lowerLeftArm.rotation = (dx / 1.5 * (Math.PI / 180));
			upperRightArm.rotation = (dx / 5 * (Math.PI / 180));
			lowerRightArm.rotation = (dx / 2.5 * (Math.PI / 180));
			airHead.y += vy + 10;
			airHead.x += vx;
		}
	}

	var mSpring = 0.03;
	function handleTap(e) {
		ex = e.data.global.x;
		ey = e.data.global.y;
		vx = (ex - airHead.x) * easing;
		vy = (ey - airHead.y) * easing;
	}

	function handleTouch(e) {
		ex = e.data.global.x;
		ey = e.data.global.y;
		dx = (ex - airHead.x) * easing;
		dy = ((ey - 120 ) - (airHead.y)) * easing;
		ax = dx * mSpring;
		ay = dy * mSpring;
		vx += ax;
		vy += ay;
		vx *= friction;
		vy *= friction;
	}

	function setUpGame() {
		initAudio();
		//Howler.volume(0.5);
		head.onComplete = function() {
			head.gotoAndStop(0);
		}
		tlOutro.add('begin')
		.to(main, 				0.6, {pixi:{blurX:0.0, blurY:0.0}, ease:Power2.easeOut})
		.to(gaLogo, 			0.4, {pixi:{y:'-=100', alpha:0.0}, ease:Power3.easeOut}, '-=0.55')
		.to(gaLogo.children, 	0.4, {pixi:{scale:0.5, alpha:0.0}, ease:Power2.easeOut}, '-=0.55')
		.to(ctaHolder, 			0.4, {pixi:{y:'+=100', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(instructionText, 	0.4, {pixi:{x:'+=300', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(overlay, 			0.4, {pixi:{x:'+=300', alpha:0.0}, ease:Power3.easeOut}, '-=0.40')
		.to(ahLogo, 			0.4, {pixi:{x:'+=300', alpha:0.0,  scale:0}, ease:Power3.easeOut}, '-=0.40')
		.addCallback(destroyIntro)
		.add('end');
		function destroyIntro() {
			intro.alpha = 0.0;
			intro.destroy();
			playing = true;
			ticker.start();
			bgSound.play();
			Howler.volume(0.01);
		}
		tlOutro.play();
	}

	function buildStage() {
		tlIntro.add('begin')
		.from(main, 		0.5, {pixi:{alpha:0}}, '+=1.0')
		.from(overlay, 		0.7, {pixi:{x:'+=40', alpha:0}, ease:Elastic.easeOut}, '-=0.0')
		.from(instructionText, 0.4, {pixi:{y:'+=40', alpha:0},ease:Elastic.easeOut}, '-=0.6')
		.from(gaGet, 	0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut})
		.from(gaCandy4, 	0.6, {pixi:{scale:0.5, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(gaCandy3, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.75')
		.from(gaAirheaded, 		0.8, {pixi:{scale:0.3, alpha:0}, ease:Elastic.easeOut}, '-=0.7')
		.from(gaCandy2, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.75')
		.from(gaBg, 		0.2, {pixi:{scale:0, alpha:0}, ease:Power3.easeOut}, '-=0.7')
		.from(gaCandy1, 	0.6, {pixi:{scale:1.2, alpha:0}, ease:Elastic.easeOut}, '-=0.75')
		.from(ahLogo, 		0.8, {pixi:{scale:0.7, alpha:0}, ease:Power3.easeOut}, '-=0.2')
		.addCallback(function() { ahLogo.play() }, '-=0.85')
		.from(ctaHolder, 	0.6, {pixi:{y:'+=40', alpha:0, scale:0.5}, ease:Elastic.easeOut}, '-=0.6')
		.add('end');
		app.stage.addChild(main);
		app.stage.addChild(intro);
		app.stage.addChild(endFrame);
		endFrame.position.set(0, stageH);
		var debugText = new PIXI.Text();
		debugText.position.set(10, 10)
		app.stage.addChild(debugText);
		ctaHolder.on('mouseover', function(e){
			t.to(ctaBg, 0.6, {pixi:{scale:1.2}, ease:Elastic.easeOut});
			t.to(ctaText, 0.2, {pixi:{y:'+=10', alpha:0}, ease:Power3.easeOut});
			t.set(ctaText, {pixi:{y:'-=30'}, delay:0.2})
			t.to(ctaText, 0.6, {pixi:{y:'+=20', alpha:1, scale:1.1}, ease:Elastic.easeOut, delay:0.21});
			t.to(ctaText, 0.1, {pixi:{y:0}, delay:0.25});
		}).on('mouseout', function(e){
			t.to(ctaBg, 0.6, {pixi:{scale:1.0}, ease:Elastic.easeOut});
			t.to(ctaText, 0.6, {pixi:{scale:1.0, y:0}, ease:Elastic.easeOut});
		});
		ctaHolder.on('pointerup', setUpGame);
		tlIntro.play();
		//setUpGame();
	}

	function setPosition() {
		main.filters = [mainBlur];
		// -----------
		//  INTRO
		// -----------
		gaGet.anchor.set(0.5)
		gaAirheaded.anchor.set(0.5)
		gaBg.anchor.set(0.5)
		gaCandy1.anchor.set(0.5)
		gaCandy2.anchor.set(0.5)
		gaCandy3.anchor.set(0.5)
		gaCandy4.anchor.set(0.5)
		gaGet.position.set(gaGet.width / 2, gaGet.height / 2);
		gaAirheaded.position.set(gaAirheaded.width / 2, gaAirheaded.height / 2);
		gaBg.position.set(gaBg.width / 2, gaBg.height / 2);
		gaCandy1.position.set(gaBg.width / 2, gaBg.height / 2);
		gaCandy2.position.set(gaBg.width / 2, gaBg.height / 2);
		gaCandy3.position.set(gaBg.width / 2, gaBg.height / 2);
		gaCandy4.position.set(gaBg.width / 2, gaBg.height / 2);
		gaLogo.addChild(gaCandy4);
		gaLogo.addChild(gaBg);
		gaLogo.addChild(gaGet);
		gaLogo.addChild(gaAirheaded);
		gaLogo.addChild(gaCandy1);
		gaLogo.addChild(gaCandy2);
		gaLogo.addChild(gaCandy3);
		overlay.width  = 961  / 2;
		overlay.height = 1000 / 2;
		// - CTA
		ctaBg.anchor.set(0.5);
		ctaText.anchor.set(0.5);
		ctaHolder.interactive = true;
		ctaHolder.buttonMode = true;
		ctaHolder.addChild(ctaBg);
		ctaHolder.addChild(ctaText);
		// - Airheads Logo
		ahLogo.anchor.set(0.5);
		ahLogo.animationSpeed = 0.3;
		ahLogo.loop = false;
		if (screenSize === 'desktop') {
			overlay.position.set(stageW - overlay.width, 0);
			gaLogo.scale.x = gaLogo.scale.y = 0.75;
			gaLogo.position.set(stageW / 3 - gaLogo.width / 2, 50);
			ctaHolder.position.set( stageW / 3, stageH / 2 + 145);
			ahLogo.position.set(stageW - ahLogo.width / 2, 160);
			instructionText.position.set((overlay.x + overlay.width / 2) - instructionText.width / 2, stageH - instructionText.height - 60);
		} else if ( screenSize === 'tablet' ) {
			overlay.position.set( (stageW / 3) * 1.75, 0);
			gaLogo.scale.set(0.5);
			gaLogo.position.set(stageW / 3 - gaLogo.width / 2 - 30, 70);
			ctaHolder.position.set( stageW / 3, stageH / 2 + 160);
			ahLogo.scale.set(0.70);
			ahLogo.position.set(stageW - ahLogo.width / 2, 160);
			instructionText.style.fontSize = '20px';
			instructionText.style.letterSpacing = 1;
			instructionText.position.set( ((stageW - overlay.x) / 2 ) + overlay.x - instructionText.width / 2, stageH - instructionText.height - 60);
		} else if ( screenSize === 'mobile') {
			instructionText.setText(' Drag your finger.\nCatch some candy.\nIt’s that easy. ')
			if (screenHeight === 'small') {
				overlay.anchor.set(0.5);
				overlay.width = stageW;
				overlay.rotation = (Math.PI / 180) * 90;
				overlay.position.set(stageW - overlay.width / 2, stageH - 80);
				gaLogo.scale.set(0.3);
				gaLogo.position.set(stageW / 2 - gaLogo.width / 2 - 20, 60);
				ctaHolder.scale.set(0.6);
				ctaHolder.position.set( stageW / 2, stageH / 2 - ctaHolder.height / 2 );
				ahLogo.scale.set(0.5);
				ahLogo.position.set( stageW / 2, stageH / 2 + ahLogo.height / 2 - 20);
				instructionText.style.fontSize = '16px';
				instructionText.style.letterSpacing = 1;
				instructionText.position.set( stageW / 2 - instructionText.width / 2, stageH - instructionText.height - 20);
			} else {
				overlay.anchor.set(0.5);
				//overlay.width = stageW;
				overlay.rotation = (Math.PI / 180) * 90;
				overlay.width = stageW;
				overlay.position.set(stageW - overlay.width / 2, stageH - 80);
				overlay.scale.x = overlay.scale.y = stageW / 1000;
				gaLogo.scale.set(0.4);
				gaLogo.position.set(stageW / 2 - gaLogo.width / 2 - 20, 60);
				ctaHolder.scale.set(0.8);
				ctaHolder.position.set( stageW / 2, stageH / 2 - ctaHolder.height / 2);
				ahLogo.scale.set(0.60);
				ahLogo.position.set( stageW / 2, stageH / 2 + ahLogo.height / 2 );
				instructionText.style.fontSize = '20px';
				instructionText.style.letterSpacing = 1;
				instructionText.position.set( stageW / 2 - instructionText.width / 2, stageH - instructionText.height - 20);
			}
		}

		intro.addChild(overlay);
		intro.addChild(instructionText);
		intro.addChild(ahLogo);
		intro.addChild(ctaHolder);
		intro.addChild(gaLogo);
		// -----------
		//  MAIN
		// -----------
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
		airBody.addChild(leftArm);
		airBody.addChild(pelvis)
		airBody.addChild(rightLeg);
		airBody.addChild(leftLeg);
		rightLeg.pivot.set(14, -10);
		rightLeg.position.set(0, 77);
		leftLeg.pivot.set(0, 10);
		leftLeg.position.set(8, 74);
		leftLeg.rotation = 0.5;
		airBody.addChild(rightArm);
		airBody.addChild(torso);
		airHead.addChild(airBody);
		airHead.addChild(head);
		airHead.addChild(hitRect);
		hitRect.position.set(-100, -150);
		airHead.scale.set(0.75);
		airHead.position.set(stageW / 2, stageH / 2);
		candyHolder.addChild(airHead);
		candy0.anchor.set(0.5);
		candy1.anchor.set(0.5);
		candy2.anchor.set(0.5);
		candy3.anchor.set(0.5);
		enemy.anchor.set(0.5);
		candy0.filters = [candyBlur0, candyBrightness0];
		candy1.filters = [candyBlur1, candyBrightness1];
		candy2.filters = [candyBlur2, candyBrightness2];
		candy3.filters = [candyBlur3, candyBrightness3];
		enemy.filters = [enemyBlur, enemyBrightness];
		candyHolder.addChild(candy0);
		candyHolder.addChild(candy1);
		candyHolder.addChild(candy2);
		candyHolder.addChild(candy3);
		candyHolder.addChild(enemy);
		candies = [candy0, candy1, candy2, candy3];
		candy0.scale.x = candy0.scale.y = Utils.random(minCandyScale, maxCandyScale);
		t.set(candy0, {pixi:{x:Utils.random(-200, stageW / 2), y:Utils.random(-2000, -400)}} );
		candy1.scale.x = candy1.scale.y = Utils.random(minCandyScale, maxCandyScale);
		t.set(candy1, {pixi:{x:Utils.random(-200, stageW / 2), y:Utils.random(stageH + 250, stageH + 2000)}});
		candy2.scale.x = candy2.scale.y = Utils.random(minCandyScale, maxCandyScale);
		t.set(candy2, {pixi:{x:Utils.random(stageW / 2, stageW + 200), y:Utils.random(-2000, -400)}} );
		candy3.scale.x = candy3.scale.y = Utils.random(minCandyScale, maxCandyScale);
		t.set(candy3, {pixi:{x:Utils.random(stageW / 2, stageW + 200), y:Utils.random(stageH + 250, stageH + 2000)}});
		enemy.scale.x = enemy.scale.y = maxEnemyScale;
		t.set(enemy, {pixi:{x:Utils.random(0, stageW), y:Utils.random(stageH + 1000, stageH + 5000)}} );
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
		main.addChild(stageHit);
		main.addChild(candyHolder);
		main.addChild(interfaceHolder);
		// -----------
		//  END FRAME
		// -----------
		endCtaBg1.anchor.set(0.5);
		endCtaBg2.anchor.set(0.5);
		endCtaText1.anchor.set(0.5);
		endCtaText2.anchor.set(0.5);
		endCtaHolder1.addChild(endCtaBg1);
		endCtaHolder1.addChild(endCtaText1);
		endCtaHolder2.addChild(endCtaBg2);
		endCtaHolder2.addChild(endCtaText2);
		endCtaHolder1.interactive = true;
		endCtaHolder1.buttonMode = true;
		endCtaHolder2.interactive = true;
		endCtaHolder2.buttonMode = true;
		ahLogoEnd.anchor.set(0.5);
		ahLogoEnd.animationSpeed = 0.3;
		ahLogoEnd.loop = false;
		gaGetEnd.anchor.set(0.5)
		gaGetEnd.position.set(gaGetEnd.width/2, gaGetEnd.height / 2);
		gaAirheadedEnd.anchor.set(0.5)
		gaAirheadedEnd.position.set(gaAirheadedEnd.width/2, gaAirheadedEnd.height / 2);
		gaBgEnd.anchor.set(0.5)
		gaBgEnd.position.set(gaBgEnd.width/2, gaBgEnd.height / 2);
		gaCandy1End.anchor.set(0.5)
		gaCandy1End.position.set(gaBgEnd.width/2, gaBgEnd.height / 2);
		gaCandy2End.anchor.set(0.5)
		gaCandy2End.position.set(gaBgEnd.width/2, gaBgEnd.height / 2);
		gaCandy3End.anchor.set(0.5)
		gaCandy3End.position.set(gaBgEnd.width/2, gaBgEnd.height / 2);
		gaCandy4End.anchor.set(0.5)
		gaCandy4End.position.set(gaBgEnd.width/2, gaBgEnd.height / 2);
		gaLogoEnd.addChild(gaCandy4End);
		gaLogoEnd.addChild(gaBgEnd);
		gaLogoEnd.addChild(gaGetEnd);
		gaLogoEnd.addChild(gaAirheadedEnd);
		gaLogoEnd.addChild(gaCandy1End);
		gaLogoEnd.addChild(gaCandy2End);
		gaLogoEnd.addChild(gaCandy3End);
		if (screenSize === 'desktop') {
			gaLogoEnd.scale.set(0.42);
			gaLogoEnd.position.set(stageW / 3 - gaLogoEnd.width / 2 - 10, 26);
			yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, 168);
			endSubhead.position.set(stageW / 3 - endSubhead.width / 2, 284);
			endCtaHolder1.position.set(stageW / 3 - endCtaHolder1.width / 2 - 40, stageH / 2 + 160);
			endCtaHolder2.position.set(stageW / 3 + endCtaHolder2.width / 2 + 40, stageH / 2 + 160);
			ahLogoEnd.position.set(stageW - ahLogo.width / 2, 220);
		} else if ( screenSize === 'tablet' ) {
			//log('Position Tablet EndFrame');
			gaLogoEnd.scale.set(0.42);
			gaLogoEnd.position.set(stageW / 3 - gaLogoEnd.width / 2 - 10, stageH / 4 - gaLogoEnd.height / 2);
			yourScoreText.style.fontSize = '60px';
			yourScoreText.style.letterSpacing = 0.25;
			yourScoreText.position.set(stageW / 3 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height );
			endSubhead.style.fontSize = '28px'
			endSubhead.position.set(stageW / 3 - endSubhead.width / 2, stageH / 2 + endSubhead.height );
			endCtaHolder1.scale.set(0.75);
			endCtaHolder2.scale.set(0.75);
			endCtaHolder1.position.set(stageW / 3 - endCtaHolder1.width / 2 - 10, stageH / 2 + 180);
			endCtaHolder2.position.set(stageW / 3 + endCtaHolder2.width / 2 + 10, stageH / 2 + 180);
			ahLogoEnd.scale.set(0.60);
			ahLogoEnd.position.set( stageW - ahLogoEnd.width / 2 + 40, stageH / 2 );
		} else if ( screenSize === 'mobile') {
          	if (screenHeight === 'small') {
              gaLogoEnd.scale.set(0.25);
              gaLogoEnd.position.set(stageW / 2 - gaLogoEnd.width / 2, 20);
              yourScoreText.style.fontSize = '40px';
              yourScoreText.style.letterSpacing = 0.25;
              yourScoreText.position.set(stageW / 2 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height * 2 );
              endSubhead.style.fontSize = '28px'
              endSubhead.position.set(stageW / 2 - endSubhead.width / 2, stageH / 2 - endSubhead.height );
              endCtaHolder1.scale.set(0.50);
              endCtaHolder2.scale.set(0.50);
              endCtaHolder1.position.set(stageW / 2 - endCtaHolder1.width / 2 - 10, stageH / 2 + 60);
              endCtaHolder2.position.set(stageW / 2 + endCtaHolder2.width / 2 + 10, stageH / 2 + 60);
              ahLogoEnd.scale.set(0.40);
              ahLogoEnd.position.set( stageW / 2  , stageH - ahLogoEnd.height / 2 );
            } else {
              //log ('position mobile EndFrame');
              overlayEnd.width = stageW;
              overlayEnd.height = stageH;
              gaLogoEnd.scale.set(0.35);
              gaLogoEnd.position.set(stageW / 2 - gaLogoEnd.width / 2, 60);
              yourScoreText.style.fontSize = '40px';
              yourScoreText.style.letterSpacing = 0.25;
              yourScoreText.position.set(stageW / 2 - yourScoreText.width / 2, stageH / 2 - yourScoreText.height * 2 );
              endSubhead.style.fontSize = '28px'
              endSubhead.position.set(stageW / 2 - endSubhead.width / 2, stageH / 2 - endSubhead.height );
              endCtaHolder1.scale.set(0.55);
              endCtaHolder2.scale.set(0.55);
              endCtaHolder1.position.set(stageW / 2 - endCtaHolder1.width / 2 - 10, stageH / 2 + 60);
              endCtaHolder2.position.set(stageW / 2 + endCtaHolder2.width / 2 + 10, stageH / 2 + 60);
              ahLogoEnd.scale.set(0.60);
              ahLogoEnd.position.set( stageW / 2  , stageH - ahLogoEnd.height / 2 );
            }
		}
		endFrame.addChild(overlayEnd);
		endFrame.addChild(gaLogoEnd);
		endFrame.addChild(endSubhead);
		endFrame.addChild(endCtaHolder1);
		endFrame.addChild(endCtaHolder2);
		endFrame.addChild(ahLogoEnd);
		endFrame.addChild(yourScoreText);

		buildStage();

	}

	function setUp() {
		//log('setUp');
		t.to(loadingText, 0.3, {pixi:{alpha:0, y:'+=10'}, ease:Power3.easeOut, delay:0.5});
		mainBlur = new PIXI.filters.BlurFilter();
		mainBlur.blur = 10;
		mainBlur.quality = 4;

		// -----------
		//  INTRO
		// -----------

		logoTextures = [resources['logo00.png'].texture, resources['logo01.png'].texture, resources['logo02.png'].texture, resources['logo03.png'].texture, resources['logo04.png'].texture, resources['logo05.png'].texture, resources['logo06.png'].texture, resources['logo07.png'].texture, resources['logo08.png'].texture, resources['logo09.png'].texture, resources['logo10.png'].texture, resources['logo11.png'].texture, resources['logo12.png'].texture ];

		intro = new PIXI.Container({width: stageW, height: stageH});
		ctaHolder = new PIXI.Container();
		ahLogo = new PIXI.extras.AnimatedSprite(logoTextures);
		ctaBg = new PIXI.Sprite(resources['cta_bg.png'].texture);
		ctaText = new PIXI.Text(' Play Now ');
		overlay = new PIXI.Sprite(resources['overlayBg_@2X.png'].texture);
		instructionText = new PIXI.Text(' Drag your mouse.\nCatch some candy.\nIt’s that easy. ');
		ctaText.style 		= Text.ctaTextStyle;
		instructionText.style = Text.interfaceTextStyle;
		gaLogo = new PIXI.Container();
		gaGet 		= new PIXI.Sprite(resources['ga_get.png'].texture);
		gaAirheaded = new PIXI.Sprite(resources['ga_airheaded.png'].texture);
		gaBg 		= new PIXI.Sprite(resources['ga_bg.png'].texture);
		gaCandy1 	= new PIXI.Sprite(resources['ga_candy1.png'].texture);
		gaCandy2 	= new PIXI.Sprite(resources['ga_candy2.png'].texture);
		gaCandy3	= new PIXI.Sprite(resources['ga_candy3.png'].texture);
		gaCandy4 	= new PIXI.Sprite(resources['ga_candy4.png'].texture);
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
		enemyBlur = new PIXI.filters.BlurFilter();
		candyBrightness0 = new PIXI.filters.ColorMatrixFilter();
		candyBrightness0.brightness(0.5);
		candyBrightness1 = new PIXI.filters.ColorMatrixFilter();
		candyBrightness1.brightness(0.5);
		candyBrightness2 = new PIXI.filters.ColorMatrixFilter();
		candyBrightness2.brightness(0.5);
		candyBrightness3 = new PIXI.filters.ColorMatrixFilter();
		candyBrightness3.brightness(0.5);
		enemyBrightness = new PIXI.filters.ColorMatrixFilter();
		enemyBrightness.brightness(0.5);
		candyBlur0.blur = candyBlur1.blur = candyBlur2.blur = candyBlur3.blur = candyBlur4.blur = candyBlur5.blur = candyBlur6.blur = candyBlur7.blur = 10;
		candyBlur0.quality = candyBlur1.quality = candyBlur2.quality = candyBlur3.quality = 6;
		main = new PIXI.Container();
		bgHolder = new PIXI.Container();
		interfaceHolder = new PIXI.Container();
		bgHolder.width = 1700;
		bgHolder.height = 800;
		sky_bg = new PIXI.Sprite(resources['sky_bg.jpg'].texture);
		// - interface
		// -- score
		scoreText 	= new PIXI.Text('0');
		scoreIcon 	= new PIXI.Sprite(resources['candy_scoreIcon.png'].texture);
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
		stageHit = new PIXI.Graphics();
		stageHit.beginFill(0xFF3300);
		stageHit.drawRect(0, 0, stageW, stageH);
		stageHit.endFill();
		stageHit.alpha = 0.0;
		stageHit.interactive = true;
		stageHit.buttonMode = true;
		stageHit.hitArea = new PIXI.Rectangle(0, 0, stageHit.width, stageHit.height);
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
		candy2 = new PIXI.extras.AnimatedSprite(candyTextures);
		candy3 = new PIXI.extras.AnimatedSprite(candyTextures);
		candy0.gotoAndStop(Utils.random(0, 6));
		candy1.gotoAndStop(Utils.random(0, 6));
		candy2.gotoAndStop(Utils.random(0, 6));
		candy3.gotoAndStop(Utils.random(0, 6));
		enemyTextures = [resources['cat.png'].texture, resources['duck.png'].texture, resources['flamingo.png'].texture, resources['beachBall.png'].texture, resources['duck.png'].texture];
		enemy = new PIXI.extras.AnimatedSprite(enemyTextures);
		enemy.gotoAndStop(Utils.random(0, 4));
		// -----------
		//  END FRAME
		// -----------
		endFrame 		= new PIXI.Container();
		endCtaHolder1	= new PIXI.Container();
		endCtaHolder2	= new PIXI.Container();
		gaLogoEnd 		= new PIXI.Container();
		yourScoreText 	= new PIXI.Text('Your score: 0   ');
		endSubhead 	= new PIXI.Text(' Great job! ' );
		gaGetEnd 		= new PIXI.Sprite(resources['ga_get.png'].texture);
		gaAirheadedEnd = new PIXI.Sprite(resources['ga_airheaded.png'].texture);
		gaBgEnd 		= new PIXI.Sprite(resources['ga_bg.png'].texture);
		gaCandy1End 	= new PIXI.Sprite(resources['ga_candy1.png'].texture);
		gaCandy2End 	= new PIXI.Sprite(resources['ga_candy2.png'].texture);
		gaCandy3End	= new PIXI.Sprite(resources['ga_candy3.png'].texture);
		gaCandy4End 	= new PIXI.Sprite(resources['ga_candy4.png'].texture);
		endCtaBg1 		= new PIXI.Sprite(resources['cta_bg.png'].texture);
		endCtaBg2 		= new PIXI.Sprite(resources['cta_bg.png'].texture);
		endCtaText1 	= new PIXI.Text(' Play Again? ');
		endCtaText2 	= new PIXI.Text(' Find a pack ');
		ahLogoEnd 		= new PIXI.extras.AnimatedSprite(logoTextures);
		overlayEnd 	    = new PIXI.Sprite(resources['endOverlay.png'].texture);
		yourScoreText.style 	= Text.yourScoreTextStyle;
		endSubhead.style 		= Text.subHeadTextStyle;
		endCtaText1.style 		= Text.ctaTextStyle;
		endCtaText2.style 		= Text.ctaTextStyle;

		setPosition();

	}

	function loadProgressHandler() {
		loadingText.setText( 'LOADING ' + Math.round(loader.progress) + '%');
	}

	loader.add([
		'sky_bg_test.jpg',
		'sky_bg.jpg',
		'heart.png',
		'candy_scoreIcon.png',
		'candy_00.png',
		'candy_01.png',
		'candy_02.png',
		'candy_03.png',
		'candy_04.png',
		'candy_05.png',
		'candy_06.png',
		'cat.png',
		'duck.png',
		'flamingo.png',
		'beachBall.png',
		'taco.png',
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
		'cta_bg.png',
		'logo00.png',
		'logo01.png',
		'logo02.png',
		'logo03.png',
		'logo04.png',
		'logo05.png',
		'logo06.png',
		'logo07.png',
		'logo08.png',
		'logo09.png',
		'logo10.png',
		'logo11.png',
		'logo12.png',
		'overlayBg_@2X.png',
		'ga_airheaded.png',
		'ga_get.png',
		'ga_bg.png',
		'ga_candy1.png',
		'ga_candy2.png',
		'ga_candy3.png',
		'ga_candy4.png',
		'endOverlay.png'
	]).on('progress', loadProgressHandler).load(setUp);

	ticker.add( function(delta){
		handleBg(delta);
		handleAirHead(delta);
		handleCandy(delta);
		handleTimer(delta);
		handleEnemy(delta);
	});

	$(window).blur(function(){
		if (playing === true) {
			ticker.stop();
			Howler.volume(0.0);
		}
	});

	$(window).focus(function(){
		if (playing === true) {
			setTimeout( function() { ticker.start(); Howler.volume(1.0);}, 500);
		}
	});

	var adClose = false;
  	var n_width, n_height, n_orientation;
  	var resized = false;
  	var resizeTimer;
    var orientation = Math.abs(window.orientation);

	function resetResizeTimer() {
      setTimeout( function() {
          clearTimeout(resizeTimer);
          resized = false;
      }, 1000);
    }

	if  (isMobile === true &&  Math.abs(window.orientation) === 90 ) {
		//alert('landscape view');
      	t.set(rotateAlertOverlay, {autoAlpha:1});
    }

	window.addEventListener("orientationchange", function() {
      	n_orientation = Math.abs(window.orientation);
      	if  (isMobile === true &&  Math.abs(window.orientation) === 90 ) {
			//alert('landscape view');
      		t.set(rotateAlertOverlay, {autoAlpha:1});

        	if (playing === true) {

         		ticker.stop();
              	Howler.volume(0.0);
        	}
    	}
      	if (isMobile === true && window.orientation === 0) {
          t.set(rotateAlertOverlay, {autoAlpha:0});
          if (playing === true) {
			setTimeout( function() {
              ticker.start();
              Howler.volume(0.5);
            }, 500);
          }
        }
    });

	$(document).on('adStateChange', function () {
      log("document.on adStateChange fired");
      log("adStateChange is: " + mraid.getState());
      if (mraid.getState() == "resized") {
        	adClose = false;
      		Howler.volume(0.5);
         	t.to('#game', 0.2, {opacity:1});
         	t.to('#game', 0.5, {height:_height});
      }
      if (mraid.getState() == "default") {
        	adClose = true;
            t.set(rotateAlertOverlay, {autoAlpha:0});
        	t.to('#game', 1, {height:0});
        	t.to('#game', 1, {opacity:0, delay:0.5});
        	Howler.volume(0.0);
        	if (introPlaying === true){
          		introTicker.stop();
       	 	}
        	if (playing === true) {
           		lives = 0;
           		ticker.stop();
           		handleGameOver(false);
        	}
      }
    });


	initStage();
}
//