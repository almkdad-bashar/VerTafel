import { View, Text } from 'react-native'
import React from 'react'
import MFooter from '../components/MFooter'
import Header from '../components/Header'

const MReservationScreen = () => {
    return (
        <>
            <Header />
            <View style={{ flex: 1 }}>
                <Text>MReservationScreen</Text>
                {/* <QRCodeScanner></QRCodeScanner> */}
            </View>
            <MFooter index={2} />
        </>
    )
}

export default MReservationScreen   