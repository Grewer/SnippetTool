import 'package:flutter/material.dart';

class Content extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Expanded(
        flex: 8,
        child: TextField(
          obscureText: false,
          maxLines: 65535,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            labelText: '',
          ),
        )
        );
  }
}
