import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import MFooter from '../components/MFooter';
import Header from '../components/Header';
import { setCurrentNum } from '../services/ReservationService';
import * as DocumentPicker from 'expo-document-picker';
import Alert from '../utils/Alert';
import moment from 'moment';
import alert from '../utils/Alert';
import { vertifyQrCode } from '../services/ProfileService';

const MQRCodeScreen = () => {
    const [number, setNumber] = useState<number>(0);
    const { token, jwtResponse } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const pickDocument = async () => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf,image/jpeg,image/png';
            input.onchange = async (event: any) => {
                const file = event.target.files[0];
                setSelectedFile(file);
            };
            input.click();
        } else {
            let result: any = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf,image/jpeg,image/png',
                copyToCacheDirectory: true,
            });

            if (result.type === 'success') {
                setSelectedFile(result);
            }
        }
    };

    const submit = async () => {
        if (token == null || jwtResponse == null) {
            alert('error', 'Authentication error.');
            return;
        }
        if (selectedFile == null) {
            alert('error', 'Please upload a file.');
            return;
        }
        console.log(selectedFile);
        console.log(token);
        console.log(jwtResponse);
        const response = await vertifyQrCode(selectedFile, token, jwtResponse);
        alert("message", response.message);
    };

    async function pushNumber() {
        if (jwtResponse == null || token == null) {
            Alert("error", "Missing entries");
            return;
        }
        try {
            await setCurrentNum(moment().format('DD.MM.YYYY'), jwtResponse, token, number);
        } catch (error) {
            console.error('Error fetching current number:', error);
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Header />
            <ScrollView>
                <Text>Add Current Number: {moment().format('DD.MM.YYYY')}</Text>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', height: 50, margin: 5 }}>
                        <TextInput
                            value={number.toString()}
                            onChangeText={(text) => {
                                const parsedNumber = parseInt(text);
                                if (isNaN(parsedNumber)) {
                                    setNumber(0);
                                } else {
                                    setNumber(parsedNumber);
                                }
                            }}
                            style={{ flex: 1, borderColor: 'gray', borderWidth: 1, padding: 5 }}
                            keyboardType="numeric"
                        />
                        <Pressable
                            onPress={pushNumber}
                            style={{ padding: 10, backgroundColor: '#161634', borderRadius: 5, marginHorizontal: 5 }}
                        >
                            <Text style={{ color: 'white' }}>Submit</Text>
                        </Pressable>
                    </View>
                    <View>
                        <Text style={styles.label}>Laden Sie di QrCode hoch</Text>
                        {selectedFile && (
                            <Text style={styles.filePath}>{selectedFile.name}</Text>
                        )}
                        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                            <Text>Datei hochladen</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button_container}>
                        <TouchableOpacity style={styles.button} onPress={submit}>
                            <Text>Vertify QrCode</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <MFooter index={1} />
        </GestureHandlerRootView>
    );
};

export default MQRCodeScreen;


const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 5,
    },
    label: {
        fontSize: 18,
        marginLeft: 20,
        marginTop: 10,
    },
    text_input: {
        borderWidth: 1,
        marginLeft: 20,
        margin: 5,
        padding: 5,
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    button_container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
    },
    button: {
        fontFamily: 'Verdana',
        fontSize: 20,
        borderWidth: 2,
        padding: 10,
        borderRadius: 35,
    },
    uploadButton: {
        backgroundColor: '#ddd',
        padding: 10,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    filePath: {
        marginLeft: 20,
        marginTop: 5,
        fontStyle: 'italic',
    },
});
