import { Image, StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import alert from '../utils/Alert';
import { router } from 'expo-router';
import { changePassword } from '../services/ProfileService';
import { useAuth } from '../contexts/AuthContext';

const UChangePasswordScreen = () => {
    const [oldPasswordShow, setOldPasswordShow] = useState<boolean>(true);
    const [newPasswordShow, setNewPasswordShow] = useState<boolean>(true);
    const [repeatedPasswordShow, setRepeatedPasswordShow] = useState<boolean>(true);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');
    const { jwtResponse, token } = useAuth();

    const save = async () => {
        if (jwtResponse == null || token == null) {
            alert('error', 'missing authentication arguments');
            return;
        }

        if (newPassword.trim() == "") {
            alert('error', 'Please, enter new password!');
            return;
        }

        if (newPassword.trim() !== repeatedPassword.trim()) {
            alert('error', 'new password and repeated new password are not the same');
            return;
        }

        const response = await changePassword(oldPassword.trim(), newPassword.trim(), jwtResponse, token);
        alert('message', response);
    };

    const back = () => {
        router.replace('screens/UProfileScreen');
    };

    return (
        <GestureHandlerRootView>
            <Header />
            <ScrollView>
                <View style={{ flex: 1, padding: 5 }}>
                    <Text style={styles.title}>Ändern das Passwort</Text>
                    <Text style={styles.label}>Geben Sie das alte Passwort ein</Text>
                    <View style={styles.inputContainer}>
                        <TextInput secureTextEntry={oldPasswordShow} style={styles.text_input} onChangeText={(x) => setOldPassword(x)} />
                        <Pressable onPress={() => setOldPasswordShow(!oldPasswordShow)}>
                            <Image source={oldPasswordShow ? require('../assets/show_password.png') : require('../assets/hide_password.png')} style={styles.icon} />
                        </Pressable>
                    </View>
                    <Text style={styles.label}>Geben Sie das neue Passwort ein</Text>
                    <View style={styles.inputContainer}>
                        <TextInput secureTextEntry={newPasswordShow} style={styles.text_input} onChangeText={(x) => setNewPassword(x)} />
                        <Pressable onPress={() => setNewPasswordShow(!newPasswordShow)}>
                            <Image source={newPasswordShow ? require('../assets/show_password.png') : require('../assets/hide_password.png')} style={styles.icon} />
                        </Pressable>
                    </View>
                    <Text style={styles.label}>Wiederholen Sie das neue Passwort</Text>
                    <View style={styles.inputContainer}>
                        <TextInput secureTextEntry={repeatedPasswordShow} style={styles.text_input} onChangeText={(x) => setRepeatedPassword(x)} />
                        <Pressable onPress={() => setRepeatedPasswordShow(!repeatedPasswordShow)}>
                            <Image source={repeatedPasswordShow ? require('../assets/show_password.png') : require('../assets/hide_password.png')} style={styles.icon} />
                        </Pressable>
                    </View>
                    <View style={styles.button_container}>
                        <TouchableOpacity style={styles.button} onPress={save}>
                            <Text>Speichern</Text>
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

export default UChangePasswordScreen;

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
});
