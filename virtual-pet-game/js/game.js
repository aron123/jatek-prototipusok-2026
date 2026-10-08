/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.stats = { health: 100, fun: 100 };
        this.selectedItem = null;
        this.uiBlocked = false;
    }

    preload() {
        this.load.image('apple', 'assets/apple.png');
        this.load.image('background', 'assets/backyard.png');
        this.load.image('candy', 'assets/candy.png');
        this.load.image('rotate', 'assets/rotate.png');
        this.load.image('duck', 'assets/rubber_duck.png');

        this.load.spritesheet('pet', 'assets/pet.png', {
           frameWidth: 97,
           frameHeight: 83,
           margin: 1,
           spacing: 1
        });
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0).setInteractive();

        this.bg.on(Phaser.Input.Events.POINTER_DOWN, (pointer, x, y) => this.placeItem(x, y));

        this.pet = this.add.sprite(100, 200, 'pet').setInteractive({ draggable: true });

        this.input.on(Phaser.Input.Events.DRAG, (pointer, gameObj, dragX, dragY) => {
            gameObj.setPosition(dragX, dragY);
        });



        this.createUi();
    }

    createUi() {
        this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
        this.appleBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.pickItem(this.appleBtn));
        this.appleBtn.setData('stats', { health: 20, fun: 0 });

        this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
        this.candyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.pickItem(this.candyBtn));
        this.candyBtn.setData('stats', { health: -10, fun: 20 });

        this.toyBtn = this.add.sprite(216, 570, 'duck').setInteractive();
        this.toyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.pickItem(this.toyBtn));
        this.toyBtn.setData('stats', { health: 5, fun: 10 });

        this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
        this.rotateBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.rotatePet());
        this.rotateBtn.setData('stats', { health: 0, fun: 10 });
    }

    setUiReady() {
        this.selectedItem = null;
        this.appleBtn.setAlpha(1);
        this.candyBtn.setAlpha(1);
        this.toyBtn.setAlpha(1);
        this.rotateBtn.setAlpha(1);
        this.uiBlocked = false;
    }

    pickItem(item) {
        if (this.uiBlocked) {
            return;
        }

        this.setUiReady();

        this.selectedItem = item;
        item.setAlpha(0.7);
    }

    placeItem(x, y) {
        if (!this.selectedItem || this.uiBlocked) {
            return;
        }

        this.uiBlocked = true;

        const newItem = this.add.sprite(x, y, this.selectedItem.texture.key);

        // TODO: pet processes item
        setTimeout(() => {
            this.updateStats();
            newItem.destroy();
            this.setUiReady();
        }, 2000);
    }

    rotatePet() {
        this.setUiReady();
        this.uiBlocked = true;
        this.selectedItem = this.rotateBtn;
        this.rotateBtn.setAlpha(0.7);

        // TODO: rotate pet animation

        setTimeout(() => {
            this.updateStats();
            this.setUiReady();
        }, 2000);
    }

    updateStats() {
        this.stats.health += this.selectedItem.getData('stats').health;
        this.stats.fun += this.selectedItem.getData('stats').fun;

        console.log(this.stats);
    }
}

const gameScene = new GameScene();
const game = new Phaser.Game({
    width: 360,
    height: 640,
    scene: gameScene
});