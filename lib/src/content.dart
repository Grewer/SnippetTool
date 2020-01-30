import 'package:flutter/material.dart';

class Content extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Expanded(
        flex: 8,
        child: TextField(
          autofocus: true,
          maxLines: 1,
          decoration: InputDecoration(labelText: "input1"),
        )
    );
  }
}
