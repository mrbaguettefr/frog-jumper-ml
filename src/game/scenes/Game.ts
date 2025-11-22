import { Scene } from 'phaser';

export class Game extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    msg_text!: Phaser.GameObjects.Text;
    cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
    player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    enemy!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameOver: boolean = false;
    brick!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    potions!: Phaser.Physics.Arcade.Group;
    isInvincible: boolean = false;
    invincibilityTimer: number = 0;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(400, 300, 'background');
        this.background.setAlpha(0.5);
        this.add.image(400, 300, 'sky');
        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');

        //this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Create enemy zombie sprite using the zombie spritesheet
        this.enemy = this.physics.add.sprite(700, 450, 'zombie'); // Start with idle frame
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setScale(1); // Same size as player

        // Player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        // Zombie enemy animations
        this.anims.create({
            key: 'zombie_left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'zombie_idle',
            frames: [{ key: 'zombie', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'zombie_right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 5, end: 8 }),
            frameRate: 4,
            repeat: -1
        });

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.enemy, platforms);
        this.cursor = this.input.keyboard.createCursorKeys();

        // Create brick and potion graphics
        this.createBrickAndPotionGraphics();

        // Create brick randomly placed in the world
        const brickX = Phaser.Math.Between(100, 700);
        const brickY = Phaser.Math.Between(100, 400);
        this.brick = this.physics.add.sprite(brickX, brickY, 'brick');
        this.brick.setImmovable(true);
        this.brick.setGravityY(-300); // Make brick not affected by gravity
        this.brick.body.setSize(32, 32);

        // Create potions group
        this.potions = this.physics.add.group();

        // Add collision between brick and platforms
        //this.physics.add.collider(this.brick, platforms);

        // Add collider so brick is solid, but we'll check for breaking in update
        this.physics.add.collider(this.player, this.brick);

        // Add collision detection for potions with platforms
        this.physics.add.collider(this.potions, platforms);

        // Add overlap detection for player collecting potions
        this.physics.add.overlap(this.player, this.potions, this.collectPotion, undefined, this);

        const stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return null;
        });
        function collectStar(player, star) {
            star.disableBody(true, true);

            if (stars.countActive(true) === 0) {
                stars.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

                // Spawn 5 bombs instead of 1
                for (let i = 0; i < 1; i++) {
                    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                    var bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                }

            }
        }

        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(this.player, stars, collectStar, undefined, this);

        const bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);



        this.physics.add.collider(this.player, bombs, this.hitBomb, undefined, this);
        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, undefined, this);



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

    createBrickAndPotionGraphics(): void {
        // Create brick graphic (brown/orange rectangle)
        const brickGraphics = this.add.graphics();
        brickGraphics.fillStyle(0x8B4513); // Brown color
        brickGraphics.fillRect(0, 0, 32, 32);
        brickGraphics.lineStyle(2, 0x654321); // Darker brown border
        brickGraphics.strokeRect(0, 0, 32, 32);
        brickGraphics.generateTexture('brick', 32, 32);
        brickGraphics.destroy();

        // Create potion graphic (purple/blue bottle)
        const potionGraphics = this.add.graphics();
        potionGraphics.fillStyle(0x9370DB); // Medium purple
        potionGraphics.fillRect(8, 4, 16, 20); // Bottle body
        potionGraphics.fillStyle(0x8A2BE2); // Darker purple for liquid
        potionGraphics.fillRect(10, 6, 12, 16);
        potionGraphics.fillStyle(0x9370DB); // Cap
        potionGraphics.fillRect(10, 0, 12, 6);
        potionGraphics.lineStyle(2, 0x4B0082); // Dark purple border
        potionGraphics.strokeRect(8, 4, 16, 20);
        potionGraphics.generateTexture('potion', 32, 32);
        potionGraphics.destroy();
    }

    checkBrickBreak(): void {
        // Only check if brick is still active
        if (!this.brick || !this.brick.active) {
            return;
        }

        // Check if player is hitting brick from below (with head)
        // Player should be touching the brick from below (touching.up means touching something above)
        const isTouchingBrick = this.player.body.touching.up;
        const isMovingUp = this.player.body.velocity.y < 0;
        const playerTop = this.player.y - this.player.height / 2;
        const brickBottom = this.brick.y + this.brick.height / 2;
        const isPlayerBelow = playerTop < brickBottom;
        const horizontalOverlap = Math.abs(this.player.x - this.brick.x) < (this.player.width / 2 + this.brick.width / 2);

        // Break if player is below brick, moving up or touching it, and horizontally aligned
        if (isPlayerBelow && horizontalOverlap && (isTouchingBrick || isMovingUp)) {
            // Break the brick
            this.brick.disableBody(true, true);

            // Spawn potion at brick's position
            const potion = this.potions.create(this.brick.x, this.brick.y, 'potion');
            potion.setBounce(0.3);
            potion.setCollideWorldBounds(true);
            potion.body.setSize(16, 16);
            // Make potion fall
            potion.setVelocityY(50);
        }
    }

    collectPotion(player: any, potion: any): void {
        // Remove potion from world
        potion.disableBody(true, true);

        // Give player invincibility for 5 seconds
        this.isInvincible = true;
        this.invincibilityTimer = 5000; // 5 seconds in milliseconds

        // Visual feedback - make player flash or change color
        player.setTint(0x00ffff); // Cyan tint for invincibility
    }

    hitBomb(player: any, bomb: any): void {
        // Check if player is invincible
        if (this.isInvincible) {
            return;
        }

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }

    hitEnemy(player: any, enemy: any): void {
        // Check if player is invincible
        if (this.isInvincible) {
            return;
        }

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }


    update(time: number, delta: number): void {
        if (this.gameOver) {
            return;
        }

        // Check if brick should break
        this.checkBrickBreak();

        // Update invincibility timer
        if (this.isInvincible) {
            this.invincibilityTimer -= delta;

            // Flash effect during invincibility
            if (Math.floor(this.invincibilityTimer / 100) % 2 === 0) {
                this.player.setTint(0x00ffff);
            } else {
                this.player.clearTint();
            }

            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.player.clearTint();
            }
        }

        if (this.cursor.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursor.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        // Make enemy slowly follow the player
        if (this.enemy && this.player) {
            const speed = 50; // Slow speed for the enemy

            // Calculate direction to player
            const dx = this.player.x - this.enemy.x;
            const dy = this.player.y - this.enemy.y;

            // Normalize direction and apply speed
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                const velX = (dx / distance) * speed;
                const velY = (dy / distance) * speed;

                this.enemy.setVelocityX(velX);
                this.enemy.setVelocityY(velY);

                // Play appropriate animation based on movement direction
                if (Math.abs(velX) > 5) {
                    if (velX < 0) {
                        this.enemy.anims.play('zombie_left', true);
                    } else {
                        this.enemy.anims.play('zombie_right', true);
                    }
                } else {
                    this.enemy.anims.play('zombie_idle', true);
                }
            }
        }

    }
}
