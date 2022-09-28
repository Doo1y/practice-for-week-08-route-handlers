const http = require('http');
const { url } = require('inspector');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here
    const urlSubStr = req.url.split('/');
    let requestedDogId = parseInt(req.url.split('/')[2]) ? req.url.split('/')[2] : undefined;
    // GET method route handlers group
    if (req.method === 'GET') {

      // route handler for root page
      if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Dogs club');
      }


      // dogs page route handlers subgroup
      if (urlSubStr.length >= 2) {

        // route handler for the dogs page
        if (req.url === '/dogs') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Dogs index');
        }

        // route handler for dog create form page
        if (urlSubStr[2] === 'new') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Dog create form page')
        }

        // route handler for retriving details of a dog with dogId
        if (req.url === `/dogs/${requestedDogId}`) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain')
          return res.end(`Dog detail for dogId: ${requestedDogId}`);
        }

        if (req.url === `/dogs/${requestedDogId}/edit`) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          return res.end(`Dog edit form page for dogId: ${requestedDogId}`);
        }
      }
    }

    // POST method route handlers group
    if (req.method === 'POST') {

      // route handler for dogs page
      if (req.url === '/dogs') {
        res.statusCode = 302;
        res.setHeader('Location', `/dogs/${getNewDogId()}`);
        return res.end();
      }

      if (urlSubStr[2] === requestedDogId) {
        res.statusCode = 302;
        res.setHeader('Location', `/dogs/${requestedDogId}`);
        return res.end();
      }
    }

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));