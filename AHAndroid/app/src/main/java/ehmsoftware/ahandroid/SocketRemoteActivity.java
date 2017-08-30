package ehmsoftware.ahandroid;

import android.content.Context;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import io.ably.lib.realtime.AblyRealtime;
import io.ably.lib.realtime.Channel;
import io.ably.lib.realtime.CompletionListener;
import io.ably.lib.types.AblyException;
import io.ably.lib.types.ErrorInfo;
import io.ably.lib.types.Message;

public class SocketRemoteActivity extends AppCompatActivity {

    private static final String API_KEY = "NtYGvg.lADLCg:_YcwQxp-lniZ_xWY";
    private AblyRealtime realtime;
    public static String CHAN_STR = "AH_Test";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_socket_remote);

        int[] socketIds = {R.id.sock1_on, R.id.sock1_off, R.id.sock2_on, R.id.sock2_off,
                           R.id.sock3_on, R.id.sock3_off, R.id.sock4_on, R.id.sock4_off,
                           R.id.sock5_on, R.id.sock5_off};

        String[] toast_strs = {"Socket 1 On", "Socket 1 Off", "Lamp On", "Lamp Off",
                               "Fan On", "Fan Off", "AC On", "AC Off", "Overhead Light On",
                               "Overhead Light Off"};

        try {
            initAbly();
        } catch(AblyException e) {
            e.printStackTrace();
        }

        for(int i = 0; i < socketIds.length; i++) {
            Button button = (Button) findViewById(socketIds[i]);
            new ButtonClick(toast_strs[i], button, this, this.realtime);
        }
    }

    private void initAbly() throws AblyException {
        this.realtime = new AblyRealtime(API_KEY);

        Channel channel = realtime.channels.get(CHAN_STR);
        channel.subscribe(new Channel.MessageListener() {
            @Override
            public void onMessage(Message message) {
                //Toast.makeText(getBaseContext(), "Message received: " + message.data,
                //        Toast.LENGTH_SHORT).show();
                Log.v("ABLY", "Message received: " + message.data);
            }
        });
    }

    private static class ButtonClick implements View.OnClickListener {

        private String toastString;
        private Button button;
        private Context context;
        private AblyRealtime realtime;
        private Channel channel;

        private static Toast currToast = null;

        public ButtonClick(String toastString, Button button, Context context,
                           AblyRealtime realtime) {
            this.toastString = toastString;
            this.button = button;
            this.context = context;
            this.realtime = realtime;
            this.channel = realtime.channels.get(SocketRemoteActivity.CHAN_STR);


            this.button.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            if(currToast != null) {
                currToast.cancel();
            }

            try {
                this.channel.publish("update", toastString, new CompletionListener() {
                    @Override
                    public void onSuccess() {
                        Log.d("ABLY", "Message Sent");
                    }

                    @Override
                    public void onError(ErrorInfo reason) {
                        Log.d("ABLY", "Error sending message.");
                    }
                });
            } catch (AblyException e) {
                e.printStackTrace();
            }

            currToast = Toast.makeText(this.context, this.toastString, Toast.LENGTH_SHORT);
            currToast.show();
        }
    }
}
