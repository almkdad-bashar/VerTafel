package com.vertafel.backend.services;

import com.vertafel.backend.models.ReservationDate;
import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.vertafel.backend.models.Reservation;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.Arrays;


@ExtendWith(MockitoExtension.class)
public class ReservationServiceTest {


    void setUp() {
    }


    @org.junit.Test
    public void calcEstimateWaitTime() throws Exception {
        ReservationService reservationService = new ReservationService();
        System.out.println(reservationService.
                calcEstimateWaitTime("22.08.2024",
                        "11:00",
                        new ArrayList<>(Arrays.asList(1, 2, 3, 5, 8)),
                        3));
    }


//    @Test
//    public void isResDeletable() throws Exception {
//        ReservationService reservationService = new ReservationService();
//        Assert.assertEquals(true,reservationService.isResDeletable("27.07.2024"));
//        Assert.assertEquals(false,reservationService.isResDeletable("25.07.2024"));
//        Assert.assertEquals(false,reservationService.isResDeletable("12.07.2024"));
//    }
}