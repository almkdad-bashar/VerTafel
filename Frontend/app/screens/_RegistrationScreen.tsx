import React from 'react';
import { ScrollView, TextInput, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';

export default function Login() {
    const [username, setUsername] = React.useState('');
    const [firstname, setFirstname] = React.useState('');
    const [lastname, setLastname] = React.useState('');
    const [adultNumber, setAdultNumber] = React.useState();
    const [childrenNumber, setChildrenNumber] = React.useState();
    const [expiryDate, setExpiryDate] = React.useState('');
    const [birthDate, setBirthDate] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const submit = () => {
        console.log(username, password);
        router.replace('/Login_Confirmation');
    }

    const login = () => {
        console.log(username, password);
        router.replace('/');
    }

    return (
        <ScrollView>
            <Header></Header>
            <View style={styles.body}>
                <View style={{
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-around'

                }}>
                    <Text>Benutzername:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(x) => setUsername(x)}
                    />
                    <Text>Password:</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        onChangeText={(x) => setPassword(x)}
                    />
                    <Text>Wiederholte Password:</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        onChangeText={(x) => setPassword(x)}
                    />
                    <Text>Email Addresse:</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        onChangeText={(x) => setPassword(x)}
                    />
                    <View style={styles.footer}>
                        <Text style={{ flexWrap: 'wrap' }}>Haben Sie schon ein Verderer Tafel Konto?
                            <Pressable onPress={login}><Text style={styles.registrieren}> Hier Anmelden.</Text></Pressable>
                        </Text>
                    </View>
                    <Pressable onPress={submit}><Text style={styles.signin}>Konto Erstellen</Text></Pressable>

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
        width: '90%',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,

    },
    signin: {
        color: 'white',
        backgroundColor: '#161634',
        fontSize: 20,
        width: '30%',
        alignSelf: 'center',
        textAlign: 'center',
        borderWidth: 3,
        padding: 10,
        margin: 5,
    },
    body: {
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
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
