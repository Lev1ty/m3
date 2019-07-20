import { Accelerometer } from 'accelerometer';
import { me } from 'appbit';
import { Barometer } from 'barometer';
import { BodyPresenceSensor } from 'body-presence';
import { display } from 'display';
import { openSync, writeSync } from 'fs';
import { geolocation } from 'geolocation';
import { Gyroscope } from 'gyroscope';
import { HeartRateSensor } from 'heart-rate';
import { OrientationSensor } from 'orientation';
display.onchange = () => display.on = false;
display.on = false;
me.appTimeoutEnabled = false;
const isAccelerometerOn = false;
const isBarometerOn = false;
const isBodyPresenceSensorOn = false;
const isFsOn = false;
const isGeolocationSensorOn = false;
const isGyroscopeOn = false;
const isHeartRateSensorOn = false;
const isOrientationSensorOn = false;
if (isAccelerometerOn) Accelerometer({ frequency: 1 });
if (isBarometerOn) Barometer({ frequency: 1 });
if (isBodyPresenceSensorOn) BodyPresenceSensor();
if (isFsOn) {
    const file = openSync(me.applicationId, 'a+');
    setInterval(() => {
        writeSync(file, Int8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).buffer);
    }, 125);
}
if (isGeolocationSensorOn) setInterval(() => {
    geolocation.getCurrentPosition(_ => { });
}, 1000);
if (isGyroscopeOn) Gyroscope({ frequency: 1 });
if (isHeartRateSensorOn) HeartRateSensor({ frequency: 1 });
if (isOrientationSensorOn) OrientationSensor({ frequency: 1 });