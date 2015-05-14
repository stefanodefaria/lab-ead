package com.example.stefano.labead;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 09/05/15.
 */
public class Operation {

    private final String endpoint = OperationsBuilder.protocol + OperationsBuilder.ipAddress + ":" + OperationsBuilder.port;
    private String path;
    private JSONObject request;
    private JSONObject response;

    public Operation(String path, JSONObject request){
        this.path = path;
        this.request = request;
    }


    public JSONObject getResponse() { return response; }

    public void setResponse(JSONObject response) { this.response = response; }

    public void setResponse(String response) throws JSONException{ this.response = new JSONObject(response); }

    public String getName() { return path; }

    public String getUrl() { return endpoint + "/" + path; }

    public JSONObject getRequest() { return request; }

}
