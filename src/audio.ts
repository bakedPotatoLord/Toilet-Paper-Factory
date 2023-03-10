import { getImage } from "./helpers";

import click from "./assets/click.wav"
import coin from "./assets/coin.wav"
import mute from "./assets/mute.png"
import unmute from "./assets/unmute.png"

export const audio = {
	'click' :new Audio(click),
	'coin':new Audio(coin),
	'mute':await getImage(mute),
	'unmute':await getImage(unmute),
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
	draw(ctx:CanvasRenderingContext2D){
		if(this.muted){
			ctx.drawImage(this.mute,950,5,40,40)
		}else{
			ctx.drawImage(this.unmute,950,5,40,40)
		}
	}
}

