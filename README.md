# 1. Overview
This exercise implements a simple web-app to partially display Cardiff University's Open Day information, sourced from a JSON file (OpenDay.json). The application features a home page with a grid of topic tiles, with search and sorting implemented. The implementation uses HTML, CSS, and JavaScript for frontend, with a Python Flask server to serve the JSON data through an API.

# 2. Features

## a. Header:
A header with a topics dropdown shows a list of all the topics available for the CU Open Day event. hovering over the topics shows a sub-section of all the programs under that topic. This section is followed by a banner image.

## b. Tiles Grid:
Displays all topics in a responsive grid.
Each tile includes an image, title, description, start/end date-time, and a "More Info" button.
More Info button would Ideally take the user to a new page that shows a similar grid with tiles of all the 'programs' under the selected Topic. This has not been implemented yet due to time constraint.

## c. Search Functionality:
A search bar allows users to filter topics by matching terms in the topic name (title) or description (short description).
Case-insensitive search with a "Clear" button to reset the filter.

## d. Sort Functionality:
A dropdown to sort topics by:
* Title (A-Z or Z-A).
* Start Date (Earliest or Latest).
Sorting applies to filtered search results too.

# User Guide to run the Exercise
### Prerequisites
* Python 3.x: Ensure Python is installed on the system.
* Web browser (tested on chrome and edge)

### Install Dependencies
Install Flask and flask-cors:
```bash
pip install flask flask-cors
```

### Start the Flask server
open the terminal in the 'backend' directory and run the server.py file.
```bash
python server.py
```
The server will start on http://127.0.0.1:5000. We can test the API by running http://127.0.0.1:5000/api/openday in the browser, which should display the JSON data.

The front-end files need to be served over HTTP due to CORS restrictions. Open a new terminal in the 'backend' directory and run the following command to run Python’s built-in HTTP server:
```bash
python -m http.server 8000
```
Now, with the server running, hit the following url: http://localhost:5000/openday on your favourite browser to veiw the application. The home page should load, presenting all the data. You can try out various screen sizes to check the responsiveness of the application. (Note: Only the home page is implemented as part of this exercise).
Alternatively, you can navigate to the frontend directory and open the index.html file directly. If the data fails to load, check the error messages in the console, ensure all the dependencies are installed and check if the server is running without errors.

# Frameworks Used
HTML/CSS/JavaScript: For the front-end structure, styling, and functionality.
Bootstrap 5.3.5 (CDN): For responsive design and UI components.
jQuery 3.7.1 (CDN): For DOM manipulation and AJAX requests.
Flask: Python framework to create a simple API server.
flask-cors: To handle CORS and allow cross-origin requests.

# Challenges 
* In this implementation, the server returns the entire JSON file as a response. Ideally, we should have module specific APIs that return relevant data so as to keep the responses readable and lightweight (not implemented due to time constraint).
* Data should ideally be served by a database. Using JSON files to read and store data can prove difficult to track and maintain. They can also cause concurrent file write issues, potentially leading to data loss.
* There are a few typo special characters (Â, €, ™, â) that are present in the description text. In this implementation, I have written a script to remove them on the frontend, although ideally, data sanitization should be implemented at database/server level.
* Multiple programs under a topic have the same information with different IDs. We need to avoid such redundancies in data, or investigate further on why they are needed.