package com.myapp;

import androidx.annotation.NonNull;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import android.widget.Button;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.bridge.ReactContext;

public class DPButtonManager extends SimpleViewManager<Button> {
    public static final String REACT_CLASS = "DPButton";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected Button createViewInstance(@NonNull ThemedReactContext reactContext) {
        Button button = new Button(reactContext);
        button.setOnClickListener(v -> {
            ReactContext context = (ReactContext) v.getContext();
            context.getJSModule(RCTEventEmitter.class).receiveEvent(
                button.getId(),
                "topPress",
                null
            );
            context.getJSModule(RCTEventEmitter.class).receiveEvent(
                button.getId(),
                "topClick",
                null
            );
        });
        return button;
    }

    // title
    @ReactProp(name = "title")
    public void setTitle(Button view, String title) {
        view.setText(title);
    }

    // text color
    @ReactProp(name = "color")
    public void setColor(Button view, String color) {
        try {
            view.setTextColor(
                color != null ? android.graphics.Color.parseColor(color) : android.graphics.Color.parseColor("#000000")
            );
        } catch (Exception e) {
            view.setTextColor(android.graphics.Color.parseColor("#000000"));
        }
    }

    // disabled
    @ReactProp(name = "disabled")
    public void setDisabled(Button view, boolean disabled) {
        view.setEnabled(!disabled);
    }

    // background color
    @ReactProp(name = "backgroundColor")
    public void setBackgroundColor(Button view, String backgroundColor) {
        try {
            view.setBackgroundColor(
                backgroundColor != null ? android.graphics.Color.parseColor(backgroundColor) : android.graphics.Color.parseColor("#bbbbbb")
            );
        } catch (Exception e) {
            view.setBackgroundColor(android.graphics.Color.parseColor("#bbbbbb"));
        }
    }

} 