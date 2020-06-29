1. open .cards in your favourite IDE
2. move to client/themeSwitcher.scss
3. find the css-class/id of the element you want to change
   + to know what css-class/id you need use the developer tool of your browser and find the element
4. search for the attribute you want to change and copy the query
5. open up client/theme/theme-default.scss
6. with the help of "Ctrl+F" look for the copied query (without the "$")
7. here you can change the set color

   + Example: "footer_navigation_background": $default_background,
   +  If you want to change the color to white write:
   + "footer_navigation_background": $white,

8. At the beginning of the file you can set new colors with "$query-name: color;"
   + query-name: used to set the color later to the element
   + color: normal css/scss color attribute
9. to change the backgrounds, go to imports/config/backgrounds.js
   + "none" to deactivate it
   + or change the url to a new picture

