package common;

import java.util.HashMap;
import java.util.Map;

public final class Constants {

    public static final Map<String, String> HEADERS = new HashMap<String, String>();

    // Wait timeout for send message pause in seconds
    public static final Integer WAIT_TIMEOUT = 60;

    static {
       HEADERS.put("Access-Control-Allow-Origin", "*");
       HEADERS.put("Access-Control-Allow-iOrigin", "*");
       HEADERS.put("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
       HEADERS.put("Access-Control-Max-Age", "100");
       HEADERS.put("Access-Control-Allow-Credentials", "true");
       HEADERS.put("Access-Control-Allow-Headers", "origin, x-csrftoken, content-type, accept");
    }
}
