## Add new theme file to theme switcher
1. Copy an existing theme from `client/themes`
1. Add a reference for the new theme file in `client/themeSwitcher.scss` "$themes" at the beginning of the file

## Add new elements to theme switcher
1. open .cards in your favourite IDE
1. move to `client/themeSwitcher.scss`
1. find the css-class/id of the element you want to change
   + to know what css-class/id you need use the developer tool of your browser and find the element
1. search for the attribute you want to change and copy the query
1. open up the themes in `client/theme/`
1. with the help of "Ctrl+F" look for the copied query (without the "$")
1. here you can change the set color
   + Example: "footer_navigation_background": $default_background,
   +  If you want to change the color to white write:
   + "footer_navigation_background": $white,
1. At the beginning of the file you can set new colors with "$query-name: color;"
   + query-name: used to set the color later to the element
   + color: normal css/scss color attribute
## Change background images
1. to change the backgrounds, go to `imports/config/backgrounds.js`
1. create a new background path object or modify an existing one:
   + "none" to deactivate the background
   + or change the url to a new picture
   
Backgrounds can be found at `public/img/background`

## Apply theme color and background to installation
1. Open the server configuration file `imports/config/exportStyle.js`
1. Locate the themes object
1. Add your new theme name and background to the list


