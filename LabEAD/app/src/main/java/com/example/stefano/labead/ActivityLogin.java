package com.example.stefano.labead;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.app.Activity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;


/**
 * A loginRequest screen that offers loginRequest via email/password.
 */
public class ActivityLogin extends Activity {

    // UI references.
    private EditText mEmailView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;
    private CheckBox mRegisterCheckboxView;
    private EditText mNameView;
    private EditText mPasswordConfirmationView;
    private Button mSignInRegisterButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Controller.setmTelaLogin(this);

        // Set up the loginRequest form.
        mEmailView = (EditText) findViewById(R.id.email);
        mPasswordView = (EditText) findViewById(R.id.password);
        mNameView = (EditText) findViewById(R.id.name);
        mPasswordConfirmationView = (EditText) findViewById(R.id.passwordConfirmation);
        mRegisterCheckboxView = (CheckBox) findViewById(R.id.checkBoxRegister);
        mSignInRegisterButton = (Button) findViewById(R.id.sign_in_register_button);
        mLoginFormView = findViewById(R.id.login_form);
        mProgressView = findViewById(R.id.login_progress);

        mRegisterCheckboxView.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                onChangedRegisterCheckBox(b);
            }
        });

        mSignInRegisterButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if(validateInput()){
                    showProgress(true);

                    if(mRegisterCheckboxView.isChecked()) attemptRegister();
                    else attemptLogin();

                   //mNameView.setText(null);
                    mPasswordView.setText(null);
                    mPasswordConfirmationView.setText(null);
                }
            }
        });
    }

    @Override
    protected void onResume(){
        super.onResume();
        showProgress(false);
    }


    private void onChangedRegisterCheckBox(boolean checked){
        if(checked){
            mNameView.setVisibility(View.VISIBLE);
            mPasswordConfirmationView.setVisibility(View.VISIBLE);
            mSignInRegisterButton.setText(getString(R.string.action_register));

            mEmailView.setNextFocusDownId(R.id.name);
            mNameView.setNextFocusDownId(R.id.password);
            mPasswordView.setNextFocusDownId(R.id.passwordConfirmation);
            mPasswordConfirmationView.setNextFocusDownId(R.id.sign_in_register_button);

        }
        else{
            mNameView.setVisibility(View.GONE);
            mPasswordConfirmationView.setVisibility(View.GONE);
            mSignInRegisterButton.setText(getString(R.string.action_login));

            mEmailView.setNextFocusDownId(R.id.password);
            mPasswordView.setNextFocusDownId(R.id.sign_in_register_button);
        }
    }


    /**
     * Attempts to sign in or register the account specified by the loginRequest form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual loginRequest attempt is made.
     */
    public void attemptLogin() {

        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();
        Controller.iniciarOperacaoLogin(this, email, password);
    }

    public void attemptRegister(){

        String name = mNameView.getText().toString();
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();

    }

    private boolean validateInput(){
        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);
        mNameView.setError(null);
        mPasswordConfirmationView.setError(null);

        boolean isRegistration = mRegisterCheckboxView.isChecked();

        // Store values at the time of the loginRequest attempt.
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();
        String name = mNameView.getText().toString();
        String passwordConfirmation = mPasswordConfirmationView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        if(isRegistration){
            if (TextUtils.isEmpty(passwordConfirmation)) {
                mPasswordConfirmationView.setError(getString(R.string.error_field_required));
                focusView = mPasswordConfirmationView;
                cancel = true;
            } else if (!passwordConfirmation.equals(password)) {
                mPasswordConfirmationView.setError(getString(R.string.error_incorrect_password_confirmation));
                focusView = mPasswordConfirmationView;
                cancel = true;
            }
            if (TextUtils.isEmpty(name)) {
                mNameView.setError(getString(R.string.error_field_required));
                focusView = mNameView;
                cancel = true;
            }
        }

        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(password)) {
            mPasswordView.setError(getString(R.string.error_field_required));
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        } else if (!email.contains("@")) {
            mEmailView.setError(getString(R.string.error_invalid_email));
            focusView = mEmailView;
            cancel = true;
        }



        if (cancel){
            // There was an error; don't attempt loginRequest and focus the first
            // form field with an error.
            focusView.requestFocus();
        }
        return !cancel;
    }

    /**
     * Shows the progress UI and hides the loginRequest form.
     */
    public void showProgress(final boolean show) {
        int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

        mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        mLoginFormView.animate().setDuration(shortAnimTime).alpha(
                show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            }
        });

        mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
        mProgressView.animate().setDuration(shortAnimTime).alpha(
                show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            }
        });
    }

}