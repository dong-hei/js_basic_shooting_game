//set Canvas
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let bgImg,gunImg,bulletImg,enemyImg,gameoverImg;
let gameOver=false; //True면 게임종료
let score=0;

let gunImgX = canvas.width/3-(-30)
let gunImgY = canvas.height-64// 총좌표
let bulletList = [] //총알 저장 리스트

function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = gunImgX+5;
        this.y = gunImgY;
        this.isAlive=true // true면 살아있는 총알 false면 사용한 총알
        bulletList.push(this);
    }
    this.update = function(){
        this.y -= 35;
    };
    this.checkHit=function(){
        for(let i=0; i < enemyList.length; i++){
            if(this.y <=enemyList[i].y &&
               this.x>=enemyList[i].x &&
               this.x<=enemyList[i].x+40){
                score++;
                this.isAlive = false;
                enemyList.splice(i,1);
            }
        }
    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList = []

function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-50);
        enemyList.push(this);
    };
    this.update=function(){
        this.y += 4.5; //적군의 속도조절
    
    if(this.y >= canvas.height-48){
        gameOver=true;
    }
    }
}

function loadImg(){
    bgImg = new Image();
    bgImg.src="imgs/bg.png"

    gunImg = new Image();
    gunImg.src="imgs/gun.png"

    bulletImg = new Image();
    bulletImg.src="imgs/bullet.png"

    
    enemyImg = new Image();
    enemyImg.src="imgs/enemy.png"

    gameoverImg = new Image();
    gameoverImg.src="imgs/gameover.png"
}

let keysDown={
}

function KeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true
    })
    document.addEventListener("keyup",function(){
        delete keysDown[event.keyCode]

    //스페이스바를 누르면 총알 발사되는 이벤트
    if(event.keyCode == 32){
        createBullet() // 총알 생성 함수
    }
    })

}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },110) //함수와 시간을 넣어서 시간마다 적군을생성하게 한다.
}

function update(){
    if(39 in keysDown){
        gunImgX += 10;
    }//right
    
    if(37 in keysDown){
        gunImgX -= 10;
    }//left
    
    if(gunImgX <= 0){
        gunImgX=0; //화면밖으로 못나가게 픽스
    }
    if(gunImgX >= canvas.width-54){
        gunImgX=canvas.width-54;
    }

    //총알의 y좌표 업데이트 함수
    for(let i=0; i<bulletList.length;i++){
        if (bulletList[i].isAlive){
            bulletList[i].update()
            bulletList[i].checkHit();}

    }

    //적의 y좌표 업데이트 함수
    for(let i=0; i<enemyList.length;i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);
    ctx.drawImage(gunImg,gunImgX,gunImgY);
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle="black";
    ctx.font = "20px Arial";

    for(let i=0; i<bulletList.length;i++){
        if(bulletList[i].isAlive){
        ctx.drawImage(bulletImg,bulletList[i].x,bulletList[i].y);}
    }

    for(let i=0; i<enemyList.length;i++){
        ctx.drawImage(enemyImg,enemyList[i].x,enemyList[i].y)
    }
}

function main(){
    if(!gameOver){
    update();
    render();
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImg,37,215,343,220)
    }
}

function createBullet(){
    let b = new Bullet() //new 생성자로 총알을 계속 만들어낼수있다.
    b.init();
}


loadImg();
KeyboardListener();
createEnemy();
main();