package com.vertafel.backend.controllers;

import com.vertafel.backend.payload.request.SendMessageRequest;
import com.vertafel.backend.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/message")
public class MessageController {
    @Autowired
    private MessageService messageService;
    @PostMapping("/send")
    public void sendMessage(@RequestBody SendMessageRequest request) {
        request.getRecipients()
                .stream()
                .forEach(recipient -> messageService
                        .sendMessage(recipient,request.getSubject(), request.getContent()));
    }
}
