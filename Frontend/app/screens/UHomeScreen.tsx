import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import moment from 'moment';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Definition from '../components/Definition';
import { useAuth } from '../contexts/AuthContext';
import alert from '../utils/Alert';
import { deleteReservation, getCurrentNum, getResDateList, peekNumber, peekQrCode } from '../services/ReservationService';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Reservation() {
    const { token, jwtResponse } = useAuth();
    const [currentNum, setCurrentNum] = useState<number>(-1);
    const [myNumber, setMyNumber] = useState<number>(-1);
    const [resDateList, setResDateList] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [estimateWaitingTime, setEstimateWaitingTime] = useState<Date | null>(null);
    const date = moment().format('DD.MM.YYYY');

    const fetchCurrentNum = async () => {
        if (!jwtResponse || !token) {
            alert("error", "missing entries");
            return;
        }
        try {
            const _currentNum = await getCurrentNum(date, jwtResponse, token);
            const _myNumber = await peekNumber(date, jwtResponse, token);
            const qrCodeImageUrl = await peekQrCode(date, jwtResponse, token);
            const _resDateList = await getResDateList(date, jwtResponse, token);
            setCurrentNum(_currentNum);
            setMyNumber(_myNumber);
            setResDateList(_resDateList);
            setImageUrl(qrCodeImageUrl);
        } catch (error) {
            console.error('Error fetching current number:', error);
        }
    };

    useEffect(() => {
        fetchCurrentNum();
    }, [jwtResponse, token]);

    const cancelReservation = async (date: string) => {
        if (!jwtResponse || !token) {
            alert("error", "missing entries");
            return;
        }
        try {
            const result: string = await deleteReservation(date, jwtResponse, token);
            alert('successful', result);
            fetchCurrentNum();
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    }

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Header />
                    <View style={styles.body}>
                        <View style={styles.upperContainer}>
                            <Definition word={'Reservation Date:'} meaning={date} />
                            <Definition word={'Current Numbers:'} meaning={currentNum.toString()} />
                            {myNumber !== -1 && (
                                <Definition word="Your Numbers:" meaning={myNumber.toString()} />
                            )}
                            {myNumber !== -1 && (
                                <View style={styles.qrCodeContainer}>
                                    <Definition word="Your QrCode:" meaning={""} />
                                    {imageUrl ? (
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={styles.qrCodeImage}
                                            resizeMode="contain" // Adjust resizing
                                        />
                                    ) : (
                                        <Text>No QR Code Available</Text>
                                    )}
                                </View>
                            )}
                            {estimateWaitingTime && (
                                <Definition word={'Estimation Waiting Time:'} meaning={'8 hours and 12 mins'} />
                            )}
                        </View>
                        <View style={styles.reservationListContainer}>
                            <Text style={styles.heading}>Reservation List:</Text>
                            {resDateList.map((item, i) => (
                                <View key={i} style={styles.reservationItem}>
                                    <Text>{item}</Text>
                                    <Pressable onPress={() => cancelReservation(item)}>
                                        <Text style={styles.resListItem}>Cancel</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                <Footer index={1} />
            </View>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    upperContainer: {
        paddingBottom: 10,
        width: '100%',
        borderBottomWidth: 2,
    },
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
        alignItems: 'flex-start',
        padding: 20,
        width: '100%',
    },
    qrCodeContainer: {
        alignItems: 'center',
    },
    qrCodeImage: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resListItem: {
        color: '#161634',
        paddingHorizontal: 50,
        paddingVertical: 15,
        fontSize: 12,
        borderColor: '#161634',
        borderWidth: 2,
        fontWeight: '500',
        borderRadius: 20,
    },
    reservationListContainer: {
        paddingTop: 10,
        width: "100%",
    },
    reservationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        borderBottomWidth: 2,
        paddingBottom: 15,
        opacity: 0.85,
        borderStyle: 'dashed',
    },
});
