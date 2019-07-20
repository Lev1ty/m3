# Device Requirements

## Constraints

- Battery life with custom software running for 8 days
- Sensor sampling frequency >1/3 Hz
- Sensors
  - Accelerometer
  - Global Positioning System (GPS)
- Data privacy
  - Ability to turn off communication capability of device
  - Data is stored on device
    - 5 MB storage per sensor
      - Enough for 7 days of continuous logging at 1/3 Hz
  - Direct retrieval of GPS and other identifying data
    - No first-party (by company of device) logging of data
- Reproducibility of data
  - Ability to turn off screen and all user interfacing

## Objectives (in addition to Constraints)

- Production at scale
  - Potential for automated data retrieval process
  - Potential for automated deployment of custom software to all devices
- Sensor sampling frequency of 1 Hz
- 15 MB per sensor
  - Enough for 7 days of continuous logging at 1 Hz
- Sensors
  - Heart rate (beats per minute)
  - Body presence (worn or not)
  - Barometer
  - Gyroscope
  - Orientation (quaternion)
  - Oxygenation
