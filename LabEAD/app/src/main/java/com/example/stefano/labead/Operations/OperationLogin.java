package com.example.stefano.labead.Operations;

import android.app.Activity;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 14/05/15.
 */
public class OperationLogin extends Operation {
    private String token;
    private int timeoutLimit;

    private String reqEmail;
    private String reqPassword;
//    private String accType;

    public OperationLogin(String email, String password, Activity sender) throws JSONException {
        super("/login", sender);

        JSONObject loginJSON = new JSONObject();

        loginJSON.put("email", email);
        loginJSON.put("password", password);

        this.setRequest(loginJSON);

        this.reqEmail = email;
        this.reqPassword = password;
    }

    @Override
    public void setResponse(String response) throws JSONException {
        JSONObject json = new JSONObject(response);
        this.responseMessage = json.getString("message");
        this.token = json.getString("token");
        this.timeoutLimit = Integer.parseInt(json.getString("timeout"));
//        this.accType = json.getString("accType");
    }



    @Override
    public void resetOperation(){
        super.resetOperation();
        this.token = null;
        this.timeoutLimit = -1;
        this.reqPassword = null;
        this.reqEmail = null;
        // this.accType = null;
    }

    public String getToken() { return token; }
    public int getTimeoutLimit() { return timeoutLimit; }
    public String getReqPassword() { return reqPassword; }
    public String getReqEmail() { return reqEmail; }
//    public String getAccType() { return accType; }

}
