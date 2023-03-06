//@ts-ignore
import Cookies from "js-cookie"


let c = document.querySelector('canvas');
export var ctx = c.getContext('2d');

const cw = 1000;
const ch = 600;
c.width = cw
c.height = ch


async function getImage(src:string):Promise<HTMLImageElement>{
	let im = new Image()
	im.src = src
	return new Promise((res)=>im.onload = () => res(im))
}



export let game = {
  'treeGrowthSpeed':5000,
  'harvestSpeed':1000,
	'truckSpeed':35,
  'priceMultiplier':1,
  'factorySpeed':1,
  'workerSpeed':1,
  'clickMultiplier':1,
	'treeQuality':1,
  'money':0,
  
};

export let world = {
	'gravity':2,
	'drag':0.94,
	'keyDown':false,
}

export let prices = {
	'treeGrowthSpeed':10,
  'harvestSpeed':10,
	'truckSpeed':80,
  'priceMultiplier':100,
  'factorySpeed':15,
  'workerSpeed':50,
  'clickMultiplier':150,
	'treeQuality':15,
}

export const truck = {
  'image' : await getImage('images/truck.png'),
	'filledImage' :await getImage('images/filledTruck.png'),
  'x':800,
  'y':10,
  'anim':0,
  'filled':true,
};

export const woodChipper = {
  'image':await getImage('images/chipper.png'),
  'x':200,
  'y':100,
  'anim':0,
}

export const boiler = {
  'image':await getImage("images/boiler.png"),
  'x':330,
  'y':100,
  'anim':0,
}

export const cutter = {
  'image':await getImage('images/cutter.png'),
  'x':540,
  'y':100,
  'anim':0,
}

export const paperPress = {
  'image':await getImage('images/paperPress.png'),
  'x':450,
  'y':100,
  'anim':0,
}

export const tp = {
	'image':await getImage('images/tp.png'),
  'arr':[[610,140]]
};

export const trees = {
	'image':await getImage('images/tree.png'),
  'arr':[[100,200]]
};

export const upgrades = {
	'image' :await getImage('images/upgrades.png'),
	'x':220,
	'y':225,
	'w':500,
	'h':90,
}

export const audio = {
	'click' :new Audio("/audio/click.wav"),
	'coin':new Audio("/audio/coin.wav"),
	'mute':await getImage('images/mute.png'),
	'unmute':await getImage('images/unmute.png'),
	'muted':false,
	changeState(){

		if(this.muted){
			this.muted = false;
			this.click.volume = 1;
			this.coin.volume = 1;
		}else{
			this.muted = true;
			this.click.volume = 0;
			this.coin.volume = 0;
		}
	},
	draw(){
		if(this.muted){
			ctx.drawImage(this.mute,950,5,40,40)
		}else{
			ctx.drawImage(this.unmute,950,5,40,40)
		}
	}
}


function background(){
  ctx.clearRect(0,0,1000,600);
  ctx.fillStyle = 'lime';
  ctx.fillRect(0,0,1000,600);
  ctx.fillStyle = '#b5a47d';
  ctx.fillRect(790,0,200,600);

  ctx.fillStyle= '#ffb08b';
  ctx.fillRect(0,0,1000,50);

	ctx.fillStyle = 'black'
	ctx.font = '18px serif'
	ctx.textAlign = 'left'

	ctx.fillText('Welcome to your very own toilet paper factory. Press space to grow a tree. ',200,530)
	ctx.fillText('Upgrade different aspects of your factory by clicking on the assorted buttons.',200,550)
	ctx.fillText("Don't forget to save your progress before ",200,570)
	ctx.fillText("closing the window. ",200,590)


	ctx.fillStyle= '#black';
  ctx.fillRect(660,560,100,30);
	ctx.fillRect(580-40,560,100,30);

	ctx.textAlign = 'center'
	ctx.font ='14px serif'
	ctx.fillStyle = 'white';
	ctx.fillText('Save Progress',710,578,90)
	ctx.fillText('Load Progress',590,578,90)
}

function drawBoiler(){
  ctx.drawImage(boiler.image,0,boiler.anim*100,100,100,boiler.x,boiler.y,100,100)
}



function drawTP(){
	for(let i in tp.arr){
		ctx.drawImage(tp.image,tp.arr[i][0],tp.arr[i][1])
	}
}

function drawUpgrades(){
	ctx.drawImage(upgrades.image,upgrades.x,upgrades.y,upgrades.w,upgrades.h)

	ctx.lineWidth = 8;
	ctx.beginPath()
	ctx.moveTo(200,315)
	ctx.lineTo(750,315)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(200,505)
	ctx.lineTo(750,505)
	ctx.stroke()
}

function drawPaperPress(){
  ctx.drawImage(paperPress.image,0,paperPress.anim*100,100,100,paperPress.x,paperPress.y,100,100)
}

function drawMoney(){
  ctx.fillStyle='black';
  ctx.font = "45px Georgia";
  ctx.textAlign = 'left'
  ctx.fillText('Money : '+Math.round( game.money ),10,38 ,300)

	ctx.fillText('Money Per Second : '+Math.round( moneyCalc() / (game.harvestSpeed / 1000) *1000 )/1000,300,38 )
}

