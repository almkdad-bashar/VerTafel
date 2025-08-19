import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

interface HighlightIndex {
    index: number;
}

interface FooterStyling {
    style: any;
    img: any;
}

function getFooterStyling(index: number, currentIndex: number, selectedImg: string, defaultImg: string): FooterStyling {
    if (index === currentIndex) {
        return { style: styles.footerButtonBoxSelected, img: selectedImg };
    }
    return { style: styles.footerButtonBox, img: defaultImg };
}

const Footer: React.FC<HighlightIndex> = ({ index }) => {
    const homeStyling = getFooterStyling(index, 1, require('../assets/home_white.png'), require('../assets/home_darkblue.png'));
    const reservationStyling = getFooterStyling(index, 2, require('../assets/calendar_white.png'), require('../assets/calendar_darkblue.png'));
    const profileStyling = getFooterStyling(index, 3, require('../assets/profile_white.png'), require('../assets/profile_darkblue.png'));

    return (
        <View style={styles.footer}>
            <View style={homeStyling.style}>
                <Link href="/screens/AScanScreen" style={styles.imgContainer}>
                    <Image style={styles.footerImg} source={homeStyling.img} />
                </Link>
            </View>
            <View style={reservationStyling.style}>
                <Link href="/screens/AConfigScreen" style={styles.imgContainer}>
                    <Image style={styles.footerImg} source={reservationStyling.img} />
                </Link>
            </View>
            <View style={profileStyling.style}>
                <Link href="/screens/AProfileScreen" style={styles.imgContainer}>
                    <Image style={styles.footerImg} source={profileStyling.img} />
                </Link>
            </View>
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    footer: {
        borderTopWidth: 3,
        height: 100,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerButtonBoxSelected: {
        height: '100%',
        backgroundColor: '#161634',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerButtonBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerImg: {
        width: 30,
        height: 30,
    },
    imgContainer: {
        flex: 1,
        alignSelf: 'center',
        paddingHorizontal: 24,
    },
});
