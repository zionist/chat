package models;

import java.util.*;
import javax.persistence.*;

import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.*;
import play.data.format.*;
import play.data.validation.*;
import play.libs.Json;

@Entity
public class Message extends Model {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Constraints.Required
    @Constraints.Max(255)
    private String message;

    @Constraints.Required
    @Constraints.Max(255)
    private String login;

    public static Finder<Long, Message> find() {
        return new Finder<Long, Message>(Long.class, Message.class);
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getLogin() {
        return this.login;
    }

    public ObjectNode toJson() {
        ObjectNode result = Json.newObject();
        result.put("login", getLogin());
        result.put("message", getMessage());
        return result;
    }
}
