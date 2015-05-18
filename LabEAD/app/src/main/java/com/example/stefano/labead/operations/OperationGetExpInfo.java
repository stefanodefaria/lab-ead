package com.example.stefano.labead.operations;

import android.app.Activity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class OperationGetExpInfo extends Operation {
    private String reqEmail;
    private String reqToken;
    private String reqExpID;

    private String expDescricao;
    private ArrayList<String> expFormCampos;
    private ArrayList<String> expFormHints;


    public OperationGetExpInfo(String email, String token, String expID, Activity actv) throws JSONException{
        super("/getExpInfo", actv);

        JSONObject request = new JSONObject();

        request.put("email", email);
        request.put("token", token);
        request.put("expID", expID);

        this.setRequest(request);
        this.reqEmail = email;
        this.reqToken = token;
        this.reqExpID = expID;
    }

    @Override
    public void setResponse(String response) throws JSONException {
        super.setResponse(response);
        JSONObject json = new JSONObject(response);
        this.expDescricao = json.getString("expDescription");
        JSONArray arrCampos = json.getJSONArray("experiencesIDs");      // os 2 arrays devem ter
        JSONArray arrHints = json.getJSONArray("experiencesNames"); // o mesmo length

        for(int i=0; i<arrCampos.length(); i++){
            if (i==0) {
                expFormCampos = new ArrayList<>();
                expFormHints = new ArrayList<>();
            }
            expFormCampos.add(arrCampos.getString(i));
            expFormHints.add(arrHints.getString(i));
        }
    }

    @Override
    public void resetOperation(){
        super.resetOperation();
//        this.reqToken = null;
//        this.reqEmail = null;
//        this.expIDs = null;
//        this.expNames = null;
//        // this.accType = null;
    }

    public String getExpDescricao() { return expDescricao; }
    public ArrayList<String> getExpFormCampos() { return expFormCampos; }
    public ArrayList<String> getExpFormHints() { return expFormHints; }
}
