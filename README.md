# ReactJS: AirBrB

### 1. Project Description

This project is implemented based on separate frontend and backend system, you can find specific command of how to run the program in the end of this file

### 2.1. Feature Set 1. Admin Auth

This focuses on the basic user interface to register and log in to the site. Login and registration are required to gain access to making bookings as a guest, leave reviews and to manage your own listings as a host.

#### 2.1.1. Login Screen
 * A unique route must exist for this screen
 * User must be able to enter their `email` and `password`.
 * If the form submission fails, a reasonable error message is shown
 * A button must exist to allow submission of form

#### 2.1.2. Register Screen
 * A unique route must exist for this screen
 * User must be able to enter their `email` and `password` and `name`
 * A confirm `password` field should exist where user re-enters their password.
 * If the two passwords don't match, the user should receive an error popup before submission.
 * If the form submission fails, a reasonable error message is shown
 * A button must exist to allow submission of form

#### 2.1.3. Logout Button
 * A logout button, when clicked, returns you to the landing screen whilst being no longer logged in.

#### 2.1.4. Items on all screens
 * On all screens, for a user who is logged in / authorised:
   * The logout button exists somewhere
   * A button exists that will take the user to the screen to view their hosted listings.
   * A button exists that will take the user to the screen to view all listings.

### 2.2. Feature Set 2. Creating & Editing & Publishing a Hosted Listing

For logged in users, they are able to create their own listings (as a host) that will become visible to all other users who have the option of booking it.

#### 2.2.1. Hosted Listings Screen
* A unique route must exist for this screen
* A screen of all of YOUR listings (that you created) is displayed, where each listing shows the:
	- Title
	- Property Type
	- Number of **beds** (not bedrooms)
	- Number of bathrooms
	- Thumbnail of the listing
	- SVG rating of the listing (based on user ratings)
	- Number of total reviews
	- Price (per night)
* Each listing should have a clickable element relating to it that takes you to the screen to edit that particular listing (`2.2.3`).
* A button exists on this screen that allows you to delete a particular listing.

#### 2.2.2. Hosted Listing Create
* On the hosted listing screen (`2.2.1`) a button should exist that allows you to create a new listing. When you click on it, you are taken to another screen that requires you to provide the following details:
	- Listing Title
	- Listing Address
	- Listing Price (per night)
	- Listing Thumbnail
	- Property Type
	- Number of bathrooms on the property
	- Property bedrooms (e.g. each bedroom could include number of beds and their type)
	- Property amenities
* Using a button, a new listing on the server is created and visibly added to the dashboard once all of the required fields have been filled out correctly.

#### 2.2.3. Edit AirBrB Listing
* A unique route must exist for this screen that is parameterised on the listing ID.
* The user should be able to edit the following: 
	- Title
	- Address
	- Thumbnail
	- Price (per night)
	- Type
	- Number of bathrooms
	- Bedrooms (incorporate editing of beds as part of bedrooms)
	- Amenities
	- List of property images
* Updates can auto-save, or a save button can exist that saves the updates and returns you to the hosted listings screen.

#### 2.2.4. Publishing a listing
 * For a listing to "go live" means that the listing becomes visible to other AirBrB users on the screen described in ``2.4``.
 * On the hosted listings screen described in ``2.2.1``, add the ability to make an individual listing "go live".
 	- A listing must have at least one availability date range (e.g. a listing could be available between 1st and 3rd of November and then between the 5th and 6th of November). 
	- The way you define the availability ranges is entirely up to you. For example, you could use the following schemas:
```javascript
//Example 1:
availability: [{ start: date1, end: date2 }, { start: date3, end: date4 }, ...];
//Example 2:
availability: [date1, date2, date3, date4, ...];
```
* (Note: If the listing has more than 1 availability range, aggregate them on the frontend and submit them all to the backend in one go when publishing the listing).

### 2.3. Feature Set 3. Landing Page: Listings and Search

When the app loads, regardless of whether a user is logged in or not, they can access the landing screen. The landing screen displays a number of listings that you as a guest may be able to book (on another screen). We recommend you create some listings (`2.2`) with one user account, and then create a second user account to build/test `2.3` so that you can view their listing as a potential booking option.

