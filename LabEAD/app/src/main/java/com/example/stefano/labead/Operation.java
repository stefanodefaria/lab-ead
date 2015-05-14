package com.example.stefano.labead;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 09/05/15.
 */
public abstract class Operation {

    public final static String endpoint = "http://192.168.1.100:8080";
    protected String path;
    protected JSONObject request;


    protected String responseMessage;

    protected Operation(String path){ this.path = path; }

    public Operation(String path, JSONObject request){
        this.path = path;
        this.request = request;
        this.responseMessage = null;
    }




    public abstract void setResponse(String response) throws JSONException;

    public String getName() { return path.replace("/", ""); } // remove a barra

    public String getUrl() { return endpoint + path; }

    public JSONObject getRequest() { return request; }

    public String getResponseMessage() { return responseMessage; }

    public boolean hasReceivedValidResponse(){ return (responseMessage!=null); }
}
