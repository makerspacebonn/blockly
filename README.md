# Otto Blockly

This is a free and open source visual programming language based on Blockly from Google & MIT, to generate C/C++ code, 
compile and upload to multiple options of microcontrollers. Compatible with any 
[Otto DIY robots, Arduino or ESP8266 and ESP32 related boards](https://www.ottodiy.com/software). 

## [Click here to watch the video to see all the main features](https://youtu.be/chcWxh4Co_c)

## Windows ONLY

Download the installer from the [releases page](https://github.com/OttoDIY/blockly/releases). After the software is 
installed in your PC, it is ready to use immediately, you do not need to import Arduino libraries or any additional 
setup for the boards, you will be ready to upload codes directly to your robot or any other Arduino project via USB cable.

### A better solution that works in all other OS, is the [new HP Robots Otto web coding ecosystem](https://hprobots.com/otto-robot/code/) 

## How to Use

1. Open any example.
2. Connect your microcontroller.
3. Select your board and the USB port where is connected.
4. Click upload and the code will be automatically compiled, but it will take some time.

Drag, drop, connect, mix, play and create your own codes. 
[Join the Otto Builder community, see all the cool stuff and post your ideas!](https://www.ottodiy.com/community) 

## Help us add your Language

Leave your mark by translating Blockly, you are welcome to contribute with any languages you know, by fixing mistakes you see, it will 
benefit you and everyone in your community.

The more people helping to translate the better, it is important to translate while understanding the context and what 
is the robot actually doing to be accurate.

1. Go to the [lang folder](https://github.com/OttoDIY/blockly/tree/master/www/lang) and duplicate the Arduino_en.js 
Blockly_en.js and msg_en.js files from English
2. Rename them according to your ISO language code, for example fr is for French, so the files are renamed like this:
Arduino_fr.js Blockly_fr.js and msg_fr.js  
3. Edit the files with any code editor software like [Visual Studio Code](https://code.visualstudio.com/) translating 
only the English part after = in between the quotes "" in visual studio is the text in red.
4. Then open a pull request [here in github](https://github.com/OttoDIY/blockly/pulls) or just attach the files in a
[new issue](https://github.com/OttoDIY/blockly/issues).

## How to run project
You will need to have installed the node.js tools in your computer. The version must be the 12.0

1. Clone or download the source code.
> git clone https://github.com/OttoDIY/blockly.git
2. OPEN GIT BASH as Administrator and cd in folder
> cd blockly
3. Install required tools.
> npm install -g build-tools
>npm install -g windows-build-tool 
	(this command is not working ok. If the log is held then you must install python 2.7 before because the problem is with the python installation.)
> npm install -g node-gyp
4. Install required node modules. Execute following on the source code directory
> npm install
5. Install Arduino CLI
get arduino-cli.exe from https://github.com/arduino/arduino-cli/releases 
and place it under compilation/arduino
>cd compilation/arduino
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
mv bin/arduino-cli ./
rm -rf bin
6. Execute following to install required tools
>cd compilation\arduino
>arduino-cli core update-index
>arduino-cli core install arduino:avr@1.8.3
>arduino-cli core install arduino:samd@1.8.9
>arduino-cli core install arduino:megaavr@1.8.6
>arduino-cli core install esp8266:esp8266@2.7.4
>arduino-cli core install esp32:esp32@1.0.4
>arduino-cli core update-index
7. Build (creates .exe and .zip)
You can use electron-builder to pack your electron app in zip, nsis (Installer), portable (App without installation) formats.
>cd ../../     #  ( go back to the repository’s top directory)
> npm run compiler
or
> build --win --ia32
>export PATH=$PATH:node_modules/.bin
npm install electron-builder@22.13.1
>build --mac --x64
>electron-builder --mac --x64

## How to Contribute

Contributing to this software is warmly welcomed. There are 5 ways you can contribute to this project:
1. Test and report. Let us know if there is something missing in the issue section.
2. Helps us solve [current issues or other bugs](https://github.com/OttoDIY/blockly/issues) .
3. Suggest or request new blocks.

You can do this basically by [forking](https://help.github.com/en/articles/fork-a-repo), committing modifications and 
then open a [pull request](https://help.github.com/en/articles/about-pull-requests). Please explain the changes and
make sure they have been tested.

Just make sure to keep consistency in the naming and make a record of the change or improvement made.

Welcome to the Otto DIY team!
Thanks for your contribution.

## Attribution

Thanks to all these great people and open projects, it has been possible to make this software:

- [Blockly](https://developers.google.com/blockly)
- [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino)
- [Blocklino](https://github.com/fontainejp/blocklino/)
- [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino)
- [Blocklyduino for MRTduino](https://logix5.com/Blockyduino-para-MRTDuino/)
- [Ardublockly](https://github.com/carlosperate/ardublockly)
- [Oscar Ferruz](https://github.com/logix5)
- [Bodo Minea](https://github.com/BodoMinea)
- [Takuji Kawata](https://github.com/takujikawata-pr)
- [Nicolas Nca78](https://github.com/Nca78/Matrix_GFX)
- [Iván R.](https://github.com/IvanR3D)
- [Node.js](https://nodejs.org/)
- [Bootstrap](http://getbootstrap.com)
- [Font Awesome](http://fontawesome.io)
- [JQuerry](https://jquery.com)
- [electron](https://electronjs.org/)
- [electron-builder](https://github.com/electron-userland/electron-builder)
- [Serialport](https://github.com/node-serialport/node-serialport)
- [arduino-builder](https://github.com/arduino/arduino-builder)
- [arduino-cli](https://github.com/arduino/arduino-cli)
- [winAVR](https://sourceforge.net/projects/winavr)
- [Avrdude](http://www.nongnu.org/avrdude)
- [microbit](https://microbit.org/)
- [micropython](https://wiki.mchobby.be/index.php?title=MicroPython-Accueil)
- [Python](https://docs.python.org/)
- [ampy](https://github.com/pycampers/ampy)
- [pyflakes](https://github.com/PyCQA/pyflakes)
- [NSIS](https://sourceforge.net/projects/nsis)
- [masayloBlockly](https://github.com/agomezgar/masayloBlockly)
- [Escornabot](escornabot.com) 


# Additional Infos
To work with the esp32 otto on windows the following stuff needs to be installed
- [arduino-cli](https://docs.arduino.cc/arduino-cli/installation/#latest-release)
- arduino-cli core update-index
- esp32 ```aduino-cli.exe core install esp32:esp32``` It could be that you have to up the timeout of arduino cli for that with ```arduino-cli.exe set network.connection_timeout 600s```
- in the Arduino IDE, the library 'ESP32Servos' must be installed

# ToDos
- Feststellen, wenn arduino nicht installiert ist und Hilfestellung geben
- Feststellen, wenn die esp32 sdk und andere libs nicht installiert sind und Hilfestellung geben.
- Einen Weg finden,um die MSBOttos zu kalibrieren
- Die Programmierblöccke überprüfen auf MSBOtto tauglichkeit.

Ideas
- Vielleicht auf python umstellen, damit an nicht immer neu bauen muss?
- use webusb with usb to detect devices
