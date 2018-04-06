Presenter.Preloader = function(game) {};
Presenter.Preloader.prototype = {
	preload: function() {
		this.preloadBg = this.add.sprite((Presenter._WIDTH-297)*0.5, (Presenter._HEIGHT-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((Presenter._WIDTH-158)*0.5, (Presenter._HEIGHT-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('panel', 'img/panel-2.png');
		this.load.image('title', 'img/logo.png');
		this.load.image('button-pause', 'img/btn-pause.png');
		this.load.image('screen-mainmenu', 'img/bg-menu.png');
		this.load.image('screen-howtoplay', 'img/screen-howtoplay.png');
		this.load.image('border-horizontal', 'img/border-horizontal.png');
		this.load.image('border-vertical', 'img/border-vertical.png');

		this.load.spritesheet('button-audio', 'img/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', 'img/button-start.png', 146, 51);

		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);


		this.load.spritesheet("h1","img/h1.png",36,64,10,0,0);
		this.load.spritesheet("h2","img/h2.png",36,64,10,0,0);
		this.load.spritesheet("h3","img/h3.png",36,64,10,0,0);

		this.load.spritesheet('enemy', 'img/enemy.png',36,64,6,0,0);

		this.load.image('btn-iron', 'img/btn-iron.png');
		this.load.image('icon-iron', 'img/icon-iron.png');
		this.load.image('btn-stick', 'img/btn-stick.png');
		this.load.image('icon-stick', 'img/icon-stick.png');		
		this.load.image('btn-rope', 'img/btn-rope.png');
		this.load.image('icon-rope', 'img/icon-rope.png');


		// Game resources
		this.load.image('game-background', 'img/background.png');
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};