window.onload = function() {

    // A cross-browser requestAnimationFrame
    // See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
/*
    // Install logic
    // If the app has already been installed, we don't do anything.
    // Otherwise we'll show the button, and hide it when/if the user installs the app.
    var installButton = document.getElementById('install');
    var manifestPath = AppInstall.guessManifestPath();

    if(AppInstall.isInstallable()) {

      // checking for app installed is an asynchronous process
      AppInstall.isInstalled(manifestPath, function isInstalledCb(err, result) {

        if(!err && !result) {

          // No errors, and the app is not installed, so we can show the install button,
          // and set up the click handler as well.
          installButton.classList.remove('hidden');

          installButton.addEventListener('click', function() {

            AppInstall.install(manifestPath, function(err) {
              if(!err) {
                installButton.classList.add('hidden');
              } else {
                alert('The app cannot be installed: ' + err);
              }
            });

          }, false);

        }

      });

    }
*/

    // Create the canvas
    var mainContainer = document.querySelector('main');
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;
    mainContainer.appendChild(canvas);
	
	var background = new Image();
	var img = new Image(); 	//	create new img element
	var enemy = new Array(5);
	var enemyX;
	
	background.addEventListener("load", function()
	{
		ctx.drawImage(background, 0, 0);
	}, false);
	
	background.src = 'bg1.png';
	
	//img.onload = function()
	img.addEventListener("load", function()
	{
		ctx.drawImage(img, 100, 100);
	}, false);
	
	img.src = 'ship.png';	//	set source path
	
	for(i = 0; i < enemy.length; i++)
	{
		ctx.fillStyle = '#0000FF';
		enemy[i] = {
			x: Math.random() * 400,
			y: Math.random() * 500,
			enemySizeX: 20,
			enemySizeY: 20
		}
		//enemyX = Math.floor(Math.random() * 100);
		//ctx.fillStyle = '#00FF00';
		//ctx.fillRect(100, 100, enemyX, 50);
	};

    // The player's state
    var player = {
        x: 0,
        y: 0,
        sizeX: 30,
        sizeY: 30
    };

    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    // Let's play this game!
    reset();
    var then = Date.now();
    var running = true;
    main();


    // Functions ---


    // Reset game to original state
    function reset() {
        player.x = 0;
        player.y = 0;
    }

    // Pause and unpause
    function pause() {
        running = false;
    }

    function unpause() {
        running = true;
        then = Date.now();
        main();
    }

	/*	Motion Equations
	*	
	*	d = (vi * t) + (1/2 * a * t^2)
	*
	*	vf = vi + (a * t)
	*
	*	vf^2 = vi^2 + (2 * a * d)
	*
	*	d = ((vi + vf) / 2) * t
	*
	*	where:
	*		d = distance
	*		vf = final velocity
	*		vi = initial velocity
	*		a = acceleration
	*		t = time
	*
	*/
	
	var d;
	var vf;
	var vi = 1;
	var a = 60;
	var t = 1;
	
	var jumpTimer;
	
	
	var jump = function()
	{
		//ctx.clearRect(0, 0, 750, 500);
		console.log('function jump works');
		player.y = (vi * t) + (1/2 * a * t^2);
		a -= 0.98;
		if (a < 1)
		{
			clearInterval(jumpTimer);
			jumpTimer = null;
			a = 60;
			vi = 1;
			t = 1;
		}
		//vi += 1;
		t += 0.5;
	}
		
    // Update game objects.
    // We'll use GameInput to detect which keys are down.
    // If you look at the bottom of index.html, we load GameInput
    // from js/input.js right before app.js
    function update(dt) 
	{
        // Speed in pixels per second
        var playerSpeed = 100;

        if(GameInput.isDown('DOWN')) {
            // dt is the number of seconds passed, so multiplying by
            // the speed gives you the number of pixels to move
            player.y += playerSpeed * dt;
        }

        if(GameInput.isDown('UP')) {
            //player.y -= playerSpeed * dt;
			if (player.y >= 20)
			{
				//youY -= 5;
				if (!jumpTimer)
				{
					jumpTimer = setInterval(jump, 30);
				}
			}
        }

        if(GameInput.isDown('LEFT')) {
            player.x -= playerSpeed * dt;
        }

        if(GameInput.isDown('RIGHT')) {
            player.x += playerSpeed * dt;
        }

        // You can pass any letter to `isDown`, in addition to DOWN,
        // UP, LEFT, RIGHT, and SPACE:
        // if(GameInput.isDown('a')) { ... }
		
		for (var i = 0; i < enemy.length; i++)
		{
			if (player.x < enemy[i].x + enemy[i].enemySizeX  && player.x + player.sizeX  > enemy[i].x &&
			player.y < enemy[i].y + enemy[i].enemySizeY && player.y + player.sizeY > enemy[i].enemySizeY) 
			{
				// The objects are touching
				ctx.fillStyle = '#FF0000';
			}
		}
		
		/*
		*
		*
		*				Simple Collision Detection
		*
		*		if (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
		*			object1.y < object2.y + object2.height && object1.y + object1.height > object2.y) 
		*		{
		*			// The objects are touching
		*		}
		*
		*
		*/
    }

    // Draw everything
    function render() {
		ctx.clearRect(0, 0, 600, 400);
        ctx.drawImage(background, (-1 * player.x) / 10, (-1 * player.y) / 10);
		ctx.drawImage(img, player.x, player.y);
		//ctx.drawImage(enemy, 100, 100, 50, 50);
		ctx.beginPath();		//begin a line
		ctx.moveTo(100, 100);	//set starting point
		ctx.lineTo(player.x, player.y);	//set ending point
		ctx.stroke();			//draw the line
		for(var i = 0; i < enemy.length; i++)
		{
			ctx.fillRect(enemy[i].x, enemy[i].y, enemy[i].enemySizeX, enemy[i].enemySizeY);
		}
		console.log("player.x: " + player.x + "\tplayer.y: " + player.y + "\tTest Count: " + "\ta: " + a + "\tt: " + t + "\tvi: " + vi + "\tpressedKey: ");

		//ctx.fillStyle = 'green';
        //ctx.fillRect(player.x, player.y, player.sizeX, player.sizeY);
    }

    // The main game loop
    function main() {
        if(!running) {
            return;
        }

        var now = Date.now();
        var dt = (now - then) / 1000.0;

        update(dt);
        render();

        then = now;
        requestAnimFrame(main);
    }


};