// conf
SERVER_URL = "http://127.0.0.1";
SERVER_PORT = "5000";
URLS = {
    "send": "/send",
    "login": "/login",
    "logout": "/logout"
}


// functions
// send POST request
// success and fails are callback functions
function send_post(data, url, complete) {
    console.log(url);
    console.log(data);
    var future = $.ajax({
        type: "POST",
        url: url,
        data: data,
        contentType: 'application/json;charset=UTF-8'
    })
    // future.success(success)
    // future.error(error)
    future.complete(complete)
}

function clicks() {
    // callback function

    $("button#send_msg").click(function () {
        data = $("input#chat_input").val();
        console.log(data)
        data = {
            "message": data
        }
        url = SERVER_URL + ":" + SERVER_PORT + URLS['send']
        send_post(JSON.stringify(data), url)
        // alert( "Handler for .click() called." );
    });

    $("button#send_login").click(function () {
        data = $("input#login_input").val();
        console.log(data)
        data = {
            "login": data
        }
        // do login
        url = SERVER_URL + ":" + SERVER_PORT + URLS['login']
        complete = function (xhr, textStatus) {
            if (xhr.status == 200) {
                $("div#login").modal("hide")
            } else if (xhr.status == 403) {
                alert("Данное имя уже присутсвует в чате. Выберите другое")
            }
        }
        send_post(JSON.stringify(data), url, complete)
    });

    $("button#send_logout").click(function () {
        data = $("input#login_input").val();
        console.log(data)
        data = {
            "login": data
        }
        // do logout
        url = SERVER_URL + ":" + SERVER_PORT + URLS['logout']
        complete = function (xhr, textStatus) {
            window.location.reload();
        }
        send_post(JSON.stringify(data), url, complete)
    });
}


// calls
$(document).ready(function () {
    clicks()
    $("#login").modal("show")
});
