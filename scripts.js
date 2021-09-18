var mouseX = 0;
var mouseY = 0;

let fallSpeed = 2;
var trashItems = [];

let lives = 10;
let score = 0;

let scoreP;
let livesP;

let fallInterval = 200;

document.getElementById("lives").style.left = (document.getElementsByTagName("body")[0].clientWidth - 802) / 2 - 30 + "px";

var game = {
	canvas: document.getElementById("gameCanvas"),
	key: false,
	start: function ()
	{
		this.canvas = document.getElementById("gameCanvas");
		this.canvas.width = 800;
		this.canvas.height = 600;
		this.context = this.canvas.getContext("2d");
		clearInterval(this.interval);
		this.interval = setInterval(updateGame, 10);
		this.frameNo = 0;
		document.body.addEventListener("mousemove", updateMousePos);
		scoreP = document.getElementById("score");
		livesP = document.getElementById("lives");
		window.addEventListener('keydown', function (e)
		{
			console.log(e.key);
			game.key = e.key;
		});
		window.addEventListener('keyup', function (e)
		{
			game.key = false;
		});
	},
	restart: function ()
	{
		clearInterval(this.interval);
		trashItems = [];
		lives = 10;
		score = 0;
		fallSpeed = 2;
		fallInterval = 200;
		this.start();
	},
	stop: function ()
	{
		clearInterval(this.interval);
	},
	clear: function ()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function trashComponent(width, height, image, x, y, colorId)
{
	this.width = width;
	this.height = height;
	this.image = image;
	this.x = x;
	this.y = y;
	this.colorId = colorId;
	this.update = function ()
	{
		ctx = game.context;
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	this.crashWith = function (otherobj)
	{
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))
		{
			crash = false;
		}
		return crash;
	}
}

function binComponent(width, height, image, x, y, colorId)
{
	this.width = width;
	this.height = height;
	this.image = image;
	this.x = x;
	this.y = y;
	this.colorId = colorId;
	this.update = function ()
	{
		ctx = game.context;
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

function updateBinImage(color, colorId)
{
	bin.image = document.getElementById(color);
	bin.colorId = colorId;
}

function updateMousePos(event)
{
	var rect = game.canvas.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
}

let started = false;
function startGame()
{
	if (!started)
	{
		game.start();
		bin = new binComponent(100, 160, document.getElementById("blue-bin"), 0, 440, 0);
		started = true;
	}
	else
	{
		game.restart();
		bin = new binComponent(100, 160, document.getElementById("blue-bin"), 0, 440, 0);
	}
}

function summonTrash()
{
	x = Math.floor(Math.random() * (game.canvas.width - 100) + 50);
	y = 0;
	let trash = Math.floor(Math.random() * 3);
	switch (trash)
	{
		case 0:
			trashItems.push(new trashComponent(100, 100, document.getElementById("paper"), x, y, 0));
			break;
		case 1:
			trashItems.push(new trashComponent(100, 100, document.getElementById("plastic"), x, y, 1));
			break;
		case 2:
			trashItems.push(new trashComponent(100, 100, document.getElementById("glass"), x, y, 2));
			break;
	}
}

function updateGame()
{
	switch (game.key)
	{
		case "q":
			updateBinImage("blue-bin", 0);
			break;
		case "w":
			updateBinImage("yellow-bin", 1);
			break;
		case "e":
			updateBinImage("green-bin", 2);
			break;
	}
	game.clear();
	game.frameNo++;
	bin.x = mouseX - bin.width / 2;

	if (game.frameNo == 1 || game.frameNo % fallInterval == 0)
	{
		summonTrash();
	}

	for (let i = 0; i < trashItems.length; i++)
	{
		if (trashItems[i].crashWith(bin))
		{
			if (trashItems[i].colorId == bin.colorId)
			{
				trashItems.splice(i, 1);
				fallInterval = Math.ceil(fallInterval * 0.95);
				score += 10;
			}
			else
			{
				trashItems.splice(i, 1);
				score -= 20;
				lives -= 2;
			}
		}
		trashItems[i].y += fallSpeed;
		if (trashItems[i].y > game.canvas.height)
		{
			trashItems.splice(i, 1);
			lives -= 1;
		}
		trashItems[i].update();
	}

	let livesText = ""
	for (let i = 0; i < 10; i++)
	{
		if (i < lives)
		{
			livesText += '<img class="lives" src="img/earth.png" alt="V" width="30" height="30">';
		}
		else
		{
			livesText += '<img class="lives" src="img/earth-dead.png" alt="X" width="30" height="30">';
		}
	}

	livesP.innerHTML = livesText;
	scoreP.innerHTML = "Wynik: <b>" + score + "</b>";

	if (lives <= 0)
	{
		game.stop();
		game.clear();
		game.context.font = "30px Arial";
		game.context.fillStyle = "red";
		game.context.fillText("Koniec gry!", game.canvas.width / 2 - 80, game.canvas.height / 2);
		game.context.fillText("Twój wynik to: " + score, game.canvas.width / 2 - 80, game.canvas.height / 2 + 30);
	}

	document.getElementById("lives").style.left = (document.getElementsByTagName("body")[0].clientWidth - 802) / 2 - 30 + "px";

	bin.update();
}