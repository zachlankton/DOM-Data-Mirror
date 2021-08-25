# DOM Data Mirror 
### (or d-data for short)

## Update 2021
Currently this project is archived, the codebase still works, but some of the PouchDB Extension functionality is broken.

## Description
### Web Apps as simple as writing HTML
DOM Data Mirror (dData for short) is an experiment created to demonstrate the possibility of writing simple applications with just HTML.

dData, by itself, doesn't necessarily accomplish this. However, dData is extensible and included in the code base are some extensions that bring this goal closer to reality.

By writing some simple extensions you can considerably reduce the amount of boilerplate and javascript required in your app. We will show how this can be done in the examples to follow.

While this project was designed with CouchDB and PouchDB in mind, the project works well as an interface between values in your DOM and any JSON data.

## Docs
Please visit https://zachlankton.github.io/DOM-Data-Mirror/ for documentation

These Docs show how to use dData and provide lots of examples, including docs on many of the extensions.

## Tests
To See Test Results on the current commit goto:
https://zachlankton.github.io/DOM-Data-Mirror/tests

## Version 2
dData2 is a complete rewrite of this original project and has stripped out all of the extensions and focuses on just being an interface between DOM and your JSON Data.  This project is not documented or maintained at all, but retains a lot of the basic functionality of this original project.  It was rewritten using considerably less code and a lot less abstractions.  Additionally, performance has been improved over the original significantly by constructing DOM in memory before updating the actual page.

New Version Here: 
https://github.com/zachlankton/dData2
