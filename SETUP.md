# Aleena & Sudheesh: wedding reception invitation, groom's side (25 October, Payyannur)

Upload the WHOLE folder to GitHub (index.html, app.js, config.js, images/, music/). Do not upload single files on their own,
because the page finds its photos and music by their folders.

This folder is a separate, standalone invitation for guests invited only to the groom's-side wedding reception on 25 October 2026 in Payyannur, Kannur. It shares its design with the couple's other invitations, but is otherwise independent: its own page, its own folder of photos, and, unless you choose otherwise, the same shared wishes wall (see the note in config.js) so that wishes from every invitation land in one place.

## Files and folders
- `index.html`: the invitation (text and layout)
- `app.js`: what makes it move and work (doors, countdown, music, wishes). You should not need to edit it
- `config.js`: the settings you may want to edit (wishes database and music loudness)
- `images/`: every photo on the page, one folder per section (see `images/README.txt`). Replace a file with the same name to change a photo
- `music/`: the background song (`bgm.mp3`) and notes (`music/README.txt`)
- `firebase-rules.json`: security rules for the wishes wall

## 1. Publish
Put this folder in your GitHub repo as `wedding-reception-payyannur/` (or whatever name you like — it does not need to match your other invitation folders). The page is then at `https://<account>.github.io/<repo>/wedding-reception-payyannur/`.
To check it on your own computer first, open `index.html` from the unzipped folder (keep the folders together).
Open `index.html` in a text editor and set `og:url` to the page address. `og:image` already points to
`images/social-preview/og-thumb.jpg`; for the WhatsApp preview to show, change it to the full https address of that file, for example
`https://<account>.github.io/<repo>/wedding-reception-payyannur/images/social-preview/og-thumb.jpg`.

## 2. Change photos
Every photo is its own file inside `images/<section>/`. To change one, save your new photo with the same file name (.jpg) in the same folder.
`images/README.txt` lists which file appears where, and the best shape for each.

## 3. Make wishes appear on the page for everyone (about 5 minutes, free)
A static GitHub page has nowhere to keep guests' wishes, so it needs a small database. Firebase's free plan is plenty.
1. Go to console.firebase.google.com, create a project (Google Analytics can stay off).
2. Build > Realtime Database > Create database. Pick a region near India, start in locked mode.
3. Open the Rules tab, paste everything from `firebase-rules.json`, press Publish.
4. Copy the database address shown at the top of the Data tab (it looks like
   `https://xxxx-default-rtdb.asia-southeast1.firebasedatabase.app`) into `wishesDb` in `config.js`.
5. Reload the page. Every wish now shows on the wall right after it is sent, and appears for other guests within about 10 seconds.
To remove a wish, delete it in the Firebase console (Data tab).
Until step 4 is done the page is in preview mode: wishes are kept on that one device only, and a small note says so.
To see the wall with sample wishes, add `?demo=1` to the page address.

## 4. Music
Two songs are in the `music` folder. Upload BOTH.
- `bgm-soft-25s.mp3` is the main one. It already starts at 0:25 of the song, with a soft fade-in and fade-out built into the audio, so it starts gently from the right place on every phone, including iPhone Safari.
- `bgm.mp3` is the full song and is only a safety net. If the main file is missing, the page uses this one, jumps to 0:25 and fades in from the page (works on computers and Android).
The music starts as soon as a guest taps "Open the doors". A small round button at the bottom left lets guests pause or play.
`musicVolume` in `config.js` sets how loud it plays on computers. Phones use their own volume buttons.
If the song starts from the very beginning, the new `bgm-soft-25s.mp3` was not uploaded: check that both files are in the repo's `music` folder.
Film songs are copyrighted, so make sure you are allowed to use the track publicly.

## How wishes are protected
- Every wish is drawn with `textContent`, never as HTML, so pasted code shows as plain text and cannot run.
- The page has a Content Security Policy: only its own script can run, and it can only talk to your Firebase database.
- Text is cleaned (hidden and control characters removed) and limited to 60 characters for the name and 400 for the message. Web links are refused.
- A hidden trap field catches simple bots. A wish needs at least 2 seconds of writing time. Each browser can send one wish every 30 seconds and five in total.
- Firebase itself enforces the same limits through `firebase-rules.json`: guests can only add new wishes, never edit or delete them, and cannot store extra fields.
- The rules also stop anyone downloading the whole database in one go: reads are limited to 50 wishes at a time.
- No password or secret key is stored on the page. The database address alone is not enough to change or delete anything.
- Anything read back from the database is checked again before it is shown.
Optional extra: in the Firebase console you can turn on App Check to block traffic that does not come from your page.
