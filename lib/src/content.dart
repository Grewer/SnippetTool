import 'package:flutter/material.dart';

class Content extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Expanded(
        flex: 8,
        child: TextField(
          obscureText: false,
          autocorrect: true,
          maxLines: 99999,
          onChanged: (str) {
            print('changed'+str);
          },
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            labelText: '',
          ),
        ));
  }
}
