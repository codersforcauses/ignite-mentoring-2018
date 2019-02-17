# Ignite Mentoring Project
## Tech Stack
Web-app
Learn HTML, CSS, JavaScript
## Meeting Days
Every Saturday, 9am-5pm
## Finish Day
When we have a product ready to present to the client
## To-do
    * Practicing HTML, CSS, JS fundamentals
    * Figure out and implement an algorithm
    * Add some css to the thing

## Project Structure
Right now the project is just purely made from HTML and JS no backend rightnow.

### File relationships
* `index.html`->`main.js`
* `index.html`-> `papaparse.min.js`
* csv files not directly imported/related to anything
* `data_gen.py` not directly import/related to anything

### `index.html`

This is the main file which you open to run the app. Simply double click it and it will open in your browser. The purpose of this file is it is like the main page to your app and provides the structure as well as importing the required JS code. You can see it importing code in these lines.
```html
<script src="papaparse.min.js"></script>
<script src="main.js"></script>
```

### `main.js`

This is the main JS code for our app. Right now it is just reading the csv by using another library called papaparse that we didn't write.

### `papaparse.min.js`

This is third party JS code you can google it for for info but we just use it to read a csv and convert it into a javascript object. The code is unreadable because it is *minified* its a process where we compress code to make it a smaller size so the user doesn't have to download as much.

### csv files

This is just our mentor data. csv stands for comma seperated values and it is just another data structure for storing data. Like JSON or even SQL tables.

### `data_gen.py`

This is just python code to help us generate some fake data.



