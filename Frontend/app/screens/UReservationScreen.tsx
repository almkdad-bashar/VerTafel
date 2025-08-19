import React, { useState } from 'react';
import { Alert, ScrollView, View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import { parseISO, format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import alert from '../utils/Alert';
import { _URL } from '../Config';
import { book } from '../services/ReservationService';


export default function Reservation() {
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const { token, jwtResponse } = useAuth();
    const reserve = async () => {
        if (jwtResponse != null && token != null)
            setResponse(await book(selectedStartDate, jwtResponse, token));
    }


    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Header />
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.body}>
                        <Text style={styles.heading}>RESERVIERUNG</Text>
                        <Calendar
                            minDate={moment().format('YYYY-MM-DD')}
                            maxDate={moment().add(14, 'days').format('YYYY-MM-DD')}
                            onDayPress={(day: DateObject) => setSelectedStartDate(day.dateString)}
                            markedDates={selectedStartDate ? { [selectedStartDate]: { selected: true, selectedColor: '#161634' } } : {}}
                        />
                        <Button onPress={reserve} text={'Buchen'} scale={1} />
                    </View>
                </ScrollView>
                <Footer index={2} />
            </View>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    body: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 32,
        alignSelf: 'center',
        fontWeight: 'bold',
    }
});
