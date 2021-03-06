/**
 * Allow to run callbacks on Storybook startup, after stories are imported
 * Based on Meteor.startup client side implementation
 * @see https://github.com/meteor/meteor/blob/24865b28a0689de8b4949fb69ea1f95da647cd7a/packages/meteor/startup_client.js
 */
var callbackQueue = [];
var isLoadingCompleted = false;
var isReady = false;

// Keeps track of how many events to wait for in addition to loading completing,
// before we're considered ready.
var readyHoldsCount = 0;

var maybeReady = function () {
  if (isReady || !isLoadingCompleted || readyHoldsCount > 0)
    return;

  isReady = true;

  // Run startup callbacks
  while (callbackQueue.length)
    (callbackQueue.shift())();

};

var loadingCompleted = function () {
  if (!isLoadingCompleted) {
    isLoadingCompleted = true;
    maybeReady();
  }
}

if (document.readyState === 'complete' || document.readyState === 'loaded') {
  // Loading has completed,
  // but allow other scripts the opportunity to hold ready
  window.setTimeout(loadingCompleted);
} else { // Attach event listeners to wait for loading to complete
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', loadingCompleted, false);
    window.addEventListener('load', loadingCompleted, false);
  } else { // Use IE event model for < IE9
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === "complete") {
        loadingCompleted();
      }
    });
    window.attachEvent('load', loadingCompleted);
  }
}

/**
 * @summary Run code when a client or a server starts.
 * @locus Anywhere
 * @param {Function} func A function to run on startup.
 */
const onStartup = function (callback) {
  // Fix for < IE9, see http://javascript.nwbox.com/IEContentLoaded/
  var doScroll = !document.addEventListener &&
    document.documentElement.doScroll;

  if (!doScroll || window !== top) {
    if (isReady)
      callback();
    else
      callbackQueue.push(callback);
  } else {
    try { doScroll('left'); }
    catch (error) {
      setTimeout(function () { onStartup(callback); }, 50);
      return;
    };
    callback();
  }
};

export default onStartup