var PubNub = require('pubnub');

var publish = function publish() {
   
    pubnub = new PubNub({
        publishKey : 'pub-c-7e9eb7ff-6ec8-4486-b03f-e0f68291b14c',
        subscribeKey : 'sub-c-906b4314-7409-11e7-91f5-0619f8945a4f'
    });

    function publishSampleMessage() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
        var publishConfig = {
            channel : "auto_home_channel",
            message : "Hello from PubNub Docs!"
        };
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        });
    }

    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function(message) {
            console.log("New Message!!", message);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    });
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['auto_home_channel'] 
    });
};

if (require.main === module) {
    publish();
}
