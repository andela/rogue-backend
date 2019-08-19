

[![](https://img.shields.io/badge/Reviewed_By-Hound-blueviolet)](https://houndci.com)
[![Build Status](https://travis-ci.com/andela/rogue-backend.svg?branch=develop)](https://travis-ci.com/andela/rogue-backend)
[![Coveralls github branch](https://img.shields.io/coveralls/github/andela/rogue-backend/develop.svg?style=plastic)](https://coveralls.io/github/andela/rogue-backend?branch=develop)
[![Build Status](https://travis-ci.com/andela/rogue-backend.svg?branch=develop)](https://travis-ci.com/andela/rogue-backend)

# Barefoot Nomad
Barefoot Nomad is an application that will enable its "Company Nomads" book their international travel and accommodation globally, easily and conveniently across all the locations/centers where the company has its operation.

### Vision
Our vision is to make global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

### Technologies
* [Es6+ Javascript](https://www.ecma-international.org/ecma-262/9.0/index.html) The project was written with ES6 syntax and above.
* [Node/Express](https://nodejs.org/en/) A JavaScript runtime built on Chrome's V8 JavaScript engine.
* [PostgreSQL](https://www.postgresql.org/) The World's Most Advanced Open Source Relational Database.
* [Swagger](https://swagger.io/) Used for API documentation. Simplify API development for developers by helping to document APIs.
* [Pivotal Tracker](https://www.pivotaltracker.com) A project management tool used to manage the app.
* [Figma](https://www.figma.com/) Used for design mockups. It helps teams to design, prototype, and collaborate all in the browser.
* [Yarn](https://yarnpkg.com/lang/en/) Used as the package manager for the app. A fast, reliable, and secure dependency management system.



### UI Design
The mockups for the app design can be viewed [here](https://www.pivotaltracker.com/n/projects/2354440)
[Barefoot Nomad/UI link](https://)

### REST API Docs
The Api documentation is done using swagger. View [Barefoot Nomad API Documentation](https://)

### Required Features

```
User can sign up.
User can sign in.
User can book travel
User can book accommodation
User can view travel and accommodation history on dashboard
User can update travel and accommodation requests
User can delete requests
User can rate trips and accommodations
User can view reviews
User can chat with other users
User roles: Super Admin, Travel Admin, Travel Team Member, Manager, Requester
User can sign out from Barefoot Nomad
Admins can create bookings
Admins can update bookings
Admins can delete bookings
```


## Installation and Running the Application

Ensure that you have nodejs and npm installed in your computer

* Clone this repository into your named folder

```bash
git clone https://github.com/andela/rogue-backend.git
```

* Install the project dependencies

```bash
yarn install
```
* Create all tables by running migrations

```bash
sequelize db:migrate
```

* Start the application

```bash
yarn dev-start
```
* To run test 
```bash
yarn test
```


## Test the endpoints

The application can be tested locally through localhost on port 3000 or through the live [url](https://) using postman

1. Run the application while postman is open
2. Go to postman and test against the endpoints below with the required property:-

### Endpoints to test

Method        | Endpoint      | Enable a user to: |
------------- | ------------- | ---------------
POST  | api/v1/auth/signup  | Create user account  |
POST  | api/v1/auth/signin  | Login a user |
POST  | api/v1/auth/forgot_password  | user can reset password |
POST  | api/v1/auth/user/<:user_id>/confirm  | user can confirm registration |
POST  | api/v1/travel  | Create a travel request |
POST  | api/v1/accommodation/  | Create accommodation requests|
POST  | api/v1/requests/<:request-id> | user can rate a request |
GET  | api/v1/requests/ | Get all requests |
GET  | api/v1/requests/<:request-id> | user can view a particular request |
GET  | api/v1/booking/<:booking-id> | user can see all reviews of a booking  |
GET  | api/v1/booking/<:booking-type> | user can view bookings of specific category  |
GET  | api/v1/user/<:user-id>/sign_out | user can log out |
PATCH  | api/v1/requests/<:requests-id> | user can update requests 
PATCH  | api/v1/booking/<:booking-id>/soldout  | Admin can mark a booking as "not available" so users will know it's no longer available
PATCH  | api/v1/booking/<:booking-id>  | Admin can update a booking |
DELETE  | api/v1/requests/<:request-id>  | Delete a request |
DELETE  | api/v1/requests/<:booking-id>  | Delete a booking |


## Contributors
* [Ademola Hussain](https://github.com/Daymorelah)
* [Nwodo Christian Chukwuemeka](https://github.com/userName)
* [Atawodi Emmanuel](https://github.com/userName)
* [Abiola Ojo](https://github.com/userName)
* [Mba Ifeanyi](https://github.com/userName)
* [Chiamaka Obitube](https://github.com/userName)
* [Amadi Justice Chinonso](https://github.com/userName)
* [Nnabugwu Chidozie Gabriel](https://github.com/userName)
* [Okikiola Apelehin](https://github.com/userName)

## License
[MIT](https://choosealicense.com/licenses/mit/)
