package com.example.stefano.labead;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.widget.Toast;

import com.example.stefano.labead.Operations.Operation;
import com.example.stefano.labead.Operations.OperationLogin;
import com.example.stefano.labead.Operations.OperationLogout;

import org.json.JSONException;

import java.util.ArrayList;

public class Controller {

    private static ActivityExpForm mTelaGravidade;
    private static ActivityLogin mTelaLogin;
    private static ActivityExpList mTelaLista;
    private static Activity mTelaEmUso;

    private static int mTimeOutDate;
    private static String mToken;
    private static String mEmail;

    public static void setmTelaGravidade(ActivityExpForm mTelaGravidade) {
        Controller.mTelaGravidade = mTelaGravidade;
        mTelaEmUso = mTelaGravidade;
    }
    public static void setmTelaLogin(ActivityLogin mTelaLogin) {
        Controller.mTelaLogin = mTelaLogin;
        mTelaEmUso = mTelaLogin;
    }
    public static void setmTelaLista(ActivityExpList mTelaLista) {
        Controller.mTelaLista = mTelaLista;
        mTelaEmUso = mTelaLista;
    }


    public static void iniciarOperacaoLogin(Activity sender, String email, String password){
        try{
            new HttpsOperation(new OperationLogin(email, password, sender));
        }
        catch(JSONException e){

            showErrorMessage("Não criou JSON\nemail:" + email + "\npassword:");
        }
        catch (Exception e){
            showErrorMessage(e.getStackTrace().toString());
        }
    }

    public static void iniciarOperacaoLogout(Activity sender){
        try{
            new HttpsOperation(new OperationLogout(mEmail, mToken, sender));
        }
        catch(JSONException e){

            Toast.makeText(mTelaEmUso, "Não criou json", Toast.LENGTH_SHORT).show();
        }
        catch (Exception e){
            Toast.makeText(mTelaEmUso, "dEU MERDA", Toast.LENGTH_SHORT).show();
        }
    }

    public static void receberJson(ArrayList<String> error, Operation operation){
        if(error.size()==0) {

            switch (operation.getName()){
                case "login":
                    handleLoginResponse((OperationLogin) operation);
                    break;
                case "logout":
                    handleLogoutResponse((OperationLogout) operation);
                    break;

                default:
                    showErrorMessage("Operação <" + operation.getName() + "> nao implementada");
            }
        }
        else {
            String erros = "";
            for(String s: error) erros +=" " + s;

            showErrorMessage(erros);
        }
    }

    private static void handleLogoutResponse(OperationLogout logoutOp){
        String responseMsg = logoutOp.getResponseMessage();
        switch (responseMsg) {
            case Definitions.SUCCESS:
                mToken = null;
                mTimeOutDate = -1;
                mEmail = null;
                Intent intent = new Intent(logoutOp.getTelaExpedidora(), ActivityLogin.class);
                logoutOp.getTelaExpedidora().startActivity(intent);
                break;
            case Definitions.BAD_CREDENTIALS:
                showErrorMessage(mTelaLogin.getString(R.string.error_bad_credentials));
                break;
            default:
                showErrorMessage(responseMsg);
        }
    }

    private static void handleLoginResponse(OperationLogin loginOp){
        String responseMsg = loginOp.getResponseMessage();
        switch (responseMsg){
            case Definitions.SUCCESS:
                mToken = loginOp.getToken();
                mEmail = loginOp.getReqEmail();
                mTimeOutDate = (int)(System.currentTimeMillis()/1000) + loginOp.getTimeoutLimit();
                Intent intent = new Intent(loginOp.getTelaExpedidora(), ActivityExpList.class);
                mTelaLogin.startActivity(intent);
                break;
            case Definitions.BAD_CREDENTIALS:
                mTelaLogin.showProgress(false);
                showErrorMessage(mTelaLogin.getString(R.string.error_bad_credentials));
                break;
            default:
                showErrorMessage(responseMsg);
//            case Definitions.BAD_DATA:
//                String email = loginOp.getReqEmail();
//                String password = loginOp.getReqPassword();
//                break;
//            case Definitions.MISSING_DATA:
//                break;
//            case Definitions.SERVER_ERROR:
//                break;
        }
    }

    public static void showErrorMessage(String msg){
        AlertDialog alertDialog = new AlertDialog.Builder(mTelaEmUso).create();
        alertDialog.setTitle("Erro");
        alertDialog.setMessage(msg);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
    }
}
