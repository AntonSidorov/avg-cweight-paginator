# avg-cweight-paginator

## Installation
This is a node.js project, so that's the biggest dependency. Download [here](https://nodejs.org/en/) if you don't have it.

The other dependencies are easily installed by running `npm install` in the project directory.

The script itself requires some environment variables, or it won't do any calculations, so it needs to be started with:
```
DOMAIN="http://sample.com" INITIAL="/some/route" npm start
```
where the domain is the base url for the API, and initial is the first URL in the same format as what's returned by the API (`/api/something/1`)

This will run the calculation itself and also start a webserver on port 5000, which will redo the calculation on any request to `http://localhost:5000`
