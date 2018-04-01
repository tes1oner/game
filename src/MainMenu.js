Presenter.MainMenu = function(game) {};
Presenter.MainMenu.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-mainmenu');
		this.gameTitle = this.add.sprite(Presenter._WIDTH*0.5, 40, 'title');
		this.gameTitle.anchor.set(0.5,0);
		this.startButton = this.add.button(Presenter._WIDTH*0.5, 200, 'button-start', this.startGame, this, 2, 0, 1);
		this.startButton.anchor.set(0.5,0);
		this.startButton.input.useHandCursor = true;

		// button to "read the article"
		this.game.state.start('Game');
	},
	startGame: function(){
		this.game.state.start('Game');
		//console.log('MainMenu opened');
	}
};