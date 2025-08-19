package com.vertafel.backend.utils;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class UtilHelper {
    public static String read(String path) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(path)));
            return content;
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

}
