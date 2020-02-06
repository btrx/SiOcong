var ScenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
    //=============================INIT==========================//
    // Constructor
    function ScenePlay ()
	{
		// Create scene baru
		Phaser.Scene.call(this, {key: 'sceneplay' });
	},

    preload: function ()
	{
		this.load.image('BG', 'assets/BG.png');
		this.load.image('FG', 'assets/FG.png');
		this.load.image('FG_Awal', 'assets/FG_Awal.png');
		this.load.image('Play', 'assets/Button_Play.png');
		this.load.image('Title', 'assets/Title.png');

		this.load.image('Chara', 'assets/Chara.png');
		
		this.clicking = false;
		this.isGameRunning = false;
		this.backgrounds = [];

		this.load.image('Peluru','assets/Peluru.png');
		this.timer_halangan = 0;
		this.halangan = [];

		this.score = 0;
		this.load.image('PanelNilai', 'assets/Panel_Nilai.png');
	},
    //=============================#INIT==========================//

	//=============================CUSTOMFUNCTION==========================//
	startGame: function()
	{
		// Set Chara Position
		this.chara.setPosition(130,768/2);
		// Make Chara Visible
		this.chara.setVisible(true);
		this.chara.setScale(1);
		
		this.tweens.add({
			targets: this.FG_Awal,
			ease: "Power1",
			duration: 500,
			y: 768/2-768
		})

		this.tweens.add({
			targets: this.BPlay,
			ease: 'Back.easeIn',
			duration: 750,
			scaleX : 0,
			scaleY: 0
		});

		this.tweens.add({
			targets: this.Title,
			ease: 'Elastic',
			duration: 750,
			scaleX: 0,
			scaleY: 0
		});

		this.charaTweens = this.tweens.add({
			targets: this.chara,
			ease: 'power1',
			duration: 750,
			y: this.chara.y + 200
		});
		this.isGameRunning = true;
	},

	finnishGame: function()
	{
		// FG_Awal Animation
		this.tweens.add({
			targets: this.FG_Awal,
			duration: 750,
			y:768/2
		});

		//BPlay Animation, Reset scale size
		this.tweens.add({
			targets: this.BPlay,
			ease: 'Back',
			duration: 1000,
			delay: 1500,
			scaleX: 1,
			scaleY: 1
		});

		//Title Animation
		this.tweens.add({
			targets: this.Title,
			ease: 'Elastic',
			duration: 1500,
			delay: 1000,
			scaleX: 1,
			scaleY: 1
		});

		//Hide Chara
		this.chara.setVisible(false);

		//Remove bullet
		for (var i = 0; i < this.halangan.length; i++){
			this.halangan[i].destroy();
		}

		//clear bullet array
		this.halangan.splice(0, this.halangan.length);
	},
	//=============================#CUSTOMFUNCTION==========================//

	//=============================EVENTLISTENER==========================//
	startInputEvents: function()
	{
		this.input.on('pointerup', this.onPointerUp, this);
		this.input.on('gameobjectdown', this.onObjectClick, this);
		this.input.on('gameobjectup', this.onObjectClickEnd, this);
		this.input.on('gameobjectover', this.onObjectOver, this);
		this.input.on('gameobjectout', this.onObjectOut, this);
	},

	onObjectClick: function(pointer,gameObject)
	{
		if (!this.isGameRunning && gameObject == this.BPlay)
		{
			this.BPlay.setTint(0x616161);
			this.clicking = true;
		}
	},

	onObjectOver: function (pointer, gameObject)
	{
		if(!this.clicking) return;
		if(!this.isGameRunning && gameObject == this.BPlay)
		{
			this.BPlay.setTint(0x616161);
		}
	},

	onObjectOut: function (pointer, gameObject)
	{
		if(!this.clicking) return;
		if(!this.isGameRunning && gameObject == this.BPlay)
		{
			this.BPlay.setTint(0xffffff);
		}
	},

	onObjectClickEnd: function (pointer, gameObject)
	{
		if(!this.isGameRunning && gameObject == this.BPlay)
		{
			this.BPlay.setTint(0xffffff);
			this.startGame();
		}
	},

	onPointerUp: function (pointer, gameObject)
	{
		console.log("Mouse Up");
		this.clicking = false;
		if(!this.isGameRunning) return;

		this.tweens.add({
			targets:this.chara,
			ease: 'Power1',
			duration: 750,
			y: this.chara.y + 200
		});
	},
	//=============================#EVENTLISTENER==========================//
	
	//=============================UPDATE==========================//
	update: function(time, delta)
	{
		// same as if(this.isGameRunning == true)
		if(this.isGameRunning)
		{
			// Accessing array
			for (var i = 0; i < this.backgrounds.length; i++)
			{
				// Accessing array on array
				for (var j = 0; j < this.backgrounds[i].length; j++)
				{
					// Grabbing Acceleration Data than minus acceleration
					this.backgrounds[i][j].x -= this.backgrounds[i][j].getData('kecepatan');

					// Reset position bg if on the left side of canvas
					if(this.backgrounds[i][j].x <= -(1366/2))
					{
						var diff = this.backgrounds[i][j].x + (1366/2);
						this.backgrounds[i][j].x = 1366 + 1366/2 + diff;
					}
				}
			}
			//Chara
			//Chara up 5px every frame
			//Same as this.chara.y = this.chara.y - 5;
			this.chara.y -= 5;

			//limit chara drop
			if(this.chara.y > 690) this.chara.y = 690;
			

			//Bullet
			//If this.timer_halangan is 0, then make new bullet
			if(this.timer_halangan == 0)
			{
				//get random number between 60-680
				var acak_y = Math.floor((Math.random() * 680) +60);

				//make new bullet with x : 1500, y : between 60 - 680
				var peluru = this.add.image(1500,acak_y,'Peluru');
				//change anchor point to the left
				peluru.setOrigin(0.0);
				peluru.setData("status_aktif", true);
				peluru.setData("kecepatan", Math.floor((Math.random()*15)+10))
				peluru.setDepth(5);

				//insert bullet into array that can be accessed again
				this.halangan.push(peluru);

				//generate new bullet within 10-50 frame
				this.timer_halangan = Math.floor((Math.random()*50)+10);
			}

			//accessing array bullet
			for (var i = this.halangan.length - 1; i >= 0; i--)
			{
				//moving bullet as the speed frame
				this.halangan[i].x -= this.halangan[i].getData("kecepatan");

				//if the bullet on position >-200 it dissapear
				if(this.halangan[i].x < -200)
				{
					this.halangan[i].destroy();
					//delete the destroyed bullet
					this.halangan.splice(i,1);
				}
				//reset the counter then get repeated
				
			}
			this.timer_halangan--;

			//POINT
			for(var i = this.halangan.length - 1; i>=0;i--)
			{
				if(this.isGameRunning)
				{
					// if bullet position +50 < Chara, and the bullet status active
					if(this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData("status_aktif") == true)
					{
						// Change bullet status on into off
						this.halangan[i].setData("status_aktif",false);

						// Point +1
						this.score++;

						// Change Point on the label
						this.label_score.setText(this.score);
					}
				}
			}

			//HIT DETECTION
			for (var i = this.halangan.length - 1; i >= 0; i--)
			{
				if (this.isGameRunning)
				{
					// if chara get hit
					if (this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y))
					{
						//Change bullet status off
						this.halangan[i].setData("status_aktif", false);
						
						//Stop Chara Animation
						this.charaTweens.stop();

						//Change game status
						this.isGameRunning = false;

						//Change 'this' object because it cant be detected on completion
						var myScene = this;

						//Lose animation
						this.charaTweens = this.tweens.add({
							targets: this.chara,
							ease: 'Power1',
							duration: 2000,
							scaleX: 3,
							scaleY: 0,

							//add myScene as parameter onComplete
							onCompleteParams: [myScene],
							onComplete: function() {
								myScene.finnishGame();
							}
						});
					}
				}
			}

			if(this.chara.y< -50)
			{
				//Change game status
				this.isGameRunning = false;

				//Change this
				var myScene = this;
				
				//Make lose animation
				this.charaTweens = this.tweens.add({
					targets: this.chara,
					ease:'Power1',
					duration: 2000,
					y: this.chara.y - 500,

					//add myScene as param
					onCompleteParams: [myScene],
					//call finnish game
					onComplete: function(){
						myScene.finnishGame();
					}
				});
			}
		}
	},
	//=============================#UPDATE==========================//
	
	//=============================MAIN==========================//
	create: function()
	{
		var bg_x = 1366/2;
		//looping 2x
		for (var i = 0; i < 2; i++)
		{
			//new bg array
			var bg_awal = []

			// make bg and fg
			var BG = this.add.image(bg_x,768/2,'BG');
			var FG = this.add.image(bg_x,768/2,'FG');

			// add custom data
			BG.setData('kecepatan', 2);
			FG.setData('kecepatan', 4);
			FG.setDepth(2);

			//add bg and fg to new array
			bg_awal.push(BG);
			bg_awal.push(FG);

			//add new array to global array
			this.backgrounds.push(bg_awal);

			//add bg_x's value for nex loop
			bg_x += 1366;
		}
		
		this.FG_Awal = this.add.image(1366/2, 768/2, 'FG_Awal');
		this.FG_Awal.setDepth(10);
		this.FG_Awal.y -=768;
		
		this.tweens.add({
			targets: this.FG_Awal,
			duration: 750,
			y:768/2
		});

		this.BPlay = this.add.image(1366/2, 768/2+75, 'Play');
		this.BPlay.setDepth(10);
		this.BPlay.setScale(0);
		this.BPlay.setInteractive();
		
		this.tweens.add({
			targets: this.BPlay,
			ease: 'Back',
			duration: 1000,
			delay: 1500,
			scaleX: 1,
			scaleY: 1
		});
		
		this.Title = this.add.image(1366/2, 200, 'Title');
		this.Title.setDepth(10);
		this.Title.setScale(0);
		
		this.tweens.add({
			targets: this.Title,
			ease: 'Elastic',
			duration: 1500,
			delay: 1000,
			scaleX: 1,
			scaleY: 1
		});

		this.chara = this.add.image(130, 768/2, 'Chara');
		this.chara.setDepth(3);
		this.chara.setVisible(false);

		//Point panel
		this.panel_score = this.add.image(1366/2, 60, 'PanelNilai');
		this.panel_score.setOrigin(0.5);
		this.panel_score.setDepth(10);
		this.panel_score.setAlpha(0.8);

		//Label Point
		this.label_score = this.add.text(this.panel_score.x +25, this.panel_score.y, this.score);
		this.label_score.setOrigin(0.5);
		this.label_score.setDepth(10);
		this.label_score.setFontSize(30);
		this.label_score.setTint(0xff732e);

		this.time.delayedCall(0, this.startInputEvents, [], this);
	}
    //=============================#MAIN==========================//
});

// Make Scene Konfiguration
var config = {
    tpye: Phaser.AUTO,
    width: 1366,
    height: 768,
    scene: [ScenePlay]
};

// Make & Run the Game Object Same as the Configuration that Phaser Make
var game = new Phaser.Game(config);