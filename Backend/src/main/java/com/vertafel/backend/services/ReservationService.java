package com.vertafel.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.vertafel.backend.models.*;
import com.vertafel.backend.utils.Constants;
import com.vertafel.backend.utils.UtilHelper;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;

import javax.print.Doc;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

public class ReservationService {
    @Autowired
    MongoTemplate mongoTemplate;

    //    @Scheduled(cron = "0 0 9 * * MON-FRI")
//    todo:: parse the cron dynamically from config
//    for testing run every 3minutes @Scheduled(cron = "0 0/3 * * * ?")
    public void greeting() {
//        System.out.println("Hello, Bashar");
//        todo:: get all users for today. gives them numbers.
//        store the numbers on db
    }

    @Scheduled(cron = "0 0 9 * * MON-FRI")
    public void reservationReminder() {
//   fetch all members who has reservations on the that day.
//        get their numbers
//        send the number on sms with their qrcode.

    }
    public void insertNumber(String date, Integer number) {
        if (number == 0) {
            return;
        }
        Query query = new Query();
        query.addCriteria(Criteria.where("date").is(date));
        AvailableNumber availableNumber = mongoTemplate.findOne(query, AvailableNumber.class);
        availableNumber.getNumbers().add(number);
        Update update = new Update();
        update.addToSet("numbers", number);
        mongoTemplate.updateFirst(query, update, AvailableNumber.class);
    }


    public String calcEstimateWaitTime(String resDate, String startTime, List<Integer> usedNumbers, Integer myNumber) throws Exception {
        Configuration config = new Gson().fromJson(UtilHelper.read(Constants.CONFIG_PATH), Configuration.class);
        long waitingUnit = config.getWaitingUnit();
        if (!usedNumbers.contains(myNumber)) {
            throw new Exception("the given number is not in the used numbers");
        }
        long minutesToAdd = usedNumbers.indexOf(myNumber);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        try {
            LocalDateTime dateTime = LocalDateTime.parse(resDate.trim() + " " + startTime.trim(), formatter);
            LocalDateTime newDateTime = dateTime.plusMinutes(minutesToAdd * waitingUnit);
            String formattedDateTime = newDateTime.format(formatter);
            return formattedDateTime;
        } catch (DateTimeParseException e) {
            System.out.println("Invalid date-time format: " + e.getMessage());
            return e.getMessage();
        }
    }

