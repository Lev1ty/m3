fetch('http://127.0.0.1:8080', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'hello': 'world' })
}).then((response) => {
    console.log(response);
});
console.log('Hello world!');
