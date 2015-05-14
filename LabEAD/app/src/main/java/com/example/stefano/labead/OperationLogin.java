package com.example.stefano.labead;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 14/05/15.
 */
public class OperationLogin extends Operation {
    private String token;
    private int timeoutLimit;
//    private String accType;

    public OperationLogin(String email, String password) throws JSONException {
        super("/login");

        JSONObject loginJSON = new JSONObject();

        loginJSON.put("email", email);
        loginJSON.put("password", password);

        this.request = loginJSON;
    }

    @Override
    public void setResponse(String response) throws JSONException {
        JSONObject json = new JSONObject(response);
        this.responseMessage = json.getString("message");
        this.token = json.getString("token");
        this.timeoutLimit = Integer.parseInt(json.getString("timeout"));
//        this.accType = json.getString("accType");
    }

//    public String getAccType() {
//        return accType;
//    }

    public String getToken() {
        return token;
    }

    public int getTimeoutLimit() {
        return timeoutLimit;
    }
}
