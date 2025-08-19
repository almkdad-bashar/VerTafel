import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
            </View>
            <Text style={styles.title}>Verdener Tafel</Text>
        </View>

    )
}

export default Header

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
    signout: {
        fontSize: 12,
        color: 'white',
        flex: 1, // Ensure title takes up the remaining space
    }
});
