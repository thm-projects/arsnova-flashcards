1. Öffne .cards in der IDE deiner Wahl
2. Begebe dich zur Datei clien/themeSwitcher.scss
3. Finde die entsprechende CSS-Klasse/ID (Shift+F zum suchen)
   + Um zu wissen welche CSS-Klasse/ID man braucht, müssen diese vorab im Browser mit Hilfe des Entwicklertools rausgesucht werden
   + Nun suchen wir das entsprechende Attribute raus und kopieren uns die query
4. Öffne die Datei client/theme/theme-default.scss
5. Mit hilfe von "Strg+F" suche wir nach der kopierten query von zuvor(ohne "$")
6. Hier kann nun die gewünschte Farbe eingetragen werden

   + Beispiel: "footer_navigation_background": $default_background, 
   + möchten wir die Farbe zu weiß ändern, schreiben wir:
   + "footer_navigation_background": $white,

7. Am Anfang der Datei können neue Farben eingetragen werden mit "$query-name: Farbe;"
   + query-name: Wird verwendet um die Farbe später zuzuweisen
   + Farbe: übliche Farbangabe in CSS/SCSS
8. Um die Hintergründe zu ändern oder auszuschalten ändern wir in imports/config/background.js die Einträge auf "none" oder passen die Links an. Neue Bilder können in public/img/background hinzugefügt werden.
