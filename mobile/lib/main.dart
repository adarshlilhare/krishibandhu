import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
// Import the Android-specific WebView package
import 'package:webview_flutter_android/webview_flutter_android.dart';
// Import file_picker
import 'package:file_picker/file_picker.dart';
// Import permission_handler for the native pop-ups
import 'package:permission_handler/permission_handler.dart';

void main() {
  runApp(const KrishiBandhuApp());
}

class KrishiBandhuApp extends StatelessWidget {
  const KrishiBandhuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KrishiBandhu',
      theme: ThemeData(primarySwatch: Colors.green),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();

    // 1. Request native Android permissions right as the app opens
    _requestPermissions();

    // 2. Initialize the controller
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse('https://krishnabandhu.vercel.app/'));

    // 3. Add Android-specific configurations
    if (controller.platform is AndroidWebViewController) {
      final myAndroidController = controller.platform as AndroidWebViewController;

      myAndroidController
      // Allows auto-playing videos/audio streams
        ..setMediaPlaybackRequiresUserGesture(false)

      // Grants Camera and Mic permissions when the website asks
        ..setOnPlatformPermissionRequest((PlatformWebViewPermissionRequest request) {
          request.grant();
        })

      // Handles File Uploads (Storage) when clicking an upload button on the website
        ..setOnShowFileSelector((FileSelectorParams params) async {

          final bool isMultiple = params.mode == FileSelectorMode.openMultiple;

          final FilePickerResult? result = await FilePicker.platform.pickFiles(
            allowMultiple: isMultiple,
            type: FileType.any, // Ensures all file types can be selected
          );

          if (result != null && result.files.isNotEmpty) {
            // THE CRITICAL FIX: Convert raw file paths to formatted "file://" URIs!
            return result.files.map((file) {
              return Uri.file(file.path!).toString();
            }).toList();
          }

          // Return an empty list if the user cancels the picker
          return [];
        });
    }
  }

  // Function to trigger the native permission pop-ups
  Future<void> _requestPermissions() async {
    await [
      Permission.camera,
      Permission.microphone,
      Permission.storage,
      Permission.photos,
      Permission.videos,
      Permission.audio,
    ].request();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: WebViewWidget(controller: controller),
      ),
    );
  }
}