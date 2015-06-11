1. requirements
jxCode http://jxcore.com

2. delete prev. generated docdoor.exe and all nccessary files like test doc files

3. jx package docdoor.js docdoor -native

4. usage
docdoor <file_name>

First it will start application and then, when app is closed,
it will use name (witohout extension)  as _id and POST it back to server.

TODO: for Windows environment it has to be rebuilded with jx for Windows
And exec line should be replace with word.exe (not open -W) 
