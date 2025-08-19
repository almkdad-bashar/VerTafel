import { Image, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import Counter from 'react-native-counters';
import Header from '../components/Header';
import Footer from '../components/Footer';
import alert from '../utils/Alert';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { ExtendTafelIdData } from '../utils/Interfaces';
import { extendTafelId } from '../services/ProfileService';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const UExtendTafelIDScreen: React.FC = () => {
    const [adultNumber, setAdultNumber] = useState<number>(0);
    const [childrenNumber, setChildrenNumber] = useState<number>(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { jwtResponse, token } = useAuth();

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
        await extendTafelId(selectedFile, adultNumber, childrenNumber, token, jwtResponse);
    };

    const back = () => {
        router.replace('screens/UProfileScreen');
    };

    return (
        <GestureHandlerRootView>
            <Header />
            <ScrollView>
                <View style={{ flex: 1, padding: 5 }}>
                    <Text style={styles.title}>Antrag auf Verlängerung des Tafel Ausweis</Text>
                    <Text style={styles.label}>Laden Sie Ihren Beweis hoch (e.g: BaföG)</Text>
                    {selectedFile && (
                        <Text style={styles.filePath}>{selectedFile.name}</Text>
                    )}
                    <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                        <Text>Datei hochladen</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Geben Sie die Anzahl der aufgewachsenen Mitglieder in Ihrer Familie an</Text>
                    <View style={styles.inputContainer}>
                        <Counter
                            buttonStyle={{
                                borderColor: '#333',
                                borderWidth: 2,
                                borderRadius: 25,
                            }}
                            buttonTextStyle={{
                                color: '#333',
                            }}
                            countTextStyle={{
                                color: '#333',
                            }}
                            start={adultNumber}
                            onChange={(x: number) => setAdultNumber(x)}
                        />
                    </View>
                    <Text style={styles.label}>Geben Sie die Anzahl der Kinder in Ihrer Familie an</Text>
                    <View style={styles.inputContainer}>
                        <Counter
                            buttonStyle={{
                                borderColor: '#333',
                                borderWidth: 2,
                                borderRadius: 25,
                            }}
                            buttonTextStyle={{
                                color: '#333',
                            }}
                            countTextStyle={{
                                color: '#333',
                            }}
                            start={childrenNumber}
                            onChange={(x: number) => setChildrenNumber(x)}
                        />
                    </View>
                    <View style={styles.button_container}>
                        <TouchableOpacity style={styles.button} onPress={submit}>
                            <Text>Antrag Absenden</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={back}>
                            <Text>Zurück</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
            <Footer index={3} />
        </GestureHandlerRootView>
    );
};

export default UExtendTafelIDScreen;

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
