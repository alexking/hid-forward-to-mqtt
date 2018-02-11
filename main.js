var hid = require("hidstream")
var mqtt = require("mqtt")
var yaml = require("node-yaml")

// Load configuration 
var config = yaml.readSync("config.yaml");

// Attempt to connect to the MQTT server 
var queue = mqtt.connect(config.mqtt.url)

queue.on("connect", function() {

    // Setup a device to watch 
    var device = new hid.device({
        path: config.hid.device, 
        parser : hid.parser.newline 
    })

    // Watch for data 
    device.on("data", function(data) {

        // Ignore empty lines 
        if (data != "") {

            var code = data.trim();
            console.log("Read: " + code)

            console.log("Pushing onto mqtt " + config.mqtt.topic)
            queue.publish(config.mqtt.topic, code)
        }
    })

})