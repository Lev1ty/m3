# m3

Monitoring My Mobility (M3): Continuous mobility monitoring project.

## Fitbit Web SDK Notes

### June 13, 2019

- 150 API requests per hour per user

#### Activity

##### Intra-day activity series

> - `GET https://api.fitbit.com/1/user/-/[resource-path]/date/[date]/[date]/[detail-level].json`
> - `GET https://api.fitbit.com/1/user/-/[resource-path]/date/[date]/1d/[detail-level].json`
> - `GET https://api.fitbit.com/1/user/-/[resource-path]/date/[date]/[date]/[detail-level]/time/[start-time]/[end-time].json`
> - `GET https://api.fitbit.com/1/user/-/[resource-path]/date/[date]/1d/[detail-level]/time/[start-time]/[end-time].json`
> - [resource-path]
>   - activities/calories
>   - activities/steps
>   - activities/distance
>   - activities/floors
>   - activities/elevation
- Timestamp resolution is 1 minute or 15 minutes

##### Other

- Other activity series are available by specific sport
  - Logging must be activated on device for information to be monitored
  - Cannot be activated on device because relevant app is a system app
    - Cannot be programmatically opened
  - Not feasible

#### Heart Rate

> - `GET https://api.fitbit.com/1/user/-/activities/heart/date/[date]/[end-date]/[detail-level].json`
> - `GET https://api.fitbit.com/1/user/-/activities/heart/date/[date]/[end-date]/[detail-level]/time/[start-time]/[end-time].json`
> - `GET https://api.fitbit.com/1/user/-/activities/heart/date/[date]/1d/[detail-level].json`
> - `GET https://api.fitbit.com/1/user/-/activities/heart/date/[date]/1d/[detail-level]/time/[start-time]/[end-time].json`
- Timestamp resolution is 1 second or 1 minute

#### Sleep

> - `GET https://api.fitbit.com/1.2/user/[user-id]/sleep/date/[startDate]/[endDate].json`
- Timestamp resolution is 1 second, only start time
- Stores intervals of sleep including naps
  - deep
  - light
  - rem
  - wake

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

### June 13, 2019

- Use adaptive frequency to sample according to spatial dimensions instead of temporal dimension
  - Sample more frequently during large variations and less frequently during small variations

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

## Validation Notes

### June 13, 2019

#### Battery Life

- Test each sensor incrementally
  1. Test without any sensors, only app running
    - Would include body presence sensor by default
  2. Test with accelerometer
  3. Test with accelerometer, and barometer
  4. Test with accelerometer, barometer, and gyroscope
  5. Test with accelerometer, barometer, gyroscope, and heart rate sensor
  6. Test with accelerometer, barometer, gyroscope, heart rate sensor, and orientation sensor
  7. Test with accelerometer, barometer, gyroscope, heart rate sensor, orientation sensor, and geolocation sensor
- Test at fixed sampling frequency of 1 Hz
