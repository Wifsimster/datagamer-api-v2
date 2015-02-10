# DataGamer v2
DataGamer, to gamers from gamers. Participative video games database, for your web site.

Web site : <a href="http://datagamer.fr">datagamer.fr</a> - This is the URL for the V1 API in PHP !

Many video games web site maintain their own database. 
The problem is that no web site gives a free access to their database !
Developers who want to set up video games web site need automatically to build a database.

####So why not build together your own database for everyone ?

Is the main goal of DataGamer ! You can participate to build a public video games database.

**This new version of the API is full REST, written in Node.js and run with a MongoDb database;**

## User

First of all you need to create a user. User have an **API key** needed for every requests.

### Get a list of users
**Method :** GET
<br>
**URL :** /api/users/?skip={skip}&limit={limit}
<br>
**Params :** 
- skip
- limit

### Get a user by name
**Method :** GET
<br>
**URL :** /api/users/by/name/{name}
<br>
**Params :** name
<br>

### Get a user by id
**Method :** GET
<br>
**URL :** /api/users/by/id/{id}
<br>
**Params :** 
- id

### Add a new user
**Method :** POST
<br>
**URL :** /api/users
<br>
**Body params :** 
- name
- email

### Update a user
**Method :** PUT
<br>
**URL :** /api/users/id/{id}
<br>
**Params :** 
- name
- email

### Delete a user
**Method :** DELETE
<br>
**URL :** /api/users/id/{id}
<br>
**Params :** 
- id

## Developer, Editor, Game, Genre & Plateform

I show only the methods associated with the developer but other objects support the same syntax.

### Get a list of developers
**Method :** GET
<br>
**URL :** /api/developers/?skip={skip}&limit={limit}
<br>
**Params :** 
- skip
- limit

### Get a developer by name
**Method :** GET
<br>
**URL :** /api/developers/by/name/{name}
<br>
**Params :** name
<br>

### Get a developer by id
**Method :** GET
<br>
**URL :** /api/developers/by/id/{id}
<br>
**Params :** 
- id

### Add a new developer
**Method :** POST
<br>
**URL :** /api/developers
<br>
**Body params :** 
- name

### Update a developer
**Method :** PUT
<br>
**URL :** /api/developers/id/{id}
<br>
**Params :** 
- id


**Body params :** 
- name
- image

Only **Genre** object don't have an image attribute.

### Delete a developer
**Method :** DELETE
<br>
**URL :** /api/developers/id/{id}
<br>
**Params :** 
- id

##Game

### Get a list of games
**Method :** GET
<br>
**URL :** /api/games/?skip={skip}&limit={limit}
<br>
**Params :** 
- skip
- limit

### Get a game by name
**Method :** GET
<br>
**URL :** /api/games/by/name/{name}
<br>
**Params :** 
- name

### Get a game by id
**Method :** GET
<br>
**URL :** /api/games/by/id/{id]
<br>
**Params :** 
- id

### Add a new game
**Method :** POST
<br>
**URL :** /api/games
<br>
**Body params :** 
- name
- overiew
- editors[]
- developers[]
- genres[]
- platforms[]
- releaseDate
- metacritic{}
- media{}

### Update a game
**Method :** PUT
<br>
**URL :** /api/games/id/{id}
<br>
**Params :** 
- id


**Body params :** 
- name
- overiew
- editors[]
- developers[]
- genres[]
- platforms[]
- releaseDate
- metacritic{}
- media{}

### Delete a game
**Method :** DELETE
<br>
**URL :** /api/games/id/{id}
<br>
**Params :** 
- id

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

{ 
    **name :** String,
    **email :** String,
    **apiKey :** String
}

### Developer, Editor & Platform

{ 
    **name :** String,
    **image :** String,
    **creationDate :** Date,
    **updateDate :** Date
}

### Genre

{ 
    **name :** String,
    **creationDate :** Date,
    **updateDate :** Date
}

### Game

{ 
    **name :** String,
    **media :**
    {
        **boxArt :** 
        {
            **front :** String,
            **rear :** String
        },
        **thumbnails :** [String],
        **logos :** [String},
        **banners :** [String],
        **fanArts :** [String],
        **screenshots :** [String],
        **trailers :** [String]
    },
    **editors :** [Object_id],
    **developers :** [Object_id],
    **genres :** [Object_id],
    **platforms :** [Object_id],
    **overview :** String,
    **releaseDate :** Date,
    **creationDate :** Date,
    **updateDate :** Date,
    **metacritic :** {
        **score :** Number,
        **url :** String
    }
}

## Licence

The MIT License (MIT)

Copyright (c) 2015 Wifsimster

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