function drawUpgrade(){
  ctx.fillStyle='black';
  ctx.font = "12px Georgia";
  ctx.textAlign = 'center'

  ctx.fillText('Natural Growth Speed',250,340, 100)
  ctx.fillRect(200,450,100,30);
  ctx.fillText('Tree Harvest Speed',250,440, 100)
  ctx.fillRect(200,350,100,30);
  ctx.fillText('Truck Speed',400,340, 100)
  ctx.fillRect(350,450,100,30);
  ctx.fillText('Larger Trees',400,440, 100)
  ctx.fillRect(350,350,100,30);
  ctx.fillText('Factory Speed',550,340, 100)
  ctx.fillRect(500,450,100,30);
  ctx.fillText('Boiler Efficiency',550,440, 100)
  ctx.fillRect(500,350,100,30);
  ctx.fillText('Speedier Planting',700,340, 100)
  ctx.fillRect(650,450,100,30);
  ctx.fillText('High Quality Trees',700,440, 100)
  ctx.fillRect(650,350,100,30);

	ctx.fillStyle='white'

	ctx.fillText('$'+ Math.round( prices.treeGrowthSpeed),250,368, 100)
	ctx.fillText('$'+ Math.round(prices.truckSpeed),400,368, 100)
	ctx.fillText('$'+ Math.round(prices.factorySpeed),550,368, 100)
	ctx.fillText('$'+Math.round(prices.clickMultiplier),700,368, 100)

	ctx.fillText('$'+Math.round(prices.harvestSpeed),250,468, 100)
	ctx.fillText('$'+Math.round(prices.priceMultiplier),400,468, 100)
	ctx.fillText('$'+Math.round(prices.workerSpeed),550,468, 100)
	ctx.fillText('$'+Math.round(prices.treeQuality),700,468, 100)
}

function drawTruck(){
	if(truck.y > 180){
  ctx.drawImage(truck.image,0,truck.anim*200,100,200,truck.x,truck.y,100,200)
	}else{
		ctx.drawImage(truck.filledImage,0,truck.anim*200,100,200,truck.x,truck.y,100,200)
	}
};

function drawWoodChipper(){
	ctx.drawImage(woodChipper.image,0,woodChipper.anim*100,100,100,woodChipper.x,woodChipper.y,100,100)
}

function drawCutter(){
  ctx.drawImage(cutter.image,cutter.anim*100,0,100,100,cutter.x,cutter.y,100,100)
}

function drawTrees(){
  ctx.fillStyle='brown';
  for(let i in trees.arr){
    ctx.drawImage(trees.image,trees.arr[i][0],trees.arr[i][1],60,100)

  }
}


function loadProgress(){
	if(confirm('Do you want to load your Progress')){
		if(Cookies.get('data') == undefined){
			window.alert('No savefile created')
		}else{

			let tempData = JSON.parse( Cookies.get('data') )
			game = tempData[0]
			prices = tempData[1]
			//audio.loaded = tempData[2]
			window.alert('Progress loaded')

		}
	}else{
		window.alert('Load aborted')
	}
}

function saveProgress(){
	if(confirm('Do you want to save your Progress')){
		Cookies.set('data',JSON.stringify( [game,prices] ) )
		window.alert('Progress saved')
	}else{
		window.alert('Save aborted')
	}
}

function generateTree(){
	trees.arr.push([Math.random() * 120, Math.random() * 450 + 50]) 

	window.setTimeout(generateTree,game.treeGrowthSpeed)
}

function generateTP(){
	tp.arr.push([ 610,140,Math.random()*10])
	
}

function deleteTree(){
  trees.arr.shift()
	window.setTimeout(generateTP,3000)
}

function moneyCalc(){
  return  game.priceMultiplier *( 1 / game.factorySpeed) * game.workerSpeed * (35 / game.truckSpeed) * game.treeQuality;
}



function gameOn(){
  return true;
};

window.onload = function(){
  console.log('window loaded');
	c.click()
  truckLoop()
	generateTree()
  window.setInterval(displayLoop,40);
  window.setInterval(boilerLoop,40);
	window.setInterval(chipperLoop,40);
	window.setInterval(tpLoop,30);
  window.setTimeout(harvestTreeLoop,game.harvestSpeed);


};

function harvestTreeLoop(){
  if(gameOn()){
    if(trees.arr.length > 0){
      deleteTree()
      game.money += moneyCalc()
    };
  };
	if(game.harvestSpeed >= 500){
  window.setTimeout(harvestTreeLoop,game.harvestSpeed)
	}else{
		window.setTimeout(harvestTreeLoop,game.harvestSpeed * 2.5)
	}
};

function truckLoop(){
  if(gameOn()){

    if(truck.y > -200){
      truck.y -= 2 *(game.truckSpeed / 60)
    }else if(truck.y <= -200){
      truck.y = 800
    }

  };

	if (truck.y <= 160 && truck.y >= 150){
		tp.arr = [];
	}

	

  if(truck.anim == 2){
    truck.anim = 0;
  }else{
    truck.anim ++
  };

  if(cutter.anim == 3){
    cutter.anim = 0;
  }else{
    cutter.anim ++
  };

	window.setTimeout(truckLoop,35)
};