#### 2.3.1. Listings Screen
* A unique route must exist for this screen.
* This is the default screen that is loaded when a user accesses the root URL.
* This screen displays a list of all published listings (rows or thumbnails). The information displayed in each listing is:
  * Title
  * Thumbnail of property (or video if advanced)
  * Number of total reviews
  * (any more information you want, though that's optional).
* In terms of ordering of displayed published listings:
  * Listings that involve bookings made by the customer with status `accepted` or `pending` should appear first in the list (if the user is logged in).
  * All remaining listings should be displayed in alphabetical order of title.

#### 2.3.2. Search Filters
* On this listings screen, a search section must exist for the user to filter via search parameters. You are only required to be able to search by one of the parameters described below at a time.
* The search section will consists of an input text box:
  * The input text box will take in a search string, and will search title and city location properties of listings, and only display those that match.
  * You are expected to do this matching on frontend (after loading all the results from the backend).
  * You are only required to do case insensitive substring matching (of each word in the search field), nothing more complicated. 
* Other form inputs should also exist that allow the user to search by:
	* Number of bedrooms (a minimum and maximum number of bedrooms, expressed either via text fields or a slider)
	* Date range (two date fields) - only display bookings that are available for the entire date range as inputted by the user.
	* Price (a minimum and maximum price, expressed either via text fields or a slider)
	* Review ratings:
		- Sort results from highest to lowest review rating **or** from lowest to highest review rating depending
		- If there is more than one listing with the same rating, their order does not matter
* The search section must have an associated search button that will action the search to reload the results given the new filters.

### 2.4. Feature Set 4. Viewing and Booking Listings

#### 2.4.1. View a Selected Listing
 * A unique route must exist for this screen that is parameterised on the Listing ID
 * For `2.3`, when a listing is clicked on, this screen should appear and display information about a specific listing.
 * On this screen the user is given the listing they have decided to view in 2.4.1. This consists of:
	- Title
	- Address (displayed as a string, e.g. 1/101 Kensington Street, Kensington, NSW)
	- Amenities
	- Price:
		- If the user used a date range for search in `2.3.2` - display **price per stay**
		- If the user did not use a date range for search in `2.3.2` - display **price per night**
	- All images of the property including the listing thumbnail (they don't have to be visible all at once)
	- Type
	- Reviews
	- Review rating
	- Number of bedrooms
	- Number of beds
	- Number of bathrooms
 * On this screen if the user is logged in and they have made booking for this listing, they should be able to see the status of their booking (see `2.4.2`).
 * (Note: if the user has made more than 1 booking for a listing, display the status of all the bookings)

#### 2.4.2. Making a booking and checking its status
 * On the screen described in `2.4.1`, a **logged in** user should be able to make a booking for a given listing they are viewing between the dates they are after. The user enters two dates (this includes day, month and year), and assume the dates describe a valid booking, a button allows for the confirmation of the booking.
 * A user can make an unlimited number of bookings per listing even on overlapping date ranges and even if other users have already booked the property for those dates. It is up to the host to check if they have double booked their listing and accept/deny the bookings accordingly.
 * A booking's length (in days) is defined based on _how many nights_ a user spends at the listed property (this is how bookings are defined on all modern accommodation platforms). For example, a booking from the 15th to the 17th of November consists of 2 days in length - 15th to the 16th and 16th to the 17th. As this is a late addition to the specification, we will not be strictly enforcing how you chose to calculate a booking's length. So for the case described here, it could also be expressed as a 3 day long booking (15th, 16th and 17th as the 3 days).
 * Once a booking is made, the user receives some kind of temporary confirmation on screen.

#### 2.4.3 Leaving a listing review
* A logged in user should be able to leave a review for listings they've booked that will immidiately appear on the listing screen after it's been posted by the user. The review will consist of a score (number) and a comment (text). You can leave an unlimited number of reviews per listing.
* Please note: Normally you'd prohibit reviews until after a booking visit is complete, but in this case for simplicity we allow reviews to be left as soon as a booking's status becomes `accepted`.
* If the user has made more than 1 booking for a given listing, you can use any of their `bookingid`s for the purpose of leaving a review. Just as long as the booking has status `accepted`.

### 2.5. Feature Set 5. Removing a Listing, Managing Booking Requests

#### 2.5.1. Removing a live listing
 * On the hosted listings screen described in `2.2.1`, add the ability to remove a live listing from being visible to other users. 
 * Once un-published, those who had made bookings for a removed listing will no longer be able to view it on their landing screen

#### 2.5.2. Viewing booking requests and history for a hosted listing
 * A unique route must exist for this screen that is parameterised on the listing ID
 * This screen should be accessed via a button or link on the hosted listings screen `2.2.1`.
 * On this screen, a list of booking requests are provided for the listing they are viewing. For each booking request, the host is able to accept/deny it.
 * The screen should also display the following information about a listing:
	* How long has the listing been up online
	* The booking request history for this listing consisting of all booking requests for this listing and their status (accepted/denied)
	* How many days this year has the listing been booked for
	* How much profit has this listing made the owner this year
	* (Note: When counting the days and profits, inlcude all the bookings, past or future, that have been accepted for this year)

## 3. Getting Started

### 3.1. The Frontend

Navigate to the `frontend` folder and run `npm install` to install all of the dependencies necessary to run the ReactJS app. Then run `npm start` to start the ReactJS app.


### 3.2. The Backend

To run the backend server, simply run `npm start` in the `backend` directory. This will start the backend.

To view the API interface for the backend you can navigate to the base URL of the backend (e.g. `http://localhost:5005`). This will list all of the HTTP routes that you can interact with.

Your backend is persistent in terms of data storage. That means the data will remain even after your express server process stops running. If you want to reset the data in the backend to the original starting state, you can run `npm run reset` in the backend directory. If you want to make a copy of the backend data (e.g. for a backup) then simply copy `database.json`. If you want to start with an empty database, you can run `npm run clear` in the backend directory.

Once the backend has started, you can view the API documentation by navigating to `http://localhost:[port]` in a web browser.


