# Datagamer v2

<img src="https://travis-ci.org/Wifsimster/datagamer-api-v2.svg?branch=master">

Datagamer, to gamers from gamers. Participative video games database, for your web site.

*Web site : <a href="http://datagamer.fr">datagamer.fr</a> - This is the URL for the V1 API in PHP !*

Many video games web site maintain their own database. 
The problem is that no web site gives a free access to their database !
Developers who want to set up video games web site need automatically to build a database.

This new version of the API is full REST, written in Node.js and run with a MongoDb database.

**Unlike the v1, this v2 automatically populate itself when users search video games !**

**THIS V2 IS AVAILABLE ONLINE at http://movie-discover.com:8084/api**

*The current release works ONLY with PC platform games /!\*

## Table of Contents
* [Authentication](https://github.com/Wifsimster/datagamer-api-v2#authentication)
* [User](https://github.com/Wifsimster/datagamer-api-v2#user)
   * [Get a list of users](https://github.com/Wifsimster/datagamer-api-v2#get-a-list-of-users)
   * [Get a user by name](https://github.com/Wifsimster/datagamer-api-v2#get-a-user-by-name)
   * [Get a user by id](https://github.com/Wifsimster/datagamer-api-v2#get-a-user-by-id)
   * [Add a new user](https://github.com/Wifsimster/datagamer-api-v2#add-a-new-user)
   * [Update a user](https://github.com/Wifsimster/datagamer-api-v2#update-a-user)
   * [Delete a user](https://github.com/Wifsimster/datagamer-api-v2#delete-a-user)
* [Developer, Editor, Game, Genre & Platform](https://github.com/Wifsimster/datagamer-api-v2#developer-editor-game-genre--platform)
   * [Get a list of developers](https://github.com/Wifsimster/datagamer-api-v2#get-a-list-of-developers)
   * [Get a developer by name](https://github.com/Wifsimster/datagamer-api-v2#get-a-developer-by-name)
   * [Get a developer by id](https://github.com/Wifsimster/datagamer-api-v2#get-a-developer-by-id)
   * [Add a new developer](https://github.com/Wifsimster/datagamer-api-v2#add-a-new-developer)
   * [Update a developer](https://github.com/Wifsimster/datagamer-api-v2#update-a-developer)
   * [Delete a developer](https://github.com/Wifsimster/datagamer-api-v2#delete-a-developer)
* [Game](https://github.com/Wifsimster/datagamer-api-v2#game)
    * [Get a list of games](https://github.com/Wifsimster/datagamer-api-v2#get-a-list-of-games)
    * [Get a list of games similar](https://github.com/Wifsimster/datagamer-api-v2/blob/master/README.md#get-a-list-of-games-which-can-be-similar)
    * [Get a game by name](https://github.com/Wifsimster/datagamer-api-v2#get-a-game-by-name)
    * [Get a game by id](https://github.com/Wifsimster/datagamer-api-v2#get-a-game-by-id)
    * [Add a new game](https://github.com/Wifsimster/datagamer-api-v2#add-a-new-game) 
    * [Update a game](https://github.com/Wifsimster/datagamer-api-v2#update-a-game) 
    * [Delete a game](https://github.com/Wifsimster/datagamer-api-v2#delete-a-game) 
* [Status codes](https://github.com/Wifsimster/datagamer-api-v2#status-codes) 
* [Objects](https://github.com/Wifsimster/datagamer-api-v2#objects) 
* [Licence](https://github.com/Wifsimster/datagamer-api-v2#licence) 

## Authentication

First of all, you need to create a new user. User have an **API key** needed for every requests !

Request a new user with a POST request : 
````
URL : http:movie-discover.com:8084/api/users
POST data : {name: "username", email: "foo@gmail.com"}
Return : {code, message, user: {name, email, apiKey}}
````

Once you have your API key, you just need to pass it through the **Headers** each time to be authenticated.

**Example : Return game info with GET request**
````
Headers : {apiKey : b3dae6c0-83a0-4721-9901-bf0ee7011af}
URL : http://movie-discover.com:8084/api/games/by/id/12
````

## User

### Get a list of users
**Method :** GET
````
URL : /api/users/?skip={skip}&limit={limit}
Return : {code, message, count, skip, limit, users:[{user}]}
````

### Get a user by name
**Method :** GET
````
URL : /api/users/by/name/{name}
Return : {code, message, count, users:[{user}]}
````

### Get a user by id
**Method :** GET
````
URL : /api/users/by/id/{id}
Return : {code, message, user}
````

### Add a new user
**Method :** POST - Only request with no authentication !
````
URL : /api/users
Form param : {name, email}
Return : {code, message, user}
````

### Update a user
**Method :** PUT
````
URL : /api/users/{id}
Return : {code, message, user}
````

### Delete a user
**Method :** DELETE
````
URL : /api/users/{id}
Return : {code, message}
````

## Developer, Editor, Genre & Platform

I show only the methods associated with the developer but other objects support the exact same syntax.

### Get a list of developers
**Method :** GET
````
URL : /api/developers/?skip={skip}&limit={limit}
Return : {code, message, count, skip, limit, developers:[{developer}]}
````

### Get a developer by name
**Method :** GET
````
URL : /api/developers/by/name/{name}
Return : {code, message, count, developers:[{developer}]}
````

### Get a developer by id
**Method :** GET
````
URL : /api/developers/by/id/{id}
Return : {code, message, developer}
````

### Add a new developer
**Method :** POST - Only **Genre** object don't have an image attribute.
````
URL : /api/developers
Form param : {name, image}
Return : {code, message, developer}
````

### Update a developer
**Method :** PUT - Only **Genre** object don't have an image attribute.
````
URL : /api/developers/{id}
Form param : {name, image}
Return : {code, message, developer}
````

### Delete a developer
**Method :** DELETE
````
URL : /api/developers/{id}
Return : {code, message}
````

##Game

### Get a list of games
**Method :** GET
````
URL : /api/games/?skip={skip}&limit={limit}
Return : {code, message, count, skip, limit, games:[{game}]}
````

### Get count of all games
**Method :** GET
````
URL : /api/games/count
Return : {code, message, count}
````

### Get top 10 of games by metacritic score
**Method :** GET
````
URL : /api/games/top/{limit}
Return : {code, message, games}
````

### Get a list of games which can be similar by their default title
**Method :** GET
````
URL : /api/games/similar/by/{percentage}/for/{defaultTile}
Return : {code, message, games:[{game}]}
````

### Get games by default title
**Method :** GET
````
URL : /api/games/by/defaultTitle/{defaultTitle}
Return : {code, message, count, games:[{game}]}
````

### Get a game by id
**Method :** GET - Return a game with extended information. This method will automatically update the game information if needed.
````
URL : /api/games/by/id/{id}
Return : {code, message, game}
````

### Add a new game
**Method :** POST - Only **defaultTitle** is mandatory !
````
URL : /api/games
Form params : {defaultTitle, overiew, titles: [{name, countryCode}], releaseDates: [{date, countryCode}], versions: [{number, date, description}], metacritic: {score, url}, editors: [{Editor._id}], developers: [{Developer._id}], genres: [{Genre._id}], platforms: [{Platform._id}], media: {boxArt: {front, rear}, thumbnails[], logos[], banners[], fanArts[], screenshots[], trailers}}
Return : {code, message, game}
````
<br>
**Country code** must be ISO alpha 3 code in uppercase.

### Update a game
**Method :** PUT
````
URL : /api/games/{id}
Form params : {defaultTitle, overiew, titles: [{name, countryCode}], releaseDates: [{date, countryCode}], versions: [{number, date, description}], metacritic: {score, url}, editors: [{Editor._id}], developers: [{Developer._id}], genres: [{Genre._id}], platforms: [{Platform._id}], media: {boxArt: {front, rear}, thumbnails[], logos[], banners[], fanArts[], screenshots[], trailers}}
Return : {code, message, game}
````

### Delete a game
**Method :** DELETE
````
URL : /api/games/{id}
Return : {code, message}
````

## Status codes

    code: 200, message: Success !
    code: 201, message: Success, new resource added !
    code: 202, message: Success, existing resource updated !
    code: 204, message: Success, no content to return !

    code: 304, message: No error but nothing happened here !

    code: 400, message: Bad request syntax !
    code: 403, message: Invalid API key !
    code: 404, message: Resource doesn't exist in database !
    code: 410, message: Precondition failed, check header content !
    code: 411, message: Mandatory data missing !
    code: 412, message: Resource already exist in database !

    code: 500, message: Server error !

## Objects

### User

````
{name, email, apiKey}
````
- **name :** String required
- **email :** String email format
- **apiKey :**  String auto generated once

### Developer, Editor & Platform

````
{name, image, creationDate, updateDate}
````
- **name :** String required
- **image :** String represent a substainable URL
- **creationDate :**  Date auto generated once
- **updateDate :**  Date auto generated at each update

### Genre

````
{name, creationDate, updateDate}
````
- **name :** String required
- **creationDate :**  Date auto generated once
- **updateDate :**  Date auto generated at each update

### Game

````
{defaultTitle, overiew, titles: [{name, countryCode}], releaseDates: [{date, countryCode}], versions: [{number, date, description}], metacritic: {score, url}, editors: [{Editor._id}], developers: [{Developer._id}], genres: [{Genre._id}], platforms: [{Platform._id}], media: {boxArt: {front, rear}, thumbnails[], logos[], banners[], fanArts[], screenshots[], trailers}}
````
- **defaultTitle :** String required
- **overview :**  String
- **titles :**  Array
  - **name :** String
  - **countryCode :** String ISO Alpha 3 uppercase
- **releaseDates :**
  - **date :** Date
  - **countryCode :** String ISO Alpha 3 uppercase
- **versions :**
  - **number :** String
  - **date :** Date
  - **descriptione :** String
- **metacritic :**
  - **score :** Number
  - **url :** String
- **editors :** Array of ObjectId,  need to be an existing Editor id
- **developers :** Array of ObjectId,  need to be an existing Developer id
- **genres :** Array of ObjectId, need to be an existing Genre id
- **paltforms :** Array of ObjectId, need to be an existing Platform id
- **media :** Array
  - **boxArt :** Array
    - **front :** String
    - **rear :** String
  - **thumbnails :** Array of String
  - **logos :** Array of String
  - **banners :** Array of String
  - **fanArts :** Array of String
  - **screenshots :** Array of String
  - **trailers :** Array of String
- **percentage :** Number valorized when a games list is return
- **creationDate :**  Date auto generated once
- **updateDate :**  Date auto generated at each update

## Licence

Datagamer is distributed under the MIT License. 
