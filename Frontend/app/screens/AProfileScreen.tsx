import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Calendar, DateObject } from 'react-native-calendars';
import moment from 'moment';
import axios, { AxiosError } from 'axios';
import { parseISO, format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { _URL } from '../Config';
import { useAuth } from '../contexts/AuthContext';
import alert from '../utils/Alert';
import AFooter from '../components/AFooter';

interface ResponseData {
    message: string;
}

interface ResponseCurrentNum {
    number: number;
}

interface Data {
    date: string;
    jwtResponse: {
        id: string;
        username: string;
        email: string;
        roles: string[];
        accessToken: string;
        tokenType: string;
    };
}

export default function AProfileScreen() {
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const { signOut } = useAuth();
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Header />
                <View style={styles.body}>
                    <Button text={'Change Password'} scale={1} onPress={function (event: GestureResponderEvent): void {
                        throw new Error('Function not implemented.');
                    }}></Button>
                    <Button text={'Change Number of Adults'} scale={1} onPress={function (event: GestureResponderEvent): void {
                        throw new Error('Function not implemented.');
                    }}></Button>
                    <Button text={'Change Number of Children'} scale={1} onPress={function (event: GestureResponderEvent): void {
                        throw new Error('Function not implemented.');
                    }}></Button>
                    <Button text={'Upload Proof'} scale={1} onPress={function (event: GestureResponderEvent): void {
                        throw new Error('Function not implemented.');
                    }}></Button>
                    <Button text={'Log Out'} scale={1} onPress={signOut}></Button>
                </View>
            </ScrollView>
            <AFooter index={3} />
        </View>
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
    }
});
