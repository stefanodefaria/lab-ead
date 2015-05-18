package com.example.stefano.labead.operations;

import android.app.Activity;

import org.json.JSONException;
import org.json.JSONObject;

public class OperationLogout extends Operation {
    private String reqEmail;
    private String reqToken;

    public OperationLogout(String email, String token, Activity sender) throws JSONException {
        super("/logout", sender);

        JSONObject logout = new JSONObject();

        logout.put("email", email);
        logout.put("token", token);

        this.setRequest(logout);

        this.reqEmail = email;
        this.reqToken = token;
    }

    public String getReqEmail() { return reqEmail; }
    public String getReqToken() { return reqToken; }
}
