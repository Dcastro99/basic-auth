```javascript
// app.use(something - a middleware!);
// what is a handler? - function
function handler(req, res, next) {
  // request: query, endpoints, URL - things the browser sends to the server
  // response: status, body - what you give back to the server
  // next: a function passed to the middleware, to pass control to the "next" handler
}
```
