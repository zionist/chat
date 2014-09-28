package common;

import java.util.HashMap;
import java.util.Map;

public final class Constants {

    public static final Map<String, String> headers = new HashMap<String, String>();

    static {
       headers.put("Access-Control-Allow-Origin", "*");
       headers.put("Access-Control-Allow-iOrigin", "*");
       headers.put("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
       headers.put("Access-Control-Max-Age", "100");
       headers.put("Access-Control-Allow-Credentials", "true");
       headers.put("Access-Control-Allow-Headers", "origin, x-csrftoken, content-type, accept");
    }
}
