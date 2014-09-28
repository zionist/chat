package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import common.Constants;
import models.LoggedUser;
import models.Message;
import play.*;
import play.libs.Json;
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
        for (String key: Constants.HEADERS.keySet()) {
            response().setHeader(key, Constants.HEADERS.get(key));
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
        Logger.info("# got message from " + login + " " + message);
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
        List<Message> msgs = Message.find().orderBy("id").setMaxRows(50).findList();
        //TODO: make correct json serialisation
        String answer = "[";
        for (Message msg: msgs ) {
            answer += msg.toJson().toString();
            answer += ",";
        }
        answer = answer.substring(0, answer.length() - 1);
        answer += "]";
        return ok(answer);
    }

    public static Result getMessages(Integer num) throws InterruptedException {
        Integer spentTime = 0;
        while (spentTime < Constants.WAIT_TIMEOUT) {
            Integer max_rows = Message.find().findRowCount();
            Integer delta = max_rows - num;
            if (delta == 0) {
                // block current thread for one second
                Thread.sleep(1000);
                spentTime += 1;
                continue;
            } else {
                List<Message> msgs = Message.find().orderBy("id desc").setMaxRows(delta).findList();
                String answer = "[";
                for (Message msg : msgs) {
                    answer += msg.toJson().toString();
                    answer += ",";
                }
                answer = answer.substring(0, answer.length() - 1);
                answer += "]";
                return ok(answer);
            }
        }
        return ok("");
    }


    public static Result count() {
        Integer count = Message.find().findRowCount();
        //LoggedUser user= new LoggedUser();
        //user.setLogin("test1");
        //user.save();
        // List<LoggedUser> users = LoggedUser.find().all();
        return ok(count.toString());
    }
}
