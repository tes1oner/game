Presenter.Game = function(game) {};
Presenter.Game.prototype = {
	create: function() {
		// Iniciar sistema de fìsica
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// Agregar fondo y panel
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(0, 0, 'panel');

		// Configurar fuente
		this.fontSmall = { font: "16px Arial", fill: "#e4beef" };
		this.fontBig = { font: "24px Arial", fill: "#e4beef" };
		this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
		
		// Estàdo del audio
		this.audioStatus = true;
		// Temporizador
		this.timer = 0;
		this.totalTimer = 0;
		// control de niveles
		this.level = 1;
		this.maxLevels = 1;

		// ??
		this.movementForce = 10;
		this.ballStartPos = { x: Presenter._WIDTH*0.5, y: 450 };
		// ??

		// Controladores de botones
		this.pauseButton = this.add.button(Presenter._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.audioButton = this.add.button(Presenter._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);

		// Texto del panel
		this.timerText = this.game.add.text(15, 15, "Time: "+this.timer, this.fontBig);
		this.levelText = this.game.add.text(120, 10, "Level: "+this.level+" / "+this.maxLevels, this.fontSmall);
		this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontSmall);

		this.archer = this.add.sprite(100,50,"neimi-archer-bow");
		this.archer.frame = 1;
		this.archer.animations.add('state', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true)
		//mujer.animations.add("left", [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
        //mujer.animations.add("right", [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
        //mujer.animations.add("up", [0, 1, 2, 3, 4], 10, true);
        //mujer.animations.add("down", [8, 9, 10, 11, 12], 10, true);
        this.archer.animations.play('state');
		//this.physics.enable(this.archer, Phaser.Physics.ARCADE);
		//this.archer.anchor.set(0.5);
		//this.archer.body.setSize(2, 2);


		this.initLevels();
		this.showLevel(1);
		this.keys = this.game.input.keyboard.createCursorKeys();

		//Presenter._player = this.ball;
		window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Presenter._HEIGHT-2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Presenter._WIDTH-2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
		this.bounceSound = this.game.add.audio('audio-bounce');
	},
	initLevels: function() {
		
	},
	showLevel: function(level) {
	},
	updateCounter: function() {
		this.timer++;
		this.timerText.setText("Time: "+this.timer);
		this.totalTimeText.setText("Total time: "+(this.totalTimer+this.timer));
	},
	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(Presenter._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	update: function() {
	},
	wallCollision: function() {
		if(this.audioStatus) {
			this.bounceSound.play();
		}
		// Vibration API
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}
	},
	handleOrientation: function(e) {
		try{
			if (!mygame.device.desktop){
				screen.orientation.lock('landscape');		
			}
			
		}catch(err){}
		
		/*
		// Device Orientation API
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		Presenter._player.body.velocity.x += x;
		Presenter._player.body.velocity.y += y*0.5;*/
	},
	finishLevel: function() {
		
	},
	render: function() {
		// this.game.debug.body(this.arher);
		// this.game.debug.body(this.hole);
	}
};