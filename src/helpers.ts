

export async function getImage(src:string):Promise<HTMLImageElement>{
	let im = new Image()
	im.src = src
	return new Promise((res)=>im.onload = () => res(im))
}