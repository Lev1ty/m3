import { Accelerometer } from 'accelerometer';
import { me } from 'appbit';
import { Barometer } from 'barometer';
import { BodyPresenceSensor } from 'body-presence';
import { display } from 'display';
import { openSync, statSync, writeSync } from 'fs';
import { geolocation } from 'geolocation';
import { Gyroscope } from 'gyroscope';
import { HeartRateSensor } from 'heart-rate';
import { OrientationSensor } from 'orientation';
display.onchange = () => display.on = false;
display.on = false;
me.appTimeoutEnabled = false;
const isAccelerometerOn = true;
const isBarometerOn = true;
const isBodyPresenceSensorOn = true;
// filesystem
const isFsOn = true;
const isGeolocationSensorOn = true;
const isGyroscopeOn = true;
const isHeartRateSensorOn = true;
const isOrientationSensorOn = true;
if (isAccelerometerOn) {
    const accelerometer = new Accelerometer({ batch: 1, frequency: 1 });
    accelerometer.onreading = () => {
        console.log(JSON.stringify(accelerometer.readings));
    };
    accelerometer.start();
}
if (isBarometerOn) {
    const barometer = new Barometer({ batch: 1, frequency: 1 });
    barometer.onreading = () => {
        console.log(JSON.stringify(barometer.readings));
    };
    barometer.start();
}
if (isBodyPresenceSensorOn) {
    const bodyPresenceSensor = new BodyPresenceSensor();
    bodyPresenceSensor.onreading = () => {
        console.log(JSON.stringify(bodyPresenceSensor.present));
    };
    bodyPresenceSensor.start();
}
if (isFsOn) {
    const file = openSync(me.applicationId, 'a+');
    setInterval(() => {
        writeSync(file, (new Int8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).buffer);
        console.log('Buffer written');
    }, 125);
}
if (isGeolocationSensorOn) setInterval(() => {
    geolocation.getCurrentPosition(_ => { });
    console.log('Geolocation polled');
}, 1000);
if (isGyroscopeOn) {
    const gyroscope = new Gyroscope({ batch: 1, frequency: 1 });
    gyroscope.onreading = () => {
        console.log(JSON.stringify(gyroscope.readings));
    };
    gyroscope.start();
}
if (isHeartRateSensorOn) {
    const heartRateSensor = new HeartRateSensor({ batch: 1, frequency: 1 });
    heartRateSensor.onreading = () => {
        console.log(JSON.stringify(heartRateSensor.readings));
    };
    heartRateSensor.start();
}
if (isOrientationSensorOn) {
    const orientationSensor = new OrientationSensor({ batch: 1, frequency: 1 });
    orientationSensor.onreading = () => {
        console.log(JSON.stringify(orientationSensor.readings));
    };
    orientationSensor.start();
}