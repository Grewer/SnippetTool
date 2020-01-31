import 'package:example_flutter/src/editor.dart';
import 'package:flutter/material.dart';

class Content extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Expanded(
        flex: 8,
        child: Editor()
        );
  }
}
