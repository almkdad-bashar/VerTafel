// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, View, Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native';

// Define the prop types
interface Button {
    text: string;
    scale: number;
    onPress: (event: GestureResponderEvent) => void;
}

const Button: React.FC<Button> = ({ text, scale, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.reservieren, { transform: [{ scale }] }]}>
            <Text style={[styles.button, { fontSize: scale * 16 }]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};


export default Button;

const styles = StyleSheet.create({
    reservieren: {
        alignItems: 'center',
        marginTop: 50,
        width: '100%',
    },
    button: {
        color: '#161634',
        paddingHorizontal: 50,
        paddingVertical: 20,
        borderWidth: 2,
        fontSize: 20,
        borderColor: '#161634',
        fontWeight: '300',
        borderRadius: 20,
    }
});
