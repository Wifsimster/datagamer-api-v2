DataGamer v2
=========
DataGamer, to gamers from gamers<br>
Participative video games database, for your web site.

Web site : <a href="http://datagamer.fr">datagamer.fr</a>

Many video games web site maintain their own database.<br>
The problem is that no web site gives a free access to their database !<br>
Developers who want to set up video games web site need automatically to build a database.

So why not build together your own database for everyone ?
=========
<br>
Is the main goal of DataGamer ! You can participate to build a public video games database.

This new version of the API is written in Node.js and run with a MongoDb database;

## Developer, Editor, Game, Genre & Plateform

I show only the methods associated with the developer but other objects support the same syntax.

*Description :* Get a list of developers
<br>
*Method :* GET
<br>
*URL :* /api/developers/?skip=:skip&limit=:limit
<br>
*Params :* skip & limit
<br>

Description : Get a developer by name
<br>
Method : GET
<br>
URL : /api/developers/by/name/:name
<br>
Params : name
<br>

Description : Get a developer by id
<br>
Method : GET
<br>
URL : /api/developers/by/id/:id
<br>
Params : id
<br>

Description : Add a new developer
<br>
Method : POST
<br>
URL : /api/developers
<br>
Body params : name
<br>

Description : Update a developer
<br>
Method : PUT
<br>
URL : /api/developers/id
<br>
Params : id
<br>
Body params : developer object
<br>

Description : Delete a developer
<br>
Method : DELETE
<br>
URL : /api/developers/id
<br>
Params : id
<br>

Game
=========
<br>
