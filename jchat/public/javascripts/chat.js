// conf
//SERVER_URL = "http://127.0.0.1";
//SERVER_PORT = "5000";

URLS = {
    "send": "/send",
    "login": "/login",
    "logout": "/logout",
    // needs last known message num
    "message": "/messages/",
    "messages_count": "/count",
    "history": "/history"
}

// global variables
var messages_count = 0;

// interface functions
// send POST request
// pass callback functions
function send_post(data, url, success, error, async) {
    var future = $.ajax({
        type: "POST",
        url: url,
        async: async,
        data: data,
        contentType: 'application/json;charset=UTF-8'
    })
    future.success(success);
    future.error(error);
}

function send_post_sync(data, url, success, error) {
    send_post(data, url, success, error, false);
}

function send_post_async(data, url, success, error) {
    send_post(data, url, success, error, true);
}

// send GET request
// pass callback functions
function send_get(url, success, error, async) {
    var future = $.ajax({
        type: "GET",
        url: url,
        async: async,
        contentType: 'application/json;charset=UTF-8'
    })
    future.success(success);
    future.error(error);

}

function send_get_sync(url, success, error) {
    send_get(url, success, error, false)
}

function send_get_async(url, success, error) {
    send_get(url, success, error, true)
}

// main functions
// load history to the chat window
function load_history() {
    var success = function(data) {
        var lines = "";
        data = jQuery.parseJSON(data);
        for (var i = 0; i < data.length; i++ ) {
            lines = lines + data[i]['login'] + ": " + data[i]['message'] + "\n";
        }
        $("textarea#chat_area").val(lines);
    }
    send_get_async(URLS['history'], success);
}

function load_messages_count() {
    var success = function (data) {
        messages_count = data;
    }
    send_get_sync(URLS['messages_count'], success);
}

// load all messages older than messages_count
function load_messages() {
    var success = function (data) {
        if(data) {
            var lines = $("textarea#chat_area").val();
            data = jQuery.parseJSON(data);
            messages_count = parseInt(messages_count) + parseInt(data.length);
            for (var i = 0; i < data.length; i++ ) {
                lines = lines + data[i]['login'] + ": " + data[i]['message'] + "\n";
            }
            $("textarea#chat_area").val(lines);
            $('textarea#chat_area').scrollTop($('textarea#chat_area')[0].scrollHeight);
        };
        // recurcieve call
        load_messages();
    }
    // load_messages_count();
    url = URLS['message'] + messages_count;
    send_get_async(url, success);
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
    send_post_async(JSON.stringify(data), URLS['login'], success, error)
}

function logout() {
    data = $("input#login_input").val();
    if(data){
        data = {
            "login": data
        };
        $('textarea#chat_area').scrollTop($('textarea#chat_area')[0].scrollHeight);
        send_post_sync(JSON.stringify(data), URLS["logout"])
    }
}

function send_message() {
    data = $("input#chat_input").val();
    var login = $("input#login_input").val();
    data = {
        "message": data,
        "login": login
    }
    send_post_async(JSON.stringify(data), URLS['send'])
}

//all clicks here
function clicks() {
    $("button#send_msg").click(function () {
        if ($("input#chat_input").val()) {
            send_message()
        }
        $("input#chat_input").val("");
    });

    $("button#send_login").click(function () {
        login()
    });

    $("button#send_logout").click(function () {
        logout();
        window.location.reload();
    });
    // catch enter press on chat window
    $('input#chat_input').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
        if ($("input#chat_input").val()) {
            send_message()
        }
        $("input#chat_input").val("");
    }
});
}

// calls
$(document).ready(function () {
    // bind all clicks
    clicks();
    // load all history
    load_history();
    // start point for messages_count
    load_messages_count();
    // scroll text area window down
    $('textarea#chat_area').scrollTop($('textarea#chat_area')[0].scrollHeight);
    // show login form
    $("#login").modal("show");
});
