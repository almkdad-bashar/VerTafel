package com.vertafel.backend.controllers;

import com.vertafel.backend.payload.request.AddAvailableNumbersRequest;
import com.vertafel.backend.payload.request.AddCurrentNumRequest;
import com.vertafel.backend.payload.request.BasicRequest;
import com.vertafel.backend.services.QRCodeService;
import com.vertafel.backend.services.ReservationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/reservation")
public class ReservationController {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ReservationService reservationService;

    @Autowired
    private QRCodeService qrCodeService;

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    @PostMapping("/foo")
    public void foo() {
        logger.debug("This is a debug message");
        logger.info("This is an info message");
        logger.warn("This is a warn message");
        logger.error("This is an error message");
    }

    @PostMapping("/fetchAllByDate")
    public ResponseEntity<Object> fetchAllReservationByDate(@Valid @RequestBody BasicRequest request) {
        try {
            String date = request.getDate();
            var result = reservationService.getReservationByDate(date);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception exp) {
            return new ResponseEntity<Object>("unexpected failure", HttpStatus.EXPECTATION_FAILED);
        }
    }


    @PostMapping("/reserveOnTheFly")
//    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> reserveOnTheFlyByEmail(@RequestBody AddAvailableNumbersRequest request) {
        try {
//          give a number if there is still numbers.
//          if not, give him message, if wants the list to extend.
//            Integer totalNumber = request.getTotalNumber();
//            String date = request.getDate();
//            return reservationService.setAvailableNum(date, totalNumber);
//            if(numbersExist()){
//                fetchInfoByEmail();
//                return reservationService.book(username, email, qrKey, id, date);
//            }else if(extend == true){
//                reservationService.setAvailableNum(date, totalNumber);
//                fetchInfoByEmail();
//                return reservationService.book(username, email, qrKey, id, date);
//            }else{
//                return new ResponseEntity<Object>("No more numbers left.", HttpStatus.EXPECTATION_FAILED);
//            }
            return new ResponseEntity<>("Hello, World", HttpStatus.ACCEPTED);
        } catch (Exception exp) {
            return new ResponseEntity<Object>("unexpected failure", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/setAvailableNum")
//    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> setAvailableNum(@RequestBody AddAvailableNumbersRequest request) {
        try {
            Integer totalNumber = request.getTotalNumber();
            String date = request.getDate();
            return reservationService.setAvailableNum(date, totalNumber);
        } catch (Exception exp) {
            return new ResponseEntity<Object>("unexpected failure", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/getCurrentNum")
    public ResponseEntity<Map<String,Object>> getCurrentNum(@Valid @RequestBody BasicRequest basicRequest) {
        try {
            String date = basicRequest.getDate();
            return reservationService.getCurrentNum(date);
        } catch (Exception exp) {
            return new ResponseEntity<>(new HashMap<String,Object>(){{put("error","error in backend");}},
                    HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/setCurrentNum")
    public ResponseEntity<Map<String,Object>> setCurrentNum(@RequestBody AddCurrentNumRequest request) {
        try {
            String date = request.getDate();
            Integer number = request.getCurrentNumber();
            return reservationService.setCurrentNum(date, number);
        } catch (Exception exp) {
            return new ResponseEntity<>(new HashMap<String,Object>(){{put("error","error in backend");}},
                    HttpStatus.EXPECTATION_FAILED);
        }
    }


    @PostMapping("/getDisabledDate")
    public ResponseEntity<Object> getDisabledDate(@Valid @RequestBody BasicRequest basicRequest) throws Exception {
        try {
            String userId = basicRequest.getJwtResponse().getId();
            Set<String> result = reservationService.getProhibitedDatesByUserId(userId);
            return new ResponseEntity<Object>(result, HttpStatus.OK);
        } catch (Exception exp) {
            return new ResponseEntity<Object>("unexpected failure", HttpStatus.EXPECTATION_FAILED);
        }
    }


    @PostMapping("/book")
//    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> book(@Valid @RequestBody BasicRequest basicRequest) {
        try {
            String username = basicRequest.getJwtResponse().getUsername();
            String email = basicRequest.getJwtResponse().getEmail();
            int fiveDigitNumber = 10000 + new Random().nextInt(90000);
            String qrKey = email + fiveDigitNumber;
            String id = basicRequest.getJwtResponse().getId();
            String date = basicRequest.getDate();
            return reservationService.book(username, email, qrKey, id, date);
        } catch (Exception exp) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/getResDateList")
    public ResponseEntity<Map<String, Object>> getResDateList(@Valid @RequestBody BasicRequest basicRequest) {
        try {
            String date = basicRequest.getDate();
            String id = basicRequest.getJwtResponse().getId();
            return reservationService.getResDateList(date,id);
        } catch (Exception exp) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/peekQrCode")
    public ResponseEntity<byte[]> peekQrCode(@Valid @RequestBody BasicRequest basicRequest) {
        try {
            String date = basicRequest.getDate();
            String id = basicRequest.getJwtResponse().getId();
            String qrcode = String.valueOf(reservationService.peekQrCode(date,id));
            byte[] qrCodeImage = qrCodeService.generateQRCodeImage(qrcode);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(qrCodeImage, headers, HttpStatus.OK);
        } catch (Exception exp) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/peekNumber")
    public ResponseEntity<Map<String, Object>> peekNumber(@Valid @RequestBody BasicRequest basicRequest) {
        try {
            String date = basicRequest.getDate();
            String id = basicRequest.getJwtResponse().getId();
            return reservationService.peekNumber(date,id);
        } catch (Exception exp) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/deleteReservation")
//    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String,Object>> deleteReservation(@Valid @RequestBody BasicRequest basicRequest) {
        try {
            String username = basicRequest.getJwtResponse().getUsername();
            String email = basicRequest.getJwtResponse().getEmail();
            String id = basicRequest.getJwtResponse().getId();
            String date = basicRequest.getDate();
            return reservationService.deleteReservation(username, email, id, date);
        } catch (Exception exp) {
            return new ResponseEntity<>(new HashMap<String,Object>(){{put("message","error in backend");}},
                    HttpStatus.BAD_REQUEST);
        }
    }
}
