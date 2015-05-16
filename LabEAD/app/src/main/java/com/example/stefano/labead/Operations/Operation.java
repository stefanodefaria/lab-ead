package com.example.stefano.labead.Operations;

import android.app.Activity;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 09/05/15.
 */
public abstract class Operation {

    public final static String endpoint = "http://192.168.1.100:8080";
    private String path;
    private JSONObject request;

    private Activity telaExpedidora;
    protected String responseMessage;

    public Operation(String path,  Activity actv){
        this.path = path;
        this.responseMessage = null;
        this.telaExpedidora = actv;
    }


    public abstract void setResponse(String response) throws JSONException;

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
