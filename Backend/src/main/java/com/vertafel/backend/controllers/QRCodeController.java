package com.vertafel.backend.controllers;

import com.google.zxing.NotFoundException;
import com.vertafel.backend.models.Reservation;
import com.vertafel.backend.models.ReservationDate;
import com.vertafel.backend.models.User;
import com.vertafel.backend.payload.request.GenerateQRCodeRequest;
import com.vertafel.backend.payload.response.JwtResponse;
import com.vertafel.backend.services.QRCodeService;
import com.vertafel.backend.services.ReservationService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/qrcode")
public class QRCodeController {

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private QRCodeService qrCodeService;
    @PostMapping(value = "/generate", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQRCode(@RequestBody GenerateQRCodeRequest request) {
        try {
//            todo: check if qrkey belongs to user before printing it
            byte[] qrCodeImage = qrCodeService.generateQRCodeImage(request.getQrkey());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(qrCodeImage, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/verifyQrCode")
    public ResponseEntity<Map<String, Object>> verifyQRCode(@RequestParam(value = "date", required = false) String date,
//                                                            @RequestParam(value = "jwtResponse") JwtResponse jwtResponse,
                                                            @RequestParam(value = "file") MultipartFile file) {
        try {
            // Read the QR code from the uploaded file
            byte[] imageBytes = file.getBytes();
            String resultText = qrCodeService.verifyQRCode(imageBytes);

            // Fetch reservations for the given date
            List<Document> resList = reservationService.getReservationByDate(date);

            // Iterate through each reservation document
            for (Document res : resList) {
                // Extract the list of ReservationDate from the document
                Document reservationDates = res.get("reservationDateList", Document.class);
                // Check each reservation date entry
                    String _qrcode = reservationDates.getString("qrKey");
                    Integer _number = reservationDates.getInteger("number");
                    if (_qrcode.equals(resultText)) {
                        // If QR key matches, update the current number
                        reservationService.setCurrentNum(date, _number);

                        // Prepare the response
                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "current number is " + _number);
                        return new ResponseEntity<>(response, HttpStatus.OK);
                    }
            }

            // If no match is found, return a not found message
            return new ResponseEntity<>(Map.of("message", "QRCode is not correct"), HttpStatus.OK);

        } catch (IOException e) {
            // Handle IO exceptions
            return new ResponseEntity<>(Map.of("message", "Error processing QR code", "error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (NotFoundException e) {
            // Handle QR code not found exceptions
            return new ResponseEntity<>(Map.of("message", "QR code not found", "error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }


}
