# itunes-backup-renamer

itunes-backup-renamer is a quick and dirty Node.js script that renames the human-unfriendly filenames created by iTunes and renames them back into their original filenames.

## Quick!  How do I use this?!

1. Create an **unencrypted** iTunes backup of your iOS device.
1. [Locate](https://support.apple.com/en-us/HT204215) the backup that iTunes created.  (The link provided goes to an Apple Support article on how to locate iTunes backups.  If this link is broken, then Apple has updated their support page and this script may no longer work on your iTunes backup.  But you can always consult a search engine for this info if you still want to try!)
1. Clone this repo to your computer.  You may require [git](https://git-scm.com/).
1. `cd` into the cloned repo and run `npm i` to install dependencies.
1. Copy the contents of the iTunes backup into the cloned repo.  Yes, that means all the folders named `00` through `ff` and the `Manifest.db` file are sitting alongside `main.js`.
1. Run `node main.js` in your terminal and wait for the script to finish.
1. Your files are now sitting inside the `files` directory.

## Motivation
There are a ton of trialware and shareware apps (that look a whole lot friendlier and more polished!) that will help you recover files from your iOS device.  However, they are often limited in their capabilities until you pony up the $20 or $30 to fully unlock all their features.  I did not want to pay $20 or $30.

## What does it do?

This script crawls the iTunes-created backup for jpg and mov files captured by the device's camera, along with most images and videos sent to or from the device via SMS/MMS.  It then copies them to the `files` directory under a more human-friendly name.

## How does it work?

Apple obfuscates files saved from iOS devices via the iTunes backup function.  The filenames on your local machine are SHA-1 hashes of the concatenation of the iOS domain, the dash character `-`, and the path to the file on the iOS device.  A SQLite database is also saved under the name `Manifest.db` in the backup folder.  This database stores both the obfuscated name and the original filename.

This script uses that record to rename the obfuscated names back to the original names.  If duplicate filenames are encountered, a dash and number are appended to the filename but before the file extension.

## Requirements

I may rewrite this in a compiled language.  Unfortunately, this was written in JavaScript, my strongest language.  Therefore, you will require the following to run this:
* [git](https://git-scm.com/) - the easiest way to get this script.
* [Node.js](https://nodejs.org/) - this script is untested on versions below 10.16 LTS!  Or above, for that matter.
* [sqlite3](https://www.npmjs.com/package/sqlite3) - installed via `npm i`
* [iTunes](https://www.apple.com/itunes/download/) - to create the iTunes backup
* An iOS device.  Otherwise, you wouldn't have this problem to begin with, right!?

## Caveats

tl;dr:  Does not work on older versions of iOS.  Does not target audio files at all.  I haven't tested this script on anything other than Windows, but hope it will just work on other platforms.

Apple changes how they save files on iOS devices every so often, so this script probably only works on recent versions of iOS.  I am not totally sure which versions, as I only wrote this to save files off a relative's iPhone and am not an iOS user myself!  He also didn't store any music on his iPhone, which is why this script doesn't currently target audio files.

And now for some fun copypasta, because I guarantee absolutely nothing:

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**