    public Integer getNumber(String date) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("date").is(date));
            AvailableNumber availableNumber = mongoTemplate.findOne(query, AvailableNumber.class);
            ;
            List<Integer> restNums = removeFromList(createListWithMaxNum(availableNumber.getTotalNumber()),
                    availableNumber.getNumbers());
            if (restNums.isEmpty()) {
                return 0;
            }
            Random random = new Random();
            int index = random.nextInt(restNums.size());
            Integer number = restNums.get(index);
            return number;
        } catch (Exception exp) {
            System.out.println(exp);
            return -1;
        }
    }

    private List<Integer> createListWithMaxNum(Integer maxNum) {
        List<Integer> result = new ArrayList<>();
        for (int i = 1; i <= maxNum; i++) {
            result.add(i);
        }
        return result;
    }

    private List<Integer> removeFromList(List<Integer> originalList, List<Integer> deletedItems) {
        List<Integer> result = new ArrayList<>(originalList);
        for (Integer item : deletedItems) {
            Optional<Integer> foundItem = result.stream().filter(item2 -> item.equals(item2)).findFirst();
            foundItem.ifPresent(result::remove);
        }
        return result;
    }

    private Map<String, Pair<Integer, Boolean>> getDateRepeatMap(String userId) throws Exception {
        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("userId").is(new ObjectId(userId)));
        Reservation res = mongoTemplate.findOne(userQuery, Reservation.class);
        Map<String, Pair<Integer, Boolean>> map = new HashMap<>();
        for (var resDate : res.getReservationDateList()) {
            String visitedDate = resDate.getDate();
            if (map.containsKey(visitedDate)) {
                throw new Exception("User came twice at the same day");
            } else {
                map.put(visitedDate, Pair.of(1, true));
            }
        }
        for (var resDate : res.getReservationDateList()) {
            String visitedDate = resDate.getDate();
            List<String> weekDays = calcProhibitedDates(visitedDate, true);
            for (var day : weekDays) {
                if (map.containsKey(day)) {
                    map.put(day, Pair.of(map.get(day).getFirst() + 1, map.get(day).getSecond()));
                } else {
                    map.put(day, Pair.of(1, false));
                }
            }
        }
        return map;
    }

    public Set<String> getProhibitedDatesByUserId(String userId) throws Exception {
        Map<String, Pair<Integer, Boolean>> map = getDateRepeatMap(userId);
        Configuration config = new Gson().fromJson(UtilHelper.read(Constants.CONFIG_PATH), Configuration.class);
        Integer repeatAWeek = config.getRepeatsAWeek();
        Set<String> result = map.entrySet().stream()
                .filter(entry -> entry.getValue().getFirst() >= repeatAWeek || entry.getValue().getSecond() == true)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
        return result;
    }

    private List<String> calcProhibitedDates(String inputDate, boolean excludeInput) {
        List<String> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_FORMAT);
        LocalDate date = LocalDate.parse(inputDate, formatter);
        LocalDate startOfWeek = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = startOfWeek.plusDays(i);
            result.add(currentDay.format(formatter));
        }
        if (excludeInput) {
            result.removeIf(e -> e.equals(inputDate));
        }
        return result;
    }

    public List<Document> getReservationByDate(String date) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.unwind("reservationDateList", false),
                Aggregation.match(Criteria.where("reservationDateList.date").is(date)),
                Aggregation.lookup("Users", "userId", "_id", "user"),
                Aggregation.sort(Sort.by(Sort.Order.asc("reservationDateList.number")))
        );
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "Reservations", Document.class);
        return results.getMappedResults();
    }

    public ResponseEntity<Object> setAvailableNum(String date, Integer totalNumber) {
        AvailableNumber availableNumber = new AvailableNumber();
        availableNumber.setDate(date);
        Query query = new Query();
        query.addCriteria(Criteria.where("date").is(date));
        AvailableNumber AvaliableNumObj = mongoTemplate.findOne(query, AvailableNumber.class);
        if (AvaliableNumObj == null) {
            AvailableNumber obj = new AvailableNumber();
            obj.setTotalNumber(totalNumber);
            obj.setDate(date);
            obj.setNumbers(new ArrayList<>());
            mongoTemplate.insert(obj);
            return new ResponseEntity<Object>("successfully added", HttpStatus.OK);
        } else {
            Update update = new Update();
            update.set("totalNumber", totalNumber);
            mongoTemplate.updateFirst(query, update, AvailableNumber.class);
            return new ResponseEntity<Object>("update successfully", HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<Map<String,Object>> getCurrentNum(String date) {
        Query query = new Query();
        query.addCriteria(Criteria.where("date").is(date));
        CurrentNumber currentNum = mongoTemplate.findOne(query, CurrentNumber.class);
        HashMap result = new HashMap<String,Object>();
        if (currentNum == null) {
            result.put("currentNum", 0);
            CurrentNumber cn = new CurrentNumber(date, 0);
            mongoTemplate.insert(cn);
        } else {
            result.put("currentNum", currentNum.getNumber());
        }
        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    public ResponseEntity<Map<String,Object>> setCurrentNum(String date, Integer number) {
        Map<String, Object> result = new HashMap<>();
        Query query = new Query();
        query.addCriteria(Criteria.where("date").is(date));
        CurrentNumber cn = mongoTemplate.findOne(query, CurrentNumber.class);

        if(cn == null){
            CurrentNumber newCN = new CurrentNumber(date,number);
            mongoTemplate.save(newCN);
            result.put("ok","current number has being inserted");
        }else {
            Update update = new Update();
            update.set("number", number);
            mongoTemplate.upsert(query, update, CurrentNumber.class);
            result.put("ok","current number has being updated");
        }
        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }


    public ResponseEntity<Map<String, Object>> book( String username, String email, String qrKey, String id, String date) throws Exception {

        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("username").is(username)
                .and("email").is(email).and("_id").is(new ObjectId(id)));
        User user = mongoTemplate.findOne(userQuery, User.class);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Query reservationQuery = new Query();
        reservationQuery.addCriteria(Criteria.where("userId").is(user.getId()));
        Reservation res = mongoTemplate.findOne(reservationQuery, Reservation.class);

        Integer number = getNumber(date);
        if (number == -1) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "The Admin has not set the available numbers");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        if (res == null) {
            mongoTemplate.insert(new Reservation(user.getId(), Arrays.asList(new ReservationDate(date, number, qrKey))));
        } else {
            Set<String> disabledDates = getProhibitedDatesByUserId(id);
            if (disabledDates.contains(date)) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "You've used the Tafel already this week");
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }

            res.getReservationDateList().add(new ReservationDate(date, number, qrKey));
            Update update = new Update();
            update.set("reservationDateList", res.getReservationDateList());
            mongoTemplate.updateFirst(reservationQuery, update, Reservation.class);
        }

        insertNumber(date, number);

        Map<String, Object> result = new HashMap<>();
        result.put("date", date);
        result.put("number", number);
        result.put("disabledDates", getProhibitedDatesByUserId(id));
        result.put("qrcode", qrKey);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    private void removeNumber(String date, Integer number){
        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("date").is(date));
        AvailableNumber item = mongoTemplate.findOne(userQuery, AvailableNumber.class);
        item.getNumbers().removeIf(_item -> _item.equals(number));
        Update update = new Update();
        update.set("numbers", item.getNumbers());
        mongoTemplate.updateFirst(userQuery, update, AvailableNumber.class);
    }

    private boolean isResDeletable(String strDate) throws Exception {
        Configuration config = new Gson().fromJson(UtilHelper.read(Constants.CONFIG_PATH), Configuration.class);
        String deleteResDeadline = config.getDeleteReservationDeadline();
        String[] parts = deleteResDeadline.split(":");
        int hour = Integer.parseInt(parts[0]);
        int minute = Integer.parseInt(parts[1]);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        LocalDate strLocalDate;
        try {
            strLocalDate = LocalDate.parse(strDate, dateFormatter);
        } catch (DateTimeParseException e) {
            throw new Exception("Invalid date format, should be dd.MM.yyyy");
        }

        LocalDate today = LocalDate.now();

        if (strLocalDate.isAfter(today)) {
            return true;
        } else if (strLocalDate.isEqual(today)) {
            LocalTime deadlineTime = LocalTime.of(hour, minute);
            LocalTime currentTime = LocalTime.now();

            if (currentTime.isBefore(deadlineTime)) {
                return true;
            }
        }
        return false;
    }
    public ResponseEntity<Map<String,Object>> deleteReservation(String username, String email, String id, String date) throws Exception{
        Map<String, Object> response = new HashMap<>();
        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("username").is(username)
                .and("email").is(email).and("_id").is(new ObjectId(id)));
        User user = mongoTemplate.findOne(userQuery, User.class);
        Query reservationQuery = new Query();
        reservationQuery.addCriteria(Criteria.where("userId").is(user.getId()));
        Reservation res = mongoTemplate.findOne(reservationQuery, Reservation.class);
        Optional<ReservationDate> resDate = res
                .getReservationDateList()
                .stream()
                .filter(entry -> entry.getDate().equals(date))
                .findFirst();

        if(!isResDeletable(resDate.get().getDate())){
            response.put("message", "It's too late, you can't delete reservation");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        removeNumber(date,resDate.get().getNumber());
        res.getReservationDateList().removeIf(entry -> entry.getDate().equals(date));
        Update update = new Update();
        update.set("reservationDateList", res.getReservationDateList());
        mongoTemplate.updateFirst(reservationQuery, update, Reservation.class);
        response.put("message","The reservation has being succesfully deleted");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    public String peekQrCode(String date, String id) throws Exception {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(new ObjectId(id)));
        Reservation res = mongoTemplate.findOne(query, Reservation.class);

        if(res == null){
            throw new Exception("reservation is not found");
        }

        String qrcode = res.getReservationDateList()
                .stream()
                .filter(e -> e.getDate().equals(date))
                .findFirst()
                .get()
                .getQrKey();

        return qrcode;
    }

    public ResponseEntity<Map<String, Object>> peekNumber(String date, String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(new ObjectId(id)));
        Reservation res = mongoTemplate.findOne(query, Reservation.class);

        if(res == null){
            Map<String, Object> response = new HashMap<>();
            response.put("error", "reservation is not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
        }

        Integer number = res.getReservationDateList()
                .stream()
                .filter(e -> e.getDate().equals(date))
                .findFirst()
                .get()
                .getNumber();

        Map<String, Object> response = new HashMap<>();
        response.put("number", number);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, Object>> getResDateList(String date, String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(new ObjectId(id)));
        Reservation res = mongoTemplate.findOne(query, Reservation.class);

        if (res == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "reservation is not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        LocalDate inputDate = LocalDate.parse(date, formatter);

        List<ReservationDate> reservationDateList = res.getReservationDateList()
                .stream()
                .filter(e -> {
                    LocalDate entryDate = LocalDate.parse(e.getDate(), formatter);
                    return !entryDate.isBefore(inputDate); // Filters out dates before the input date
                })
                .collect(Collectors.toList());

        List<String> dateList = reservationDateList.stream()
                .map(ReservationDate::getDate)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("dateList", dateList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

