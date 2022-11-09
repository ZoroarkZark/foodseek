# FoodSeek UI 

*A Food Social Media Platform*


# Attention: 

This README is only a partial description of the overall application FoodSeek. All of the contents discussed in this document pertain specifically to the UI (front-end) portion of the application. Please see the repository's top-most directory to find the README for the back-end (sever/database) design. 


---

# Background

> The U.S. sends about 63 million tons of food to landfills each year... At the same time, 11 percent of U.S. households were food insecure in 2018. (The Global Food Donation Policy Atlas. mapping the barriers to food donation. 2020)

Food retailers struggle with logistical and communicational barriers which may impede or prevent donations of their unsold food items. Risks associated with concerns for liability, transportation costs, and additional labor costs incurred to accomadate the donation process further discourages food retailers from donating. Design and implementation for this application must address these concerns by reducing risk for vendors and providing incentives for use wherever possible.
---

# Goal
Providing a convenient, quick, and easy-to-use interface for a consumer type user (hereinafter referred to as 'Seeker') to engage with food retailers (hereinafter referred to as FoodSeek 'Partners' or 'Vendors') for the purpose of reducing food waste and food insecurity.



---

# Features
  - Account Registration and login authentication for both of the user types (Seeker/Vendor).
    * Vendors can submit business location, contact details, menu, and hours of operations, as well as save preferences such as time limits for food cards and prefilled post templates.
    * Seekers can save favorites, set a default location, specify their preferred travel method for transit estimations, and set dietary preferences for auto-filtering search results.
  - Post creation and listing for advertising available donations.
    * Post creation for Vendors to submit formatted postings (_food cards_) with visual content provided from the uploaded menu, a device's camera, or the device photo gallery.
    * Post search/listing with filters for Seekers to view listings that are relevant to them based on dietary preferences/requirements, proximity, and acccessibility.
    * 
  - Reservation system
    * Helper animations/text explains a well defined transactional model for how this process will go. 
    * Confirmed reservations result in automatically sharing the necessary information between both parties so both can share expectations of service.
    * Standardized transactional model reduces time wasted by limiting the amount of communication necessary to facilitate the pickup.
    * A history of postings can be preserved to account for Vendor donations adding the option for the vendor to export data for their own purposes.
    
---

# Application Preview (Screenshots/Animations) 

Login Screen

![Ze 1](https://user-images.githubusercontent.com/48034253/200879306-ad356428-b5a5-4017-ba99-d540ae173660.jpg)

Map Screen

![Ze2 1](https://user-images.githubusercontent.com/48034253/200879448-11179ba8-76e3-4213-8e03-c1a5b6a453f0.jpg)


---


# Tools/Resources/Libraries
We had utilized Visual Studio Code for our coding environment. In order to work with React Native and Expo, its framework, which are designed for designing the frontend of the application, Node.js, Git, and Watchman (if MacOS or Linux) is needed.


For designing the frontend, we had utilized different libraries:

The standard React + React-Native libraries, for basic usage, such as buttons, styling, and general UI design.

The React Navigation library, for navigation throughout the app.

The React Native Rapi UI library, for more refined UI elements and cleaner usage of said elements.

The React Native Asynchronous Storage library, to allow for saving values more directly into a file within the app.

The React Native Gesture Handler library, for introducing more refined touch screen-based elements into the app.

The Expo Camera library, for being able to utilize the camera for uploading images of the post's food in questions.

The Geolib library, for determining distance between different points on a map, for post distance calculation.


---

# Environment Installation



---


# How to Run/Test



---

# Description of File Structure



---

# Description of Important Data Structures



---


# Attributions



---

