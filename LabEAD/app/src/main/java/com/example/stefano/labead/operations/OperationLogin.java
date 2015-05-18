package com.example.stefano.labead.operations;

import android.app.Activity;

import org.json.JSONException;
import org.json.JSONObject;

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
        super.setResponse(response);
        JSONObject json = new JSONObject(response);
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
