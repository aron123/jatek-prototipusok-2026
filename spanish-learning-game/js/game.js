/// <reference path="./types/index.d.ts" />

const Keys = {
    BUILDING: 'building',
    CAR: 'car',
    HOUSE: 'house',
    TREE: 'tree'
};

const Answers = {
    [Keys.BUILDING]: 'edificio',
    [Keys.CAR]: 'automóvil',
    [Keys.HOUSE]: 'casa',
    [Keys.TREE]: 'árbol'
};

class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('background', 'assets/img/background-city.png');
        this.load.image(Keys.BUILDING, 'assets/img/building.png');
        this.load.image(Keys.CAR, 'assets/img/car.png');
        this.load.image(Keys.HOUSE, 'assets/img/house.png');
        this.load.image(Keys.TREE, 'assets/img/tree.png');

        this.load.audio('correct', 'assets/audio/correct.mp3');
        this.load.audio('wrong', 'assets/audio/wrong.mp3')
        this.load.audio(Keys.BUILDING + 'Audio', 'assets/audio/edificio.mp3');
        this.load.audio(Keys.CAR + 'Audio', 'assets/audio/auto.mp3');
        this.load.audio(Keys.HOUSE + 'Audio', 'assets/audio/casa.mp3');
        this.load.audio(Keys.TREE + 'Audio', 'assets/audio/arbol.mp3');
    }

    create() {
        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        this.currentQuestion = this.add.text(20, 20, '', {
            fontFamily: 'Arial',
            fontSize: 30,
            color: 'yellow'
        });

        const correctAudio = this.sound.add('correct');
        const wrongAudio = this.sound.add('wrong');

        this.items = this.add.group([
            {
                key: Keys.BUILDING,
                setXY: {
                    x: 100,
                    y: 250
                }
            },
            {
                key: Keys.CAR,
                setXY: {
                    x: 250,
                    y: 300
                }
            },
            {
                key: Keys.HOUSE,
                setXY: {
                    x: 420,
                    y: 270
                }
            },
            {
                key: Keys.TREE,
                setXY: {
                    x: 560,
                    y: 250
                }
            },
        ]);

        Phaser.Actions.Call(this.items.getChildren(), (item) => {
            item.setInteractive();

            item.setData('spanish', Answers[item.texture.key]);
            item.setData('audio', this.sound.add(item.texture.key + 'Audio'));

            const alphaTween = this.tweens.add({
                targets: item,
                alpha: 0.7,
                duration: 200,
                paused: true,
                persist: true
            });

            const correctTween = this.tweens.add({
                targets: item,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 300,
                yoyo: true,
                paused: true,
                persist: true,
                ease: Phaser.Math.Easing.Cubic.InOut
            });

            const wrongTween = this.tweens.add({
                targets: item,
                scaleX: 1.5,
                scaleY: 1.5,
                angle: 90,
                duration: 300,
                yoyo: true,
                paused: true,
                persist: true,
                ease: Phaser.Math.Easing.Cubic.InOut
            });

            item.on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (this.currentQuestion.text == item.getData('spanish')) {
                    correctTween.play();
                    correctAudio.play();
                    this.showNextQuestion();
                } else {
                    wrongTween.play();
                    wrongAudio.play();
                }
            });

            item.on(Phaser.Input.Events.POINTER_OVER, () => {
                alphaTween.play();
            });

            item.on(Phaser.Input.Events.POINTER_OUT, () => {
                alphaTween.pause();
                item.alpha = 1;
            });
        });

        this.showNextQuestion();
    }

    showNextQuestion() {
        const nextItem = Phaser.Math.RND.pick(this.items.getChildren());
        this.currentQuestion.setText(nextItem.getData('spanish'));
        nextItem.getData('audio').play();
    }
}

const gameScene = new GameScene();

const game = new Phaser.Game({
    width: 640,
    height: 360,
    scene: gameScene
});