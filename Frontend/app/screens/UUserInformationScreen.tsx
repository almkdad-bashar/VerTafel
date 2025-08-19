import { Image, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { getUserInfo } from '../services/ProfileService';
import { useAuth } from '../contexts/AuthContext';
import alert from '../utils/Alert';
import { UserData } from '../utils/Interfaces';
import { router } from 'expo-router';

const UUserInformationScreen: React.FC = () => {
    const { token, jwtResponse } = useAuth();
    const [data, setData] = useState<UserData | null>(null);

    useEffect(() => {
        getPersonalInformation();
    }, [token, jwtResponse]);

    const getPersonalInformation = async () => {
        if (token == null || jwtResponse == null) {
            alert('error', 'missing authentication information');
            return;
        }

        try {
            const _data = await getUserInfo(token, jwtResponse);
            setData(_data);
        } catch (error) {
            alert('error', 'Failed to fetch user information');
            console.error(error);
        }
    };

    return (
        <GestureHandlerRootView>
            <Header />
            <ScrollView>
                <View style={{ flex: 1, padding: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Vorname: </Text>
                        <Text style={styles.text}>{data?.firstname}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Nachname: </Text>
                        <Text style={styles.text}>{data?.lastname}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>E-Mail: </Text>
                        <Text style={styles.text}>{data?.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Geburtsdatum: </Text>
                        <Text style={styles.text}>{data?.birthDate}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Anzahl der aufgewachsenen: </Text>
                        <Text style={styles.text}>{data?.adultNumber}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Anzahl der Kinder: </Text>
                        <Text style={styles.text}>{data?.childrenNumber}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Gültigkeit bis: </Text>
                        <Text style={styles.text}>{data?.expiryDate}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('screens/UProfileScreen')}>
                            <Text>Zurück</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Footer index={3} />
        </GestureHandlerRootView>
    );
};

export default UUserInformationScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 5,
    },
    label: {
        fontSize: 18,
        marginLeft: 20,
        marginTop: 10,
        fontWeight: '600'
    },
    text: {
        paddingTop: 3,
        fontSize: 14,
        marginTop: 10,
    },
    backButton: {
        fontFamily: 'Verdana',
        fontSize: 20,
        borderWidth: 2,
        padding: 10,
        borderRadius: 35,
        marginTop: '5%',
        marginRight: '10%'
    }
});

