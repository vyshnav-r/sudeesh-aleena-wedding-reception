BACKGROUND MUSIC
================
Two files live in this folder. Upload BOTH, together with the rest of the folder.

  bgm-soft-25s.mp3   the main file. It already begins at 0:25 of the song, with a soft fade-in (about 6 seconds)
                     and a fade-out at the end built into the audio. That is why it starts gently and from the
                     right place on every phone and browser, including iPhone Safari, which does not let a web page
                     change the volume or jump to a point in a song.
  bgm.mp3            the full song. It is only a safety net: if bgm-soft-25s.mp3 is missing, the page uses this one,
                     jumps to 0:25 and fades in from the page (this works on computers and Android; iPhones may start
                     it abruptly).

The music starts as soon as a guest taps "Open the doors". A small round button at the bottom left lets guests
pause or play. When the song ends it plays again from the start of the main file.

To change the starting point or the fades, ask your developer to re-cut bgm-soft-25s.mp3. To use another song,
replace both files, keeping the names. Keep each file under about 6 MB (a 3 to 4 minute mp3 at 128 kbps is roughly 3 MB).
Phones may keep an old copy of a song, so after changing a file the version number in app.js should be raised.

Only use a track you have the right to share publicly. Commercial film songs are copyrighted and the page
could be taken down; a licensed or royalty-free track avoids that.
