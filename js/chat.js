// conf
SERVER_URL = "http://127.0.0.1";
SERVER_PORT = "5000";

//global variables
messages_count = 0

URLS = {
    "send": SERVER_URL + ":" + SERVER_PORT + "/messages/send",
    "login": SERVER_URL + ":" + SERVER_PORT + "/login",
    "logout": SERVER_URL + ":" + SERVER_PORT + "/logout",
    "message": SERVER_URL + ":" + SERVER_PORT + "/messages/",
    "messages_count": SERVER_URL + ":" + SERVER_PORT + "/messages/count",
    "history": SERVER_URL + ":" + SERVER_PORT + "/history"
}

// interface functions
// send POST request
// pass complete callback function
function send_post(data, url, complete) {
    var future = $.ajax({
        type: "POST",
        url: url,
        data: data,
        contentType: 'application/json;charset=UTF-8'
    })
    future.complete(complete)
}

// send GET request
// complete: callback function
function send_get(url, complete) {
    var future = $.ajax({
        type: "GET",
        url: url,
        contentType: 'application/json;charset=UTF-8'
    })
    future.complete(complete)
}

// main functions
// load history to the chat window
function load_history() {
    complete = function (xhr, textStatus) {
        var lines = "";
        data = jQuery.parseJSON(xhr.responseText);
        for (var i = 0; i < data.length; i++ ) {
            lines = lines + data[i]['login'] + ": " + data[i]['message'] + "\n";
        }
        $("textarea#chat_area").val(lines);
    }
    send_get(URLS['history'], complete)
}

function load_messages_count() {
    complete = function (xhr, textStatus) {
        data = jQuery.parseJSON(xhr.responseText);
        console.log(messages_count)
        messages_count = data
    }
    send_get(URLS['messages_count'], complete)
}

function load_message() {
    complete = function (xhr, textStatus) {
        data = jQuery.parseJSON(xhr.responseText);
        console.log(data)
        //for (var i = 0; i < data.length; i++ ) {
        //    lines = lines + data[i]['login'] + ": " + data[i]['message'] + "\n";
        //}
        $("textarea#chat_area").val(lines);
    }
}

function login() {
    data = $("input#login_input").val();
    data = {
        "login": data
    }
    complete = function (xhr, textStatus) {
        if (xhr.status == 200) {
            $("div#login").modal("hide");
            load_messages_count();
            load_message();
        } else if (xhr.status == 403) {
            alert("Данное имя уже присутсвует в чате. Выберите другое")
        }
    }
    send_post(JSON.stringify(data), URLS['login'], complete)
}

function logout() {
    data = $("input#login_input").val();
    if(data){
        console.log(data);
        data = {
            "login": data
        };
        send_post(JSON.stringify(data), URLS["logout"])
    }
}

//all clicks here
function clicks() {
    $("button#send_msg").click(function () {
        data = $("input#chat_input").val();
        $("input#chat_input").val();
        var login = $("input#login_input").val();
        data = {
            "message": data,
            "login": login
        }
        send_post(JSON.stringify(data), URLS['send'])
    });

    $("button#send_login").click(function () {
        login()
    });

    $("button#send_logout").click(function () {
        logout()
        window.location.reload();
    });
}

// calls
$(document).ready(function () {
    // bind all clicks
    clicks()
    // load all history
    load_history()
    $('textarea#chat_area').scrollTop($('textarea#chat_area')[0].scrollHeight);
    $("#login").modal("show")
});
