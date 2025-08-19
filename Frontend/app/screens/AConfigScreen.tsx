import React, { useState } from 'react';
import { Platform, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import alert from '../utils/Alert';
import { Calendar, DateObject } from 'react-native-calendars';
import moment from 'moment';
import { format, parseISO } from 'date-fns';
import { _URL } from '../Config';
import AFooter from '../components/AFooter';
import { setAvailableNumber } from '../services/ReservationService';

const AConfigScreen = () => {
    const [number, setNumber] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState<boolean>(false);
    const [mode, setMode] = useState<'date' | 'time'>('date'); // Added mode state
    const [response, setResponse] = useState<string>('');
    const { token, jwtResponse } = useAuth();

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios'); // Keep picker visible on iOS
        setDate(currentDate);
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setMode(currentMode);
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const setAvailableNumberBtn = async () => {
        if (jwtResponse == null || token == null) {
            alert('Error', 'There is an authentication error');
            return;
        }
        setResponse(await setAvailableNumber(selectedDate, jwtResponse, token, number));
    }

    return (
        <View style={styles.container}>
            <Header />
            <Text>Enter Available Number</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Calendar
                    minDate={moment().format('YYYY-MM-DD')}
                    maxDate={moment().add(14, 'days').format('YYYY-MM-DD')}
                    onDayPress={(day: DateObject) => setSelectedDate(day.dateString)}
                    markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#161634' } } : {}}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Enter The Available Number'
                    onChangeText={(x) => setNumber(x)}
                    value={number}
                />
                <Button onPress={setAvailableNumberBtn} text="Submit" scale={0.9} />
            </ScrollView>
            <AFooter index={2} />
        </View>
    );
};

export default AConfigScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 20,
        marginHorizontal: 50,
        opacity: 0.5,
    },
    datePickerContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});
