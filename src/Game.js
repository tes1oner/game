Presenter.Game = function(game) {};
Presenter.Game.prototype = {
	create: function() {
		// Iniciar sistema de fìsica
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// Configurar fuente
		this.fontSmall = { font: "11px Arial", fill: "#ffffff" };
		this.fontBig = { font: "24px Arial", fill: "#ffffff" };
		this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.fontScore = { font: "15px Arial", fill: "#ffffff" };
		// Estàdo del audio
		this.audioStatus = true;
		// Temporizador
		this.score = 0;
		this.totalTimer = 0;
		// control de niveles
		this.level = 1;
		this.maxLevels = 1;
		this.hPositions = {x: 64, y: 64, yy: 134, yyy: 204};


		// Agregar fondo y panel
		this.add.sprite(0, 0, 'game-background');
		this.add.sprite(0, 0, 'panel').scale.setTo(0.994, 0.8);


		// Controladores de botones
		this.pauseButton = this.add.button(Presenter._WIDTH-20, 12, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.scale.setTo(0.4, 0.4);
		this.pauseButton.input.useHandCursor = true;

/*
		this.audioButton = this.add.button(Presenter._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
*/		

		this.btnStick = this.add.button(100,10, 'btn-stick', this.manageResource, this);
		this.btnStick.scale.setTo(1, 0.5);
		//this.btnStick.anch
		this.btnStick.input.useHandCursor = true;

		this.btnIron = this.add.button(200,10, 'btn-iron', this.manageResource, this);
		this.btnIron.scale.setTo(1, 0.5);
		this.btnIron.input.useHandCursor = true;

		this.btnRope = this.add.button(300,10, 'btn-rope', this.manageResource, this);
		this.btnRope.scale.setTo(1, 0.5);
		this.btnRope.input.useHandCursor = true;



		// ??
		this.movementForce = 10;
		this.ballStartPos = { x: Presenter._WIDTH*0.5, y: 450 };
		// ??


		// Texto del panel
		this.scoreText = this.game.add.text(12, 8, "Score: "+this.score, this.fontScore);
		//this.timerText = this.game.add.text(15, 15, "Time: "+this.timer, this.fontBig);
		this.levelText = this.game.add.text(22, 28, "Level: "+this.level, this.fontSmall);
		//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontSmall);

		//this.archer = this.add.sprite(100,50,"neimi-archer-bow");
		//this.archer.frame = 1;
		//this.archer.animations.add('state', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true)
        //this.archer.animations.play('state');
		//this.physics.enable(this.archer, Phaser.Physics.ARCADE);
		//this.archer.anchor.set(0.5);
		//this.archer.body.setSize(2, 2);
		this.h1 = this.add.sprite(64,this.hPositions.y, "h1");
		this.h1.frame = 1;
		this.h1.animations.add('state', [0,1,2,3,4], Math.floor(Math.random() * 10) + 3, true);
		this.h1.animations.play('state');

		this.h2 = this.add.sprite(64, this.hPositions.yy, "h2");
		this.h2.frame = 1;
		this.h2.animations.add('state', [0,1,2,3,4], Math.floor(Math.random() * 10) + 3, true);
		this.h2.animations.play('state');

		this.h3 = this.add.sprite(64, this.hPositions.yyy, "h3");
		this.h3.frame = 1;
		this.h3.animations.add('state', [0,1,2,3,4], Math.floor(Math.random() * 10) + 3, true);
		this.h3.animations.play('state');


		this.enemy = this.add.sprite(400, this.hPositions.y, 'enemy');
		this.enemy.scale.setTo(-1, 1);
		this.enemy.frame = 1;
		this.enemy.animations.add('walking', [0,1,2,3,4,5], 8, true);
		this.enemy.animations.play('walking');

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
	initLevels: function(){
		
	},
	showLevel: function(level){
	},
	updateCounter: function(){
		this.score+= (this.level);
		this.scoreText.setText("Score: "+this.score);
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
	update: function(){
		this.enemy.x--;
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