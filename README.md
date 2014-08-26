thou_hast_been
==============

End users allow mobile device to regularly send GPS coordinates and other usage data such as photos, photos' time taken, photo's location where taken to thou_hast_been and enjoy looking at compiled data in some fashion on the web app.

The web app will likely have a map and a date range picker and display the user's travel routes over that date range and thumbnails of the photos they took at the location on the map where they took them. Clicking on photos should enable viewing at a large scale and inform the user the datetime they were taken. The route may, in the future have a gradient color to show the progress of travel over the time range.

Instructions to start developing:

1. install nodejs
2. install nodemon globally [npm install -g nodemon]
3. install mongodb (no other configurations need to be made as the app will generate mongo documents on its own)
3. clone this git
4. run npm install in the program directory to install necessary dependencies (listed in package.json)
5. run nodemon index.js to start up the app

<strong>Onboarding Guide</strong>

This application is a web server and future API for mobile device applications that will be built. Separate repos will house those. This is a learning focused project to teach Node.js as well as RESTful APIs and the Mongodb database system.

All of the source code in this repo pertains to the web server / web application. It is written in Node.js and uses the Express module to simplify much of the dirty details such as routing and parsing the URL string. Other modules are added as the application needs them. Install modules easily by running

npm install --save <module_name>

This will automatically update your package.json file.

Issues can be found under https://github.com/thedouglenz/thou_hast_been/issues. They follow a basic rating system:
super-super-easy, super-easy, easy, easy-medium, medium, medium-hard, hard, super-hard, super-super-hard.

They also have a primitive priority system. The highest priority issue at any time will have the label "my-dawg" because you're my dawg if you can take this one off my hands. These tend to be annoying but necessary features or bugs.

The starting point of the app is index.js. The command << nodemon index.js >> will start the app up locally and adapt to changes when index.js is modified. You can also change nodemon's settings so that it restarts the server when ANY file is changed which is my preference.

About Mongodb:

Within the app, the mongoose module is used as node's driver for mongdb. Outside the app you may want to browse your local mongo database. To do so run 

mongo

at the shell and type 'use thou' to select the database for this app. Mongodb understands Javascript syntax.

A few quick commands to get you started:

db.users.find(); // List all entries in the users collection

db.users.remove({key : value); // Delete an entry from the users collection based on a condition (like a where clause)

