import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface Definition {
    word: string,
    meaning: string
}

const Definition: React.FC<Definition> = ({ word, meaning }) => {
    return (
        <View style={styles.elementBox}>
            <Text style={styles.heading}>{word}</Text>
            <Text style={styles.valueing}>{meaning}</Text>
        </View>
    )
}

export default Definition

const styles = StyleSheet.create({
    elementBox: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    valueing: {
        fontSize: 16,
        marginLeft: 9,
    },
    reservieren: {
        alignItems: 'center',
        marginTop: 50,
        width: '100%',
    },
});
