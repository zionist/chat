# Users schema

# --- !Ups

CREATE TABLE logged_user (
  login varchar(255) NOT NULL UNIQUE
);

CREATE TABLE message (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  message varchar(255) NOT NULL,
  login varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

# --- !Downs

DROP TABLE message;
DROP TABLE logged_user;
