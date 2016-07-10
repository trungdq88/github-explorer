import React from 'react';
import action, { ACTIONS } from '../action/action.js';

if ('serviceWorker' in navigator) {
  // Your service-worker.js *must* be located at the top-level directory relative to your site.
  // It won't be able to control pages unless it's located at the same level or higher than them.
  // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
  // See https://github.com/slightlyoff/ServiceWorker/issues/468
  navigator.serviceWorker.register('sw.js').then(_reg => {
    const reg = _reg;
    // updatefound is fired if service-worker.js changes.
    reg.onupdatefound = () => {
      // The updatefound event implies that reg.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      const installingWorker = reg.installing;

      installingWorker.onstatechange = () => {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will
              // have been added to the cache.
              // It's the perfect time to display a "New content is available; please refresh."
              // message in the page's interface.
              action.onNext({
                name: ACTIONS.SHOW_TOAST,
                data: {
                  message: 'New version is available!',
                  button: (
                    <a
                      onClick={() => location.reload()}
                      className="toast-button"
                    >UPDATE
                    </a>),
                  timeout: 0,
                },
              });
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              action.onNext({
                name: ACTIONS.SHOW_TOAST,
                data: {
                  message: 'Content is now available offline!',
                  timeout: 5000,
                },
              });
            }
            break;

          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
          default:
        }
      };
    };
  }).catch(e => {
    console.error('Error during service worker registration:', e);
  });
}