function tpLoop(){
	for(let i in tp.arr){
		if(tp.arr[i][1] <= 180){
			tp.arr[i][0] += tp.arr[i][2];
			tp.arr[i][1] += world.gravity;
			tp.arr[i][2] *= world.drag;
		}
	}
}

function boilerLoop(){
  if(gameOn()){


    if(boiler.anim == 4){
      boiler.anim = 0;
    }else{
      boiler.anim ++
    };
  };
};

function chipperLoop(){
	if(gameOn()){
		if(woodChipper.anim == 4){
      woodChipper.anim = 0;   
    }else{
      woodChipper.anim ++
    };

		if(paperPress.anim == 29){
      paperPress.anim = 0;   
    }else{
      paperPress.anim ++
    };
	};
};

function displayLoop(){
  if(gameOn()){
    background();
    drawUpgrade()
		audio.draw()

		drawWoodChipper()
		
    drawMoney()
    drawTruck();
    drawTrees();
    drawBoiler();
    drawPaperPress()
    drawCutter()
		drawUpgrades()

		drawTP()
  };
};


document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)


function keydown(e){
  if(e.keyCode == 32){
		e.preventDefault();
    world.keyDown = true;
  };
};

function keyup(e:KeyboardEvent){
	if(e.keyCode == 32 && world.keyDown){
		world.keyDown = false;

		for(var i = 0;i<game.clickMultiplier;i++){
    trees.arr.push([Math.random() * 120, Math.random() * 450 + 50]) 
		};
  };
}


c.onclick = function (e){
    
	let ex = e.offsetX;
	let ey = e.offsetY;


	if(gameOn()){
		if(ey>=350 && ey <=380){
			if(ex >= 200 && ex <= 300){
				audio.click.play()
				// t1 button
				if(game.money >= prices.treeGrowthSpeed){
					game.money -= prices.treeGrowthSpeed;
					prices.treeGrowthSpeed *= 1.15;
					game.treeGrowthSpeed *=0.95;
					audio.click.play()
				}else{
					window.alert('insufficient funds')
				}
			}else  if(ex >= 350 && ex <= 450){
				audio.click.play()
				// t2 button
				if(game.money >= prices.truckSpeed){
					game.money -= prices.truckSpeed;
					prices.truckSpeed *= 1.15;
					game.truckSpeed *=0.98;

				}else{
					window.alert('insufficient funds')
				}
			}else  if(ex >= 500 && ex <= 600){
				audio.click.play()
				// t3 button
				if(game.money >= prices.factorySpeed){
					game.money -= prices.factorySpeed;
					prices.factorySpeed *= 1.15;
					game.factorySpeed *=0.97;
					
				}else{
					window.alert('insufficient funds')
				}
			}else  if(ex >= 650 && ex <= 750){
				audio.click.play()
				// t4 button
				if(game.money >= prices.clickMultiplier){
					game.money -= prices.clickMultiplier;
					prices.clickMultiplier *= 3;
					game.clickMultiplier *=2;
					
				}else{
					window.alert('insufficient funds')
				}
			}
		}else if(ey>=450 && ey<=480){
			if(ex >= 200 && ex <= 300){
				audio.click.play()
				// b1 button
				if(game.money >= prices.harvestSpeed){
					game.money -= prices.harvestSpeed;
					prices.harvestSpeed *= 1.15;
					game.harvestSpeed *=0.93;
					
				}else{
					window.alert('insufficient funds')
				}
			}else  if(ex >= 350 && ex <= 450){
				audio.click.play()
				// b2 button
				if(game.money >= prices.priceMultiplier){
					game.money -= prices.priceMultiplier;
					prices.priceMultiplier *= 1.15;
					game.priceMultiplier *=1.05;
					
				}else{
					window.alert('insufficient funds')
				}
			}else  if(ex >= 500 && ex <= 600){
				audio.click.play()
				// b3 button
				if(game.money >= prices.workerSpeed){
					game.money -= prices.workerSpeed;
					prices.workerSpeed *= 1.15;
					game.workerSpeed *=1.07;
					
				}else{
					window.alert('insufficient funds')
				}
			}else  if(ex >= 650 && ex <= 750){
				audio.click.play()
				// b4 button
				if(game.money >= prices.treeQuality){
					game.money -= prices.treeQuality;
					prices.treeQuality *= 2;
					game.treeQuality *=1.45;
					
				}else{
					window.alert('insufficient funds')
				}
			}
		}else if(ey >=560 && ey <= 590){

				if(ex >= 540 && ex <=640){
					audio.coin.play()
					loadProgress()
				}else if(ex >= 660 && ex <= 760){
					audio.coin.play()
					saveProgress()
				}

	//ctx.drawImage(this.mute,950,5,40,40)
			
		}else if(ex >=950 && ex <=990 && ey >= 5 && ey <=45){
			audio.changeState()
		}
	}
}

