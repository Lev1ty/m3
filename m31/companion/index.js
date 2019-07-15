import { inbox } from 'file-transfer';
const url = 'http://127.0.0.1';
inbox.onnewfile = async () => {
	let file = await inbox.pop();
	while (file) {
		console.log(JSON.stringify(file));
		const payload = await file.arrayBuffer();
		console.log(JSON.stringify(payload));
		let response;
		try {
			response = await fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/octet-stream' },
				body: payload
			});
		} catch (error) {
			console.log(JSON.stringify(error));
		}
		console.log(JSON.stringify(response));
		file = await inbox.pop();
	}
};
inbox.onnewfile();
