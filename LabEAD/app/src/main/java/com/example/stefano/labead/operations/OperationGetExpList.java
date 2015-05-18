package com.example.stefano.labead.operations;

import android.app.Activity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;


public class OperationGetExpList extends Operation {

    private String reqEmail;
    private String reqToken;
    private ArrayList<String> expIDs;
    private ArrayList<String> expNames;

    public OperationGetExpList(String email, String token, Activity actv) throws JSONException{
        super("/getExpList", actv);

        JSONObject request = new JSONObject();

        request.put("email", email);
        request.put("token", token);

        this.setRequest(request);

        this.reqEmail = email;
        this.reqToken = token;
    }

    @Override
    public void setResponse(String response) throws JSONException {
        super.setResponse(response);
        JSONObject json = new JSONObject(response);
        JSONArray idArr = json.getJSONArray("experiencesIDs");      // os 2 arrays devem ter
        JSONArray namesArr = json.getJSONArray("experiencesNames"); // o mesmo length

        for(int i=0; i<idArr.length(); i++){
            if (i==0) {
                expIDs = new ArrayList<>();
                expNames = new ArrayList<>();
            }
            expIDs.add(idArr.getString(i));
            expNames.add(namesArr.getString(i));
        }
    }

    @Override
    public void resetOperation(){
        super.resetOperation();
        this.reqToken = null;
        this.reqEmail = null;
        this.expIDs = null;
        this.expNames = null;
        // this.accType = null;
    }

    public ArrayList<String> getExpIDs() { return expIDs; }

    public ArrayList<String> getExpNames() { return expNames; }

}
