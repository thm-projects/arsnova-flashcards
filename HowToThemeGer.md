## Hinzufügen einer neuen Theme-Datei
1. Kopiere ein vorhandenes Thema aus `client/themes`.
1. Fügen eine Referenz für die neue Theme-Datei in `client/themeSwitcher.scss` "$themes" am Anfang der Datei hinzu

## Neue Elemente zum Theme-Switcher hinzufügen
1. Öffne .cards in der IDE deiner Wahl
1. Begebe dich zur Datei `clien/themeSwitcher.scss`
1. Finde die entsprechende CSS-Klasse/ID (Shift+F zum suchen)
   + Um zu wissen welche CSS-Klasse/ID man braucht, müssen diese vorab im Browser mit Hilfe des Entwicklertools rausgesucht werden
   + Nun suchen wir das entsprechende Attribute raus und kopieren uns die query
1. Öffne die Datei `client/theme/theme-default.scss`
1. Mit hilfe von "Strg+F" suche wir nach der kopierten query von zuvor(ohne "$")
1. Hier kann nun die gewünschte Farbe eingetragen werden
   + Beispiel: "footer_navigation_background": $default_background, 
   + möchten wir die Farbe zu weiß ändern, schreiben wir:
   + "footer_navigation_background": $white,

1. Am Anfang der Datei können neue Farben eingetragen werden mit "$query-name: Farbe;"
   + query-name: Wird verwendet um die Farbe später zuzuweisen
   + Farbe: übliche Farbangabe in CSS/SCSS 
## Hintergrundbilder ändern
1. Die Hintergrundbilder lassen sich in `imports/config/backgrounds.js` anpassen
1. Erstelle entweder ein neues Objekt oder modifiziere ein vorhandenes:
   + "none", um den Hintergrund zu deaktivieren
   + oder passe die Links an
   
Neue Bilder können in `public/img/background` hinzugefügt werden.
   
## Themen Farbe und Hintergrundbilder zu dem Theme Switcher hinzufügen
1. Öffnen die Server-Konfigurationsdateien im Ordner `imports/config/serverStyle/style`
1. Finde das "themes" Objekt
1. Fügen in der Liste den neuen Theme Namen und Hintergrund hinzu
1. Füge in den Übersetzungsdateien unter `i18n/themes/` innerhalb der Variable "list" den Namen des Themes so wie die Übersetzung hinzu
