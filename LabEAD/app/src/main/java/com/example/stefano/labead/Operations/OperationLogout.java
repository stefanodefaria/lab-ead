package com.example.stefano.labead.Operations;

import android.app.Activity;
import android.util.Log;

import com.example.stefano.labead.Controller;

import org.json.JSONException;
import org.json.JSONObject;

public class OperationLogout extends Operation {
    private String reqEmail;
    private String reqToken;
//    private String accType;

    public OperationLogout(String email, String token, Activity sender) throws JSONException {
        super("/logout", sender);

        JSONObject logout = new JSONObject();

        logout.put("email", email);
        logout.put("token", token);

        this.setRequest(logout);

        this.reqEmail = email;
        this.reqToken = token;
    }

    public void setResponse(String response) throws JSONException {
        JSONObject json = new JSONObject(response);
        this.responseMessage = json.getString("message");
    }

    public String getReqEmail() { return reqEmail; }
    public String getReqToken() { return reqToken; }
}
