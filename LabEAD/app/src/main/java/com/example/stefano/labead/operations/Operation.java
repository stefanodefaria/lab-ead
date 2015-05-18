package com.example.stefano.labead.operations;

import android.app.Activity;

import com.example.stefano.labead.R;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 09/05/15.
 */
public abstract class Operation {

    private String endpoint;
    private String path;
    private JSONObject request;

    private Activity telaExpedidora;
    private String responseMessage;

    public Operation(String path,  Activity actv){
        this.path = path;
        this.responseMessage = null;
        this.telaExpedidora = actv;

        this.endpoint = "http://" + telaExpedidora.getString(R.string.ip_address) +
                ":" + telaExpedidora.getString(R.string.port);
    }

    public void setResponse(String response) throws JSONException {
        JSONObject json = new JSONObject(response);
        this.responseMessage = json.getString("message");
    }

    public void resetOperation(){
        this.responseMessage = null;
        this.request = null;
    }

    protected void setRequest(JSONObject request) {
        this.request = request;
    }

    public Activity getTelaExpedidora() {
        return telaExpedidora;
    }

    public String getName() { return path.replace("/", ""); } // remove a barra

    public String getUrl() { return endpoint + path; }

    public JSONObject getRequest() { return request; }

    public String getResponseMessage() { return responseMessage; }

    public boolean hasReceivedValidResponse(){ return (responseMessage!=null); }
}
