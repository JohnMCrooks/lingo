package com.theironyard.entities;

import java.util.Arrays;

/**
 * Created by johncrooks on 8/2/16.
 */
public class YandexJson {
    int code;
    String lang;
    String text[];

    public YandexJson(int code, String lang, String[] text) {
        this.code = code;
        this.lang = lang;
        this.text = text;
    }

    public YandexJson() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String[] getText() {
        return text;
    }

    public void setText(String[] text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return Arrays.toString(text);
    }
}
