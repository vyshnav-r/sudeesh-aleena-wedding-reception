/* Settings for the invitation. Everything here is optional. */
window.WEDDING_CONFIG = {
  // SHARED WISHES WALL. Paste your Firebase Realtime Database address here so that every wish
  // appears on the page for all guests. See SETUP.md (about 5 minutes, free).
  // Example: 'https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app'
  // Left empty, the page runs in preview mode: wishes stay on the visitor's own device only.
  wishesDb: '',

  // Where wishes are stored inside the database (letters, numbers, - and _ only)
  wishesNode: 'aleena-sudheesh/wishes',

  // Background music loudness on computers, 0.1 (very soft) to 1 (full). Phones use their own volume buttons.
  // The songs live in the music folder (see music/README.txt).
  musicVolume: '0.5'
};
