# Adding games and backgrounds

## How to import games and backgrounds

Backgrounds and games have an ID. The folder in which the game or
background is located ends with this ID.

Backgrounds are located in the ```/public/gameBackgrounds/``` folder.
Their folder name is ```background{id}``` - {id} is their respective id.

Games are located in the ```/public/games/``` folder.
Your folder is named ```game{id}``` - {id} is their respective id.

The entrypoint for games and backgrounds is the ```index.html```.

After you put all the files into the folder, you need to create a preview.
The preview is an image with the size 512x288. Put it in the folder as well.

### Configure games and backgrounds

After you have added the folder for the background or the game, you can
enable it by adding an entry to the config (located in
```/imports/config/lockScreen.js```).

There are several config options:
```
{
	"id": 1,// The id located in the public folder: gameID or backgroundID
	"name": {// The name of the game
		"de": "Bleibe in der Luft",
		"en": "Stay in the air"
	},
	"clockPosition": "top_right",//position of the clock if not top_right, can be following (top|bottom)_(right|left)
	"background": "#212529",//background-color if not default background color
	"preview": "preview.png",//The path to preview image after /games/game${id}/ or /gameBackgrounds/background${id}/, if not /games/game${id}/preview.png or /gameBackgrounds/background${id}/preview.png
	"features": {
		"safari": true,// Enable for safari
		"mobile": true// Enable on mobile
	},
	"maxWidth": {// Optional values, games only
		"desktop": 700,// Desktop size is a window width  >= 768 pixels (Bootstrap 3 xs breakpoint)
		"mobile": {// Mobile size is a window width  < 768 pixels (Bootstrap 3 xs breakpoint)
			"portrait": 500,
			"landscape": 400
		}
	},
	"maxHeight": {// Optional values, games only
		"desktop": 700,// Desktop size is a window height
		"mobile": {// Mobile size is a window height
			"portrait": 500,
			"landscape": 400
		}
	}
}
```

## Note for CodePen projects

You can export CodePen projects, by clicking in the lower right
on the 'Export'-Button. After you have downloaded and extracted
the archive, ensure that you have imported the license and the ```dist```
folder (if present) to the corresponding directoy.
