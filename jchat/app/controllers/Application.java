package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import common.Constants;
import play.*;
import play.mvc.*;
import play.db.*;

import views.html.*;

import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;

public class Application extends Controller {

    // private static final DataSource ds = DB.getDatasource();

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
        return ok("0");
    }
}
