package com.example.stefano.labead;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by stefano on 09/05/15.
 */
public class OperationsBuilder{
    public static String ipAddress = "192.168.1.100";
    public static String protocol = "http://";
    public static String port = "8080";

    public static Operation loginOperation(String email, String password) throws JSONException{

        JSONObject loginJSON = new JSONObject();

        loginJSON.put("email", "student1@test.com");
        loginJSON.put("password", "12345");

        return new Operation("login", loginJSON);
    }

}
