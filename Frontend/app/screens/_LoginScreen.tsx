import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput, View, Image, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import alert from '../utils/Alert';

export default function _LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { signIn, token, jwtResponse } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signIn(username, password);
        } catch (e) {
            setError('Login failed. Please check your credentials.');
        }
    };

    useEffect(() => {
        if (jwtResponse) {
            console.log(jwtResponse);
            if (jwtResponse.roles.includes("ROLE_USER")) {
                router.replace('screens/UReservationScreen');
            } else if (jwtResponse.roles.includes("ROLE_MODERATOR")) {
                router.replace('screens/MQRCodeScreen');
            } else if (jwtResponse.roles.includes("ROLE_ADMIN")) {
                router.replace('screens/AConfigScreen');
            } else {
                alert("Error", "Error in formatting");
            }
        }
    }, [jwtResponse]);

    const register = () => {
        console.log(username, password);
        router.replace('/screens/_RegistrationScreen');
    };

    return (
        <ScrollView>
            <Header />
            <View style={styles.body}>
                <View style={styles.container}>
                    <Text>Benutzername:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(x) => setUsername(x)}
                    />
                    <Text>Password:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            secureTextEntry={passwordShow}
                            style={styles.inputPassword}
                            onChangeText={(x) => setPassword(x)}
                        />
                        <Pressable onPress={() => setPasswordShow(!passwordShow)}>
                            <Image
                                source={passwordShow ? require('../assets/show_password.png') : require('../assets/hide_password.png')}
                                style={styles.icon}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.footer}>
                        <Text>Kein Verderer Tafel Konto? </Text>
                        <Pressable onPress={register}>
                            <Text style={styles.registrieren}>Hier registrieren.</Text>
                        </Pressable>
                    </View>
                    <Pressable onPress={handleLogin}>
                        <Text style={styles.signin}>Anmelden</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#161634',
        flexDirection: 'row',
        alignItems: 'center', // Ensure vertical centering
        padding: 15,
        paddingTop: 50,
    },
    logoContainer: {
        width: 50, // Adjust width to fit your logo
        height: 50, // Adjust height to fit your logo
        marginRight: 10, // Space between logo and title
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // Ensure logo fits within container
    },
    title: {
        fontSize: 24,
        color: 'white',
        flex: 1, // Ensure title takes up the remaining space
    },
    input: {
        width: '100%',
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    },
    inputPassword: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    signin: {
        color: 'white',
        backgroundColor: '#161634',
        fontSize: 20,
        width: '50%',
        alignSelf: 'center',
        textAlign: 'center',
        borderWidth: 3,
        paddingVertical: 10,
        paddingHorizontal: 5,
        margin: 0,
    },
    body: {
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    footer: {
        margin: 25,
        flexDirection: 'row',
    },
    registrieren: {
        color: '#161634',
        borderBottomColor: '#161634',
        borderBottomWidth: 2,
        paddingBottom: 2,
    }
});
