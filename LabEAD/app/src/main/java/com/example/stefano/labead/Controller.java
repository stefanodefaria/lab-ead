package com.example.stefano.labead;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;

import com.example.stefano.labead.activities.ActivityExpForm;
import com.example.stefano.labead.activities.ActivityExpList;
import com.example.stefano.labead.activities.ActivityLogin;
import com.example.stefano.labead.operations.Operation;
import com.example.stefano.labead.operations.OperationGetExpList;
import com.example.stefano.labead.operations.OperationLogin;
import com.example.stefano.labead.operations.OperationLogout;

import org.json.JSONException;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;

public class Controller {

    private static ActivityExpForm mTelaExpForm;
    private static ActivityLogin mTelaLogin;
    private static ActivityExpList mTelaLista;
    private static Activity mTelaEmUso;

    private static int mTimeOutDate;
    private static int mtimeOutLimit;
    private static String mToken;
    private static String mEmail;
    private static ArrayList<String> mExpNamesList;
    private static ArrayList<String> mExpIDsList;

    public static void setmTelaExpForm(ActivityExpForm mTelaExpForm) {
        Controller.mTelaExpForm = mTelaExpForm;
        mTelaEmUso = mTelaExpForm;
    }
    public static void setmTelaLogin(ActivityLogin mTelaLogin) {
        Controller.mTelaLogin = mTelaLogin;
        mTelaEmUso = mTelaLogin;
    }
    public static void setmTelaLista(ActivityExpList mTelaLista) {
        Controller.mTelaLista = mTelaLista;
        mTelaEmUso = mTelaLista;
    }


    public static void receberResposta(ArrayList<String> error, Operation operation){
        if(error.size()==0) {

            switch (operation.getName()){
                case "login":
                    handleLoginResponse((OperationLogin) operation);
                    break;
                case "logout":
                    handleLogoutResponse((OperationLogout) operation);
                    break;
                case "getExpList":
                    handleGetExpListResponse((OperationGetExpList)operation);
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

    public static void iniciarOperacaoLogin(Activity sender, String email, String password){
        try{
            new HttpsOperation(new OperationLogin(email, password, sender)).start();
        }
        catch(JSONException e){

            showErrorMessage("Não criou JSON");
        }
        catch (Exception e){
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));

            showErrorMessage(sw.toString());
        }
    }

    public static void iniciarOperacaoLogout(Activity sender){
        try{
            new HttpsOperation(new OperationLogout(mEmail, mToken, sender)).start();
        }
        catch(JSONException e){

            showErrorMessage("Não criou json");
        }
        catch (Exception e){
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));

            showErrorMessage(sw.toString());
        }
    }

    public static void iniciarOperacaoGetExpList(Activity sender){
        try{
            new HttpsOperation(new OperationGetExpList(mEmail, mToken, sender)).start();
        }
        catch(JSONException e){

            showErrorMessage("Não criou json");
        }
        catch (Exception e){
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));

            showErrorMessage(sw.toString());
        }

    }

    private static void handleLoginResponse(OperationLogin loginOp){
        String responseMsg = loginOp.getResponseMessage();
        switch (responseMsg){
            case Definitions.SUCCESS:
                mToken = loginOp.getToken();
                mEmail = loginOp.getReqEmail();
                mtimeOutLimit = loginOp.getTimeoutLimit();
                mTimeOutDate = (int)(System.currentTimeMillis()/1000) + mtimeOutLimit;
                Intent intent = new Intent(loginOp.getTelaExpedidora(), ActivityExpList.class);
                loginOp.getTelaExpedidora().startActivity(intent);
                break;
            case Definitions.BAD_CREDENTIALS:
                mTelaLogin.showProgress(false);
                showErrorMessage(mTelaEmUso.getString(R.string.error_bad_credentials));
                break;
            default:
                showErrorMessage(responseMsg);
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
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                logoutOp.getTelaExpedidora().startActivity(intent);
                mTelaEmUso.finish();
                break;
            case Definitions.BAD_CREDENTIALS:
                showErrorMessage(mTelaEmUso.getString(R.string.error_bad_credentials));
                break;
            default:
                showErrorMessage(responseMsg);
        }
    }

    private static void handleGetExpListResponse(OperationGetExpList getExpListOp){
        String responseMsg = getExpListOp.getResponseMessage();
        switch (responseMsg) {
            case Definitions.SUCCESS:
                mTimeOutDate = (int)(System.currentTimeMillis()/1000) + mtimeOutLimit;
                mExpNamesList = getExpListOp.getExpNames();
                mExpIDsList = getExpListOp.getExpIDs();

                if(mTelaLista== null){
                    Intent intent = new Intent(getExpListOp.getTelaExpedidora(), getExpListOp.getTelaExpedidora().getClass());
                    getExpListOp.getTelaExpedidora().startActivity(intent);
                }

                mTelaLista.setExpList(mExpNamesList, mExpIDsList);

                break;
            case Definitions.BAD_CREDENTIALS:
                showErrorMessage(mTelaEmUso.getString(R.string.error_bad_credentials));
                break;
            default:
                showErrorMessage(responseMsg);
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
