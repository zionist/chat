package models;

import java.util.*;
import javax.persistence.*;
import javax.validation.Constraint;

import play.db.ebean.*;
import play.data.format.*;
import play.data.validation.*;

@Entity
public class LoggedUser extends Model {

    @Id
    @Constraints.Required
    @Constraints.Max(255)
    private String login;

    public static Finder<String, LoggedUser> find() {
        return new Finder<String, LoggedUser>(String.class, LoggedUser.class);
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getLogin() {
        return this.login;
    }
}

