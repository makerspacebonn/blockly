const { ipcRenderer, shell, clipboard } = require("electron")
const { exec } = require('child_process')
const serialPort = require('serialport')
const fs = require('fs')


const path = require("node:path");
const {shellPathSync} = require("shell-path");
const appVersion = '9.9.9'

//var arduino_basepath = process.platform == 'win32' ? './compilation/arduino' : path.join(__dirname, '../../compilation/arduino')
var arduino_basepath = process.platform == 'win32' ? './compilation/arduino' : path.join(__dirname, '../../../compilation/arduino')

var arduino_ide_cmd = process.platform == 'win32' ?
	'arduino-cli.exe --config-file arduino-cli.yaml' : path.join(__dirname, './compilation/arduino/arduino-cli  --config-file arduino-cli.yaml ')
arduino_ide_cmd = 'arduino-cli'

window.addEventListener('load', async function load(event) {
	{
		const util = require('node:util');
		const exec = util.promisify(require('node:child_process').exec);
	}
	console.log(process.env.PATH);
	if (process.platform !== 'win32') {
		process.env.PATH = shellPathSync();
	}


	console.log(process.env.PATH);
	var isArduinoAvailable = require('hasbin').sync('arduino-cli')
	console.log('isArduinoAvailable: ', isArduinoAvailable)

	var quitDiv = '<button type="button" class="close" data-dismiss="modal" aria-label="Close">&#215;</button>'
	var checkBox = document.getElementById('verifyUpdate')
	var portserie = document.getElementById('portserie')
	var messageDiv = document.getElementById('messageDIV')

	const ports = await findAvailablePorts()
	updatePortSelector(ports)

	localStorage.setItem("verif", false)
	document.getElementById('versionapp').textContent = " Otto Blockly V" + appVersion

	function uploadOK() {
		messageDiv.style.color = '#009000'
		messageDiv.innerHTML = Blockly.Msg.upload + ': ✅ OK code uploaded' + quitDiv
		$('#message').modal('show');
		setTimeout(function () {
			$('#message').modal('hide');
		}, 3000);
	}

	$('#btn_forum').on('click', function () {
		shell.openExternal('https://discord.gg/CZZytnw')
	})
	$('#btn_site').on('click', function () {
		shell.openExternal('https://www.ottodiy.com/')
	})
	$('#btn_contact').on('click', function () {
		shell.openExternal('https://github.com/OttoDIY/blockly/issues')
	})

	async function findAvailablePorts() {
		const ports = (await serialPort.SerialPort.list()).filter(port => port.vendorId)
		console.log(ports)
		return ports
	}


	function updatePortSelector(ports) {
		console.log('updating')
		if (ports.length === 0) {
			portserie.innerHTML = '<option value="com">No Ports detected.</option>'
			return
		}
		portserie.innerHTML = ''
		ports.forEach(function (port) {
			console.log(port)
			const opt = document.createElement('option')
			opt.value = port.path
			opt.text = port.path
			portserie.appendChild(opt)
			localStorage.setItem("com", port.path)
		})
	}


	$('#portserie').mouseover(async function () {
		const ports = await findAvailablePorts()
		updatePortSelector(ports)
	})
	$('#btn_copy').on('click', function () {
		clipboard.writeText($('#pre_previewArduino').text())
	})
	$('#btn_bin').on('click', function () {
		if (localStorage.getItem('verif') == "false") {
			$("#message").modal("show")
			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.verif + quitDiv
			return
		}
		localStorage.setItem("verif", false)
		ipcRenderer.send('save-bin')
	})
	$.ajax({
		cache: false,
		url: "../config.json",
		dataType: "json",
		success: function (data) {
			$.each(data, function (i, update) {
				if (update == "true") {
					$('#verifyUpdate').prop('checked', true)
					checkBox.dispatchEvent(new Event('change'))
					ipcRenderer.send("version", "")
				} else {
					$('#verifyUpdate').prop('checked', false)
					checkBox.dispatchEvent(new Event('change'))
				}
			})
		}
	})
	checkBox.addEventListener('change', function (event) {
		if (event.target.checked) {
			fs.writeFile('config.json', '{ "update": "true" }', function (err) {
				if (err) return console.log(err)
			})
		} else {
			fs.writeFile('config.json', '{ "update": "false" }', function (err) {
				if (err) return console.log(err)
			})
		}
	})

	$('#btn_version').on('click', function () {
		$('#aboutModal').modal('hide')
		ipcRenderer.send("version", "")
	})
	$('#btn_term').on('click', function () {
		if (portserie.value == "com") {
			$("#message").modal("show")
			messageDiv.style.color = '#ff0000'
			messageDiv.innerHTML = Blockly.Msg.com2 + quitDiv
			return
		}
		if (localStorage.getItem("prog") == "python") {
			ipcRenderer.send("repl", "")
		} else {
			ipcRenderer.send("prompt", "")
		}
	})
	$('#btn_factory').on('click', function () {
		ipcRenderer.send("factory", "")
	})
	$('#btn_verify').on('click', function () {
		console.log("verify")
		if (localStorage.getItem('content') == "off") {
			var data = editor.getValue()
		} else {
			var data = $('#pre_previewArduino').text()
		}
		var carte = localStorage.getItem('card')
		var prog = localStorage.getItem('prog')
		var com = portserie.value
		messageDiv.style.color = '#000000'
		messageDiv.innerHTML = Blockly.Msg.check + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'

		if (prog == "python") {
			fs.writeFile('./compilation/python/py/sketch.py', data, function (err) {
				if (err) return console.log(err)
			})
			exec('python -m pyflakes ./py/sketch.py', {cwd: "./compilation/python"}, function (err, stdout, stderr) {
				if (stderr) {
					rech = RegExp('token')
					if (rech.test(stderr)) {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = Blockly.Msg.error + quitDiv
					} else {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = err.toString() + quitDiv
					}
					return
				}
				messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ':✅ OK' + quitDiv
			})
		} else {
			//fs.writeFile('./compilation/arduino/ino/sketch.ino', data, function(err){

			fs.writeFile(`${arduino_basepath}/sketch/sketch.ino`, data, function (err) {

				if (err) return console.log(err)
			})

			var upload_arg = window.profile[carte].upload_arg
			console.log("upload arg", upload_arg)
			var cmd = `${arduino_ide_cmd} compile -b ` + upload_arg + ' sketch/sketch.ino'
			console.log("cmd", cmd)
			/*
               exec( cmd, {cwd:'./compilation/arduino'}, function(err, stdout, stderr){
                //exec('verify.bat ' + carte, {cwd:'./compilation/arduino'}, function(err, stdout, stderr){
                    if (stderr) {
                        rech=RegExp('token')
                        if (rech.test(stderr)){
                            messageDiv.style.color = '#ff0000'
                            messageDiv.innerHTML = Blockly.Msg.error + quitDiv
                        } else {
                            messageDiv.style.color = '#ff0000'
                            messageDiv.innerHTML = err.toString() + quitDiv
                        }
                        return
                    }

                    messageDiv.style.color = '#009000'
                    messageDiv.innerHTML = Blockly.Msg.check + ': OK' + quitDiv
                }) */

			exec(cmd, {cwd: arduino_basepath}, (error, stdout, stderr) => {
				if (error) {

					messageDiv.style.color = '#ff0000'
					messageDiv.innerHTML = error.toString() + quitDiv
					return
				}

				messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ': ✅ Code is ready to upload' + quitDiv
				$('#message').modal('show');
				setTimeout(function () {
					$('#message').modal('hide');
				}, 3000);

			})


		}
		localStorage.setItem("verif", true)
	})
	$('#btn_flash').on('click', async function () {
		console.log('Button flash')
		var data = $('#pre_previewArduino').text()
		var carte = localStorage.getItem('card')
		var prog = profile[carte].prog
		var speed = profile[carte].speed
		var cpu = profile[carte].cpu
		var com = portserie.value
		var upload_arg = window.profile[carte].upload_arg

		console.log('carte', carte)
		console.log('profile', profile[carte])
		console.log('com: ', com)

		if (com == "com") {
			messageDiv.style.color = '#ff0000'
			messageDiv.innerHTML = Blockly.Msg.com2 + quitDiv
			return
		}
		if (localStorage.getItem('verif') == "false") {
			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.check + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'
			//fs.writeFile('./compilation/arduino/ino/sketch.ino', data, function(err){
			console.log('writing to ', `${arduino_basepath}/sketch/sketch.ino`)
			fs.writeFile(`${arduino_basepath}/sketch/sketch.ino`, data, function (err) {

				if (err) return console.log(err)
			})


			var cmd = `${arduino_ide_cmd} compile -b ` + upload_arg + '  --libraries userlibs/libraries sketch/sketch.ino'
			//cmd = 'arduino-cli.exe compile -b esp32:esp32:esp32 --config-file arduino-cli.yaml --libraries userlibs/libraries sketch/sketch.ino'
			console.log('basepath: ', arduino_basepath)
			console.log("running: ", cmd)
			const util = require('node:util');
			const exec = util.promisify(require('node:child_process').exec);

			try {
				const {stdout, stderr} = await exec(cmd, {cwd: `${arduino_basepath}`});
				console.log('stdout:', stdout);

				if (typeof stderr !== 'undefined' && stderr !== '') {
					console.log(typeof stderr)
					console.log('stderr')
					console.log(`:${stderr}:`)

					messageDiv.style.color = '#ff0000'
					messageDiv.innerHTML = stderr + quitDiv
					return
				}
			} catch (error) {
				console.log('catch')
				messageDiv.style.color = '#ff0000'
				messageDiv.innerHTML = error.toString() + quitDiv
				return
			}

			console.log('continue')


			messageDiv.style.color = '#009000'
			messageDiv.innerHTML = Blockly.Msg.check + ': ✅ OK' + quitDiv


			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.upload + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'

			cmd = `${arduino_ide_cmd} upload --port ` + portserie.value + ' -b ' + upload_arg + ' sketch/sketch.ino'
			//cmd = 'arduino-cli.exe upload -b esp32:esp32:esp32 --port ' + portserie.value + ' sketch/sketch.ino'
			console.log('running command: ', cmd)
			const {stdout2, stderr2} = exec(cmd, {cwd: `${arduino_basepath}`}, function (err, stdout, stderr) {
				console.log(stdout2, stderr2)
				//exec('flash.bat ' + cpu + ' ' + prog + ' '+ com + ' ' + speed, {cwd: './compilation/arduino'} , function(err, stdout, stderr){
				if (typeof stderr2 !== 'undefined' && stderr2 !== '') {
					messageDiv.style.color = '#ff0000'
					messageDiv.innerHTML = stderr2 + quitDiv
					return
				}
				console.log("ok")
				uploadOK()
			})
			localStorage.setItem("verif", false)
			return
		}


		messageDiv.style.color = '#000000'
		messageDiv.innerHTML = Blockly.Msg.upload + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'
		if (prog == "python") {
			if (cpu == "cortexM0") {
				var cheminFirmware = "./compilation/python/firmware.hex"
				var fullHexStr = ""
				exec('wmic logicaldisk get volumename', function (err, stdout) {
					if (err) return console.log(err)
					localStorage.setItem("volumename", stdout.split('\r\r\n').map(value => value.trim()))
				})
				exec('wmic logicaldisk get name', function (err, stdout) {
					if (err) return console.log(err)
					localStorage.setItem("name", stdout.split('\r\r\n').map(value => value.trim()))
				})
				var volume = localStorage.getItem("volumename")
				var drive = localStorage.getItem("name")
				var volumeN = volume.split(',')
				var driveN = drive.split(',')
				var count = volumeN.length
				var disk = ""
				for (var i = 0; i < count; i++) {
					if (volumeN[i] == "MICROBIT") disk = driveN[i]
				}
				if (disk != "") {
					fs.readFile(cheminFirmware, function (err, firmware) {
						firmware = String(firmware)
						fullHexStr = upyhex.injectPyStrIntoIntelHex(firmware, data)
						fs.writeFile(disk + '\sketch.hex', fullHexStr, function (err) {
							if (err) {
								messageDiv.style.color = '#ff0000'
								messageDiv.innerHTML = err.toString() + quitDiv
							}
						})
					})
					setTimeout(uploadOK, 7000)
				} else {
					messageDiv.style.color = '#000000'
					messageDiv.innerHTML = 'Connect micro:bit!' + quitDiv
				}
			} else {


				exec('python -m ampy -p ' + com + ' -b 115200 -d 1 run --no-output ./py/sketch.py', {cwd: "./compilation/python"}, function (err, stdout, stderr) {
					if (err) {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = err.toString() + quitDiv
						return
					}
					uploadOK()
				})
			}
		} else {


			cmd = `${arduino_ide_cmd} upload --port ` + portserie.value + ' --fqbn ' + upload_arg + ' sketch/sketch.ino'
			exec(cmd, {cwd: `${arduino_basepath}`}, function (err, stdout, stderr) {
				//exec('flash.bat ' + cpu + ' ' + prog + ' '+ com + ' ' + speed, {cwd: './compilation/arduino'} , function(err, stdout, stderr){
				if (err) {
					messageDiv.style.color = '#ff0000'
					messageDiv.innerHTML = err.toString() + quitDiv
					return
				}
				uploadOK()
			})
		}
		localStorage.setItem("verif", false)
	})
	$('#btn_saveino').on('click', function () {
		if (localStorage.getItem("prog") == "python") {
			ipcRenderer.send('save-py')
		} else {
			ipcRenderer.send('save-ino')
		}
	})
	$('#btn_saveXML').on('click', function () {
		if (localStorage.getItem("content") == "on") {
			ipcRenderer.send('save-bloc')
		} else {
			if (localStorage.getItem("prog") == "python") {
				ipcRenderer.send('save-py')
			} else {
				ipcRenderer.send('save-ino')
			}
		}
	})
	ipcRenderer.on('saved-ino', function (event, path) {
		var code = $('#pre_previewArduino').text()
		if (path === null) {
			return
		} else {
			fs.writeFile(path, code, function (err) {
				if (err) return console.log(err)
			})
		}
	})
	ipcRenderer.on('saved-py', function (event, path) {
		var code = $('#pre_previewArduino').text()
		if (path === null) {
			return
		} else {
			fs.writeFile(path, code, function (err) {
				if (err) return console.log(err)
			})
		}
	})
	ipcRenderer.on('saved-bloc', function (event, path) {
		if (path === null) {
			return
		} else {
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)
			var toolbox = localStorage.getItem("toolbox")
			if (!toolbox) {
				toolbox = $("#toolboxes").val()
			}
			if (toolbox) {
				var newel = document.createElement("toolbox")
				newel.appendChild(document.createTextNode(toolbox))
				xml.insertBefore(newel, xml.childNodes[0])
			}
			var toolboxids = localStorage.getItem("toolboxids")
			if (toolboxids === undefined || toolboxids === "") {
				if ($('#defaultCategories').length) {
					toolboxids = $('#defaultCategories').html()
				}
			}
			var code = Blockly.Xml.domToPrettyText(xml)
			fs.writeFile(path, code, function (err) {
				if (err) return console.log(err)
			})
		}
	})
	ipcRenderer.on('saved-bin', function (event, path) {
		if (path === null) {
			return
		} else {
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)
			var toolbox = localStorage.getItem("toolbox")
			if (!toolbox) {
				toolbox = $("#toolboxes").val()
			}
			if (toolbox) {
				var newel = document.createElement("toolbox")
				newel.appendChild(document.createTextNode(toolbox))
				xml.insertBefore(newel, xml.childNodes[0])
			}
			var toolboxids = localStorage.getItem("toolboxids")
			if (toolboxids === undefined || toolboxids === "") {
				if ($('#defaultCategories').length) {
					toolboxids = $('#defaultCategories').html()
				}
			}
			var code = Blockly.Xml.domToPrettyText(xml)
			var res = path.split(".")
			fs.writeFile(res[0] + '.bloc', code, function (err) {
				if (err) return console.log(err)
			})
			fs.copyFile(`${arduino_basepath}/build/sketch.ino.with_bootloader.hex`, res[0] + '_with_bootloader.hex', (err) => {
				if (err) throw err
			})
			fs.copyFile(`${arduino_basepath}/build/sketch.ino.hex`, res[0] + '.hex', (err) => {
				if (err) throw err
			})
			fs.copyFile(`${arduino_basepath}/ino/sketch.ino`, res[0] + '.ino', (err) => {
				if (err) throw err
			})
		}
	})
})
