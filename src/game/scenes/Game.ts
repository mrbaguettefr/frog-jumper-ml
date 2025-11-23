import { Scene } from 'phaser';

export class Game extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    msg_text!: Phaser.GameObjects.Text;
    cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
    player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(320, 440, 'bg_game');
        //this.background.setAlpha(0);
        this.player = this.physics.add.sprite(320, 450, 'frog');
        //this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);


        // Player animations
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('frog', { start: 1, end: 5 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'frog', frame: 0 }],
            frameRate: 20
        });


        this.cursor = this.input.keyboard.createCursorKeys();



        /*
    this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    });
    this.msg_text.setOrigin(0.5);
    */
        /* this.input.once('pointerdown', () => {
    
            this.scene.start('GameOver');
    
        }); */
    }

    t(props) {
        this.tweens.add({
            targets: this.player,
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 200,
            ...props
        });
    }


    update(time: number, delta: number): void {



        if (this.cursor.left.isDown) {
            //this.player.setVelocity(-160, 0);
            this.player.setAngle(-90)
            this.t({ x: "-=20" })

            this.player.anims.play('move', true);
            //            this.player.setRotation(.5)
        }
        else if (this.cursor.right.isDown) {
            this.t({ x: "+=20" })
            this.player.setAngle(90)
            this.player.anims.play('move', true);
            //            this.player.setRotation(-.5)
        }
        else if (this.cursor.up.isDown) {
            this.t({ y: "-=20" })
            this.player.setVelocity(0, -160);
            this.player.setAngle(0)
            this.player.anims.play('move', true);
        }
        else if (this.cursor.down.isDown) {
            this.t({ y: "+=20" })
            this.player.setVelocity(0, 160);
            this.player.setAngle(180)

            this.player.anims.play('move', true);
        }
        else {
            this.player.setVelocity(0, 0);

            this.player.anims.play('turn');
        }




    }
}
