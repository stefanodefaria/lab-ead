package com.example.stefano.labead;

import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import org.json.JSONException;

import java.util.ArrayList;


/**
 * Created by stefano on 09/05/15.
 */

public class Controller {

    private static ActivityExpForm telaGravidade;
    private static ActivityLogin telaLogin;
    private static ActivityExpList telaLista;

    private static int timeOutDate;
    private static String token;

    public static ActivityExpForm getTelaGravidade() {
        return telaGravidade;
    }

    public static void setTelaGravidade(ActivityExpForm telaGravidade) { Controller.telaGravidade = telaGravidade;}
    public static void setTelaLogin(ActivityLogin telaLogin) {
        Controller.telaLogin = telaLogin;
    }
    public static void setTelaLista(ActivityExpList telaLista) {
        Controller.telaLista = telaLista;
    }


    public static void iniciarOperacaoRede(Context context, String email, String password){
        try{
//            new HttpsOperation(context, new OperationLogin("student1@test.com", "12345"));

//            if(email.equals("student1@test.com") && password.equals("12345"))
//                Toast.makeText(context,"Era pra dar certo...", Toast.LENGTH_SHORT).show();
//            else
//
//                Toast.makeText(context,"Alguma cosia tá errada", Toast.LENGTH_SHORT).show();
//            //Toast.makeText(context, email + " - " +  password, Toast.LENGTH_SHORT).show();
            new HttpsOperation(context, new OperationLogin(email, password));
        }
        catch(JSONException e){

            Toast.makeText(context, "Não criou json", Toast.LENGTH_SHORT).show();
        }
        catch (Exception e){
            Toast.makeText(context, "dEU MERDA", Toast.LENGTH_SHORT).show();
        }
    }

    public static void receberJson(ArrayList<String> error, Operation operation){
        if(error.size()==0) {

            switch (operation.getName()){
                case "login":
                    handleLoginResponse((OperationLogin) operation);
                    break;
                default:
                    Toast.makeText(telaGravidade, "Operação nao implementada", Toast.LENGTH_SHORT).show();
            }
        }
        else {
            String erros = "";
            for(String s: error) erros +=" " + s;

            Toast.makeText(telaLogin, erros, Toast.LENGTH_SHORT).show();
        }
    }


    private static void handleLoginResponse(OperationLogin loginOp){
        switch (loginOp.responseMessage){
            case Definitions.SUCCESS:
                token = loginOp.getToken();
                timeOutDate = (int)(System.currentTimeMillis()/1000) + loginOp.getTimeoutLimit();
                Intent intent = new Intent(telaLogin, ActivityExpList.class);
                telaLogin.startActivity(intent);
                telaLogin.showProgress(false);
                break;
        }
    }
}
