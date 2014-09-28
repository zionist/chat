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
import java.util.*;

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
            Message msg = new Message();
            msg.setLogin(user.getLogin());
            msg.setMessage("Присоединяется к чату");
            msg.save();
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result logout() {
        if (request().method().equals("OPTIONS")) {
            SetHeaders();
            return ok();
        }
        JsonNode json = request().body().asJson();
        String login = json.findPath("login").textValue();
        if (login.isEmpty()) {
            return internalServerError("Incorrect logout json");

        }
        LoggedUser user = LoggedUser.find().where().eq("login", login).findUnique();
        if (user == null) {
            return internalServerError();
        } else {
            Message msg = new Message();
            msg.setLogin(user.getLogin());
            msg.setMessage("Покидает чат");
            msg.save();
            user.delete();
            return ok();
        }
    }

    public static Result history() {
        List<Message> msgs = Message.find().orderBy("id desc").
                setMaxRows(Constants.MAX_ROWS_COUNT).findList();
        Collections.reverse(msgs);
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
                Collections.reverse(msgs);
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
        return forbidden();
    }

    public static Result count() {
        Integer count = Message.find().findRowCount();
        return ok(count.toString());
    }
}
