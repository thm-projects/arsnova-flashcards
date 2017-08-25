/**
 * @file Service worker created by Ilan Schemoul alias NitroBAY as a specific Service Worker for Meteor
 * Please see {@link https://github.com/NitroBAY/meteor-service-worker} for the official project source
 *
 * Eventlistener added for web-push notifications
 *
 */

const HTMLToCache = '/';
const version = 'MSW V0.3';

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(version).then((cache) => {
		cache.add(HTMLToCache).then(self.skipWaiting());
	}));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(cacheNames => Promise.all(cacheNames.map((cacheName) => {
			if (version !== cacheName) {
				return caches.delete(cacheName);
			}
		}))).then(self.clients.claim())
	);
});

/**
 * push eventListener.
 * shows a notification with the content of the push-event
 *
 * @param web-push notification event
 * @listens push
 */
self.addEventListener('push', function (event) {
	var payload = event.data ? event.data.text() : 'no payload';
	event.waitUntil(
		self.registration.showNotification('THMcards', {
			body: payload,
			icon: 'https://git.thm.de/uploads/project/avatar/374/cards_logo.png'
		})
	);
});