var PubNub = require('pubnub');

function subscribe() {
   
    pubnub = new PubNub({
        subscribeKey : 'sub-c-906b4314-7409-11e7-91f5-0619f8945a4f'
    });
       
    pubnub.addListener({
        status: function(statusEvent) {
            //if (statusEvent.category === "PNConnectedCategory") {
            //    publishSampleMessage();
            //
        },
        message: function(message) {
            console.log("New Message!!", message);
            func = message.message["Function Name"];
            if(func == "Channel") {
                
            }
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    }); 

    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['auto_home'] 
    });
}

if (require.main === module) {
    subscribe();
}
