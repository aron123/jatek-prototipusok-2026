/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.playerSpeed = 5;

        this.enemyMinSpeed = 1;
        this.enemyMaxSpeed = 2;

        this.enemyMinY = 95;
        this.enemyMaxY = 270;

        this.isTerminating = false;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/dragon.png');
        this.load.image('goal', 'assets/treasure.png');
    }

    create() {
        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        this.player = this.add.sprite(50,
            this.sys.game.config.height / 2, 'player');
        this.player.setScale(0.8, 0.8);

        this.goal = this.add.sprite(
            this.sys.game.config.width - 50,
            this.sys.game.config.height / 2,
            'goal'
        );

        this.enemies = this.add.group({
            key: 'enemy',
            repeat: 3,
            setXY: {
                x: 110,
                y: 100,
                stepX: 135,
                stepY: 20
            }
        });

        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.1, -0.1);
        
        Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
            enemy.setFlipX(true);

            const dir = Phaser.Math.RND.pick([ -1, 1 ]);
            const velocity = Phaser.Math.RND.realInRange(
                this.enemyMinSpeed, this.enemyMaxSpeed);
            enemy.setData('speed', dir * velocity);
        });
    }

    update() {
        if (this.isTerminating) {
            return;
        }

        if (this.input.activePointer.isDown) {
            this.player.x += this.playerSpeed;
        }

        const playerRect = this.player.getBounds();
        const goalRect = this.goal.getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
            this.scene.restart();
            return;
        }

        Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
            enemy.y += enemy.getData('speed');

            const reachedTop =
                enemy.getData('speed') < 0 && enemy.y < this.enemyMinY;
            const reachedBottom =
                enemy.getData('speed') > 0 && enemy.y > this.enemyMaxY;

            if (reachedBottom || reachedTop) {
                enemy.setData('speed', -1 * enemy.getData('speed'));
            }

            const enemyRect = enemy.getBounds();
            if (Phaser.Geom.Intersects
                    .RectangleToRectangle(enemyRect, playerRect)) {
                this.gameOver();
            }
        });
    }

    gameOver() {
        this.isTerminating = true;

        this.cameras.main.shake(500);

        this.cameras.main.on(
            Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
                this.cameras.main.fadeOut(500);
        });

        this.cameras.main.on(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.restart();
        });
    }
}

const gameScene = new GameScene();

const game = new Phaser.Game({
    width: 640,
    height: 360,
    scene: gameScene
});