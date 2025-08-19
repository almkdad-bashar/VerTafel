import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import { Link, router, useRouter } from 'expo-router';
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

export default function UProfileScreen() {
    const { signOut } = useAuth();
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Header />
                <View style={styles.body}>
                    <Button text={'Benutzer Information'} scale={1} onPress={() => router.replace('screens/UUserInformationScreen')}></Button>
                    <Button text={'Ändern das Passwort'} scale={1} onPress={() => router.replace('screens/UChangePasswordScreen')}></Button>
                    <Button text={'Verlängern Tafel Ausweis'} scale={1} onPress={() => router.replace('screens/UExtendTafelIDScreen')}></Button>
                    <Button text={'Abmelden'} scale={1} onPress={signOut}></Button>
                </View>
            </ScrollView>
            <Footer index={3} />
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
