# How to Set Up Your Flutter Application

This guide will walk you through setting up your Flutter development environment and creating a new Flutter project for the Snack Track Insight App.

## 1. Install the Flutter SDK

The first step is to install Flutter on your computer. The official Flutter documentation is the best resource for this, as the process can vary depending on your operating system (Windows, macOS, or Linux).

- **Follow the official guide:** [Install Flutter](https://docs.flutter.dev/get-started/install)

After installation, make sure you can run `flutter doctor` from your terminal. This command checks your environment and displays a report of the status of your Flutter installation. Address any issues that it reports.

## 2. Create the New Flutter Project

Once Flutter is installed, you can create the new project.

1.  **Navigate to the root of this repository** in your terminal.
2.  **Run the following command** to create a new Flutter application in a directory named `flutter_app`:

    ```sh
    flutter create --org com.snacks flutter_app
    ```
    *   We use `--org com.snacks` to set the organization for the project, which will result in a package name like `com.snacks.flutter_app`. This is a good practice for Android apps.

3.  **Navigate into the new directory:**
    ```sh
    cd flutter_app
    ```

## 3. Run the Default App

To make sure everything is working, run the default "counter" app that Flutter creates.

1.  Make sure you have a device running (either a physical device connected to your computer or an emulator/simulator). You can check available devices with `flutter devices`.
2.  Run the app with:
    ```sh
    flutter run
    ```
    You should see the default Flutter demo app on your device.

## 4. Next Steps: Migrating the Login Page

Now you can start migrating the application. A good first step is to build the login page and connect it to your existing backend.

### a. Project Structure

Inside the `flutter_app/lib` directory, it's a good practice to create a `src` folder to hold your source code. You can create folders for `pages`, `widgets`, `services`, etc.

```
lib/
├── src/
│   ├── api/
│   │   └── auth_service.dart
│   ├── pages/
│   │   ├── login_page.dart
│   │   └── register_page.dart
│   └── widgets/
│       └── custom_text_field.dart
└── main.dart
```

### b. Add Dependencies

You'll need a few packages to get started. The most important one is `http` for making API calls. Add it by running this command from the `flutter_app` directory:

```sh
flutter pub add http
```

### c. Build the Login UI

Open `lib/src/pages/login_page.dart` and start building the UI. You can use Flutter's built-in widgets like `Scaffold`, `Column`, `TextField`, and `ElevatedButton`.

Here is a very basic example to get you started:

```dart
// lib/src/pages/login_page.dart
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement login logic
                final email = _emailController.text;
                final password = _passwordController.text;
                print('Login with: $email, $password');
              },
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
```
*You will need to update `lib/main.dart` to show this page.*

### d. Connect to the Backend

You'll need to make an API call to your backend's `/api/login` endpoint.

1.  **Find your computer's IP address.** Your backend runs on `localhost`, which the mobile emulator can't access directly. You'll need to use your computer's local network IP address.
2.  **Create an `auth_service.dart` file:**

```dart
// lib/src/api/auth_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  // IMPORTANT: Replace with your computer's IP address
  static const String _baseUrl = 'http://YOUR_COMPUTER_IP:4000/api';

  Future<bool> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      // TODO: Save the token
      print('Login successful');
      return true;
    } else {
      print('Failed to login');
      return false;
    }
  }
}
```

This should give you a solid foundation to start building your Flutter application. Good luck!
