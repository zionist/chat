package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import common.Constants;
import models.LoggedUser;
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

    public static Result login() {
        if (request().method().equals("OPTIONS")) {
            SetHeaders();
        }
        JsonNode json = request().body().asJson();
        String login = json.findPath("login").textValue();
        return ok("data: " + login + "\n");
    }

    public static Result history() {
        return ok("[{\"login\": \"testlogin\", \"message\": \"test message\"}]");
    }

    public static Result count() {
        LoggedUser user= new LoggedUser();
        user.setLogin("test1");
        user.save();
        List<LoggedUser> users = LoggedUser.find().all();
        return ok("0" + users.get(0).getLogin());
    }
}
