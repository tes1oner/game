Presenter.Game = function(game) {};
Presenter.Game.prototype = {
	loadDefaultValues: function(){
		// Iniciar sistema de fìsica
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// Configurar fuente
		this.fontSmall = { font: "11px Arial", fill: "#ffffff" };
		this.fontMini = {font: '8px Arial', fill: '#ffffff'};
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
		this.linePositions = {hx: 64, y: 64};
		//this.selectedRes = null;
		this.selectedResource = null;
		this.resources = {
			'iron': {
				'time': 0,
				'name': 'iron',
				'button': this.btnIron,
				'given_to': null
			},
			'stick': {
				'time': 0,
				'name': 'stick',
				'button': this.btnStick,
				'given_to': null
			},
			'rope': {
				'time': 0,
				'name': 'rope',
				'button': this.btnRope,
				'given_to': null
			}
		};
		this.availableRes = ['iron', 'stick', 'rope'];
		this.resTime = 8;
		this.chargeTime = 8;

	},
	loadResButtons: function(){
		
		var x = 100, y = 10;
		this.btnStick = this.add.button(x,y, 'btn-stick', this.selectRes, this);
		this.btnStick.input.useHandCursor = true;
		this.btnStick.scale.setTo(1, 0.5);
		this.btnStick.available = true;
		this.btnStick.selected = false;
		this.btnStick.resource = this.resources['stick'];
		//this.btnStick.textCounter = this.game.add.text(x, y, this.btnStick.resource['time'], this.fontMini);
		
		x = 200;
		this.btnIron = this.add.button(x,y, 'btn-iron', this.selectRes, this);
		this.btnIron.input.useHandCursor = true;
		this.btnIron.scale.setTo(1, 0.5);
		this.btnIron.available = true;
		this.btnIron.selected = false;
		this.btnIron.resource = this.resources['iron'];
		//this.btnIron.textCounter = this.game.add.text(x, y, this.btnIron.resource['time'], this.fontMini);
		
		
		x = 300;
		this.btnRope = this.add.button(x,y, 'btn-rope', this.selectRes, this);
		this.btnRope.available = true;
		this.btnRope.selected = false;
		this.btnRope.input.useHandCursor = true;
		this.btnRope.scale.setTo(1, 0.5);
		this.btnRope.resource = this.resources['rope'];
		//this.btnRope.textCounter = this.game.add.text(x, y, this.btnRope.resource['time'], this.fontMini)

	},
	loadButtons: function(){
		// Controladores de botones
		this.pauseButton = this.add.button(Presenter._WIDTH-20, 12, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.scale.setTo(0.4, 0.4);
		this.pauseButton.input.useHandCursor = true;
		/*
		this.audioButton = this.add.button(Presenter._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);this.audioButton.anchor.set(1,0);this.audioButton.input.useHandCursor = true;this.audioButton.animations.add('true', [0], 10, true);this.audioButton.animations.add('false', [1], 10, true);this.audioButton.animations.play(this.audioStatus);
		*/
	
		this.loadResButtons();
	},
	//  game.add.image(0, 0, 'undersea'); para los iconos 
	showText: function(){
		// Texto del panel
		this.scoreText = this.game.add.text(12, 8, "Score: "+this.score, this.fontScore);
		this.levelText = this.game.add.text(22, 28, "Level: "+this.level, this.fontSmall);
	},
	getResIndicators: function(x, y){
		var resIndicators = {};
		var indicator;
		for (var i = this.availableRes.length - 1; i >= 0; i--) {
			var indicator;
			x = x-20;
			indicator = this.add.sprite(x-(i*3),y,'icon-'+this.availableRes[i]);
			indicator.key = this.availableRes[i];
			indicator.scale.setTo(0.5,0.5);
			indicator.visible = false;
			resIndicators[this.availableRes[i]] = indicator;
		}
		return resIndicators;

	},

	initHeroes: function(){
		this.heroes = [];
		for(var i = 0; i < 3; i++){
			var y = this.linePositions.y+(70*i);
			var animationSpeed = Math.floor(Math.random() * 10) + 3;
			var hero = this.add.sprite(this.linePositions.hx, y, "h"+(i+1));
			hero.frame = 1;
			hero.animations.add('state', [0,1,2,3,4], animationSpeed, true);
			hero.animations.add('shot', [5,6,7,8,9], 8, false).onComplete.add((hero) => {
				this.shot(hero);
			},this);
			hero.animations.play('state');
			this.physics.enable(hero, Phaser.Physics.ARCADE);
			hero.anchor.set(0);
			hero.body.setSize(1, 1);
			hero.inputEnabled = true;
			hero.res = {'iron': false, 'stick': false, 'rope': false};
			hero.res[this.availableRes[i]] = true;
			hero.indicators = this.getResIndicators(hero.x, hero.y);

			hero.chargeTime = parseInt(this.rnd.realInRange(0.5, 1) * 10);
			//this.updateHero(hero);
			var hx = hero.x+hero.width / 1.5;
			var hy = hero.y+(hero.height/4);

			hero.hacha = this.add.sprite(hx,hy,'hacha');
			this.physics.enable(hero.hacha, Phaser.Physics.ARCADE);
			hero.hacha.body.setSize(0.5, 0.5);
			hero.hacha.anchor.set(0.5);
			hero.hacha.fly = false;
			//hero.hacha.scale.setTo(0.5,0.5);
			hero.hacha.visible = false;
			this.heroes[i] = hero;
			this.heroes[i].events.onInputDown.add((hero) => {
				if(this.selectedResource != null){
					this.takeRes(hero, this.selectedResource);
				}else if(hero.res['iron'] && hero.res['rope'] && hero.res['stick']){
					//this.shot(hero);
					hero.animations.play('shot', 'state');
				}
			});
			this.updateHeroes();
		}
	},
	

	shot: function(hero){
		var hacha = hero.hacha;
		if(hacha.fly){
			return;
		}
		var hx = hero.x+hero.width / 1.5;
		var hy = hero.y+(hero.height/4);
		hacha.x = hx;
		hacha.y = hy;
		var force = 140;
		var angle = 0;

		hacha.visible = true;
		hero.animations.play('state');
		hacha.fly = true;
		hacha.body.velocity.x = Math.cos(angle)*force;
		//hacha.body.velocity.y += Math.sin(angle)*force;
		//console.log(hero.hacha);
		
		//sleep(8/1000);
		//hero.animations.play('state');
	},
	initEnemies: function(){
		this.enemies = [];
		for(var i = 0; i < 3; i++){
			var y = this.linePositions.y+(70*i);
			var enemy = this.add.sprite(Presenter._WIDTH+100, y, 'enemy');
			enemy.data = {};
			var speed = this.rnd.realInRange(0.1, .6) * this.level;
			enemy.scale.setTo(-1, 1);
			enemy.frame = 1;
			enemy.animations.add('walking', [0,1,2,3,4,5], 8, true);
			enemy.animations.play('walking');
			enemy.data.speed = speed;
			enemy.speed = speed;
			this.enemies[i] = enemy;
		}
		//this.enemies.append()
	},
	takeRes: function(hero, res){
		res = this.selectedResource;
		if(res != null && !hero.res[res['name']] ){
			hero.res[res['name']] = true;
			res['given_to'] = hero;
			if(res['name'] == 'iron'){
				this.btnIron.available = false;
				this.btnIron.selected = false;
				this.btnIron.loadTexture('btn-iron-locked');
			}else if(res['name'] == 'rope'){
				this.btnRope.available = false;
				this.btnRope.selected = false;
				this.btnRope.loadTexture('btn-rope-locked');
			}else if(res['name'] == 'stick'){
				this.btnStick.available = false;
				this.btnStick.selected = false;
				this.btnStick.loadTexture('btn-stick-locked');
			}
			res['time'] =  this.resTime;
			this.updateHeroes();
			this.selectedResource = null;
		}
		this.updateResPanel();
	},
	lockRes: function(res){
		
	},
	unlockRes: function(res){
		this.resources[res]['time'] = 0;
		var hero = this.resources[res]['given_to'];
		hero.res[res] = false;
		this.updateHero(hero);
		//this.selectedRes = null;
		if(res == 'iron'){
			this.btnIron.available = true;
			this.btnIron.selected = true;
			this.btnIron.loadTexture('btn-iron');
		}else if(res == 'rope'){
			this.btnRope.available = true;
			this.btnRope.selected = true;
			this.btnRope.loadTexture('btn-rope');
		}else if(res == 'stick'){
			this.btnStick.available = true;
			this.btnStick.selected = true;
			this.btnStick.loadTexture('btn-stick');
		}
	},
	
	create: function() {
		this.loadDefaultValues();
		// Agregar fondo y panel
		this.add.sprite(0, 0, 'game-background');
		this.add.sprite(0, 0, 'panel').scale.setTo(0.994, 0.8);
		// Cargar elementos
		this.loadButtons();	
		this.showText();
		this.initHeroes();
		//this.initEnemies();
		// Activar entrada del teclado
		this.keys = this.game.input.keyboard.createCursorKeys();
		//Activar event listener window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		this.addBorders();
		
		this.bounceSound = this.game.add.audio('audio-bounce');
		//this.updateHeroes();
	},
	
	selectRes: function(e){
		if(e == this.btnIron && this.btnIron.available){
			this.selectedResource = this.resources['iron'];
			//this.btnIron.loadTexture('btn-stick-locked');
			//this.selectedRes = 'iron';
		}else if(e == this.btnRope && this.btnRope.available){
			this.selectedResource = this.resources['rope'];
			//this.selectedRes = 'rope';
		}else if(e == this.btnStick && this.btnStick.available){
			this.selectedResource = this.resources['stick'];
			//this.selectedRes = 'stick';
		}
		this.updateResPanel();
	},
	updateHachas: function(){
		for (var i = this.heroes.length - 1; i >= 0; i--) {
			var hacha = this.heroes[i].hacha;
			if(hacha.fly){
				hacha.body.rotation += 2;
				if(hacha.x > Presenter._WIDTH){
					console.log('el hacha salio del rango');
					hacha.fly = false;
					hacha.visible = false;
				}
			}
		}
	},
	updateResPanel: function(){
		if(this.selectedResource == null){
			this.btnStick.tint = 0xFFFFFF;
			this.btnRope.tint = 0xFFFFFF;
			this.btnIron.tint = 0xFFFFFF;
			for(var i = this.heroes.length - 1; i >= 0; i--){
				this.heroes[i].input.useHandCursor = false;
			}
			return;
		}
		for (var i = this.heroes.length - 1; i >= 0; i--) {
			this.heroes[i].input.useHandCursor = true;
		}
		if(this.selectedResource['name'] == 'iron'){
			this.btnIron.tint = 0x53E129;
			this.btnRope.tint = 0xFFFFFF;
			this.btnStick.tint = 0xFFFFFF;
		}else if(this.selectedResource['name'] == 'rope'){
			this.btnRope.tint = 0x53E129;
			this.btnIron.tint = 0xFFFFFF;
			this.btnStick.tint = 0xFFFFFF;
		}else if(this.selectedResource['name'] == 'stick'){
			this.btnStick.tint = 0x53E129;
			this.btnRope.tint = 0xFFFFFF;
			this.btnIron.tint = 0xFFFFFF;
		}
	},
	updateCounter: function(){
		this.score+= (this.level);
		this.scoreText.setText("Score: "+this.score);
		for (key in this.resources){
			if(this.resources[key]['time'] > 0){
				this.resources[key]['time'] -=1;
				if(this.resources[key]['time'] == 0){
					this.unlockRes(key);
				}
			}
		}
	},	
	updateEnemies: function(){
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].x-=this.enemies[i].data.speed * this.level;
		}
	},
	updateHero: function(hero){
		for (var key in hero.res){
			if(hero.res[key]){
				hero.indicators[key].visible = true;
			}else{
				hero.indicators[key].visible = false;
			}
		}
	},
	updateHeroes: function(){
		for (var i = this.heroes.length - 1; i >= 0; i--){
			var hero = this.heroes[i];
			for (var key in hero.res){
				if(hero.res[key]){
					hero.indicators[key].visible = true;
				}else{
					hero.indicators[key].visible = false;
				}
			}
		}
	},
	update: function(){
		this.updateHachas();
		//this.updateHeroes();
		//this.updateEnemies();
		//this.enemy.x--;
	},
	render: function(){
		// this.game.debug.body(this.arher);
		// this.game.debug.body(this.hole);
		//this.game.debug.body();
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
	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(Presenter._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},
	handleOrientation: function(e){
		try{
			if(!mygame.device.desktop){
				screen.orientation.lock('landscape');		
			}
			
		}catch(err){}
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	addBorders: function(){
		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Presenter._HEIGHT-2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Presenter._WIDTH-2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
	},
};