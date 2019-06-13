# m3

Monitoring My Mobility (M3): Continuous mobility monitoring project.

## Fitbit SDK Notes

### June 13, 2019

- 150 API requests per hour per user

## Architecture Notes

### June 8, 2019

- 15 MB of internal storage capped per app
- Doubly linked list of instance apps
  - Forward sweep to store data on device
  - Backwards sweep to export stored data
  - One app running at a time
  - Minimal battery life impact
- Using rxjs
  - Easier to extend
  - More memory, which is a premium

### June 9, 2019

- Issue with `App msg queue is full`
  - Too many contiguous synchronous calls
  - Added delay between `syncWrite` calls
- Upon adding more features, ran out of memory

### June 10, 2019

- Switch to functional programming to reduce memory footprint

### June 12, 2019

- Determine fixed IP address to send data from companion to be localhost
- Use mapping between MAC address and user account to identify each device

## Development Notes

### June 8, 2019

- Date.now() returns a number that requires a Float64Array
  - Does not update in Float32Array
- Geolocation timestamp updates in Float32Array
  - Accurate to approximately sampling interval
- Memory is not an issue
  - 65 KB on Ionic
- App msg queue is full
  - Appear during console.log
  - App doing too much contiguous work
