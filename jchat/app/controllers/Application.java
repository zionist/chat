package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import common.Constants;
import models.LoggedUser;
import models.Message;
import play.*;
import play.mvc.*;
import play.db.*;

import views.html.*;

import javax.activation.DataSource;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Application extends Controller {

    private static void SetHeaders() {
        for (String key: Constants.headers.keySet()) {
            response().setHeader(key, Constants.headers.get(key));
        }
    }

    public static Result index() {
        return ok(index.render("Добро пожаловать в чат!"));
    }

    public static Result send() {
        if (request().method().equals("OPTIONS")) {
            SetHeaders();
            return ok();
        }
        JsonNode json = request().body().asJson();
        String login = json.findPath("login").textValue();
        String message = json.findPath("message").textValue();
        if (login.isEmpty() || message.isEmpty()) {
            return internalServerError("Incorrect message json");

        }
        Message mesg = new Message();
        mesg.setLogin(login);
        mesg.setMessage(message);
        mesg.save();
        return ok();
    }



    public static Result login() {
        if (request().method().equals("OPTIONS")) {
            SetHeaders();
            return ok();
        }
        JsonNode json = request().body().asJson();
        String login = json.findPath("login").textValue();
        if (login.isEmpty()) {
            return internalServerError("Incorrect login json");

        }
        if (LoggedUser.find().where().eq("login", login).findRowCount() == 0) {
            // insert new LoggedUser
            LoggedUser user= new LoggedUser();
            user.setLogin(login);
            user.save();
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result history() {
        return ok("[{\"login\": \"testlogin\", \"message\": \"test message\"}]");
    }

    public static Result count() {
        //LoggedUser user= new LoggedUser();
        //user.setLogin("test1");
        //user.save();
        List<LoggedUser> users = LoggedUser.find().all();
        return ok("0" + users.get(0).getLogin());
    }
}
