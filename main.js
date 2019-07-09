"use strict";

/**
 * ABOUT
 * 
 * This script crawls iTunes backups and renames files back to their original
 * filenames.  It specifically targets pictures and videos taken using the
 * device's own camera, along with image and video attachments sent over SMS.
 * 
 * USING THIS SCRIPT
 * 
 * First, install all dependencies by running "npm i" in this script's
 * directory.
 * 
 * Then, copy the iTunes backup files into the same directory as this script.
 * This means that the "Manifest.db" file, along with the folders named "00"
 * through "0f" need to be in the same directory as "main.js".
 * 
 * Launch a terminal, cd into this script's directory, and run this script via
 * "node main.js".  This script will create the necessary directories and copy
 * the media files described above into those directories.
 */

// dependencies
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Manifest.db', sqlite3.OPEN_READONLY);

// create output directories if necessary
createOutputDirs(["files", "files/camera", "files/sms"]);

// copy camera roll
copyFiles(
   "CameraRollDomain",
   ["jpg", "mov"],
   "Media/DCIM",
   "files/camera"
   );

// copy SMS attachments
copyFiles(
   "MediaDomain",
   ["jpg", "jpeg", "gif", "png", "mov", "mp4", "avi", "m4v", "mpg", "mpeg", "webm", "ogv"],
   "Library/SMS/Attachments",
   "files/sms"
   );


// function definitions...

/**
 * Takes in an array of paths relative to the script location and creates new
 * directories for each item in the list.
 * 
 * @param  { string[] } list - array of paths to directories
 */
function createOutputDirs(list) {
   for (let i = 0; i < list.length; i++) {
      if (fs.existsSync(`./${list[i]}`)) {
         console.log(`${list[i]} directory already exists.`);
      } else {
         fs.mkdirSync(`./${list[i]}`);
         console.log(`${list[i]} directory created.`);
      }
   }
}

/**
 * Checks to see if the file described by the iOS relativePath matches the list
 * of input file formats provided by formatsList.
 * 
 * @param  { string[] } formatsList - list of file formats to search for
 * @param  { string } relativePath - value of iOS relativePath column
 */
function checkFileType(formatsList, relativePath) {
   for (let i = 0; i < formatsList.length; i++) {
      if (relativePath.search(formatsList[i]) !== -1) {
         return true;
      }
   }

   return false;
}

/**
 * Copies all files in an iOS domain, provided the file matches a format
 * provided in the formatsList.  The correct iOSPath needs to be provided; this
 * can be gleaned from digging through the Manifest.db SQLite database created
 * by iTunes when backing up an iOS device.  The destDir is a path to a
 * destination directory of your choice.  Create the appropriate directory
 * either manually or at the beginning of this script using createOutputDirs().
 * 
 * @param  { string } domain - iOS domain e.g. MediaDomain, CameraRollDomain
 * @param  { string[] } formatsList - list of formats to try to copy
 * @param  { string } iOSPath - original path to the file on the iOS device
 * @param  { string } destDir - destination directory to copy to
 */
function copyFiles(domain, formatsList, iOSPath, destDir) {
   const sql = "SELECT * FROM Files WHERE domain = ?";

   const formatsListLength = formatsList.length;

   db.all(sql, [domain], (err, result) => {
      if (err) {
         throw err;
      } else {
         console.log(`\nNow copying ${formatsList.join(", ")} files from ${iOSPath}.\n`);
         let counter = 0;

         // add uppercase filename extensions into list
         for (let i = 0; i < formatsListLength; i++) {
            formatsList.push(formatsList[i].toUpperCase());
         }

         // iterate over the results of the SQLite query
         result.forEach(row => {
            const path = row.relativePath;

            // check to see if file meets criteria for recovery
            if (path.search(iOSPath) !== -1 && checkFileType(formatsList, path)) {
               const sha1FileName = row.fileID;
               const pathSplit = path.split("/");
               const originalFileName = pathSplit[pathSplit.length - 1];

               const pathToObfuscatedFile = `./${sha1FileName.slice(0, 2)}/${sha1FileName}`;
               const destination = `./${destDir}/${originalFileName}`;
               let dedupeDest = destination;
               let dedupeCounter = 0;

               // rename duplicate files by appending a dash and number
               while (fs.existsSync(dedupeDest)) {
                  dedupeCounter++;

                  const destAsArray = destination.split(".");
                  destAsArray[1] = destAsArray[1].concat(`-${dedupeCounter}`);

                  dedupeDest = destAsArray.join(".");
               }

               // means we had to rename our file because of a duplicate
               if (dedupeCounter > 0) {
                  const newName = dedupeDest.split("/");
                  console.log(`Duplicate filename!  Renaming to ${newName[newName.length - 1]}.`);
               }

               // actually perform the copy
               fs.copyFileSync(pathToObfuscatedFile, dedupeDest);

               // increment counter and console log out progress
               counter++;

               if (counter % 250 === 0) {
                  console.log(`${counter} files copied.`);
               }
            }
         });

         console.log(`\nCompleted copying of ${counter} ${domain} files.\n`);
      }
   });
}