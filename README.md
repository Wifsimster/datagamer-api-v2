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

Developer, Editor, Game, Genre & Plateform
=========

I show only the methods associated with the developer but other objects support the same syntax.

Description : Get a list of developers
Method : GET
URL : /api/developers/?skip=:skip&limit=:limit
Params : skip & limit

Description : Get a developer by name
Method : GET
URL : /api/developers/by/name/:name
Params : name

Description : Get a developer by id
Method : GET
URL : /api/developers/by/id/:id
Params : id

Description : Add a new developer
Method : POST
URL : /api/developers
Body params : name

Description : Update a developer
Method : PUT
URL : /api/developers/id
Params : id
Body params : developer object

Description : Delete a developer
Method : DELETE
URL : /api/developers/id
Params : id

Game
=========
