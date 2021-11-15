const config = {
    width: 1290,
    height:635,
    parent: "container",
    type: Phaser.AUTO,
    physics: {
        
        default: 'arcade',
        arcade:{
        
            gravity: {y:350},
            debug: false

        }

    },
    scene: {
     
        preload: preload,
        create: create,
        update: update

    }

}

var gameOver=false;
var cursors;
var score=0;
var round =0;
var game = new Phaser.Game(config);

function preload(){

//imagenes

    this.load.image('fondo', '../img/fondo.jpg')
    this.load.image('suelo','../img/suelo1.png')
    this.load.image('platform2','../img/plata.png')
    this.load.image('over', '../img/game_over.png')
    this.load.image('win', '../img/YouWin.png')
    this.load.image('aste','../img/bomb2.png', { frameWidth: 29, frameHeight: 27 })
    this.load.image('spike','../img/spike.png')
    this.load.image('spike-v','../img/spike-v.png')

//sprites

    this.load.spritesheet('mc','../img/alien.png', { frameWidth: 14, frameHeight: 13 })
    this.load.spritesheet('Hmg','../img/Hmg.png',{ frameWidth: 22, frameHeight: 21 }) 

//musica

    this.load.audio("space", ["img/soundtack2.mp3"]);
}

function create(){

//fondo

    this.add.image(645, 322.5, 'fondo').setScale(2);

//animaciones

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mc', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('mc', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'mc', frame: 1 } ],
        frameRate: 20,
    });
    this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('Hmg', { start: 0, end: 2 }),
        frameRate: 10,
        repeat:-1,
    });

//cursor

    cursors = this.input.keyboard.createCursorKeys();
    Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    reset = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    silence= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    
//piso, plataforma 

    costados = this.physics.add.staticGroup();
    costados.create(645, 615, 'suelo').setScale(2).refreshBody();
    costados.create(0, 374, 'platform2');//1
    costados.create(180, 150, 'platform2').setScale(.6).refreshBody();//2
    costados.create(329, 325, 'platform2').setScale(.85).refreshBody();//3
    costados.create(600, 450, 'platform2').setScale(.75).refreshBody();//4
    costados.create(530, 225, 'platform2').setScale(.65).refreshBody();//5
    costados.create(880, 370, 'platform2').setScale(1).refreshBody();//6
    costados.create(770, 170, 'platform2');//7
    costados.create(1100, 256, 'platform2').setScale(.85).refreshBody();//8
    costados.create(1280, 470, 'platform2').setScale(.65).refreshBody();//9
    
//personaje

    player = this.physics.add.sprite(100, 450, 'mc').setScale(2.25).refreshBody();
    player.setCollideWorldBounds(true);

//camara

    //this.cameras.main.startFollow(player, true, 0.09, 0.09);
    // this.cameras.main.roundPixels = true;
    //this.cameras.main.setZoom(1);

//Heavy Machine Gun

    stars = this.physics.add.group({
        key:'Hmg',
        repeat: 9,
        setXY: { x: 40, y: -1, stepX: 135 }
    });
    
    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.6, .9));

    });
    stars.children.iterate(star => {

        star.play('spin');

    });


//asteroides

    astes = this.physics.add.group()

//pinches

    spikes = this.physics.add.staticGroup();
    spikes.create(41, 399, 'spike');
    spikes.create(502, 209, 'spike').setScale(.65).refreshBody().angle=180;
    spikes.create(598, 560, 'spike').setScale(1.25).refreshBody().angle=180;
    spikes.create(730, 195, 'spike');
    spikes.create(810, 195, 'spike');

    //borde izquierdo

    spikes.create(7.5, 30, 'spike-v').setScale(.5).refreshBody().angle=180;
    spikes.create(7.5, 85, 'spike-v').setScale(.5).refreshBody().angle=180;
    spikes.create(7.5, 140, 'spike-v').setScale(.5).refreshBody().angle=180;
    spikes.create(7.5, 195, 'spike-v').setScale(.5).refreshBody().angle=180;
    spikes.create(7.5, 250, 'spike-v').setScale(.5).refreshBody().angle=180;
    spikes.create(7.5, 305, 'spike-v').setScale(.5).refreshBody().angle=180;

    //borde derecho

    spikes.create(1282.5, 30, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 85, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 140, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 195, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 250, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 305, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 360, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 400, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 506, 'spike-v').setScale(.5).refreshBody();
    spikes.create(1282.5, 545, 'spike-v').setScale(.5).refreshBody();

//mecanicas

    this.physics.add.collider(player, costados);
    this.physics.add.collider(stars, costados);
    this.physics.add.collider(astes, costados);
    this.physics.add.collider(astes, astes);
    this.physics.add.collider(spikes, astes);
    this.physics.add.collider(spikes, stars);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, astes, Dead, null, this);
    this.physics.add.collider(player, spikes, Dead, null, this);

    
//texto

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#7bed9f' });
    tips =this.add.text(16, 48, 'R: Reset   M: Mute',{fontSize: '24px', fill: '#ffffff'});


//musica

    space = this.sound.add("space", { loop: true });
    space.play();

    this.input.keyboard.on('keydown_M', function(event){
        if(!game.sound.mute){
            game.sound.mute = true;
        }
        else{
            game.sound.mute = false;
        }
    }, this);

}

function update(){

//score

    scoreText.setText('Score: ' + score + ' Ronda: ' + round);
    
//controles
    
    
        
    if (A.isDown || cursors.left.isDown) {
            
        player.setVelocityX(-350);
        player.anims.play('left', true);

    } 
    else if (D.isDown || cursors.right.isDown) {
        
        player.setVelocityX(350);
        player.anims.play('right',true);

    }
    else{
        
        player.setVelocityX(0);
        player.anims.play('turn');

    }
    
    if (( Space.isDown || cursors.up.isDown || W.isDown) && player.body.touching.down){
        
        player.setVelocityY(-335);

    }
    
    if (S.isDown || cursors.down.isDown){

        player.setVelocityY(315);

    }
       

//gameover, reset y mute    

    if (gameOver == true && round !=10) {
        this.add.image(645, 319, 'over');
    }
    if (round ==10 ){
        this.add.image(645,319, 'win').setScale(1.75);
        this.physics.pause();
        player.anims.play('turn');
        gameOver = true;
        space.stop();
    
    }

    if (Phaser.Input.Keyboard.JustDown(reset) && gameOver == true) {
        this.scene.restart();
        gameOver=false;
        score = 0;
        round = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(silence)) {
    
        if(game.sound.mute != true){
            game.sound.mute = true;
        }
        else{
            game.sound.mute = false;
        }

    }
    
}

//recoleccion y reaparicion de estrellas

function collectStar (player, star){

    star.disableBody(true, true);
    score += 15;

    if (stars.countActive(true) === 0){

        round++;
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 1200) : Phaser.Math.Between(0, 400);
    
        var aste1 = astes.create(x, 16, 'aste').setScale(1.5).refreshBody();    
        aste1.setBounce(1);
        aste1.setCollideWorldBounds(true);
        aste1.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

//muerte

function Dead (player, aste, spikes){

    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    space.stop();

}
