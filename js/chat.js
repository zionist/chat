// conf
SERVER_URL = "http://127.0.0.1";
SERVER_PORT = "5000";

URLS = {
    "send": SERVER_URL + ":" + SERVER_PORT + "/messages/send",
    "login": SERVER_URL + ":" + SERVER_PORT + "/login",
    "logout": SERVER_URL + ":" + SERVER_PORT + "/logout",
    "message": SERVER_URL + ":" + SERVER_PORT + "/messages/",
    "messages_count": SERVER_URL + ":" + SERVER_PORT + "/messages/count",
    "history": SERVER_URL + ":" + SERVER_PORT + "/history"
}

// global variables
var messages_count = 0;

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

function send_post2(data, url, success, error) {
    var future = $.ajax({
        type: "POST",
        url: url,
        data: data,
        contentType: 'application/json;charset=UTF-8'
    })
    future.success(success)
    future.error(error)
}

// send GET request
// complete: callback function
function send_get(url, complete, async) {
    if (async) {
        async = true
    }
    else {
        async = false
    }
    var future = $.ajax({
        type: "GET",
        url: url,
        async: async,
        contentType: 'application/json;charset=UTF-8'
    })
    future.complete(complete)
}

function send_get2(url, success, error) {
    var future = $.ajax({
        type: "GET",
        url: url,
        contentType: 'application/json;charset=UTF-8'
    })
    future.success(success)
    future.error(error)
}

// main functions
// load history to the chat window
function load_history() {
    var complete = function (xhr, textStatus) {
        var lines = "";
        data = jQuery.parseJSON(xhr.responseText);
        for (var i = 0; i < data.length; i++ ) {
            lines = lines + data[i]['login'] + ": " + data[i]['message'] + "\n";
        }
        $("textarea#chat_area").val(lines);
    }
    send_get(URLS['history'], complete);
}

function load_messages_count() {
    var complete = function (xhr, textStatus) {
        messages_count = xhr.responseText;
    }
    // sync call
    send_get(URLS['messages_count'], complete, false);
}

// load all messages older than max num
function load_messages() {
    var date = new Date()
    console.log("load messages " + date.getMinutes() + ":" + date.getSeconds());
    var success = function (data) {
        if(data) {
            var lines = $("textarea#chat_area").val();
            data = jQuery.parseJSON(data);
            console.log("####");
            console.log(data);
            for (var i = 0; i < data.length; i++ ) {
                lines = lines + data[i]['login'] + ": " + data[i]['message'] + "\n";
            }
            $("textarea#chat_area").val(lines);
            $('textarea#chat_area').scrollTop($('textarea#chat_area')[0].scrollHeight);
        };
        // recurcieve call
        load_messages();
    }
    //sync call
    load_messages_count();
    url = URLS['message'] + messages_count;
    send_get2(url, success);
}

function login() {
    data = $("input#login_input").val();
    data = {
        "login": data
    }
    var success = function (data) {
        $("div#login").modal("hide");
        load_messages();
    }
    var error = function (data) {
        alert("Данное имя уже присутсвует в чате. Выберите другое")
    }
    send_post2(JSON.stringify(data), URLS['login'], success, error)
}

function logout() {
    data = $("input#login_input").val();
    if(data){
        data = {
            "login": data
        };
        send_post(JSON.stringify(data), URLS["logout"])
    }
}

function send_message() {
    data = $("input#chat_input").val();
    var login = $("input#login_input").val();
    data = {
        "message": data,
        "login": login
    }
    send_post(JSON.stringify(data), URLS['send'])
}

//all clicks here
function clicks() {
    $("button#send_msg").click(function () {
        send_message()
        $("input#chat_input").val("");
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
    clicks();
    // load all history
    load_history();
    load_messages_count();
    $('textarea#chat_area').scrollTop($('textarea#chat_area')[0].scrollHeight);
    $("#login").modal("show");
});
