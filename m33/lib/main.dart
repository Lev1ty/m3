import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';

final request$ = BehaviorSubject();

void main() {
  runZoned(() async {
    final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 8080);
    request$.addStream(server.map((request) {
      request.response.close();
      return request.method;
    }));
  });
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<dynamic>(
      builder: (context, snapshot) {
        if (!snapshot.hasData) return Placeholder();
        return Text(snapshot.data.toString());
      },
      stream: request$.stream,
    );
  }
}
