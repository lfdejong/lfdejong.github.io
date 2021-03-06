import { Background } from "./background.js"
import { GameObject } from "./gameobject.js"
import { Dog } from "./dog.js"
import { Zombie } from "./zombie.js"
import { Game } from "./game.js"
import { Bone } from "./bone.js" 
import { Maggot } from "./maggot.js"
import { Life } from "./life.js"
import { UI } from "./ui.js"

export class Graveyard extends GameObject {
    private sound : HTMLAudioElement;
    private background: Background;
    private game: Game;
    private zombie: Zombie;
    private dog: Dog;
    private bones : Bone [] = [];
    private maggots : Maggot[] = [];
    private lives : Life [] = [];
    private ui : UI;
    private spawnCounter: number = 0


    x: number;
    y: number;

    constructor(g: Game){
        super("gamescreen")
        this.game = g
        this.create();
        this.update()
        const text = document.createElement("instructions")
        text.innerText = "Catch the bones! Avoid the maggots!"
        
    }

    private create(): void{
        this.background = new Background();
        this.dog = new Dog();
        this.dog.spawn()
        this.zombie = new Zombie(); 
        for(let i = 0; i < 4; i++){
            this.lives.push(new Life(this.dog, i));
        }
        this.ui = new UI();
    }

    private reset(){
        for(let m of this.maggots){
            m.remove()
        }
        for (let b of this.bones){
            b.remove()
        }
        this.ui.remove()
        this.remove()
    }

   private spawnMoreBones(b : Bone){
            b.remove()
            this.bones.push(new Bone(this));
            b.setPosition()
    }

    private spawnMoreMaggots(m : Maggot){
        m.remove()
        this.maggots.push(new Maggot(this));
        m.setPosition()
    }

   private removeLife() {
        if (this.lives.length !== 0){
               let life = this.lives.pop()
               if(life){
                  life.remove() 
               }
            }
            if(this.lives.length == 0){
                this.reset()
                this.game.showEndScreen()
            }
    }    

    private addScore(score: number){
        let newScore = this.ui.getScore() + score;
        this.ui.setScore(newScore)
        this.ui.update();
    }

    public checkCollision(a: ClientRect, b : ClientRect) : boolean {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom)
    }

    public update(): void{
        this.spawnCounter++
        if(this.spawnCounter > 120) {
            this.spawnCounter = 0
            this.maggots.push(new Maggot(this));
            this.bones.push(new Bone(this));
        }
        if ( this.dog.x < -5) {
            this.dog.x = -4
        }else {
              this.dog.update(); 
        }
        if (this.checkCollision(this.dog.getFutureRectangle(), this.zombie.getRectangle())){

        }else{
            this.dog.update();
        }
        this.zombie.update()
    
        for (let b of this.bones) {
             b.update();
            if(this.checkCollision(this.dog.getRectangle(), b.getRectangle())){
                this.sound = new Audio("./music/crunch.mp3")
                this.sound.play();
                this.addScore(10);
                this.spawnMoreBones(b);
            }
        }
        for (let m of this.maggots){
            m.update();
            if(this.checkCollision(this.dog.getRectangle(), m.getRectangle())){
                this.sound = new Audio("./music/sad-dog.mp3")
                this.sound.play();
                this.removeLife()
                this.spawnMoreMaggots(m);
            }
         
         }
    }
}