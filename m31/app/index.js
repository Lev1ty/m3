import { Accelerometer } from 'accelerometer';
import { me } from 'appbit';
import { Barometer } from 'barometer';
import { BodyPresenceSensor } from 'body-presence';
import { display } from 'display';
import { outbox } from 'file-transfer';
import { listDirSync, openSync, statSync, unlinkSync, writeSync } from 'fs';
import { geolocation } from 'geolocation';
import { Gyroscope } from 'gyroscope';
import { HeartRateSensor } from 'heart-rate';
import { OrientationSensor } from 'orientation';
import { charger } from 'power';
import { memory, launchApp } from 'system';
import { nextApplicationId, previousApplicationId } from '../common/constants';
class GeolocationSensor {
	constructor(options) {
		this.frequency = options.frequency;
	}
	onactivate() {}
	onreading() {}
	start() {
		this.onactivate();
		this.intervalId = setInterval(() => this.onreading(), 1000 / this.frequency);
	}
	stop() {
		clearInterval(this.intervalId);
	}
}
class Sensor {
	static from(_Sensor, options) {
		return options.frequency >= 1 ? new _Sensor(options) : new Sensor(_Sensor, options);
	}
	constructor(_Sensor, options) {
		this._Sensor = _Sensor;
		this.frequency = options.frequency;
	}
	onactivate() {}
	onreading() {}
	get readings() {
		return this._readings;
	}
	set readings(_readings) {
		this._readings = _readings;
		this.onreading();
		this._sensor.stop();
	}
	start() {
		this.onactivate();
		this.intervalId = setInterval(() => {
			this._sensor = new this._Sensor({ batch: 1, frequency: 1});
			this._sensor.start();
			this._sensor.onreading = () => this.readings = this._sensor.readings;
		}, 1000 / this.frequency);
	}
	stop() {
		clearInterval(this.intervalId);
		this._readings = undefined;
	}
}
const file = openSync(me.applicationId, 'a+');
const sensors = {
	geolocationSensor: new GeolocationSensor({ frequency: 0.1 }),
	accelerometer: Sensor.from(Accelerometer, { batch: 10, frequency: 0.5 }),
	barometer: Sensor.from(Barometer, { batch: 10, frequency: 0.5 }),
	bodyPresenceSensor: new BodyPresenceSensor(),
	gyroscope: Sensor.from(Gyroscope, { batch: 10, frequency: 0.5 }),
	heartRateSensor: Sensor.from(HeartRateSensor, { batch: 10, frequency: 0.5 }),
	orientationSensor: Sensor.from(OrientationSensor, { batch: 10, frequency: 0.5 })
};
const sensorKeys = Object.keys(sensors);
const stack = [];
charger.onchange = () => {
	if (!charger.connected) return;
	outbox.enqueueFile(`/private/data/${me.applicationId}`)
		.then(fileTransfer => {
			console.log('queued');
			const displayOnDuration = 60000;
			fileTransfer.onchange = () => {
				console.log(fileTransfer.readyState);
				if (fileTransfer.readyState !== 'transferred') return;
				display.onchange = () => display.on = true;
				display.on = true;
				unlinkSync(me.applicationId);
				setTimeout(() => {
					me.onunload = () => launchApp(previousApplicationId);
					me.exit();
				}, displayOnDuration);
			};
		});
};
// display.onchange = () => display.on = false;
// display.on = false;
me.appTimeoutEnabled = false;
memory.monitor.onmemorypressurechange = () => {
	while (stack.length) {
		const element = stack.pop();
		if (element) writeSync(file, element.buffer);
	}
	console.log(memory.monitor.pressure);
};
sensorKeys.forEach(sensorKey => {
	const sensor = sensors[sensorKey];
	sensor.onactivate = () => {
		stack.push(new Int8Array([-sensorKeys.indexOf(sensorKey)]));
		stack.push(new Float64Array([Date.now()]));
	};
	switch (sensorKey) {
		case 'bodyPresenceSensor':
			const storageQuotaIntervalDuration = 1000;
			let storageQuotaIntervalId;
			sensor.onreading = () => {
				stack.push(new Int8Array([sensorKeys.indexOf(sensorKey)]));
				stack.push(new Uint8Array([sensor.present]));
				sensorKeys.forEach(sensorKey => {
					if (sensorKey === 'bodyPresenceSensor') return;
					const _sensor = sensors[sensorKey];
					if (sensor.present) _sensor.start();
					else _sensor.stop();
				});
				if (sensor.present) {
					storageQuotaIntervalId = setInterval(() => {
						const size = statSync(me.applicationId).size;
						console.log(size);
						if (size <= 15000000 - memory.js.total) return;
						me.onunload = () => launchApp(nextApplicationId);
						me.exit();
					}, storageQuotaIntervalDuration);
				} else clearInterval(storageQuotaIntervalId);
			};
			break;
		case 'geolocationSensor':
			sensor.onreading = () => {
				let geolocationData;
				geolocation.getCurrentPosition(position => {
					geolocationData = [position.timestamp];
					Object.keys(position.coords).forEach(coordKey =>
						geolocationData.push(positions.coords[coordKey]));
					stack.push(new Int8Array([sensorKeys.indexOf(sensorKey)]));
					stack.push(new Float32Array(geolocationData));
				}, error => console.log(JSON.stringify(error)));
			};
			break;
		default:
			sensor.onreading = () => {
				stack.push(new Int8Array([sensorKeys.indexOf(sensorKey)]));
				stack.push(new Uint8Array([sensor.batch]));
				Object.keys(sensor.readings).forEach(readingKey => stack.push(sensor.readings[readingKey]));
			};
			break;
	}
});
sensors.bodyPresenceSensor.start();
stack.push = element => {
	Array.prototype.push.call(stack, element);
	console.log(element);
	writeSync(file, element.buffer);
};
